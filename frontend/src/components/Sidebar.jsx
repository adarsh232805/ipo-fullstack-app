import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  CheckCircle2,
  Layers,
  UserCheck,
  TrendingUp,
  ExternalLink,
  Shield,
  LogOut,
  X,
  Sparkles,
  ShieldCheck
} from "lucide-react";

export default function Sidebar({ closeSidebar }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (closeSidebar) closeSidebar();
    logout();
    navigate("/login");
  };

  const navItem =
    "flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition group";

  const activeItem =
    "bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20";

  const inactiveItem =
    "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent";

  return (
    <div className="h-full flex flex-col justify-between bg-slate-950 border-r border-slate-800/80 p-5 text-slate-100 select-none">
      <div>
        {/* BRAND HEADER */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-6">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-extrabold text-slate-950 shadow-md shadow-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight flex items-center gap-1">
                IPOPulse <span className="text-emerald-400 font-bold">Pro</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold block">
                Investor Portal
              </span>
            </div>
          </div>

          {closeSidebar && (
            <button
              onClick={closeSidebar}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* USER PROFILE MINI CARD */}
        {user && (
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 mb-6 flex items-center gap-3 shadow-inner">
            <img
              src={
                user.profilePhoto ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "Investor")}&background=10b981&color=020617`
              }
              alt="Avatar"
              className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow"
            />
            <div className="overflow-hidden flex-1">
              <h4 className="font-bold text-white text-xs truncate">
                {user.name || "Investor"}
              </h4>
              <p className="text-[10px] text-slate-400 truncate">
                {user.email || "demo@ipo.com"}
              </p>
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                KYC Verified
              </span>
            </div>
          </div>
        )}

        {/* DASHBOARD NAV LINKS */}
        <nav className="space-y-1.5">
          <div className="px-3 pb-1 text-[10px] uppercase tracking-wider font-bold text-slate-500">
            Portfolio Management
          </div>

          <NavLink
            to="/dashboard"
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : inactiveItem}`
            }
          >
            {({ isActive }) => (
              <>
                <LayoutDashboard className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-indigo-400"}`} />
                <span>Dashboard Overview</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/dashboard/allotment"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : inactiveItem}`
            }
          >
            {({ isActive }) => (
              <>
                <CheckCircle2 className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-emerald-400"}`} />
                <span>Allotment Radar</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/dashboard/applications"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : inactiveItem}`
            }
          >
            {({ isActive }) => (
              <>
                <Layers className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-amber-400"}`} />
                <span>Bids & Applications</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/dashboard/profile"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeItem : inactiveItem}`
            }
          >
            {({ isActive }) => (
              <>
                <UserCheck className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-cyan-400"}`} />
                <span>Profile & Security</span>
              </>
            )}
          </NavLink>
        </nav>

        {/* MARKET SHORTCUTS */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 space-y-1.5">
          <div className="px-3 pb-1 text-[10px] uppercase tracking-wider font-bold text-slate-500">
            Live Markets
          </div>

          <NavLink
            to="/"
            onClick={closeSidebar}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition"
          >
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Explore Public IPOs</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
          </NavLink>

          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              onClick={closeSidebar}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Console</span>
            </NavLink>
          )}
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="pt-4 border-t border-slate-800/80">
        <button
          onClick={handleLogout}
          className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Session</span>
        </button>

        <div className="mt-3 text-center">
          <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" /> 256-Bit Encrypted Portal
          </span>
        </div>
      </div>
    </div>
  );
}
