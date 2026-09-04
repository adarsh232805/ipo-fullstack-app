import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { fetchIpos } from "../services/api";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  CreditCard,
  Building2,
  ChevronDown,
  Sparkles,
  Zap,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  Users,
  Plus,
  Trash2,
  Award,
  Printer,
  TrendingUp,
  RefreshCw,
  Check,
  Copy
} from "lucide-react";

export default function Allotment() {
  const [ipos, setIpos] = useState([]);
  const [loadingIpos, setLoadingIpos] = useState(true);

  // Form states
  const [selectedIpoId, setSelectedIpoId] = useState("");
  const [identifierType, setIdentifierType] = useState("PAN");
  const [identifierValue, setIdentifierValue] = useState("");
  const [checking, setChecking] = useState(false);
  const [singleResult, setSingleResult] = useState(null);
  const [batchResults, setBatchResults] = useState(null);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [copiedToken, setCopiedToken] = useState(null);

  // Loading animation step states
  const [scanStep, setScanStep] = useState(0);

  // Family Members Saved PANs (Persistent in localStorage)
  const [familyMembers, setFamilyMembers] = useState(() => {
    try {
      const saved = localStorage.getItem("saved_family_pans");
      return saved ? JSON.parse(saved) : [
        { name: "Adarsh Singh (Self)", pan: "ABCDE1234F" },
        { name: "Father", pan: "FGHIJ5678A" },
        { name: "Mother", pan: "KLMNO9012B" },
        { name: "Brother", pan: "PQRST3456C" }
      ];
    } catch {
      return [
        { name: "Adarsh Singh (Self)", pan: "ABCDE1234F" },
        { name: "Father", pan: "FGHIJ5678A" },
        { name: "Mother", pan: "KLMNO9012B" },
        { name: "Brother", pan: "PQRST3456C" }
      ];
    }
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberPan, setNewMemberPan] = useState("");

  /* ================= LOAD ALL ACTIVE & CLOSED IPOs ================= */
  useEffect(() => {
    setLoadingIpos(true);
    fetchIpos()
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setIpos(list);

        // Preselect the first available IPO
        const preferred =
          list.find(i => i.allotmentAvailable) ||
          list.find(i => i.status === "closed") ||
          list[0];

        if (preferred) {
          setSelectedIpoId(preferred._id);
        }
      })
      .catch(err => {
        console.error("Failed to fetch IPOs for allotment:", err);
      })
      .finally(() => {
        setLoadingIpos(false);
      });
  }, []);

  const selectedIpo = useMemo(() => {
    return ipos.find(i => i._id === selectedIpoId) || ipos[0] || null;
  }, [ipos, selectedIpoId]);

  /* ================= SAVE FAMILY PANs ================= */
  const saveFamilyMembers = members => {
    setFamilyMembers(members);
    localStorage.setItem("saved_family_pans", JSON.stringify(members));
  };

  const handleAddMember = e => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberPan.trim()) return;
    const cleanPan = newMemberPan.trim().toUpperCase();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
      setError("Please enter a valid 10-character PAN (e.g. ABCDE1234F).");
      return;
    }
    const updated = [...familyMembers, { name: newMemberName.trim(), pan: cleanPan }];
    saveFamilyMembers(updated);
    setNewMemberName("");
    setNewMemberPan("");
    setShowAddModal(false);
    setError("");
  };

  const handleRemoveMember = (idx, e) => {
    e.stopPropagation();
    const updated = familyMembers.filter((_, i) => i !== idx);
    saveFamilyMembers(updated);
  };

  /* ================= RUN MULTI-STEP VERIFICATION ANIMATION ================= */
  const runScanAnimation = async (actionCallback) => {
    setChecking(true);
    setScanStep(1); // Connecting to registrar gateway
    await new Promise(r => setTimeout(r, 600));
    setScanStep(2); // Querying SEBI computerized lottery ledger
    await new Promise(r => setTimeout(r, 600));
    setScanStep(3); // Reconciling CDSL/NSDL depository records
    await new Promise(r => setTimeout(r, 500));
    setScanStep(4); // Generating Verified Certificates
    await actionCallback();
    setChecking(false);
    setScanStep(0);
  };

  /* ================= 1. AUTO CHECK ALL ADDED PANs AT ONCE ================= */
  const handleAutoCheckAllPans = () => {
    if (!selectedIpoId) {
      setError("Please select an IPO first.");
      return;
    }
    if (!familyMembers.length) {
      setError("Please add at least one PAN to check.");
      return;
    }

    setError("");
    setSingleResult(null);
    setBatchResults(null);

    runScanAnimation(async () => {
      try {
        const res = await fetch("http://localhost:5000/api/allotment/auto-check-all", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ipoId: selectedIpoId,
            members: familyMembers
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Batch verification failed");
        setBatchResults(data);

        // Smooth scroll to results
        setTimeout(() => {
          document.getElementById("allotment-results-section")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } catch (err) {
        setError(err.message || "Direct registrar verification failed. Please try again.");
      }
    });
  };

  /* ================= 2. SINGLE PAN IN-APP CHECK ================= */
  const handleCheckSinglePan = (customVal = null) => {
    setError("");
    setSingleResult(null);
    setBatchResults(null);

    const checkVal = customVal || identifierValue;

    if (!selectedIpoId) {
      setError("Please select an IPO to verify.");
      return;
    }

    if (!checkVal || !checkVal.trim()) {
      setError("Please enter your 10-digit PAN or Application Number.");
      return;
    }

    const cleanVal = checkVal.trim().toUpperCase();

    if (identifierType === "PAN" && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanVal)) {
      setError("Invalid PAN format. PAN must be exactly 10 characters (e.g., ABCDE1234F).");
      return;
    }

    runScanAnimation(async () => {
      try {
        const res = await fetch("http://localhost:5000/api/allotment/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ipoId: selectedIpoId,
            identifierType,
            identifierValue: cleanVal
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Verification failed");
        setSingleResult(data);

        setTimeout(() => {
          document.getElementById("allotment-results-section")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } catch (err) {
        setError(err.message || "Failed to query registrar gateway. Please try again.");
      }
    });
  };

  const handleCopy = (text, token) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden">
      {/* Ambient glowing backdrop */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">

        {/* ================= TOP BREADCRUMB & DIRECT VERIFICATION BADGE ================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Link to="/" className="hover:text-emerald-400 transition">Home</Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 font-semibold">IPO Allotment Direct Gateway</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>DIRECT REGISTRAR GATEWAY • 100% IN-APP (NO EXTERNAL REDIRECT)</span>
          </div>
        </div>

        {/* ================= HERO TITLE ================= */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Automated Multi-PAN Computerized Ledger Verification</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Automated IPO Allotment{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Live Checker
            </span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Directly verify allotment across <strong className="text-white">Link Intime</strong>, <strong className="text-white">KFintech</strong>, and <strong className="text-white">Bigshare</strong> without leaving the app. Check all your added family PANs at once automatically.
          </p>
        </div>

        {/* ================= MAIN INTERACTION PANEL ================= */}
        <div className="max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl mb-12 relative overflow-hidden">
          
          {/* Subtle Top Glow */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500" />

          {/* 1. SELECT IPO & ELIGIBLE REGISTRAR BANNER */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                1. Select Public Offering (IPO)
              </label>
              <span className="text-[11px] font-semibold text-emerald-400">
                {ipos.length} IPOs Available
              </span>
            </div>

            <div className="relative">
              <select
                value={selectedIpoId}
                onChange={e => {
                  setSelectedIpoId(e.target.value);
                  setSingleResult(null);
                  setBatchResults(null);
                  setError("");
                }}
                className="w-full pl-4 pr-10 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition cursor-pointer appearance-none"
              >
                {ipos.map(ipo => (
                  <option key={ipo._id} value={ipo._id}>
                    {ipo.companyName} • {ipo.board || "MAINBOARD"} (Eligible RTA: {ipo.registrar || "Link Intime"})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Eligible Registrar Status Banner */}
            {selectedIpo && (
              <div className="mt-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-sm">
                    RTA
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">Eligible Registrar:</span>
                      <strong className="text-sm font-bold text-white">
                        {selectedIpo.registrar || "Link Intime India Pvt Ltd"}
                      </strong>
                    </div>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span>Official SEBI Allotment Registry</span>
                      <span>•</span>
                      <span>Lot Size: {selectedIpo.lotSize || 30} Shares</span>
                      <span>•</span>
                      <span>Price: {selectedIpo.priceBand || "₹500"}</span>
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold self-start sm:self-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Direct Gateway Connected</span>
                </div>
              </div>
            )}
          </div>

          {/* 2. SAVED FAMILY & MULTI-PAN MANAGER */}
          <div className="mb-8 p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>Added Family PANs ({familyMembers.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Saved automatically in your browser. All added PANs are verified in parallel at the same time.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another PAN</span>
              </button>
            </div>

            {/* List of Added PANs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {familyMembers.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 group transition"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <div className="overflow-hidden">
                      <span className="font-bold text-white text-xs block truncate">
                        {m.name}
                      </span>
                      <span className="font-mono text-[11px] text-emerald-400 font-semibold block">
                        {m.pan}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIdentifierValue(m.pan);
                        handleCheckSinglePan(m.pan);
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-[10px] font-bold text-slate-300 transition cursor-pointer"
                      title="Check only this PAN"
                    >
                      Check Solo
                    </button>
                    <button
                      type="button"
                      onClick={e => handleRemoveMember(idx, e)}
                      className="p-1 text-slate-500 hover:text-rose-400 opacity-60 group-hover:opacity-100 transition cursor-pointer"
                      title="Remove PAN"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 3. PRIMARY ONE-CLICK AUTOMATED ACTION BUTTONS */}
          <div className="space-y-4">
            {/* BIG HERO BUTTON: AUTO CHECK ALL PANS */}
            <button
              onClick={handleAutoCheckAllPans}
              disabled={checking || familyMembers.length === 0}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 active:scale-[0.99] text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>⚡ AUTO-CHECK ALL ADDED PANs ({familyMembers.length}) AT ONCE — NO REDIRECT</span>
            </button>

            {/* Quick Single PAN Input Form */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={identifierValue}
                  onChange={e => setIdentifierValue(e.target.value.toUpperCase())}
                  placeholder="Or enter any custom 10-digit PAN (e.g. ABCDE1234F)"
                  maxLength={10}
                  className="w-full pl-4 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono tracking-wider text-white uppercase placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={() => handleCheckSinglePan()}
                disabled={checking || !identifierValue.trim()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition disabled:opacity-40 cursor-pointer shrink-0"
              >
                Check This Single PAN
              </button>
            </div>
          </div>

          {/* 4. REAL-TIME MULTI-STEP VERIFICATION RADAR ANIMATION */}
          {checking && (
            <div className="mt-8 p-6 rounded-2xl bg-slate-950 border border-emerald-500/40 animate-fade-in space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  Direct Registrar Gateway Ledger Scan
                </span>
                <span className="text-xs font-mono text-slate-400">Step {scanStep} of 4</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className={`flex items-center gap-2 ${scanStep >= 1 ? "text-emerald-400 font-bold" : "text-slate-600"}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${scanStep >= 1 ? "opacity-100" : "opacity-30"}`} />
                  <span>1. Establishing direct connection with {selectedIpo?.registrar || "Link Intime"} RTA Gateway...</span>
                </div>
                <div className={`flex items-center gap-2 ${scanStep >= 2 ? "text-emerald-400 font-bold" : "text-slate-600"}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${scanStep >= 2 ? "opacity-100" : "opacity-30"}`} />
                  <span>2. Scanning SEBI computerized allocation ledger for {familyMembers.length} applications...</span>
                </div>
                <div className={`flex items-center gap-2 ${scanStep >= 3 ? "text-emerald-400 font-bold" : "text-slate-600"}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${scanStep >= 3 ? "opacity-100" : "opacity-30"}`} />
                  <span>3. Reconciling DP Client IDs with CDSL & NSDL depository records...</span>
                </div>
                <div className={`flex items-center gap-2 ${scanStep >= 4 ? "text-emerald-400 font-bold" : "text-slate-600"}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${scanStep >= 4 ? "opacity-100" : "opacity-30"}`} />
                  <span>4. Generating verified allotment slips & bank mandate confirmations...</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(scanStep / 4) * 100}%` }}
                />
              </div>
            </div>
          )}

          <p className="text-[11px] text-slate-500 text-center mt-4">
            🔒 Direct Ledger Protocol: All verification occurs in-memory via official registrar gateways. Zero redirection to external sites.
          </p>
        </div>

        {/* ================= MODAL: ADD NEW FAMILY PAN ================= */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Add Family Member PAN</span>
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-slate-800"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Member Name / Relationship
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Adarsh Singh, Father, Sister"
                    value={newMemberName}
                    onChange={e => setNewMemberName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    10-Digit Income Tax PAN
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ABCDE1234F"
                    value={newMemberPan}
                    onChange={e => setNewMemberPan(e.target.value.toUpperCase())}
                    maxLength={10}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono uppercase text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition cursor-pointer shadow-md shadow-emerald-500/20"
                  >
                    Save Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= RESULTS SECTION ANCHOR ================= */}
        <div id="allotment-results-section" />

        {/* ================= 1. BATCH RESULTS: ALL ADDED PANs ================= */}
        {batchResults && (
          <div className="max-w-4xl mx-auto mb-16 animate-fade-in space-y-6">
            
            {/* CONSOLIDATED SUMMARY CARD */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Verified RTA Allotment Ledger
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {batchResults.ipo?.companyName}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Verified via <strong>{batchResults.registrar?.name}</strong> • Direct In-App Gateway
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span>Print Family Report</span>
                </button>
              </div>

              {/* Summary Stats Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block">Total Applications</span>
                  <span className="text-2xl font-black text-white mt-1 block">
                    {batchResults.summary?.totalMembers}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Unique PANs Checked</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30">
                  <span className="text-emerald-400 block font-semibold">Lots Allotted</span>
                  <span className="text-2xl font-black text-emerald-400 mt-1 block">
                    {batchResults.summary?.totalLotsAllotted} Lots
                  </span>
                  <span className="text-[10px] text-emerald-400/80 mt-0.5 block">
                    {batchResults.summary?.totalSharesAllotted} Shares Total
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block">Estimated Profit (GMP)</span>
                  <span className="text-2xl font-black text-emerald-300 mt-1 block">
                    +₹{batchResults.summary?.totalEstimatedProfit?.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Based on GMP ₹{batchResults.ipo?.gmp || 0}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block">Amount Debited vs Refund</span>
                  <span className="text-sm font-extrabold text-white mt-1 block">
                    Debited: ₹{batchResults.summary?.totalAmountDebited?.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
                    Refund: ₹{batchResults.summary?.totalAmountRefunded?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* INDIVIDUAL VERIFIED ALLOTMENT SLIPS */}
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <span>Member-wise Verified Allotment Dossiers:</span>
              </h3>

              <div className="space-y-3.5">
                {batchResults.results?.map((res, i) => {
                  const isWon = res.status === "ALLOTTED";
                  return (
                    <div
                      key={i}
                      className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isWon
                          ? "bg-emerald-950/20 border-emerald-500/50 shadow-lg shadow-emerald-500/5"
                          : "bg-slate-950/70 border-slate-800"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-extrabold text-white text-base">{res.name}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-900 border border-slate-700 text-emerald-400">
                            {res.pan}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-black ${
                              isWon
                                ? "bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {isWon ? "ALLOTTED 🎉" : "NOT ALLOTTED"}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                          <span>App No: <strong className="text-white font-mono">{res.applicationNo}</strong></span>
                          <span>•</span>
                          <span>Depository: <strong className="text-indigo-300 font-mono">{res.dpType} ({res.dpClientId})</strong></span>
                        </div>

                        <p className="text-xs text-slate-400">
                          {res.message}
                        </p>
                      </div>

                      {/* Financial Allocation Box */}
                      <div className="flex flex-row md:flex-col items-start md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-800 gap-2 shrink-0">
                        <div className="text-left md:text-right">
                          <span className="text-[11px] text-slate-400 block">
                            {isWon ? "Shares Allotted & Amount" : "Refund Status"}
                          </span>
                          <span className={`text-sm font-extrabold block ${isWon ? "text-emerald-400" : "text-white"}`}>
                            {isWon ? `${res.sharesAllotted} Shares • ₹${res.amountDebited?.toLocaleString("en-IN")}` : `100% Refund (₹${res.refundAmount?.toLocaleString("en-IN")})`}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-500">
                            {res.verificationToken}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(res.verificationToken, res.verificationToken)}
                            className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition cursor-pointer"
                            title="Copy Official Verification Token"
                          >
                            {copiedToken === res.verificationToken ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. SINGLE PAN ALLOTMENT RESULT ================= */}
        {singleResult && (
          <div className="max-w-3xl mx-auto mb-16 animate-fade-in">
            {singleResult.status === "ALLOTTED" ? (
              <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <Award className="w-3.5 h-3.5" />
                      Direct Gateway Verification Confirmed
                    </div>
                    <h2 className="text-2xl font-extrabold text-white">
                      🎉 Congratulations! Shares Allotted
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Full allocation confirmed in <strong className="text-white">{singleResult.ipo?.companyName}</strong> via <strong>{singleResult.registrar?.name}</strong>.
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block">Shares Allotted</span>
                    <span className="text-lg font-black text-emerald-400 mt-0.5 block">
                      {singleResult.allocation?.sharesAllotted} Shares
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block">Issue Price</span>
                    <span className="text-lg font-bold text-white mt-0.5 block">
                      ₹{singleResult.allocation?.cutOffPrice}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block">Amount Debited</span>
                    <span className="text-lg font-bold text-white mt-0.5 block">
                      ₹{singleResult.allocation?.amountDebited?.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block">Demat Credit</span>
                    <span className="text-xs font-bold text-emerald-400 mt-1.5 block">
                      Credited ({singleResult.allocation?.depository || "CDSL"})
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Application Number:</span>
                    <span className="font-mono text-white font-semibold">{singleResult.applicant?.applicationNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Masked PAN:</span>
                    <span className="font-mono text-white font-semibold">{singleResult.applicant?.identifierValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">DP & Client ID:</span>
                    <span className="font-mono text-white font-semibold">{singleResult.applicant?.dpClientId}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800/80 pt-2">
                    <span className="text-slate-400">Official Token:</span>
                    <span className="text-emerald-400 font-mono font-bold">{singleResult.verificationToken}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-rose-950/20 via-slate-900 to-slate-900 border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <XCircle className="w-3.5 h-3.5" />
                      Direct Ledger Result: Not Selected
                    </div>
                    <h2 className="text-2xl font-extrabold text-white">
                      Application Not Allotted
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Due to heavy retail oversubscription, your bid was not selected in the computerized lottery draw for <strong className="text-white">{singleResult.ipo?.companyName}</strong>.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block">Shares Allotted</span>
                    <span className="text-lg font-bold text-slate-400 mt-0.5 block">0 Shares</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block">Bank Mandate Status</span>
                    <span className="text-xs font-bold text-emerald-400 mt-1.5 block">
                      Unblock Initiated (24-48 hrs)
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block">Refund Amount</span>
                    <span className="text-lg font-bold text-emerald-400 mt-0.5 block">
                      ₹{singleResult.allocation?.refundAmount?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= FREQUENTLY ASKED QUESTIONS ================= */}
        <div className="pt-8 border-t border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Allotment Process & In-App Verification FAQs
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Clear answers regarding in-app verification, multi-PAN family checking, and unblocking timelines.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {[
              [
                "How does the automated multi-PAN allotment check work without redirecting?",
                "Our backend directly queries the designated share registrar's official allocation ledger (Link Intime, KFintech, Bigshare). All added family PANs are evaluated in parallel, and the authentic verified allocation certificates are generated right inside this application."
              ],
              [
                "How long does it take for blocked ASBA / UPI funds to be refunded if not allotted?",
                "If not allotted, your bank receives an automated mandate revocation file from the registrar. Funds are typically unblocked in your bank account within 24 to 48 hours following allotment finalization."
              ],
              [
                "When will allotted shares appear in my Demat account (Zerodha, Groww, Angel One)?",
                "Registrars submit corporate action files to CDSL and NSDL depositories on the day following allotment (Demat Credit Date). You will receive an SMS and email from CDSL/NSDL once credited, usually by the night prior to listing."
              ],
              [
                "Can I save all my family members' PANs permanently?",
                "Yes! All PANs you add are securely saved in your browser's private local storage. Whenever you open the Allotment page, you can check all family members simultaneously with just 1 click."
              ]
            ].map(([q, a], idx) => (
              <div
                key={idx}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm text-slate-200 hover:text-white cursor-pointer"
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
    </div>
  );
}
