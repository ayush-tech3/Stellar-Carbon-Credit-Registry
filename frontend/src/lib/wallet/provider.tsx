"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { isConnected, isAllowed, setAllowed, requestAccess, getAddress, signTransaction as freighterSignTx } from '@stellar/freighter-api';
import { NETWORK_CONFIG } from '../stellar/network';
import { useWalletStore } from '@/stores/wallet-store';
import { Analytics } from '../utils/analytics';

interface WalletContextType {
  connect: () => Promise<void>;
  connectDemo: () => void;
  disconnect: () => void;
  signTransaction: (xdr: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { address, isDemoMode, setAddress, setIsConnected, setIsDemoMode, setWalletType, connectDemoWallet } = useWalletStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    if (isDemoMode && address) return;
    const checkConnection = async () => {
      try {
        if (address && await isConnected() && await isAllowed()) {
          const res = (await getAddress()) as unknown as { address?: string } | string | null;
          const pubKey = typeof res === 'object' && res !== null ? res.address : (typeof res === 'string' ? res : null);
          if (pubKey) {
            setAddress(pubKey);
            setIsConnected(true);
            setWalletType('freighter');
          } else {
            setAddress(null);
            setIsConnected(false);
            setWalletType(null);
          }
        }
      } catch (err) {
        console.warn("Wallet check error:", err);
      }
    };
    checkConnection();
  }, [address, isDemoMode, setAddress, setIsConnected, setWalletType]);

  const connect = async () => {
    try {
      if (await isConnected()) {
        try {
          await setAllowed();
        } catch {
          // Ignore if setAllowed is already granted or unsupported
        }
        const res = (await requestAccess()) as unknown as { address?: string } | string | null;
        const pubKey = typeof res === 'object' && res !== null ? res.address : (typeof res === 'string' ? res : null);
        if (pubKey) {
          setAddress(pubKey);
          setIsConnected(true);
          setIsDemoMode(false);
          setWalletType('freighter');
          Analytics.trackWalletConnect(pubKey, 'freighter');
        }
      } else {
        // Fallback to Demo mode if extension is missing, or open link
        connectDemo();
      }
    } catch (error) {
      console.error("Failed to connect wallet", error);
      connectDemo();
    }
  };

  const connectDemo = () => {
    connectDemoWallet();
    Analytics.trackWalletConnect('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', 'demo');
  };

  const disconnect = () => {
    if (address) Analytics.trackWalletDisconnect(address);
    setAddress(null);
    setIsConnected(false);
    setIsDemoMode(false);
    setWalletType(null);
  };

  const signTransaction = async (xdr: string): Promise<string> => {
    if (!address) throw new Error("Wallet not connected");
    if (isDemoMode) {
      return "AAAAAGDEMO_SIGNED_TRANSACTION_XDR";
    }
    const result = await freighterSignTx(xdr, { networkPassphrase: NETWORK_CONFIG.networkPassphrase });
    if (result.error) {
      throw new Error(result.error);
    }
    return result.signedTxXdr;
  };

  return (
    <WalletContext.Provider value={{ connect, connectDemo, disconnect, signTransaction }}>
      {isMounted ? children : null}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
