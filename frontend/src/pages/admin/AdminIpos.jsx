import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminIpos, deleteIpo, updateIpoStatus } from "../../services/adminApi";

export default function AdminIpos() {
  const [ipos, setIpos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setIpos(await getAdminIpos());
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage IPOs</h1>
        <button
          onClick={() => navigate("/admin/ipos/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add IPO
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Company</th>
              <th>Status</th>
              <th>GMP</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ipos.map(ipo => (
              <tr key={ipo._id} className="border-t">
                <td className="p-3">{ipo.company}</td>

                <td>
                  <select
                    value={ipo.status}
                    onChange={e =>
                      updateIpoStatus(ipo._id, e.target.value).then(load)
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="listed">Listed</option>
                  </select>
                </td>

                <td>₹{ipo.gmp}</td>

                <td className="space-x-2">
                  <button
                    onClick={() => navigate(`/admin/ipos/${ipo._id}/edit`)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteIpo(ipo._id).then(load)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
