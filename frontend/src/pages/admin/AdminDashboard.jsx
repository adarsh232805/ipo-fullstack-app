import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-500">Manage IPOs, users, KYC & content</p>

      <div className="grid md:grid-cols-3 gap-6">
        <Card title="Manage IPOs" onClick={() => navigate("/admin/ipos")} />
        <Card title="Add New IPO" onClick={() => navigate("/admin/ipos/add")} />
        <Card title="Analytics (Coming Soon)" />
      </div>
    </div>
  );
}

function Card({ title, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white p-6 rounded-xl shadow hover:shadow-lg text-left"
    >
      <h2 className="font-semibold">{title}</h2>
    </button>
  );
}
