import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchIpos } from "../services/api";

export default function Ipos() {
  const [ipos, setIpos] = useState([]);
  const [status, setStatus] = useState("open");
  const navigate = useNavigate();

  useEffect(() => {
    fetchIpos().then(setIpos);
  }, []);

  const filtered = ipos.filter(
    (ipo) => status === "all" || ipo.status === status
  );

  const tab = (value) =>
    `px-4 py-2 rounded-full text-sm border transition
     ${
       status === value
         ? "bg-blue-600 text-white border-blue-600"
         : "bg-white text-gray-700 hover:bg-gray-100"
     }`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* PAGE TITLE */}
      <h1 className="text-2xl font-semibold mb-4">IPO Dashboard</h1>

      {/* STATUS TABS */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => setStatus("open")} className={tab("open")}>Open</button>
        <button onClick={() => setStatus("closed")} className={tab("closed")}>Closed</button>
        <button onClick={() => setStatus("upcoming")} className={tab("upcoming")}>Upcoming</button>
        <button onClick={() => setStatus("all")} className={tab("all")}>All</button>
      </div>

      {/* INFO BANNER */}
      <div className="bg-gray-100 rounded-lg px-4 py-3 mb-6 text-sm flex justify-between">
        <span>ℹ️ Regulatory changes to SME IPOs</span>
        <span className="text-lg">›</span>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-lg overflow-hidden">

        {/* HEADER */}
        <div className="grid grid-cols-4 px-4 py-3 text-sm font-medium text-gray-500 border-b">
          <div>Company</div>
          <div>Closing date</div>
          <div>Overall subscription</div>
          <div></div>
        </div>

        {/* ROWS */}
        {filtered.map((ipo) => (
          <div
            key={ipo._id}
            className="grid grid-cols-4 px-4 py-4 items-center border-b hover:bg-gray-50"
          >
            {/* COMPANY */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(`/ipos/${ipo._id}`)}
            >
              <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center font-semibold">
                {ipo.company?.[0] || "I"}
              </div>
              <div>
                <p className="font-medium">{ipo.company}</p>
                <p className="text-xs text-gray-500">
                  Closes {ipo.closingDate || "--"}
                </p>
              </div>
            </div>

            {/* DATE */}
            <div className="text-sm">
              {ipo.closingDate || "--"}
            </div>

            {/* SUBSCRIPTION */}
            <div className="font-medium">
              {ipo.subscription?.total
                ? `${ipo.subscription.total}x`
                : "--"}
            </div>

            {/* ACTION */}
            <div className="text-right">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium
                ${
                  ipo.status === "open"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {ipo.status === "open" ? "Apply" : "Pre-apply"}
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No IPOs found
          </div>
        )}
      </div>
    </div>
  );
}
