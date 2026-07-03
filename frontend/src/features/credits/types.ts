export interface CreditBatch {
  id: string; // u64 represented as string in JS
  issuer: string;
  project: string;
  amount: bigint;
  retired: bigint;
  vintage: number;
  methodology: string;
  active: boolean;
}

export interface CreditBalance {
  creditId: string;
  owner: string;
  amount: bigint;
}

export interface IssueCreditsParams {
  project: string;
  amount: bigint;
  vintageYear: number;
  methodology: string;
}

export interface TransferParams {
  creditId: string;
  to: string;
  amount: bigint;
}
