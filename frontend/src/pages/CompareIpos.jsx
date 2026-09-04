import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchIpos } from "../services/api";
import ApplyIpoModal from "../components/ApplyIpoModal";
import {
  Scale,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Send,
  Calendar,
  Layers,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Bot,
  HelpCircle,
  Clock,
  Info
} from "lucide-react";

export default function CompareIpos() {
  const navigate = useNavigate();

  const [ipos, setIpos] = useState([]);
  const [selectedIpos, setSelectedIpos] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI states
  const [aiSummary, setAiSummary] = useState("");
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatReply, setChatReply] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  // Apply Modal
  const [applyModalIpo, setApplyModalIpo] = useState(null);

  /* ================= FETCH IPOs ================= */
  useEffect(() => {
    setLoading(true);
    fetchIpos()
      .then(data => {
        const list = Array.isArray(data) ? data : Array.isArray(data?.ipos) ? data.ipos : [];
        setIpos(list);
        // Pre-select first 2 IPOs if available
        if (list.length >= 2) {
          setSelectedIpos(list.slice(0, 2));
        } else if (list.length === 1) {
          setSelectedIpos([list[0]]);
        }
      })
      .catch(err => {
        console.error("Failed to load IPOs for comparison:", err);
        setIpos([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /* ================= HELPERS ================= */
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

  const getLotProfit = ipo => {
    const gmp = ipo.gmp || 0;
    const lot = ipo.lotSize || 1;
    return gmp * lot;
  };

  /* ================= SELECT / DESELECT ================= */
  const toggleIpo = ipo => {
    const exists = selectedIpos.find(i => i._id === ipo._id);
    if (exists) {
      if (selectedIpos.length <= 1) {
        alert("Please keep at least 1 IPO selected for comparison.");
        return;
      }
      setSelectedIpos(selectedIpos.filter(i => i._id !== ipo._id));
      setAiSummary("");
    } else {
      if (selectedIpos.length >= 3) {
        alert("You can compare up to 3 IPOs side-by-side.");
        return;
      }
      setSelectedIpos([...selectedIpos, ipo]);
      setAiSummary("");
    }
  };

  /* ================= AUTO-SELECT TOP 2 ================= */
  const handleAutoSelectTop = () => {
    if (ipos.length < 2) return;
    const sorted = [...ipos].sort((a, b) => (b.gmp || 0) - (a.gmp || 0));
    setSelectedIpos(sorted.slice(0, 2));
    setAiSummary("");
  };

  /* ================= AI COMPARISON (GROQ WITH FALLBACK) ================= */
  const runAiComparison = async () => {
    if (selectedIpos.length < 2) {
      alert("Please select at least 2 IPOs to generate a comparative analysis.");
      return;
    }

    setLoadingAi(true);
    setAiSummary("");

    try {
      const res = await fetch("http://localhost:5000/api/ai/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Compare these IPOs for retail investors: ${selectedIpos
            .map(
              i =>
                `${i.companyName} (Price: ${i.priceBand}, GMP: ₹${i.gmp}, Sub: ${i.subscription?.total || "N/A"}x, Size: ${i.issueSize})`
            )
            .join(" vs ")}. Provide: 1. Valuation & Listing Gain verdict, 2. Subscription demand risk, 3. Clear winner recommendation for safe retail allotment.`,
          ipos: selectedIpos
        })
      });

      const data = await res.json();
      if (data.reply) {
        setAiSummary(data.reply);
      } else {
        throw new Error("Empty reply");
      }
    } catch {
      // Heuristic fallback analysis
      const bestGmpIpo = [...selectedIpos].sort((a, b) => getGmpPct(b) - getGmpPct(a))[0];
      const bestSubIpo = [...selectedIpos].sort(
        (a, b) => (b.subscription?.total || 0) - (a.subscription?.total || 0)
      )[0];

      setAiSummary(`### 🤖 Intelligent Valuation & Bidding Verdict

**1. Listing Gain Potential:**
• **${bestGmpIpo.companyName}** is currently commanding the highest grey market premium with **+${getGmpPct(bestGmpIpo)}% (+₹${bestGmpIpo.gmp || 0})**, projecting strong listing day momentum.

**2. Institutional & Retail Demand:**
• **${bestSubIpo.companyName}** leads subscription traction at **${bestSubIpo.subscription?.total || "N/A"}x**, signaling solid QIB and retail book-building backing.

**3. Retail Investor Recommendation:**
• For **listing day pop**: Bid for **${bestGmpIpo.companyName}** at the upper cut-off price to maximize listing gains.
• For **allotment probability**: If demand is heavily skewed, applying across multiple unique family retail PAN cards will improve lottery chances.`);
    } finally {
      setLoadingAi(false);
    }
  };

  /* ================= AI CONTEXT CHAT ================= */
  const askAi = async e => {
    if (e) e.preventDefault();
    if (!chatQuestion.trim()) return;

    setLoadingChat(true);
    setChatReply("");

    try {
      const res = await fetch("http://localhost:5000/api/ai/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: chatQuestion,
          ipos: selectedIpos
        })
      });

      const data = await res.json();
      setChatReply(data.reply || "Analysis complete. Review the comparative table above.");
    } catch {
      setChatReply(
        `Based on the selected IPOs (${selectedIpos.map(i => i.companyName).join(", ")}): ${
          selectedIpos[0]?.companyName
        } provides a balanced risk-reward with ₹${selectedIpos[0]?.gmp || 0} GMP. Ensure bidding at cut-off price before 3:00 PM on closing day.`
      );
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden">
      {/* Glow shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 -right-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        
        {/* ================= BREADCRUMBS & BADGE ================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Link to="/" className="hover:text-emerald-400 transition">Home</Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 font-semibold">IPO Comparison Matrix</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Scale className="w-3.5 h-3.5" />
            <span>SIDE-BY-SIDE VALUATION & RISK ENGINE</span>
          </div>
        </div>

        {/* ================= HERO TITLE ================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Compare IPOs{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Side-by-Side
              </span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
              Evaluate valuations, price bands, GMP listing gains, institutional subscription demand, and fundamental risks across up to 3 active issues.
            </p>
          </div>

          {ipos.length >= 2 && (
            <button
              onClick={handleAutoSelectTop}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-emerald-400 text-xs font-bold transition flex items-center gap-1.5 shadow-md self-start lg:self-auto cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              ⚡ Auto-Pick Top 2 By GMP
            </button>
          )}
        </div>

        {/* ================= SELECTOR TRAY ================= */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>Select 2 to 3 IPOs to Compare</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-white font-bold text-[10px]">
                {selectedIpos.length} / 3 Selected
              </span>
            </h2>
            {selectedIpos.length > 0 && (
              <button
                onClick={() => setSelectedIpos([])}
                className="text-xs text-slate-500 hover:text-slate-300 transition"
              >
                Clear Selection
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {ipos.map(ipo => {
              const isSelected = selectedIpos.some(i => i._id === ipo._id);
              const gmpPct = getGmpPct(ipo);

              return (
                <div
                  key={ipo._id}
                  onClick={() => toggleIpo(ipo)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative ${
                    isSelected
                      ? "bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/50"
                      : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
                        {ipo.companyName?.charAt(0) || "I"}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs line-clamp-1">
                          {ipo.companyName}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {ipo.priceBand || "—"}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                        isSelected
                          ? "bg-emerald-500 border-emerald-500 text-slate-950"
                          : "border-slate-700 bg-slate-800/60 text-transparent"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 text-[11px]">
                    <span className="text-slate-400">GMP:</span>
                    <span className="font-bold text-emerald-400">
                      +₹{ipo.gmp || 0} (+{gmpPct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= SIDE-BY-SIDE COMPARISON TABLE ================= */}
        {selectedIpos.length >= 2 ? (
          <div className="mb-12 bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Detailed Metric Breakdown
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Side-by-side evaluation of fundamental parameters, listing gains, and quota demand
                </p>
              </div>

              {/* Run AI button in table header */}
              <button
                onClick={runAiComparison}
                disabled={loadingAi}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs transition shadow-md shadow-emerald-500/20 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
              >
                {loadingAi ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate AI Comparative Verdict</span>
                  </>
                )}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-6 min-w-[200px]">Parameter</th>
                    {selectedIpos.map(ipo => (
                      <th key={ipo._id} className="py-4 px-6 min-w-[240px]">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white text-sm">
                            {ipo.companyName}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ipo.board === "SME"
                                ? "bg-purple-500/15 text-purple-400"
                                : "bg-indigo-500/15 text-indigo-400"
                            }`}
                          >
                            {ipo.board || "MAINBOARD"}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/60 text-xs">
                  
                  {/* Category 1: Market & Pricing */}
                  <tr className="bg-slate-950/40">
                    <td colSpan={selectedIpos.length + 1} className="py-2.5 px-6 font-bold text-[11px] uppercase tracking-wider text-emerald-400">
                      1. Issue & Pricing Metrics
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-6 text-slate-400 font-medium">Price Band</td>
                    {selectedIpos.map(i => (
                      <td key={i._id} className="py-3.5 px-6 font-bold text-white text-sm">
                        {i.priceBand || "—"}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3.5 px-6 text-slate-400 font-medium">Issue Size</td>
                    {selectedIpos.map(i => (
                      <td key={i._id} className="py-3.5 px-6 font-semibold text-slate-200">
                        {i.issueSize || "—"}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3.5 px-6 text-slate-400 font-medium">Lot Size</td>
                    {selectedIpos.map(i => (
                      <td key={i._id} className="py-3.5 px-6 font-semibold text-slate-200">
                        {i.lotSize ? `${i.lotSize} Shares` : "—"}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3.5 px-6 text-slate-400 font-medium">Min Retail Investment</td>
                    {selectedIpos.map(i => (
                      <td key={i._id} className="py-3.5 px-6 font-bold text-white">
                        ₹{i.minInvestment?.toLocaleString("en-IN") || "—"}
                      </td>
                    ))}
                  </tr>

                  {/* Category 2: Grey Market & Listing Gains */}
                  <tr className="bg-slate-950/40">
                    <td colSpan={selectedIpos.length + 1} className="py-2.5 px-6 font-bold text-[11px] uppercase tracking-wider text-emerald-400">
                      2. Grey Market Premium (GMP) & Returns
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-6 text-slate-400 font-medium">Current GMP</td>
                    {selectedIpos.map(i => (
                      <td key={i._id} className="py-3.5 px-6">
                        <span className="font-extrabold text-emerald-400 text-sm">
                          +₹{i.gmp || 0}
                        </span>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3.5 px-6 text-slate-400 font-medium">Expected Listing Gain (%)</td>
                    {selectedIpos.map(i => {
                      const pct = getGmpPct(i);
                      return (
                        <td key={i._id} className="py-3.5 px-6">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            +{pct}%
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className="py-3.5 px-6 text-slate-400 font-medium">Est. Profit Per Lot</td>
                    {selectedIpos.map(i => (
                      <td key={i._id} className="py-3.5 px-6 font-bold text-emerald-400 text-sm">
                        ₹{getLotProfit(i).toLocaleString("en-IN")}
                      </td>
                    ))}
                  </tr>

                  {/* Category 3: Subscription Demand */}
                  <tr className="bg-slate-950/40">
                    <td colSpan={selectedIpos.length + 1} className="py-2.5 px-6 font-bold text-[11px] uppercase tracking-wider text-emerald-400">
                      3. Bidding Demand & Subscription Multiple
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-6 text-slate-400 font-medium">Total Subscription</td>
                    {selectedIpos.map(i => (
                      <td key={i._id} className="py-3.5 px-6">
                        <span className="font-bold text-indigo-400 text-sm">
                          {i.subscription?.total ? `${i.subscription.total}x` : "—"}
                        </span>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3.5 px-6 text-slate-400 font-medium">Retail (RII) Portion</td>
                    {selectedIpos.map(i => (
                      <td key={i._id} className="py-3.5 px-6 font-semibold text-slate-300">
                        {i.subscription?.retail ? `${i.subscription.retail}x` : "—"}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3.5 px-6 text-slate-400 font-medium">QIB Portion</td>
                    {selectedIpos.map(i => (
                      <td key={i._id} className="py-3.5 px-6 font-semibold text-slate-300">
                        {i.subscription?.qib ? `${i.subscription.qib}x` : "—"}
                      </td>
                    ))}
                  </tr>

                  {/* Category 4: Dates */}
                  <tr className="bg-slate-950/40">
                    <td colSpan={selectedIpos.length + 1} className="py-2.5 px-6 font-bold text-[11px] uppercase tracking-wider text-emerald-400">
                      4. Critical Dates
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-6 text-slate-400 font-medium">Bidding Closes</td>
                    {selectedIpos.map(i => (
                      <td key={i._id} className="py-3.5 px-6 font-medium text-slate-200">
                        {i.closeDate
                          ? new Date(i.closeDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })
                          : "TBA"}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3.5 px-6 text-slate-400 font-medium">Listing Date</td>
                    {selectedIpos.map(i => (
                      <td key={i._id} className="py-3.5 px-6 font-medium text-slate-200">
                        {i.listingDate
                          ? new Date(i.listingDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })
                          : "TBA"}
                      </td>
                    ))}
                  </tr>

                  {/* Category 5: Quick Apply & Details */}
                  <tr>
                    <td className="py-4 px-6 text-slate-400 font-medium">Direct Action</td>
                    {selectedIpos.map(i => (
                      <td key={i._id} className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setApplyModalIpo(i)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                          >
                            Apply Now
                          </button>
                          <button
                            onClick={() => navigate(`/ipos/${i._id}`)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                          >
                            Full Report
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center mb-12">
            <Info className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">
              Select At Least 2 IPOs
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Click on the cards above to choose 2 or 3 IPOs for side-by-side metric comparison.
            </p>
            <button
              onClick={handleAutoSelectTop}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Select Top 2 IPOs Automatically
            </button>
          </div>
        )}

        {/* ================= AI COMPARISON VERDICT SECTION ================= */}
        {aiSummary && (
          <div className="mb-12 bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl animate-fade-in relative">
            <div className="flex items-center gap-2.5 mb-4 text-indigo-400">
              <Bot className="w-5 h-5" />
              <h3 className="font-bold text-white text-lg">
                AI Valuation & Bidding Verdict
              </h3>
            </div>
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/50 p-5 rounded-2xl border border-slate-800/80">
              {aiSummary}
            </div>
          </div>
        )}

        {/* ================= AI CONTEXT CHAT ASSISTANT ================= */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Ask AI Analyst About These IPOs
              </h3>
              <p className="text-xs text-slate-400">
                Ask specific questions like "Which has higher listing probability?" or "What are the key financial risks?"
              </p>
            </div>
          </div>

          <form onSubmit={askAi} className="flex gap-2 mb-4">
            <input
              type="text"
              value={chatQuestion}
              onChange={e => setChatQuestion(e.target.value)}
              placeholder="e.g. Which IPO should a retail investor bid for and at what price?"
              className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
            />
            <button
              type="submit"
              disabled={loadingChat || !chatQuestion.trim()}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer flex-shrink-0"
            >
              {loadingChat ? (
                <span>Thinking...</span>
              ) : (
                <>
                  <span>Ask AI</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {chatReply && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line animate-fade-in">
              <span className="font-bold text-emerald-400 block mb-1">AI Recommendation:</span>
              {chatReply}
            </div>
          )}
        </div>

      </div>

      {/* ================= APPLY MODAL ================= */}
      {applyModalIpo && (
        <ApplyIpoModal
          ipo={applyModalIpo}
          onClose={() => setApplyModalIpo(null)}
        />
      )}
    </div>
  );
}
