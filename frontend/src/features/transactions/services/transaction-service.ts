import { rpcServer } from '@/lib/stellar/client';
import { AppError } from '@/lib/utils/errors';
import * as StellarSdk from '@stellar/stellar-sdk';
import { NETWORK_CONFIG } from '@/lib/stellar/network';

export class TransactionService {
  async pollStatus(hash: string): Promise<'SUCCESS' | 'FAILED'> {
    let attempts = 0;
    while (attempts < 30) { // Max 1 minute assuming 2s per poll
      const status = await rpcServer.getTransaction(hash);
      if (status.status === 'SUCCESS') return 'SUCCESS';
      if (status.status === 'FAILED') return 'FAILED';
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }
    throw new AppError('Transaction polling timeout');
  }

  async retryTransaction(signedXdr: string): Promise<string> {
    const tx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_CONFIG.networkPassphrase);
    const response = await rpcServer.sendTransaction(tx as StellarSdk.Transaction);
    
    if (response.status === 'ERROR') {
      const respRecord = response as unknown as Record<string, unknown>;
      throw new AppError('Retry Failed', (respRecord.errorResult as string) || (respRecord.errorResultXdr as string) || 'Unknown error');
    }
    
    return response.hash;
  }
}

export const transactionService = new TransactionService();
