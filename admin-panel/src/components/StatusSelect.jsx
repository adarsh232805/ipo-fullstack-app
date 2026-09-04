import api from "../api/axios";

const STATUSES = ["upcoming", "open", "closed", "listed"];

export default function StatusSelect({ ipo, onUpdated }) {
  const updateStatus = async (status) => {
    if (status === ipo.status) return;

    // 🔒 HARD GUARD: prevent breaking allotment
    if (status === "listed" && ipo.allotmentAvailable) {
      alert(
        "❌ Do NOT mark IPO as LISTED while allotment is active.\n\n" +
        "Correct flow:\nClosed → Allotment Available → Listed (after listing date)"
      );
      return;
    }

    const res = await api.put(`/ipos/${ipo._id}`, { status });
    onUpdated(res.data);
  };

  return (
    <select
      value={ipo.status}
      onChange={(e) => updateStatus(e.target.value)}
      className="border rounded px-2 py-1 text-sm bg-white"
    >
      {STATUSES.map(s => (
        <option
          key={s}
          value={s}
          disabled={s === "listed" && ipo.allotmentAvailable}
        >
          {s.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
