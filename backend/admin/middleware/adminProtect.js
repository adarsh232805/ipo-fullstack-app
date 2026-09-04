import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import { inMemoryStore } from "../../utils/inMemoryStore.js";
import mongoose from "mongoose";

export default async function adminProtect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecurejwtsecret123");

    // Fast-path: role in token is admin
    if (decoded.role === "admin") {
      req.admin = { _id: decoded.id, role: "admin", name: "IPO Admin", email: "admin@ipo.com" };
      req.user = req.admin;
      return next();
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const admin = await User.findById(decoded.id).select("-password");
        if (admin && admin.role === "admin") {
          req.admin = admin;
          req.user = admin;
          return next();
        }
      } catch (e) {}
    }

    const memUser = inMemoryStore.getUserById(decoded.id);
    if (memUser && memUser.role === "admin") {
      req.admin = memUser;
      req.user = memUser;
      return next();
    }

    return res.status(403).json({ message: "Admin access only" });
  } catch (err) {
    console.error("Admin auth error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
}
