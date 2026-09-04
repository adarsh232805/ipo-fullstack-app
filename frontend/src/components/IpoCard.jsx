import React from "react";

export default function IpoCard({ ipo }) {
  return (
    <div className="rounded-xl p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold">{ipo.company}</h3>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Price Band: {ipo.price}
      </p>

      <div className="mt-4 flex justify-between text-sm">
        <span>GMP</span>
        <span className="font-medium text-green-600">
          ₹{ipo.gmp}
        </span>
      </div>

      <div className="mt-2 flex justify-between text-sm">
        <span>Retail</span>
        <span>{ipo.retail}x</span>
      </div>

      <button className="mt-5 w-full py-2 bg-brand text-white rounded-md text-sm">
        View Details
      </button>
    </div>
  );
}
