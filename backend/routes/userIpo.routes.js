import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import UserActivity from "../models/UserActivity.js";

const router = express.Router();

/* ================= APPLY IPO (EXISTING) ================= */
router.post("/apply/:ipoId", protect, async (req, res) => {
  res.json({ success: true });
});

/* ================= FETCH APPLIED IPOS ================= */
router.get("/applied", protect, async (req, res) => {
  res.json([]);
});

/* ================= NEW: CHECK ALLOTMENT ================= */
router.post("/allotment-check/:ipoId", protect, async (req, res) => {
  await UserActivity.create({
    user: req.user._id,
    action: "CHECKED_ALLOTMENT",
    description: "User checked IPO allotment",
    performedBy: "user"
  });

  res.json({ success: true });
});

export default router;
