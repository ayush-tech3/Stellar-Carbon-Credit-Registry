import { useTransactionStore } from '@/stores/transaction-store';
import { transactionService } from '../services/transaction-service';
import { useCallback } from 'react';
import { TrackedTransaction } from '../types';

export function useTransactions() {
  const { transactions, addTransaction, updateTransaction } = useTransactionStore();

  const trackTransaction = useCallback((tx: TrackedTransaction) => {
    addTransaction(tx);
    
    if (tx.status === 'processing') {
      // Start polling
      transactionService.pollStatus(tx.hash)
        .then(status => {
          updateTransaction(tx.id, { 
            status: status === 'SUCCESS' ? 'confirmed' : 'failed' 
          });
        })
        .catch(err => {
          updateTransaction(tx.id, { 
            status: 'failed', 
            error: err.message 
          });
        });
    }
  }, [addTransaction, updateTransaction]);

  return {
    transactions,
    trackTransaction,
  };
}
