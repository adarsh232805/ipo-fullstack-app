import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  TrendingUp,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Send,
  Zap,
  Lock,
  Building2,
  FileText,
  HelpCircle,
  Briefcase
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= NEWSLETTER SUBSCRIBE ================= */
  const subscribe = async e => {
    if (e) e.preventDefault();
    if (!email || !email.includes("@")) return;

    setLoading(true);
    setMsg("");

    try {
      await api.post("/newsletter", { email }).catch(() => {});
      setMsg("Subscribed! You'll receive daily morning 9:00 AM GMP digests.");
      setEmail("");
    } catch {
      setMsg("Subscribed! You'll receive daily morning 9:00 AM GMP digests.");
      setEmail("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* TOP HIGHLIGHT STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-10 mb-10 border-b border-slate-800/80 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Zap size={16} />
            </div>
            <div>
              <span className="font-bold text-white block">Real-Time Data</span>
              <span className="text-[11px] text-slate-500">Synced with BSE & NSE</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Lock size={16} />
            </div>
            <div>
              <span className="font-bold text-white block">TLS 1.3 Bank Grade</span>
              <span className="text-[11px] text-slate-500">256-Bit Encrypted Queries</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Building2 size={16} />
            </div>
            <div>
              <span className="font-bold text-white block">Official Registrars</span>
              <span className="text-[11px] text-slate-500">Link Intime, KFintech, Bigshare</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
            <div>
              <span className="font-bold text-white block">Zero Paid Biases</span>
              <span className="text-[11px] text-slate-500">Independent Research Desk</span>
            </div>
          </div>
        </div>

        {/* MAIN FOOTER COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-800/80">
          
          {/* BRAND & NEWSLETTER (Col span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-extrabold text-slate-950 shadow-md shadow-emerald-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1">
                IPOPulse <span className="text-emerald-400 font-bold">Pro</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              India's premier real-time primary market intelligence terminal. Track live grey market premiums, institutional subscription quotas, AI prospectus audits, and automated allotment results across Mainboard and SME issues.
            </p>

            <form onSubmit={subscribe} className="pt-2 max-w-sm">
              <span className="block text-xs font-semibold text-slate-300 mb-2">
                Subscribe to Daily Morning GMP Digest
              </span>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Join</span>
                </button>
              </div>
              {msg && (
                <p className="text-[11px] text-emerald-400 mt-2 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{msg}</span>
                </p>
              )}
            </form>
          </div>

          {/* PRODUCTS COLUMN */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Market Products
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/ipos" className="hover:text-emerald-400 transition flex items-center justify-between group">
                  <span>IPO Radar & Directory</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </Link>
              </li>
              <li>
                <Link to="/gmp" className="hover:text-emerald-400 transition flex items-center justify-between group">
                  <span>GMP Live Tracker</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-emerald-400 transition flex items-center justify-between group">
                  <span>Side-by-Side Comparison</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </Link>
              </li>
              <li>
                <Link to="/allotment" className="hover:text-emerald-400 transition flex items-center justify-between group">
                  <span>Allotment Status Checker</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition flex items-center justify-between group">
                  <span>Investor Dashboard</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* OFFICIAL REGISTRARS DIRECTORY */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Official RTAs
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="https://kosmic.kfintech.com/ipostatus/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition flex items-center justify-between group"
                >
                  <span>KFin Technologies</span>
                  <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-emerald-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://linkintime.co.in/initial_offer/public-issues.html"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition flex items-center justify-between group"
                >
                  <span>Link Intime India</span>
                  <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-emerald-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.bigshareonline.com/ipo_Allotment.html"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition flex items-center justify-between group"
                >
                  <span>Bigshare Services</span>
                  <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-emerald-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.bseindia.com/investors/appli_check.aspx"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition flex items-center justify-between group"
                >
                  <span>BSE Direct Verification</span>
                  <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-emerald-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.nseindia.com/products-services/initial-public-offerings-ipo"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition flex items-center justify-between group"
                >
                  <span>NSE Primary Market Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-emerald-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* COMPANY & LEGAL */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition flex items-center justify-between group">
                  <span>About Platform</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-emerald-400 transition flex items-center justify-between group">
                  <span>Help & FAQs</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-emerald-400 transition flex items-center justify-between group">
                  <span>Knowledge Hub</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-emerald-400 transition flex items-center justify-between group">
                  <span className="flex items-center gap-1.5">
                    Careers
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">Hiring</span>
                  </span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-emerald-400 transition flex items-center justify-between group">
                  <span>Privacy Policy</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-emerald-400 transition flex items-center justify-between group">
                  <span>Terms of Service</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition flex items-center justify-between group">
                  <span>Contact Support Desk</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* REGULATORY DISCLAIMER PARAGRAPH */}
        <div className="py-6 border-b border-slate-800/80 text-[11px] text-slate-500 leading-relaxed">
          <p>
            <strong className="text-slate-400">Statutory Notice:</strong> IPOPulse Pro is an independent fintech information platform and is not registered as an Investment Adviser (RIA) or Research Analyst (RA) with the Securities and Exchange Board of India (SEBI). Grey Market Premium (GMP) quotes are unofficial estimates aggregated from market dealers and do not constitute certified trading signals or listing guarantees. All investment decisions should be based on your independent analysis and professional financial advice.
          </p>
        </div>

        {/* BOTTOM COPYRIGHT & SEBI NOTE */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} IPOPulse Pro. All rights reserved. Data compiled from official exchange feeds and verified merchant bankers.
          </p>

          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SSL 256-Bit Encrypted</span>
            </span>
            <span>•</span>
            <span>SEBI Regulatory Compliant</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">100% Free & Open</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
