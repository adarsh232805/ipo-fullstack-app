import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await api.get("/admin/users");
    setUsers(data);
  };

  const updateKyc = async (id, status) => {
    await api.put(`/admin/users/${id}/kyc`, { kycStatus: status });
    load();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>KYC</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td>{u.email}</td>
                <td className="capitalize">{u.kycStatus}</td>
                <td className="space-x-2">
                  <button onClick={() => updateKyc(u._id, "verified")} className="btn">Approve</button>
                  <button onClick={() => updateKyc(u._id, "rejected")} className="btn bg-red-600">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
