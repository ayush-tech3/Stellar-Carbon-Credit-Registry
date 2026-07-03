"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Activity, History, BarChart3, Settings } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Activity', href: '/activity', icon: Activity },
    { name: 'Transactions', href: '/transactions', icon: History },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-white/10 glass-card h-[calc(100vh-4rem)] sticky top-16 hidden md:flex flex-col">
      <nav className="flex-1 py-6 px-3 space-y-1 custom-scrollbar overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;
          
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive 
                  ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border-l-2 border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-500' : 'text-gray-500'}`} />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/10 bg-black/20">
        <p className="text-xs text-gray-500 text-center">
          Built on Stellar Soroban
        </p>
      </div>
    </aside>
  );
}
