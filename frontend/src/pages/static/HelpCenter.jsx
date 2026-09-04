import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import {
  HelpCircle,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Calculator,
  Search,
  ArrowRight,
  TrendingUp,
  FileCheck2
} from "lucide-react";
import { Link } from "react-router-dom";

export default function HelpCenter() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const guides = [
    {
      id: "allotment",
      title: "How to Check Allotment with PAN & Application Number",
      category: "Allotment & Verification",
      readTime: "3 min read",
      summary: "Understand registrar timelines, query your status via IPOPulse Pro, and verify direct unblocking of UPI mandates on bank portals.",
      steps: [
        "Locate your 10-character alphanumeric PAN card number.",
        "Navigate to our Allotment Status Checker (/allotment) or choose your designated registrar (Link Intime, KFintech, Bigshare).",
        "Select the IPO company name from the active list.",
        "Submit to view allocated shares, cut-off clearing price, and refund reference number."
      ]
    },
    {
      id: "gmp",
      title: "Understanding Grey Market Premiums (GMP) & Kostak Rates",
      category: "Market Signals",
      readTime: "4 min read",
      summary: "A comprehensive guide on how unofficial market premiums operate across dealer circles, what Kostak and Sauda mean, and how to assess risk.",
      steps: [
        "GMP represents unofficial cash over the issue price traded prior to listing.",
        "Kostak is the fixed profit made by selling your entire retail application before allotment.",
        "Subject to Sauda denotes the guaranteed profit agreed upon only if you actually win an allotment.",
        "Remember: GMP is an unregulated indicator and broad market sentiment can alter listing performance."
      ]
    },
    {
      id: "upi",
      title: "UPI ASBA Mandate Block & Unblocking Timelines",
      category: "Banking & Payments",
      readTime: "3 min read",
      summary: "Troubleshoot common UPI mandate authorization errors on Google Pay, PhonePe, BHIM, and understand typical refund schedules.",
      steps: [
        "Bids submitted between 10:00 AM and 5:00 PM generate a UPI mandate request within 2 to 4 hours.",
        "Approve the mandate before 5:00 PM on closing day to ensure application validity.",
        "If not allotted, the lien expires automatically within 48 hours of basis of allotment finalization.",
        "In case of delays, file a mandate revocation ticket with your bank's UPI grievance officer using your UMN (Unique Mandate Number)."
      ]
    },
    {
      id: "sme",
      title: "Mainboard vs. SME IPOs: Liquidity, Lot Sizes, and Risk",
      category: "Investment Education",
      readTime: "5 min read",
      summary: "Analyze the fundamental differences between mainboard issues and high-volatility SME emerging platforms.",
      steps: [
        "Mainboard issues are larger corporations with minimum retail application tickets around ₹14,000–₹15,000.",
        "SME issues (NSE Emerge / BSE SME) require mandatory minimum lot sizes of ₹1,00,000 to ₹1,40,000.",
        "SME stocks trade in fixed lot sizes even after listing in the secondary market.",
        "Exercise enhanced due diligence on SME promoter debt and cash flows."
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-slate-100">
      <PageHeader
        badge="Platform Documentation"
        title="Investor Knowledge & Help Center"
        subtitle="Step-by-step guides, payment mandate troubleshooting, registrar directories, and technical FAQs to streamline your primary market journey."
      />

      {/* Quick Action Cards */}
      <div className="grid sm:grid-cols-3 gap-6 mb-16">
        <Link
          to="/allotment"
          className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <FileCheck2 size={20} />
          </div>
          <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition">Check Allotment</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Direct real-time query against KFintech, Link Intime, and Bigshare official servers.
          </p>
          <span className="text-xs text-emerald-400 font-semibold mt-4 flex items-center gap-1">
            Launch Checker <ArrowRight size={13} />
          </span>
        </Link>

        <Link
          to="/gmp"
          className="bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <TrendingUp size={20} />
          </div>
          <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition">Live GMP Radar</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Daily Grey Market Premiums, estimated listing gains, and 7-day trend sparklines.
          </p>
          <span className="text-xs text-blue-400 font-semibold mt-4 flex items-center gap-1">
            View Live Rates <ArrowRight size={13} />
          </span>
        </Link>

        <Link
          to="/contact"
          className="bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <HelpCircle size={20} />
          </div>
          <h3 className="font-bold text-base text-white group-hover:text-purple-400 transition">Ask an Analyst</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Submit custom queries to our research desk regarding prospectus filings and valuations.
          </p>
          <span className="text-xs text-purple-400 font-semibold mt-4 flex items-center gap-1">
            Submit Ticket <ArrowRight size={13} />
          </span>
        </Link>
      </div>

      {/* Guide Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Comprehensive Investor Walkthroughs
          </h2>
          <span className="text-xs text-slate-400">4 Guides Available</span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {guide.category}
                  </span>
                  <span className="text-slate-500">{guide.readTime}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                  {guide.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {guide.summary}
                </p>

                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                    Key Execution Checklist:
                  </span>
                  {guide.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                      <span className="w-4 h-4 rounded-full bg-slate-900 text-emerald-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
