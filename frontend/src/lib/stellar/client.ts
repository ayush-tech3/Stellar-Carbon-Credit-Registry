import * as StellarSdk from '@stellar/stellar-sdk';
import { NETWORK_CONFIG } from './network';

export const rpcServer = new StellarSdk.rpc.Server(NETWORK_CONFIG.rpcUrl);
