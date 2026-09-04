import React from "react";

export default function DashboardCard({ title, desc, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-[2rem] p-8 shadow hover:shadow-xl cursor-pointer transition"
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-500 mt-2">{desc}</p>
    </div>
  );
}
