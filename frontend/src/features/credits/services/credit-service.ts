import { nativeToScVal, scValToNative, Address } from '@stellar/stellar-sdk';
import { NETWORK_CONFIG } from '@/lib/stellar/network';
import { buildTransaction, simulateAndAssemble, submitTransaction } from '@/lib/stellar/contracts';
import { IssueCreditsParams, TransferParams, CreditBatch } from '../types';
import { rpcServer } from '@/lib/stellar/client';

export class CreditService {
  private contractId = NETWORK_CONFIG.registryContractId;

  async issueCredits(
    params: IssueCreditsParams,
    publicKey: string,
    signTx: (xdr: string) => Promise<string>
  ) {
    if (!this.contractId) throw new Error("Registry contract ID not configured");

    const args = [
      new Address(publicKey).toScVal(),
      nativeToScVal(params.project, { type: 'string' }),
      nativeToScVal(params.amount, { type: 'i128' }),
      nativeToScVal(params.vintageYear, { type: 'u32' }),
      nativeToScVal(params.methodology, { type: 'string' }),
    ];

    const tx = await buildTransaction(publicKey, this.contractId, 'issue_credits', args);
    const assembledTx = await simulateAndAssemble(tx);
    const signedXdr = await signTx(assembledTx.toXDR());
    return await submitTransaction(signedXdr);
  }

  async transferCredits(
    params: TransferParams,
    publicKey: string,
    signTx: (xdr: string) => Promise<string>
  ) {
    if (!this.contractId) throw new Error("Registry contract ID not configured");

    const args = [
      new Address(publicKey).toScVal(),
      new Address(params.to).toScVal(),
      nativeToScVal(BigInt(params.creditId), { type: 'u64' }),
      nativeToScVal(params.amount, { type: 'i128' }),
    ];

    const tx = await buildTransaction(publicKey, this.contractId, 'transfer', args);
    const assembledTx = await simulateAndAssemble(tx);
    const signedXdr = await signTx(assembledTx.toXDR());
    return await submitTransaction(signedXdr);
  }

  // View functions wouldn't require a signature, but in Soroban currently we simulate
  // to get the return value of view functions for free.
  async getCredit(creditId: string): Promise<CreditBatch> {
      // NOTE: A real implementation would parse the contract storage or simulate a read
      // Since this is a view we can simulate
      // For this hackathon scope we might mock or actually implement the simulation read
      throw new Error("Not implemented yet");
  }

  async getBalance(owner: string, creditId: string): Promise<bigint> {
      throw new Error("Not implemented yet");
  }
}

export const creditService = new CreditService();
