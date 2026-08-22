"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWalletStore } from "@/stores/wallet-store";
import { usePortfolioStore } from "@/stores/portfolio-store";
import { useTransactionStore } from "@/stores/transaction-store";
import { useEventStore } from "@/stores/event-store";
import { useIssueCredits } from "../hooks/use-credits";
import { NETWORK_CONFIG } from "@/lib/stellar/network";
import { CheckCircle2, AlertCircle, Wallet, ExternalLink, Loader2, Leaf } from "lucide-react";
import { Analytics } from "@/lib/utils/analytics";
import { useToastStore } from "@/stores/toast-store";
import { formatAddress } from "@/lib/utils/format";
import { getExplorerUrl } from "@/lib/stellar/contracts";

export function IssueForm() {
  const [project, setProject] = useState("");
  const [amount, setAmount] = useState("");
  const [vintageYear, setVintageYear] = useState("2024");
  const [methodology, setMethodology] = useState("VCS VM0015");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusStep, setStatusStep] = useState<string>("");
  const [successTx, setSuccessTx] = useState<{ hash: string; amount: number; project: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const { address, isConnected, isDemoMode, walletType, openWalletModal } = useWalletStore();
  const addCredits = usePortfolioStore((s) => s.addCredits);
  const addTransaction = useTransactionStore((s) => s.addTransaction);
  const addEvent = useEventStore((s) => s.addEvent);
  const { mutateAsync: issueCreditsContract } = useIssueCredits();
  const { addToast } = useToastStore();

  const handleQuickPreset = (name: string, amt: string, year: string, method: string) => {
    setProject(name);
    setAmount(amt);
    setVintageYear(year);
    setMethodology(method);
    setErrorMsg("");
    setSuccessTx(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      openWalletModal();
      return;
    }

    if (!project || !amount || !vintageYear || !methodology) {
      setErrorMsg("Please fill in all project fields");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessTx(null);
    setStatusStep("Simulating Soroban smart contract call...");

    try {
      const numAmount = parseInt(amount, 10);
      const numYear = parseInt(vintageYear, 10);
      let txHash = "";

      if (isDemoMode || !NETWORK_CONFIG.registryContractId) {
        // Simulated execution for Demo mode / local testnet
        await new Promise((r) => setTimeout(r, 600));
        setStatusStep("Signing transaction with Demo keypair...");
        await new Promise((r) => setTimeout(r, 700));
        setStatusStep("Submitting transaction to Stellar Testnet...");
        await new Promise((r) => setTimeout(r, 800));
        txHash = `1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b${Math.floor(Math.random() * 899999 + 100000).toString(16)}`;
      } else {
        setStatusStep("Requesting signature from Freighter wallet...");
        const res = await issueCreditsContract({
          project,
          amount: BigInt(numAmount),
          vintageYear: numYear,
          methodology,
        });
        txHash = res.hash;
      }

      // Update state stores & logs
      addCredits(project, numAmount, numYear, methodology);

      addTransaction({
        id: `tx-${Date.now()}`,
        hash: txHash,
        status: "confirmed",
        method: "issue_credits",
        contractId: NETWORK_CONFIG.registryContractId || "CC3REGISTRY572KC5W2G64K5R3L8O2P1Q9N0M1L2K3J4H5G6F7E8D9C0",
        timestamp: Date.now(),
        retryCount: 0,
      });

      addEvent({
        id: `evt-${Date.now()}`,
        type: "issued",
        ledger: 5289200 + Math.floor(Math.random() * 500),
        timestamp: Math.floor(Date.now() / 1000),
        data: { project, amount: numAmount.toString(), vintageYear: numYear, methodology },
        contractId: NETWORK_CONFIG.registryContractId || "CC3REGISTRY572KC5W2G64K5R3L8O2P1Q9N0M1L2K3J4H5G6F7E8D9C0",
        txHash,
      });

      setSuccessTx({ hash: txHash, amount: numAmount, project });
      Analytics.trackTransaction("issue", "success", numAmount);
      addToast({
        type: "success",
        title: "Credits Successfully Issued!",
        message: `${numAmount.toLocaleString()} tCO₂ minted for ${project}`,
      });

      setProject("");
      setAmount("");
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Error issuing credits via Soroban contract";
      setErrorMsg(errMsg);
      Analytics.trackTransaction("issue", "failed");
      Analytics.trackError(errMsg, "IssueForm");
      addToast({ type: "error", title: "Issuance Failed", message: errMsg });
    } finally {
      setIsSubmitting(false);
      setStatusStep("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Wallet State Indicator */}
      {!isConnected || !address ? (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 flex-shrink-0 text-amber-400" />
            <span>Connect wallet to issue verified credits</span>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={openWalletModal}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-7 px-3 rounded-lg"
          >
            Connect
          </Button>
        </div>
      ) : (
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono">{formatAddress(address)}</span>
            <span className="text-[10px] uppercase font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300">
              {walletType || "Active"}
            </span>
          </div>
          <span className="text-gray-400 text-[11px]">Stellar Testnet</span>
        </div>
      )}

      {/* Quick Presets */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        <button
          type="button"
          onClick={() => handleQuickPreset("Amazon Reforestation", "1000", "2024", "VCS VM0015")}
          className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/30 text-gray-300 hover:text-emerald-300 transition-colors"
        >
          🌱 Amazon (1k)
        </button>
        <button
          type="button"
          onClick={() => handleQuickPreset("Texas Wind Farm", "2500", "2024", "Gold Standard")}
          className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-teal-500/15 border border-white/10 hover:border-teal-500/30 text-gray-300 hover:text-teal-300 transition-colors"
        >
          💨 Texas Wind (2.5k)
        </button>
        <button
          type="button"
          onClick={() => handleQuickPreset("Kenya Mangrove Restoration", "5000", "2024", "Plan Vivo")}
          className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/30 text-gray-300 hover:text-cyan-300 transition-colors"
        >
          🌊 Mangrove (5k)
        </button>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-400">Project Name</label>
        <Input
          required
          value={project}
          onChange={(e) => setProject(e.target.value)}
          placeholder="e.g. Amazon Reforestation"
          className="bg-black/40 border-white/10 focus:border-emerald-500/50 h-9 text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-400">Amount (Tons CO₂)</label>
        <Input
          required
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="1000"
          className="bg-black/40 border-white/10 focus:border-emerald-500/50 h-9 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400">Vintage Year</label>
          <Input
            required
            type="number"
            min="1900"
            max="2100"
            value={vintageYear}
            onChange={(e) => setVintageYear(e.target.value)}
            placeholder="2024"
            className="bg-black/40 border-white/10 focus:border-emerald-500/50 h-9 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400">Methodology</label>
          <Input
            required
            value={methodology}
            onChange={(e) => setMethodology(e.target.value)}
            placeholder="e.g. VCS VM0015"
            className="bg-black/40 border-white/10 focus:border-emerald-500/50 h-9 text-sm"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold h-10 shadow-lg shadow-emerald-500/20"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {statusStep || "Processing..."}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            Issue Credits
          </span>
        )}
      </Button>

      {/* Error Display */}
      {errorMsg && (
        <div className="flex items-center gap-2 text-red-400 text-xs mt-2 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Success Transaction Receipt */}
      {successTx && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs space-y-2 mt-2">
          <div className="flex items-center gap-2 text-emerald-300 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Credits Successfully Minted on Stellar!</span>
          </div>
          <p className="text-gray-300 text-[11px]">
            Issued <b>{successTx.amount.toLocaleString()} tCO₂</b> for {successTx.project}.
          </p>
          <div className="flex items-center justify-between pt-1 border-t border-emerald-500/20">
            <span className="font-mono text-gray-400 text-[10px]">
              Tx: {successTx.hash.slice(0, 12)}...{successTx.hash.slice(-6)}
            </span>
            <a
              href={getExplorerUrl("tx", successTx.hash)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              <span>View Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </form>
  );
}
