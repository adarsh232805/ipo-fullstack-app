import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  Bell
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    path: "/",
    icon: <LayoutDashboard size={18} />
  },
  {
    name: "IPO Management",
    path: "/ipos",
    icon: <Building2 size={18} />
  },
  {
    name: "User Management",   // ✅ THIS WAS MISSING
    path: "/users",
    icon: <Users size={18} />
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: <Bell size={18} />
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: <BarChart3 size={18} />
  }
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white px-4 py-6">
      {/* LOGO */}
      <div className="mb-10">
        <h1 className="text-xl font-bold">IPO Admin</h1>
        <p className="text-xs text-slate-400">Management Panel</p>
      </div>

      {/* MENU */}
      <nav className="space-y-2">
        {menu.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition
               ${
                 isActive
                   ? "bg-slate-700 font-semibold"
                   : "text-slate-300 hover:bg-slate-700/60"
               }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="absolute bottom-4 left-4 text-xs text-slate-400">
        © {new Date().getFullYear()} IPO Insight
      </div>
    </aside>
  );
}
