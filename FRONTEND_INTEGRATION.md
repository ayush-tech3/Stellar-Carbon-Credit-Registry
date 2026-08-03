# Carbon Credit Registry — Soroban Frontend Integration & Function Matching

This document provides a comprehensive overview of how the **Carbon Credit Registry** frontend application integrates with Stellar Soroban smart contracts using `@stellar/stellar-sdk` and `@stellar/freighter-api`.

---

## 1. Overview of Soroban Smart Contracts

The Carbon Credit Registry consists of two main Soroban smart contracts written in Rust:

1. **CarbonCreditRegistry (`contracts/carbon-credit-registry`)**
   - Handles credit issuance, wallet-to-wallet transfers, issuer permissions, credit querying, balance verification, and initiates retirement workflows.
2. **RetirementManager (`contracts/retirement-manager`)**
   - Immutably records carbon credit burn events, maintains owner retirement ledgers, calculates global offset totals, and is called cross-contract by `CarbonCreditRegistry`.

---

## 2. Soroban Contract Function Matching Matrix

Below is the complete function-matching table mapping Rust Soroban contract functions to the corresponding TypeScript service methods, `@stellar/stellar-sdk` calls, and UI components:

| Soroban Contract Function | Contract Name | TypeScript Service Method | SDK Data Types & Call | UI Component / Hook |
|---|---|---|---|---|
| `initialize(admin, retire_ctr)` | `CarbonCreditRegistry` | `creditService.initialize(...)` | `Address(admin).toScVal()`, `buildTransaction`, `simulateAndAssemble` | Admin / Setup Dashboard |
| `add_issuer(issuer)` | `CarbonCreditRegistry` | `creditService.addIssuer(...)` | `Address(issuer).toScVal()`, `Contract.call('add_issuer')` | Admin / Issuer Management |
| `remove_issuer(issuer)` | `CarbonCreditRegistry` | `creditService.removeIssuer(...)` | `Address(issuer).toScVal()`, `Contract.call('remove_issuer')` | Admin / Issuer Management |
| `issue_credits(issuer, project, amount, vintage, method)` | `CarbonCreditRegistry` | `creditService.issueCredits(...)` | `nativeToScVal(amount, { type: 'i128' })`, `nativeToScVal(vintage, { type: 'u32' })` | `IssueForm.tsx` / `useIssueCredits` |
| `transfer(from, to, credit_id, amount)` | `CarbonCreditRegistry` | `creditService.transferCredits(...)` | `Address(to).toScVal()`, `nativeToScVal(credit_id, { type: 'u64' })` | `TransferForm.tsx` / `useTransferCredits` |
| `retire(owner, credit_id, amount)` | `CarbonCreditRegistry` | `retirementService.retireCredits(...)` | Calls `retire` on Registry, executing cross-contract call to `RetirementManager` | `RetireForm.tsx` / `useRetireCredits` |
| `get_credit(credit_id)` | `CarbonCreditRegistry` | `creditService.getCredit(...)` | `simulateContractRead`, `scValToNative(retval)` | `useCredit` / `CreditCard.tsx` |
| `get_balance(owner, credit_id)` | `CarbonCreditRegistry` | `creditService.getBalance(...)` | `simulateContractRead`, `Address(owner).toScVal()` | `useBalance` / Portfolio View |
| `initialize(admin, registry)` | `RetirementManager` | `retirementService.initialize(...)` | `Address(admin).toScVal()`, `Address(registry).toScVal()` | Admin / Deployment Init |
| `get_record(retirement_id)` | `RetirementManager` | `retirementService.getRetirement(...)` | `simulateContractRead`, `scValToNative(retval)` | `RetirementCard.tsx` / `useRetirement` |
| `get_total()` | `RetirementManager` | `retirementService.getTotalRetired(...)` | `simulateContractRead`, `get_total` | `ImpactCounter.tsx` / `useTotalRetired` |
| `get_by_owner(owner)` | `RetirementManager` | `retirementService.getRetirementsByOwner(...)` | `simulateContractRead`, `Address(owner).toScVal()` | `useRetirementsByOwner` |
| `get_count()` | `RetirementManager` | `retirementService.getRetirementCount(...)` | `simulateContractRead`, `get_count` | System Metrics |

---

## 3. Stellar SDK Integration Lifecycle

### Step 1: Transaction Construction
Soroban invocations are built using `StellarSdk.TransactionBuilder` and `StellarSdk.Contract`:

```typescript
import * as StellarSdk from '@stellar/stellar-sdk';
import { NETWORK_CONFIG } from './network';

export async function buildTransaction(
  publicKey: string,
  contractId: string,
  method: string,
  args: StellarSdk.xdr.ScVal[]
) {
  const account = await rpcServer.getAccount(publicKey);
  const contract = new StellarSdk.Contract(contractId);

  return new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_CONFIG.networkPassphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();
}
```

