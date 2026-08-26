# ============================================================
# Deploy & Interact — Stellar Testnet (PowerShell)
# ============================================================
# This script:
#   1. Generates a deployer identity
#   2. Deploys both contracts to testnet
#   3. Initializes them with cross-contract references
#   4. Creates 12 real wallet interactions (issue, transfer, retire)
#   5. Outputs all real addresses and tx hashes for README
# ============================================================

$ErrorActionPreference = "Stop"

$ROOT = "c:\Users\Ayush Kumar\OneDrive\Desktop\CarbonCreditRegistry"
$CONTRACTS_DIR = Join-Path $ROOT "contracts"
$NETWORK = "testnet"
$IDENTITY = "deployer"
$OUTPUT_FILE = Join-Path $ROOT "deployment-results.json"

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  Carbon Credit Registry - Testnet Deployment" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# ─── Step 1: Generate deployer identity ─────────────────────
Write-Host "Step 1: Generating deployer identity..." -ForegroundColor Yellow
try {
    stellar keys generate $IDENTITY --network $NETWORK --fund 2>$null
    Write-Host "  Created new deployer identity" -ForegroundColor Green
} catch {
    Write-Host "  Deployer identity already exists, reusing..." -ForegroundColor Yellow
}

$DEPLOYER_ADDRESS = (stellar keys address $IDENTITY 2>$null).Trim()
Write-Host "  Deployer: $DEPLOYER_ADDRESS" -ForegroundColor Green
Write-Host ""

# ─── Step 2: Locate WASM files ──────────────────────────────
$RETIRE_WASM = Join-Path $CONTRACTS_DIR "target\wasm32v1-none\release\retirement_manager.wasm"
$REGISTRY_WASM = Join-Path $CONTRACTS_DIR "target\wasm32v1-none\release\carbon_credit_registry.wasm"

if (-not (Test-Path $RETIRE_WASM)) {
    Write-Host "ERROR: retirement_manager.wasm not found at $RETIRE_WASM" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $REGISTRY_WASM)) {
    Write-Host "ERROR: carbon_credit_registry.wasm not found at $REGISTRY_WASM" -ForegroundColor Red
    exit 1
}

Write-Host "Step 2: WASM files located" -ForegroundColor Green
Write-Host ""

# ─── Step 3: Deploy retirement-manager ──────────────────────
Write-Host "Step 3: Deploying retirement-manager..." -ForegroundColor Yellow
$RETIRE_CONTRACT_ID = (stellar contract deploy --wasm $RETIRE_WASM --network $NETWORK --source-account $IDENTITY 2>&1).Trim()
Write-Host "  Retirement Manager: $RETIRE_CONTRACT_ID" -ForegroundColor Green
Write-Host ""

# ─── Step 4: Deploy carbon-credit-registry ──────────────────
Write-Host "Step 4: Deploying carbon-credit-registry..." -ForegroundColor Yellow
$REGISTRY_CONTRACT_ID = (stellar contract deploy --wasm $REGISTRY_WASM --network $NETWORK --source-account $IDENTITY 2>&1).Trim()
Write-Host "  Carbon Credit Registry: $REGISTRY_CONTRACT_ID" -ForegroundColor Green
Write-Host ""

# ─── Step 5: Initialize retirement-manager ──────────────────
Write-Host "Step 5: Initializing retirement-manager..." -ForegroundColor Yellow
stellar contract invoke --id $RETIRE_CONTRACT_ID --source-account $IDENTITY --network $NETWORK -- initialize --admin $DEPLOYER_ADDRESS --registry $REGISTRY_CONTRACT_ID
Write-Host "  Retirement Manager initialized" -ForegroundColor Green
Write-Host ""

# ─── Step 6: Initialize carbon-credit-registry ──────────────
Write-Host "Step 6: Initializing carbon-credit-registry..." -ForegroundColor Yellow
stellar contract invoke --id $REGISTRY_CONTRACT_ID --source-account $IDENTITY --network $NETWORK -- initialize --admin $DEPLOYER_ADDRESS --retire_ctr $RETIRE_CONTRACT_ID
Write-Host "  Carbon Credit Registry initialized" -ForegroundColor Green
Write-Host ""

# ─── Step 7: Register deployer as issuer ────────────────────
Write-Host "Step 7: Registering deployer as issuer..." -ForegroundColor Yellow
stellar contract invoke --id $REGISTRY_CONTRACT_ID --source-account $IDENTITY --network $NETWORK -- add_issuer --issuer $DEPLOYER_ADDRESS
Write-Host "  Deployer registered as issuer" -ForegroundColor Green
Write-Host ""

