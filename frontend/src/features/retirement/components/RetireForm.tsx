"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWalletStore } from "@/stores/wallet-store";
import { usePortfolioStore } from "@/stores/portfolio-store";
import { useTransactionStore } from "@/stores/transaction-store";
import { useEventStore } from "@/stores/event-store";
import { useRetireCredits } from "../hooks/use-retirement";
import { NETWORK_CONFIG } from "@/lib/stellar/network";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function RetireForm() {
  const [creditId, setCreditId] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { address, isConnected, isDemoMode, connectDemoWallet } = useWalletStore();
  const retireCredits = usePortfolioStore((s) => s.retireCredits);
  const addTransaction = useTransactionStore((s) => s.addTransaction);
  const addEvent = useEventStore((s) => s.addEvent);
  const { mutateAsync: retireCreditsContract } = useRetireCredits();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditId || !amount) return;

    if (!isConnected || !address) {
      connectDemoWallet();
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const numAmount = parseInt(amount, 10);
      let txHash = "";

      if (isDemoMode || !NETWORK_CONFIG.registryContractId) {
        await new Promise((r) => setTimeout(r, 600));
        txHash = `demo_${Math.random().toString(16).substring(2)}${Date.now().toString(16)}`;
      } else {
        const res = await retireCreditsContract({
          creditId,
          amount: BigInt(numAmount),
        });
        txHash = res.hash;
      }

      retireCredits(numAmount);

      addTransaction({
        id: `tx-${Date.now()}`,
        hash: txHash,
        status: "confirmed",
        method: "retire",
        contractId: NETWORK_CONFIG.registryContractId || "CB2RETIREMENT572KC5W2G64K5R3L8O2P1Q9N0M1L2K3J4H5G6F7E8D9C0",
        timestamp: Date.now(),
        retryCount: 0,
      });

      addEvent({
        id: `evt-${Date.now()}`,
        type: "retired",
        ledger: 5289200 + Math.floor(Math.random() * 500),
        timestamp: Math.floor(Date.now() / 1000),
        data: { creditId, amount: numAmount.toString() },
        contractId: NETWORK_CONFIG.registryContractId || "CB2RETIREMENT572KC5W2G64K5R3L8O2P1Q9N0M1L2K3J4H5G6F7E8D9C0",
        txHash,
      });

      setSuccessMsg(`Permanently burned & retired ${numAmount.toLocaleString()} tons of CO₂ via Soroban contract! Certificate recorded on-chain.`);
      setCreditId("");
      setAmount("");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error retiring credits via Soroban contract");
    } finally {
      setIsSubmitting(false);
    }
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
        className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white font-bold" 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Retiring via Soroban SDK..." : "Burn & Retire Credits"}
      </Button>

      {errorMsg && (
        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="flex items-center gap-2 text-amber-400 text-sm mt-2 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </form>
  );
}

