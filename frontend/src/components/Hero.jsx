import React from "react";

export default function Hero() {
  return (
    <section className="py-16">
      <h1 className="text-4xl md:text-5xl font-bold">
        Track Every IPO in{" "}
        <span className="text-brand">One Place</span>
      </h1>

      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
        Live IPO GMP, subscription status, allotment tracking and
        company analysis — built for serious investors.
      </p>

      <div className="mt-8 flex gap-3">
        <input
          placeholder="Search IPO by company name…"
          className="w-full md:w-96 px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
        />
        <button className="px-6 py-3 bg-brand text-white rounded-md">
          Search
        </button>
      </div>
    </section>
  );
}
