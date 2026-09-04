import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import {
  Briefcase,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  Send,
  Code,
  LineChart,
  Server
} from "lucide-react";

export default function Careers() {
  const [appliedRole, setAppliedRole] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [candidateEmail, setCandidateEmail] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");

  const openings = [
    {
      id: "fe-quant",
      title: "Senior Quantitative Frontend Engineer",
      dept: "Trading & Client UX",
      location: "Mumbai / Remote (India)",
      type: "Full-Time",
      icon: <Code className="text-emerald-400" size={20} />,
      desc: "Architect low-latency financial visualizations, GMP distribution heatmaps, and reactive state systems with React 19, Tailwind CSS, and WebSockets."
    },
    {
      id: "be-infra",
      title: "Primary Market Backend Engineer",
      dept: "Data Infrastructure",
      location: "Mumbai / Hybrid",
      type: "Full-Time",
      icon: <Server className="text-blue-400" size={20} />,
      desc: "Build fault-tolerant ingestion pipelines connecting directly to NSE/BSE bidding engines and registrar APIs with Node.js, Redis, and MongoDB."
    },
    {
      id: "mkt-analyst",
      title: "Lead IPO & Equity Research Analyst",
      dept: "Research Desk",
      location: "Mumbai",
      type: "Full-Time",
      icon: <LineChart className="text-purple-400" size={20} />,
      desc: "Conduct forensic accounting reviews on DRHP / RHP filings, analyze promoter governance, and oversee daily dealer circle GMP sentiment collation."
    },
    {
      id: "prod-des",
      title: "Staff Fintech Product Designer",
      dept: "Design & UX",
      location: "Bengaluru / Remote",
      type: "Full-Time",
      icon: <Sparkles className="text-amber-400" size={20} />,
      desc: "Design accessible, institutional-caliber web and mobile user interfaces that turn complex subscription math into clear investor decisions."
    }
  ];

  const handleApply = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-slate-100">
      <PageHeader
        badge="Join Our Mission"
        title="Build the Future of Primary Market Intelligence"
        subtitle="We are assembling a high-caliber team of financial engineers, quantitative researchers, and designers to level the playing field for over 100 million Indian retail investors."
      />

      {/* Culture & Perks Grid */}
      <div className="grid sm:grid-cols-3 gap-6 mb-16">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <TrendingUp size={20} />
          </div>
          <h3 className="font-bold text-base text-white">Competitive Equity & ESOPs</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Every team member receives significant equity participation from Day 1 to participate in our long-term value creation.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
            <Zap size={20} />
          </div>
          <h3 className="font-bold text-base text-white">Engineering Autonomy</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            High ownership, minimal bureaucracy. Ship production features that directly impact how thousands of investors deploy capital.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
            <ShieldCheck size={20} />
          </div>
          <h3 className="font-bold text-base text-white">Comprehensive Health & Wellness</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            ₹10 Lakh group family health cover, annual wellness stipend, and generous flexible work arrangement policies.
          </p>
        </div>
      </div>

      {/* Open Roles Section */}
      <div className="mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">CURRENT OPENINGS</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Explore Available Engineering & Research Roles
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {openings.length} Active Positions • All Exp Levels
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {openings.map((role) => (
            <div
              key={role.id}
              className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-slate-700 hover:shadow-xl transition group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {role.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {role.location}
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {role.type}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                  {role.title}
                </h3>
                <span className="text-xs text-slate-500 block mt-0.5 font-medium">
                  {role.dept}
                </span>

                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  {role.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-500">Competitive INR + ESOPs</span>
                <button
                  onClick={() => {
                    setAppliedRole(role);
                    setSubmitted(false);
                    const el = document.getElementById("apply-box");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 font-bold text-xs border border-slate-700 hover:border-emerald-500 transition flex items-center gap-1.5"
                >
                  <span>Apply Now</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Application Box */}
      <div
        id="apply-box"
        className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-2xl"
      >
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white">Application Received!</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Thank you for your interest in joining IPOPulse Pro{appliedRole ? ` for the ${appliedRole.title} role` : ""}. Our talent team reviews every submission within 3 business days.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold transition"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-4">
              <div className="text-center mb-6">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">EXPEDITED REVIEW</span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {appliedRole ? `Apply for ${appliedRole.title}` : "Direct Application / General Expression of Interest"}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Share your credentials or GitHub/LinkedIn link below. No cover letters required.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  required
                  placeholder="Your Work / Personal Email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="url"
                  required
                  placeholder="LinkedIn / GitHub / Portfolio URL"
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={14} />
                <span>Submit Candidate Profile</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
