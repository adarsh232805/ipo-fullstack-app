import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function GmpChart({ history }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-3">
        GMP – Last 10 Days Trend
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={history}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="gmp" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
