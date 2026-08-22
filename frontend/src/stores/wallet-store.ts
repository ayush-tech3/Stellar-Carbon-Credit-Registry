import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NETWORK_CONFIG } from '@/lib/stellar/network';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isDemoMode: boolean;
  network: string;
  walletType: string | null;
  setAddress: (address: string | null) => void;
  setIsConnected: (isConnected: boolean) => void;
  setIsDemoMode: (isDemoMode: boolean) => void;
  setNetwork: (network: string) => void;
  setWalletType: (walletType: string | null) => void;
  connectDemoWallet: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      address: null,
      isConnected: false,
      isDemoMode: false,
      network: NETWORK_CONFIG.network,
      walletType: null,
      setAddress: (address) => set({ address }),
      setIsConnected: (isConnected) => set({ isConnected }),
      setIsDemoMode: (isDemoMode) => set({ isDemoMode }),
      setNetwork: (network) => set({ network }),
      setWalletType: (walletType) => set({ walletType }),
      connectDemoWallet: () =>
        set({
          address: "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
          isConnected: true,
          isDemoMode: true,
          walletType: "demo",
        }),
    }),
    {
      name: 'wallet-storage',
    }
  )
);

