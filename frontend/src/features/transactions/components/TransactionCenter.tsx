"use client";

import { useTransactions } from "../hooks/use-transactions";
import { TransactionCard } from "./TransactionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { History } from "lucide-react";
import { useState } from "react";
import { TransactionStatus } from "../types";

export function TransactionCenter() {
  const { transactions } = useTransactions();
  const [filter, setFilter] = useState<TransactionStatus | 'all'>('all');

  const filteredTxs = transactions
    .filter(tx => filter === 'all' || tx.status === filter)
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Transaction Center</h1>
          <p className="text-gray-400">Track your recent blockchain operations.</p>
        </div>
        
        <select 
          className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="confirmed">Confirmed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="glass-card rounded-xl p-1 min-h-[400px]">
        {filteredTxs.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center">
            <EmptyState 
              icon={History} 
              title="No transactions yet" 
              description="Your transaction history will appear here once you interact with the registry." 
            />
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredTxs.map((tx) => (
              <TransactionCard key={tx.id} transaction={tx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
