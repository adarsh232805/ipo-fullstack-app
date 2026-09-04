import React from "react";
import PageHeader from "../../components/PageHeader";
import { ShieldCheck, Lock, Eye, Database, CheckCircle2, FileText } from "lucide-react";

export default function Privacy() {
  const lastUpdated = "September 2026";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-slate-100">
      <PageHeader
        badge="Legal & Trust"
        title="Privacy & Data Protection Policy"
        subtitle={`Last revised on ${lastUpdated}. IPOPulse Pro is committed to uncompromising confidentiality, bank-grade encryption, and zero monetization of investor records.`}
      />

      {/* Trust Highlights */}
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
            <Lock size={18} />
          </div>
          <h4 className="font-bold text-sm text-white">TLS 1.3 Encryption</h4>
          <p className="text-xs text-slate-400 mt-1">All data transmitted between your device, our servers, and RTAs is encrypted end-to-end.</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
            <Eye size={18} />
          </div>
          <h4 className="font-bold text-sm text-white">Zero Data Resale</h4>
          <p className="text-xs text-slate-400 mt-1">We do not sell, rent, or lease investor phone numbers, emails, or portfolio data to third parties.</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
            <Database size={18} />
          </div>
          <h4 className="font-bold text-sm text-white">Ephemeral PAN Lookups</h4>
          <p className="text-xs text-slate-400 mt-1">Allotment check queries are relayed directly to registrars without saving sensitive PAN cards to disk.</p>
        </div>
      </div>

      {/* Detailed Legal Clauses */}
      <div className="space-y-8 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-10 text-xs sm:text-sm text-slate-300 leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono">01.</span> Information We Collect
          </h2>
          <p>
            When you interact with IPOPulse Pro, we collect limited personal identification and usage information strictly required to provide market tracking services:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
            <li><strong className="text-slate-200">Account Information:</strong> Name, verified email address, and hashed authentication credentials created during voluntary account registration.</li>
            <li><strong className="text-slate-200">User Preferences:</strong> Watchlisted IPO symbols, custom GMP notification thresholds, and saved calculation scenarios.</li>
            <li><strong className="text-slate-200">Technical Logs:</strong> IP address, browser user-agent, operating system, and diagnostic latency metrics to ensure high platform availability and defend against DDoS attacks.</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-slate-800/80 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono">02.</span> Handling of PAN & Application Data
          </h2>
          <p>
            When utilizing our automated Allotment Verification tools, your Permanent Account Number (PAN), Application Number, or DP Client ID is transmitted via secure HTTPS proxy to the respective registrar (Link Intime, KFintech, or Bigshare).
          </p>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-300">
            <span className="font-semibold text-emerald-400 block mb-1">Our Ephemeral Guarantee:</span>
            Unless you explicitly tap "Save PAN to Family Tracker" within your authenticated dashboard, all allotment queries are handled in-memory and permanently purged once the response is delivered to your browser.
          </div>
        </section>

        <section className="space-y-3 border-t border-slate-800/80 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono">03.</span> Email Communications & Newsletters
          </h2>
          <p>
            Subscribers to our Daily Morning GMP Digest receive market wrap-ups, subscription milestones, and allotment alert dispatches. You retain full autonomy over your subscription preferences. Every email carries an instant single-click unsubscribe link.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-800/80 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono">04.</span> Cookies & Local Storage
          </h2>
          <p>
            We utilize essential JWT session tokens stored in your browser's Local Storage to maintain persistent authentication across sessions. We do NOT deploy invasive third-party tracking pixels, ad cookies, or behavioral advertising trackers.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-800/80 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono">05.</span> Regulatory Compliance & Jurisdiction
          </h2>
          <p>
            This policy is formulated in strict compliance with the <strong className="text-white">Information Technology Act, 2000</strong>, the <strong className="text-white">Digital Personal Data Protection (DPDP) Act, 2023</strong>, and associated SEBI cyber-security guidelines. Any legal inquiries or data deletion requests may be lodged with our Data Protection Officer at <a href="mailto:privacy@ipopulse.pro" className="text-emerald-400 hover:underline">privacy@ipopulse.pro</a>.
          </p>
        </section>

      </div>
    </div>
  );
}
