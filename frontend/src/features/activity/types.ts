export type EventType = 'issued' | 'transferred' | 'retired' | 'issuer_added' | 'issuer_removed';

export interface ActivityEvent {
  id: string;
  type: EventType;
  ledger: number;
  timestamp: number;
  data: unknown;
  contractId: string;
  txHash: string;
}
