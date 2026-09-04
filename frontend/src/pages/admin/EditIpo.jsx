import React, { useEffect, useState } from "react";
import { getIpo, updateIpo } from "../../services/adminApi";
import { useNavigate, useParams } from "react-router-dom";

export default function EditIpo() {
  const { id } = useParams();
  const [ipo, setIpo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getIpo(id).then(setIpo);
  }, [id]);

  if (!ipo) return null;

  const save = async e => {
    e.preventDefault();
    await updateIpo(id, ipo);
    navigate("/admin/ipos");
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-bold mb-4">Edit IPO</h1>

      <form onSubmit={save} className="space-y-4">
        <input
          value={ipo.company}
          onChange={e => setIpo({ ...ipo, company: e.target.value })}
          className="w-full border p-3 rounded"
        />

        <input
          value={ipo.gmp}
          onChange={e => setIpo({ ...ipo, gmp: e.target.value })}
          className="w-full border p-3 rounded"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}
