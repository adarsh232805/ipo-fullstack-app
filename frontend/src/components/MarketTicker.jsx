import React, { useEffect, useState, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Activity,
  Zap,
  Globe2,
  CheckCircle2
} from "lucide-react";
import { fetchMarketTrends, triggerMarketSync } from "../services/api";

export default function MarketTicker() {
  const [trends, setTrends] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncedToast, setSyncedToast] = useState(false);
  const [lastSyncText, setLastSyncText] = useState("Just now");
  const lastSyncTimeRef = useRef(Date.now());

  /* ================= LOAD INITIAL MARKET TRENDS ================= */
  useEffect(() => {
    loadTrends();

    // Auto-poll every 60 seconds
    const interval = setInterval(() => {
      loadTrends(false);
    }, 60000);

    // Update relative time text every 15 seconds
    const timeInterval = setInterval(() => {
      const diffSec = Math.floor((Date.now() - lastSyncTimeRef.current) / 1000);
      if (diffSec < 45) setLastSyncText("Just now");
      else if (diffSec < 90) setLastSyncText("1m ago");
      else setLastSyncText(`${Math.floor(diffSec / 60)}m ago`);
    }, 15000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  const loadTrends = async (force = false) => {
    try {
      const data = await fetchMarketTrends(force);
      if (data && data.indices) {
        setTrends(data);
        lastSyncTimeRef.current = Date.now();
        setLastSyncText("Just now");
      }
    } catch (err) {
      console.warn("Market trend fetch skipped:", err.message);
    }
  };

  /* ================= TRIGGER MANUAL INSTANT SYNC ================= */
  const handleForceSync = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const res = await triggerMarketSync();
      if (res?.marketTrends) {
        setTrends(res.marketTrends);
      } else {
        await loadTrends(true);
      }
      lastSyncTimeRef.current = Date.now();
      setLastSyncText("Just now");
      setSyncedToast(true);
      setTimeout(() => setSyncedToast(false), 3000);
    } catch (err) {
      console.error("Force sync failed:", err);
    } finally {
      setSyncing(false);
    }
  };

  const indices = trends?.indices || {
    nifty50: { name: "NIFTY 50", price: 25145.80, change: 112.40, changePct: 0.45, isPositive: true },
    sensex: { name: "BSE SENSEX", price: 82352.60, change: 345.15, changePct: 0.42, isPositive: true },
    indiaVix: { name: "INDIA VIX", price: 13.65, change: -0.28, changePct: -2.01, isPositive: false },
    niftyIpo: { name: "NIFTY IPO", price: 14210.30, change: 185.60, changePct: 1.32, isPositive: true }
  };

  const mood = trends?.marketMood || {
    score: 68,
    label: "Greed (Bullish)"
  };

  return (
    <div className="w-full bg-slate-950/95 border-b border-slate-800/80 backdrop-blur-md text-[11px] font-medium text-slate-300 py-1.5 px-4 sm:px-6 relative z-40 select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
        
        {/* LEFT: Live Market Indices Tickers */}
        <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
              Market Live
            </span>
          </div>

          {/* NIFTY 50 */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-semibold text-white">NIFTY</span>
            <span className="font-bold text-slate-200">
              {indices.nifty50.price?.toLocaleString("en-IN", { maximumFractionDigits: 1 })}
            </span>
            <span
              className={`flex items-center text-[10px] font-bold ${
                indices.nifty50.isPositive ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {indices.nifty50.isPositive ? "+" : ""}
              {indices.nifty50.changePct}%
            </span>
          </div>

          <span className="text-slate-700 hidden sm:inline">•</span>

          {/* SENSEX */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-semibold text-white">SENSEX</span>
            <span className="font-bold text-slate-200">
              {indices.sensex.price?.toLocaleString("en-IN", { maximumFractionDigits: 1 })}
            </span>
            <span
              className={`flex items-center text-[10px] font-bold ${
                indices.sensex.isPositive ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {indices.sensex.isPositive ? "+" : ""}
              {indices.sensex.changePct}%
            </span>
          </div>

          <span className="text-slate-700 hidden sm:inline">•</span>

          {/* INDIA VIX */}
          <div className="flex items-center gap-1.5 shrink-0 hidden md:flex">
            <span className="font-semibold text-slate-400">VIX</span>
            <span className="font-bold text-slate-200">{indices.indiaVix.price}</span>
            <span
              className={`text-[10px] font-bold ${
                indices.indiaVix.price < 15 ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {indices.indiaVix.changePct}%
            </span>
          </div>

          <span className="text-slate-700 hidden lg:inline">•</span>

          {/* NIFTY IPO */}
          <div className="flex items-center gap-1.5 shrink-0 hidden lg:flex">
            <span className="font-semibold text-indigo-300">NIFTY IPO</span>
            <span className="font-bold text-slate-200">
              {indices.niftyIpo.price?.toLocaleString("en-IN", { maximumFractionDigits: 1 })}
            </span>
            <span className="text-emerald-400 font-bold text-[10px]">
              +{indices.niftyIpo.changePct}%
            </span>
          </div>

          {/* Market Mood Pill */}
          <div className="hidden xl:flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 shrink-0">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>Mood: {mood.label}</span>
          </div>
        </div>

        {/* RIGHT: Live Auto-Sync Status & Force Sync Trigger */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          {/* Sync Status Badge */}
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <Globe2 className="w-3 h-3 text-emerald-400" />
            <span className="hidden sm:inline">Auto-Sync:</span>
            <span className="text-slate-300 font-semibold">{lastSyncText}</span>
          </div>

          {/* Force Sync Button */}
          <button
            type="button"
            onClick={handleForceSync}
            disabled={syncing}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-200 hover:text-emerald-300 text-[10px] font-bold transition shadow-sm cursor-pointer disabled:opacity-60"
            title="Fetch and synchronize fresh data from InvestorGain, Chittorgarh, and NSE/BSE feeds"
          >
            <RefreshCw className={`w-3 h-3 text-emerald-400 ${syncing ? "animate-spin" : ""}`} />
            <span>{syncing ? "Syncing Sources..." : "Sync Live Data"}</span>
          </button>

          {/* Synced Success Toast */}
          {syncedToast && (
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold animate-fade-in">
              <CheckCircle2 className="w-3 h-3" />
              <span className="hidden sm:inline">Updated!</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
