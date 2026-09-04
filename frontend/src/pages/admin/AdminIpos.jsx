import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAdminIpos, deleteIpo, updateIpoStatus } from "../../services/adminApi";
import { ArrowLeft, Plus, Search, Trash2, Edit3, ExternalLink } from "lucide-react";

export default function AdminIpos() {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAdminIpos();
      const list = Array.isArray(res.data) ? res.data : (res.data?.ipos || []);
      setIpos(list);
    } catch (err) {
      console.error("Failed to load IPOs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteIpo(id);
        await load();
      } catch (err) {
        alert("Failed to delete IPO: " + err.message);
      }
    }
  };

  const filtered = ipos.filter(ipo => {
    const name = (ipo.companyName || ipo.company || "").toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || (ipo.status || "").toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin")}
            className="p-2.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-600"
            title="Back to Admin Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Manage All IPOs</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Total {ipos.length} IPO records tracked in system
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/admin/ipos/add")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-lg shadow-blue-900/30"
        >
          <Plus className="w-4 h-4" />
          Add New IPO
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs">
          {["all", "open", "upcoming", "closed", "listed"].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg capitalize transition font-medium ${
                statusFilter === st
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Company Name</th>
                <th className="py-3.5 px-4 font-semibold">Board</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">GMP</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filtered.length > 0 ? (
                filtered.map(ipo => {
                  const name = ipo.companyName || ipo.company || "Unnamed IPO";
                  return (
                    <tr key={ipo._id} className="hover:bg-slate-700/30 transition">
                      <td className="py-3.5 px-4 font-medium text-white">
                        <div className="font-semibold">{name}</div>
                        <div className="text-xs text-slate-400 font-mono">{ipo.priceBand || "Price Band TBA"}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${
                          (ipo.board || "").toUpperCase() === "SME"
                            ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                            : "bg-blue-500/15 text-blue-400 border-blue-500/30"
                        }`}>
                          {ipo.board || "MAINBOARD"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={ipo.status || "upcoming"}
                          onChange={e =>
                            updateIpoStatus(ipo._id, e.target.value).then(load)
                          }
                          className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500 font-medium"
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="open">Open</option>
                          <option value="closed">Closed</option>
                          <option value="listed">Listed</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-emerald-400">
                        ₹{ipo.gmp || 0}
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => navigate(`/admin/ipos/${ipo._id}/edit`)}
                          className="p-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition border border-blue-500/30 inline-flex items-center"
                          title="Edit CMS"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <Link
                          to={`/ipos/${ipo._id}`}
                          target="_blank"
                          className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition inline-flex items-center border border-slate-600"
                          title="View Live Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleDelete(ipo._id, name)}
                          className="p-2 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg transition border border-rose-500/30 inline-flex items-center"
                          title="Delete IPO"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500 text-sm">
                    {loading ? "Loading..." : "No IPO records found."}
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

