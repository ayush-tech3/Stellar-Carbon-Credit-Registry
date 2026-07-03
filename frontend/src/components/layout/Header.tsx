import Link from "next/link";
import { WalletButton } from "../wallet/WalletButton";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <Link href="/" className="font-bold text-xl tracking-tight text-white flex items-center">
            Carbon<span className="text-emerald-500">Track</span>
          </Link>
          <span className="ml-4 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/30">
            Testnet
          </span>
        </div>

        <div className="flex items-center gap-4">
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
