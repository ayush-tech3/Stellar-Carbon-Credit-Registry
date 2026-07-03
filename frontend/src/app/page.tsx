"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Leaf, ArrowRightLeft, Flame, ArrowRight, ShieldCheck, Globe, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 md:pt-40 md:pb-28">
          <div className="container mx-auto text-center z-10 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium text-sm border border-emerald-500/20 inline-block mb-6">
                Built on Stellar Soroban
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                Transparent <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  Carbon Credit Registry
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                A tamper-proof ledger for issuing, transferring, and retiring carbon credits. Double-spending is cryptographically impossible.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 bg-emerald-600 hover:bg-emerald-700">
                    Launch App <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <a href="https://github.com/ayush-tech3/Stellar-Carbon-Credit-Registry" target="_blank" rel="noreferrer">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 border-white/20 bg-white/5 hover:bg-white/10">
                    View GitHub
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-black/20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Capabilities</h2>
              <p className="text-gray-400">Smart contracts that handle the entire carbon credit lifecycle.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                whileHover={{ y: -5 }}
                className="glass-card p-8 rounded-2xl border border-emerald-500/20 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                  <Leaf className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Issue</h3>
                <p className="text-gray-400">
                  Verified organizations mint new carbon credits from real projects. Every batch is traceable on-chain.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="glass-card p-8 rounded-2xl border border-blue-500/20 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <ArrowRightLeft className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Transfer</h3>
                <p className="text-gray-400">
                  Companies securely buy and sell credits. Balances are atomically updated to prevent double-spending.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="glass-card p-8 rounded-2xl border border-amber-500/20 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
                <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6">
                  <Flame className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Retire</h3>
                <p className="text-gray-400">
                  Permanently burn credits to claim offsets. A cross-contract call records the retirement immutably.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Why Stellar Section */}
        <section className="py-24 px-4 relative">
          <div className="container mx-auto max-w-5xl text-center">
             <h2 className="text-3xl md:text-4xl font-bold mb-16">Why Stellar Soroban?</h2>
             
             <div className="grid md:grid-cols-3 gap-12">
               <div>
                  <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Secure Rust Contracts</h4>
                  <p className="text-gray-400 text-sm">Built with Rust for memory safety and zero-cost abstractions.</p>
               </div>
               <div>
                  <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Zap className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">High Performance</h4>
                  <p className="text-gray-400 text-sm">Lightning fast finality (3-5 seconds) and minimal fees.</p>
               </div>
               <div>
                  <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Globe className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Eco-Friendly</h4>
                  <p className="text-gray-400 text-sm">Stellar uses SCP, avoiding the massive energy consumption of PoW chains.</p>
               </div>
             </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm relative z-10 bg-black/40">
        <p>© 2026 CarbonTrack. Built for a sustainable future on Stellar.</p>
      </footer>
    </div>
  );
}
