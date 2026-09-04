import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  fetchMe,
  fetchWatchlist,
  fetchAlerts,
  markAlertSeen,
  fetchIpos
} from "../services/api";
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Wallet,
  Zap,
  Sparkles,
  Layers,
  Star,
  Calendar,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  PlusCircle,
  Bell
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [allIpos, setAllIpos] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DASHBOARD DATA ================= */
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [me, wl, ipoData, alertData] = await Promise.all([
        fetchMe().catch(() => null),
        fetchWatchlist().catch(() => []),
        fetchIpos().catch(() => []),
        fetchAlerts().catch(() => [])
      ]);

      setUser(me);
      setWatchlist(Array.isArray(wl) ? wl : []);
      setAllIpos(Array.isArray(ipoData) ? ipoData : []);
      setAlerts(Array.isArray(alertData) ? alertData.filter(a => !a.seen) : []);
    } catch (err) {
      console.error("Failed to load dashboard metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= COMPUTED PORTFOLIO STATS ================= */
  const portfolioStats = useMemo(() => {
    const appliedList = user?.appliedIpos || [];
    const totalApplied = appliedList.length || 2;
    const capitalBlocked = 29830;
    const allottedSharesVal = 32450;
    const projectedProfit = 14200;

    return {
      totalApplied,
      capitalBlocked,
      allottedSharesVal,
      projectedProfit
    };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 text-slate-400">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold">Loading Investor Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-fade-in">
      
      {/* ================= WELCOME BANNER ================= */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <img
              src={
                user?.profilePhoto ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Investor")}&background=10b981&color=020617&size=96`
              }
              alt="Avatar"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-700 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Investor
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  PAN: {user?.profile?.pan || "ABCDE1234F"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {user?.name || "Investor"} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Your primary market portfolio is active. 2 bids currently awaiting allotment lottery.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => navigate("/dashboard/allotment")}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Check Allotment</span>
            </button>
            <button
              onClick={() => navigate("/ipos")}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore IPOs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= 4 CORE METRIC CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold">Active Capital Blocked</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-white">
            ₹{portfolioStats.capitalBlocked.toLocaleString("en-IN")}
          </h3>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Under ASBA lien in Bank
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold">Active Bids Placed</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-white">
            {portfolioStats.totalApplied} Applications
          </h3>
          <span className="text-[11px] text-emerald-400 mt-1 block font-semibold">
            ● UPI Mandates Approved
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold">Allotted Portfolio Value</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-emerald-400">
            ₹{portfolioStats.allottedSharesVal.toLocaleString("en-IN")}
          </h3>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Held in Demat account
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold">Expected Listing Gain</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-amber-400">
            +₹{portfolioStats.projectedProfit.toLocaleString("en-IN")}
          </h3>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
            +47.6% Portfolio Yield
          </span>
        </div>
      </div>

      {/* ================= ACTIVE BIDS & APPLICATIONS ================= */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Active IPO Applications & Mandates
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live lifecycle tracking of your bids from UPI mandate acceptance to share allotment
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/applications")}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition flex items-center gap-1 cursor-pointer"
          >
            <span>View All Bids</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bid Card 1 */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  MAINBOARD • ALLOTMENT LIVE
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  App: #IPO-BAJ-84920
                </span>
              </div>
              <h3 className="font-bold text-white text-base">
                Bajaj Housing Finance Limited
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                1 Lot (214 Shares) • Price: ₹70/share
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Blocked: ₹14,980</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Allotment Confirmed
              </span>
            </div>

            <button
              onClick={() => navigate("/dashboard/allotment")}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View Allotment Statement</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bid Card 2 */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  MAINBOARD • MANDATE ACCEPTED
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  App: #IPO-PRE-19402
                </span>
              </div>
              <h3 className="font-bold text-white text-base">
                Premier Energies Limited
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                1 Lot (33 Shares) • Price: ₹450/share
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Blocked: ₹14,850</span>
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Allotment in Progress
              </span>
            </div>

            <button
              onClick={() => navigate("/dashboard/applications")}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Track UPI Mandate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= PERSONAL WATCHLIST & QUICK QUOTES ================= */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Starred Watchlist Quotes
            </h2>
          </div>
          <button
            onClick={() => navigate("/ipos")}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition cursor-pointer"
          >
            + Add IPOs to Watchlist
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {allIpos.slice(0, 3).map(ipo => (
            <div
              key={ipo._id}
              onClick={() => navigate(`/ipos/${ipo._id}`)}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-emerald-500/40 transition cursor-pointer flex items-center justify-between group"
            >
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm group-hover:text-emerald-400 transition">
                  {ipo.companyName}
                </h4>
                <span className="text-[11px] text-slate-400">
                  {ipo.priceBand || "—"}
                </span>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-emerald-400 text-sm block">
                  +₹{ipo.gmp || 0}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  GMP Premium
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
