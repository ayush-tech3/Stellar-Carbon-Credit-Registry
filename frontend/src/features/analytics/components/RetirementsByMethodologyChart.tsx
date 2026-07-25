"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "Reforestation (VCS)", value: 480000, color: "#10b981" },
  { name: "Wind/Solar (GS)", value: 340000, color: "#14b8a6" },
  { name: "Mangroves (Blue Carbon)", value: 250000, color: "#06b6d4" },
  { name: "Direct Air Capture", value: 152145, color: "#3b82f6" },
];

export function RetirementsByMethodologyChart() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white">Retirements by Methodology</h3>
        <p className="text-xs text-gray-400">Total CO₂ tons permanently burned by methodology</p>
      </div>

      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
            <XAxis type="number" stroke="#9ca3af" fontSize={11} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
            <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} width={130} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#ffffff20",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value: any) => [`${Number(value).toLocaleString()} tons CO₂`, "Retired"]}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
