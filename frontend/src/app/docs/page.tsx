"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";

// Lightweight inline SVG icons
const IconBook = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
);
const IconSparkles = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
);
const IconPlay = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const IconTerminal = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const IconLayers = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
);
const IconCpu = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
);
const IconCode = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
);
const IconShield = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
);
const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);
const IconCopy = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
);
const IconExternal = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
);
const IconLeaf = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m11-13a9 9 0 01-9 9m9-9a9 9 0 00-9 9m9-9H12m0 0v9" /></svg>
);
const IconTransfer = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
);
const IconFlame = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
);
const IconZap = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
);
const IconActivity = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
);

type DocTab = "overview" | "features" | "usage" | "setup" | "implementation" | "contracts" | "api" | "security";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<DocTab>("overview");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const navItems: { id: DocTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "overview", label: "Overview & Problem", icon: IconBook },
    { id: "features", label: "Key Features", icon: IconSparkles },
    { id: "usage", label: "User & Usage Guide", icon: IconPlay },
    { id: "setup", label: "Setup & Installation", icon: IconTerminal },
    { id: "implementation", label: "System Architecture", icon: IconLayers },
    { id: "contracts", label: "Smart Contracts", icon: IconCpu },
    { id: "api", label: "API Reference", icon: IconCode },
    { id: "security", label: "Security & Auditing", icon: IconShield },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col selection:bg-emerald-500 selection:text-black">
      <Header />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 glass-card rounded-2xl p-4 border border-emerald-500/20 shadow-xl space-y-2">
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-white/10 pb-3 mb-2 flex items-center gap-2">
              <IconBook className="w-4 h-4" />
              <span>Project Docs</span>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    isActive
                      ? "bg-emerald-500 text-black font-semibold shadow-lg shadow-emerald-500/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-black" : "text-emerald-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
              <a
                href="https://github.com/ayush-tech3/Stellar-Carbon-Credit-Registry"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-3.5 py-2 text-xs text-gray-400 hover:text-emerald-400 hover:bg-white/5 rounded-lg transition-colors"
              >
                <span>GitHub Repository</span>
                <IconExternal className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtu.be/tyFBRt-QJQs"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-3.5 py-2 text-xs text-gray-400 hover:text-emerald-400 hover:bg-white/5 rounded-lg transition-colors"
              >
                <span>Video Demo Walkthrough</span>
                <IconExternal className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 space-y-8 pb-16">
          {/* ════════════ OVERVIEW ════════════ */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="glass-card p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-black/40 to-black/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Stellar Soroban dApp Documentation
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-4 mb-4 text-white">
                  CarbonTrack Registry Documentation
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
                  A transparent, tamper-proof on-chain carbon credit registry engineered on the Stellar blockchain using Soroban smart contracts.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    href="/dashboard"
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/25"
                  >
                    Launch Live App →
                  </Link>
                  <a
                    href="https://github.com/ayush-tech3/Stellar-Carbon-Credit-Registry"
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-medium text-sm hover:bg-white/15 border border-white/10 transition-colors"
                  >
                    View Source Code
                  </a>
                </div>
              </div>

              {/* Problem vs Solution */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-2xl border border-red-500/20 bg-red-950/10 space-y-3">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-lg">
                    <span>⚠️</span>
                    <h3>Problem in Carbon Markets</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span><strong>Fraud & Phantom Credits:</strong> Credits created with zero verifiable project provenance.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span><strong>Double-Spending:</strong> The same carbon offset batch sold to multiple enterprise buyers across siloed registries.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span><strong>Opaque Retirement:</strong> Lack of immutable public audit trails when offsets are claimed and burned.</span>
                    </li>
                  </ul>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
                    <span>🌱</span>
                    <h3>The CarbonTrack Solution</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span><strong>Cryptographic Immutability:</strong> Balances atomically deducted on-chain; double spending is mathematically impossible.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span><strong>Two-Contract Isolation:</strong> Registry contract handles balances while RetirementManager maintains permanent burned records.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span><strong>Instant Global Finality:</strong> Stellar Testnet/Mainnet offers 3-5s settlement with near-zero gas fees.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="glass-card p-4 rounded-xl border border-white/10 text-center">
                  <div className="text-2xl font-black text-emerald-400">2</div>
                  <div className="text-xs text-gray-400 mt-1 font-medium">Smart Contracts</div>
                </div>
                <div className="glass-card p-4 rounded-xl border border-white/10 text-center">
                  <div className="text-2xl font-black text-emerald-400">15+</div>
                  <div className="text-xs text-gray-400 mt-1 font-medium">Contract Functions</div>
                </div>
                <div className="glass-card p-4 rounded-xl border border-white/10 text-center">
                  <div className="text-2xl font-black text-emerald-400">52+</div>
                  <div className="text-xs text-gray-400 mt-1 font-medium">Onboarded Wallets</div>
                </div>
                <div className="glass-card p-4 rounded-xl border border-white/10 text-center">
                  <div className="text-2xl font-black text-emerald-400">100%</div>
                  <div className="text-xs text-gray-400 mt-1 font-medium">Passing Test Suite</div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════ FEATURES ════════════ */}
          {activeTab === "features" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Platform Features</h2>
                <p className="text-gray-400 text-sm mt-1">Comprehensive breakdown of all system capabilities and modules.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <IconLeaf className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-white">Credit Issuance</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Authorized project developers mint verified carbon credit batches tagged with project name, vintage year, methodology (VCS/Gold Standard), and total tCO₂ amount.
                  </p>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-blue-500/20 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <IconTransfer className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-white">Atomic Transfers</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Peer-to-peer and secondary marketplace transfers between Stellar accounts. Cryptographic sender authorization and balance verification prevent overdrafts.
                  </p>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-amber-500/20 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <IconFlame className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-white">Permanent Retirement</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Burns tokens permanently from the holder’s balance while invoking the RetirementManager via cross-contract calls to generate immutable offset certificates.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <IconZap className="w-4 h-4 text-emerald-400" />
                    1-Click Demo Mode
                  </h4>
                  <p className="text-sm text-gray-400">
                    Instant demo testnet wallet provisioned with automated funding so users and reviewers can evaluate issuing, transferring, and retirement without installing browser extensions.
                  </p>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <IconActivity className="w-4 h-4 text-emerald-400" />
                    Real-time Event Ingestion
                  </h4>
                  <p className="text-sm text-gray-400">
                    Live event polling against Stellar Soroban RPC with real-time toast notifications, transaction lifecycles, and interactive Recharts analytics.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ════════════ USAGE GUIDE ════════════ */}
          {activeTab === "usage" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white">User & Usage Guide</h2>
                <p className="text-gray-400 text-sm mt-1">Step-by-step instructions for interacting with the CarbonTrack dApp.</p>
              </div>

              <div className="space-y-6">
                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center text-sm">1</span>
                    <h3 className="font-bold text-lg text-white">Connect Wallet / Demo Mode</h3>
                  </div>
                  <p className="text-sm text-gray-300 pl-11">
                    Click the <strong>Connect Wallet</strong> button in the top right. You can either connect using the official <strong>Freighter Wallet</strong> browser extension or choose <strong>1-Click Demo Mode</strong> to generate an instant funded testnet session.
                  </p>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center text-sm">2</span>
                    <h3 className="font-bold text-lg text-white">Issuing Carbon Credits (For Project Issuers)</h3>
                  </div>
                  <p className="text-sm text-gray-300 pl-11">
                    Navigate to <strong>Dashboard &gt; Issue Credits</strong> card:
                  </p>
                  <ul className="list-disc pl-16 text-sm text-gray-400 space-y-1">
                    <li>Enter <strong>Project Name</strong> (e.g., <em>Amazon Rainforest Conservation Project</em>).</li>
                    <li>Specify <strong>Amount (tCO₂)</strong> (e.g., <em>5000</em>).</li>
                    <li>Set <strong>Vintage Year</strong> (e.g., <em>2024</em>) and <strong>Methodology</strong> (e.g., <em>VCS / Gold Standard</em>).</li>
                    <li>Submit transaction and approve on Freighter or instant demo keypair.</li>
                  </ul>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center text-sm">3</span>
                    <h3 className="font-bold text-lg text-white">Transferring Carbon Credits</h3>
                  </div>
                  <p className="text-sm text-gray-300 pl-11">
                    In the <strong>Transfer Credits</strong> panel, enter the recipient’s Stellar Testnet Address (e.g., <code>G...</code>), select the Credit Batch ID, enter the quantity, and sign the transaction. The smart contract validates ownership and atomic debit/credit.
                  </p>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center text-sm">4</span>
                    <h3 className="font-bold text-lg text-white">Retiring Carbon Credits (Offset Burning)</h3>
                  </div>
                  <p className="text-sm text-gray-300 pl-11">
                    To claim an official carbon offset:
                  </p>
                  <ul className="list-disc pl-16 text-sm text-gray-400 space-y-1">
                    <li>Select <strong>Retire Credits</strong>.</li>
                    <li>Input the amount of tCO₂ you wish to permanently offset.</li>
                    <li>The contract burns the credits and records the retirement in the <code>RetirementManager</code> ledger.</li>
                    <li>An immutable on-chain certificate is minted with timestamp and proof hash.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ════════════ SETUP & INSTALLATION ════════════ */}
          {activeTab === "setup" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Developer Setup & Installation</h2>
                <p className="text-gray-400 text-sm mt-1">Guide to clone, build, test, and deploy the contracts and frontend locally.</p>
              </div>

              {/* Prerequisites */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
                <h3 className="font-bold text-lg text-white">Prerequisites</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <strong className="text-emerald-400 block mb-1">Rust & WASM</strong>
                    <span className="text-gray-400">Rust 1.80+ with target <code>wasm32-unknown-unknown</code></span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <strong className="text-emerald-400 block mb-1">Stellar CLI</strong>
                    <span className="text-gray-400"><code>cargo install --locked stellar-cli</code></span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <strong className="text-emerald-400 block mb-1">Node.js</strong>
                    <span className="text-gray-400">Node.js 20+ & npm / yarn</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <strong className="text-emerald-400 block mb-1">Freighter Wallet</strong>
                    <span className="text-gray-400">Browser extension set to <em>Testnet</em></span>
                  </div>
                </div>
              </div>

              {/* Code Snippets */}
              <div className="space-y-4">
                <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                  <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-400">1. Clone & Build Smart Contracts</span>
                    <button
                      onClick={() => copyToClipboard("git clone https://github.com/ayush-tech3/Stellar-Carbon-Credit-Registry.git\ncd Stellar-Carbon-Credit-Registry/contracts\nrustup target add wasm32-unknown-unknown\ncargo build --release --target wasm32-unknown-unknown\ncargo test --workspace", "c1")}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      {copiedCode === "c1" ? <IconCheck className="w-3.5 h-3.5" /> : <IconCopy className="w-3.5 h-3.5" />}
                      <span>{copiedCode === "c1" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-gray-300 bg-black/50 overflow-x-auto">
{`git clone https://github.com/ayush-tech3/Stellar-Carbon-Credit-Registry.git
cd Stellar-Carbon-Credit-Registry/contracts

# Add WASM target
rustup target add wasm32-unknown-unknown

# Build release WASMs
cargo build --release --target wasm32-unknown-unknown

# Run full Rust test suite
cargo test --workspace`}
                  </pre>
                </div>

                <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                  <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-400">2. Deploy Contracts to Stellar Testnet</span>
                    <button
                      onClick={() => copyToClipboard("stellar keys generate deployer --network testnet --fund\nchmod +x scripts/deploy-testnet.sh\n./scripts/deploy-testnet.sh", "c2")}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      {copiedCode === "c2" ? <IconCheck className="w-3.5 h-3.5" /> : <IconCopy className="w-3.5 h-3.5" />}
                      <span>{copiedCode === "c2" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-gray-300 bg-black/50 overflow-x-auto">
{`# Generate funded testnet identity
stellar keys generate deployer --network testnet --fund

# Run automated deployment script
chmod +x scripts/deploy-testnet.sh
./scripts/deploy-testnet.sh`}
                  </pre>
                </div>

                <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                  <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-400">3. Run Next.js Frontend</span>
                    <button
                      onClick={() => copyToClipboard("cd ../frontend\ncp ../.env.example .env.local\nnpm install\nnpm run dev", "c3")}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      {copiedCode === "c3" ? <IconCheck className="w-3.5 h-3.5" /> : <IconCopy className="w-3.5 h-3.5" />}
                      <span>{copiedCode === "c3" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-gray-300 bg-black/50 overflow-x-auto">
{`cd ../frontend
cp ../.env.example .env.local

# Install dependencies and launch development server
npm install
npm run dev

# Open in browser at http://localhost:3000`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* ════════════ ARCHITECTURE & IMPLEMENTATION ════════════ */}
          {activeTab === "implementation" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white">System Architecture & Design</h2>
                <p className="text-gray-400 text-sm mt-1">Multi-tier dApp architecture on Stellar Soroban.</p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="font-bold text-lg text-white">Layered Architecture</h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="p-3 bg-white/5 rounded-xl border-l-4 border-emerald-400">
                    <strong>1. Presentation Layer (Next.js 15 & TypeScript):</strong> Glassmorphic dark UI built with Tailwind CSS, Framer Motion animations, custom UI primitives, and mobile responsive navigation drawer.
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border-l-4 border-blue-400">
                    <strong>2. State & Service Layer:</strong> Zustand stores for client session persistence + TanStack React Query for RPC cache management. Isolates Stellar blockchain logic from React UI components.
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border-l-4 border-purple-400">
                    <strong>3. Wallet & Client SDK:</strong> Official <code>@stellar/freighter-api</code> and <code>@stellar/stellar-sdk</code> managing transaction envelopes, XDR serialization, and RPC simulation.
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border-l-4 border-amber-400">
                    <strong>4. On-Chain Smart Contracts:</strong> Soroban Rust contracts deployed on Stellar Testnet implementing Instance/Persistent storage, role-based authorization, and atomic cross-contract interactions.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════ SMART CONTRACTS ════════════ */}
          {activeTab === "contracts" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Smart Contract Architecture</h2>
                <p className="text-gray-400 text-sm mt-1">Deep dive into Soroban contracts and storage patterns.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 space-y-4">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    carbon_credit_registry
                  </span>
                  <h3 className="font-bold text-lg text-white">1. Core Registry Contract</h3>
                  <p className="text-sm text-gray-400">
                    Maintains credit batch metadata, active balances, issuer whitelists, and initiates retirement via cross-contract calls.
                  </p>
                  <div className="text-xs font-mono bg-black/40 p-3 rounded-xl border border-white/10 text-gray-300 space-y-1">
                    <div>• <code>initialize(admin, retire_ctr)</code></div>
                    <div>• <code>add_issuer(issuer)</code></div>
                    <div>• <code>remove_issuer(issuer)</code></div>
                    <div>• <code>issue_credits(issuer, project, ...)</code></div>
                    <div>• <code>transfer(from, to, credit_id, ...)</code></div>
                    <div>• <code>retire(owner, credit_id, amount)</code></div>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-purple-500/20 space-y-4">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30">
                    retirement_manager
                  </span>
                  <h3 className="font-bold text-lg text-white">2. Retirement Manager Contract</h3>
                  <p className="text-sm text-gray-400">
                    Immutable ledger storing burned offset records and global aggregated CO₂ ton counter. Only accepts record requests from the linked Registry contract.
                  </p>
                  <div className="text-xs font-mono bg-black/40 p-3 rounded-xl border border-white/10 text-gray-300 space-y-1">
                    <div>• <code>initialize(admin, registry_ctr)</code></div>
                    <div>• <code>record(credit_id, owner, amount, ...)</code></div>
                    <div>• <code>get_record(retirement_id)</code></div>
                    <div>• <code>get_total()</code></div>
                    <div>• <code>get_by_owner(owner)</code></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════ API REFERENCE ════════════ */}
          {activeTab === "api" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Contract API Reference</h2>
                <p className="text-gray-400 text-sm mt-1">Full specification of callable functions, types, and error codes.</p>
              </div>

              <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-emerald-400 font-semibold border-b border-white/10">
                      <tr>
                        <th className="p-4">Function</th>
                        <th className="p-4">Parameters</th>
                        <th className="p-4">Returns</th>
                        <th className="p-4">Access Control</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                      <tr>
                        <td className="p-4 font-mono text-xs text-white">initialize</td>
                        <td className="p-4 text-xs font-mono text-gray-400">admin: Address, retire_ctr: Address</td>
                        <td className="p-4 text-xs font-mono text-gray-400">Result&lt;(), RegistryError&gt;</td>
                        <td className="p-4"><span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400">Admin Only</span></td>
                      </tr>
                      <tr>
                        <td className="p-4 font-mono text-xs text-white">add_issuer</td>
                        <td className="p-4 text-xs font-mono text-gray-400">issuer: Address</td>
                        <td className="p-4 text-xs font-mono text-gray-400">Result&lt;(), RegistryError&gt;</td>
                        <td className="p-4"><span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400">Admin Only</span></td>
                      </tr>
                      <tr>
                        <td className="p-4 font-mono text-xs text-white">issue_credits</td>
                        <td className="p-4 text-xs font-mono text-gray-400">issuer, project, amount, vintage, method</td>
                        <td className="p-4 text-xs font-mono text-gray-400">Result&lt;u64, RegistryError&gt;</td>
                        <td className="p-4"><span className="px-2 py-0.5 rounded text-[10px] bg-yellow-500/20 text-yellow-400">Authorized Issuer</span></td>
                      </tr>
                      <tr>
                        <td className="p-4 font-mono text-xs text-white">transfer</td>
                        <td className="p-4 text-xs font-mono text-gray-400">from, to, credit_id, amount</td>
                        <td className="p-4 text-xs font-mono text-gray-400">Result&lt;(), RegistryError&gt;</td>
                        <td className="p-4"><span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400">Credit Owner</span></td>
                      </tr>
                      <tr>
                        <td className="p-4 font-mono text-xs text-white">retire</td>
                        <td className="p-4 text-xs font-mono text-gray-400">owner, credit_id, amount</td>
                        <td className="p-4 text-xs font-mono text-gray-400">Result&lt;u64, RegistryError&gt;</td>
                        <td className="p-4"><span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400">Credit Owner</span></td>
                      </tr>
                      <tr>
                        <td className="p-4 font-mono text-xs text-white">get_balance</td>
                        <td className="p-4 text-xs font-mono text-gray-400">owner: Address, credit_id: u64</td>
                        <td className="p-4 text-xs font-mono text-gray-400">i128</td>
                        <td className="p-4"><span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400">Public View</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════ SECURITY ════════════ */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Security & Audit Considerations</h2>
                <p className="text-gray-400 text-sm mt-1">Multi-tier safeguards protecting against exploits, reentrancy, and double-spending.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-emerald-400" />
                    Double-Spend Elimination
                  </h4>
                  <p className="text-sm text-gray-400">
                    Balances are deducted atomically prior to cross-contract invocation. Rust checked math (<code>checked_sub</code>, <code>checked_add</code>) guarantees zero risk of negative balance or integer overflow.
                  </p>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-emerald-400" />
                    Strict Cross-Contract Trust Boundary
                  </h4>
                  <p className="text-sm text-gray-400">
                    The <code>RetirementManager</code> validates that callers match the stored <code>registry_ctr</code> address, rejecting direct spoofed retirement entries.
                  </p>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-emerald-400" />
                    Role-Based Access Control (RBAC)
                  </h4>
                  <p className="text-sm text-gray-400">
                    Sensitive operations require explicit <code>Address.require_auth()</code> signatures coupled with persistent storage issuer whitelist validations.
                  </p>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-emerald-400" />
                    No Private Key Handling
                  </h4>
                  <p className="text-sm text-gray-400">
                    Frontend never stores or requests secret seed phrases; all on-chain signing is sandboxed in Freighter Wallet or isolated ephemeral session keypairs.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
