import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { eventService } from '../services/event-service';
import { NETWORK_CONFIG } from '@/lib/stellar/network';
import { rpcServer } from '@/lib/stellar/client';

export function useEventStream() {
  const [startLedger, setStartLedger] = useState<number | null>(null);

  // Get initial ledger on mount
  useEffect(() => {
    async function initLedger() {
      try {
        const latest = await rpcServer.getLatestLedger();
        // Look back ~100 ledgers (approx 10 minutes) for initial load
        setStartLedger(Math.max(1, latest.sequence - 100));
      } catch (e) {
        console.error("Failed to get latest ledger", e);
      }
    }
    initLedger();
  }, []);

  return useQuery({
    queryKey: ['events', startLedger],
    queryFn: async () => {
      if (!startLedger) return [];
      
      const contracts = [
        NETWORK_CONFIG.registryContractId,
        NETWORK_CONFIG.retirementContractId
      ].filter(Boolean);
      
      const events = await eventService.fetchEvents(startLedger, contracts);
      
      // We don't advance the ledger in the queryFn directly to avoid complex state updates during render
      // But in a real app we'd track the highest seen ledger to avoid fetching dupes
      
      // Sort newest first
      return events.sort((a, b) => b.ledger - a.ledger);
    },
    enabled: !!startLedger,
    refetchInterval: NETWORK_CONFIG.eventPollInterval,
  });
}
