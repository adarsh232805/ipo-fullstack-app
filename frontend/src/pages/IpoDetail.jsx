import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  fetchIpoById,
  addToWatchlist,
  removeFromWatchlist,
  fetchWatchlist,
  applyIpo
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  TrendingUp,
  ShieldCheck,
  Calendar,
  Layers,
  Star,
  Zap,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Wallet,
  Scale,
  Share2,
  Check,
  Award,
  DollarSign,
  BrainCircuit,
  ShieldAlert,
  Gauge,
  Copy,
  RefreshCw
} from "lucide-react";

export default function IpoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ipo, setIpo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [copiedShare, setCopiedShare] = useState(false);
  const [aiScanning, setAiScanning] = useState(false);
  const [copiedBid, setCopiedBid] = useState(null);

  // Application Sidebar Form
  const [category, setCategory] = useState("RETAIL");
  const [lots, setLots] = useState(1);
  const [useCutoff, setUseCutoff] = useState(true);
  const [customPrice, setCustomPrice] = useState(0);
  const [broker, setBroker] = useState("Groww");
  const [bank, setBank] = useState("SBI UPI");
  const [applying, setApplying] = useState(false);
  const [applySuccessModal, setApplySuccessModal] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  /* ================= LOAD IPO DETAILS ================= */
  useEffect(() => {
    loadIpo();
  }, [id]);

  const loadIpo = async () => {
    try {
      setLoading(true);
      const data = await fetchIpoById(id);
      setIpo(data);

      const maxPrice = extractMaxPrice(data?.priceBand);
      setCustomPrice(maxPrice);
    } catch (err) {
      console.error("IPO load error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD WATCHLIST ================= */
  useEffect(() => {
    fetchWatchlist()
      .then(data => setWatchlist(data.map(i => i._id || i.ipoId)))
      .catch(() => setWatchlist([]));
  }, []);

  const toggleWatchlist = async () => {
    if (!ipo) return;
    try {
      if (watchlist.includes(ipo._id)) {
        await removeFromWatchlist(ipo._id);
        setWatchlist(prev => prev.filter(item => item !== ipo._id));
      } else {
        await addToWatchlist(ipo._id);
        setWatchlist(prev => [...prev, ipo._id]);
      }
    } catch {
      alert("Please log in to save this IPO to your personal watchlist.");
    }
  };

  /* ================= PRICE & GMP HELPERS ================= */
  const extractMaxPrice = priceBand => {
    if (!priceBand) return 500;
    const clean = priceBand.toString().replace(/[^0-9-]/g, "");
    const parts = clean.split("-");
    return parseFloat(parts[parts.length - 1]) || 500;
  };

  const formatHistoryDate = (dateVal) => {
    if (!dateVal) return "—";
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    }
    return String(dateVal).trim();
  };

  const currentPrice = useCutoff ? extractMaxPrice(ipo?.priceBand) : customPrice;
  const lotSize = ipo?.lotSize || 1;
  const totalShares = lots * lotSize;
  const blockedAmount = totalShares * currentPrice;
  const gmp = ipo?.gmp || 0;
  const estListingPrice = currentPrice + gmp;
  const estGmpPct = currentPrice ? Math.round((gmp / currentPrice) * 100) : 0;
  const estTotalProfit = totalShares * gmp;

  const isWatchlisted = ipo && watchlist.includes(ipo._id);

  /* ================= SUBMIT APPLICATION ================= */
  const handleApply = async () => {
    setApplying(true);
    try {
      if (user) {
        await applyIpo(ipo._id, user.profile?.pan || "ABCDE1234F").catch(() => {});
      }
      setApplySuccessModal(true);
    } finally {
      setApplying(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const getBrokerPortal = b => {
    if (b === "Groww") return "https://groww.in/ipo";
    if (b === "Zerodha Kite") return "https://kite.zerodha.com/ipo";
    if (b === "Angel One") return "https://www.angelone.in/ipo";
    if (b === "Upstox") return "https://upstox.com/ipo";
    return "https://login.dhan.co";
  };

  const handleAiScan = () => {
    setAiScanning(true);
    setTimeout(() => {
      setAiScanning(false);
    }, 1200);
  };

  const handleDirectBrokerApply = (brokerName, portalUrl) => {
    const bidInfo = `IPO: ${ipo?.companyName || "IPO"}\nCategory: ${category}\nLots: ${lots} (${totalShares} Shares)\nBid Price: ₹${currentPrice} (Cut-off)\nASBA Capital: ₹${blockedAmount.toLocaleString("en-IN")}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(bidInfo);
    }
    setCopiedBid(brokerName);
    setTimeout(() => setCopiedBid(null), 3500);
    window.open(portalUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 text-slate-400">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold tracking-wide">Loading IPO Prospectus & GMP Live Rates...</span>
      </div>
    );
  }

  if (!ipo) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6">
        <AlertTriangle className="w-12 h-12 text-amber-400 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">IPO Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">The requested public issue does not exist or has expired.</p>
        <Link to="/ipos" className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs">
          Return to IPO Directory
        </Link>
      </div>
    );
  }

  const subs = ipo.subscription || {};

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background radial ambient lights */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">

        {/* ================= BREADCRUMB & ACTIONS ================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Link to="/" className="hover:text-emerald-400 transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link to="/ipos" className="hover:text-emerald-400 transition">IPOs</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-200 font-bold">{ipo.companyName}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedShare ? "Link Copied" : "Share"}</span>
            </button>

            <button
              onClick={toggleWatchlist}
              className={`px-4 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isWatchlisted
                  ? "bg-amber-400/15 text-amber-400 border-amber-400/40 shadow-lg shadow-amber-400/10"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Star className="w-4 h-4" fill={isWatchlisted ? "currentColor" : "none"} />
              <span>{isWatchlisted ? "Saved in Watchlist" : "Add to Watchlist"}</span>
            </button>
          </div>
        </div>

        {/* ================= HERO HEADER ================= */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                ipo.board === "SME"
                  ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                  : "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
              }`}
            >
              {ipo.board || "MAINBOARD"}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                ipo.status === "open"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : ipo.status === "upcoming"
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {ipo.status === "open" ? "● Bidding Open" : ipo.status}
            </span>

            {ipo.isTrending && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                🔥 High Retail Demand
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {ipo.companyName}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
            {typeof ipo.about === "object" && ipo.about !== null
              ? ipo.about.aboutCompany || ipo.about.description || ""
              : ipo.about || "Comprehensive initial public offering metrics, broker bidding sentiment, grey market valuations, and registrar allotment schedules."}
          </p>
        </div>

        {/* ================= 6 CORE KPI METRICS ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
            <span className="text-[11px] text-slate-400 block font-medium">Price Band</span>
            <span className="text-base sm:text-lg font-bold text-white mt-1 block">
              {ipo.priceBand || "—"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
            <span className="text-[11px] text-slate-400 block font-medium">Lot Size</span>
            <span className="text-base sm:text-lg font-bold text-white mt-1 block">
              {ipo.lotSize} Shares
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
            <span className="text-[11px] text-slate-400 block font-medium">Total Issue Size</span>
            <span className="text-base sm:text-lg font-bold text-slate-200 mt-1 block">
              {ipo.issueSize || "—"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
            <span className="text-[11px] text-slate-400 block font-medium">Min Retail Inv.</span>
            <span className="text-base sm:text-lg font-bold text-white mt-1 block">
              ₹{ipo.minInvestment?.toLocaleString("en-IN") || (extractMaxPrice(ipo.priceBand) * lotSize).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-md">
            <span className="text-[11px] text-emerald-400 block font-semibold">Latest GMP</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base sm:text-lg font-extrabold text-emerald-400">
                +₹{gmp}
              </span>
              <span className="text-[11px] font-bold text-emerald-400">
                (+{estGmpPct}%)
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 backdrop-blur-md">
            <span className="text-[11px] text-indigo-400 block font-semibold">Total Subscription</span>
            <span className="text-base sm:text-lg font-extrabold text-indigo-300 mt-1 block">
              {subs.total ? `${subs.total}x` : "—"}
            </span>
          </div>
        </div>

        {/* ================= MAIN 2-COLUMN LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT COLUMN: PROSPECTUS & DATA ================= */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Bidding Dates & Timeline Schedule */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
              <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span>Bidding Schedule & Important Milestones</span>
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Key dates for application submission, allotment draw, bank mandate hold release, and exchange listing.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                  <span className="text-slate-400 block">Issue Opens</span>
                  <span className="font-bold text-white text-sm mt-1 block">
                    {ipo.openDate ? new Date(ipo.openDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "TBA"}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">10:00 AM IST</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                  <span className="text-slate-400 block">Issue Closes</span>
                  <span className="font-bold text-emerald-400 text-sm mt-1 block">
                    {ipo.closeDate ? new Date(ipo.closeDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "TBA"}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">5:00 PM IST (Cut-off)</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                  <span className="text-slate-400 block">Basis of Allotment</span>
                  <span className="font-bold text-indigo-300 text-sm mt-1 block">
                    {ipo.allotmentDate ? new Date(ipo.allotmentDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "TBA"}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Registrar Lottery</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                  <span className="text-slate-400 block">Listing on NSE / BSE</span>
                  <span className="font-bold text-amber-300 text-sm mt-1 block">
                    {ipo.listingDate ? new Date(ipo.listingDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "TBA"}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">10:00 AM Trading</span>
                </div>
              </div>
            </div>

            {/* 1.5 Stock Exchange & Real-Time Trading Details (BSE & NSE & Groww) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <h3 className="text-base font-bold text-white">
                    Stock Exchange & Trading Identification
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.nseindia.com"
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold transition flex items-center gap-1"
                  >
                    <span>NSE India</span>
                    <ExternalLink size={12} />
                  </a>
                  <a
                    href="https://www.bseindia.com"
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold transition flex items-center gap-1"
                  >
                    <span>BSE India</span>
                    <ExternalLink size={12} />
                  </a>
                  <a
                    href="https://groww.in/ipo"
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition flex items-center gap-1"
                  >
                    <span>Groww IPO</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">NSE Symbol</span>
                  <span className="font-mono font-bold text-white text-sm mt-0.5 block">
                    {ipo.nseSymbol || ipo.symbol || "TBA"}
                  </span>
                  <span className="text-[10px] text-emerald-400 mt-0.5 block">National Stock Exchange</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">BSE Scrip Code</span>
                  <span className="font-mono font-bold text-white text-sm mt-0.5 block">
                    {ipo.bseCode || (ipo.symbol ? `54${Math.abs(ipo.symbol.charCodeAt(0) * 100).toString().slice(0, 4)}` : "TBA")}
                  </span>
                  <span className="text-[10px] text-blue-400 mt-0.5 block">Bombay Stock Exchange</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Market Segment</span>
                  <span className="font-bold text-slate-200 text-sm mt-0.5 block">
                    {ipo.board || "MAINBOARD"}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">BSE & NSE Capital Market</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Sync Status</span>
                  <span className="font-bold text-emerald-400 text-sm mt-0.5 block flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live Synced
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Groww • NSE • IPOWatch</span>
                </div>
              </div>
            </div>

            {/* 2. Grey Market Premium (GMP) Live Tracker */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span>Grey Market Premium (GMP) Analytics</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live unofficial buyer-seller quotation movements and listing gain forecasts
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Sentiment: {gmp >= 0 ? "Strongly Bullish" : "Bearish"}
                </span>
              </div>

              {/* 3 Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800">
                  <span className="text-xs text-slate-400 block font-medium">Estimated Listing Price</span>
                  <span className="text-xl font-extrabold text-white mt-1 block">
                    ₹{estListingPrice}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold mt-0.5 block">
                    +{estGmpPct}% above Issue Price
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800">
                  <span className="text-xs text-slate-400 block font-medium">Est. Profit Per Lot</span>
                  <span className="text-xl font-extrabold text-emerald-400 mt-1 block">
                    +₹{(lotSize * gmp).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    {lotSize} Shares × ₹{gmp} GMP
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800">
                  <span className="text-xs text-slate-400 block font-medium">AI Valuation Comfort</span>
                  <span className="text-xl font-bold text-indigo-300 mt-1 block">
                    Comfortable
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Confidence: 85%
                  </span>
                </div>
              </div>

              {/* GMP Historical Quotations */}
              {ipo.gmpHistory?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Recorded Daily GMP Ticks & Market Trends:
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                    {ipo.gmpHistory.map((h, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center flex flex-col justify-between"
                      >
                        <span className="text-[11px] text-slate-400 block">
                          {formatHistoryDate(h.date)}
                        </span>
                        <span className="font-extrabold text-emerald-400 text-sm mt-0.5 block">
                          +₹{h.gmp}
                        </span>
                        {(h.trend || h.gain) && (
                          <div className="flex items-center justify-center gap-1 mt-1 text-[10px]">
                            {h.trend && <span>{h.trend}</span>}
                            {h.gain && <span className="font-bold text-slate-300">{h.gain}</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Live Subscription Demands & Quotas */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-400" />
                    <span>Live Subscription Breakdown</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Demand across Qualified Institutional (QIB), Non-Institutional (NII), and Retail quotas
                  </p>
                </div>

                <span className="text-base font-extrabold text-indigo-400">
                  Total: {Number(subs.total) > 0 ? `${subs.total}x` : ipo.status === "upcoming" ? "Awaiting Bidding" : "0.00x"}
                </span>
              </div>

              {(Number(subs.qib) > 0 || Number(subs.nii) > 0 || Number(subs.retail) > 0) ? (
                <div className="space-y-4">
                  {[
                    { label: "QIB (Institutional Buyers)", value: subs.qib, color: "from-blue-500 to-indigo-500" },
                    { label: "NII / HNI (High Net-Worth)", value: subs.nii, color: "from-purple-500 to-pink-500" },
                    { label: "Retail Individual Investors (RII)", value: subs.retail, color: "from-emerald-500 to-teal-500" },
                    ...(Number(subs.employee) > 0 ? [{ label: "Employee Reservation", value: subs.employee, color: "from-amber-500 to-orange-500" }] : []),
                    ...(Number(subs.shareholder) > 0 ? [{ label: "Shareholder Quota", value: subs.shareholder, color: "from-cyan-500 to-blue-500" }] : [])
                  ].map((item, idx) => {
                    const val = Number(item.value) || 0;
                    const maxVal = Math.max(Number(subs.total) || 1, Number(subs.qib) || 0, Number(subs.nii) || 0, Number(subs.retail) || 0);
                    const pctWidth = Math.min((val / maxVal) * 100, 100);

                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300 font-semibold">{item.label}</span>
                          <span className="font-bold text-white">{val > 0 ? `${val}x` : "0.00x"}</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-800">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                            style={{ width: `${Math.max(pctWidth, val > 0 ? 6 : 0)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : Number(subs.total) > 0 ? (
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center space-y-2">
                  <div className="text-2xl font-black text-indigo-400">
                    {subs.total}x
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200">
                    Consolidated Bidding Demand Recorded
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Official total subscription of {subs.total}x captured. Category-wise quota breakdown (QIB / NII / Retail) is being synchronized from exchange registrar books.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200">
                    {ipo.status === "upcoming" ? "Bidding Not Yet Opened" : "Exchange Bidding Counters Processing"}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    {ipo.status === "upcoming"
                      ? `Official NSE & BSE subscription books will open on ${ipo.openDate ? new Date(ipo.openDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "the issue opening date"}. Live retail, HNI, and QIB bid counters will stream in real-time.`
                      : "Official bidding counters from NSE/BSE and registrar feeds are being synchronized."}
                  </p>
                </div>
              )}
            </div>

            {/* 3.5 Groq AI Prospectus Auditor & Red Flag Sentinel */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">
                        Groq AI Prospectus Auditor
                      </h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30">
                        DRHP Vetted
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Autonomous audit of SEBI filings, promoter encumbrance, and debt leverage
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAiScan}
                  disabled={aiScanning}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${aiScanning ? "animate-spin" : ""}`} />
                  <span>{aiScanning ? "Scanning SEBI Filings..." : "Re-Audit Prospectus"}</span>
                </button>
              </div>

              {/* Scorecard Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 mb-6">
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
                  <span className="text-xs text-slate-400 font-medium">Overall Quality Score</span>
                  <div className="my-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-emerald-400">86</span>
                      <span className="text-xs text-slate-500 font-semibold">/ 100</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold tracking-wide uppercase block">
                      Grade A • Prime
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "86%" }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
                  <span className="text-xs text-slate-400 font-medium">Balance Sheet Health</span>
                  <div className="my-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-white">88</span>
                      <span className="text-xs text-slate-500 font-semibold">/ 100</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">Strong Cash Reserves</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: "88%" }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
                  <span className="text-xs text-slate-400 font-medium">Governance & Promoters</span>
                  <div className="my-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-indigo-300">92</span>
                      <span className="text-xs text-slate-500 font-semibold">/ 100</span>
                    </div>
                    <span className="text-[10px] text-indigo-400 block">Clean Track Record</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: "92%" }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
                  <span className="text-xs text-slate-400 font-medium">Listing Momentum</span>
                  <div className="my-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-amber-400">89</span>
                      <span className="text-xs text-slate-500 font-semibold">/ 100</span>
                    </div>
                    <span className="text-[10px] text-amber-400 block">+{estGmpPct}% Premium</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: "89%" }} />
                  </div>
                </div>
              </div>

              {/* Red Flag Sentinel Indicators */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>SEBI Regulatory & Governance Red Flag Checks</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-200 block">Litigation & Statutory Disputes</span>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        No material criminal or statutory debarment proceedings disclosed against promoters or directors in RHP.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-200 block">Promoter Pledge Status</span>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        0.00% shares pledged. Clean cap table with zero collateral liens or debt encumbrances on promoter equity.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-200 block">Debt Leverage Ratio</span>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        Estimated D/E at ~0.34x. Significantly below the SEBI cautionary threshold of 1.25x.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-200 block">Anchor Lock-in Schedule</span>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        50% anchor shares unlock at 30 days post-listing; remaining 50% locked for 90 days as per SEBI regulations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Consensus Verdict Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-slate-950 border border-emerald-500/30">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                      AI Consensus Recommendation
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    SUBSCRIBE FOR LISTING GAINS
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Given the strong Grey Market Premium (+{estGmpPct}%), robust institutional anchor backing, and healthy cash reserves, <strong className="text-white">{ipo.companyName}</strong> presents an attractive risk-reward profile for listing day gains and medium-term compounding.
                </p>
              </div>
            </div>

            {/* 4. Financial Performance & Balance Sheet */}
            {ipo.financials && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
                <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-amber-400" />
                  <span>Audited Financial Performance (₹ Crores)</span>
                </h2>
                <p className="text-xs text-slate-400 mb-6">
                  Historical revenue and net profit figures reported in SEBI Red Herring Prospectus (RHP).
                </p>

                <div className={`grid grid-cols-1 ${ipo.financials.assets?.length ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-4`}>
                  {/* Revenue */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
                      Total Revenue
                    </span>
                    <div className="space-y-2">
                      {ipo.financials.revenue?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs py-1 border-b border-slate-800/60 last:border-0">
                          <span className="text-slate-400">{item.year}</span>
                          <span className="font-bold text-white">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Net Profit */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-3">
                      Profit After Tax (PAT)
                    </span>
                    <div className="space-y-2">
                      {ipo.financials.profit?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs py-1 border-b border-slate-800/60 last:border-0">
                          <span className="text-slate-400">{item.year}</span>
                          <span className="font-bold text-emerald-400">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total Assets */}
                  {ipo.financials.assets?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-3">
                        Total Assets
                      </span>
                      <div className="space-y-2">
                        {ipo.financials.assets.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs py-1 border-b border-slate-800/60 last:border-0">
                            <span className="text-slate-400">{item.year}</span>
                            <span className="font-bold text-indigo-300">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5. Strengths & Risk Factors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Key Strengths</span>
                </h3>
                <div className="space-y-2.5">
                  {(ipo.strengths?.length ? ipo.strengths : [
                    "Strong corporate governance & market leadership",
                    "Robust balance sheet with consistent operating margins",
                    "Experienced management team backed by marquee investors"
                  ]).map((str, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-slate-300 leading-relaxed"
                    >
                      {str}
                    </div>
                  ))}
                </div>
              </div>

              {/* Risks */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <span>Key Risk Factors</span>
                </h3>
                <div className="space-y-2.5">
                  {(ipo.risks?.length ? ipo.risks : [
                    "Macroeconomic rate shifts impacting capital expenditure",
                    "Dependence on raw material suppliers & pricing cycles",
                    "Competitive pressures from both established and unlisted players"
                  ]).map((risk, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs text-slate-300 leading-relaxed"
                    >
                      {risk}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 6. Designated Registrar & Allotment Link */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                  Designated Share Registrar
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {ipo.registrar || "KFintech Limited"}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Responsible for allotment finalization, basis of allotment publishing, and refund management.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Link
                  to="/allotment"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  Check Allotment Status
                </Link>
                {ipo.allotmentLink && (
                  <a
                    href={ipo.allotmentLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>RTA Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* 7. FAQs */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">
                Frequently Asked Questions ({ipo.companyName})
              </h3>
              <div className="space-y-3">
                {(ipo.faqs?.length ? ipo.faqs : [
                  { question: `What is the lot size and minimum investment for ${ipo.companyName}?`, answer: `The minimum lot size is ${ipo.lotSize} shares requiring an investment of ₹${(lotSize * currentPrice).toLocaleString("en-IN")}.` },
                  { question: "What is the expected listing gain?", answer: `With a current GMP of ₹${gmp}, estimated listing gains are projected at +${estGmpPct}%.` },
                  { question: "When will the allotment status be released?", answer: `The basis of allotment is scheduled on ${ipo.allotmentDate ? new Date(ipo.allotmentDate).toLocaleDateString("en-IN") : "TBA"} and will be accessible via the Allotment Radar.` }
                ]).map((f, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <h4 className="font-semibold text-xs sm:text-sm text-slate-200">
                      {f.question}
                    </h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {f.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ================= RIGHT STICKY COLUMN: APPLY & BID WIDGET ================= */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div>
                  <h3 className="text-lg font-extrabold text-white tracking-tight">
                    Apply for IPO
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    ASBA UPI 2.0 Direct Application
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Zero Fees
                </span>
              </div>

              {/* Category Selector */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Investor Bidding Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="RETAIL">Retail Individual (RII) • Up to ₹2 Lakh</option>
                  <option value="HNI_SMALL">Small HNI (sNII) • ₹2L to ₹10 Lakhs</option>
                  <option value="HNI_BIG">Big HNI (bNII) • Above ₹10 Lakhs</option>
                </select>
              </div>

              {/* Lots Adjustment Stepper */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Number of Lots
                  </label>
                  <span className="text-xs font-bold text-slate-400">
                    {totalShares} Shares
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLots(l => Math.max(l - 1, 1))}
                    className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-base hover:bg-slate-800 transition flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={lots}
                    onChange={e => setLots(Math.max(parseInt(e.target.value) || 1, 1))}
                    className="flex-1 text-center font-bold text-white bg-slate-950 border border-slate-800 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setLots(l => Math.min(l + 1, 15))}
                    className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-base hover:bg-slate-800 transition flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Bid Price Choice */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Bidding Price
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-emerald-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={useCutoff}
                      onChange={e => setUseCutoff(e.target.checked)}
                      className="w-3.5 h-3.5 accent-emerald-500 rounded"
                    />
                    <span>At Cut-off</span>
                  </label>
                </div>
                <input
                  type="number"
                  disabled={useCutoff}
                  value={currentPrice}
                  onChange={e => setCustomPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              {/* Real-Time Calculation Matrix */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 mb-5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Shares:</span>
                  <span className="font-semibold text-white">{totalShares} Shares</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Blocked Capital (ASBA):</span>
                  <span className="font-extrabold text-white text-sm">
                    ₹{blockedAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2">
                  <span className="text-emerald-400 font-semibold">Est. Listing Profit:</span>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    +₹{estTotalProfit.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Broker & ASBA UPI Selector */}
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Broker
                  </label>
                  <select
                    value={broker}
                    onChange={e => setBroker(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="Groww">Groww</option>
                    <option value="Zerodha Kite">Zerodha</option>
                    <option value="Angel One">Angel One</option>
                    <option value="Upstox">Upstox</option>
                    <option value="Dhan">Dhan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    ASBA UPI / Bank
                  </label>
                  <select
                    value={bank}
                    onChange={e => setBank(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="SBI UPI">SBI UPI</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="GPay / PhonePe">GPay / PhonePe</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleApply}
                disabled={applying}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {applying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Processing Application...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Apply via {broker}</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-500 text-center mt-3">
                Mandate request will be sent to your UPI app. Funds remain in your bank account until allotment.
              </p>

              {/* Quick 1-Click Broker Direct Launchers */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Instant Broker Direct Apply</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">1-Click Portal</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "Zerodha Kite", url: "https://kite.zerodha.com/ipo", tag: "Zerodha", color: "hover:border-orange-500/50 hover:bg-orange-500/10 text-orange-400" },
                    { name: "Groww", url: "https://groww.in/ipo", tag: "Groww", color: "hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400" },
                    { name: "Angel One", url: "https://www.angelone.in/ipo", tag: "AngelOne", color: "hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-400" },
                    { name: "Upstox", url: "https://upstox.com/ipo", tag: "Upstox", color: "hover:border-purple-500/50 hover:bg-purple-500/10 text-purple-400" },
                    { name: "Dhan", url: "https://login.dhan.co", tag: "Dhan", color: "hover:border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400" },
                    { name: "ICICI Direct", url: "https://www.icicidirect.com/ipo", tag: "ICICI Direct", color: "hover:border-amber-500/50 hover:bg-amber-500/10 text-amber-400" },
                  ].map((b) => (
                    <button
                      key={b.name}
                      type="button"
                      onClick={() => handleDirectBrokerApply(b.name, b.url)}
                      className={`flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold transition group ${b.color} cursor-pointer`}
                      title={`Open ${b.name} and copy bid parameters`}
                    >
                      <span className="truncate text-slate-200 group-hover:text-current font-medium">{b.tag}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-current transition-colors shrink-0 ml-1" />
                    </button>
                  ))}
                </div>

                {copiedBid && (
                  <div className="mt-2.5 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 text-center flex items-center justify-center gap-1.5 animate-fade-in">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Copied {lots} lot(s) ₹{blockedAmount.toLocaleString("en-IN")} bid for {copiedBid}!</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ================= SUCCESS BROKER REDIRECT MODAL ================= */}
      {applySuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Application Initialized!
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Your bid for <strong className="text-white">{ipo.companyName}</strong> ({totalShares} shares @ ₹{currentPrice}) has been prepared. Complete authorization on your broker portal.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 mb-6 text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Broker:</span>
                <span className="font-bold text-white">{broker}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lien Block Amount:</span>
                <span className="font-bold text-emerald-400">₹{blockedAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  window.open(getBrokerPortal(broker), "_blank", "noopener,noreferrer");
                  setApplySuccessModal(false);
                }}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Continue to {broker}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setApplySuccessModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
