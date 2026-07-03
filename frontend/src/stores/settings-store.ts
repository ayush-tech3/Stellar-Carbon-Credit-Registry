import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NETWORK_CONFIG } from '@/lib/stellar/network';

interface SettingsState {
  theme: 'dark' | 'light';
  network: string;
  explorerUrl: string;
  notificationsEnabled: boolean;
  setTheme: (theme: 'dark' | 'light') => void;
  setNetwork: (network: string) => void;
  setExplorerUrl: (url: string) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      network: NETWORK_CONFIG.network,
      explorerUrl: NETWORK_CONFIG.explorerUrl,
      notificationsEnabled: true,
      setTheme: (theme) => set({ theme }),
      setNetwork: (network) => set({ network }),
      setExplorerUrl: (explorerUrl) => set({ explorerUrl }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
