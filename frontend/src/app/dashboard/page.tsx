"use client";

import { useWalletStore } from "@/stores/wallet-store";
import { usePortfolioStore } from "@/stores/portfolio-store";
import { StatCard } from "@/components/shared/StatCard";
import { formatAddress } from "@/lib/utils/format";

import { Leaf, Award, ArrowRightLeft, Flame } from "lucide-react";
import { IssueForm } from "@/features/credits/components/IssueForm";
import { TransferForm } from "@/features/credits/components/TransferForm";
import { RetireForm } from "@/features/retirement/components/RetireForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { address } = useWalletStore();
  const { totalProjects, userCredits, totalRetired, transfers24h, items } = usePortfolioStore();
  const [activeTab, setActiveTab] = useState<'issue' | 'transfer' | 'retire'>('issue');

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">
            Welcome back, {address ? <span className="font-mono text-emerald-400">{formatAddress(address)}</span> : "Guest"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Projects" 
            value={totalProjects.toString()} 
            icon={Leaf} 
            change={{ value: "+2 this month", trend: "up" }}
          />
          <StatCard 
            title="Your Credits" 
            value={userCredits.toLocaleString()} 
            icon={Award}
          />
          <StatCard 
            title="Total Retired (Platform)" 
            value={`${(totalRetired / 1000000).toFixed(2)}M`} 
            icon={Flame}
            change={{ value: "tons CO₂", trend: "neutral" }}
          />
          <StatCard 
            title="Transfers (24h)" 
            value={transfers24h.toString()} 
            icon={ArrowRightLeft}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card rounded-xl p-6 min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Quick Actions</h2>
              <div className="flex gap-2 bg-black/40 p-1 rounded-lg">
                <Button 
                  variant={activeTab === 'issue' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setActiveTab('issue')}
                >
                  Issue
                </Button>
                <Button 
                  variant={activeTab === 'transfer' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setActiveTab('transfer')}
                >
                  Transfer
                </Button>
                <Button 
                  variant={activeTab === 'retire' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setActiveTab('retire')}
                  className={activeTab === 'retire' ? "bg-amber-600 hover:bg-amber-700" : ""}
                >
                  Retire
                </Button>
              </div>
            </div>
            
            <div className="max-w-md mx-auto mt-8">
              {activeTab === 'issue' && <IssueForm />}
              {activeTab === 'transfer' && <TransferForm />}
              {activeTab === 'retire' && <RetireForm />}
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6 flex flex-col justify-between">
             <h2 className="text-xl font-bold text-white mb-4">Your Portfolio</h2>
             
             <div className="aspect-square relative flex items-center justify-center my-4">
                <div className="absolute inset-0 border-8 border-emerald-500/20 rounded-full border-t-emerald-500 border-r-teal-500 animate-spin-slow"></div>
                <div className="text-center">
                   <div className="text-3xl font-bold text-white">{userCredits.toLocaleString()}</div>
                   <div className="text-sm text-gray-400">Total Credits</div>
                </div>
             </div>
             
             <div className="mt-4 space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-1">
               {items.map((item) => (
                 <div key={item.id} className="flex justify-between items-center text-sm p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2 truncate">
                       <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color || '#10b981' }}></div>
                       <span className="text-gray-300 truncate">{item.project}</span>
                    </div>
                    <span className="font-semibold text-white ml-2">{item.amount.toLocaleString()}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
  );
}
