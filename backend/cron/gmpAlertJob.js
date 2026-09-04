import cron from "node-cron";
import mongoose from "mongoose";
import Ipo from "../models/Ipo.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { getIpoStatus } from "../utils/ipoStatus.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendPush } from "../utils/sendPush.js";

/**
 * =========================================================
 * GMP ALERT CRON JOB
 * Runs every 30 minutes
 * Triggers ONLY when GMP increases
 * =========================================================
 */

cron.schedule("*/30 * * * *", async () => {
  if (mongoose.connection.readyState !== 1) return;
  console.log("⏰ GMP Alert Job started");

  try {
    const ipos = await Ipo.find({});

    for (const ipo of ipos) {
      /* ================= STATUS CHECK ================= */
      const status = getIpoStatus(ipo);
      if (status !== "open") continue;

      /* ================= GMP HISTORY CHECK ================= */
      if (!Array.isArray(ipo.gmpHistory) || ipo.gmpHistory.length < 2) {
        continue;
      }

      const history = ipo.gmpHistory;
      const latestEntry = history.at(-1);
      const prevEntry = history.at(-2);

      if (!latestEntry || !prevEntry) continue;

      const latest = Number(latestEntry.gmp);
      const prev = Number(prevEntry.gmp);

      /* ================= ALERT ONLY ON INCREASE ================= */
      if (latest <= prev) continue;

      console.log(
        `📈 GMP increased for ${ipo.companyName}: ₹${prev} → ₹${latest}`
      );

      /* ================= FIND USERS ================= */
      const users = await User.find({
        notifyGmp: true,
        watchlist: ipo._id
      });

      for (const user of users) {
        /* =================================================
           SAVE WEBSITE NOTIFICATION (CRITICAL)
        ================================================= */
        await Notification.create({
          user: user._id,
          title: "GMP Increased 🚀",
          message: `${ipo.companyName} GMP jumped from ₹${prev} to ₹${latest}`,
          type: "gmp"
        });

        /* =================================================
           EMAIL ALERT
        ================================================= */
        if (user.notifyEmail !== false) {
          await sendEmail({
            to: user.email,
            subject: `📈 GMP Alert: ${ipo.companyName}`,
            html: `
              <div style="font-family: Arial, sans-serif">
                <h2>${ipo.companyName}</h2>
                <p><strong>GMP Increased</strong></p>
                <p style="font-size:16px">₹${prev} → ₹${latest}</p>
                <p>
                  Open IPO • Check details on IPO Insight
                </p>
              </div>
            `
          });
        }

        /* =================================================
           PUSH NOTIFICATION (OPTIONAL)
        ================================================= */
        if (user.pushToken) {
          await sendPush(user.pushToken, {
            title: "GMP Alert 🚀",
            body: `${ipo.companyName} GMP jumped to ₹${latest}`
          });
        }
      }
    }

    console.log("✅ GMP Alert Job finished");
  } catch (err) {
    console.error("❌ GMP Alert Job crashed:", err);
  }
});
