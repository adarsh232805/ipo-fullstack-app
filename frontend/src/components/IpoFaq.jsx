import React, { useState } from "react";

const faqs = [
  "What is the issue size of Bharat Coking Coal IPO?",
  "What is pre-apply for this IPO?",
  "When will allotment be finalized?",
  "What is the lot size?",
  "Where will the IPO be listed?"
];

export default function IpoFaq() {
  const [open, setOpen] = useState(null);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        IPO FAQs
      </h2>

      <div className="border rounded-lg divide-y">
        {faqs.map((q, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex justify-between p-4 text-sm"
            >
              {q}
              <span>{open === i ? "−" : "+"}</span>
            </button>

            {open === i && (
              <div className="p-4 text-sm text-gray-600">
                Answer will be shown here.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
