import mongoose from "mongoose";
import User from "../../models/User.js";
import Notification from "../../models/Notification.js";
import UserActivity from "../../models/UserActivity.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { inMemoryStore } from "../../utils/inMemoryStore.js";

/* ================= GET ALL USERS (SEARCH + FILTER + PAGINATION) ================= */
export const getAllUsers = async (req, res) => {
  try {
    const {
      search = "",
      kyc,
      blocked,
      page = 1,
      limit = 10
    } = req.query;

    if (mongoose.connection.readyState === 1) {
      try {
        const query = {};

        if (search) {
          query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
          ];
        }

        if (kyc) {
          query.kycStatus = kyc;
        }

        if (blocked === "true") query.isBlocked = true;
        if (blocked === "false") query.isBlocked = false;

        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
          User.find(query)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
          User.countDocuments(query)
        ]);

        if (users && users.length > 0) {
          return res.json({
            users,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            total
          });
        }
      } catch (dbErr) {
        console.warn("DB getAllUsers error, falling back to memory:", dbErr.message);
      }
    }

    // In-memory fallback
    let list = inMemoryStore.getAllUsers().map(u => {
      const { password, ...safe } = u;
      return safe;
    });

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
    }

    const total = list.length;
    const skip = (page - 1) * limit;
    const users = list.slice(skip, skip + Number(limit));

    res.json({
      users,
      page: Number(page),
      totalPages: Math.ceil(total / limit) || 1,
      total
    });
  } catch (err) {
    console.error("Admin get users error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/* ================= GET USER BY ID (WITH ACTIVITY) ================= */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("watchlist")
      .populate("appliedIpos.ipo");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const activities = await UserActivity.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ user, activities });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

/* ================= UPDATE KYC ================= */
export const updateKycStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["verified", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid KYC status" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.kycStatus = status;
    await user.save();

    await UserActivity.create({
      user: user._id,
      action: "KYC_UPDATED",
      description: `KYC status changed to ${status}`,
      performedBy: "admin"
    });

    await Notification.create({
      user: user._id,
      title: "KYC Update",
      message:
        status === "verified"
          ? "✅ Your KYC has been approved"
          : "⚠️ Your KYC is pending / rejected"
    });

    await sendEmail({
      to: user.email,
      subject: "KYC Status Update",
      html: `<p>Your KYC is now <b>${status.toUpperCase()}</b></p>`
    });

    res.json({ success: true, kycStatus: status });
  } catch (err) {
    res.status(500).json({ message: "Failed to update KYC" });
  }
};

/* ================= BLOCK / UNBLOCK ================= */
export const toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    await UserActivity.create({
      user: user._id,
      action: user.isBlocked ? "ACCOUNT_BLOCKED" : "ACCOUNT_UNBLOCKED",
      description: user.isBlocked
        ? "User account blocked by admin"
        : "User account unblocked by admin",
      performedBy: "admin"
    });

    res.json({ success: true, isBlocked: user.isBlocked });
  } catch {
    res.status(500).json({ message: "Failed to update block" });
  }
};

/* ================= EMAIL ================= */
export const sendUserEmail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await sendEmail({
      to: user.email,
      subject: req.body.subject,
      html: req.body.message
    });

    await UserActivity.create({
      user: user._id,
      action: "ADMIN_EMAIL",
      description: "Admin sent an email",
      performedBy: "admin"
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Email failed" });
  }
};

/* ================= NOTIFICATION ================= */
export const sendUserNotification = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await Notification.create({
      user: user._id,
      title: req.body.title,
      message: req.body.message
    });

    await UserActivity.create({
      user: user._id,
      action: "ADMIN_NOTIFICATION",
      description: req.body.title,
      performedBy: "admin"
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Notification failed" });
  }
};
