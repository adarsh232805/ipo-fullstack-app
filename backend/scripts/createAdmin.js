import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ email: "admin@ipo.com" });
    if (existing) {
      console.log("⚠️ Admin already exists:", existing.email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@ipo.com",
      password: hashedPassword,
      role: "admin",
      kycStatus: "verified"
    });

    console.log("✅ ADMIN CREATED SUCCESSFULLY");
    console.log("Email:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to create admin:", err.message);
    process.exit(1);
  }
}

createAdmin();
