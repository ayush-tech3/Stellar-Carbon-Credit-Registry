"use client";


import { useSettingsStore } from "@/stores/settings-store";
import { NETWORK_CONFIG } from "@/lib/stellar/network";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const { network, explorerUrl } = useSettingsStore();

  return (

      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">
            Configure your app preferences and network settings.
          </p>
        </div>

        <div className="glass-card rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-4">
            Network Configuration
          </h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Current Network</label>
              <Input disabled value={network} className="bg-white/5 opacity-70" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">RPC Endpoint</label>
              <Input disabled value={NETWORK_CONFIG.rpcUrl} className="bg-white/5 opacity-70" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Explorer URL</label>
              <Input disabled value={explorerUrl} className="bg-white/5 opacity-70" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-4">
            Smart Contracts
          </h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Carbon Credit Registry</label>
              <Input disabled value={NETWORK_CONFIG.registryContractId || "Not deployed"} className="font-mono text-sm bg-white/5 opacity-70" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Retirement Manager</label>
              <Input disabled value={NETWORK_CONFIG.retirementContractId || "Not deployed"} className="font-mono text-sm bg-white/5 opacity-70" />
            </div>
          </div>
        </div>
      </div>

  );
}
