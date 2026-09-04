import React, { useState } from "react";
import {
  updateGmpEntry,
  deleteGmpEntry
} from "../services/adminApi";

export default function AdminGmpEditor({ ipo }) {
  const [history, setHistory] = useState(
    ipo.gmpHistory || []
  );

  const handleEdit = async (date, oldGmp) => {
    const value = prompt("Enter new GMP", oldGmp);
    if (!value) return;

    await updateGmpEntry(ipo._id, date, Number(value));

    setHistory(prev =>
      prev.map(h =>
        h.date === date ? { ...h, gmp: Number(value) } : h
      )
    );
  };

  const handleDelete = async date => {
    if (!window.confirm("Delete this GMP entry?")) return;

    await deleteGmpEntry(ipo._id, date);

    setHistory(prev =>
      prev.filter(h => h.date !== date)
    );
  };

  return (
    <div className="border rounded-xl p-5 bg-white">
      <h3 className="font-semibold mb-4">
        GMP History (Admin)
      </h3>

      {history.length === 0 && (
        <p className="text-sm text-gray-500">
          No GMP history available
        </p>
      )}

      <div className="space-y-2">
        {history.map((h, index) => (
  <div key={`${h.date}-${index}`}>

            <span>{h.date}</span>
            <span className="font-medium">₹{h.gmp}</span>

            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(h.date, h.gmp)}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(h.date)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
