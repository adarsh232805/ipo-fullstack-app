import express from "express";
import mongoose from "mongoose";
import Ipo from "../models/Ipo.js";
import { iposData } from "../data/iposData.js";

const router = express.Router();

export const fallbackIpos = iposData;

// In-memory working copy allowing runtime mutations when DB is in fallback mode
let activeIposMemory = [...iposData];

/**
 * Helper to auto-seed MongoDB if empty
 */
async function autoSeedMongoIfEmpty() {
  if (mongoose.connection.readyState !== 1) return;
  try {
    const count = await Ipo.countDocuments();
    if (count < 20) {
      console.log(`🌱 MongoDB has ${count} IPOs. Auto-seeding 24 comprehensive IPOs...`);
      for (const item of iposData) {
        await Ipo.findOneAndUpdate(
          { _id: item._id },
          { $set: item },
          { upsert: true, new: true }
        );
      }
      console.log("✅ MongoDB successfully populated with 24 IPOs.");
    }
  } catch (err) {
    console.warn("⚠️ Auto-seed MongoDB skipped:", err.message);
  }
}

// Trigger check when Mongo connects
mongoose.connection.on("connected", () => {
  autoSeedMongoIfEmpty();
});

/* ======================================================
   GET ALL IPOs (WITH STATUS, BOARD, & SEARCH FILTERS)
   /api/ipos
   /api/ipos?status=open
   /api/ipos?status=closed
   /api/ipos?board=MAINBOARD
   ====================================================== */
router.get("/", async (req, res) => {
  try {
    const { status, board, search } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (status) filter.status = status;
      if (board && board !== "ALL") filter.board = board;
      if (search) {
        filter.companyName = { $regex: search, $options: "i" };
      }

      const count = await Ipo.countDocuments();
      if (count === 0) {
        await autoSeedMongoIfEmpty();
      }

      const ipos = await Ipo.find(filter).sort({ openDate: -1 });
      if (ipos && ipos.length > 0) {
        return res.status(200).json(ipos);
      }
    }

    // In-memory resilient fallback
    let results = [...activeIposMemory];

    if (status) {
      results = results.filter(i => i.status === status);
    }
    if (board && board !== "ALL") {
      results = results.filter(i => i.board === board);
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(i => i.companyName?.toLowerCase().includes(q));
    }

    return res.status(200).json(results);
  } catch (err) {
    let results = [...activeIposMemory];
    if (req.query?.status) {
      results = results.filter(i => i.status === req.query.status);
    }
    return res.status(200).json(results);
  }
});

/* ======================================================
   GET IPO BY ID
   /api/ipos/:id
   ====================================================== */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const ipo = await Ipo.findById(id);
      if (ipo) return res.status(200).json(ipo);
    }

    const found = activeIposMemory.find(i => i._id === id || i.companyName?.toLowerCase() === id.toLowerCase());
    if (found) return res.status(200).json(found);

    return res.status(404).json({ message: "IPO not found" });
  } catch (err) {
    const found = activeIposMemory.find(i => i._id === req.params.id);
    if (found) return res.status(200).json(found);
    res.status(400).json({ message: "Invalid IPO ID" });
  }
});

export default router;
