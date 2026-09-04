import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TrendingUp,
  Clock,
  CheckCircle,
  Database,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  ShieldAlert,
  Server,
  Activity,
  Layers,
  Search,
  ArrowUpRight,
  Sparkles,
  FileCheck2,
  DollarSign,
  PieChart as PieIcon,
  BarChart3
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { getAdminAnalytics, getAdminIpos, triggerMarketSync, updateIpoStatus } from "../../services/adminApi";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, iposRes] = await Promise.allSettled([
        getAdminAnalytics(),
        getAdminIpos()
      ]);

      if (analyticsRes.status === "fulfilled") {
        setAnalytics(analyticsRes.value.data);
      }

      if (iposRes.status === "fulfilled") {
        const data = iposRes.value.data;
        const list = Array.isArray(data) ? data : (data?.ipos || []);
        setIpos(list);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSync = async () => {
    setSyncing(true);
    setSyncMessage("Connecting to Groww, NSE, IPOWatch & IPOGyani...");
    try {
      const res = await triggerMarketSync();
      setSyncMessage(res.data?.message || "Market sync completed successfully!");
      await fetchDashboardData();
    } catch (err) {
      setSyncMessage("Sync failed: " + (err.response?.data?.error || err.message));
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(""), 5000);
    }
  };

  const handleStatusChange = async (ipoId, newStatus) => {
    try {
      await updateIpoStatus(ipoId, newStatus);
      await fetchDashboardData();
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  // Filtered IPOs
  const filteredIpos = ipos.filter(ipo => {
    const matchesSearch =
      (ipo.companyName || ipo.company || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || (ipo.status || "").toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Chart data
  const statusChartData = analytics?.status ? [
    { name: "Live / Open", value: analytics.status.open || 0, color: "#10B981" },
    { name: "Upcoming", value: analytics.status.upcoming || 0, color: "#3B82F6" },
    { name: "Closed", value: analytics.status.closed || 0, color: "#6B7280" },
    { name: "Listed", value: analytics.status.listed || 0, color: "#8B5CF6" }
  ] : [];

  const boardChartData = analytics?.board ? [
    { name: "Mainboard", value: analytics.board.mainboard || 0, color: "#2563EB" },
    { name: "SME", value: analytics.board.sme || 0, color: "#F59E0B" }
  ] : [];

  const topGainersChart = (analytics?.topGainers || []).slice(0, 5).map(g => ({
    name: (g.companyName || "").split(" ")[0],
    fullName: g.companyName,
    gmp: g.gmp || 0
  }));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/80 backdrop-blur border border-slate-700/60 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              Admin Command Center
            </span>
            <span className="text-xs text-slate-400">
              Made with ❤️ by <span className="text-slate-200 font-semibold">Adarsh Singh</span>
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-2 tracking-tight">
            System & Application Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time control over IPO listings, live market scrapers, GMP pricing, and automated multi-PAN allotment checks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition shadow-lg shadow-emerald-900/30"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing Market..." : "Trigger Live Sync"}
          </button>

          <button
            onClick={() => navigate("/admin/ipos/add")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition shadow-lg shadow-blue-900/30"
          >
            <PlusCircle className="w-4 h-4" />
            Add New IPO
          </button>

          <Link
            to="/allotment"
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2.5 rounded-xl font-medium text-sm transition border border-slate-600"
          >
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            Allotment Engine
          </Link>

          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-3.5 py-2.5 rounded-xl text-sm transition border border-slate-600/50"
            title="View Public Website"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Sync notification message */}
      {syncMessage && (
        <div className="p-4 bg-emerald-900/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-sm flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>{syncMessage}</span>
          </div>
          <button onClick={() => setSyncMessage("")} className="text-emerald-400 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          title="Total IPOs Tracked"
          value={analytics?.total ?? ipos.length}
          subtitle="Across Mainboard & SME"
          icon={<Layers className="w-6 h-6 text-blue-400" />}
          badge="Live Market"
          badgeColor="bg-blue-500/20 text-blue-400 border-blue-500/30"
        />

        <KpiCard
          title="Active Bidding (Open)"
          value={analytics?.status?.open ?? ipos.filter(i => i.status === "open").length}
          subtitle="Accepting Retail/HNI bids"
          icon={<CheckCircle className="w-6 h-6 text-emerald-400" />}
          badge="Active Now"
          badgeColor="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
        />

        <KpiCard
          title="Upcoming Pipeline"
          value={analytics?.status?.upcoming ?? ipos.filter(i => i.status === "upcoming").length}
          subtitle="Launching in next 14 days"
          icon={<Clock className="w-6 h-6 text-amber-400" />}
          badge="Pipeline"
          badgeColor="bg-amber-500/20 text-amber-400 border-amber-500/30"
        />

        <KpiCard
          title="Average GMP Premium"
          value={analytics?.gmp?.average ? `₹${analytics.gmp.average}` : "₹18"}
          subtitle={`Highest: ₹${analytics?.gmp?.highest || 65}`}
          icon={<TrendingUp className="w-6 h-6 text-purple-400" />}
          badge="Grey Market"
          badgeColor="bg-purple-500/20 text-purple-400 border-purple-500/30"
        />
      </div>

      {/* ================= SECONDARY STATS & SYSTEM TELEMETRY ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Architecture & Health */}
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
            <h3 className="font-bold text-slate-100 flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-400" />
              Live Infrastructure Telemetry
            </h3>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          <div className="space-y-4 mt-4 text-sm">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-700/30">
              <span className="text-slate-400">Database Engine</span>
              <span className="font-medium text-emerald-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                {analytics?.systemHealth?.database || "MongoDB Atlas / Memory Cache"}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-700/30">
              <span className="text-slate-400">Market Scraper Engine</span>
              <span className="font-medium text-blue-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Groww + NSE + IPOWatch + Gyani
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-700/30">
              <span className="text-slate-400">AI Intelligence Core</span>
              <span className="font-medium text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Groq LLaMA-3.3 70B Versatile
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-700/30">
              <span className="text-slate-400">Automated Allotment Engine</span>
              <span className="font-medium text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Multi-PAN Direct Engine
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-400">Last Market Auto-Sync</span>
              <span className="text-xs text-slate-300 font-mono">
                {analytics?.systemHealth?.lastScraperSync ? new Date(analytics.systemHealth.lastScraperSync).toLocaleTimeString() : "Live Active"}
              </span>
            </div>
          </div>
        </div>

        {/* Top 5 GMP Gainers Chart */}
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-lg lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
            <div>
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                Top GMP Gainers (Premium per Share)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Highest expected listing gains currently in market</p>
            </div>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              ₹ Premium / Share
            </span>
          </div>

          <div className="h-48 mt-4">
            {topGainersChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topGainersChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: "#1E293B", borderColor: "#475569", borderRadius: "8px", color: "#FFF" }}
                    formatter={(val, name, item) => [`₹${val}`, `${item.payload.fullName}`]}
                  />
                  <Bar dataKey="gmp" radius={[6, 6, 0, 0]}>
                    {topGainersChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EC4899"][index % 5]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                No active GMP data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= COMPREHENSIVE IPO MANAGEMENT TABLE ================= */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              Live IPO Offerings & CMS Controls
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Search, filter, update statuses, manage GMP and view deep company financials.
            </p>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search company..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-blue-500 w-48 sm:w-64"
              />
            </div>

            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs">
              {["all", "open", "upcoming", "closed"].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition font-medium ${
                    statusFilter === st
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-700/60">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Company</th>
                <th className="py-3.5 px-4 font-semibold">Board</th>
                <th className="py-3.5 px-4 font-semibold">Price Band</th>
                <th className="py-3.5 px-4 font-semibold">Live GMP</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filteredIpos.length > 0 ? (
                filteredIpos.map(ipo => {
                  const name = ipo.companyName || ipo.company || "Unknown Company";
                  const gmpVal = Number(ipo.gmp) || 0;
                  return (
                    <tr key={ipo._id} className="hover:bg-slate-700/30 transition">
                      <td className="py-3.5 px-4 font-medium text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-xs border border-blue-500/20">
                            {name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold">{name}</div>
                            <div className="text-xs text-slate-400">
                              {ipo.openDate ? new Date(ipo.openDate).toLocaleDateString() : "TBA"} - {ipo.closeDate ? new Date(ipo.closeDate).toLocaleDateString() : "TBA"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${
                            (ipo.board || "").toUpperCase() === "SME"
                              ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                              : "bg-blue-500/15 text-blue-400 border-blue-500/30"
                          }`}
                        >
                          {ipo.board || "MAINBOARD"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-200">
                        {ipo.priceBand || "₹TBA"}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`font-semibold ${gmpVal > 0 ? "text-emerald-400" : "text-slate-400"}`}>
                          ₹{gmpVal}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={ipo.status || "upcoming"}
                          onChange={e => handleStatusChange(ipo._id, e.target.value)}
                          className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500 font-medium"
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="open">Open</option>
                          <option value="closed">Closed</option>
                          <option value="listed">Listed</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => navigate(`/admin/ipos/${ipo._id}/edit`)}
                          className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg text-xs font-medium transition border border-blue-500/30"
                        >
                          Edit CMS
                        </button>
                        <Link
                          to={`/ipos/${ipo._id}`}
                          target="_blank"
                          className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-medium transition inline-flex items-center gap-1 border border-slate-600"
                          title="View Live Page"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-500 text-sm">
                    {loading ? "Loading IPO records..." : "No IPOs match your search or filter."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* Helper Card Component */
function KpiCard({ title, value, subtitle, icon, badge, badgeColor }) {
  return (
    <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-slate-600 transition">
      <div className="flex items-start justify-between">
        <div>
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
            {badge}
          </span>
          <h3 className="text-slate-400 text-sm font-medium mt-3">{title}</h3>
          <div className="text-3xl font-extrabold text-white mt-1 tracking-tight">{value}</div>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>
        <div className="p-3 bg-slate-700/50 rounded-xl border border-slate-600/40">{icon}</div>
      </div>
    </div>
  );
}

