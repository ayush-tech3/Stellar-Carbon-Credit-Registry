import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NETWORK_CONFIG } from '@/lib/stellar/network';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isDemoMode: boolean;
  network: string;
  walletType: string | null;
  isWalletModalOpen: boolean;
  setAddress: (address: string | null) => void;
  setIsConnected: (isConnected: boolean) => void;
  setIsDemoMode: (isDemoMode: boolean) => void;
  setNetwork: (network: string) => void;
  setWalletType: (walletType: string | null) => void;
  openWalletModal: () => void;
  closeWalletModal: () => void;
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
      isWalletModalOpen: false,
      setAddress: (address) => set({ address }),
      setIsConnected: (isConnected) => set({ isConnected }),
      setIsDemoMode: (isDemoMode) => set({ isDemoMode }),
      setNetwork: (network) => set({ network }),
      setWalletType: (walletType) => set({ walletType }),
      openWalletModal: () => set({ isWalletModalOpen: true }),
      closeWalletModal: () => set({ isWalletModalOpen: false }),
      connectDemoWallet: () =>
        set({
          address: "GBCT4V72KC5W2G64K5R3L8O2P1Q9N0M1L2K3J4H5G6F7E8D9C0LQQ4",
          isConnected: true,
          isDemoMode: true,
          walletType: "demo",
          isWalletModalOpen: false,
        }),
    }),
    {
      name: 'wallet-storage',
    }
  )
);
