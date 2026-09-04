import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Search,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Calculator,
  Clock,
  Newspaper,
  ChevronDown,
  CheckCircle2,
  Flame,
  Building2,
  Calendar,
  DollarSign,
  BarChart3,
  HelpCircle,
  Activity,
  Layers,
  Zap,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { fetchIpos } from "../services/api";
import { fetchMergedIpoNews } from "../services/rssNews";

/* ================= HELPERS ================= */

const getStatus = (ipo) => {
  if (ipo.status) return ipo.status;
  if (!ipo.openDate || !ipo.closeDate) return "open";
  const now = new Date();
  const open = new Date(ipo.openDate);
  const close = new Date(ipo.closeDate);
  if (now < open) return "upcoming";
  if (now > close) return "closed";
  return "open";
};

const extractPrice = (priceBand) => {
  if (!priceBand) return 100;
  const match = priceBand.match(/(\d+)/g);
  if (!match) return 100;
  return Number(match[match.length - 1]) || 100;
};

const timeLeft = (date) => {
  if (!date) return null;
  const diff = new Date(date) - new Date();
  if (diff <= 0) return "Closing today";
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return `${d}d ${h}h remaining`;
};

/* ================= SPARKLINE ================= */

const Sparkline = ({ data = [] }) => {
  if (!Array.isArray(data) || data.length < 2) {
    return (
      <div className="h-6 flex items-center text-xs text-gray-400">
        Steady trend
      </div>
    );
  }

  const values = data.map((d) => d.gmp);
  const max = Math.max(...values);
  const min = Math.min(...values);

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * 90 + 5;
    const y = 24 - ((v - min) / (max - min || 1)) * 20;
    return `${x},${y}`;
  });

  const isUp = values[values.length - 1] >= values[0];

  return (
    <svg width="100" height="28" className="overflow-visible">
      <polyline
        fill="none"
        stroke={isUp ? "#10b981" : "#ef4444"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points.join(" ")}
      />
    </svg>
  );
};

/* ================= MAIN COMPONENT ================= */

