import express from "express";
import { getLiveMarketTrends } from "../services/marketTrendService.js";
import {
  scrapeAndSyncLiveIpoData,
  getSyncStatus,
  scrapeIpoGyani,
  scrapeIpoWatch,
  scrapeGrowwIpos,
  scrapeNseLiveIpos,
  addCustomSource,
  getAllSources
} from "../services/scraperService.js";

const router = express.Router();

/**
 * GET /api/market-trends
 * Returns live benchmark indices (NIFTY 50, SENSEX, INDIA VIX),
 * FII/DII institutional flows, and Market Mood score
 */
router.get("/market-trends", async (req, res) => {
  try {
    const force = req.query.refresh === "true";
    const trends = await getLiveMarketTrends(force);
    res.json(trends);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch live market trends", details: err.message });
  }
});

/**
 * GET /api/market-sync/status
 * Returns health and status of external scrapers and sync history
 */
router.get("/market-sync/status", (req, res) => {
  try {
    const status = getSyncStatus();
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sync status", details: err.message });
  }
});

/**
 * POST /api/market-sync/trigger
 * Triggers an immediate real-time scrape from external sites
 */
router.post("/market-sync/trigger", async (req, res) => {
  try {
    console.log("⚡ [Manual Trigger] Immediate web scrape and market sync requested by client");
    const syncResult = await scrapeAndSyncLiveIpoData();
    const freshTrends = await getLiveMarketTrends(true);

    res.json({
      message: "Real-time web scrape and market sync completed successfully",
      syncResult,
      marketTrends: freshTrends
    });
  } catch (err) {
    res.status(500).json({ error: "Manual sync failed", details: err.message });
  }
});

/**
 * GET /api/market-sync/ipogyani-live
 * Live real-time inspection endpoint returning raw data scraped from IPOGyani
 */
router.get("/market-sync/ipogyani-live", async (req, res) => {
  try {
    const gyaniMap = await scrapeIpoGyani();
    const items = Array.from(gyaniMap.values());
    res.json({
      source: "https://ipogyani.com/ipo-gmp-today",
      scrapedAt: new Date().toISOString(),
      totalExtracted: items.length,
      data: items
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to scrape IPOGyani live", details: err.message });
  }
});

/**
 * GET /api/market-sync/ipowatch-live
 * Live real-time inspection endpoint returning raw data scraped from IPOWatch
 */
router.get("/market-sync/ipowatch-live", async (req, res) => {
  try {
    const watchMap = await scrapeIpoWatch();
    const items = Array.from(watchMap.values());
    res.json({
      source: "https://ipowatch.in/ipo-grey-market-premium-latest-ipo-gmp/",
      scrapedAt: new Date().toISOString(),
      totalExtracted: items.length,
      data: items
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to scrape IPOWatch live", details: err.message });
  }
});

/**
 * GET /api/market-sync/groww-live
 * Live real-time inspection endpoint returning raw data scraped from Groww
 */
router.get("/market-sync/groww-live", async (req, res) => {
  try {
    const growwMap = await scrapeGrowwIpos();
    const items = Array.from(growwMap.values());
    res.json({
      source: "https://groww.in/ipo",
      scrapedAt: new Date().toISOString(),
      totalExtracted: items.length,
      data: items
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to scrape Groww live", details: err.message });
  }
});

/**
 * GET /api/market-sync/nse-live
 * Live real-time inspection endpoint returning raw data fetched from NSE India
 */
router.get("/market-sync/nse-live", async (req, res) => {
  try {
    const nseMap = await scrapeNseLiveIpos();
    const items = Array.from(nseMap.values());
    res.json({
      source: "https://www.nseindia.com/api/ipo-current-issue",
      scrapedAt: new Date().toISOString(),
      totalExtracted: items.length,
      data: items
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch NSE live data", details: err.message });
  }
});

/**
 * GET /api/market-sync/sources
 * Returns all configured data sources including built-in and custom URLs
 */
router.get("/market-sync/sources", (req, res) => {
  try {
    const sources = getAllSources();
    res.json({
      success: true,
      totalSources: sources.length,
      sources
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve sources", details: err.message });
  }
});

/**
 * POST /api/market-sync/add-source
 * Add a custom website URL for the application to track and scrape
 */
router.post("/market-sync/add-source", async (req, res) => {
  try {
    const { name, url, selector } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const newSource = addCustomSource({ name, url, selector });
    res.json({
      success: true,
      message: `Source '${newSource.name}' added successfully. The app will fetch updates from this URL.`,
      source: newSource
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to register custom source", details: err.message });
  }
});

export default router;
