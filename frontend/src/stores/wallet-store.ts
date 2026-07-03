import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NETWORK_CONFIG } from '@/lib/stellar/network';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  network: string;
  walletType: string | null;
  setAddress: (address: string | null) => void;
  setIsConnected: (isConnected: boolean) => void;
  setNetwork: (network: string) => void;
  setWalletType: (walletType: string | null) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      address: null,
      isConnected: false,
      network: NETWORK_CONFIG.network,
      walletType: null,
      setAddress: (address) => set({ address }),
      setIsConnected: (isConnected) => set({ isConnected }),
      setNetwork: (network) => set({ network }),
      setWalletType: (walletType) => set({ walletType }),
    }),
    {
      name: 'wallet-storage',
    }
  )
);
