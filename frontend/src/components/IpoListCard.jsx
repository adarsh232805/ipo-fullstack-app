import React from "react";
import { useNavigate } from "react-router-dom";

export default function IpoListCard({ ipo }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/ipos/${ipo._id}`)}
      className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-sm font-bold">
          {ipo.companyName?.charAt(0) || ipo.company?.charAt(0)}
        </div>

        <div>
          <h4 className="font-semibold">
            {ipo.companyName || ipo.company}
          </h4>
          <p className="text-xs text-gray-500">
            Closes {ipo.biddingEnd || "—"}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm font-medium">
          {ipo.subscription?.total || 0}x
        </p>
        <button className="mt-1 px-3 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
          Apply
        </button>
      </div>
    </div>
  );
}
