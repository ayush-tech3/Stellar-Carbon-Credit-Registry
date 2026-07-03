import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { IssueForm } from '@/features/credits/components/IssueForm';

// Mock react-query hook
vi.mock('@/features/credits/hooks/use-credits', () => ({
  useIssueCredits: () => ({
    mutate: vi.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
  })
}));

describe('IssueForm', () => {
  it('renders form inputs correctly', () => {
    render(<IssueForm />);
    expect(screen.getByText('Project Name')).toBeInTheDocument();
    expect(screen.getByText('Amount (Tons CO₂)')).toBeInTheDocument();
    expect(screen.getByText('Vintage Year')).toBeInTheDocument();
    expect(screen.getByText('Methodology')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Issue Credits' })).toBeInTheDocument();
  });
});
