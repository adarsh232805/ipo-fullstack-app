import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchIpos } from "../services/api";
import {
  TrendingUp,
  TrendingDown,
  Search,
  SlidersHorizontal,
  Flame,
  ShieldAlert,
  ArrowRight,
  Calculator,
  Calendar,
  Layers,
  Sparkles,
  Zap,
  Info,
  ChevronDown,
  Activity,
  Table as TableIcon,
  LayoutGrid,
  BarChart3,
  X,
  Clock
} from "lucide-react";

export default function GmpPage() {
  const navigate = useNavigate();

  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [boardFilter, setBoardFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("gmp_pct_high");
  const [view, setView] = useState("cards"); // 'cards' | 'table' | 'heatmap'
  const [expandedIpoId, setExpandedIpoId] = useState(null);

  // Profit Calculator Modal State
  const [calcIpo, setCalcIpo] = useState(null);
  const [calcLots, setCalcLots] = useState(1);

  /* ================= FETCH IPOs ================= */
  useEffect(() => {
    setLoading(true);
    fetchIpos()
      .then(data => {
        setIpos(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Failed to load GMP data:", err);
        setIpos([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /* ================= HELPER CALCULATIONS ================= */
  const extractPrice = priceBand => {
    if (!priceBand) return 0;
    const parts = priceBand.toString().replace(/[^0-9-]/g, "").split("-");
    return parseFloat(parts[parts.length - 1]) || 0;
  };

  const getGmpPct = ipo => {
    const price = extractPrice(ipo.priceBand);
    const gmp = ipo.gmp || 0;
    if (!price || price === 0) return 0;
    return Math.round((gmp / price) * 100);
  };

  const getEstListing = ipo => {
    const price = extractPrice(ipo.priceBand);
    const gmp = ipo.gmp || 0;
    return price + gmp;
  };

  const getLotProfit = ipo => {
    const gmp = ipo.gmp || 0;
    const lot = ipo.lotSize || 1;
    return gmp * lot;
  };

  const formatHistoryDate = (dateVal) => {
    if (!dateVal) return "—";
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    }
    return String(dateVal).trim();
  };

  const sortHistory = (h = []) => {
    if (!Array.isArray(h)) return [];
    return [...h].sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      if (!isNaN(da) && !isNaN(db)) return da - db;
      return 0;
    });
  };

  /* ================= AI SENTIMENT ESTIMATOR ================= */
  const analyzeSentiment = (ipo) => {
    const history = sortHistory(ipo.gmpHistory);
    const gmpPct = getGmpPct(ipo);

    if (history.length >= 2) {
      const diffs = [];
      for (let i = 1; i < history.length; i++) {
        diffs.push(history[i].gmp - history[i - 1].gmp);
      }
      const avgChange = diffs.reduce((a, b) => a + b, 0) / diffs.length;
      const latest = history[history.length - 1]?.gmp ?? ipo.gmp ?? 0;
      const predictedGmp = Math.round(latest + avgChange);

      if (avgChange > 2 || gmpPct >= 35) {
        return { sentiment: "Bullish", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", predictedGmp, confidence: 85 };
      }
      if (avgChange < -2 || gmpPct < 10) {
        return { sentiment: "Cautious", color: "text-amber-400 bg-amber-500/10 border-amber-500/30", predictedGmp, confidence: 70 };
      }
      return { sentiment: "Neutral", color: "text-blue-400 bg-blue-500/10 border-blue-500/30", predictedGmp, confidence: 75 };
    }

    if (gmpPct >= 30) {
      return { sentiment: "Bullish", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", predictedGmp: (ipo.gmp || 0) + 10, confidence: 80 };
    }
    return { sentiment: "Steady", color: "text-slate-300 bg-slate-800 border-slate-700", predictedGmp: ipo.gmp || 0, confidence: 70 };
  };

  /* ================= FILTER & SORT ================= */
  const filtered = useMemo(() => {
    return ipos
      .filter(ipo => {
        if (
          search.trim() &&
          !ipo.companyName?.toLowerCase().includes(search.toLowerCase().trim())
        ) {
          return false;
        }
        if (boardFilter !== "ALL" && ipo.board !== boardFilter) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "gmp_pct_high") return getGmpPct(b) - getGmpPct(a);
        if (sortBy === "gmp_val_high") return (b.gmp || 0) - (a.gmp || 0);
        if (sortBy === "profit_lot_high") return getLotProfit(b) - getLotProfit(a);
        if (sortBy === "name_asc") return (a.companyName || "").localeCompare(b.companyName || "");
        return 0;
      });
  }, [ipos, search, boardFilter, sortBy]);

  /* ================= TOP METRICS ================= */
  const topMetrics = useMemo(() => {
    if (!ipos.length) return { topGainer: null, avgListingPct: 0, maxProfit: 0 };
    let top = null;
    let maxPct = -1;
    let totalPct = 0;
    let maxProf = 0;

    ipos.forEach(i => {
      const pct = getGmpPct(i);
      const prof = getLotProfit(i);
      totalPct += pct;
      if (pct > maxPct) {
        maxPct = pct;
        top = i;
      }
      if (prof > maxProf) {
        maxProf = prof;
      }
    });

    const avg = ipos.length ? Math.round(totalPct / ipos.length) : 0;
    return { topGainer: top, avgListingPct: avg, maxProfit: maxProf };
  }, [ipos]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ================= TOP TICKER RIBBON ================= */}
      <div className="w-full bg-slate-900/90 border-b border-slate-800/80 overflow-hidden py-2 backdrop-blur-md">
        <div className="flex animate-marquee items-center gap-8 whitespace-nowrap text-xs">
          {ipos.map((ipo, idx) => {
            const pct = getGmpPct(ipo);
            return (
              <div key={idx} className="flex items-center gap-2">
                <span className="font-semibold text-slate-300">{ipo.companyName}</span>
                <span className="font-bold text-emerald-400">₹{ipo.gmp || 0}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  pct >= 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
                }`}>
                  {pct >= 0 ? `+${pct}%` : `${pct}%`}
                </span>
                <span className="text-slate-600">|</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">

        {/* ================= BREADCRUMBS & BADGE ================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Link to="/" className="hover:text-emerald-400 transition">Home</Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 font-semibold">Grey Market Premium</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>REAL-TIME WEB SCRAPER SYNC • INVESTORGAIN & CHITTORGARH FEEDS</span>
          </div>
        </div>

        {/* ================= HEADER & STATS ================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Grey Market Premium{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                (GMP) Live Tracker
              </span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
              Track unofficial buyer-seller premium quotations, daily price fluctuations, and estimated listing profits across all active Mainboard and SME public issues.
            </p>
          </div>

          {/* Top 3 Metric Pills */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-md">
            <div className="text-center px-2">
              <span className="text-[11px] text-slate-400 block font-medium">Top Gainer</span>
              <span className="text-base sm:text-lg font-bold text-emerald-400 mt-0.5 block line-clamp-1">
                {topMetrics.topGainer ? `+${getGmpPct(topMetrics.topGainer)}%` : "—"}
              </span>
            </div>
            <div className="text-center px-2 border-x border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Avg Expected</span>
              <span className="text-base sm:text-lg font-bold text-indigo-400 mt-0.5 block">
                +{topMetrics.avgListingPct}%
              </span>
            </div>
            <div className="text-center px-2">
              <span className="text-[11px] text-slate-400 block font-medium">Max Profit/Lot</span>
              <span className="text-base sm:text-lg font-bold text-amber-400 mt-0.5 block">
                ₹{topMetrics.maxProfit?.toLocaleString("en-IN") || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* ================= CONTROLS & FILTER TOOLBAR ================= */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl mb-8 backdrop-blur-xl space-y-4">
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Board Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
              {[
                { id: "ALL", label: "All Markets" },
                { id: "MAINBOARD", label: "Mainboard IPOs" },
                { id: "SME", label: "SME IPOs" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setBoardFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    boardFilter === tab.id
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px] md:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search company or ticker..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Sort & View Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/70 text-xs">
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Sort Order:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="gmp_pct_high">Highest GMP Gain (%)</option>
                <option value="gmp_val_high">Highest Absolute GMP (₹)</option>
                <option value="profit_lot_high">Maximum Profit Per Lot (₹)</option>
                <option value="name_asc">Company Name (A-Z)</option>
              </select>
            </div>

            {/* View Modes */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
              <button
                onClick={() => setView("cards")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  view === "cards"
                    ? "bg-slate-800 text-emerald-400"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Live Cards</span>
              </button>
              <button
                onClick={() => setView("table")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  view === "table"
                    ? "bg-slate-800 text-emerald-400"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Trader Table</span>
              </button>
              <button
                onClick={() => setView("heatmap")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  view === "heatmap"
                    ? "bg-slate-800 text-emerald-400"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Trend Heatmap</span>
              </button>
            </div>

          </div>

        </div>

        {/* ================= MAIN CONTENT VIEWS ================= */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div
                key={n}
                className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 animate-pulse space-y-4"
              >
                <div className="h-6 w-1/2 bg-slate-800 rounded" />
                <div className="h-10 w-3/4 bg-slate-800 rounded" />
                <div className="h-20 bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto my-8">
            <Info className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No GMP Records Found</h3>
            <p className="text-sm text-slate-400 mb-6">
              No matching company found. Clear search or check back as new grey market quotes arrive.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setBoardFilter("ALL");
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : view === "cards" ? (
          /* ================= 1. CARDS VIEW ================= */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(ipo => {
              const gmpPct = getGmpPct(ipo);
              const issuePrice = extractPrice(ipo.priceBand);
              const estListing = getEstListing(ipo);
              const lotProfit = getLotProfit(ipo);
              const sentimentInfo = analyzeSentiment(ipo);
              const history = sortHistory(ipo.gmpHistory);
              const isExpanded = expandedIpoId === ipo._id;

              return (
                <div
                  key={ipo._id}
                  className="bg-gradient-to-b from-slate-900/95 to-slate-950/90 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition" />

                  <div>
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              ipo.board === "SME"
                                ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                                : "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                            }`}
                          >
                            {ipo.board || "MAINBOARD"}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${sentimentInfo.color}`}>
                            {sentimentInfo.sentiment}
                          </span>
                        </div>

                        <h3
                          onClick={() => navigate(`/ipos/${ipo._id}`)}
                          className="font-bold text-white text-base hover:text-emerald-400 transition cursor-pointer"
                        >
                          {ipo.companyName}
                        </h3>
                      </div>

                      {/* Calculator Quick Action */}
                      <button
                        onClick={() => {
                          setCalcIpo(ipo);
                          setCalcLots(1);
                        }}
                        title="Calculate Listing Profit"
                        className="p-2 rounded-xl bg-slate-800/80 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 border border-slate-700/60 transition cursor-pointer"
                      >
                        <Calculator className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Big GMP Highlight Banner */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 mb-4 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block font-medium">Latest GMP</span>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-2xl font-extrabold text-emerald-400">
                            +₹{ipo.gmp || 0}
                          </span>
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded">
                            +{gmpPct}%
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block font-medium">Est. Listing Price</span>
                        <span className="text-base font-bold text-white mt-0.5 block">
                          ₹{estListing}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Base: ₹{issuePrice || "—"}
                        </span>
                      </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-2.5 mb-4 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/70">
                        <span className="text-slate-500 block">Lot Size</span>
                        <span className="font-semibold text-slate-200 mt-0.5 block">
                          {ipo.lotSize ? `${ipo.lotSize} Shares` : "—"}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/70">
                        <span className="text-slate-500 block">Est. Profit/Lot</span>
                        <span className="font-bold text-emerald-400 mt-0.5 block">
                          ₹{lotProfit?.toLocaleString("en-IN") || "—"}
                        </span>
                      </div>
                    </div>

                    {/* AI Prediction & Confidence Pill (IPOGyani Feed) */}
                    <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs mb-4">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-slate-400">AI Pred. Gain:</span>
                        <span className="font-bold text-emerald-400">
                          {ipo.aiPredictionPct ? `+${ipo.aiPredictionPct}%` : `+${gmpPct}%`}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        {ipo.gainPerLot ? `+₹${ipo.gainPerLot.toLocaleString("en-IN")} / Lot` : `Conf. ${sentimentInfo.confidence}%`}
                      </span>
                    </div>

                    {/* Expandable History Table */}
                    {isExpanded && history.length > 0 && (
                      <div className="mb-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs animate-fade-in">
                        <div className="text-[11px] font-semibold text-slate-400 mb-2">
                          7-Day Recorded Quotations:
                        </div>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {history.map((h, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between py-1 border-b border-slate-800/60 last:border-0 text-[11px]"
                            >
                              <span className="text-slate-400">
                                {formatHistoryDate(h.date)}
                              </span>
                              <span className="font-semibold text-white">
                                ₹{h.gmp}
                              </span>
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <span>{h.trend || "▲"}</span>
                                <span>{h.gain || "Active"}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() =>
                        setExpandedIpoId(isExpanded ? null : ipo._id)
                      }
                      className="text-xs font-semibold text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? "Hide History" : "View Trend History"}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => navigate(`/ipos/${ipo._id}`)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>Prospectus</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : view === "table" ? (
          /* ================= 2. TRADER AUDIT TABLE ================= */
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-5">Company</th>
                    <th className="py-4 px-4">Board</th>
                    <th className="py-4 px-4">Issue Price</th>
                    <th className="py-4 px-4">Latest GMP (₹)</th>
                    <th className="py-4 px-4">GMP Gain (%)</th>
                    <th className="py-4 px-4">Est. Listing Price</th>
                    <th className="py-4 px-4">Est. Profit/Lot</th>
                    <th className="py-4 px-4">Sentiment</th>
                    <th className="py-4 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {filtered.map(ipo => {
                    const gmpPct = getGmpPct(ipo);
                    const issuePrice = extractPrice(ipo.priceBand);
                    const estListing = getEstListing(ipo);
                    const lotProfit = getLotProfit(ipo);
                    const sentimentInfo = analyzeSentiment(ipo);

                    return (
                      <tr
                        key={ipo._id}
                        className="hover:bg-slate-800/40 transition cursor-pointer"
                        onClick={() => navigate(`/ipos/${ipo._id}`)}
                      >
                        <td className="py-4 px-5 font-bold text-white hover:text-emerald-400 transition">
                          {ipo.companyName}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ipo.board === "SME"
                                ? "bg-purple-500/15 text-purple-400"
                                : "bg-indigo-500/15 text-indigo-400"
                            }`}
                          >
                            {ipo.board || "MAINBOARD"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-300 font-medium">
                          ₹{issuePrice || "—"}
                        </td>
                        <td className="py-4 px-4 font-bold text-emerald-400 text-sm">
                          +₹{ipo.gmp || 0}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/15 text-emerald-400">
                            +{gmpPct}%
                          </span>
                        </td>
                        <td className="py-4 px-4 font-bold text-white">
                          ₹{estListing}
                        </td>
                        <td className="py-4 px-4 font-bold text-emerald-400">
                          ₹{lotProfit?.toLocaleString("en-IN")}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${sentimentInfo.color}`}>
                            {sentimentInfo.sentiment}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setCalcIpo(ipo);
                              setCalcLots(1);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold text-xs transition"
                          >
                            Calculator
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ================= 3. HEATMAP VIEW ================= */
          <div className="space-y-6">
            {filtered.map(ipo => {
              const history = sortHistory(ipo.gmpHistory);
              if (!history.length) return null;

              return (
                <div
                  key={ipo._id}
                  className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        onClick={() => navigate(`/ipos/${ipo._id}`)}
                        className="text-base font-bold text-white hover:text-emerald-400 cursor-pointer transition"
                      >
                        {ipo.companyName}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Historical GMP Swings (₹ and % shift)
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Current: ₹{ipo.gmp || 0}
                    </span>
                  </div>

                  <div className="flex gap-2.5 overflow-x-auto pb-2">
                    {history.map((d, idx) => {
                      const prev = history[idx - 1]?.gmp;
                      const up = prev === undefined || d.gmp >= prev;

                      return (
                        <div
                          key={idx}
                          className={`min-w-[90px] p-3 rounded-2xl flex flex-col items-center justify-center border text-center transition ${
                            up
                              ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                              : "bg-rose-950/30 border-rose-500/40 text-rose-300"
                          }`}
                        >
                          <span className="text-base font-extrabold block">
                            ₹{d.gmp}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {formatHistoryDate(d.date)}
                          </span>
                          <span className={`text-[10px] font-bold mt-0.5 block ${
                            up ? "text-emerald-400" : "text-rose-400"
                          }`}>
                            {up ? "▲ Bull" : "▼ Dip"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= REGULATORY SEBI CAUTION CARD ================= */}
        <div className="mt-16 p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-300">
              Regulatory Notice & Investor Risk Disclosure
            </h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Grey Market Premium (GMP) represents unofficial, unregulated OTC (Over-the-Counter) cash trade rates between market participants before formal stock exchange listing. GMP quotes are subject to extreme volatility and market rumor. Investors should make bidding decisions primarily on audited financial statements, company management, and Red Herring Prospectus (RHP) fundamentals rather than sole reliance on grey market figures.
            </p>
          </div>
        </div>

      </div>

      {/* ================= PROFIT CALCULATOR MODAL ================= */}
      {calcIpo && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">
                  Profit Estimator
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {calcIpo.companyName}
                </h3>
              </div>
              <button
                onClick={() => setCalcIpo(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1.5">
                  Number of Lots Applied
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={calcLots}
                    onChange={e => setCalcLots(parseInt(e.target.value) || 1)}
                    className="flex-1 accent-emerald-500 cursor-pointer"
                  />
                  <span className="w-12 text-center font-bold text-white bg-slate-950 border border-slate-800 py-1.5 rounded-lg text-sm">
                    {calcLots} {calcLots === 1 ? "Lot" : "Lots"}
                  </span>
                </div>
              </div>

              {/* Matrix */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Shares ({calcLots} × {calcIpo.lotSize || 1}):</span>
                  <span className="font-semibold text-white">
                    {calcLots * (calcIpo.lotSize || 1)} Shares
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Investment Capital (₹):</span>
                  <span className="font-semibold text-white">
                    ₹{(calcLots * (calcIpo.minInvestment || extractPrice(calcIpo.priceBand) * (calcIpo.lotSize || 1))).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2 text-sm">
                  <span className="text-emerald-400 font-bold">Estimated Listing Profit:</span>
                  <span className="font-extrabold text-emerald-400">
                    +₹{(calcLots * (calcIpo.gmp || 0) * (calcIpo.lotSize || 1)).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Expected Total Portfolio Value:</span>
                  <span className="font-bold text-white">
                    ₹{((calcLots * (calcIpo.minInvestment || extractPrice(calcIpo.priceBand) * (calcIpo.lotSize || 1))) + (calcLots * (calcIpo.gmp || 0) * (calcIpo.lotSize || 1))).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCalcIpo(null)}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
