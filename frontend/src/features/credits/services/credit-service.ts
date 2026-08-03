import { nativeToScVal, Address } from '@stellar/stellar-sdk';
import { NETWORK_CONFIG } from '@/lib/stellar/network';
import { buildTransaction, simulateAndAssemble, submitTransaction, simulateContractRead } from '@/lib/stellar/contracts';
import { IssueCreditsParams, TransferParams, CreditBatch } from '../types';

export class CreditService {
  private getContractId() {
    return NETWORK_CONFIG.registryContractId;
  }

  async initialize(
    admin: string,
    retireCtr: string,
    publicKey: string,
    signTx: (xdr: string) => Promise<string>
  ) {
    const contractId = this.getContractId();
    if (!contractId) throw new Error("Registry contract ID not configured");

    const args = [
      new Address(admin).toScVal(),
      new Address(retireCtr).toScVal(),
    ];

    const tx = await buildTransaction(publicKey, contractId, 'initialize', args);
    const assembledTx = await simulateAndAssemble(tx);
    const signedXdr = await signTx(assembledTx.toXDR());
    return await submitTransaction(signedXdr);
  }

  async addIssuer(
    issuer: string,
    publicKey: string,
    signTx: (xdr: string) => Promise<string>
  ) {
    const contractId = this.getContractId();
    if (!contractId) throw new Error("Registry contract ID not configured");

    const args = [new Address(issuer).toScVal()];
    const tx = await buildTransaction(publicKey, contractId, 'add_issuer', args);
    const assembledTx = await simulateAndAssemble(tx);
    const signedXdr = await signTx(assembledTx.toXDR());
    return await submitTransaction(signedXdr);
  }

  async removeIssuer(
    issuer: string,
    publicKey: string,
    signTx: (xdr: string) => Promise<string>
  ) {
    const contractId = this.getContractId();
    if (!contractId) throw new Error("Registry contract ID not configured");

    const args = [new Address(issuer).toScVal()];
    const tx = await buildTransaction(publicKey, contractId, 'remove_issuer', args);
    const assembledTx = await simulateAndAssemble(tx);
    const signedXdr = await signTx(assembledTx.toXDR());
    return await submitTransaction(signedXdr);
  }

  async issueCredits(
    params: IssueCreditsParams,
    publicKey: string,
    signTx: (xdr: string) => Promise<string>
  ) {
    const contractId = this.getContractId();
    if (!contractId) throw new Error("Registry contract ID not configured");

    const args = [
      new Address(publicKey).toScVal(),
      nativeToScVal(params.project, { type: 'string' }),
      nativeToScVal(params.amount, { type: 'i128' }),
      nativeToScVal(params.vintageYear, { type: 'u32' }),
      nativeToScVal(params.methodology, { type: 'string' }),
    ];

    const tx = await buildTransaction(publicKey, contractId, 'issue_credits', args);
    const assembledTx = await simulateAndAssemble(tx);
    const signedXdr = await signTx(assembledTx.toXDR());
    return await submitTransaction(signedXdr);
  }

  async transferCredits(
    params: TransferParams,
    publicKey: string,
    signTx: (xdr: string) => Promise<string>
  ) {
    const contractId = this.getContractId();
    if (!contractId) throw new Error("Registry contract ID not configured");

    const args = [
      new Address(publicKey).toScVal(),
      new Address(params.to).toScVal(),
      nativeToScVal(BigInt(params.creditId), { type: 'u64' }),
      nativeToScVal(params.amount, { type: 'i128' }),
    ];

    const tx = await buildTransaction(publicKey, contractId, 'transfer', args);
    const assembledTx = await simulateAndAssemble(tx);
    const signedXdr = await signTx(assembledTx.toXDR());
    return await submitTransaction(signedXdr);
  }

  async getCredit(creditId: string): Promise<CreditBatch | null> {
    const contractId = this.getContractId();
    if (!contractId) return null;

    const args = [nativeToScVal(BigInt(creditId), { type: 'u64' })];
    const rawResult = await simulateContractRead<Record<string, unknown>>(
      contractId,
      'get_credit',
      args
    );

    if (!rawResult) return null;

    return {
      id: creditId,
      issuer: (rawResult.issuer as string) || '',
      project: (rawResult.project as string) || 'Unknown Project',
      amount: typeof rawResult.amount === 'bigint' ? rawResult.amount : BigInt(String(rawResult.amount ?? 0)),
      retired: typeof rawResult.retired === 'bigint' ? rawResult.retired : BigInt(String(rawResult.retired ?? 0)),
      vintage: Number(rawResult.vintage ?? 2024),
      methodology: (rawResult.method as string) || 'VCS VM0015',
      active: rawResult.active !== false,
    };
  }

  async getBalance(owner: string, creditId: string): Promise<bigint> {
    const contractId = this.getContractId();
    if (!contractId) return BigInt(0);

    const args = [
      new Address(owner).toScVal(),
      nativeToScVal(BigInt(creditId), { type: 'u64' }),
    ];

    const result = await simulateContractRead<bigint | number>(
      contractId,
      'get_balance',
      args
    );

    if (result === null || result === undefined) return BigInt(0);
    return typeof result === 'bigint' ? result : BigInt(String(result));
  }
}

export const creditService = new CreditService();

