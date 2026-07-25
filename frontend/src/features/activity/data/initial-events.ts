import { ActivityEvent } from "../types";

export const INITIAL_EVENTS: ActivityEvent[] = [
  {
    id: "evt-101",
    type: "issued",
    ledger: 5289120,
    timestamp: Math.floor(Date.now() / 1000) - 180,
    data: { project: "Amazon Reforestation", amount: "2500", vintageYear: 2024 },
    contractId: "CC3REGISTRY572KC5W2G64K5R3L8O2P1Q9N0M1L2K3J4H5G6F7E8D9C0",
    txHash: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
  },
  {
    id: "evt-102",
    type: "retired",
    ledger: 5289050,
    timestamp: Math.floor(Date.now() / 1000) - 720,
    data: { project: "Wind Farm Texas", amount: "500", vintageYear: 2023 },
    contractId: "CB2RETIREMENT572KC5W2G64K5R3L8O2P1Q9N0M1L2K3J4H5G6F7E8D9C0",
    txHash: "3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
  },
  {
    id: "evt-103",
    type: "transferred",
    ledger: 5288920,
    timestamp: Math.floor(Date.now() / 1000) - 1800,
    data: { creditId: "1", amount: "1000" },
    contractId: "CC3REGISTRY572KC5W2G64K5R3L8O2P1Q9N0M1L2K3J4H5G6F7E8D9C0",
    txHash: "7f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
  },
  {
    id: "evt-104",
    type: "issuer_added",
    ledger: 5288100,
    timestamp: Math.floor(Date.now() / 1000) - 3600,
    data: { issuer: "GBCTQ5XLK2R4NXZPLQQ4MNTL7V3K9L2QQ4" },
    contractId: "CC3REGISTRY572KC5W2G64K5R3L8O2P1Q9N0M1L2K3J4H5G6F7E8D9C0",
    txHash: "5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c",
  },
];
