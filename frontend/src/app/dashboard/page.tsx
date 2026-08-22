"use client";

import { useWalletStore } from "@/stores/wallet-store";
import { usePortfolioStore } from "@/stores/portfolio-store";
import { formatAddress } from "@/lib/utils/format";
import { IssueForm } from "@/features/credits/components/IssueForm";
import { TransferForm } from "@/features/credits/components/TransferForm";
import { RetireForm } from "@/features/retirement/components/RetireForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const PORTFOLIO_DATA = [
  { name: "Reforestation", percent: 26, color: "#10b981" },
  { name: "Renewable Energy", percent: 20, color: "#14b8a6" },
  { name: "Methane Capture", percent: 20, color: "#8b5cf6" },
  { name: "Solar Generation", percent: 15, color: "#06b6d4" },
  { name: "Biochar Removal", percent: 5, color: "#3b82f6" },
];

export default function DashboardPage() {
  const { address } = useWalletStore();
  const { totalProjects, userCredits, totalRetired, transfers24h } = usePortfolioStore();
  const [activeTab, setActiveTab] = useState<"issue" | "transfer" | "retire">("issue");
  const [viewMode, setViewMode] = useState<"tabs" | "grid">("grid");

  return (
    <div className="space-y-6 relative z-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">CarbonTrack Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Connected: {address ? <span className="font-mono text-emerald-400">{formatAddress(address)}</span> : <span className="font-mono text-gray-500">Not Connected</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Stellar Testnet
          </span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 bg-[#0f172a]/70 shadow-lg hover:border-emerald-500/30 transition-all">
          <div className="text-sm font-medium text-gray-400 mb-1">Total Projects</div>
          <div className="text-4xl font-extrabold text-white tracking-tight mt-1 text-emerald-400">
            {totalProjects}
          </div>
        </div>

        {/* Your Credits */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 bg-[#0f172a]/70 shadow-lg hover:border-emerald-500/30 transition-all">
          <div className="text-sm font-medium text-gray-400 mb-1">Your Credits</div>
          <div className="text-4xl font-extrabold text-white tracking-tight mt-1 text-teal-300">
            {userCredits.toLocaleString()}
          </div>
        </div>

        {/* Total Retired */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 bg-[#0f172a]/70 shadow-lg hover:border-emerald-500/30 transition-all">
          <div className="text-sm font-medium text-gray-400 mb-1">Total Retired</div>
          <div className="text-3xl font-extrabold text-white tracking-tight mt-1">
            <span className="text-emerald-400">{(totalRetired / 1000000).toFixed(2)}M</span>{" "}
            <span className="text-xs font-normal text-gray-400">tons CO₂</span>
          </div>
        </div>

        {/* Transfers 24h */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 bg-[#0f172a]/70 shadow-lg hover:border-emerald-500/30 transition-all">
          <div className="text-sm font-medium text-gray-400 mb-1">Transfers 24h</div>
          <div className="text-4xl font-extrabold text-white tracking-tight mt-1 text-cyan-400">
            {transfers24h}
          </div>
        </div>
      </div>

      {/* Main Row: Quick Actions (Left 2 Cols) + Portfolio (Right 1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/10 bg-[#0f172a]/75 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Quick Actions</h2>
              <p className="text-xs text-gray-400 mt-0.5">Issue, transfer, or permanently burn carbon credits on Stellar</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="text-xs"
              >
                All 3 Actions
              </Button>
              <Button
                variant={viewMode === "tabs" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("tabs")}
                className="text-xs"
              >
                Focused Tabs
              </Button>
            </div>
          </div>

          {viewMode === "grid" ? (
            /* 3 Action Cards Side-by-side */
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {/* Issue Card */}
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-[#0a101f]/70 space-y-3">
                <div className="text-center font-bold text-emerald-400 pb-2 border-b border-emerald-500/20">
                  Issue Credits
                </div>
                <IssueForm />
              </div>

              {/* Transfer Card */}
              <div className="p-4 rounded-xl border border-cyan-500/30 bg-[#0a101f]/70 space-y-3">
                <div className="text-center font-bold text-cyan-400 pb-2 border-b border-cyan-500/20">
                  Transfer Credits
                </div>
                <TransferForm />
              </div>

              {/* Retire Card */}
              <div className="p-4 rounded-xl border border-amber-500/30 bg-[#0a101f]/70 space-y-3">
                <div className="text-center font-bold text-amber-400 pb-2 border-b border-amber-500/20">
                  Retire Credits
                </div>
                <RetireForm />
              </div>
            </div>
          ) : (
            /* Tabbed View */
            <div className="space-y-6">
              <div className="flex gap-2 bg-black/40 p-1.5 rounded-xl max-w-md border border-white/5">
                <button
                  onClick={() => setActiveTab("issue")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "issue"
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 border border-emerald-400/30"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  🌱 Issue Credits
                </button>
                <button
                  onClick={() => setActiveTab("transfer")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "transfer"
                      ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/30"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  🔄 Transfer
                </button>
                <button
                  onClick={() => setActiveTab("retire")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "retire"
                      ? "bg-amber-600 text-white shadow-lg shadow-amber-500/20 border border-amber-400/30"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  🔥 Retire (Burn)
                </button>
              </div>

              <div className="max-w-xl">
                {activeTab === "issue" && <IssueForm />}
                {activeTab === "transfer" && <TransferForm />}
                {activeTab === "retire" && <RetireForm />}
              </div>
            </div>
          )}
        </div>

        {/* Portfolio Allocation Card */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 bg-[#0f172a]/75 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Portfolio</h2>

            {/* Visual Donut Chart */}
            <div className="relative w-48 h-48 mx-auto my-4 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Donut Segments */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="16"
                  strokeDasharray="62.8 177.2"
                  strokeDashoffset="0"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#14b8a6"
                  strokeWidth="16"
                  strokeDasharray="48 192"
                  strokeDashoffset="-63"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#8b5cf6"
                  strokeWidth="16"
                  strokeDasharray="48 192"
                  strokeDashoffset="-111"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#06b6d4"
                  strokeWidth="16"
                  strokeDasharray="36 204"
                  strokeDashoffset="-159"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="16"
                  strokeDasharray="12 228"
                  strokeDashoffset="-195"
                />
              </svg>
              {/* Inner Hole text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="text-2xl font-black text-white">{userCredits.toLocaleString()}</div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Total tCO₂</div>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-2 mt-6">
              {PORTFOLIO_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-300 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-white">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
