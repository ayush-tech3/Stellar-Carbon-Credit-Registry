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
