import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, LayoutDashboard } from "lucide-react";

export default function DashboardBreadcrumb() {
  const location = useLocation();
  const navigate = useNavigate();

  const segments = location.pathname
    .split("/")
    .filter(Boolean)
    .slice(1); // remove "dashboard"

  const format = text =>
    text
      .replace(/-/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="flex items-center justify-between gap-3 mb-8 pb-4 border-b border-slate-800/80">
      <div className="flex items-center gap-2.5">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* BREADCRUMBS */}
        <nav className="text-xs font-semibold flex items-center gap-1.5 text-slate-400">
          <Link
            to="/dashboard"
            className="flex items-center gap-1 hover:text-emerald-400 transition"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          {segments.map((seg, idx) => (
            <span key={idx} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-white font-bold">
                {format(seg)}
              </span>
            </span>
          ))}
        </nav>
      </div>

      <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Live Session</span>
      </div>
    </div>
  );
}
