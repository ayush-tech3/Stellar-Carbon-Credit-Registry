"use client";

import { useWallet } from "@/lib/wallet/provider";
import { useWalletStore } from "@/stores/wallet-store";
import { formatAddress } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";
import { getExplorerUrl } from "@/lib/stellar/contracts";

export function WalletButton() {
  const { connect, disconnect } = useWallet();
  const { address, isConnected, network } = useWalletStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!isConnected || !address) {
    return (
      <Button 
        onClick={() => connect()} 
        className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded-full"
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button 
        variant="outline"
        onClick={() => setIsOpen(!isOpen)} 
        className="bg-white/5 border-white/10 hover:bg-white/10 text-emerald-400 gap-2 rounded-full"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-glow"></div>
        {formatAddress(address)}
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 glass-card rounded-xl border border-white/10 overflow-hidden z-50">
          <div className="p-3 border-b border-white/10 bg-white/5">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Network</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-medium text-gray-200 capitalize">{network}</span>
            </div>
          </div>
          
          <div className="p-1">
            <a 
              href={getExplorerUrl('account', address)} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-emerald-400 hover:bg-white/5 rounded-md transition-colors w-full text-left"
            >
              <ExternalLink className="w-4 h-4" />
              View on Explorer
            </a>
            
            <button 
              onClick={() => {
                disconnect();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md transition-colors w-full text-left mt-1"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
