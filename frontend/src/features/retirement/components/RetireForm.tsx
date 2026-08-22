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
import { CheckCircle2, AlertCircle, Flame, Wallet, ExternalLink, Loader2 } from "lucide-react";
import { Analytics } from "@/lib/utils/analytics";
import { useToastStore } from "@/stores/toast-store";
import { formatAddress } from "@/lib/utils/format";
import { getExplorerUrl } from "@/lib/stellar/contracts";

export function RetireForm() {
  const [creditId, setCreditId] = useState("1");
  const [amount, setAmount] = useState("");
  const [beneficiary, setBeneficiary] = useState("Acme Corp ESG Offset");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusStep, setStatusStep] = useState<string>("");
  const [successTx, setSuccessTx] = useState<{ hash: string; amount: number; certId: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const { address, isConnected, isDemoMode, walletType, openWalletModal } = useWalletStore();
  const { userCredits, retireCredits } = usePortfolioStore();
  const addTransaction = useTransactionStore((s) => s.addTransaction);
  const addEvent = useEventStore((s) => s.addEvent);
  const { mutateAsync: retireCreditsContract } = useRetireCredits();
  const { addToast } = useToastStore();

  const handleQuickRetire = (amt: string, reason: string) => {
    setAmount(amt);
    setBeneficiary(reason);
    setErrorMsg("");
    setSuccessTx(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      openWalletModal();
      return;
    }

    if (!creditId || !amount) {
      setErrorMsg("Please provide batch ID and retirement amount");
      return;
    }

    const numAmount = parseInt(amount, 10);
    if (numAmount > userCredits) {
      setErrorMsg(`Insufficient balance. You currently hold ${userCredits.toLocaleString()} tCO₂ credits.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessTx(null);
    setStatusStep("Invoking Soroban cross-contract call to Retirement Manager...");

    try {
      let txHash = "";
      const certId = `CERT-2026-${Math.floor(Math.random() * 89999 + 10000)}`;

      if (isDemoMode || !NETWORK_CONFIG.registryContractId) {
        await new Promise((r) => setTimeout(r, 600));
        setStatusStep("Burning credits from owner balance...");
        await new Promise((r) => setTimeout(r, 700));
        setStatusStep("Minting permanent on-chain Retirement Certificate...");
        await new Promise((r) => setTimeout(r, 800));
        txHash = `3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d${Math.floor(Math.random() * 899999 + 100000).toString(16)}`;
      } else {
        setStatusStep("Signing burn authorization with Freighter wallet...");
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
        data: { creditId, amount: numAmount.toString(), beneficiary },
        contractId: NETWORK_CONFIG.registryContractId || "CB2RETIREMENT572KC5W2G64K5R3L8O2P1Q9N0M1L2K3J4H5G6F7E8D9C0",
        txHash,
      });

      setSuccessTx({ hash: txHash, amount: numAmount, certId });
      Analytics.trackTransaction("retire", "success", numAmount);
      addToast({
        type: "success",
        title: "Credits Permanently Retired!",
        message: `${numAmount.toLocaleString()} tCO₂ permanently burned on-chain.`,
      });

      setAmount("");
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Error retiring credits via Soroban contract";
      setErrorMsg(errMsg);
      Analytics.trackTransaction("retire", "failed");
      Analytics.trackError(errMsg, "RetireForm");
      addToast({ type: "error", title: "Retirement Failed", message: errMsg });
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
            <span>Connect wallet to retire & burn credits</span>
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
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
            <span className="font-mono text-xs font-semibold">{formatAddress(address)}</span>
            <span className="text-[9px] uppercase font-bold bg-amber-500/25 px-1 py-0.5 rounded text-amber-300">
              {walletType || "Demo"}
            </span>
          </div>
          <div className="text-center text-[11px] text-amber-300 font-semibold">
            Available: {userCredits.toLocaleString()} tCO₂
          </div>
        </div>
      )}

      {/* Quick Burn Presets */}
      <div className="grid grid-cols-2 gap-1 pt-0.5">
        <button
          type="button"
          onClick={() => handleQuickRetire("250", "Corporate Scope 1 Offset")}
          className="text-[10px] py-1 px-1 text-center rounded-lg bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-500/30 text-gray-300 hover:text-amber-300 transition-colors truncate"
          title="Scope 1 (250)"
        >
          🔥 Scope 1 (250)
        </button>
        <button
          type="button"
          onClick={() => handleQuickRetire("1000", "Data Center Net-Zero")}
          className="text-[10px] py-1 px-1 text-center rounded-lg bg-white/5 hover:bg-teal-500/15 border border-white/10 hover:border-teal-500/30 text-gray-300 hover:text-teal-300 transition-colors truncate"
          title="Net-Zero (1k)"
        >
          ⚡ Net-Zero (1k)
        </button>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-400">Credit Batch ID</label>
        <Input
          required
          value={creditId}
          onChange={(e) => setCreditId(e.target.value)}
          placeholder="e.g. 1"
          className="bg-black/40 border-white/10 focus:border-amber-500/50 h-9 text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-400">Amount (Tons CO₂ to Burn)</label>
        <Input
          required
          type="number"
          min="1"
          max={userCredits > 0 ? userCredits : undefined}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="100"
          className="bg-black/40 border-white/10 focus:border-amber-500/50 h-9 text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-400">Retirement Beneficiary / Purpose</label>
        <Input
          value={beneficiary}
          onChange={(e) => setBeneficiary(e.target.value)}
          placeholder="e.g. 2026 Annual ESG Offset"
          className="bg-black/40 border-white/10 focus:border-amber-500/50 h-9 text-sm text-gray-300"
        />
      </div>

      <Button
        type="submit"
        className="w-full mt-2 bg-gradient-to-r from-amber-600 to-teal-600 hover:from-amber-500 hover:to-teal-500 text-white font-bold h-10 shadow-lg shadow-amber-500/20"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {statusStep || "Processing..."}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Flame className="w-4 h-4" />
            Burn & Retire Credits
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

      {/* Success Retirement Certificate Receipt */}
      {successTx && (
        <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs space-y-2 mt-2">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Permanent Retirement Certificate Issued!</span>
          </div>
          <div className="text-gray-300 text-[11px] space-y-1">
            <p>Burned: <b>{successTx.amount.toLocaleString()} tCO₂</b></p>
            <p className="text-amber-400 font-mono text-[10px]">Cert ID: {successTx.certId}</p>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-amber-500/20">
            <span className="font-mono text-gray-400 text-[10px]">
              Tx: {successTx.hash.slice(0, 12)}...{successTx.hash.slice(-6)}
            </span>
            <a
              href={getExplorerUrl("tx", successTx.hash)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
            >
              <span>View Certificate</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </form>
  );
}
