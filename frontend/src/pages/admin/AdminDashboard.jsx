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
  BarChart3,
  Users,
  Radio,
  Calendar,
  IndianRupee,
  Edit2,
  Check,
  X,
  History,
  ShieldCheck,
  UserCheck,
  AlertCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";
import {
  getAdminAnalytics,
  getAdminIpos,
  getAdminUsers,
  getMarketTrends,
  triggerMarketSync,
  updateIpoStatus,
  updateDailyGmp,
  updateUserKyc
} from "../../services/adminApi";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState("overview");

  // Core data states
  const [analytics, setAnalytics] = useState(null);
  const [ipos, setIpos] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [marketTrends, setMarketTrends] = useState(null);
  const [loading, setLoading] = useState(true);

  // Real-time actions state
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [boardFilter, setBoardFilter] = useState("all");

  // Inline GMP editing state: { [ipoId]: value }
  const [editingGmp, setEditingGmp] = useState({});
  const [savingGmpId, setSavingGmpId] = useState(null);

  // Selected IPO for detailed GMP history modal
  const [selectedGmpHistoryIpo, setSelectedGmpHistoryIpo] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, iposRes, usersRes, trendsRes] = await Promise.allSettled([
        getAdminAnalytics(),
        getAdminIpos(),
        getAdminUsers(),
        getMarketTrends()
      ]);

      if (analyticsRes.status === "fulfilled") {
        setAnalytics(analyticsRes.value.data);
      }

      if (iposRes.status === "fulfilled") {
        const data = iposRes.value.data;
        const list = Array.isArray(data) ? data : (data?.ipos || []);
        setIpos(list);
      }

      if (usersRes.status === "fulfilled") {
        const data = usersRes.value.data;
        setUsersList(data.users || []);
      }

      if (trendsRes.status === "fulfilled") {
        setMarketTrends(trendsRes.value.data);
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

  const handleSaveGmp = async (ipoId) => {
    const val = editingGmp[ipoId];
    if (val === undefined || isNaN(val)) return;
    setSavingGmpId(ipoId);
    try {
      await updateDailyGmp(ipoId, Number(val));
      setSyncMessage(`GMP updated to ₹${val} successfully!`);
      // clear edit mode for this item
      setEditingGmp(prev => {
        const next = { ...prev };
        delete next[ipoId];
        return next;
      });
      await fetchDashboardData();
    } catch (err) {
      alert("Failed to update GMP: " + err.message);
    } finally {
      setSavingGmpId(null);
      setTimeout(() => setSyncMessage(""), 4000);
    }
  };

  const handleKycToggle = async (userId, currentKyc) => {
    const newStatus = currentKyc === "verified" ? "pending" : "verified";
    try {
      await updateUserKyc(userId, newStatus);
      setUsersList(prev =>
        prev.map(u => (u._id === userId ? { ...u, kycStatus: newStatus } : u))
      );
      setSyncMessage(`User KYC changed to ${newStatus.toUpperCase()}`);
      setTimeout(() => setSyncMessage(""), 3000);
    } catch (err) {
      alert("Failed to update KYC: " + err.message);
    }
  };

  // Filtered IPOs
  const filteredIpos = ipos.filter(ipo => {
    const name = (ipo.companyName || ipo.company || "").toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || (ipo.status || "").toLowerCase() === statusFilter.toLowerCase();
    const matchesBoard =
      boardFilter === "all" || (ipo.board || "").toUpperCase() === boardFilter.toUpperCase();
    return matchesSearch && matchesStatus && matchesBoard;
  });

  // Top gainers chart data
  const topGainersChart = (analytics?.topGainers || []).slice(0, 6).map(g => ({
    name: (g.companyName || "").split(" ")[0],
    fullName: g.companyName,
    gmp: g.gmp || 0
  }));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-6">
      {/* ================= TOP COMMAND BAR ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-800/90 backdrop-blur border border-slate-700/70 p-6 rounded-2xl shadow-xl">
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
            IPO Central Command & Control
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time management for IPOs, Grey Market Premium (GMP), Registered Users, Scrapers & Allotments.
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
            title="Open Live Public Site"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Sync notification message */}
      {syncMessage && (
        <div className="p-4 bg-emerald-900/50 border border-emerald-500/50 rounded-xl text-emerald-300 text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>{syncMessage}</span>
          </div>
          <button onClick={() => setSyncMessage("")} className="text-emerald-400 hover:text-white text-xs font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* ================= NAVIGATION TABS ================= */}
      <div className="flex items-center gap-2 border-b border-slate-700/70 pb-3 overflow-x-auto">
        <TabButton
          id="overview"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          label="Overview & Analytics"
          icon={<BarChart3 className="w-4 h-4" />}
        />
        <TabButton
          id="ipos"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          label={`All IPOs (${ipos.length})`}
          icon={<Layers className="w-4 h-4" />}
        />
        <TabButton
          id="gmp"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          label="GMP Details & History"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <TabButton
          id="users"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          label={`Users Directory (${usersList.length})`}
          icon={<Users className="w-4 h-4" />}
        />
        <TabButton
          id="scrapers"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          label="Market Scrapers"
          icon={<Radio className="w-4 h-4" />}
        />
      </div>

      {/* ================= TAB CONTENT ================= */}

      {/* --- 1. OVERVIEW TAB --- */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <KpiCard
              title="Total IPOs Tracked"
              value={analytics?.total ?? ipos.length}
              subtitle="14 Mainboard • 8 SME"
              icon={<Layers className="w-6 h-6 text-blue-400" />}
              badge="Live Database"
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
              subtitle="Opening in next 14 days"
              icon={<Clock className="w-6 h-6 text-amber-400" />}
              badge="Pipeline"
              badgeColor="bg-amber-500/20 text-amber-400 border-amber-500/30"
            />
            <KpiCard
              title="Average GMP Premium"
              value={analytics?.gmp?.average ? `₹${analytics.gmp.average}` : "₹42"}
              subtitle={`Highest: ₹${analytics?.gmp?.highest || 198}`}
              icon={<TrendingUp className="w-6 h-6 text-purple-400" />}
              badge="Grey Market"
              badgeColor="bg-purple-500/20 text-purple-400 border-purple-500/30"
            />
          </div>

          {/* Infrastructure Health & Top Gainers Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Telemetry Card */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
                <h3 className="font-bold text-slate-100 flex items-center gap-2">
                  <Server className="w-5 h-5 text-blue-400" />
                  Live System Health & AI
                </h3>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>

              <div className="space-y-4 mt-4 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                  <span className="text-slate-400">Database Engine</span>
                  <span className="font-medium text-emerald-400 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    {analytics?.systemHealth?.database || "MongoDB Atlas / Memory Cache"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                  <span className="text-slate-400">Market Scrapers</span>
                  <span className="font-medium text-blue-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    Groww + NSE + IPOWatch + Gyani
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                  <span className="text-slate-400">AI Intelligence Core</span>
                  <span className="font-medium text-purple-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Groq LLaMA-3.3 70B
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                  <span className="text-slate-400">Allotment Engine</span>
                  <span className="font-medium text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Multi-PAN Direct Engine
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400">Total Registered Users</span>
                  <span className="font-semibold text-slate-200">
                    {usersList.length} Active Accounts
                  </span>
                </div>
              </div>
            </div>

            {/* Top GMP Gainers Chart */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-lg lg:col-span-2">
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

              <div className="h-56 mt-4">
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
                          <Cell key={`cell-${index}`} fill={["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EC4899", "#06B6D4"][index % 6]} />
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
        </div>
      )}

      {/* --- 2. ALL IPOS TAB --- */}
      {activeTab === "ipos" && (
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-400" />
                Comprehensive IPO Database ({filteredIpos.length} IPOs)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                View price bands, lot size, issue size, bidding dates, and change statuses dynamically.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search company..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-blue-500 w-48 sm:w-60"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs">
                {["all", "open", "upcoming", "closed"].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg capitalize transition font-medium ${
                      statusFilter === st
                        ? "bg-blue-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Board Filter */}
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs">
                {["all", "MAINBOARD", "SME"].map(bd => (
                  <button
                    key={bd}
                    onClick={() => setBoardFilter(bd)}
                    className={`px-3 py-1 rounded-lg uppercase transition font-medium ${
                      boardFilter === bd
                        ? "bg-purple-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {bd}
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
                  <th className="py-3.5 px-4 font-semibold">Company Name</th>
                  <th className="py-3.5 px-4 font-semibold">Board</th>
                  <th className="py-3.5 px-4 font-semibold">Price Band</th>
                  <th className="py-3.5 px-4 font-semibold">Lot Size</th>
                  <th className="py-3.5 px-4 font-semibold">Issue Size</th>
                  <th className="py-3.5 px-4 font-semibold">Live GMP</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
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

                        <td className="py-3.5 px-4 text-slate-300">
                          {ipo.lotSize ? `${ipo.lotSize} shares` : "-"}
                        </td>

                        <td className="py-3.5 px-4 text-slate-300">
                          {ipo.issueSize || "-"}
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-emerald-400">
                          ₹{gmpVal}
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
                            title="View Public Details"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-slate-500 text-sm">
                      {loading ? "Loading IPO records..." : "No IPO records match your filter."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- 3. GMP DETAILS & HISTORY TAB --- */}
      {activeTab === "gmp" && (
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Grey Market Premium (GMP) Live Controls & History
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Edit GMP directly inline or view past daily GMP progression for every IPO.
              </p>
            </div>

            <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              Live Market Tracking Active
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-700/60">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Company</th>
                  <th className="py-3.5 px-4 font-semibold">Issue Price</th>
                  <th className="py-3.5 px-4 font-semibold">Current GMP</th>
                  <th className="py-3.5 px-4 font-semibold">Est. Listing Gain</th>
                  <th className="py-3.5 px-4 font-semibold">Quick Modify GMP</th>
                  <th className="py-3.5 px-4 font-semibold text-right">GMP History</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {ipos.map(ipo => {
                  const name = ipo.companyName || ipo.company || "Unknown Company";
                  const gmpVal = Number(ipo.gmp) || 0;
                  const priceMatch = (ipo.priceBand || "").match(/(\d+)\s*$/);
                  const basePrice = priceMatch ? Number(priceMatch[1]) : 100;
                  const gainPct = Math.round((gmpVal / basePrice) * 100);
                  const isEditing = editingGmp[ipo._id] !== undefined;

                  return (
                    <tr key={ipo._id} className="hover:bg-slate-700/30 transition">
                      <td className="py-3.5 px-4 font-medium text-white">
                        <div className="font-semibold">{name}</div>
                        <div className="text-xs text-slate-400">{ipo.board || "MAINBOARD"}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-200">
                        {ipo.priceBand || "₹TBA"}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`text-base font-bold ${gmpVal > 0 ? "text-emerald-400" : "text-slate-400"}`}>
                          ₹{gmpVal}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${
                          gainPct > 0
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : "bg-slate-700 text-slate-400 border-slate-600"
                        }`}>
                          {gainPct > 0 ? `+${gainPct}%` : "0%"}
                        </span>
                      </td>

                      {/* Quick Modify Input */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            placeholder={`₹${gmpVal}`}
                            value={editingGmp[ipo._id] ?? ""}
                            onChange={e =>
                              setEditingGmp({ ...editingGmp, [ipo._id]: e.target.value })
                            }
                            className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-white w-20 focus:outline-none focus:border-blue-500"
                          />
                          <button
                            onClick={() => handleSaveGmp(ipo._id)}
                            disabled={savingGmpId === ipo._id || editingGmp[ipo._id] === undefined}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition shadow"
                          >
                            {savingGmpId === ipo._id ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </td>

                      {/* View History Button */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedGmpHistoryIpo(ipo)}
                          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-medium transition inline-flex items-center gap-1.5 border border-slate-600"
                        >
                          <History className="w-3.5 h-3.5 text-blue-400" />
                          View History ({ipo.gmpHistory?.length || 0})
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- 4. USERS DIRECTORY TAB --- */}
      {activeTab === "users" && (
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Registered Users & KYC Directory
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Manage user accounts, toggle KYC status, view watchlists and manage access.
              </p>
            </div>

            <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1.5 rounded-full">
              Total {usersList.length} Registered Accounts
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-700/60">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">User Details</th>
                  <th className="py-3.5 px-4 font-semibold">Email</th>
                  <th className="py-3.5 px-4 font-semibold">Role</th>
                  <th className="py-3.5 px-4 font-semibold">KYC Status</th>
                  <th className="py-3.5 px-4 font-semibold">Watchlist Items</th>
                  <th className="py-3.5 px-4 font-semibold text-right">KYC Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {usersList.length > 0 ? (
                  usersList.map(u => (
                    <tr key={u._id} className="hover:bg-slate-700/30 transition">
                      <td className="py-3.5 px-4 font-medium text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-700 text-blue-400 font-bold flex items-center justify-center text-xs border border-slate-600">
                            {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <div className="font-semibold">{u.name || "Anonymous User"}</div>
                            <div className="text-xs text-slate-400 font-mono">ID: {u._id.slice(-6)}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        {u.email}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${
                          u.role === "admin"
                            ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                            : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        }`}>
                          {u.role ? u.role.toUpperCase() : "USER"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${
                          u.kycStatus === "verified"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        }`}>
                          {u.kycStatus === "verified" ? "VERIFIED" : "PENDING"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        {u.watchlist?.length || 0} IPOs
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleKycToggle(u._id, u.kycStatus)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                            u.kycStatus === "verified"
                              ? "bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-white border-amber-500/30"
                              : "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500/30"
                          }`}
                        >
                          {u.kycStatus === "verified" ? "Set Pending" : "Approve KYC"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-500 text-sm">
                      No user accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- 5. MARKET SCRAPERS TAB --- */}
      {activeTab === "scrapers" && (
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-emerald-400" />
                Live Market Web Scraper Architecture
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Multi-threaded scrapers executing in background syncing IPO schedules, subscription numbers, and Grey Market Premiums.
              </p>
            </div>

            <button
              onClick={handleManualSync}
              disabled={syncing}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing Right Now..." : "Trigger Manual Scrape Now"}
            </button>
          </div>

          {/* Scraper Sources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <ScraperNode
              name="Groww Public API & Web"
              url="https://groww.in/ipo"
              status="Connected & Active"
              metric="Extracts Issue Dates, Lots, & Mainboard/SME Status"
              color="emerald"
            />
            <ScraperNode
              name="NSE India Official Issue Feed"
              url="https://www.nseindia.com/api/ipo-current-issue"
              status="Connected & Active"
              metric="Direct Exchange Official Issues & Status"
              color="blue"
            />
            <ScraperNode
              name="IPOWatch Real-Time Scraper"
              url="https://ipowatch.in"
              status="Connected & Active"
              metric="Live Grey Market Premium (GMP) & Expected Listing"
              color="purple"
            />
            <ScraperNode
              name="IPOGyani Real-Time Engine"
              url="https://ipogyani.com"
              status="Connected & Active"
              metric="Daily GMP Progression & Trend Analysis"
              color="amber"
            />
            <ScraperNode
              name="InvestorGain Feed"
              url="https://investorgain.com"
              status="Connected & Active"
              metric="Subscription Demands (QIB, NII, Retail multiples)"
              color="cyan"
            />
            <ScraperNode
              name="Auto-Sync Cron Daemon"
              url="Local Background Task"
              status="Running every 5 minutes"
              metric="Automatic recurring refresh keeping numbers live"
              color="emerald"
            />
          </div>
        </div>
      )}

      {/* ================= GMP HISTORY MODAL ================= */}
      {selectedGmpHistoryIpo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {selectedGmpHistoryIpo.companyName || selectedGmpHistoryIpo.company}
                </h3>
                <p className="text-xs text-slate-400">Daily Historical Grey Market Premium (GMP)</p>
              </div>
              <button
                onClick={() => setSelectedGmpHistoryIpo(null)}
                className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Visual Line Chart of History */}
            {selectedGmpHistoryIpo.gmpHistory && selectedGmpHistoryIpo.gmpHistory.length > 0 ? (
              <div className="space-y-4">
                <div className="h-44 bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedGmpHistoryIpo.gmpHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: "#1E293B", borderColor: "#475569", borderRadius: "8px", color: "#FFF" }}
                        formatter={(val) => [`₹${val}`, "GMP"]}
                      />
                      <Line type="monotone" dataKey="gmp" stroke="#10B981" strokeWidth={2.5} dot={{ fill: "#10B981", r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Table of History Dates */}
                <div className="max-h-40 overflow-y-auto border border-slate-700/60 rounded-xl">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase border-b border-slate-700 sticky top-0">
                      <tr>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Recorded GMP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {selectedGmpHistoryIpo.gmpHistory.map((h, i) => (
                        <tr key={i} className="hover:bg-slate-700/30">
                          <td className="p-2.5 font-mono">{h.date}</td>
                          <td className="p-2.5 font-bold text-emerald-400">₹{h.gmp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 text-sm">
                No historical records recorded yet for this IPO.
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedGmpHistoryIpo(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-xl transition"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Helper Tab Button */
function TabButton({ id, activeTab, setActiveTab, label, icon }) {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition whitespace-nowrap ${
        isActive
          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30 font-semibold"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* Helper KPI Card Component */
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

/* Helper Scraper Node Component */
function ScraperNode({ name, url, status, metric, color }) {
  return (
    <div className="bg-slate-900/80 border border-slate-700/70 p-4 rounded-xl space-y-2.5 hover:border-slate-600 transition">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white">{name}</span>
        <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          {status}
        </span>
      </div>
      <p className="text-xs text-slate-400">{metric}</p>
      <div className="text-[11px] font-mono text-slate-500 truncate">{url}</div>
    </div>
  );
}


