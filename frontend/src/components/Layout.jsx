import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MarketTicker from "./MarketTicker";
import Navbar from "./Navbar";
import Footer from "./Footer";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      <ScrollToTop />
      {/* GLOBAL REAL-TIME MARKET TICKER & AUTO-SYNC */}
      <MarketTicker />

      {/* GLOBAL NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* GLOBAL FOOTER */}
      <Footer />
    </div>
  );
}
