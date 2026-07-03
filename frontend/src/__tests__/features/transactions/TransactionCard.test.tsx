import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TransactionCard } from '@/features/transactions/components/TransactionCard';
import { TrackedTransaction } from '@/features/transactions/types';

describe('TransactionCard', () => {
  it('renders confirmed status correctly', () => {
    const tx: TrackedTransaction = {
      id: '1',
      hash: '0x123',
      status: 'confirmed',
      method: 'issue_credits',
      contractId: 'C123',
      timestamp: Date.now(),
      retryCount: 0
    };
    render(<TransactionCard transaction={tx} />);
    expect(screen.getByText('Confirmed')).toBeInTheDocument();
    expect(screen.getByText('issue credits')).toBeInTheDocument();
  });
});
