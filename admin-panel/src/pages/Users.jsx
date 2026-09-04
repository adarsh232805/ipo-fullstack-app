import { useEffect, useState } from "react";
import axios from "@/lib/axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get("/api/admin/users").then(res => setUsers(res.data));
  }, []);

  const updateKyc = async (id, status) => {
    await axios.patch(`/api/admin/users/${id}/kyc`, { status });
    setUsers(users.map(u => u._id === id ? { ...u, kycStatus: status } : u));
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="grid grid-cols-3 gap-6">
        {users.map(u => (
          <div
            key={u._id}
            className="bg-white rounded-xl shadow p-5"
          >
            <div className="flex items-center gap-3">
              <img
                src={u.profilePhoto || "/avatar.png"}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{u.name}</h3>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
            </div>

            <div className="mt-4 text-sm">
              <p>KYC: <b>{u.kycStatus}</b></p>
              <p>Role: {u.role}</p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => updateKyc(u._id, "verified")}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Approve
              </button>
              <button
                onClick={() => updateKyc(u._id, "rejected")}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
