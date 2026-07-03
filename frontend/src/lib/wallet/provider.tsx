"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { isConnected, requestAccess, getPublicKey, signTransaction as freighterSignTx } from '@stellar/freighter-api';
import { NETWORK_CONFIG } from '../stellar/network';
import { useWalletStore } from '@/stores/wallet-store';

interface WalletContextType {
  connect: () => Promise<void>;
  disconnect: () => void;
  signTransaction: (xdr: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { address, setAddress, setIsConnected, setWalletType } = useWalletStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkConnection = async () => {
      if (address && await isConnected()) {
        const pubKey = await getPublicKey();
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
    };
    checkConnection();
  }, [address, setAddress, setIsConnected, setWalletType]);

  const connect = async () => {
    if (await isConnected()) {
      try {
        const pubKey = await requestAccess();
        if (pubKey) {
          setAddress(pubKey);
          setIsConnected(true);
          setWalletType('freighter');
        }
      } catch (error) {
        console.error("Failed to connect wallet", error);
      }
    } else {
      window.open('https://freighter.app/', '_blank');
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setWalletType(null);
  };

  const signTransaction = async (xdr: string): Promise<string> => {
    if (!address) throw new Error("Wallet not connected");
    const result = await freighterSignTx(xdr, { network: NETWORK_CONFIG.network === 'testnet' ? 'TESTNET' : 'PUBLIC' });
    if (result.error) {
      throw new Error(result.error);
    }
    return result.signedTxXdr;
  };

  if (!isMounted) return <>{children}</>;

  return (
    <WalletContext.Provider value={{ connect, disconnect, signTransaction }}>
      {children}
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
