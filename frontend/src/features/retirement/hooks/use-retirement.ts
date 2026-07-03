import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { retirementService } from '../services/retirement-service';
import { RetireParams } from '../types';
import { useWallet } from '@/lib/wallet/provider';
import { useWalletStore } from '@/stores/wallet-store';

export function useRetirement(id: string) {
  return useQuery({
    queryKey: ['retirement', id],
    queryFn: () => retirementService.getRetirement(id),
    enabled: !!id,
  });
}

export function useTotalRetired() {
  return useQuery({
    queryKey: ['totalRetired'],
    queryFn: () => retirementService.getTotalRetired(),
    refetchInterval: 30000, // Update every 30s
  });
}

export function useRetirementsByOwner(owner: string | null) {
  return useQuery({
    queryKey: ['retirements', owner],
    queryFn: () => retirementService.getRetirementsByOwner(owner!),
    enabled: !!owner,
  });
}

export function useRetireCredits() {
  const { signTransaction } = useWallet();
  const { address } = useWalletStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: RetireParams) => {
      if (!address) throw new Error("Wallet not connected");
      return retirementService.retireCredits(params, address, signTransaction);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['balance', address, variables.creditId] });
      queryClient.invalidateQueries({ queryKey: ['retirements', address] });
      queryClient.invalidateQueries({ queryKey: ['totalRetired'] });
    }
  });
}
