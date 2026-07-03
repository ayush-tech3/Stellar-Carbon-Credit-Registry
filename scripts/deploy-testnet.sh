#!/bin/bash
# ============================================================
# Deploy to Stellar Testnet
# ============================================================
# Prerequisites:
#   1. Install Stellar CLI: cargo install --locked stellar-cli
#   2. Add a testnet identity:
#      stellar keys generate deployer --network testnet --fund
#   3. Rust wasm32 target: rustup target add wasm32-unknown-unknown
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
CONTRACTS_DIR="$ROOT_DIR/contracts"
IDENTITY="${STELLAR_IDENTITY:-deployer}"
NETWORK="testnet"

echo "╔══════════════════════════════════════════════════════╗"
echo "║   Carbon Credit Registry — Testnet Deployment       ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# ─── Step 1: Build contracts ────────────────────────────────
echo "🔨 Building retirement-manager..."
cd "$CONTRACTS_DIR"
cargo build --release --target wasm32-unknown-unknown -p retirement-manager
echo "✅ retirement-manager built"

echo ""
echo "🔨 Building carbon-credit-registry..."
cargo build --release --target wasm32-unknown-unknown -p carbon-credit-registry
echo "✅ carbon-credit-registry built"

RETIRE_WASM="$CONTRACTS_DIR/target/wasm32-unknown-unknown/release/retirement_manager.wasm"
REGISTRY_WASM="$CONTRACTS_DIR/target/wasm32-unknown-unknown/release/carbon_credit_registry.wasm"

# ─── Step 2: Deploy retirement-manager ──────────────────────
echo ""
echo "🚀 Deploying retirement-manager to $NETWORK..."
RETIRE_CONTRACT_ID=$(stellar contract deploy \
  --wasm "$RETIRE_WASM" \
  --network "$NETWORK" \
  --source-account "$IDENTITY" \
  2>&1)
echo "✅ retirement-manager deployed: $RETIRE_CONTRACT_ID"

# ─── Step 3: Deploy carbon-credit-registry ──────────────────
echo ""
echo "🚀 Deploying carbon-credit-registry to $NETWORK..."
REGISTRY_CONTRACT_ID=$(stellar contract deploy \
  --wasm "$REGISTRY_WASM" \
  --network "$NETWORK" \
  --source-account "$IDENTITY" \
  2>&1)
echo "✅ carbon-credit-registry deployed: $REGISTRY_CONTRACT_ID"

# ─── Step 4: Get deployer address ───────────────────────────
DEPLOYER_ADDRESS=$(stellar keys address "$IDENTITY" 2>&1)
echo ""
echo "📍 Deployer address: $DEPLOYER_ADDRESS"

# ─── Step 5: Initialize retirement-manager ──────────────────
echo ""
echo "⚙️  Initializing retirement-manager..."
stellar contract invoke \
  --id "$RETIRE_CONTRACT_ID" \
  --source-account "$IDENTITY" \
  --network "$NETWORK" \
  -- initialize \
  --admin "$DEPLOYER_ADDRESS" \
  --registry "$REGISTRY_CONTRACT_ID"
echo "✅ retirement-manager initialized"

# ─── Step 6: Initialize carbon-credit-registry ──────────────
echo ""
echo "⚙️  Initializing carbon-credit-registry..."
stellar contract invoke \
  --id "$REGISTRY_CONTRACT_ID" \
  --source-account "$IDENTITY" \
  --network "$NETWORK" \
  -- initialize \
  --admin "$DEPLOYER_ADDRESS" \
  --retire_ctr "$RETIRE_CONTRACT_ID"
echo "✅ carbon-credit-registry initialized"

# ─── Step 7: Register deployer as issuer ────────────────────
echo ""
echo "👤 Registering deployer as authorized issuer..."
stellar contract invoke \
  --id "$REGISTRY_CONTRACT_ID" \
  --source-account "$IDENTITY" \
  --network "$NETWORK" \
  -- add_issuer \
  --issuer "$DEPLOYER_ADDRESS"
echo "✅ Deployer registered as issuer"

# ─── Output ─────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║   ✅  DEPLOYMENT COMPLETE                           ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║                                                      ║"
echo "  Registry Contract:    $REGISTRY_CONTRACT_ID"
echo "  Retirement Contract:  $RETIRE_CONTRACT_ID"
echo "  Deployer Address:     $DEPLOYER_ADDRESS"
echo "  Network:              $NETWORK"
echo "║                                                      ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "📋 Add these to your frontend/.env.local:"
echo ""
echo "  NEXT_PUBLIC_REGISTRY_CONTRACT_ID=$REGISTRY_CONTRACT_ID"
echo "  NEXT_PUBLIC_RETIREMENT_CONTRACT_ID=$RETIRE_CONTRACT_ID"
echo ""
echo "🔗 Explorer links:"
echo "  Registry:   https://stellar.expert/explorer/testnet/contract/$REGISTRY_CONTRACT_ID"
echo "  Retirement: https://stellar.expert/explorer/testnet/contract/$RETIRE_CONTRACT_ID"
