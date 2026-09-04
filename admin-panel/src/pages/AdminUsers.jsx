import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔍 SEARCH (DEBOUNCED) */
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  /* 🎯 FILTERS */
  const [kyc, setKyc] = useState("");
  const [blocked, setBlocked] = useState("");

  /* 📄 PAGINATION */
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* 👤 MODAL */
  const [selectedUser, setSelectedUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  /* ================= DEBOUNCE SEARCH ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400); // ⏱ debounce delay

    return () => clearTimeout(timer);
  }, [searchInput]);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/users", {
        params: {
          search,
          kyc,
          blocked,
          page,
          limit: 8
        }
      });

      /* ✅ NORMALIZE RESPONSE */
      if (Array.isArray(res.data)) {
        setUsers(res.data);
        setTotalPages(1);
      } else {
        setUsers(res.data.users || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, kyc, blocked, page]);

  /* ================= VIEW USER ================= */
  const openUserModal = async (userId) => {
    try {
      setModalLoading(true);
      const res = await api.get(`/admin/users/${userId}`);
      setSelectedUser(res.data.user);
      setActivities(res.data.activities || []);
    } catch {
      alert("Failed to load user details");
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setActivities([]);
  };

  /* ================= KYC UPDATE ================= */
  const updateKyc = async (userId, status) => {
    await api.patch(`/admin/users/${userId}/kyc`, { status });

    setUsers(prev =>
      prev.map(u =>
        u._id === userId ? { ...u, kycStatus: status } : u
      )
    );
  };

  /* ================= BLOCK / UNBLOCK ================= */
  const toggleBlock = async (userId) => {
    const res = await api.patch(`/admin/users/${userId}/block`);

    setUsers(prev =>
      prev.map(u =>
        u._id === userId
          ? { ...u, isBlocked: res.data.isBlocked }
          : u
      )
    );
  };

  if (loading) {
    return <div className="text-gray-500">Loading users...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      {/* 🔍 SEARCH & FILTER BAR */}
      <div className="bg-white rounded-xl shadow p-4 mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search name or email..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-64"
        />

        <select
          value={kyc}
          onChange={e => {
            setKyc(e.target.value);
            setPage(1);
          }}
          className="border rounded px-3 py-2"
        >
          <option value="">All KYC</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
        </select>

        <select
          value={blocked}
          onChange={e => {
            setBlocked(e.target.value);
            setPage(1);
          }}
          className="border rounded px-3 py-2"
        >
          <option value="">All Users</option>
          <option value="false">Active</option>
          <option value="true">Blocked</option>
        </select>
      </div>

      {/* 👥 USERS TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">KYC</th>
              <th className="p-4 text-left">Joined</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}

            {users.map(user => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="p-4 flex gap-3 items-center">
                  <img
                    src={
                      user.profilePhoto ||
                      "https://ui-avatars.com/api/?name=" +
                        user.name
                    }
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">
                      {user.email}
                    </div>
                  </div>
                </td>

                <td className="p-4 capitalize">{user.role}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      user.kycStatus === "verified"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {user.kycStatus}
                  </span>
                </td>

                <td className="p-4">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => openUserModal(user._id)}
                    className="text-blue-600 text-xs"
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      updateKyc(
                        user._id,
                        user.kycStatus === "verified"
                          ? "pending"
                          : "verified"
                      )
                    }
                    className="text-green-600 text-xs"
                  >
                    {user.kycStatus === "verified"
                      ? "Reject"
                      : "Approve"}
                  </button>

                  <button
                    onClick={() => toggleBlock(user._id)}
                    className="text-red-600 text-xs"
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 📄 PAGINATION */}
        <div className="flex justify-between items-center p-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* 🔳 MODAL (UNCHANGED) */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-xl p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">User Details</h2>
              <button onClick={closeModal}>✖</button>
            </div>

            {modalLoading ? (
              <p>Loading...</p>
            ) : (
              <>
                <p><b>Name:</b> {selectedUser.name}</p>
                <p><b>Email:</b> {selectedUser.email}</p>
                <p><b>KYC:</b> {selectedUser.kycStatus}</p>

                <h3 className="mt-6 font-semibold">
                  User Activity
                </h3>

                {activities.length === 0 ? (
                  <p className="text-sm text-gray-500 mt-2">
                    No activity recorded.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2 text-sm">
                    {activities.map(act => (
                      <li key={act._id} className="border p-3 rounded">
                        <div className="font-medium">{act.action}</div>
                        <div className="text-gray-600">
                          {act.description}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(act.createdAt).toLocaleString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
