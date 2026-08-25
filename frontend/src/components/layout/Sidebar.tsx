"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Activity, History, BarChart3, Settings, Monitor, BookOpen } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Activity', href: '/activity', icon: Activity },
    { name: 'Transactions', href: '/transactions', icon: History },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Monitoring', href: '/monitoring', icon: Monitor },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Documentation', href: '/docs/', icon: BookOpen, isExternal: true },
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
              target={link.isExternal ? "_blank" : undefined}
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

// Mobile sidebar overlay
export function MobileSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Activity', href: '/activity', icon: Activity },
    { name: 'Transactions', href: '/transactions', icon: History },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Monitoring', href: '/monitoring', icon: Monitor },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Documentation', href: '/docs/', icon: BookOpen, isExternal: true },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Slide-in Panel */}
      <div className="absolute left-0 top-0 bottom-0 w-72 glass-card border-r border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
        <div className="p-4 border-b border-white/10 flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="font-bold text-lg text-white">
            Carbon<span className="text-emerald-500">Track</span>
          </span>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;
            
            return (
              <Link 
                key={link.name} 
                href={link.href}
                target={link.isExternal ? "_blank" : undefined}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
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
      </div>
    </div>
  );
}

// Bottom mobile navigation bar
export function MobileBottomNav() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Activity', href: '/activity', icon: Activity },
    { name: 'Txns', href: '/transactions', icon: History },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-card border-t border-white/10 safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-1">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all min-w-[48px] ${
                isActive
                  ? 'text-emerald-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-500' : ''}`} />
              <span className="text-[10px] font-medium">{link.name}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
