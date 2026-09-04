import Ipo from "../models/Ipo.js";
import User from "../models/User.js";
import UserActivity from "../models/UserActivity.js";

/* ================= APPLY IPO ================= */
export const applyIpo = async (req, res) => {
  try {
    const userId = req.user.id;
    const ipoId = req.params.id;

    const ipo = await Ipo.findById(ipoId);
    if (!ipo) {
      return res.status(404).json({ message: "IPO not found" });
    }

    const user = await User.findById(userId);

    const alreadyApplied = user.appliedIpos.some(
      a => a.ipo.toString() === ipoId
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied" });
    }

    user.appliedIpos.push({
      ipo: ipoId,
      pan: user.profile?.pan || "NA"
    });

    await user.save();

    /* 🔔 ACTIVITY */
    await UserActivity.create({
      user: userId,
      action: "APPLIED_IPO",
      description: `Applied for IPO: ${ipo.companyName}`,
      performedBy: "user"
    });

    res.json({ success: true, message: "IPO applied successfully" });
  } catch (err) {
    console.error("Apply IPO error:", err);
    res.status(500).json({ message: "Failed to apply IPO" });
  }
};

/* ================= ADD TO WATCHLIST ================= */
export const addToWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const ipoId = req.params.id;

    const user = await User.findById(userId);
    if (user.watchlist.includes(ipoId)) {
      return res.status(400).json({ message: "Already in watchlist" });
    }

    user.watchlist.push(ipoId);
    await user.save();

    const ipo = await Ipo.findById(ipoId);

    await UserActivity.create({
      user: userId,
      action: "WATCHLIST_ADDED",
      description: `Added IPO to watchlist: ${ipo.companyName}`,
      performedBy: "user"
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Watchlist add error:", err);
    res.status(500).json({ message: "Failed to add watchlist" });
  }
};

/* ================= REMOVE FROM WATCHLIST ================= */
export const removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const ipoId = req.params.id;

    const user = await User.findById(userId);
    user.watchlist = user.watchlist.filter(
      id => id.toString() !== ipoId
    );

    await user.save();

    const ipo = await Ipo.findById(ipoId);

    await UserActivity.create({
      user: userId,
      action: "WATCHLIST_REMOVED",
      description: `Removed IPO from watchlist: ${ipo.companyName}`,
      performedBy: "user"
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Watchlist remove error:", err);
    res.status(500).json({ message: "Failed to remove watchlist" });
  }
};

/* ================= CHECK ALLOTMENT ================= */
export const checkAllotment = async (req, res) => {
  try {
    const userId = req.user.id;
    const ipoId = req.params.id;

    await UserActivity.create({
      user: userId,
      action: "ALLOTMENT_CHECKED",
      description: "Checked allotment status",
      performedBy: "user"
    });

    res.json({ success: true, status: "pending" });
  } catch (err) {
    res.status(500).json({ message: "Failed to check allotment" });
  }
};