# ─── Step 8: Create user wallets for interactions ───────────
Write-Host "Step 8: Creating 12 testnet user wallets..." -ForegroundColor Yellow

$users = @()
$userNames = @(
    "user-forest-issuer",
    "user-solar-issuer",
    "user-wind-issuer",
    "user-dac-issuer",
    "user-trader-1",
    "user-trader-2",
    "user-trader-3",
    "user-retiree-corp-1",
    "user-retiree-corp-2",
    "user-retiree-corp-3",
    "user-auditor-1",
    "user-auditor-2"
)

$userRoles = @(
    "Forest Carbon Project Issuer",
    "Solar Energy Project Issuer",
    "Wind Farm Carbon Issuer",
    "Direct Air Capture Issuer",
    "Carbon Credit Trader",
    "ESG Fund Carbon Trader",
    "Institutional Carbon Broker",
    "Manufacturing Corp (Retiree)",
    "Airline Fleet Offset Buyer",
    "Tech Company Carbon Offsetter",
    "ESG Compliance Auditor",
    "Carbon Registry Inspector"
)

foreach ($i in 0..($userNames.Count - 1)) {
    $name = $userNames[$i]
    try {
        stellar keys generate $name --network $NETWORK --fund 2>$null
    } catch {
        # already exists
    }
    $addr = (stellar keys address $name 2>$null).Trim()
    $users += @{ Name = $name; Address = $addr; Role = $userRoles[$i] }
    Write-Host "  [$($i+1)/12] $name -> $addr" -ForegroundColor Gray
}
Write-Host "  All 12 wallets created and funded" -ForegroundColor Green
Write-Host ""

# ─── Step 9: Register issuers (first 4 users) ──────────────
Write-Host "Step 9: Registering issuers..." -ForegroundColor Yellow
foreach ($i in 0..3) {
    $u = $users[$i]
    stellar contract invoke --id $REGISTRY_CONTRACT_ID --source-account $IDENTITY --network $NETWORK -- add_issuer --issuer $($u.Address)
    Write-Host "  Registered issuer: $($u.Name)" -ForegroundColor Gray
}
Write-Host "  All issuers registered" -ForegroundColor Green
Write-Host ""

# ─── Step 10: Issue credits from each issuer ────────────────
Write-Host "Step 10: Issuing carbon credits..." -ForegroundColor Yellow

$projectNames = @("Amazon Reforestation", "Rajasthan Solar Farm", "North Sea Wind Park", "Iceland DAC Facility")
$methods = @("VCS-REDD+", "Gold-Standard", "VCS-Renewable", "CDR-DAC")
$amounts = @(5000, 3000, 4500, 1200)
$vintages = @(2025, 2025, 2024, 2025)

$creditIds = @()
foreach ($i in 0..3) {
    $u = $users[$i]
    $result = stellar contract invoke --id $REGISTRY_CONTRACT_ID --source-account $($u.Name) --network $NETWORK -- issue_credits --issuer $($u.Address) --project "$($projectNames[$i])" --amount $($amounts[$i]) --vintage $($vintages[$i]) --method "$($methods[$i])" 2>&1
    $creditId = $result.Trim().Trim('"')
    $creditIds += $creditId
    Write-Host "  Issued credit #$creditId - $($projectNames[$i]) ($($amounts[$i]) tCO2)" -ForegroundColor Gray
}
Write-Host "  All credits issued" -ForegroundColor Green
Write-Host ""

# ─── Step 11: Transfer credits ──────────────────────────────
Write-Host "Step 11: Transferring credits..." -ForegroundColor Yellow

# Transfer from issuer0 to trader4
stellar contract invoke --id $REGISTRY_CONTRACT_ID --source-account $($users[0].Name) --network $NETWORK -- transfer --owner $($users[0].Address) --to $($users[4].Address) --credit_id $($creditIds[0]) --amount 1000
Write-Host "  Transfer 1: 1000 tCO2 from forest-issuer to trader-1" -ForegroundColor Gray

# Transfer from issuer1 to trader5
stellar contract invoke --id $REGISTRY_CONTRACT_ID --source-account $($users[1].Name) --network $NETWORK -- transfer --owner $($users[1].Address) --to $($users[5].Address) --credit_id $($creditIds[1]) --amount 800
Write-Host "  Transfer 2: 800 tCO2 from solar-issuer to trader-2" -ForegroundColor Gray

# Transfer from issuer2 to trader6
stellar contract invoke --id $REGISTRY_CONTRACT_ID --source-account $($users[2].Name) --network $NETWORK -- transfer --owner $($users[2].Address) --to $($users[6].Address) --credit_id $($creditIds[2]) --amount 1500
Write-Host "  Transfer 3: 1500 tCO2 from wind-issuer to trader-3" -ForegroundColor Gray

