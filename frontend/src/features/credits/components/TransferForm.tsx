"use client";

import { useState } from "react";
import { useTransferCredits } from "../hooks/use-credits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TransferForm() {
  const [creditId, setCreditId] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");

  const transferMutation = useTransferCredits();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditId || !toAddress || !amount) return;

    transferMutation.mutate({
      creditId,
      to: toAddress,
      amount: BigInt(amount),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 rounded-xl space-y-4">
      <h3 className="text-xl font-semibold mb-4 text-emerald-400">Transfer Credits</h3>
      
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Credit Batch ID</label>
        <Input 
          required 
          value={creditId} 
          onChange={(e) => setCreditId(e.target.value)} 
          placeholder="e.g. 1"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Recipient Address (G...)</label>
        <Input 
          required 
          value={toAddress} 
          onChange={(e) => setToAddress(e.target.value)} 
          placeholder="G..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Amount (Tons CO₂)</label>
        <Input 
          required 
          type="number" 
          min="1"
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          placeholder="100"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full mt-4" 
        disabled={transferMutation.isPending}
      >
        {transferMutation.isPending ? "Transferring..." : "Transfer Credits"}
      </Button>

      {transferMutation.isError && (
        <p className="text-red-400 text-sm mt-2">Error transferring credits</p>
      )}
      {transferMutation.isSuccess && (
        <p className="text-emerald-400 text-sm mt-2">Credits transferred successfully!</p>
      )}
    </form>
  );
}
