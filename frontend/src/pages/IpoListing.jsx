import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  fetchIpos,
  addToWatchlist,
  removeFromWatchlist,
  fetchWatchlist
} from "../services/api";
import ApplyIpoModal from "../components/ApplyIpoModal";
import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  Flame,
  Calendar,
  Layers,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  LayoutGrid,
  Table as TableIcon,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info
} from "lucide-react";

const PAGE_SIZE = 9;

export default function IpoListing() {
  const navigate = useNavigate();

  const [ipos, setIpos] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Controls
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [ipoType, setIpoType] = useState("ALL");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'
  const [page, setPage] = useState(1);
  const [openFaq, setOpenFaq] = useState(null);

  // Apply Modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [appliedIpo, setAppliedIpo] = useState(null);

  /* ================= FETCH IPOs ================= */
  useEffect(() => {
    setLoading(true);
    fetchIpos()
      .then(data => {
        setIpos(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Failed to fetch IPOs:", err);
        setIpos([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /* ================= FETCH WATCHLIST ================= */
  useEffect(() => {
    fetchWatchlist()
      .then(data => {
        if (Array.isArray(data)) {
          setWatchlist(data.map(i => i._id || i.ipoId));
        }
      })
      .catch(() => setWatchlist([]));
  }, []);

  /* ================= WATCHLIST TOGGLE ================= */
  const toggleWatchlist = async (e, ipoId) => {
    e.stopPropagation();
    try {
      if (watchlist.includes(ipoId)) {
        await removeFromWatchlist(ipoId);
        setWatchlist(prev => prev.filter(id => id !== ipoId));
      } else {
        await addToWatchlist(ipoId);
        setWatchlist(prev => [...prev, ipoId]);
      }
    } catch {
      alert("Please log in to save IPOs to your personal watchlist.");
    }
  };

  /* ================= COMPUTE DYNAMIC STATUS ================= */
  const getComputedStatus = ipo => {
    if (ipo.status) {
      const s = ipo.status.toLowerCase();
      if (s === "open" || s === "live") return "open";
      if (s === "upcoming") return "upcoming";
      if (s === "closed" || s === "listed") return "closed";
    }

    if (!ipo.openDate || !ipo.closeDate) return "open";

    const now = new Date();
    const open = new Date(ipo.openDate);
    const close = new Date(ipo.closeDate);

    if (now < open) return "upcoming";
    if (now > close) return "closed";
    return "open";
  };

  /* ================= STATS SUMMARY ================= */
  const stats = useMemo(() => {
    const openCount = ipos.filter(i => getComputedStatus(i) === "open").length;
    const upcomingCount = ipos.filter(i => getComputedStatus(i) === "upcoming").length;
    const gmpList = ipos.map(i => i.gmp || 0).filter(g => g > 0);
    const avgGmp = gmpList.length
      ? Math.round(gmpList.reduce((a, b) => a + b, 0) / gmpList.length)
      : 0;

    return { openCount, upcomingCount, avgGmp, totalCount: ipos.length };
  }, [ipos]);

  /* ================= FILTER & SORT LOGIC ================= */
  const filteredIpos = useMemo(() => {
    return ipos
      .filter(ipo => {
        // Search
        if (
          search.trim() &&
          !ipo.companyName?.toLowerCase().includes(search.toLowerCase().trim())
        ) {
          return false;
        }

        // Board type
        if (ipoType !== "ALL" && ipo.board !== ipoType) {
          return false;
        }

        // Tab filter
        const status = getComputedStatus(ipo);
        if (activeTab === "open" && status !== "open") return false;
        if (activeTab === "upcoming" && status !== "upcoming") return false;
        if (activeTab === "closed" && status !== "closed") return false;
        if (activeTab === "watchlist" && !watchlist.includes(ipo._id)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "gmp_high") return (b.gmp || 0) - (a.gmp || 0);
        if (sortBy === "sub_high") {
          return (b.subscription?.total || 0) - (a.subscription?.total || 0);
        }
        if (sortBy === "closing_soon") {
          if (!a.closeDate) return 1;
          if (!b.closeDate) return -1;
          return new Date(a.closeDate) - new Date(b.closeDate);
        }
        return 0;
      });
  }, [ipos, search, activeTab, ipoType, sortBy, watchlist]);

  const totalPages = Math.ceil(filteredIpos.length / PAGE_SIZE) || 1;
  const visibleIpos = filteredIpos.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= APPLY MODAL TRIGGER ================= */
  const handleApply = (e, ipo) => {
    e.stopPropagation();
    setAppliedIpo(ipo);
    setShowApplyModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background glow flares */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">

        {/* ================= TOP BREADCRUMB & LIVE BADGE ================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Link to="/" className="hover:text-emerald-400 transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-200 font-semibold">IPO Directory</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE MARKET DATA • REAL-TIME GMP & SUBSCRIPTION</span>
          </div>
        </div>

        {/* ================= HERO TITLE & METRICS ================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Initial Public Offerings{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                (IPO) Radar
              </span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
              Track live bidding subscriptions, price bands, issue sizes, and unofficial grey market valuations across Mainboard & SME markets.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-md">
            <div className="text-center px-2">
              <span className="text-[11px] text-slate-400 block font-medium">Live Bidding</span>
              <span className="text-lg sm:text-xl font-bold text-emerald-400 mt-0.5 block flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {stats.openCount}
              </span>
            </div>
            <div className="text-center px-2 border-x border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium">Upcoming</span>
              <span className="text-lg sm:text-xl font-bold text-indigo-400 mt-0.5 block">
                {stats.upcomingCount}
              </span>
            </div>
            <div className="text-center px-2">
              <span className="text-[11px] text-slate-400 block font-medium">Avg GMP</span>
              <span className="text-lg sm:text-xl font-bold text-amber-400 mt-0.5 block">
                +₹{stats.avgGmp}
              </span>
            </div>
          </div>
        </div>

        {/* ================= CONTROLS & FILTER TOOLBAR ================= */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl mb-8 backdrop-blur-xl space-y-4">
          
          {/* Row 1: Search and Status Tabs */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
              {[
                { id: "all", label: "All IPOs", count: ipos.length },
                { id: "open", label: "🟢 Live Bidding", count: stats.openCount },
                { id: "upcoming", label: "⏳ Upcoming", count: stats.upcomingCount },
                { id: "closed", label: "Closed / Listed" },
                { id: "watchlist", label: `★ Watchlist (${watchlist.length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    activeTab === tab.id
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
                onChange={e => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by company name..."
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

          {/* Row 2: Secondary Filters (Board, Sort, View Switcher) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/70 text-xs">
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Board Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Board:</span>
                <select
                  value={ipoType}
                  onChange={e => {
                    setIpoType(e.target.value);
                    setPage(1);
                  }}
                  className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="ALL">All Boards (Mainboard & SME)</option>
                  <option value="MAINBOARD">Mainboard Only</option>
                  <option value="SME">SME Only</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="default">Default Order</option>
                  <option value="gmp_high">Highest GMP Premium (₹)</option>
                  <option value="sub_high">Most Subscribed Multiple</option>
                  <option value="closing_soon">Closing Soonest</option>
                </select>
              </div>
            </div>

            {/* Layout Mode (Grid vs Table) */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-slate-800 text-emerald-400"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                title="Pro Table View"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "table"
                    ? "bg-slate-800 text-emerald-400"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* ================= LISTINGS DISPLAY ================= */}
        {loading ? (
          /* Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div
                key={n}
                className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 animate-pulse space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-slate-800 rounded-2xl" />
                  <div className="w-20 h-6 bg-slate-800 rounded-full" />
                </div>
                <div className="w-3/4 h-5 bg-slate-800 rounded" />
                <div className="w-1/2 h-4 bg-slate-800 rounded" />
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                  <div className="h-10 bg-slate-800 rounded-xl" />
                  <div className="h-10 bg-slate-800 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredIpos.length === 0 ? (
          /* Empty State */
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto my-8">
            <Info className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No IPOs Found</h3>
            <p className="text-sm text-slate-400 mb-6">
              {activeTab === "watchlist"
                ? "Your watchlist is currently empty. Star an IPO to track it here!"
                : "No IPO matches your current filter criteria. Try resetting your search or filter tags."}
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveTab("all");
                setIpoType("ALL");
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* ================= GRID VIEW ================= */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleIpos.map(ipo => {
              const status = getComputedStatus(ipo);
              const isWatchlisted = watchlist.includes(ipo._id);

              return (
                <div
                  key={ipo._id}
                  onClick={() => navigate(`/ipos/${ipo._id}`)}
                  className="bg-gradient-to-b from-slate-900/90 to-slate-950/80 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Subtle hover gradient */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition" />

                  <div>
                    {/* Top Row: Avatar Logo, Board, Status & Star */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center font-extrabold text-white text-base shadow-inner">
                          {ipo.companyName?.charAt(0) || "I"}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                ipo.board === "SME"
                                  ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                                  : "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                              }`}
                            >
                              {ipo.board || "MAINBOARD"}
                            </span>
                            {ipo.isTrending && (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                <Flame className="w-2.5 h-2.5" /> Hot
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-white text-base mt-1 line-clamp-1 group-hover:text-emerald-400 transition">
                            {ipo.companyName}
                          </h3>
                        </div>
                      </div>

                      {/* Watchlist Star Toggle */}
                      <button
                        onClick={e => toggleWatchlist(e, ipo._id)}
                        className={`p-2 rounded-xl transition ${
                          isWatchlisted
                            ? "bg-amber-400/15 text-amber-400 border border-amber-400/30"
                            : "bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/50"
                        }`}
                        title={isWatchlisted ? "Remove from Watchlist" : "Save to Watchlist"}
                      >
                        <Star
                          className="w-4 h-4"
                          fill={isWatchlisted ? "currentColor" : "none"}
                        />
                      </button>
                    </div>

                    {/* Status Pill & Dates */}
                    <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 text-xs">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-slate-400">
                          {ipo.closeDate
                            ? `Closes ${new Date(ipo.closeDate).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short"
                              })}`
                            : "Dates TBA"}
                        </span>
                      </span>

                      <span
                        className={`font-semibold capitalize px-2 py-0.5 rounded-full text-[11px] ${
                          status === "open"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : status === "upcoming"
                            ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {status === "open" ? "● Bidding Open" : status}
                      </span>
                    </div>

                    {/* Key Financial Matrix */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/70">
                        <span className="text-slate-500 block">Price Band</span>
                        <span className="font-bold text-white text-sm mt-0.5 block">
                          {ipo.priceBand || "—"}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/70">
                        <span className="text-slate-500 block">Min Investment</span>
                        <span className="font-bold text-white text-sm mt-0.5 block">
                          ₹{ipo.minInvestment?.toLocaleString("en-IN") || "—"}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/70">
                        <span className="text-slate-500 block">Lot Size</span>
                        <span className="font-semibold text-slate-300 mt-0.5 block">
                          {ipo.lotSize ? `${ipo.lotSize} Shares` : "—"}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/70">
                        <span className="text-slate-500 block">Issue Size</span>
                        <span className="font-semibold text-slate-300 mt-0.5 block">
                          {ipo.issueSize || "—"}
                        </span>
                      </div>
                    </div>

                    {/* GMP & Subscription Section */}
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/20 via-slate-900 to-teal-950/20 border border-emerald-500/20 mb-4 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block font-medium">Grey Market (GMP)</span>
                        <span className="font-bold text-emerald-400 text-base mt-0.5 block">
                          +₹{ipo.gmp ?? 0}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block font-medium">Total Subscription</span>
                        <span className="font-bold text-indigo-300 text-base mt-0.5 block">
                          {ipo.subscription?.total ? `${ipo.subscription.total}x` : "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2.5">
                    <button
                      onClick={e => handleApply(e, ipo)}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold text-xs transition shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Apply Now
                    </button>
                    <button
                      onClick={() => navigate(`/ipos/${ipo._id}`)}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* ================= TABLE VIEW ================= */
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-5">Company & Board</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Price Band</th>
                    <th className="py-4 px-4">Lot / Min Amt</th>
                    <th className="py-4 px-4">Subscription</th>
                    <th className="py-4 px-4">GMP Premium</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {visibleIpos.map(ipo => {
                    const status = getComputedStatus(ipo);
                    const isWatchlisted = watchlist.includes(ipo._id);

                    return (
                      <tr
                        key={ipo._id}
                        onClick={() => navigate(`/ipos/${ipo._id}`)}
                        className="hover:bg-slate-800/40 transition cursor-pointer group"
                      >
                        {/* Company & Board */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={e => toggleWatchlist(e, ipo._id)}
                              className={`transition ${
                                isWatchlisted
                                  ? "text-amber-400"
                                  : "text-slate-600 hover:text-slate-400"
                              }`}
                            >
                              <Star
                                className="w-4 h-4"
                                fill={isWatchlisted ? "currentColor" : "none"}
                              />
                            </button>
                            <div>
                              <div className="font-bold text-white text-sm group-hover:text-emerald-400 transition">
                                {ipo.companyName}
                              </div>
                              <span
                                className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  ipo.board === "SME"
                                    ? "bg-purple-500/15 text-purple-400 border border-purple-500/20"
                                    : "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
                                }`}
                              >
                                {ipo.board || "MAINBOARD"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              status === "open"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : status === "upcoming"
                                ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {status === "open" ? "● Live" : status}
                          </span>
                        </td>

                        {/* Price Band */}
                        <td className="py-4 px-4 font-semibold text-slate-200">
                          {ipo.priceBand || "—"}
                        </td>

                        {/* Lot & Min Investment */}
                        <td className="py-4 px-4">
                          <span className="font-semibold text-white block">
                            ₹{ipo.minInvestment?.toLocaleString("en-IN") || "—"}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            {ipo.lotSize ? `${ipo.lotSize} shares/lot` : "—"}
                          </span>
                        </td>

                        {/* Subscription */}
                        <td className="py-4 px-4">
                          <span className="font-bold text-indigo-400 text-sm block">
                            {ipo.subscription?.total ? `${ipo.subscription.total}x` : "—"}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            Retail: {ipo.subscription?.retail ? `${ipo.subscription.retail}x` : "—"}
                          </span>
                        </td>

                        {/* GMP */}
                        <td className="py-4 px-4">
                          <span className="font-bold text-emerald-400 text-sm block">
                            +₹{ipo.gmp ?? 0}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            Est. ₹{ipo.priceBand ? (parseInt(ipo.priceBand.split("-").pop() || 0) + (ipo.gmp || 0)) : "—"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={e => handleApply(e, ipo)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold text-xs border border-emerald-500/30 transition cursor-pointer"
                            >
                              Apply
                            </button>
                            <button
                              onClick={() => navigate(`/ipos/${ipo._id}`)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                              title="Details"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-800/80 pt-6 mt-8">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-semibold text-white">
                {(page - 1) * PAGE_SIZE + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-white">
                {Math.min(page * PAGE_SIZE, filteredIpos.length)}
              </span>{" "}
              of <span className="font-semibold text-white">{filteredIpos.length}</span> IPOs
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                    page === i + 1
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                      : "border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ================= FAQ & INVESTOR GUIDE SECTION ================= */}
        <div className="mt-16 pt-12 border-t border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Frequently Asked Questions on Primary Market IPOs
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Everything you need to know about bidding, ASBA mandate, and listing allotment.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {[
              [
                "What is an IPO cut-off price and why should retail investors bid at cut-off?",
                "The cut-off price is the final issue price decided by the company after evaluating bids within the price band. For retail investors (bids up to ₹2 Lakhs), ticking the 'Cut-off Price' box guarantees your application will remain eligible regardless of where the price is finalized."
              ],
              [
                "How does the ASBA UPI payment mandate work?",
                "Application Supported by Blocked Amount (ASBA) means your funds never leave your bank account during application. The money is simply placed under a hold/lien. If allotted, the corresponding amount is debited on allotment day; if not allotted, the hold is released automatically."
              ],
              [
                "What is the difference between Mainboard and SME IPOs?",
                "Mainboard IPOs are larger companies listed on the primary BSE/NSE exchanges with lot sizes around ₹14,000–₹15,000. SME IPOs are smaller emerging enterprises listed on BSE SME or NSE Emerge, typically requiring minimum ticket sizes of ₹1,00,000 to ₹1,50,000 with higher volatility."
              ],
              [
                "How is IPO allotment determined during heavy oversubscription?",
                "When a retail portion is oversubscribed (e.g., 20x), allotment is conducted via an automated computer lottery monitored by SEBI. Each valid retail PAN has an equal chance of receiving exactly one minimum lot."
              ]
            ].map(([q, a], idx) => (
              <div
                key={idx}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm text-slate-200 hover:text-white"
                >
                  <span>{q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === idx ? "rotate-180 text-emerald-400" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ================= APPLY BROKER MODAL ================= */}
      {showApplyModal && (
        <ApplyIpoModal
          ipo={appliedIpo}
          onClose={() => {
            setShowApplyModal(false);
            setAppliedIpo(null);
          }}
        />
      )}
    </div>
  );
}
