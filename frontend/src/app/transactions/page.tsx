"use client";

import { TransactionCenter } from "@/features/transactions/components/TransactionCenter";
import { WalletProvider } from "@/lib/wallet/provider";

export default function TransactionsPage() {
  return (
    <WalletProvider>
      <div className="max-w-5xl mx-auto">
        <TransactionCenter />
      </div>
    </WalletProvider>
  );
}
