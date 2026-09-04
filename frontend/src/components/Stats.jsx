import React from "react";

const stats = [
  { label: "Ongoing IPOs", value: "5" },
  { label: "Upcoming IPOs", value: "12" },
  { label: "Avg GMP", value: "38%" },
  { label: "Listed Gain", value: "21%" }
];

export default function Stats() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 my-10">
      {stats.map((item, i) => (
        <div
          key={i}
          className="rounded-xl p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {item.label}
          </p>
          <h3 className="mt-2 text-2xl font-semibold">
            {item.value}
          </h3>
        </div>
      ))}
    </section>
  );
}
