import React from "react";
import { X, ExternalLink, ShieldCheck, CheckCircle2, ArrowRight, Zap } from "lucide-react";

export default function ApplyIpoModal({ ipo, onClose }) {
  if (!ipo) return null;

  const brokers = [
    {
      name: "Groww",
      desc: "Fast UPI Mandate & 1-click Bidding",
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400",
      url: "https://groww.in/ipo"
    },
    {
      name: "Zerodha Kite",
      desc: "Direct ASBA & High Allocation Tracking",
      color: "from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-400",
      url: "https://kite.zerodha.com"
    },
    {
      name: "Angel One",
      desc: "Smart UPI 2.0 Auto-Cutoff",
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-400",
      url: "https://trade.angelone.in"
    },
    {
      name: "Upstox",
      desc: "Zero Fee Retail & HNI Applications",
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-400",
      url: "https://login.upstox.com"
    },
    {
      name: "Dhan",
      desc: "Lightning Fast Trader Execution",
      color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-400",
      url: "https://dhan.co"
    }
  ];

  const redirectToBroker = url => {
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {ipo.board || "MAINBOARD"}
              </span>
              <span className="text-xs text-slate-400">Apply via Broker</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {ipo.companyName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Key IPO Specs Cards */}
          <div className="grid grid-cols-3 gap-2.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5 text-center">
            <div>
              <span className="text-[11px] text-slate-400 block">Issue Price</span>
              <span className="font-semibold text-white text-sm mt-0.5 block">
                {ipo.priceBand || "—"}
              </span>
            </div>
            <div className="border-x border-slate-800">
              <span className="text-[11px] text-slate-400 block">Min Lots</span>
              <span className="font-semibold text-white text-sm mt-0.5 block">
                {ipo.lotSize ? `${ipo.lotSize} Shares` : "—"}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Min Amount</span>
              <span className="font-semibold text-emerald-400 text-sm mt-0.5 block">
                ₹{ipo.minInvestment?.toLocaleString("en-IN") || "—"}
              </span>
            </div>
          </div>

          {/* Broker Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select Your Demat Broker
              </h3>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Redirects to official portal
              </span>
            </div>

            <div className="space-y-2.5">
              {brokers.map(b => (
                <button
                  key={b.name}
                  onClick={() => redirectToBroker(b.url)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border bg-gradient-to-r ${b.color} hover:brightness-110 active:scale-[0.99] transition text-left group`}
                >
                  <div>
                    <h4 className="font-bold text-white text-sm group-hover:underline">
                      {b.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {b.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-white opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition">
                    <span>Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ASBA 3-Step Guide */}
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              How ASBA UPI Mandate Works
            </h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">1</span>
                Submit application on your broker platform with your UPI ID.
              </p>
              <p className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">2</span>
                Approve the mandate request in your UPI App (GPay/PhonePe/Paytm).
              </p>
              <p className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">3</span>
                Funds remain in your bank account until allotment date.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            IPOPulse does not collect any application fees or bank credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
