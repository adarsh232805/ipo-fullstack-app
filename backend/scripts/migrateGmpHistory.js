import mongoose from "mongoose";
import dotenv from "dotenv";
import IPO from "../models/Ipo.js";

dotenv.config();

async function migrateGmpHistory() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connected");

    const ipos = await IPO.find();

    let updatedCount = 0;

    for (const ipo of ipos) {
      // Skip if history already exists
      if (ipo.gmpHistory && ipo.gmpHistory.length > 0) {
        continue;
      }

      // Skip if no GMP exists
      if (ipo.gmp === undefined || ipo.gmp === null) {
        continue;
      }

      const today = new Date().toISOString().split("T")[0];

      ipo.gmpHistory = [
        {
          date: today,
          gmp: ipo.gmp
        }
      ];

      await ipo.save();
      updatedCount++;

      console.log(
        `✔ Updated: ${ipo.companyName} (GMP ₹${ipo.gmp})`
      );
    }

    console.log(
      `🎉 Migration completed. IPOs updated: ${updatedCount}`
    );

    process.exit();
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

migrateGmpHistory();
