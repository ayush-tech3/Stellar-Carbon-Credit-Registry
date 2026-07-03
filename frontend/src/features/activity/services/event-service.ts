import { rpcServer } from '@/lib/stellar/client';
import { ActivityEvent, EventType } from '../types';
import * as StellarSdk from '@stellar/stellar-sdk';
import { NETWORK_CONFIG } from '@/lib/stellar/network';

export class EventService {
  async fetchEvents(startLedger: number, contractIds: string[]): Promise<ActivityEvent[]> {
    if (!contractIds || contractIds.length === 0) return [];
    
    // Ensure all contractIds are valid before querying
    const validContracts = contractIds.filter(id => id && id.length > 0);
    if (validContracts.length === 0) return [];

    try {
      const response = await rpcServer.getEvents({
        startLedger,
        filters: validContracts.map(id => ({
          type: 'contract',
          contractIds: [id],
        })),
        limit: 100
      });

      return response.events.map(event => this.parseEvent(event)).filter((e): e is ActivityEvent => e !== null);
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  }

  private parseEvent(rawEvent: StellarSdk.rpc.Api.EventResponse): ActivityEvent | null {
    if (rawEvent.type !== 'contract') return null;
    
    // In Soroban, the topic contains the event name
    let type: EventType | null = null;
    
    // Hackathon simplification: Topics are XDR encoded ScVals
    // A robust implementation would decode the XDR to check the topic symbol
    const topicXdr = rawEvent.topic[0];
    try {
      const parsedTopic = StellarSdk.xdr.ScVal.fromXDR(topicXdr, 'base64');
      if (parsedTopic.switch() === StellarSdk.xdr.ScValType.scvSymbol()) {
        const symbolStr = parsedTopic.sym().toString();
        if (symbolStr === 'issued') type = 'issued';
        else if (symbolStr === 'transfer') type = 'transferred';
        else if (symbolStr === 'retired') type = 'retired';
        else if (symbolStr === 'issuer_added') type = 'issuer_added';
        else if (symbolStr === 'issuer_rm') type = 'issuer_removed';
      }
    } catch (e) {
      // Fallback or ignore
    }

    if (!type) return null;

    // Decode value
    let data: any = {};
    try {
        const valXdr = rawEvent.value;
        // Mock data structure decoding for UI demo purposes
        data = { raw: valXdr }; 
    } catch(e) {}

    return {
      id: rawEvent.id,
      type,
      ledger: rawEvent.ledger,
      timestamp: Date.now() / 1000, // Approximate timestamp for UI, actual ledger timestamp requires fetching the ledger
      data,
      contractId: rawEvent.contractId,
      txHash: rawEvent.txHash,
    };
  }
}

export const eventService = new EventService();
