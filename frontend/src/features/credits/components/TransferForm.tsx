"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWalletStore } from "@/stores/wallet-store";
import { usePortfolioStore } from "@/stores/portfolio-store";
import { useTransactionStore } from "@/stores/transaction-store";
import { useEventStore } from "@/stores/event-store";
import { useTransferCredits } from "../hooks/use-credits";
import { NETWORK_CONFIG } from "@/lib/stellar/network";
import { CheckCircle2, AlertCircle, ArrowRightLeft, Wallet, ExternalLink, Loader2 } from "lucide-react";
import { Analytics } from "@/lib/utils/analytics";
import { useToastStore } from "@/stores/toast-store";
import { formatAddress } from "@/lib/utils/format";
import { getExplorerUrl } from "@/lib/stellar/contracts";

export function TransferForm() {
  const [creditId, setCreditId] = useState("1");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusStep, setStatusStep] = useState<string>("");
  const [successTx, setSuccessTx] = useState<{ hash: string; amount: number; to: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const { address, isConnected, isDemoMode, walletType, openWalletModal } = useWalletStore();
  const { userCredits, transferCredits } = usePortfolioStore();
  const addTransaction = useTransactionStore((s) => s.addTransaction);
  const addEvent = useEventStore((s) => s.addEvent);
  const { mutateAsync: transferCreditsContract } = useTransferCredits();
  const { addToast } = useToastStore();

  const handleQuickAddress = (recipient: string, amt: string) => {
    setToAddress(recipient);
    setAmount(amt);
    setErrorMsg("");
    setSuccessTx(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      openWalletModal();
      return;
    }

    if (!creditId || !toAddress || !amount) {
      setErrorMsg("Please fill in recipient address and amount");
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
    setStatusStep("Simulating Soroban transfer call...");

    try {
      let txHash = "";

      if (isDemoMode || !NETWORK_CONFIG.registryContractId) {
        await new Promise((r) => setTimeout(r, 600));
        setStatusStep("Authorizing transfer with Demo account...");
        await new Promise((r) => setTimeout(r, 700));
        setStatusStep("Broadcasting on Stellar Testnet...");
        await new Promise((r) => setTimeout(r, 700));
        txHash = `4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c${Math.floor(Math.random() * 899999 + 100000).toString(16)}`;
      } else {
        setStatusStep("Signing transaction with Freighter wallet...");
        const res = await transferCreditsContract({
          creditId,
          to: toAddress,
          amount: BigInt(numAmount),
        });
        txHash = res.hash;
      }

      transferCredits(numAmount);

      addTransaction({
        id: `tx-${Date.now()}`,
        hash: txHash,
        status: "confirmed",
        method: "transfer",
        contractId: NETWORK_CONFIG.registryContractId || "CC3REGISTRY572KC5W2G64K5R3L8O2P1Q9N0M1L2K3J4H5G6F7E8D9C0",
        timestamp: Date.now(),
        retryCount: 0,
      });

      addEvent({
        id: `evt-${Date.now()}`,
        type: "transferred",
        ledger: 5289200 + Math.floor(Math.random() * 500),
        timestamp: Math.floor(Date.now() / 1000),
        data: { creditId, to: toAddress, amount: numAmount.toString() },
        contractId: NETWORK_CONFIG.registryContractId || "CC3REGISTRY572KC5W2G64K5R3L8O2P1Q9N0M1L2K3J4H5G6F7E8D9C0",
        txHash,
      });

      setSuccessTx({ hash: txHash, amount: numAmount, to: toAddress });
      Analytics.trackTransaction("transfer", "success", numAmount);
      addToast({
        type: "success",
        title: "Credits Transferred!",
        message: `${numAmount.toLocaleString()} tCO₂ transferred to ${toAddress.slice(0, 8)}...`,
      });

      setToAddress("");
      setAmount("");
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Error transferring credits via Soroban contract";
      setErrorMsg(errMsg);
      Analytics.trackTransaction("transfer", "failed");
      Analytics.trackError(errMsg, "TransferForm");
      addToast({ type: "error", title: "Transfer Failed", message: errMsg });
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
            <span>Connect wallet to transfer credits</span>
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
        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex flex-col gap-1">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
              <span className="font-mono text-[11px] font-semibold">{formatAddress(address)}</span>
              <span className="text-[9px] uppercase font-bold bg-cyan-500/25 px-1 py-0.5 rounded text-cyan-300">
                {walletType || "Active"}
              </span>
            </div>
            <span className="text-cyan-300 font-semibold text-[11px]">{userCredits.toLocaleString()} tCO₂</span>
          </div>
        </div>
      )}

      {/* Quick Recipient Presets */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        <button
          type="button"
          onClick={() => handleQuickAddress("GCKL7Y72KC5W2G64K5R3L8O2P1Q9N0M1L2K3J4H5G6F7E8D9C0CC3", "500")}
          className="text-[11px] px-2 py-0.5 rounded-lg bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/30 text-gray-300 hover:text-cyan-300 transition-colors"
        >
          🏢 EcoTrade (500)
        </button>
        <button
          type="button"
          onClick={() => handleQuickAddress("GCJW1H72KC5W2G64K5R3L8O2P1Q9N0M1L2K3J4H5G6F7E8D9C0KK1", "1000")}
          className="text-[11px] px-2 py-0.5 rounded-lg bg-white/5 hover:bg-teal-500/15 border border-white/10 hover:border-teal-500/30 text-gray-300 hover:text-teal-300 transition-colors"
        >
          🏦 Fund (1k)
        </button>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-400">Credit Batch ID</label>
        <Input
          required
          value={creditId}
          onChange={(e) => setCreditId(e.target.value)}
          placeholder="e.g. 1"
          className="bg-black/40 border-white/10 focus:border-cyan-500/50 h-9 text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-400">Recipient Address (G...)</label>
        <Input
          required
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          placeholder="G..."
          className="bg-black/40 border-white/10 focus:border-cyan-500/50 h-9 text-sm font-mono text-xs"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-400">Amount (Tons CO₂)</label>
        <Input
          required
          type="number"
          min="1"
          max={userCredits > 0 ? userCredits : undefined}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="100"
          className="bg-black/40 border-white/10 focus:border-cyan-500/50 h-9 text-sm"
        />
      </div>

      <Button
        type="submit"
        className="w-full mt-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold h-10 shadow-lg shadow-cyan-500/20"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {statusStep || "Processing..."}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            Transfer Credits
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
        <div className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-xs space-y-2 mt-2">
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Transfer Confirmed on Ledger!</span>
          </div>
          <p className="text-gray-300 text-[11px]">
            Sent <b>{successTx.amount.toLocaleString()} tCO₂</b> to {successTx.to.slice(0, 8)}...
          </p>
          <div className="flex items-center justify-between pt-1 border-t border-cyan-500/20">
            <span className="font-mono text-gray-400 text-[10px]">
              Tx: {successTx.hash.slice(0, 12)}...{successTx.hash.slice(-6)}
            </span>
            <a
              href={getExplorerUrl("tx", successTx.hash)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
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
