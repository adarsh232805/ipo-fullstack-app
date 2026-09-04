import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* GET ALL USERS */
router.get("/", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

/* UPDATE KYC STATUS */
router.put("/:id/kyc", protect, adminOnly, async (req, res) => {
  const { kycStatus } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { kycStatus },
    { new: true }
  );
  res.json(user);
});

export default router;
