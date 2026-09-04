import express from "express";
import Alert from "../models/Alert.js";
import { protect } from "../middleware/authMiddleware.js";

import mongoose from "mongoose";

const router = express.Router();

/* ======================================
   GET USER ALERTS
   GET /api/alerts
   ====================================== */
router.get("/", protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const alerts = await Alert.find({
        user: req.user._id
      })
        .populate({
          path: "ipo",
          select: "company gmp"
        })
        .sort({ createdAt: -1 });

      return res.json(alerts);
    }
    res.json([]);
  } catch (err) {
    res.json([]);
  }
});

/* ======================================
   MARK ALERT AS SEEN
   PUT /api/alerts/:id/seen
   ====================================== */
router.put("/:id/seen", protect, async (req, res) => {
  try {
    await Alert.findByIdAndUpdate(req.params.id, {
      seen: true
    });

    res.json({ message: "Alert marked as seen" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update alert" });
  }
});

export default router;
