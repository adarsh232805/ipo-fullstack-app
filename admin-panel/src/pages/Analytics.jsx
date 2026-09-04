import { useEffect, useState } from "react";
import adminAxios from "../api/adminAxios";

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    adminAxios
      .get("/analytics")
      .then(res => setData(res.data))
      .catch(err => console.error("Analytics error:", err));
  }, []);

  if (!data) {
    return <p className="text-gray-500">Loading analytics...</p>;
  }

  const Card = ({ title, value }) => (
    <div className="bg-white/80 backdrop-blur border rounded-2xl shadow p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card title="Total IPOs" value={data.total} />
        <Card title="Open IPOs" value={data.status.open} />
        <Card title="Trending IPOs" value={data.trending} />
        <Card title="Highest GMP" value={`₹${data.gmp.highest}`} />
      </div>

      {/* Status */}
      <div className="bg-white/80 border rounded-2xl shadow p-6 mb-10">
        <h2 className="text-lg font-semibold mb-4">
          IPO Status Breakdown
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>Upcoming: <b>{data.status.upcoming}</b></div>
          <div>Open: <b>{data.status.open}</b></div>
          <div>Closed: <b>{data.status.closed}</b></div>
          <div>Listed: <b>{data.status.listed}</b></div>
        </div>
      </div>

      {/* Latest IPOs */}
      <div className="bg-white/80 border rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Latest IPOs
        </h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Company</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">GMP</th>
            </tr>
          </thead>
          <tbody>
            {data.latestIpos.map(ipo => (
              <tr key={ipo._id} className="border-t">
                <td className="p-2">{ipo.companyName}</td>
                <td className="p-2 capitalize">{ipo.status}</td>
                <td className="p-2">₹{ipo.gmp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
