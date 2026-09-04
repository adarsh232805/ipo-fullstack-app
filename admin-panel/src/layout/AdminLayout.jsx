import { NavLink, Outlet } from "react-router-dom";
import {
  Users,
  LayoutDashboard,
  BarChart3,
  Briefcase
} from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col shadow-xl">
        {/* LOGO */}
        <div className="px-6 py-5 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-wide">
            IPO Admin
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Management Panel
          </p>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-4 py-6 space-y-1 text-sm">
          <SidebarLink to="/" label="Dashboard" icon={<LayoutDashboard size={18} />} />
          <SidebarLink to="/ipos" label="IPO Management" icon={<Briefcase size={18} />} />
          <SidebarLink to="/users" label="User Management" icon={<Users size={18} />} />
          <SidebarLink to="/analytics" label="Analytics" icon={<BarChart3 size={18} />} />
        </nav>

        {/* FOOTER */}
        <div className="px-4 py-4 border-t border-white/10 text-xs text-gray-400">
          © 2026 IPO Insight
        </div>
      </aside>

      {/* ================= CONTENT ================= */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

/* ================= SIDEBAR LINK ================= */
function SidebarLink({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition-all
         ${
           isActive
             ? "bg-white/10 text-white font-medium"
             : "text-gray-300 hover:bg-white/5 hover:text-white"
         }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
