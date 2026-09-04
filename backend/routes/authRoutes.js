import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import { inMemoryStore } from "../utils/inMemoryStore.js";

const router = express.Router();

/* ======================================================
   AUTH: SIGNUP
====================================================== */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const exists = await User.findOne({ email });
        if (exists) {
          return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          name,
          email,
          password: hashedPassword
        });

        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET || "default_jwt_secret",
          { expiresIn: "7d" }
        );

        return res.json({
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePhoto: user.profilePhoto
          }
        });
      } catch (dbErr) {
        console.warn("DB signup fallback to memory store:", dbErr.message);
      }
    }

    // In-memory fallback
    const existing = inMemoryStore.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = inMemoryStore.createUser({
      name,
      email,
      password: hashedPassword,
      role: "user"
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "default_jwt_secret",
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto
      }
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});

/* ======================================================
   AUTH: LOGIN
====================================================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({ email });
        if (user) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            const token = jwt.sign(
              { id: user._id, role: user.role },
              process.env.JWT_SECRET || "default_jwt_secret",
              { expiresIn: "7d" }
            );

            return res.json({
              token,
              user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePhoto: user.profilePhoto
              }
            });
          }
        }
      } catch (dbErr) {
        console.warn("DB login fallback to memory store:", dbErr.message);
      }
    }

    // In-memory fallback
    let user = inMemoryStore.getUserByEmail(email);
    if (!user) {
      // Auto-create user so user can test without barriers
      const hashedPassword = await bcrypt.hash(password, 10);
      user = inMemoryStore.createUser({
        name: email.split("@")[0],
        email,
        password: hashedPassword,
        role: "user"
      });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "default_jwt_secret",
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

/* ======================================================
   AUTH: GET CURRENT USER
====================================================== */
router.get("/me", protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findById(req.user._id)
          .populate("watchlist")
          .select("-password");
        if (user) return res.json(user);
      } catch (e) {}
    }

    const user = req.user;
    const safeUser = { ...user };
    delete safeUser.password;
    res.json(safeUser);
  } catch (err) {
    console.error("/me error:", err);
    res.status(500).json({ message: "Failed to load user" });
  }
});

/* ======================================================
   UPDATE PROFILE (INCLUDING PROFILE PHOTO URL)
====================================================== */
router.put("/profile", protect, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      pan,
      dob,
      notifyGmp,
      notifyEmail,
      profilePhoto
    } = req.body;

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findById(req.user._id);
        if (user) {
          if (name !== undefined) user.name = name;
          if (email !== undefined) user.email = email;
          if (!user.profile) user.profile = {};
          if (phone !== undefined) user.profile.phone = phone;
          if (pan !== undefined) user.profile.pan = pan;
          if (dob !== undefined) user.profile.dob = dob;
          if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;
          if (notifyGmp !== undefined) user.notifyGmp = notifyGmp;
          if (notifyEmail !== undefined) user.notifyEmail = notifyEmail;

          await user.save();
          const updatedUser = await User.findById(user._id).select("-password");
          return res.json(updatedUser);
        }
      } catch (e) {}
    }

    // In-memory fallback
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (profilePhoto !== undefined) updates.profilePhoto = profilePhoto;
    if (notifyGmp !== undefined) updates.notifyGmp = notifyGmp;
    if (notifyEmail !== undefined) updates.notifyEmail = notifyEmail;

    const user = inMemoryStore.getUserById(req.user._id);
    if (user) {
      if (!user.profile) user.profile = {};
      if (phone !== undefined) user.profile.phone = phone;
      if (pan !== undefined) user.profile.pan = pan;
      if (dob !== undefined) user.profile.dob = dob;
      inMemoryStore.updateUser(req.user._id, updates);

      const safe = { ...user };
      delete safe.password;
      return res.json(safe);
    }

    return res.status(404).json({ message: "User not found" });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
});

/* ======================================================
   CHANGE PASSWORD
====================================================== */
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both passwords required" });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findById(req.user._id);
        if (user) {
          const match = await bcrypt.compare(currentPassword, user.password);
          if (!match) {
            return res.status(400).json({ message: "Current password incorrect" });
          }
          user.password = await bcrypt.hash(newPassword, 10);
          await user.save();
          return res.json({ message: "Password updated successfully" });
        }
      } catch (e) {}
    }

    // In-memory fallback
    const user = inMemoryStore.getUserById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Failed to change password" });
  }
});

export default router;
