import { TrackedTransaction } from "@/stores/transaction-store";

export const INITIAL_TRANSACTIONS: TrackedTransaction[] = [
  {
    id: "tx-1",
    hash: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    status: "confirmed",
    method: "issue_credits",
    contractId: "CC3REGISTRY572KC5W2G64K5R3L8O2P1Q9N0M1L2K3J4H5G6F7E8D9C0",
    timestamp: Date.now() - 180000,
    retryCount: 0,
  },
  {
    id: "tx-2",
    hash: "3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
    status: "confirmed",
    method: "retire",
    contractId: "CB2RETIREMENT572KC5W2G64K5R3L8O2P1Q9N0M1L2K3J4H5G6F7E8D9C0",
    timestamp: Date.now() - 720000,
    retryCount: 0,
  },
  {
    id: "tx-3",
    hash: "7f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
    status: "confirmed",
    method: "transfer",
    contractId: "CC3REGISTRY572KC5W2G64K5R3L8O2P1Q9N0M1L2K3J4H5G6F7E8D9C0",
    timestamp: Date.now() - 1800000,
    retryCount: 0,
  },
];
