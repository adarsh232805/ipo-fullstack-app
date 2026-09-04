import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* APPLY IPO */
router.post("/apply/:ipoId", protect, async (req, res) => {
  const { pan } = req.body;

  const user = await User.findById(req.user._id);

  user.appliedIpos.push({
    ipo: req.params.ipoId,
    pan,
    appliedDate: new Date()
  });

  await user.save();
  res.json({ message: "IPO applied successfully" });
});

/* GET APPLIED IPOs */
router.get("/applied", protect, async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("appliedIpos.ipo");

  res.json(user.appliedIpos);
});

export default router;
