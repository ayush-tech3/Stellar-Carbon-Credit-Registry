"use client";

import { useWalletStore } from "@/stores/wallet-store";
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
            value="12" 
            icon={Leaf} 
            change={{ value: "+2 this month", trend: "up" }}
          />
          <StatCard 
            title="Your Credits" 
            value="4,500" 
            icon={Award}
          />
          <StatCard 
            title="Total Retired (Platform)" 
            value="1.25M" 
            icon={Flame}
            change={{ value: "tons CO₂", trend: "neutral" }}
          />
          <StatCard 
            title="Transfers (24h)" 
            value="156" 
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
          
          <div className="glass-card rounded-xl p-6">
             <h2 className="text-xl font-bold text-white mb-4">Your Portfolio</h2>
             {/* Mock chart for UI */}
             <div className="aspect-square relative flex items-center justify-center">
                <div className="absolute inset-0 border-8 border-emerald-500/20 rounded-full border-t-emerald-500 border-r-teal-500 animate-spin-slow"></div>
                <div className="text-center">
                   <div className="text-3xl font-bold text-white">4,500</div>
                   <div className="text-sm text-gray-400">Total Credits</div>
                </div>
             </div>
             
             <div className="mt-8 space-y-4">
               <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                     <span className="text-gray-300">Amazon Reforestation</span>
                  </div>
                  <span className="font-medium text-white">2,500</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                     <span className="text-gray-300">Wind Farm Texas</span>
                  </div>
                  <span className="font-medium text-white">2,000</span>
               </div>
             </div>
          </div>
        </div>
      </div>

  );
}
