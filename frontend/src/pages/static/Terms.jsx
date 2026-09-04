import React from "react";
import PageHeader from "../../components/PageHeader";
import { AlertTriangle, ShieldCheck, Scale, FileText } from "lucide-react";

export default function Terms() {
  const lastUpdated = "September 2026";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-slate-100">
      <PageHeader
        badge="Terms & Disclaimers"
        title="Terms of Service & Regulatory Disclosures"
        subtitle={`Effective as of ${lastUpdated}. Please read these terms carefully before accessing IPOPulse Pro data feeds, Grey Market trackers, or allotment interfaces.`}
      />

      {/* Critical Statutory Alert Box */}
      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm leading-relaxed mb-10 flex gap-4 items-start">
        <AlertTriangle size={24} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-bold block text-base mb-1">
            Statutory SEBI Regulatory Disclaimer
          </strong>
          IPOPulse Pro is purely a financial technology information portal. We are NOT registered as a SEBI Investment Adviser (RIA) or Research Analyst (RA). The analytics, Grey Market Premium (GMP) numbers, subscription metrics, and AI summaries displayed on this website are provided strictly for informational and educational purposes. Nothing herein constitutes an offer, solicitation, or recommendation to buy, sell, or subscribe to any securities.
        </div>
      </div>

      {/* Terms Body */}
      <div className="space-y-8 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-10 text-xs sm:text-sm text-slate-300 leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono">01.</span> Nature of Grey Market Intelligence
          </h2>
          <p>
            Grey Market Premium (GMP) data is unofficial, over-the-counter intelligence aggregated from private broker networks and dealers. It is neither recognized nor endorsed by SEBI, NSE, or BSE. GMP fluctuations reflect subjective short-term liquidity rather than intrinsic corporate fundamentals. You acknowledge that high GMP is no guarantee of listing day gains.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-800/80 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono">02.</span> Independent Due Diligence Required
          </h2>
          <p>
            Equity and SME investments are subject to substantial market risks, including the complete loss of invested principal. Investors must review the official Red Herring Prospectus (RHP) filed with SEBI and consult a licensed financial advisor prior to applying through ASBA or UPI.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-800/80 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono">03.</span> Accuracy of Data & Third-Party APIs
          </h2>
          <p>
            While IPOPulse Pro employs strict verification pipelines, we cannot warrant the absolute accuracy, completeness, or timeliness of data sourced from exchange terminals, registrar servers, or news outlets. We disclaim all liability for any direct or indirect trading losses resulting from reliance on our platform feeds.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-800/80 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono">04.</span> Intellectual Property & Prohibited Scraping
          </h2>
          <p>
            All proprietary analytics algorithms, UX design systems, and compiled databases are the intellectual property of IPOPulse Pro. Automated harvesting, headless scraping, or commercial republication of our consolidated GMP feed without written consent is strictly prohibited.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-800/80 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono">05.</span> Governing Law & Dispute Resolution
          </h2>
          <p>
            These Terms are governed by and construed under the laws of the Republic of India. Any legal disputes arising out of the use of this portal shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra.
          </p>
        </section>

      </div>
    </div>
  );
}
