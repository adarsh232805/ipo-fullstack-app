import React from "react";
import PageHeader from "../../components/PageHeader";
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
  Award,
  Users,
  Building2,
  CheckCircle2,
  ArrowUpRight,
  Database
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-slate-100">
      <PageHeader
        badge="About The Platform"
        title="Institutional-Grade IPO Intelligence for Retail Investors"
        subtitle="IPOPulse Pro democratizes primary market financial data, live grey market premiums, institutional subscription quotas, and automated allotment results across NSE, BSE, and SME exchanges."
      />

      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
        {[
          { label: "Cumulative Capital Tracked", value: "₹45,000+ Cr", change: "Across 240+ Issues", color: "text-emerald-400" },
          { label: "GMP Predictive Accuracy", value: "99.4%", change: "Validated on Listing Days", color: "text-blue-400" },
          { label: "Active Market Analysts", value: "120,000+", change: "Nationwide Community", color: "text-purple-400" },
          { label: "Exchange Latency", value: "< 30s", change: "NSE / BSE Realtime Sync", color: "text-amber-400" },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-sm">
            <span className="text-xs text-slate-400 font-medium block">{stat.label}</span>
            <div className={`text-2xl sm:text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">{stat.change}</span>
          </div>
        ))}
      </div>

      {/* Mission & Architecture */}
      <div className="grid lg:grid-cols-12 gap-10 items-center mb-16">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Zap size={14} /> Our Mission
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            Eliminating Information Asymmetry in the Indian Primary Market
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Traditionally, high-net-worth individuals and institutional desks enjoyed first-hand intelligence on grey market movements, anchor allocations, and allotment odds. Retail investors were left relying on delayed WhatsApp rumors or cluttered discussion forums.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            IPOPulse Pro was engineered to bridge this gap. By compiling automated feeds directly from merchant bankers, exchange bidding engines, and official registrars, we deliver transparent, real-time analytics to every individual investor.
          </p>

          <div className="pt-2 grid sm:grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Real-Time Unofficial GMP Aggregation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>AI-Assisted Red Herring Risk Audits</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Instant Automated Registrar Querying</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Zero Sponsored or Paid Biases</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-emerald-400" size={18} /> Our Core Tenets
          </h3>
          <div className="space-y-4 text-xs text-slate-300">
            <div className="border-b border-slate-800/80 pb-3">
              <span className="font-bold text-white block text-sm mb-1">1. Absolute Transparency</span>
              We clearly distinguish between regulated exchange subscription figures and unofficial grey market indications.
            </div>
            <div className="border-b border-slate-800/80 pb-3">
              <span className="font-bold text-white block text-sm mb-1">2. Zero Commission Biases</span>
              We don't sell investment tips or accept broker pay-for-play placements. All analytics are driven by raw market data.
            </div>
            <div>
              <span className="font-bold text-white block text-sm mb-1">3. Bank-Grade Security</span>
              All allotment checks and user data are protected by TLS 1.3 encryption, adhering strictly to Indian IT Act and SEBI standards.
            </div>
          </div>
        </div>
      </div>

      {/* Leadership & Engineering */}
      <div className="border-t border-slate-800/80 pt-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">PLATFORM LEADERSHIP</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Built by Financial Engineers & Market Veterans
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Our multi-disciplinary team brings experience across quantitative finance, securities law, and full-stack software architecture.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              name: "Research & Quantitative Desk",
              role: "Market Signals & GMP Analytics",
              desc: "Monitors daily unofficial broker quotes across Rajkot, Ahmedabad, Mumbai, and Delhi circles to compile verified weighted GMP medians."
            },
            {
              name: "Regulatory & Compliance Team",
              role: "Legal & Exchange Verification",
              desc: "Ensures all corporate filings, issue dates, registrar links, and red-herring prospectuses conform strictly to SEBI regulations."
            },
            {
              name: "Real-Time Systems Engineering",
              role: "Cloud & Data Infrastructure",
              desc: "Maintains high-availability data pipelines with low-latency scraping of BSE/NSE bidding terminals and registrar databases."
            }
          ].map((item, i) => (
            <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 mb-4 font-bold">
                0{i + 1}
              </div>
              <h3 className="font-bold text-white text-base">{item.name}</h3>
              <span className="text-xs text-emerald-400 font-medium block mt-0.5">{item.role}</span>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 p-8 bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/20 rounded-3xl text-center flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-bold text-white">Ready to Explore Active IPOs?</h3>
          <p className="text-xs text-slate-300 mt-1">Start tracking live premiums, subscription meters, and AI insights today.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/ipos")}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-2"
          >
            Explore IPOs <ArrowUpRight size={14} />
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs transition"
          >
            Contact Team
          </button>
        </div>
      </div>
    </div>
  );
}
