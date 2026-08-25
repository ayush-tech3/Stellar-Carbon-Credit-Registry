"use client";

import Link from "next/link";
import { WalletButton } from "../wallet/WalletButton";
import { Menu } from "lucide-react";
import { useState } from "react";
import { MobileSidebar } from "./Sidebar";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-card border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="text-2xl">🌿</span>
            <Link href="/" className="font-bold text-xl tracking-tight text-white flex items-center">
              Carbon<span className="text-emerald-500">Track</span>
            </Link>
            <span className="ml-4 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/30 hidden sm:inline-block">
              Testnet
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/docs/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all flex items-center gap-1.5"
            >
              <span>📖</span>
              <span>Docs</span>
            </Link>
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
