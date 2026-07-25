"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const dataMap = {
  "6M": [
    { month: "Jan", tons: 85000 },
    { month: "Feb", tons: 110000 },
    { month: "Mar", tons: 145000 },
    { month: "Apr", tons: 190000 },
    { month: "May", tons: 230000 },
    { month: "Jun", tons: 290000 },
  ],
  "1Y": [
    { month: "Jul '25", tons: 50000 },
    { month: "Aug '25", tons: 65000 },
    { month: "Sep '25", tons: 72000 },
    { month: "Oct '25", tons: 90000 },
    { month: "Nov '25", tons: 105000 },
    { month: "Dec '25", tons: 120000 },
    { month: "Jan '26", tons: 140000 },
    { month: "Feb '26", tons: 175000 },
    { month: "Mar '26", tons: 210000 },
    { month: "Apr '26", tons: 250000 },
    { month: "May '26", tons: 295000 },
    { month: "Jun '26", tons: 340000 },
  ],
};

export function IssuanceTrendChart() {
  const [timeframe, setTimeframe] = useState<"6M" | "1Y">("1Y");

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">Issuance Trend</h3>
          <p className="text-xs text-gray-400">Monthly carbon credit minting volume (tons CO₂)</p>
        </div>
        <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setTimeframe("6M")}
            className={`px-2.5 py-1 text-xs rounded-md transition-all ${
              timeframe === "6M"
                ? "bg-emerald-500 text-black font-bold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            6M
          </button>
          <button
            onClick={() => setTimeframe("1Y")}
            className={`px-2.5 py-1 text-xs rounded-md transition-all ${
              timeframe === "1Y"
                ? "bg-emerald-500 text-black font-bold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            1Y
          </button>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dataMap[timeframe]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="issuanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} tickLine={false} />
            <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#ffffff20",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value: any) => [`${Number(value).toLocaleString()} tons CO₂`, "Issued"]}
            />
            <Area
              type="monotone"
              dataKey="tons"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#issuanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
