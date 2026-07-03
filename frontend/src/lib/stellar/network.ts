export const NETWORK_CONFIG = {
  rpcUrl: process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org',
  networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
  network: process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'testnet',
  explorerUrl: process.env.NEXT_PUBLIC_STELLAR_EXPLORER_URL || 'https://stellar.expert/explorer/testnet',
  registryContractId: process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ID || '',
  retirementContractId: process.env.NEXT_PUBLIC_RETIREMENT_CONTRACT_ID || '',
  eventPollInterval: parseInt(process.env.NEXT_PUBLIC_EVENT_POLL_INTERVAL_MS || '5000'),
};
