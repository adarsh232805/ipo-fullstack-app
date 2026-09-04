import { useEffect, useState } from "react";
import api from "../services/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===== NEW STATES (ENHANCEMENT) ===== */
  const [selectedUser, setSelectedUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  /* ================= KYC UPDATE ================= */
  const updateKyc = async (userId, status) => {
    try {
      await api.patch(`/admin/users/${userId}/kyc`, { status });

      setUsers(prev =>
        prev.map(u =>
          u._id === userId ? { ...u, kycStatus: status } : u
        )
      );
    } catch {
      alert("Failed to update KYC");
    }
  };

  /* ================= VIEW USER (MODAL) ================= */
  const openUserModal = async (userId) => {
    try {
      setModalLoading(true);
      const res = await api.get(`/admin/users/${userId}`);
      setSelectedUser(res.data.user);
      setActivities(res.data.activities || []);
    } catch (err) {
      alert("Failed to load user details");
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setActivities([]);
  };

  /* ================= BLOCK / UNBLOCK ================= */
  const toggleBlock = async (userId) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/block`);

      setUsers(prev =>
        prev.map(u =>
          u._id === userId
            ? { ...u, isBlocked: res.data.isBlocked }
            : u
        )
      );
    } catch {
      alert("Failed to update block status");
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading users...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

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
              <tr
                key={user._id}
                className="border-t hover:bg-gray-50 transition"
              >
                {/* USER */}
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={
                      user.profilePhoto ||
                      "https://ui-avatars.com/api/?name=" +
                        user.name
                    }
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">
                      {user.email}
                    </div>
                  </div>
                </td>

                {/* ROLE */}
                <td className="p-4 capitalize">
                  {user.role}
                </td>

                {/* KYC */}
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.kycStatus === "verified"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {user.kycStatus}
                  </span>
                </td>

                {/* JOINED */}
                <td className="p-4 text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                {/* ACTIONS */}
                <td className="p-4 text-right space-x-2">
                  {/* VIEW */}
                  <button
                    onClick={() => openUserModal(user._id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                  >
                    View
                  </button>

                  {/* KYC */}
                  {user.kycStatus !== "verified" && (
                    <button
                      onClick={() =>
                        updateKyc(user._id, "verified")
                      }
                      className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                    >
                      Approve
                    </button>
                  )}

                  {user.kycStatus === "verified" && (
                    <button
                      onClick={() =>
                        updateKyc(user._id, "pending")
                      }
                      className="px-3 py-1 bg-red-500 text-white rounded text-xs"
                    >
                      Reject
                    </button>
                  )}

                  {/* BLOCK */}
                  <button
                    onClick={() => toggleBlock(user._id)}
                    className="px-3 py-1 bg-gray-800 text-white rounded text-xs"
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= USER DETAILS MODAL ================= */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">User Details</h2>
              <button onClick={closeModal}>✖</button>
            </div>

            {modalLoading ? (
              <p className="text-gray-500">Loading details...</p>
            ) : (
              <>
                <p><b>Name:</b> {selectedUser.name}</p>
                <p><b>Email:</b> {selectedUser.email}</p>
                <p><b>Role:</b> {selectedUser.role}</p>
                <p><b>KYC:</b> {selectedUser.kycStatus}</p>

                <h3 className="mt-6 font-semibold">
                  User Activity
                </h3>

                {activities.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    No activity recorded.
                  </p>
                )}

                {activities.length > 0 && (
                  <ul className="mt-3 space-y-2 text-sm">
                    {activities.map(act => (
                      <li
                        key={act._id}
                        className="border p-3 rounded"
                      >
                        <div className="font-medium">
                          {act.action}
                        </div>
                        <div className="text-gray-600">
                          {act.description}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(
                            act.createdAt
                          ).toLocaleString()}
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
