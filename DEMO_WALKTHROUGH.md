# 🎥 CarbonTrack — Product Demo & User Flow Walkthrough

> **Stellar Carbon Credit Registry — Level 5 Blue Belt Submission**  
> *Complete step-by-step product walkthrough demonstrating real on-chain carbon credit issuance, transfers, permanent retirements, and real-time monitoring.*

🎥 **Watch Demo Video on YouTube**: [https://youtu.be/LXSb4yaDnEI](https://youtu.be/LXSb4yaDnEI)  
🌐 **Live Interactive App**: [https://carbon-credit-registry.netlify.app](https://carbon-credit-registry.netlify.app)  
📝 **User Feedback Form (Level 4)**: [https://forms.gle/rF7KsMAaD7SQzQan9](https://forms.gle/rF7KsMAaD7SQzQan9)  
📊 **Live Responses Sheet (Level 4)**: [https://docs.google.com/spreadsheets/d/1mKnmxuc9a4YKgHesZjv9jU-2HPNfopE4hsUmRv3Csp4/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1mKnmxuc9a4YKgHesZjv9jU-2HPNfopE4hsUmRv3Csp4/edit?usp=sharing)

---

## 🎬 Video Walkthrough Structure & Timestamps

| Timestamp | Phase | User Flow & Action Demonstrated | Soroban On-Chain Verification |
|---|---|---|---|
| **0:00 - 0:25** | **Introduction & Landing Page** | Overview of CarbonTrack, global metrics counter, and 3D animated particle canvas. | Public state queries (`get_total`, `get_count`) |
| **0:25 - 0:45** | **1-Click Wallet Onboarding** | Connecting instant funded Demo Wallet (`GBCT...LQQ4`) and Freighter extension. | Wallet state synced in Zustand & React context |
| **0:45 - 1:15** | **Credit Issuance (Minting)** | Issuer selects *🌱 Amazon Reforestation (1,000 tCO₂)* preset, signs on-chain transaction. | Invokes `CarbonCreditRegistry.issue_credits` |
| **1:15 - 1:35** | **Credit Transfer** | User transfers *500 tCO₂* to *🏢 EcoTrade Desk*, balance updates in real-time. | Invokes `CarbonCreditRegistry.transfer` |
| **1:35 - 2:00** | **Permanent Retirement (Burning)** | User burns *250 tCO₂* for *🔥 Scope 1 Offset*, minting Retirement Certificate `CERT-2026-XXXXX`. | Invokes `RetirementManager.record` & burns token |
| **2:00 - 2:20** | **Analytics & Monitoring** | Live methodology breakdown charts, event logs, health metrics, and user feedback widget. | Real-time event log & client analytics |

---

## 🧑‍💻 Real User Flows & Testnet Use Cases

### 1. Forest Reforestation Project Developer (Issuer Flow)
- **Goal**: Mint verified carbon credits directly onto Stellar after satellite MRV audit.
- **Action**:
  1. Opens `/dashboard`.
  2. Selects **Issue Credits** action card.
  3. Uses preset or enters `Project: Amazon Rainforest Canopy`, `Amount: 5000 tCO₂`, `Vintage: 2024`, `Methodology: VCS VM0015`.
  4. Clicks **Issue Credits**.
  5. The Soroban contract verifies issuer authorization and credits the developer's address.

### 2. Corporate Carbon Broker (Transfer & Settlement Flow)
- **Goal**: Transfer certified carbon batches to liquidity desks or secondary corporate buyers with instant settlement.
- **Action**:
  1. Opens **Transfer Credits** action card on `/dashboard`.
  2. Selects recipient (`GCKL...CC3` or custom Stellar address).
  3. Enters transfer amount (`500 tCO₂`).
  4. Clicks **Transfer Credits**.
  5. The registry deducts sender balance and credits the recipient address in < 4 seconds.

### 3. Enterprise Net-Zero Sustainability Officer (Retirement Flow)
- **Goal**: Permanently offset corporate greenhouse gas emissions and obtain an immutable cryptographic certificate for annual ESG reporting.
- **Action**:
  1. Selects **Retire Credits** on `/dashboard`.
  2. Enters `Amount: 250 tCO₂` and `Beneficiary: Acme Corp ESG Offset 2026`.
  3. Clicks **Burn & Retire Credits**.
  4. Registry executes cross-contract invocation to `RetirementManager`, destroying the tokens forever and returning a verifiable certificate hash (`CERT-2026-XXXXX`).

### 4. ESG Auditor & Compliance Officer (Verification Flow)
- **Goal**: Verify whether an offset claim is authentic and not double-counted.
- **Action**:
  1. Visits `/activity` and `/analytics` to view the live event stream.
  2. Clicks on the transaction receipt or pastes the transaction hash into the Stellar Expert Explorer.
  3. Inspects the immutable Soroban ledger record.
