import React, { useState } from "react";

export default function StrengthRisk() {
  const [tab, setTab] = useState("strength");

  const strengths = [
    "Largest coking coal producer in India",
    "Strategically located coal mines",
    "Strong production growth since FY21",
    "Market leader in coking coal washeries"
  ];

  const risks = [
    "Dependence on steel industry demand",
    "Government policy impact",
    "Commodity price volatility"
  ];

  const list = tab === "strength" ? strengths : risks;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Strengths & Risks
      </h2>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("strength")}
          className={`px-4 py-2 rounded-full text-sm
            ${tab === "strength" ? "bg-brand text-white" : "border"}
          `}
        >
          Strengths
        </button>

        <button
          onClick={() => setTab("risk")}
          className={`px-4 py-2 rounded-full text-sm
            ${tab === "risk" ? "bg-brand text-white" : "border"}
          `}
        >
          Risks
        </button>
      </div>

      <ul className="space-y-2 text-sm">
        {list.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span>✔</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
