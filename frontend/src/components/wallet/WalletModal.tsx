"use client";

import { useWallet } from "@/lib/wallet/provider";
import { useWalletStore } from "@/stores/wallet-store";
import { Wallet, Sparkles, X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function WalletModal() {
  const { connect, connectDemo } = useWallet();
  const { isWalletModalOpen, closeWalletModal } = useWalletStore();

  return (
    <AnimatePresence>
      {isWalletModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[110] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="glass-card max-w-md w-full rounded-2xl p-6 relative border border-white/15 bg-[#0f172a]/95 shadow-2xl"
          >
            <button
              onClick={closeWalletModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Connect Wallet</h3>
                <p className="text-xs text-gray-400">Choose how to connect to CarbonTrack on Stellar</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Freighter Wallet */}
              <button
                onClick={() => {
                  closeWalletModal();
                  connect();
                }}
                className="w-full p-4 rounded-xl glass-card border border-emerald-500/30 hover:border-emerald-400 bg-emerald-950/30 hover:bg-emerald-900/40 flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-emerald-300">Freighter Wallet</div>
                    <div className="text-xs text-gray-400">Official Stellar Soroban browser extension</div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                  Recommended
                </span>
              </button>

              {/* 1-Click Demo Wallet */}
              <button
                onClick={() => {
                  closeWalletModal();
                  connectDemo();
                }}
                className="w-full p-4 rounded-xl glass-card border border-white/10 hover:border-teal-500/50 bg-white/5 hover:bg-teal-950/30 flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-teal-300">1-Click Demo Wallet</div>
                    <div className="text-xs text-gray-400">Instant testnet account: GBCT...LQQ4</div>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-teal-400 bg-teal-500/10 px-2 py-1 rounded">
                  Instant Test
                </span>
              </button>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Stellar Testnet • Cryptographically secure</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
