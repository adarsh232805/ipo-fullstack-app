import cron from "node-cron";
import mongoose from "mongoose";
import { scrapeAndSyncLiveIpoData } from "../services/scraperService.js";
import { getLiveMarketTrends } from "../services/marketTrendService.js";

/**
 * ============================================================================
 * AUTOMATED REAL-TIME MARKET DATA SYNC CRON JOB
 * Automatically visits external sites, updates GMP, subscriptions, and indices
 * Runs every 15 minutes during trading & market activity
 * ============================================================================
 */

// Run every 5 minutes: "*/5 * * * *"
cron.schedule("*/5 * * * *", async () => {
  console.log("⏰ [Cron] Starting scheduled 5-minute live market data auto-sync (Groww + NSE/BSE + IPOWatch + IPOGyani)...");
  try {
    // 1. Scrape and synchronize live GMP & subscriptions
    const syncResult = await scrapeAndSyncLiveIpoData();
    console.log(`📊 [Cron] IPO sync finished: ${syncResult.updatedCount || 0} IPOs updated.`);

    // 2. Refresh live market trend benchmarks
    await getLiveMarketTrends(true);
    console.log("📈 [Cron] Market trends & benchmark indices refreshed.");
  } catch (err) {
    console.error("❌ [Cron] Market data sync error:", err.message);
  }
});

// Run an initial quick sync 5 seconds after server start
setTimeout(async () => {
  console.log("🚀 [Startup] Initiating startup market data auto-sync...");
  try {
    await scrapeAndSyncLiveIpoData();
    await getLiveMarketTrends(true);
    console.log("✅ [Startup] Initial live market data sync complete.");
  } catch (err) {
    console.warn("⚠️ [Startup] Initial sync skipped or deferred:", err.message);
  }
}, 5000);
