export default function ApplicationCategoriesEditor({ value = [], onChange }) {
  const addCategory = () => {
    onChange([
      ...value,
      {
        category: "",
        minLot: "",
        maxLot: "",
        applyLimit: "",
        cutoff: ""
      }
    ]);
  };

  const update = (index, key, val) => {
    const updated = [...value];
    updated[index][key] = val;
    onChange(updated);
  };

  const remove = (index) => {
    const updated = [...value];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="bg-white/80 backdrop-blur border rounded-2xl p-6 space-y-4">
      <h2 className="text-lg font-semibold">
        Application Categories
      </h2>

      {value.map((c, i) => (
        <div
          key={i}
          className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end"
        >
          <input
            placeholder="Category"
            className="border p-2 rounded"
            value={c.category}
            onChange={(e) =>
              update(i, "category", e.target.value)
            }
          />
          <input
            placeholder="Min Lot"
            className="border p-2 rounded"
            value={c.minLot}
            onChange={(e) =>
              update(i, "minLot", e.target.value)
            }
          />
          <input
            placeholder="Max Lot"
            className="border p-2 rounded"
            value={c.maxLot}
            onChange={(e) =>
              update(i, "maxLot", e.target.value)
            }
          />
          <input
            placeholder="Apply Limit"
            className="border p-2 rounded"
            value={c.applyLimit}
            onChange={(e) =>
              update(i, "applyLimit", e.target.value)
            }
          />
          <div className="flex gap-2">
            <input
              placeholder="Cutoff %"
              className="border p-2 rounded flex-1"
              value={c.cutoff}
              onChange={(e) =>
                update(i, "cutoff", e.target.value)
              }
            />
            <button
              onClick={() => remove(i)}
              className="text-red-600"
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addCategory}
        className="text-sm text-blue-600"
      >
        + Add Category
      </button>
    </div>
  );
}
