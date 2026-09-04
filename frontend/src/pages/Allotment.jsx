import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { fetchIpos } from "../services/api";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Copy,
  Check,
  UserCheck,
  CreditCard,
  Building2,
  HelpCircle,
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
  Award
} from "lucide-react";

export default function Allotment() {
  const [ipos, setIpos] = useState([]);
  const [loadingIpos, setLoadingIpos] = useState(true);

  // Form states
  const [selectedIpoId, setSelectedIpoId] = useState("");
  const [identifierType, setIdentifierType] = useState("PAN"); // 'PAN' | 'APP_NO' | 'DP_ID'
  const [identifierValue, setIdentifierValue] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Family Members Saved PANs
  const [familyMembers, setFamilyMembers] = useState(() => {
    try {
      const saved = localStorage.getItem("saved_family_pans");
      return saved ? JSON.parse(saved) : [
        { name: "Self", pan: "ABCDE1234F" }
      ];
    } catch {
      return [{ name: "Self", pan: "ABCDE1234F" }];
    }
  });
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberPan, setNewMemberPan] = useState("");
  const [batchChecking, setBatchChecking] = useState(false);
  const [batchResults, setBatchResults] = useState(null);

  /* ================= LOAD ALL CLOSED & ACTIVE IPOs ================= */
  useEffect(() => {
    setLoadingIpos(true);
    fetchIpos()
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setIpos(list);

        // Preselect the first closed or allotment-ready IPO
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
    const updated = [...familyMembers, { name: newMemberName.trim(), pan: cleanPan }];
    saveFamilyMembers(updated);
    setNewMemberName("");
    setNewMemberPan("");
    setShowAddFamily(false);
  };

  const handleRemoveMember = (idx, e) => {
    e.stopPropagation();
    const updated = familyMembers.filter((_, i) => i !== idx);
    saveFamilyMembers(updated);
  };

  /* ================= AUTO CHECK ALLOTMENT ================= */
  const handleCheckAllotment = async (customVal = null) => {
    setError("");
    setResult(null);

    const checkVal = customVal || identifierValue;

    if (!selectedIpoId) {
      setError("Please select an IPO to check allotment.");
      return;
    }

    if (!checkVal || !checkVal.trim()) {
      setError(`Please enter your ${identifierType === "PAN" ? "10-digit PAN" : "Application Number"}.`);
      return;
    }

    const cleanVal = checkVal.trim().toUpperCase();

    if (identifierType === "PAN" && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanVal)) {
      setError("Invalid PAN format. PAN must be 10 characters (e.g., ABCDE1234F).");
      return;
    }

    setChecking(true);

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

      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to connect to registrar server. Try again or check directly.");
    } finally {
      setChecking(false);
    }
  };

  /* ================= BATCH CHECK ALL FAMILY PANs ================= */
  const handleBatchCheck = async () => {
    if (!selectedIpoId) {
      setError("Please select an IPO first.");
      return;
    }
    if (!familyMembers.length) {
      setError("Please add at least one family member PAN to run batch check.");
      return;
    }

    setError("");
    setBatchResults(null);
    setResult(null);
    setBatchChecking(true);

    try {
      const res = await fetch("http://localhost:5000/api/allotment/batch-check", {
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
    } catch (err) {
      setError(err.message || "Failed to execute batch check. Please try again.");
    } finally {
      setBatchChecking(false);
    }
  };

  /* ================= COPY & REDIRECT ================= */
  const handleCopyAndRedirect = () => {
    const val = identifierValue || "ABCDE1234F";
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);

    const targetUrl =
      selectedIpo?.allotmentLink ||
      getRegistrarLink(selectedIpo?.registrar);

    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  const getRegistrarLink = reg => {
    const r = (reg || "").toUpperCase();
    if (r === "LINKINTIME") return "https://linkintime.co.in/initial_offer/public-issues.html";
    if (r === "BIGSHARE") return "https://www.bigshareonline.com/ipo_Allotment.html";
    if (r === "CAMEO") return "https://ipo.cameoindia.com/";
    return "https://kosmic.kfintech.com/ipostatus/";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden">
      {/* Ambient background glow flares */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">

        {/* ================= BREADCRUMBS & BADGE ================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Link to="/" className="hover:text-emerald-400 transition">Home</Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 font-semibold">IPO Allotment Status</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SEBI RTA REGISTERED • 100% SECURE & DIRECT VERIFICATION</span>
          </div>
        </div>

        {/* ================= HERO HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            IPO Allotment Status{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Live Checker
            </span>
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-slate-400 leading-relaxed">
            Check your IPO allotment status automatically via PAN Number, Application ID, or DP Client ID with real-time registrar sync (Link Intime, KFintech, Bigshare & BSE).
          </p>
        </div>

        {/* ================= MAIN CHECK CARD ================= */}
        <div className="max-w-3xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl mb-12 relative">
          
          {/* Step 1: Select IPO */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              1. Select Public Offering (IPO)
            </label>
            <div className="relative">
              <select
                value={selectedIpoId}
                onChange={e => {
                  setSelectedIpoId(e.target.value);
                  setResult(null);
                  setError("");
                }}
                className="w-full pl-4 pr-10 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition cursor-pointer appearance-none"
              >
                {ipos.map(ipo => (
                  <option key={ipo._id} value={ipo._id}>
                    {ipo.companyName} • {ipo.board || "MAINBOARD"} (Registrar: {ipo.registrar || "KFintech"}) {ipo.allotmentAvailable ? "🟢 [Allotment Live]" : "⏳ [Basis Pending]"}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Quick Registrar Snippet */}
            {selectedIpo && (
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <span className="text-slate-400">
                  Designated Registrar:{" "}
                  <strong className="text-slate-200">
                    {selectedIpo.registrar || "KFintech"}
                  </strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${selectedIpo.allotmentAvailable ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`} />
                  <span className={selectedIpo.allotmentAvailable ? "text-emerald-400 font-bold" : "text-amber-400 font-semibold"}>
                    {selectedIpo.allotmentAvailable ? "Allotment Live on Portal" : "Basis of Allotment Pending"}
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Step 2: Identification Type Switcher */}
          <div className="mb-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              2. Verify Using
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
              {[
                { id: "PAN", label: "PAN Number", icon: CreditCard },
                { id: "APP_NO", label: "Application No", icon: FileText },
                { id: "DP_ID", label: "DP Client ID", icon: UserCheck }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setIdentifierType(tab.id);
                      setResult(null);
                      setError("");
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      identifierType === tab.id
                        ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Input Field with Demo Auto-Fill */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                3. Enter {identifierType === "PAN" ? "Income Tax PAN" : identifierType === "APP_NO" ? "Application Number" : "16-Digit Demat ID"}
              </label>
              <button
                type="button"
                onClick={() => {
                  setIdentifierType("PAN");
                  setIdentifierValue("ABCDE1234F");
                }}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold transition flex items-center gap-1 cursor-pointer"
              >
                <Zap className="w-3 h-3" />
                Fill Demo PAN (Guaranteed Allotment)
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <CreditCard className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={identifierValue}
                onChange={e => setIdentifierValue(e.target.value.toUpperCase())}
                placeholder={
                  identifierType === "PAN"
                    ? "e.g. ABCDE1234F"
                    : identifierType === "APP_NO"
                    ? "e.g. 12089456"
                    : "e.g. 1208160012345678"
                }
                maxLength={identifierType === "PAN" ? 10 : 20}
                className="w-full pl-10 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-sm font-mono tracking-wider text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition uppercase"
              />
            </div>
          </div>

          {/* Saved Family PANs Quick Bar */}
          {familyMembers.length > 0 && identifierType === "PAN" && (
            <div className="mb-6 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-indigo-400" />
                  Quick Check Saved Family PANs:
                </span>
                <button
                  onClick={() => setShowAddFamily(!showAddFamily)}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold transition"
                >
                  {showAddFamily ? "Cancel" : "+ Add Member"}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {familyMembers.map((m, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setIdentifierValue(m.pan);
                      handleCheckAllotment(m.pan);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-emerald-500/60 hover:bg-slate-850 transition cursor-pointer text-xs group"
                  >
                    <span className="font-semibold text-white">{m.name}</span>
                    <span className="text-slate-400 font-mono text-[11px]">({m.pan})</span>
                    <button
                      onClick={e => handleRemoveMember(idx, e)}
                      className="text-slate-500 hover:text-rose-400 ml-1 opacity-60 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Member Form */}
              {showAddFamily && (
                <form onSubmit={handleAddMember} className="mt-3 pt-3 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    placeholder="Name (e.g. Father)"
                    value={newMemberName}
                    onChange={e => setNewMemberName(e.target.value)}
                    required
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="PAN (ABCDE1234F)"
                    value={newMemberPan}
                    onChange={e => setNewMemberPan(e.target.value.toUpperCase())}
                    maxLength={10}
                    required
                    className="w-36 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white uppercase"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    Save
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleCheckAllotment()}
              disabled={checking || batchChecking}
              className="py-3.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.99] text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {checking ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Check Current</span>
                </>
              )}
            </button>

            <button
              onClick={handleBatchCheck}
              disabled={checking || batchChecking || familyMembers.length === 0}
              className="py-3.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-bold text-xs tracking-wide shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              title="Check all saved family PANs at once"
            >
              {batchChecking ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Batch Checking...</span>
                </>
              ) : (
                <>
                  <Users className="w-3.5 h-3.5" />
                  <span>👨‍👩‍👧 Check All Family ({familyMembers.length})</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyAndRedirect}
              className="py-3.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.99] border border-slate-700 text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy & Open RTA</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-slate-500 text-center mt-4">
            🔒 Your PAN is verified securely on-the-fly and never retained or stored on any server.
          </p>
        </div>

        {/* ================= BATCH ALLOTMENT RESULTS DISPLAY ================= */}
        {batchResults && (
          <div className="max-w-3xl mx-auto mb-16 animate-fade-in space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Users className="w-3.5 h-3.5" />
                    Family Batch Summary
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">
                    {batchResults.ipo?.companyName}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Verified across {batchResults.summary?.totalMembers} family applications
                  </p>
                </div>

                {/* Counter Badges */}
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                    <span className="text-xs text-slate-400 block font-medium">Allotted</span>
                    <span className="text-xl font-black text-emerald-400">
                      {batchResults.summary?.totalAllotted}
                    </span>
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                    <span className="text-xs text-slate-400 block font-medium">Not Allotted</span>
                    <span className="text-xl font-black text-slate-300">
                      {batchResults.summary?.totalNonAllotted}
                    </span>
                  </div>
                </div>
              </div>

              {/* Members Breakdown Table / Cards */}
              <div className="mt-6 space-y-3">
                {batchResults.results?.map((res, i) => {
                  const isWon = res.status === "ALLOTTED";
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isWon
                          ? "bg-emerald-950/20 border-emerald-500/40"
                          : "bg-slate-950/60 border-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isWon
                              ? "bg-emerald-500 text-slate-950"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {isWon ? "🎉" : "—"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{res.name}</span>
                            <span className="text-slate-500 font-mono text-xs">({res.pan})</span>
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {res.applicationNo || "Application Checked"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 text-right">
                        <div>
                          <span
                            className={`text-xs font-bold block ${
                              isWon ? "text-emerald-400" : "text-slate-400"
                            }`}
                          >
                            {res.message}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {isWon ? `${res.sharesAllotted} shares @ ₹${res.cutOffPrice}` : "Refund In-Progress"}
                          </span>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                            isWon
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {res.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-400">
                  Official Registrar: <strong>{batchResults.registrar?.name}</strong>
                </span>
                <a
                  href={batchResults.registrar?.portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
                >
                  <span>Verify on Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ================= LIVE ALLOTMENT RESULT DISPLAY ================= */}
        {result && (
          <div className="max-w-3xl mx-auto mb-16 animate-fade-in">
            {result.status === "ALLOTTED" ? (
              /* 🎉 ALLOTTED CARD */
              <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-500/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <Award className="w-3.5 h-3.5" />
                      Allotment Confirmed
                    </div>
                    <h2 className="text-2xl font-extrabold text-white">
                      🎉 Congratulations! Shares Allotted
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      You have received full allocation in <strong className="text-white">{result.ipo?.companyName}</strong>.
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                </div>

                {/* Allotment Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/90">
                    <span className="text-slate-400 block">Shares Allotted</span>
                    <span className="text-lg font-extrabold text-emerald-400 mt-0.5 block">
                      {result.allocation?.sharesAllotted} Shares
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/90">
                    <span className="text-slate-400 block">Issue Price</span>
                    <span className="text-lg font-bold text-white mt-0.5 block">
                      ₹{result.allocation?.cutOffPrice}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/90">
                    <span className="text-slate-400 block">Amount Debited</span>
                    <span className="text-lg font-bold text-white mt-0.5 block">
                      ₹{result.allocation?.amountDebited?.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/90">
                    <span className="text-slate-400 block">Demat Credit</span>
                    <span className="text-xs font-bold text-emerald-400 mt-1.5 block">
                      Credited (CDSL/NSDL)
                    </span>
                  </div>
                </div>

                {/* Metadata details */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Application Number:</span>
                    <span className="font-mono text-white font-semibold">{result.applicant?.applicationNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Masked PAN / Identifier:</span>
                    <span className="font-mono text-white font-semibold">{result.applicant?.identifierValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">DP & Client ID:</span>
                    <span className="font-mono text-white font-semibold">{result.applicant?.dpClientId}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800/80 pt-2">
                    <span className="text-slate-400">Listing Date:</span>
                    <span className="text-emerald-400 font-bold">
                      {result.timeline?.listingDate
                        ? new Date(result.timeline.listingDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })
                        : "TBA"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
                  <span className="text-xs text-slate-400">
                    Official Registrar: <strong>{result.registrar?.name}</strong>
                  </span>
                  <a
                    href={result.registrar?.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
                  >
                    <span>View on Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : result.status === "NON_ALLOTTED" ? (
              /* ❌ NON-ALLOTTED CARD */
              <div className="bg-gradient-to-br from-rose-950/20 via-slate-900 to-slate-900 border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <XCircle className="w-3.5 h-3.5" />
                      Not Allotted (Lottery Non-Selection)
                    </div>
                    <h2 className="text-2xl font-extrabold text-white">
                      Application Not Allotted
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Due to heavy retail oversubscription, your bid was not picked in the automated computerized draw for <strong className="text-white">{result.ipo?.companyName}</strong>.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block">Shares Allotted</span>
                    <span className="text-lg font-bold text-slate-400 mt-0.5 block">0 Shares</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block">Refund / Mandate Release</span>
                    <span className="text-xs font-bold text-emerald-400 mt-1.5 block">
                      Unblock Initiated (24-48 hrs)
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block">Refund Amount</span>
                    <span className="text-lg font-bold text-emerald-400 mt-0.5 block">
                      ₹{result.allocation?.refundAmount?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs text-slate-400">
                  <p className="flex items-center justify-between">
                    <span>Application ID:</span>
                    <strong className="text-white font-mono">{result.applicant?.applicationNo}</strong>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>ASBA Lien Status:</span>
                    <span className="text-emerald-400 font-semibold">Funds remain safe in your bank account</span>
                  </p>
                </div>
              </div>
            ) : (
              /* ⏳ PENDING BASIS CARD */
              <div className="bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="flex items-start justify-between gap-4 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      Basis of Allotment Pending
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Allotment Data in Preparation
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                      {result.message} Registrar <strong>{result.registrar?.name}</strong> typically publishes the verified allotment database between late evening and midnight on allotment day.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
                  <a
                    href={result.registrar?.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs transition"
                  >
                    <span>Check Directly on {result.registrar?.shortName || "Registrar"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= OFFICIAL REGISTRAR DIRECTORY ================= */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Official Registrar Direct Access Directory
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Direct access portals and toll-free investor grievance helplines for India's primary market RTAs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "Link Intime India Pvt Ltd",
                short: "Link Intime",
                url: "https://linkintime.co.in/initial_offer/public-issues.html",
                phone: "022 4918 6200",
                email: "ipo.helpdesk@linkintime.co.in",
                color: "from-blue-600/20 to-indigo-600/10 border-blue-500/30"
              },
              {
                name: "KFin Technologies Ltd",
                short: "KFintech",
                url: "https://kosmic.kfintech.com/ipostatus/",
                phone: "1800 309 4001",
                email: "einward.ris@kfintech.com",
                color: "from-emerald-600/20 to-teal-600/10 border-emerald-500/30"
              },
              {
                name: "Bigshare Services Pvt Ltd",
                short: "Bigshare",
                url: "https://www.bigshareonline.com/ipo_Allotment.html",
                phone: "022 6263 8200",
                email: "ipo@bigshareonline.com",
                color: "from-purple-600/20 to-pink-600/10 border-purple-500/30"
              }
            ].map((reg, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-3xl bg-gradient-to-br ${reg.color} border shadow-xl flex flex-col justify-between`}
              >
                <div>
                  <h3 className="font-bold text-white text-base">{reg.short}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{reg.name}</p>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{reg.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{reg.email}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={reg.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 w-full py-2.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <span>Open {reg.short} Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ================= FREQUENTLY ASKED QUESTIONS ================= */}
        <div className="pt-8 border-t border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Allotment Process FAQs
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Clear answers regarding unblocking timelines, lottery selection, and demat delivery.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {[
              [
                "What time is IPO allotment usually released by registrars?",
                "Registrars typically upload the computerized allotment database between 8:00 PM and midnight on the designated allotment date. Occasionally for heavily subscribed issues, processing may extend into the following morning."
              ],
              [
                "How long does it take for blocked ASBA / UPI funds to be refunded?",
                "If not allotted, your bank receives an automated mandate revocation file from the registrar. Funds are typically unblocked in your savings account within 24 to 48 hours following the allotment finalization."
              ],
              [
                "When will allotted shares appear in my Zerodha, Groww, or Angel One Demat account?",
                "Registrars submit corporate action files to CDSL and NSDL depositories on the day following allotment (Demat Credit Date). You will receive an SMS and email from CDSL/NSDL once credited, usually by 10:00 PM the night prior to listing."
              ],
              [
                "What if my allotment status shows 'Not Found' on the registrar portal?",
                "Ensure that you have selected the exact company name from the dropdown and typed your 10-digit PAN in capital letters without spaces. If the company is not yet listed in the registrar's dropdown, the basis of allotment has not yet gone live."
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
