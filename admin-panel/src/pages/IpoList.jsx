import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminAxios from "../api/adminAxios";
import StatusBadge from "../components/StatusBadge";
import StatusSelect from "../components/StatusSelect";
import GmpEditor from "../components/GmpEditor";

export default function IpoList() {
  const navigate = useNavigate();

  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* 🔍 DEBOUNCE SEARCH */
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  /* ================= FETCH IPOs ================= */
  const fetchIpos = async () => {
    try {
      setLoading(true);

      const res = await adminAxios.get("/ipos", {
        params: { search, status, page, limit: 8 }
      });

      if (Array.isArray(res.data)) {
        setIpos(res.data);
        setTotalPages(1);
      } else {
        setIpos(res.data.ipos || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load IPOs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIpos();
  }, [search, status, page]);

  /* ================= DELETE ================= */
  const deleteIpo = async (id) => {
    if (!window.confirm("Delete this IPO?")) return;
    await adminAxios.delete(`/ipos/${id}`);
    fetchIpos();
  };

  /* ================= TOGGLE ALLOTMENT ================= */
  const toggleAllotment = async (ipo) => {
    await adminAxios.put(`/ipos/${ipo._id}/allotment`, {
      allotmentAvailable: !ipo.allotmentAvailable
    });
    fetchIpos();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">IPO Management</h1>
        <button
          onClick={() => navigate("/ipos/create")}
          className="bg-slate-900 text-white px-4 py-2 rounded"
        >
          + Add IPO
        </button>
      </div>

      {/* SEARCH & FILTER */}
      <div className="bg-white p-4 rounded-xl shadow mb-4 flex gap-3 flex-wrap">
        <input
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Search company..."
          className="border px-3 py-2 rounded w-64"
        />

        <select
          value={status}
          onChange={e => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="listed">Listed</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Company</th>
              <th className="p-3">Status</th>
              <th className="p-3">GMP</th>
              <th className="p-3">Allotment</th>
              <th className="p-3">Open</th>
              <th className="p-3">Close</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  Loading IPOs...
                </td>
              </tr>
            )}

            {!loading && ipos.length === 0 && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No IPOs found
                </td>
              </tr>
            )}

            {ipos.map(ipo => (
              <tr key={ipo._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{ipo.companyName}</td>

                <td className="p-3">
                  <div className="flex gap-2 items-center">
                    <StatusBadge status={ipo.status} />
                    <StatusSelect ipo={ipo} onUpdated={fetchIpos} />
                  </div>
                </td>

                <td className="p-3">
                  <GmpEditor ipo={ipo} onUpdated={fetchIpos} />
                </td>

                <td className="p-3">
                  {ipo.allotmentAvailable && (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                      Available
                    </span>
                  )}
                  <button
                    onClick={() => toggleAllotment(ipo)}
                    className="ml-2 text-xs underline"
                  >
                    {ipo.allotmentAvailable ? "Disable" : "Enable"}
                  </button>
                </td>

                <td className="p-3">
                  {ipo.openDate
                    ? new Date(ipo.openDate).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-3">
                  {ipo.closeDate
                    ? new Date(ipo.closeDate).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-3 text-right space-x-3">
                  <button
                    onClick={() => navigate(`/ipos/edit/${ipo._id}`)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteIpo(ipo._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-between p-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="border px-3 py-1 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="border px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
