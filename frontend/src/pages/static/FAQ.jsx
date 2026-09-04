import React, { useState, useMemo } from "react";
import PageHeader from "../../components/PageHeader";
import {
  HelpCircle,
  Search,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Calculator,
  Building2,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [openIndex, setOpenIndex] = useState(0);

  const categories = [
    { id: "ALL", label: "All Questions" },
    { id: "GMP", label: "Grey Market & GMP" },
    { id: "ALLOTMENT", label: "Allotment & Refunds" },
    { id: "BIDDING", label: "Bidding & Quotas" },
    { id: "SECURITY", label: "Platform & Data Safety" }
  ];

  const faqs = [
    {
      category: "GMP",
      q: "What is Grey Market Premium (GMP) and how is it calculated?",
      a: "Grey Market Premium (GMP) is the cash premium over the issue cut-off price at which IPO shares or applications are Unofficially traded among brokers and high-net-worth investors before the official listing date on NSE/BSE. If an IPO price band is ₹100 and the GMP is ₹40, the anticipated market listing price is estimated around ₹140 (+40%)."
    },
    {
      category: "GMP",
      q: "Is GMP regulated by the Securities and Exchange Board of India (SEBI)?",
      a: "No. SEBI does NOT endorse, regulate, or monitor the grey market. Grey market trading is an over-the-counter forward indicator driven entirely by subjective market demand, institutional interest, and broker speculation. While historical correlation with listing gains is high (>85%), sudden broad-market swings can impact final debut pricing."
    },
    {
      category: "ALLOTMENT",
      q: "How does the retail IPO allotment lottery work?",
      a: "If the retail category is oversubscribed (e.g., 20x), SEBI mandates an automated, computerized lottery managed by the designated registrar (such as Link Intime or KFintech). Every retail bidder who applied at the cut-off price has an equal probability of winning one lot. Applying for multiple lots under a single PAN does NOT increase your retail lottery chances."
    },
    {
      category: "ALLOTMENT",
      q: "When and how are unallocated UPI application funds unblocked?",
      a: "Funds applied via UPI ASBA remain blocked in your bank account until the registrar finalizes the basis of allotment. If you are not allotted shares, the registrar transmits mandate revocation requests to NPCI and your bank, which typically releases the lien within 24 to 48 hours following the allotment date."
    },
    {
      category: "BIDDING",
      q: "What is the difference between Cut-off Price and bidding a custom limit?",
      a: "The 'Cut-off Price' represents the maximum ceiling of the IPO's price band. Retail individual investors should always select 'Cut-off Price' to guarantee that their application remains valid regardless of where the book-building clears. Entering a lower custom price risks immediate disqualification if the issue prices at the ceiling."
    },
    {
      category: "BIDDING",
      q: "What is the distinction between Mainboard and SME IPOs?",
      a: "Mainboard IPOs are established corporations listing on the primary NSE/BSE boards with retail application thresholds around ₹14,000–₹15,000. SME (Small & Medium Enterprise) IPOs trade on NSE Emerge or BSE SME platforms with higher risk profiles and mandatory minimum lot values between ₹1,00,000 and ₹1,40,000."
    },
    {
      category: "SECURITY",
      q: "Is it safe to check allotment status with my PAN number on IPOPulse Pro?",
      a: "Yes. IPOPulse Pro connects directly through SSL/TLS 1.3 encrypted secure endpoints to official registrars (Link Intime, KFintech, Bigshare). We do not store, log, or sell your PAN card numbers or demat account details. All lookups are queried ephemerally in real-time."
    },
    {
      category: "SECURITY",
      q: "How often are GMP quotes and subscription figures refreshed?",
      a: "Subscription figures sync directly with exchange bidding terminals every 15 minutes during active bidding hours (10:00 AM to 5:00 PM IST). GMP rates are polled twice daily (9:00 AM and 6:30 PM IST) from verified dealer circles across Gujarat, Maharashtra, and Delhi primary market corridors."
    }
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter(item => {
      const matchCat = activeCategory === "ALL" || item.category === activeCategory;
      const matchSearch =
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.a.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [searchTerm, activeCategory]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-slate-100">
      <PageHeader
        badge="Help & Knowledge Base"
        title="Frequently Asked Questions"
        subtitle="Clear answers on Grey Market Premiums, retail allotment procedures, UPI ASBA unblocking, and platform security."
      />

      {/* Search Bar */}
      <div className="relative mb-8 max-w-2xl">
        <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search any question (e.g. GMP, unblock UPI, lottery, SME)..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-4 top-3 text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeCategory === cat.id
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      {filteredFaqs.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
          <HelpCircle size={40} className="mx-auto text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-white">No questions found matching your search</h3>
          <p className="text-xs text-slate-400 mt-1">Try another keyword or reach out directly to our support desk.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-slate-900/80 rounded-2xl border border-slate-800/90 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-200 hover:text-emerald-400 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-500 transition-transform flex-shrink-0 ${
                      isOpen ? "rotate-180 text-emerald-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Need more help banner */}
      <div className="mt-14 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-white">Still have questions?</h4>
          <p className="text-xs text-slate-400 mt-0.5">Our support desk is available 24/7 during primary market bidding cycles.</p>
        </div>
        <Link
          to="/contact"
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition"
        >
          Contact Support Desk
        </Link>
      </div>
    </div>
  );
}
