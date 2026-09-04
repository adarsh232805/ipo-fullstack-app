import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import Ipo from "../models/Ipo.js";
import UserActivity from "../models/UserActivity.js";
import { protect } from "../middleware/authMiddleware.js";
import { inMemoryStore } from "../utils/inMemoryStore.js";
import { fallbackIpos } from "./ipoRoutes.js";

const router = express.Router();

/* ======================================================
   📥 GET USER WATCHLIST
   GET /api/watchlist
   Note: If unauthenticated, returns [] without throwing 401
====================================================== */
router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json([]);
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret");
    } catch {
      return res.json([]);
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findById(decoded.id).populate("watchlist");
        if (user) return res.json(user.watchlist || []);
      } catch (e) {}
    }

    // In-memory fallback
    const user = inMemoryStore.getUserById(decoded.id);
    if (!user) return res.json([]);

    const ipoIds = user.watchlist || [];
    const populated = fallbackIpos.filter(i => ipoIds.includes(i._id));
    res.json(populated);
  } catch (err) {
    console.error("Fetch watchlist error:", err);
    res.json([]);
  }
});

/* ======================================================
   ➕ ADD IPO TO WATCHLIST
   POST /api/watchlist/:ipoId
====================================================== */
router.post("/:ipoId", protect, async (req, res) => {
  try {
    const ipoId = req.params.ipoId;

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findById(req.user._id);
        if (user && !user.watchlist.includes(ipoId)) {
          user.watchlist.push(ipoId);
          await user.save();

          const ipo = await Ipo.findById(ipoId);
          try {
            await UserActivity.create({
              user: user._id,
              action: "WATCHLIST_ADDED",
              description: `Added IPO to watchlist: ${ipo?.companyName || "IPO"}`,
              performedBy: "user"
            });
          } catch (e) {}
        }
        return res.json({ message: "IPO added to watchlist" });
      } catch (e) {}
    }

    inMemoryStore.addToWatchlist(req.user._id, ipoId);
    res.json({ message: "IPO added to watchlist" });
  } catch (err) {
    console.error("Add watchlist error:", err);
    res.status(500).json({ message: "Failed to add watchlist" });
  }
});

/* ======================================================
   ❌ REMOVE IPO FROM WATCHLIST
   DELETE /api/watchlist/:ipoId
====================================================== */
router.delete("/:ipoId", protect, async (req, res) => {
  try {
    const ipoId = req.params.ipoId;

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findById(req.user._id);
        if (user) {
          user.watchlist = user.watchlist.filter(id => id.toString() !== ipoId);
          await user.save();

          const ipo = await Ipo.findById(ipoId);
          try {
            await UserActivity.create({
              user: user._id,
              action: "WATCHLIST_REMOVED",
              description: `Removed IPO from watchlist: ${ipo?.companyName || "IPO"}`,
              performedBy: "user"
            });
          } catch (e) {}
        }
        return res.json({ message: "IPO removed from watchlist" });
      } catch (e) {}
    }

    inMemoryStore.removeFromWatchlist(req.user._id, ipoId);
    res.json({ message: "IPO removed from watchlist" });
  } catch (err) {
    console.error("Remove watchlist error:", err);
    res.status(500).json({ message: "Failed to remove watchlist" });
  }
});

export default router;

