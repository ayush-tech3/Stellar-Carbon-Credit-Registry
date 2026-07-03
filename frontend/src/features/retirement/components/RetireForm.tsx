"use client";

import { useState } from "react";
import { useRetireCredits } from "../hooks/use-retirement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RetireForm() {
  const [creditId, setCreditId] = useState("");
  const [amount, setAmount] = useState("");

  const retireMutation = useRetireCredits();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditId || !amount) return;

    retireMutation.mutate({
      creditId,
      amount: BigInt(amount),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 rounded-xl space-y-4 border-amber-500/20 hover:border-amber-500/50 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-amber-500 text-xl">🔥</span>
        <h3 className="text-xl font-semibold text-amber-400">Retire Credits</h3>
      </div>
      
      <p className="text-sm text-gray-400 mb-4">
        Retiring credits permanently removes them from circulation to offset your carbon footprint. This action cannot be undone.
      </p>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Credit Batch ID</label>
        <Input 
          required 
          value={creditId} 
          onChange={(e) => setCreditId(e.target.value)} 
          placeholder="e.g. 1"
          className="focus-visible:ring-amber-500"
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
          className="focus-visible:ring-amber-500"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white" 
        disabled={retireMutation.isPending}
      >
        {retireMutation.isPending ? "Retiring..." : "Burn & Retire Credits"}
      </Button>

      {retireMutation.isError && (
        <p className="text-red-400 text-sm mt-2">Error retiring credits</p>
      )}
      {retireMutation.isSuccess && (
        <p className="text-amber-400 text-sm mt-2">Credits retired successfully! Check your certificates.</p>
      )}
    </form>
  );
}
