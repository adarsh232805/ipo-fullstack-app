import express from "express";
import mongoose from "mongoose";
import FooterLink from "../models/FooterLink.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const links = await FooterLink.find().sort({ order: 1 });
      return res.json(links);
    }
    res.json([]);
  } catch (err) {
    res.json([]);
  }
});

export default router;
