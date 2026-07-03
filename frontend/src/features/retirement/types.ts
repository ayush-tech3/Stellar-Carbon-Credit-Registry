export interface RetirementRecord {
  id: string; // u64
  creditId: string; // u64
  owner: string;
  amount: bigint;
  project: string;
  vintage: number;
  timestamp: number; // u64 unix timestamp
}

export interface RetireParams {
  creditId: string;
  amount: bigint;
}