### Step 2: Simulation & Assembly
Before signing, transactions are simulated against the Soroban RPC server using `simulateTransaction()` and assembled with footprints & auth entries via `assembleTransaction()`:

```typescript
import { assembleTransaction } from '@stellar/stellar-sdk/rpc';

export async function simulateAndAssemble(tx: StellarSdk.Transaction) {
  const simulation = await rpcServer.simulateTransaction(tx);
  if (StellarSdk.rpc.Api.isSimulationError(simulation)) {
    throw new Error('Simulation Failed');
  }
  return assembleTransaction(tx, simulation).build();
}
```

### Step 3: Wallet Signing & Submission
Transactions are signed using Freighter (`@stellar/freighter-api`) or connected wallets and submitted via `rpcServer.sendTransaction()`:

```typescript
import { signTransaction as freighterSignTx } from '@stellar/freighter-api';

const signedXdr = await freighterSignTx(assembledTx.toXDR(), {
  networkPassphrase: NETWORK_CONFIG.networkPassphrase
});
const response = await rpcServer.sendTransaction(
  StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_CONFIG.networkPassphrase)
);
```

### Step 4: Read-Only Contract Queries
View functions execute without gas or wallet prompts by simulating transactions against Soroban RPC and parsing returns with `scValToNative`:

```typescript
export async function simulateContractRead<T>(
  contractId: string,
  method: string,
  args: StellarSdk.xdr.ScVal[] = []
): Promise<T | null> {
  const dummyAccount = new StellarSdk.Account('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '0');
  const contract = new StellarSdk.Contract(contractId);
  const tx = new StellarSdk.TransactionBuilder(dummyAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_CONFIG.networkPassphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  const simulation = await rpcServer.simulateTransaction(tx);
  if (StellarSdk.rpc.Api.isSimulationSuccess(simulation) && simulation.result) {
    return StellarSdk.scValToNative(simulation.result.retval) as T;
  }
  return null;
}
```

---

## 4. Key Integration Files Location

- **Stellar RPC & Network Setup**: [`frontend/src/lib/stellar/client.ts`](file:///c:/Users/Ayush%20Kumar/OneDrive/Desktop/CarbonCreditRegistry/frontend/src/lib/stellar/client.ts), [`frontend/src/lib/stellar/network.ts`](file:///c:/Users/Ayush%20Kumar/OneDrive/Desktop/CarbonCreditRegistry/frontend/src/lib/stellar/network.ts)
- **Soroban Transaction & Simulation Helpers**: [`frontend/src/lib/stellar/contracts.ts`](file:///c:/Users/Ayush%20Kumar/OneDrive/Desktop/CarbonCreditRegistry/frontend/src/lib/stellar/contracts.ts)
- **Credit Contract Service**: [`frontend/src/features/credits/services/credit-service.ts`](file:///c:/Users/Ayush%20Kumar/OneDrive/Desktop/CarbonCreditRegistry/frontend/src/features/credits/services/credit-service.ts)
- **Retirement Contract Service**: [`frontend/src/features/retirement/services/retirement-service.ts`](file:///c:/Users/Ayush%20Kumar/OneDrive/Desktop/CarbonCreditRegistry/frontend/src/features/retirement/services/retirement-service.ts)
- **React Hooks**: [`frontend/src/features/credits/hooks/use-credits.ts`](file:///c:/Users/Ayush%20Kumar/OneDrive/Desktop/CarbonCreditRegistry/frontend/src/features/credits/hooks/use-credits.ts), [`frontend/src/features/retirement/hooks/use-retirement.ts`](file:///c:/Users/Ayush%20Kumar/OneDrive/Desktop/CarbonCreditRegistry/frontend/src/features/retirement/hooks/use-retirement.ts)
- **UI Components**:
  - [`frontend/src/features/credits/components/IssueForm.tsx`](file:///c:/Users/Ayush%20Kumar/OneDrive/Desktop/CarbonCreditRegistry/frontend/src/features/credits/components/IssueForm.tsx)
  - [`frontend/src/features/credits/components/TransferForm.tsx`](file:///c:/Users/Ayush%20Kumar/OneDrive/Desktop/CarbonCreditRegistry/frontend/src/features/credits/components/TransferForm.tsx)
  - [`frontend/src/features/retirement/components/RetireForm.tsx`](file:///c:/Users/Ayush%20Kumar/OneDrive/Desktop/CarbonCreditRegistry/frontend/src/features/retirement/components/RetireForm.tsx)
- **Integration Tests**: [`frontend/src/__tests__/integration/contract-integration.test.ts`](file:///c:/Users/Ayush%20Kumar/OneDrive/Desktop/CarbonCreditRegistry/frontend/src/__tests__/integration/contract-integration.test.ts)
