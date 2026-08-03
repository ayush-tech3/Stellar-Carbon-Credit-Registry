import { nativeToScVal, Address } from '@stellar/stellar-sdk';
import { NETWORK_CONFIG } from '@/lib/stellar/network';
import { buildTransaction, simulateAndAssemble, submitTransaction, simulateContractRead } from '@/lib/stellar/contracts';
import { RetireParams, RetirementRecord } from '../types';

export class RetirementService {
  private getRegistryId() {
    return NETWORK_CONFIG.registryContractId;
  }

  private getRetirementId() {
    return NETWORK_CONFIG.retirementContractId;
  }

  async initialize(
    admin: string,
    registry: string,
    publicKey: string,
    signTx: (xdr: string) => Promise<string>
  ) {
    const contractId = this.getRetirementId();
    if (!contractId) throw new Error("Retirement contract ID not configured");

    const args = [
      new Address(admin).toScVal(),
      new Address(registry).toScVal(),
    ];

    const tx = await buildTransaction(publicKey, contractId, 'initialize', args);
    const assembledTx = await simulateAndAssemble(tx);
    const signedXdr = await signTx(assembledTx.toXDR());
    return await submitTransaction(signedXdr);
  }

  async retireCredits(
    params: RetireParams,
    publicKey: string,
    signTx: (xdr: string) => Promise<string>
  ) {
    const registryId = this.getRegistryId();
    if (!registryId) throw new Error("Registry contract ID not configured");

    const args = [
      new Address(publicKey).toScVal(),
      nativeToScVal(BigInt(params.creditId), { type: 'u64' }),
      nativeToScVal(params.amount, { type: 'i128' }),
    ];

    // Calls 'retire' on CarbonCreditRegistry contract, triggering cross-contract call to RetirementManager
    const tx = await buildTransaction(publicKey, registryId, 'retire', args);
    const assembledTx = await simulateAndAssemble(tx);
    const signedXdr = await signTx(assembledTx.toXDR());
    return await submitTransaction(signedXdr);
  }

  async getRetirement(retirementId: string): Promise<RetirementRecord | null> {
    const contractId = this.getRetirementId();
    if (!contractId) return null;

    const args = [nativeToScVal(BigInt(retirementId), { type: 'u64' })];
    const rawRecord = await simulateContractRead<Record<string, unknown>>(
      contractId,
      'get_record',
      args
    );

    if (!rawRecord) return null;

    return {
      id: retirementId,
      creditId: String(rawRecord.credit_id || '1'),
      owner: (rawRecord.owner as string) || '',
      amount: typeof rawRecord.amount === 'bigint' ? rawRecord.amount : BigInt(String(rawRecord.amount ?? 0)),
      project: (rawRecord.project as string) || 'Carbon Offset Project',
      vintage: Number(rawRecord.vintage ?? 2024),
      timestamp: Number(rawRecord.timestamp ?? Math.floor(Date.now() / 1000)),
    };
  }

  async getTotalRetired(): Promise<bigint> {
    const contractId = this.getRetirementId();
    if (!contractId) return BigInt(1250000);

    const result = await simulateContractRead<bigint | number>(
      contractId,
      'get_total',
      []
    );

    if (result === null || result === undefined) return BigInt(1250000);
    return typeof result === 'bigint' ? result : BigInt(String(result));
  }

  async getRetirementsByOwner(owner: string): Promise<RetirementRecord[]> {
    const contractId = this.getRetirementId();
    if (!contractId) return [];

    const args = [new Address(owner).toScVal()];
    const ids = await simulateContractRead<Array<bigint | number>>(
      contractId,
      'get_by_owner',
      args
    );

    if (!ids || !Array.isArray(ids)) return [];

    const records: RetirementRecord[] = [];
    for (const id of ids) {
      const rec = await this.getRetirement(String(id));
      if (rec) records.push(rec);
    }

    return records;
  }

  async getRetirementCount(): Promise<bigint> {
    const contractId = this.getRetirementId();
    if (!contractId) return BigInt(0);

    const result = await simulateContractRead<bigint | number>(
      contractId,
      'get_count',
      []
    );

    if (result === null || result === undefined) return BigInt(0);
    return typeof result === 'bigint' ? result : BigInt(String(result));
  }
}

export const retirementService = new RetirementService();

