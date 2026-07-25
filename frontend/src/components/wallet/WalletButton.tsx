"use client";

import { useWallet } from "@/lib/wallet/provider";
import { useWalletStore } from "@/stores/wallet-store";
import { formatAddress } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, ChevronDown, ExternalLink, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { getExplorerUrl } from "@/lib/stellar/contracts";

export function WalletButton() {
  const { connect, connectDemo, disconnect } = useWallet();
  const { address, isConnected, network, walletType } = useWalletStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (!isConnected || !address) {
    return (
      <>
        <Button 
          onClick={() => setShowModal(true)} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded-full font-medium"
        >
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </Button>

        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card max-w-md w-full rounded-2xl p-6 relative border border-white/10 shadow-2xl">
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Connect Wallet</h3>
                  <p className="text-xs text-gray-400">Select how you want to interact with CarbonTrack</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    connect();
                  }}
                  className="w-full p-4 rounded-xl glass-card border border-emerald-500/30 hover:border-emerald-500 bg-emerald-950/20 hover:bg-emerald-900/30 flex items-center justify-between text-left transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-emerald-300">Freighter Wallet</div>
                      <div className="text-xs text-gray-400">Stellar Soroban Browser Extension</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded">Recommended</span>
                </button>

                <button
                  onClick={() => {
                    setShowModal(false);
                    connectDemo();
                  }}
                  className="w-full p-4 rounded-xl glass-card border border-white/10 hover:border-teal-500/50 bg-white/5 hover:bg-teal-950/20 flex items-center justify-between text-left transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-teal-300">Demo Wallet (Instant)</div>
                      <div className="text-xs text-gray-400">Test account: GBCT...LQQ4</div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-teal-400">1-Click Test</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </>
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
        {walletType === 'demo' && <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded uppercase font-semibold">Demo</span>}
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
