import { rpcServer } from './client';
import { NETWORK_CONFIG } from './network';
import * as StellarSdk from '@stellar/stellar-sdk';
import { assembleTransaction } from '@stellar/stellar-sdk/rpc';
import { AppError } from '../utils/errors';

export async function buildTransaction(
  publicKey: string,
  contractId: string,
  method: string,
  args: StellarSdk.xdr.ScVal[]
) {
  const account = await rpcServer.getAccount(publicKey);
  const contract = new StellarSdk.Contract(contractId);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_CONFIG.networkPassphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  return tx;
}

export async function simulateAndAssemble(tx: StellarSdk.Transaction) {
  const simulation = await rpcServer.simulateTransaction(tx);
  
  if (StellarSdk.rpc.Api.isSimulationError(simulation)) {
    throw new AppError('Simulation Failed', simulation.error);
  }
  
  return assembleTransaction(tx, simulation as StellarSdk.rpc.Api.SimulateTransactionSuccessResponse).build();
}

export async function submitTransaction(signedXdr: string) {
  const tx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_CONFIG.networkPassphrase);
  const response = await rpcServer.sendTransaction(tx as StellarSdk.Transaction);
  
  if (response.status === 'ERROR') {
    const respRecord = response as unknown as Record<string, unknown>;
    throw new AppError('Submission Failed', (respRecord.errorResult as string) || (respRecord.errorResultXdr as string) || 'Unknown error');
  }
  
  return response;
}

export async function pollTransactionResult(hash: string) {
  let status = await rpcServer.getTransaction(hash);
  while (status.status === 'NOT_FOUND') {
    await new Promise(resolve => setTimeout(resolve, 2000));
    status = await rpcServer.getTransaction(hash);
  }
  return status;
}

export function getExplorerUrl(type: 'tx' | 'contract' | 'account', id: string) {
  return `${NETWORK_CONFIG.explorerUrl}/${type}/${id}`;
}
