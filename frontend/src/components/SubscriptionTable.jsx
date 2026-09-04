import React from "react";

export default function SubscriptionTable({ subscription }) {
  if (!subscription) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Subscription rate
        </h2>
        <p className="text-gray-500">Subscription data not available</p>
      </div>
    );
  }

  const rows = [
    { label: "Qualified Institutional Buyers (QIB)", value: subscription.qib },
    { label: "Non-Institutional Investors (NII)", value: subscription.nii },
    { label: "Retail Individual Investors", value: subscription.retail },
    { label: "Employees", value: subscription.employee },
    { label: "Shareholders", value: subscription.shareholder },
    { label: "Total", value: subscription.total }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Subscription rate
      </h2>

      <div className="border rounded-lg overflow-hidden">
        {rows.map((row, index) => (
          <div
            key={index}
            className="flex justify-between items-center px-4 py-3 text-sm border-b last:border-b-0 bg-white dark:bg-gray-800"
          >
            <span className="text-gray-700 dark:text-gray-300">
              {row.label}
            </span>

            <span
              className={`font-medium ${
                row.value >= 1
                  ? "text-green-600"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {row.value !== undefined ? `${row.value}x` : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
