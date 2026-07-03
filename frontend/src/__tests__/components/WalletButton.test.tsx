import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WalletButton } from '@/components/wallet/WalletButton';
import { WalletProvider } from '@/lib/wallet/provider';

// Mock the Zustand store
vi.mock('@/stores/wallet-store', () => ({
  useWalletStore: () => ({
    address: null,
    isConnected: false,
    network: 'testnet',
  })
}));

describe('WalletButton', () => {
  it('renders connect button when disconnected', () => {
    render(
      <WalletProvider>
        <WalletButton />
      </WalletProvider>
    );
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });
});
