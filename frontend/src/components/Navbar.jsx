import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { fetchMe } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  TrendingUp,
  Menu,
  X,
  User,
  LayoutDashboard,
  Shield,
  LogOut,
  ChevronDown,
  Sparkles,
  Zap
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [user, setUser] = useState(null);
  const [userMenu, setUserMenu] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentUser = auth?.user || user;

  /* ================= LOAD USER ================= */
  useEffect(() => {
    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, [auth?.user]);

  const loadUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setUser(null);
    try {
      const me = await fetchMe();
      setUser(me);
    } catch {
      setUser(null);
    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    if (auth?.logout) auth.logout();
    localStorage.removeItem("token");
    setUser(null);
    setDrawerOpen(false);
    setUserMenu(false);
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition ${
      isActive
        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
        : "text-slate-400 hover:text-white hover:bg-slate-900"
    }`;

  return (
    <>
      {/* ================= TOP NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">

          {/* BRAND LOGO */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            onClick={() => navigate("/")}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-extrabold text-slate-950 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-1">
                IPOPulse <span className="text-emerald-400 font-bold">Pro</span>
              </span>
              <span className="hidden sm:block text-[9px] uppercase tracking-wider font-semibold text-slate-400">
                Primary Market Radar • Made with <span className="text-rose-500">❤️</span> by <span className="text-emerald-400 font-bold">Adarsh Singh</span>
              </span>
            </div>
          </div>

          {/* ================= DESKTOP NAVIGATION ================= */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-2xl">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/ipos" className={linkClass}>IPOs</NavLink>
            <NavLink to="/gmp" className={linkClass}>GMP Tracker</NavLink>
            <NavLink to="/compare" className={linkClass}>Compare</NavLink>
            <NavLink to="/allotment" className={linkClass}>Allotment</NavLink>

            {currentUser?.role === "admin" && (
              <NavLink
                to="/admin"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition"
              >
                Admin Panel
              </NavLink>
            )}
          </nav>

          {/* ================= RIGHT SIDE ================= */}
          <div className="flex items-center gap-3">

            {/* PROFILE (DESKTOP) */}
            <div className="relative hidden md:block">
              {!currentUser ? (
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition cursor-pointer"
                  >
                    Create Free Account
                  </button>
                </div>
              ) : (
                <>
                  <div
                    onClick={() => setUserMenu(!userMenu)}
                    className="flex items-center gap-2.5 py-1.5 px-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 cursor-pointer transition select-none"
                  >
                    <img
                      src={
                        currentUser.profilePhoto ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || "User")}&background=10b981&color=020617`
                      }
                      alt="Avatar"
                      className="w-7 h-7 rounded-xl object-cover border border-slate-700"
                    />
                    <span className="text-xs font-bold text-white max-w-[120px] truncate">
                      {currentUser.name || "Investor"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>

                  {userMenu && (
                    <div className="absolute right-0 mt-2.5 w-60 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden py-1 z-50 animate-fade-in">
                      <div className="px-4 py-3 border-b border-slate-800">
                        <p className="font-bold text-white text-xs truncate">
                          {currentUser.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {currentUser.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setUserMenu(false);
                            navigate("/dashboard/profile");
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2.5 transition"
                        >
                          <User className="w-4 h-4 text-emerald-400" />
                          <span>Profile Settings</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserMenu(false);
                            navigate("/dashboard");
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2.5 transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                          <span>Investor Dashboard</span>
                        </button>

                        {currentUser.role === "admin" && (
                          <button
                            onClick={() => {
                              setUserMenu(false);
                              navigate("/admin");
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 transition"
                          >
                            <Shield className="w-4 h-4 text-rose-400" />
                            <span>Admin Console</span>
                          </button>
                        )}
                      </div>

                      <div className="pt-1 border-t border-slate-800">
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

          </div>
        </div>
      </header>

      {/* ================= MOBILE SLIDE-IN DRAWER ================= */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="fixed top-0 right-0 h-full w-72 bg-slate-900 border-l border-slate-800 z-50 shadow-2xl flex flex-col justify-between p-5 animate-slideIn">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-xs">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-white text-base">IPOPulse Pro</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User snippet on mobile if logged in */}
              {currentUser && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 mb-4 flex items-center gap-3">
                  <img
                    src={
                      currentUser.profilePhoto ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || "User")}&background=10b981&color=020617`
                    }
                    alt="Avatar"
                    className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                  />
                  <div className="overflow-hidden">
                    <p className="font-bold text-white text-xs truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
              )}

              {/* Links */}
              <nav className="space-y-1.5 text-xs font-semibold">
                <DrawerLink to="/" close={setDrawerOpen}>Home</DrawerLink>
                <DrawerLink to="/ipos" close={setDrawerOpen}>IPO Radar</DrawerLink>
                <DrawerLink to="/gmp" close={setDrawerOpen}>GMP Live Tracker</DrawerLink>
                <DrawerLink to="/compare" close={setDrawerOpen}>Compare IPOs</DrawerLink>
                <DrawerLink to="/allotment" close={setDrawerOpen}>Allotment Check</DrawerLink>

                {currentUser ? (
                  <>
                    <div className="pt-3 pb-1 border-t border-slate-800/80 my-2 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                      Account & Portfolio
                    </div>
                    <DrawerLink to="/dashboard/profile" close={setDrawerOpen}>
                      Profile Settings
                    </DrawerLink>
                    <DrawerLink to="/dashboard" close={setDrawerOpen}>
                      Investor Dashboard
                    </DrawerLink>
                    {currentUser.role === "admin" && (
                      <DrawerLink to="/admin" close={setDrawerOpen} red>
                        Admin Portal
                      </DrawerLink>
                    )}
                  </>
                ) : (
                  <div className="pt-4 border-t border-slate-800/80 space-y-2 mt-4">
                    <button
                      onClick={() => {
                        setDrawerOpen(false);
                        navigate("/login");
                      }}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setDrawerOpen(false);
                        navigate("/signup");
                      }}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs transition"
                    >
                      Create Account
                    </button>
                  </div>
                )}
              </nav>
            </div>

            {currentUser && (
              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={logout}
                  className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

function DrawerLink({ to, children, close, red }) {
  return (
    <NavLink
      to={to}
      onClick={() => close(false)}
      className={({ isActive }) =>
        `block px-4 py-2.5 rounded-xl transition ${
          isActive
            ? "bg-emerald-500/15 text-emerald-400 font-bold"
            : red
            ? "text-rose-400 hover:bg-rose-500/10"
            : "text-slate-300 hover:text-white hover:bg-slate-800"
        }`
      }
    >
      {children}
    </NavLink>
  );
}