# Transfer from issuer3 to retiree-corp-1
stellar contract invoke --id $REGISTRY_CONTRACT_ID --source-account $($users[3].Name) --network $NETWORK -- transfer --owner $($users[3].Address) --to $($users[7].Address) --credit_id $($creditIds[3]) --amount 600
Write-Host "  Transfer 4: 600 tCO2 from dac-issuer to retiree-corp-1" -ForegroundColor Gray

Write-Host "  All transfers complete" -ForegroundColor Green
Write-Host ""

# ─── Step 12: Retire credits ───────────────────────────────
Write-Host "Step 12: Retiring credits..." -ForegroundColor Yellow

stellar contract invoke --id $REGISTRY_CONTRACT_ID --source-account $($users[4].Name) --network $NETWORK -- retire --owner $($users[4].Address) --credit_id $($creditIds[0]) --amount 500
Write-Host "  Retirement 1: 500 tCO2 by trader-1" -ForegroundColor Gray

stellar contract invoke --id $REGISTRY_CONTRACT_ID --source-account $($users[7].Name) --network $NETWORK -- retire --owner $($users[7].Address) --credit_id $($creditIds[3]) --amount 400
Write-Host "  Retirement 2: 400 tCO2 by retiree-corp-1" -ForegroundColor Gray

# Transfer then retire from retiree-corp-2
stellar contract invoke --id $REGISTRY_CONTRACT_ID --source-account $($users[4].Name) --network $NETWORK -- transfer --owner $($users[4].Address) --to $($users[8].Address) --credit_id $($creditIds[0]) --amount 200
stellar contract invoke --id $REGISTRY_CONTRACT_ID --source-account $($users[8].Name) --network $NETWORK -- retire --owner $($users[8].Address) --credit_id $($creditIds[0]) --amount 200
Write-Host "  Retirement 3: 200 tCO2 by retiree-corp-2" -ForegroundColor Gray

Write-Host "  All retirements complete" -ForegroundColor Green
Write-Host ""

# ─── Step 13: Auditor queries ──────────────────────────────
Write-Host "Step 13: Auditor queries..." -ForegroundColor Yellow
$totalRetired = stellar contract invoke --id $RETIRE_CONTRACT_ID --source-account $($users[11].Name) --network $NETWORK --is-view -- get_total 2>&1
Write-Host "  Total retired: $totalRetired tCO2" -ForegroundColor Gray
Write-Host ""

# ─── Output ────────────────────────────────────────────────
Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host "  DEPLOYMENT & INTERACTIONS COMPLETE" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Registry Contract:    $REGISTRY_CONTRACT_ID" -ForegroundColor White
Write-Host "Retirement Contract:  $RETIRE_CONTRACT_ID" -ForegroundColor White
Write-Host "Deployer Address:     $DEPLOYER_ADDRESS" -ForegroundColor White
Write-Host ""
Write-Host "Frontend .env.local:" -ForegroundColor Yellow
Write-Host "  NEXT_PUBLIC_REGISTRY_CONTRACT_ID=$REGISTRY_CONTRACT_ID"
Write-Host "  NEXT_PUBLIC_RETIREMENT_CONTRACT_ID=$RETIRE_CONTRACT_ID"
Write-Host ""
Write-Host "Explorer links:" -ForegroundColor Yellow
Write-Host "  Registry:   https://stellar.expert/explorer/testnet/contract/$REGISTRY_CONTRACT_ID"
Write-Host "  Retirement: https://stellar.expert/explorer/testnet/contract/$RETIRE_CONTRACT_ID"
Write-Host ""
Write-Host "User wallet addresses:" -ForegroundColor Yellow
foreach ($u in $users) {
    Write-Host "  $($u.Role): $($u.Address)" -ForegroundColor Gray
    Write-Host "    Explorer: https://stellar.expert/explorer/testnet/account/$($u.Address)"
}

# Save results
$results = @{
    registryContractId = $REGISTRY_CONTRACT_ID
    retirementContractId = $RETIRE_CONTRACT_ID
    deployerAddress = $DEPLOYER_ADDRESS
    users = @()
}
foreach ($u in $users) {
    $results.users += @{
        name = $u.Name
        address = $u.Address
        role = $u.Role
    }
}
$results | ConvertTo-Json -Depth 5 | Set-Content $OUTPUT_FILE
Write-Host "`nResults saved to: $OUTPUT_FILE" -ForegroundColor Cyan
