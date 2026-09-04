import React from "react";

export default function IpoDetailPanel({ ipo }) {
  if (!ipo) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select an IPO to view details
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg h-full">
      <h2 className="text-xl font-semibold mb-2">
        {ipo.company} IPO
      </h2>

      <div className="grid grid-cols-2 gap-4 text-sm mt-4">
        <div>
          <p className="text-gray-500">Price range</p>
          <p className="font-medium">{ipo.priceBand}</p>
        </div>

        <div>
          <p className="text-gray-500">Lot size</p>
          <p className="font-medium">{ipo.lotSize}</p>
        </div>

        <div>
          <p className="text-gray-500">Issue size</p>
          <p className="font-medium">{ipo.issueSize}</p>
        </div>

        <div>
          <p className="text-gray-500">GMP</p>
          <p className="font-medium text-green-600">
            ₹{ipo.gmp}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">
          Subscription
        </h3>

        {ipo.subscriptionBreakup.map((item, i) => (
          <div
            key={i}
            className="flex justify-between py-1 text-sm"
          >
            <span>{item.label}</span>
            <span>{item.value}x</span>
          </div>
        ))}
      </div>

      <button className="mt-6 w-full py-2 bg-brand text-white rounded-md font-medium">
        {ipo.applyType}
      </button>
    </div>
  );
}
