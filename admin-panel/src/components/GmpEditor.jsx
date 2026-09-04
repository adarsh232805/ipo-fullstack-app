import { useState } from "react";
import api from "../api/axios";

export default function GmpEditor({ ipo, onUpdated }) {
  const [value, setValue] = useState(ipo.gmp ?? 0);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    try {
      const res = await api.put(`/ipos/${ipo._id}/gmp`, {
        gmp: Number(value)
      });
      onUpdated(res.data);
    } catch (err) {
      alert("Failed to update GMP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-20 border rounded px-2 py-1 text-sm"
      />

      <button
        onClick={save}
        disabled={loading}
        className="text-xs px-3 py-1 rounded bg-slate-900 text-white hover:bg-slate-800"
      >
        {loading ? "..." : "Save"}
      </button>
    </div>
  );
}
