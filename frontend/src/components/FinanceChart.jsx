import React, { useState } from "react";

export default function FinanceChart() {
  const [tab, setTab] = useState("Revenue");

  const data = {
    Revenue: [12349, 13161, 13083],
    Assets: [9821, 10430, 11210],
    Profit: [2100, 2380, 2510]
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Financials
      </h2>

      <div className="flex gap-4 mb-4 text-sm">
        {Object.keys(data).map(k => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`pb-1 border-b-2
              ${tab === k ? "border-brand" : "border-transparent"}
            `}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="flex items-end gap-8 h-40">
        {data[tab].map((v, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className="w-10 bg-green-500 rounded"
              style={{ height: v / 100 }}
            />
            <span className="text-xs mt-2">{v}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        *All values are in Rs. Cr
      </p>
    </div>
  );
}
