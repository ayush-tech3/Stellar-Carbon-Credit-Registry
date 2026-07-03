import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { creditService } from '../services/credit-service';
import { IssueCreditsParams, TransferParams } from '../types';
import { useWallet } from '@/lib/wallet/provider';
import { useWalletStore } from '@/stores/wallet-store';

export function useCredit(creditId: string) {
  return useQuery({
    queryKey: ['credit', creditId],
    queryFn: () => creditService.getCredit(creditId),
    enabled: !!creditId,
  });
}

export function useBalance(owner: string | null, creditId: string) {
  return useQuery({
    queryKey: ['balance', owner, creditId],
    queryFn: () => creditService.getBalance(owner!, creditId),
    enabled: !!owner && !!creditId,
  });
}

export function useIssueCredits() {
  const { signTransaction } = useWallet();
  const { address } = useWalletStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: IssueCreditsParams) => {
      if (!address) throw new Error("Wallet not connected");
      return creditService.issueCredits(params, address, signTransaction);
    },
    onSuccess: () => {
      // Invalidate relevant queries here
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    }
  });
}

export function useTransferCredits() {
  const { signTransaction } = useWallet();
  const { address } = useWalletStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: TransferParams) => {
      if (!address) throw new Error("Wallet not connected");
      return creditService.transferCredits(params, address, signTransaction);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['balance', address, variables.creditId] });
      queryClient.invalidateQueries({ queryKey: ['balance', variables.to, variables.creditId] });
    }
  });
}
