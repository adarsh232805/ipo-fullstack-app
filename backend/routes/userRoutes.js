import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/watchlist/:id", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user.watchlist.includes(req.params.id)) {
    user.watchlist.push(req.params.id);
    await user.save();
  }
  res.json(user.watchlist);
});

router.get("/watchlist", auth, async (req, res) => {
  const user = await User.findById(req.user.id).populate("watchlist");
  res.json(user.watchlist);
});

export default router;
