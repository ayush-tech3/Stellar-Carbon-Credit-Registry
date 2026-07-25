"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWalletStore } from "@/stores/wallet-store";
import { usePortfolioStore } from "@/stores/portfolio-store";
import { useTransactionStore } from "@/stores/transaction-store";
import { useEventStore } from "@/stores/event-store";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function IssueForm() {
  const [project, setProject] = useState("");
  const [amount, setAmount] = useState("");
  const [vintageYear, setVintageYear] = useState("");
  const [methodology, setMethodology] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { address, isConnected, connectDemoWallet } = useWalletStore();
  const addCredits = usePortfolioStore((s) => s.addCredits);
  const addTransaction = useTransactionStore((s) => s.addTransaction);
  const addEvent = useEventStore((s) => s.addEvent);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !amount || !vintageYear || !methodology) return;

    if (!isConnected || !address) {
      connectDemoWallet();
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const numAmount = parseInt(amount, 10);
      const numYear = parseInt(vintageYear, 10);
      const txHash = `${Math.random().toString(16).substring(2)}${Date.now().toString(16)}`;

      // Simulate blockchain execution latency
      await new Promise((r) => setTimeout(r, 600));

      // Update state stores
      addCredits(project, numAmount, numYear, methodology);

      addTransaction({
        id: `tx-${Date.now()}`,
        hash: txHash,
        status: "confirmed",
        method: "issue_credits",
        contractId: "CC3REGISTRY572KC5W2G64K5R3L8O2P1Q9N0M1L2K3J4H5G6F7E8D9C0",
        timestamp: Date.now(),
        retryCount: 0,
      });

      addEvent({
        id: `evt-${Date.now()}`,
        type: "issued",
        ledger: 5289200 + Math.floor(Math.random() * 500),
        timestamp: Math.floor(Date.now() / 1000),
        data: { project, amount: numAmount.toString(), vintageYear: numYear, methodology },
        contractId: "CC3REGISTRY572KC5W2G64K5R3L8O2P1Q9N0M1L2K3J4H5G6F7E8D9C0",
        txHash,
      });

      setSuccessMsg(`Successfully issued ${numAmount.toLocaleString()} tons of CO₂ for ${project}!`);
      setProject("");
      setAmount("");
      setVintageYear("");
      setMethodology("");
    } catch (err: any) {
      setErrorMsg(err.message || "Error issuing credits");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 rounded-xl space-y-4">
      <h3 className="text-xl font-semibold mb-4 text-emerald-400">Issue Credits</h3>
      
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Project Name</label>
        <Input 
          required 
          value={project} 
          onChange={(e) => setProject(e.target.value)} 
          placeholder="e.g. Amazon Reforestation"
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
          placeholder="1000"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Vintage Year</label>
        <Input 
          required 
          type="number"
          min="1900"
          max="2100"
          value={vintageYear} 
          onChange={(e) => setVintageYear(e.target.value)} 
          placeholder="2024"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Methodology</label>
        <Input 
          required 
          value={methodology} 
          onChange={(e) => setMethodology(e.target.value)} 
          placeholder="e.g. VCS VM0015"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold" 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Issuing..." : "Issue Credits"}
      </Button>

      {errorMsg && (
        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="flex items-center gap-2 text-emerald-400 text-sm mt-2 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </form>
  );
}
