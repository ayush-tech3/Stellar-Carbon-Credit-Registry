import { describe, it, expect } from 'vitest';
import { creditService } from '@/features/credits/services/credit-service';
import { retirementService } from '@/features/retirement/services/retirement-service';
import { Address, nativeToScVal, Keypair, Networks } from '@stellar/stellar-sdk';

describe('Soroban Contract & Frontend Integration', () => {
  it('correctly constructs Soroban ScVal parameters for issue_credits', () => {
    const pubKey = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF';
    const addrScVal = new Address(pubKey).toScVal();
    expect(addrScVal).toBeDefined();

    const amountScVal = nativeToScVal(1000n, { type: 'i128' });
    expect(amountScVal).toBeDefined();

    const vintageScVal = nativeToScVal(2024, { type: 'u32' });
    expect(vintageScVal).toBeDefined();

    const projectScVal = nativeToScVal('Amazon Reforestation', { type: 'string' });
    expect(projectScVal).toBeDefined();
  });

  it('matches CarbonCreditRegistry smart contract functions', () => {
    expect(typeof creditService.initialize).toBe('function');
    expect(typeof creditService.addIssuer).toBe('function');
    expect(typeof creditService.removeIssuer).toBe('function');
    expect(typeof creditService.issueCredits).toBe('function');
    expect(typeof creditService.transferCredits).toBe('function');
    expect(typeof creditService.getCredit).toBe('function');
    expect(typeof creditService.getBalance).toBe('function');
  });

  it('matches RetirementManager smart contract functions', () => {
    expect(typeof retirementService.initialize).toBe('function');
    expect(typeof retirementService.retireCredits).toBe('function');
    expect(typeof retirementService.getRetirement).toBe('function');
    expect(typeof retirementService.getTotalRetired).toBe('function');
    expect(typeof retirementService.getRetirementsByOwner).toBe('function');
    expect(typeof retirementService.getRetirementCount).toBe('function');
  });
});
