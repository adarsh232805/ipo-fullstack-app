import mongoose from "mongoose";
import dotenv from "dotenv";
import IPO from "../models/Ipo.js";

dotenv.config();

function generateSmartHistory(currentGmp) {
  const days = 7;
  const history = [];

  let base = Math.max(
    1,
    Math.round(currentGmp * (0.6 + Math.random() * 0.1))
  );

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const fluctuation = Math.floor(Math.random() * 2);
    base = Math.min(base + fluctuation, currentGmp);

    history.push({
      date: date.toISOString().split("T")[0],
      gmp: base
    });
  }

  history[history.length - 1].gmp = currentGmp;
  return history;
}

async function smartBackfill() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected");

    const ipos = await IPO.find({}, { _id: 1, gmp: 1, gmpHistory: 1 });

    let updated = 0;

    for (const ipo of ipos) {
      if (!ipo.gmp || ipo.gmp <= 0) continue;

      if (ipo.gmpHistory && ipo.gmpHistory.length >= 7) {
        continue;
      }

      const history = generateSmartHistory(ipo.gmp);

      await IPO.updateOne(
        { _id: ipo._id },
        { $set: { gmpHistory: history } }
      );

      updated++;
      console.log(`✔ Backfilled IPO ${ipo._id} (₹${ipo.gmp})`);
    }

    console.log(
      `🎉 Smart backfill completed. IPOs updated: ${updated}`
    );

    process.exit();
  } catch (err) {
    console.error("❌ Backfill failed:", err);
    process.exit(1);
  }
}

smartBackfill();
