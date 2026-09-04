import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PageHeader({ title, subtitle, badge }) {
  const navigate = useNavigate();

  return (
    <div className="mb-12">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition"
      >
        <ArrowLeft size={14} className="text-emerald-400" />
        <span>Back</span>
      </button>

      {badge && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          {badge}
        </div>
      )}

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
