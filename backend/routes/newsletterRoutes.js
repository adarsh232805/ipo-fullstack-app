import express from "express";
import Newsletter from "../models/Newsletter.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    await Newsletter.create({ email });
    res.json({ message: "Subscribed successfully" });
  } catch (err) {
    if (err.code === 11000) {
      return res.json({ message: "Already subscribed" });
    }
    res.status(500).json({ message: "Subscription failed" });
  }
});

export default router;
