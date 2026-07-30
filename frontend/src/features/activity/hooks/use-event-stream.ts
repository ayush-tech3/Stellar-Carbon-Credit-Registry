import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { eventService } from '../services/event-service';
import { ActivityEvent } from '../types';
import { NETWORK_CONFIG } from '@/lib/stellar/network';
import { rpcServer } from '@/lib/stellar/client';
import { useEventStore } from '@/stores/event-store';

export function useEventStream() {
  const [startLedger, setStartLedger] = useState<number | null>(null);
  const localEvents = useEventStore((state) => state.events);

  useEffect(() => {
    async function initLedger() {
      try {
        const latest = await rpcServer.getLatestLedger();
        setStartLedger(Math.max(1, latest.sequence - 100));
      } catch (e) {
        console.warn("RPC latest ledger unavailable, using local event feed", e);
        setStartLedger(1);
      }
    }
    initLedger();
  }, []);

  return useQuery({
    queryKey: ['events', startLedger, localEvents.length],
    queryFn: async () => {
      let remoteEvents: ActivityEvent[] = [];
      if (startLedger && NETWORK_CONFIG.registryContractId) {
        try {
          const contracts = [
            NETWORK_CONFIG.registryContractId,
            NETWORK_CONFIG.retirementContractId
          ].filter(Boolean);
          remoteEvents = await eventService.fetchEvents(startLedger, contracts);
        } catch (e) {
          console.warn("Failed fetching remote events", e);
        }
      }

      // Merge local events and remote events, deduplicate by id
      const allEvents = [...localEvents];
      for (const re of remoteEvents) {
        if (!allEvents.some(e => e.id === re.id || e.txHash === re.txHash)) {
          allEvents.push(re);
        }
      }

      return allEvents.sort((a, b) => b.timestamp - a.timestamp);
    },
    enabled: true,
    refetchInterval: NETWORK_CONFIG.eventPollInterval,
  });
}
