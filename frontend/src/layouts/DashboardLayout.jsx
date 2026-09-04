import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardBreadcrumb from "../components/DashboardBreadcrumb";
import { Menu, TrendingUp } from "lucide-react";

export default function DashboardLayout() {
  const [mobileSidebar, setMobileSidebar] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex w-64 flex-col flex-shrink-0 z-30">
        <Sidebar />
      </aside>

      {/* ================= MOBILE SIDEBAR DRAWER ================= */}
      {mobileSidebar && (
        <>
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileSidebar(false)}
          />

          <div className="fixed top-0 left-0 h-full w-72 bg-slate-950 z-50 shadow-2xl animate-slideIn md:hidden">
            <Sidebar closeSidebar={() => setMobileSidebar(false)} />
          </div>
        </>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col min-w-0 z-10 overflow-y-auto">
        
        {/* MOBILE TOPBAR */}
        <header className="md:hidden bg-slate-950/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-white text-base">IPOPulse Pro</span>
          </div>

          <button
            onClick={() => setMobileSidebar(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <DashboardBreadcrumb />
          <Outlet />
        </main>

      </div>
    </div>
  );
}
