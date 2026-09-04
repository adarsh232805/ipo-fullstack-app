import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import { inMemoryStore } from "../utils/inMemoryStore.js";

/* ===============================
   AUTH PROTECT MIDDLEWARE
================================ */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Session expired. Please login again.",
          code: "TOKEN_EXPIRED",
        });
      }

      return res.status(401).json({
        message: "Invalid token",
      });
    }

    let user = null;
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findById(decoded.id).select("-password");
      } catch (e) {
        user = null;
      }
    }

    if (!user) {
      user = inMemoryStore.getUserById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware unexpected error:", err.message);
    return res.status(500).json({
      message: "Authentication failed",
    });
  }
};

/* ===============================
   ADMIN ONLY MIDDLEWARE
================================ */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Admin access only",
    });
  }
};