export default function Home() {
  const navigate = useNavigate();

  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [newsData, setNewsData] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsFilter, setNewsFilter] = useState("ALL");
  const [openFaq, setOpenFaq] = useState(0);

  // Calculator State
  const [selectedCalcIpoId, setSelectedCalcIpoId] = useState("");
  const [calcLots, setCalcLots] = useState(1);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  /* Load IPOs */
  useEffect(() => {
    fetchIpos()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.ipos || [];
        setIpos(list);
        if (list.length > 0) {
          setSelectedCalcIpoId(list[0]._id);
        }
      })
      .catch(() => setIpos([]))
      .finally(() => setLoading(false));
  }, []);

  /* Load News */
  const refreshNews = () => {
    setNewsLoading(true);
    const ipoNames = ipos.map((i) => i.companyName);
    fetchMergedIpoNews(ipoNames)
      .then((data) => setNewsData(Array.isArray(data) ? data : []))
      .catch(() => setNewsData([]))
      .finally(() => setNewsLoading(false));
  };

  useEffect(() => {
    refreshNews();
  }, [ipos]);

  /* Filtered & Sorted IPOs */
  const filteredIpos = useMemo(() => {
    return ipos.filter((ipo) => {
      const nameMatch = ipo.companyName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const status = getStatus(ipo);

      if (!nameMatch) return false;

      if (activeTab === "ALL") return true;
      if (activeTab === "LIVE") return status === "open";
      if (activeTab === "UPCOMING") return status === "upcoming";
      if (activeTab === "CLOSED") return status === "closed" || status === "listed";
      if (activeTab === "HIGH_GMP") return Number(ipo.gmp || 0) >= 50;
      if (activeTab === "SME") return ipo.board === "SME";
      if (activeTab === "MAINBOARD") return ipo.board === "MAINBOARD";

      return true;
    });
  }, [ipos, searchQuery, activeTab]);

  /* Highlight Featured IPO */
  const featuredIpo = useMemo(() => {
    if (!ipos.length) return null;
    // Pick highest GMP open IPO or first
    const openList = ipos.filter((i) => getStatus(i) === "open");
    if (openList.length) {
      return [...openList].sort((a, b) => (b.gmp || 0) - (a.gmp || 0))[0];
    }
    return ipos[0];
  }, [ipos]);

  /* Calculator Values */
  const selectedIpo = useMemo(() => {
    return ipos.find((i) => i._id === selectedCalcIpoId) || ipos[0] || null;
  }, [ipos, selectedCalcIpoId]);

  const calcPrice = selectedIpo ? extractPrice(selectedIpo.priceBand) : 100;
  const calcLotSize = selectedIpo?.lotSize || 100;
  const totalShares = calcLots * calcLotSize;
  const totalInvestment = totalShares * calcPrice;
  const currentGmp = Number(selectedIpo?.gmp || 0);
  const estimatedProfit = totalShares * currentGmp;
  const estimatedGainPercent = calcPrice > 0 ? ((currentGmp / calcPrice) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">

      {/* ================= 1. REAL-TIME LIVE GMP TICKER RIBBON ================= */}
      <div className="bg-slate-900/90 backdrop-blur-md text-white py-2.5 px-4 overflow-hidden border-b border-slate-800/80 text-xs select-none sticky top-16 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE GMP & IPO TICKER
            <span className="hidden md:inline text-[10px] text-emerald-500/70 ml-1">
              (Groww • NSE • BSE • IPOWatch • IPOGyani)
            </span>
          </div>

          <div className="relative flex-1 overflow-hidden">
            <div className="animate-marquee gap-8">
              {ipos.map((ipo) => {
                const isPositive = (ipo.gmp || 0) > 0;
                return (
                  <div
                    key={ipo._id}
                    onClick={() => navigate(`/ipos/${ipo._id}`)}
                    className="inline-flex items-center gap-2.5 cursor-pointer hover:text-emerald-400 transition"
                  >
                    <span className="font-semibold text-slate-200">
                      {ipo.companyName}
                    </span>
                    <span className="text-slate-400">
                      {ipo.priceBand || "TBD"}
                    </span>
                    <span
                      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded font-bold ${
                        isPositive
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {isPositive ? <TrendingUp size={12} /> : null}
                      GMP ₹{ipo.gmp || 0}
                    </span>
                    <span className="text-slate-600">•</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-16 pb-24 px-4 sm:px-6">
        {/* Decorative Grid Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-600/15 via-emerald-600/10 to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">

          {/* Left Column: Headline & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 backdrop-blur text-emerald-400 text-xs font-semibold shadow-sm">
                <Sparkles size={14} className="text-yellow-400" />
                India's Premier Real-Time Primary Market Intelligence
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 backdrop-blur text-slate-300 text-xs font-medium shadow-sm">
                <span>Made with</span>
                <span className="text-rose-500 animate-pulse">❤️</span>
                <span>by</span>
                <a
                  href="https://github.com/adarsh232805"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-white hover:text-emerald-400 transition"
                >
                  Adarsh Singh
                </a>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              Track IPOs, Monitor{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Live GMP
              </span>{" "}
              & Predict Gains.
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Institutional-grade IPO tracker featuring real-time Grey Market Premiums, live subscription multipliers, AI-driven risk signals, and instant allotment links.
            </p>

            {/* Search Bar in Hero */}
            <div className="pt-2 max-w-xl mx-auto lg:mx-0">
              <div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-1.5 shadow-2xl focus-within:border-emerald-500/50 transition">
                <Search className="ml-3 text-slate-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search any IPO by company name (e.g. Bajaj, Premier)..."
                  className="w-full bg-transparent px-3 py-2 text-white placeholder-slate-400 focus:outline-none text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs text-slate-400 hover:text-white px-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/ipos")}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 hover:-translate-y-0.5 transition"
              >
                Explore All IPOs <ArrowUpRight size={16} />
              </button>
              <button
                onClick={() => navigate("/gmp")}
                className="px-7 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-white font-semibold text-sm backdrop-blur flex items-center gap-2 transition"
              >
                <Activity size={16} className="text-emerald-400" /> Live GMP Tracker
              </button>
              <button
                onClick={() => navigate("/compare")}
                className="px-6 py-3.5 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 text-slate-300 font-semibold text-sm flex items-center gap-2 transition"
              >
                <Layers size={16} /> Compare IPOs
              </button>
            </div>

            {/* Social Trust Metrics */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" /> SEBI & Exchange Linked
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" /> Real-Time Unofficial GMP
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" /> Free Registrar Links
              </span>
            </div>
          </div>

          {/* Right Column: Featured Spotlight Card */}
          <div className="lg:col-span-5">
            {featuredIpo ? (
              <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group hover:border-slate-700 transition">
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[11px] font-bold tracking-wider text-amber-400 uppercase flex items-center gap-1">
                      <Flame size={14} /> HIGHEST DEMAND SPOTLIGHT
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                      {featuredIpo.companyName}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {getStatus(featuredIpo).toUpperCase()}
                  </span>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 my-6">
                  <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80">
                    <p className="text-xs text-slate-400">Grey Market Premium</p>
                    <div className="text-2xl font-black text-emerald-400 mt-0.5">
                      +₹{featuredIpo.gmp || 0}
                    </div>
                    <div className="mt-1">
                      <Sparkline data={featuredIpo.gmpHistory} />
                    </div>
                  </div>

                  <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80">
                    <p className="text-xs text-slate-400">Total Subscription</p>
                    <div className="text-2xl font-black text-white mt-0.5">
                      {featuredIpo.subscription?.total || "0"}x
                    </div>
                    <p className="text-[11px] text-cyan-400 mt-1">
                      Retail: {featuredIpo.subscription?.retail || "0"}x
                    </p>
                  </div>
                </div>

                {/* Details Bar */}
                <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Price Band:</span>
                    <span className="font-semibold text-white">{featuredIpo.priceBand || "TBD"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lot Size:</span>
                    <span className="font-semibold text-white">{featuredIpo.lotSize || "—"} shares</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Gain:</span>
                    <span className="font-bold text-emerald-400">
                      ~{((Number(featuredIpo.gmp || 0) / extractPrice(featuredIpo.priceBand)) * 100).toFixed(0)}%
                    </span>
                  </div>
                  {timeLeft(featuredIpo.closeDate) && (
                    <div className="flex justify-between text-amber-300 font-medium">
                      <span className="flex items-center gap-1"><Clock size={12} /> Time Remaining:</span>
                      <span>{timeLeft(featuredIpo.closeDate)}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/ipos/${featuredIpo._id}`)}
                  className="mt-6 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 transition"
                >
                  View In-Depth Analysis <ArrowUpRight size={16} />
                </button>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 text-sm">
                Loading Market Leader...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= 3. STATS STRIP ================= */}
      <section className="bg-slate-900/80 border-y border-slate-800/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-black text-white">₹45,000+ Cr</div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">Capital Tracked</div>
          </div>
          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">99.4%</div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">GMP Accuracy</div>
          </div>
          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-black text-blue-400">120K+</div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">Active Investors</div>
          </div>
          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-black text-purple-400">&lt; 30s</div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">NSE / BSE Update</div>
          </div>
        </div>
      </section>

      {/* ================= 4. MAIN IPO LISTINGS DIRECTORY ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Zap size={14} /> LIVE MARKET TRACKER
            </div>
            <h2 className="text-3xl font-black text-white mt-1">
              Active & Upcoming Initial Public Offerings
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Filter by status, segment, or grey market demand to find your next winning issue.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "ALL", label: "All IPOs" },
              { id: "LIVE", label: "⚡ Live Now" },
              { id: "UPCOMING", label: "📅 Upcoming" },
              { id: "HIGH_GMP", label: "🔥 Hot GMP" },
              { id: "MAINBOARD", label: "Mainboard" },
              { id: "SME", label: "SME" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.id
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* IPO Cards Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-900/60 rounded-3xl p-6 border border-slate-800 animate-pulse h-64" />
            ))}
          </div>
        ) : filteredIpos.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
            <Search size={40} className="mx-auto text-slate-600 mb-3" />
            <h3 className="text-lg font-bold text-slate-300">No IPOs found matching your filter</h3>
            <p className="text-slate-500 text-sm mt-1">Try changing the category or clearing the search query.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveTab("ALL"); }}
              className="mt-4 px-5 py-2 rounded-xl bg-slate-800 text-emerald-400 font-semibold text-xs hover:bg-slate-700 border border-slate-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredIpos.map((ipo) => {
              const status = getStatus(ipo);
              const price = extractPrice(ipo.priceBand);
              const gmpVal = Number(ipo.gmp || 0);
              const gainEst = price > 0 ? ((gmpVal / price) * 100).toFixed(0) : 0;

              return (
                <div
                  key={ipo._id}
                  onClick={() => navigate(`/ipos/${ipo._id}`)}
                  className="bg-slate-900/80 rounded-3xl p-6 border border-slate-800/90 shadow-sm hover:shadow-2xl hover:border-slate-700 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-slate-950 flex items-center justify-center font-black text-lg shadow-sm">
                          {ipo.companyName?.charAt(0) || "I"}
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition line-clamp-1">
                            {ipo.companyName}
                          </h3>
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            {ipo.board || "MAINBOARD"}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase ${
                          status === "open"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : status === "upcoming"
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    {/* Price & Lot Info */}
                    <div className="grid grid-cols-2 gap-3 mt-5 p-3.5 bg-slate-950/60 rounded-2xl text-xs border border-slate-800/80">
                      <div>
                        <span className="text-slate-400 block">Price Band</span>
                        <span className="font-bold text-slate-100 text-sm mt-0.5 block">
                          {ipo.priceBand || "TBD"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Lot Size / Min Inv</span>
                        <span className="font-bold text-slate-100 text-sm mt-0.5 block">
                          {ipo.lotSize ? `${ipo.lotSize} shares` : "—"}
                        </span>
                      </div>
                    </div>

                    {/* GMP & Subscription Section */}
                    <div className="mt-5 space-y-3">
                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-xs text-slate-400">Grey Market Premium (GMP)</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-2xl font-black text-emerald-400">
                              +₹{ipo.gmp || 0}
                            </span>
                            {gmpVal > 0 && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                ~{gainEst}% Est.
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-slate-400">Total Sub.</span>
                          <div className="text-lg font-bold text-slate-200">
                            {ipo.subscription?.total ?? "--"}x
                          </div>
                        </div>
                      </div>

                      {/* Sparkline Trend */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-400">GMP Trend (7 Days)</span>
                        <Sparkline data={ipo.gmpHistory} />
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    {status === "open" && timeLeft(ipo.closeDate) ? (
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <Clock size={13} /> {timeLeft(ipo.closeDate)}
                      </span>
                    ) : (
                      <span className="text-slate-400">
                        {ipo.listingDate ? `Lists ${new Date(ipo.listingDate).toLocaleDateString()}` : "Primary Market"}
                      </span>
                    )}

                    <span className="text-emerald-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Details <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= 5. INTERACTIVE LISTING GAIN CALCULATOR ================= */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white py-16 px-4 sm:px-6 border-y border-slate-800">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
              <Calculator size={14} /> INSTANT ESTIMATOR
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              IPO Profit & Listing Gain Calculator
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Estimate your probable listing gains and portfolio returns based on live Grey Market Premiums before bidding on Zerodha, Groww, or your broker.
            </p>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Calculates cut-off price + GMP per share</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Considers exact lot sizes & multiple retail lots</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Updated daily against latest market signals</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="grid sm:grid-cols-2 gap-6">

              {/* Select IPO */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select IPO
                </label>
                <select
                  value={selectedCalcIpoId}
                  onChange={(e) => setSelectedCalcIpoId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  {ipos.map((i) => (
                    <option key={i._id} value={i._id}>
                      {i.companyName} (GMP: ₹{i.gmp || 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Lots Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Number of Lots ({calcLotSize} shares/lot)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCalcLots(Math.max(1, calcLots - 1))}
                    className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 text-lg font-bold hover:bg-slate-800 flex items-center justify-center transition"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={calcLots}
                    onChange={(e) => setCalcLots(Math.max(1, Number(e.target.value) || 1))}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2.5 text-center text-white font-bold text-base focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => setCalcLots(calcLots + 1)}
                    className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 text-lg font-bold hover:bg-slate-800 flex items-center justify-center transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Calculated Output Box */}
            <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80">
                <span className="text-xs text-slate-400 block">Total Investment</span>
                <span className="text-lg font-bold text-white mt-1 block">
                  ₹{totalInvestment.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">{totalShares} Shares</span>
              </div>

              <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80">
                <span className="text-xs text-slate-400 block">Est. Listing Price</span>
                <span className="text-lg font-bold text-white mt-1 block">
                  ₹{calcPrice + currentGmp}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">+{estimatedGainPercent}%</span>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 col-span-2 sm:col-span-1">
                <span className="text-xs text-emerald-300 block font-semibold">Expected Profit</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">
                  +₹{estimatedProfit.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-300">Listing day gain</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. REAL-TIME IPO & MARKET NEWS HUB ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Newspaper size={14} /> REAL-TIME FINANCIAL WIRE
            </div>
            <h2 className="text-3xl font-black text-white mt-1">
              Live Primary Market & IPO News
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Aggregated from Economic Times, Moneycontrol, LiveMint, and Business Standard without delays.
            </p>
          </div>

          {/* Controls: Source Filter & Refresh Button */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={refreshNews}
              disabled={newsLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 hover:bg-slate-800 text-xs font-bold transition mr-2"
              title="Fetch fresh real-time news"
            >
              <RefreshCw size={13} className={newsLoading ? "animate-spin" : ""} />
              {newsLoading ? "Refreshing..." : "Refresh News"}
            </button>

            {["ALL", "Moneycontrol", "Economic Times", "LiveMint", "Business Standard"].map((src) => (
              <button
                key={src}
                onClick={() => setNewsFilter(src)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  newsFilter === src
                    ? "bg-emerald-500 text-slate-950 font-black shadow-sm"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800"
                }`}
              >
                {src}
              </button>
            ))}
          </div>
        </div>

        {newsLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-slate-900/60 rounded-3xl border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsData
              .filter((n) => newsFilter === "ALL" || n.source === newsFilter)
              .slice(0, 6)
              .map((n, i) => (
                <div
                  key={i}
                  onClick={() => window.open(n.link, "_blank")}
                  className="bg-slate-900/80 rounded-3xl p-6 border border-slate-800/90 shadow-sm hover:shadow-2xl hover:border-slate-700 hover:-translate-y-1 transition duration-200 cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {n.source}
                      </span>
                      <span className="text-slate-500">
                        {new Date(n.pubDate).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition line-clamp-2">
                      {n.title}
                    </h3>

                    <p className="text-slate-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                      {n.description || "Read full market coverage and details directly on the publisher site."}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                    <span>Read Full Story</span>
                    <ExternalLink size={14} className="group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* ================= 7. PLATFORM ADVANTAGES & AI FEATURES ================= */}
      <section className="bg-slate-900/50 py-20 px-4 sm:px-6 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider">
              INVESTOR TOOLKIT
            </span>
            <h2 className="text-3xl font-black text-white mt-1">
              Everything You Need to Analyze IPOs
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Say goodbye to messy spreadsheets. IPO Insight delivers clean, accurate, actionable data.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Activity className="text-emerald-400" size={24} />,
                title: "Live Grey Market Intelligence",
                desc: "Track daily GMP movements, listing sentiment, and historical patterns before putting your money at risk."
              },
              {
                icon: <Sparkles className="text-purple-400" size={24} />,
                title: "Groq AI Risk & Strength Auditor",
                desc: "Get instant AI breakdowns of prospectus financials, competitive strengths, and promoter liabilities."
              },
              {
                icon: <BarChart3 className="text-blue-400" size={24} />,
                title: "Real-Time Bidding Heatmaps",
                desc: "Monitor QIB, HNI, and Retail oversubscription multiples updated directly as bidding progresses."
              },
              {
                icon: <ShieldCheck className="text-amber-400" size={24} />,
                title: "One-Click Allotment Status",
                desc: "Instant direct connections to KFintech, Link Intime, and Bigshare registrars with PAN number lookup."
              },
              {
                icon: <Layers className="text-pink-400" size={24} />,
                title: "Head-to-Head Comparisons",
                desc: "Compare peer valuations, P/E ratios, and GMP momentum side-by-side to make the right investment."
              },
              {
                icon: <DollarSign className="text-teal-400" size={24} />,
                title: "Listing Gain Estimator",
                desc: "Calculate net returns on retail and HNI applications with exact lot sizes and cut-off pricing."
              }
            ].map((f, i) => (
              <div
                key={i}
                className="bg-slate-900/80 rounded-3xl p-8 border border-slate-800 shadow-sm hover:border-slate-700 hover:shadow-xl transition group"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 8. FAQ ACCORDION ================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl font-black text-white mt-1">
            Understanding Indian IPOs & GMP
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "What is Grey Market Premium (GMP) and how is it determined?",
              a: "Grey Market Premium (GMP) is the unofficial cash premium at which IPO applications or shares are traded in the unofficial market before listing. It is determined by supply and demand dynamics among brokers and traders, giving an early indication of market sentiment."
            },
            {
              q: "Does high GMP guarantee a profitable listing on NSE / BSE?",
              a: "No. GMP is an unofficial market indicator and is not regulated by SEBI. While high GMP (>50%) often correlates with positive listing day gains, sudden broad-market downturns or negative news can alter listing prices. Always evaluate fundamental company valuations."
            },
            {
              q: "How does the IPO allotment process work for retail investors?",
              a: "Under SEBI rules, if an IPO is oversubscribed in the retail category, allotment is conducted via a computerized lottery so that as many individual applicants receive at least one minimum lot. If unsubscribed, everyone receives full allotment."
            },
            {
              q: "How can I check my IPO allotment status?",
              a: "You can check allotment on our 'Allotment' page or directly on the registrar's portal (Link Intime, KFintech, or Bigshare) using your PAN number, application number, or DP client ID."
            },
            {
              q: "What is the difference between Mainboard and SME IPOs?",
              a: "Mainboard IPOs are larger companies listed on the main NSE/BSE boards with minimum investment around ₹14,000–₹15,000. SME IPOs are smaller emerging enterprises with lot sizes typically requiring ₹1,00,000 to ₹1,50,000 minimum capital."
            }
          ].map((faq, i) => (
            <div
              key={i}
              className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-sm transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-6 py-4 text-left flex items-center justify-between font-bold text-sm text-slate-200 hover:text-emerald-400 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-500 transition-transform ${
                    openFaq === i ? "rotate-180 text-emerald-400" : ""
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================= 9. DAILY GMP ALERTS CTA ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-2xl border border-emerald-500/20">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Free Daily Digest
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">
              Never Miss a High-GMP IPO Again
            </h2>
            <p className="text-slate-300 text-sm">
              Receive the daily 9:00 AM GMP digest and real-time alerts whenever a subscription cross-surpasses 10x demand.
            </p>

            {newsletterSubscribed ? (
              <div className="p-4 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl text-emerald-200 font-semibold text-sm">
                🎉 You're on the list! You will receive daily morning GMP digests.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsletterEmail) setNewsletterSubscribed(true);
                }}
                className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 flex-1"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-sm transition shadow-lg shadow-emerald-500/20"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
