import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_TRANSACTIONS } from '@/features/transactions/data/initial-transactions';

export type TransactionStatus = 'pending' | 'processing' | 'confirmed' | 'failed';

export interface TrackedTransaction {
  id: string;
  hash: string;
  status: TransactionStatus;
  method: string;
  contractId: string;
  timestamp: number;
  error?: string;
  retryCount: number;
}

interface TransactionState {
  transactions: TrackedTransaction[];
  addTransaction: (tx: TrackedTransaction) => void;
  updateTransaction: (id: string, updates: Partial<TrackedTransaction>) => void;
  clearTransactions: () => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: INITIAL_TRANSACTIONS,
      addTransaction: (tx) =>
        set((state) => ({ transactions: [tx, ...state.transactions] })),
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updates } : tx
          ),
        })),
      clearTransactions: () => set({ transactions: INITIAL_TRANSACTIONS }),
    }),
    {
      name: 'tx-storage',
    }
  )
);
