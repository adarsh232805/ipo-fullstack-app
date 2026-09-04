import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  Building2
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "General Inquiry",
    subject: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate real network submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "General Inquiry",
        subject: "",
        message: ""
      });
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-slate-100">
      <PageHeader
        badge="Direct Support Desk"
        title="Contact Platform & Research Support"
        subtitle="Need help querying your allotment, verifying a grey market quote, or reporting a data issue? Our support and research desk is here to assist."
      />

      <div className="grid lg:grid-cols-12 gap-10">

        {/* Contact Info Sidebar (Col 5) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Quick Reach Cards */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="text-emerald-400" size={18} /> Official Channels
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Investor Support & Inquiries</span>
                  <a href="mailto:support@ipopulse.pro" className="text-white hover:text-emerald-400 font-semibold text-sm transition">
                    support@ipopulse.pro
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Building2 size={16} />
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Research & Dealer Desk</span>
                  <a href="mailto:research@ipopulse.pro" className="text-white hover:text-blue-400 font-semibold text-sm transition">
                    research@ipopulse.pro
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 text-purple-400 flex items-center justify-center flex-shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Operating Hours</span>
                  <span className="text-white font-semibold">
                    Mon – Sat: 9:00 AM – 7:30 PM IST
                  </span>
                  <span className="text-slate-500 block text-[11px] mt-0.5">
                    Continuous monitoring during active bidding sessions
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Registered Address</span>
                  <span className="text-slate-300">
                    Bandra Kurla Complex (BKC), Financial District, Mumbai 400051, Maharashtra, India
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SLA Guarantee Box */}
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 space-y-2">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-sm">
              <ShieldCheck size={16} /> Rapid Response Guarantee
            </span>
            <p className="leading-relaxed">
              Inquiries submitted during active IPO bidding cycles (10 AM to 5 PM) are prioritized by our market operations desk with an average response time of under 45 minutes.
            </p>
          </div>
        </div>

        {/* Contact Form (Col 7) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white">Message Dispatched Successfully</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                Thank you for reaching out. Ticket ID <strong className="text-emerald-400">#IPO-{Math.floor(100000 + Math.random() * 900000)}</strong> has been opened. Our analyst desk will review and reply to your email shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-lg font-bold text-white mb-2">Send an Inquiry to Our Analysts</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adarsh Singh"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Category of Query *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Allotment Check Issue">Allotment Check Issue</option>
                    <option value="GMP Discrepancy Report">GMP Discrepancy Report</option>
                    <option value="API / Institutional Partnership">API / Institutional Partnership</option>
                    <option value="Legal & Compliance">Legal & Compliance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Subject Line *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Brief summary of your inquiry"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Detailed Message *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please provide issue details, specific IPO name, or any errors encountered..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <span>Dispatching Message...</span>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
