import mongoose from "mongoose";
import dotenv from "dotenv";
import { iposData } from "../data/iposData.js";
import Ipo from "../models/Ipo.js";

dotenv.config();

/**
 * Seed 24+ comprehensive IPO records into MongoDB
 */
async function seedIpos() {
  console.log("🌱 Starting IPO database seeding script...");
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ipo-app";

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
    console.log("✅ Connected to MongoDB at:", mongoUri);

    let inserted = 0;
    let updated = 0;

    for (const data of iposData) {
      const existing = await Ipo.findOne({
        $or: [{ _id: data._id }, { companyName: data.companyName }]
      });

      if (existing) {
        await Ipo.findByIdAndUpdate(existing._id, { $set: data }, { new: true });
        updated++;
      } else {
        await Ipo.create(data);
        inserted++;
      }
    }

    console.log(`🎉 Seeding finished! Inserted: ${inserted}, Updated: ${updated}, Total: ${iposData.length}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed (MongoDB might be offline):", err.message);
    process.exit(1);
  }
}

seedIpos();
