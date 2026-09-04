export default function FinancialEditor({ title, data = [], onChange }) {
  const addRow = () =>
    onChange([...data, { year: "", value: "" }]);

  const update = (i, key, val) => {
    const updated = [...data];
    updated[i][key] = val;
    onChange(updated);
  };

  const remove = (i) => {
    const updated = [...data];
    updated.splice(i, 1);
    onChange(updated);
  };

  return (
    <div className="bg-white/80 backdrop-blur border rounded-2xl p-6 space-y-3">
      <h3 className="font-semibold">{title}</h3>

      {data.map((r, i) => (
        <div key={i} className="flex gap-2">
          <input
            placeholder="Year"
            className="border p-2 rounded w-24"
            value={r.year}
            onChange={(e) =>
              update(i, "year", e.target.value)
            }
          />
          <input
            placeholder="Value"
            className="border p-2 rounded flex-1"
            value={r.value}
            onChange={(e) =>
              update(i, "value", e.target.value)
            }
          />
          <button
            onClick={() => remove(i)}
            className="text-red-600"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        onClick={addRow}
        className="text-sm text-blue-600"
      >
        + Add Row
      </button>
    </div>
  );
}
