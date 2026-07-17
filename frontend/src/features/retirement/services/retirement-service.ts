import { nativeToScVal, Address } from '@stellar/stellar-sdk';
import { NETWORK_CONFIG } from '@/lib/stellar/network';
import { buildTransaction, simulateAndAssemble, submitTransaction } from '@/lib/stellar/contracts';
import { RetireParams, RetirementRecord } from '../types';

export class RetirementService {
  private registryId = NETWORK_CONFIG.registryContractId;
  private retirementId = NETWORK_CONFIG.retirementContractId;

  async retireCredits(
    params: RetireParams,
    publicKey: string,
    signTx: (xdr: string) => Promise<string>
  ) {
    if (!this.registryId) throw new Error("Registry contract ID not configured");

    const args = [
      new Address(publicKey).toScVal(),
      nativeToScVal(BigInt(params.creditId), { type: 'u64' }),
      nativeToScVal(params.amount, { type: 'i128' }),
    ];

    // Note: We call retire on the registry contract, which handles the cross-contract call
    const tx = await buildTransaction(publicKey, this.registryId, 'retire', args);
    const assembledTx = await simulateAndAssemble(tx);
    const signedXdr = await signTx(assembledTx.toXDR());
    return await submitTransaction(signedXdr);
  }

  async getRetirement(_retirementId: string): Promise<RetirementRecord> {
    throw new Error("Not implemented yet");
  }

  async getTotalRetired(): Promise<bigint> {
    // Mock for hackathon UI purposes
    return BigInt(1250000); 
  }

  async getRetirementsByOwner(_owner: string): Promise<RetirementRecord[]> {
    throw new Error("Not implemented yet");
  }
}

export const retirementService = new RetirementService();
