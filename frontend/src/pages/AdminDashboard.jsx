import React from "react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500">
          Platform overview & system health
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Stat title="Total Users" value="1,248" />
        <Stat title="Active IPOs" value="12" />
        <Stat title="KYC Pending" value="89" />
        <Stat title="Subscribers" value="3,402" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          Admin Actions
        </h2>
        <ul className="list-disc ml-6 text-gray-600 space-y-2">
          <li>Manage IPO listings</li>
          <li>Verify KYC documents</li>
          <li>Control footer & static pages</li>
          <li>Send announcements</li>
        </ul>
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
