#!/bin/bash
# ============================================================
# Upgrade Contracts
# ============================================================
# Upgrades deployed contracts to new WASM bytecode.
# Steps: Upload new WASM → Call upgrade() on contract
# ============================================================

set -euo pipefail

IDENTITY="${STELLAR_IDENTITY:-deployer}"
NETWORK="${STELLAR_NETWORK:-testnet}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
CONTRACTS_DIR="$ROOT_DIR/contracts"

echo "╔══════════════════════════════════════════════════════╗"
echo "║   Carbon Credit Registry — Contract Upgrade         ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

CONTRACT_NAME="${1:-}"
CONTRACT_ID="${2:-}"

if [ -z "$CONTRACT_NAME" ] || [ -z "$CONTRACT_ID" ]; then
  echo "Usage: ./upgrade-contracts.sh <contract-name> <contract-id>"
  echo ""
  echo "  contract-name: retirement-manager | carbon-credit-registry"
  echo "  contract-id:   C... (deployed contract address)"
  echo ""
  echo "Example:"
  echo "  ./upgrade-contracts.sh carbon-credit-registry CXXX..."
  exit 1
fi

# Map contract name to WASM file
case "$CONTRACT_NAME" in
  retirement-manager)
    WASM_FILE="$CONTRACTS_DIR/target/wasm32v1-none/release/retirement_manager.wasm"
    CARGO_PKG="retirement-manager"
    ;;
  carbon-credit-registry)
    WASM_FILE="$CONTRACTS_DIR/target/wasm32v1-none/release/carbon_credit_registry.wasm"
    CARGO_PKG="carbon-credit-registry"
    ;;
  *)
    echo "❌ Unknown contract: $CONTRACT_NAME"
    exit 1
    ;;
esac

# ─── Step 1: Build ──────────────────────────────────────────
echo "🔨 Building $CONTRACT_NAME..."
cd "$CONTRACTS_DIR"
cargo build --release --target wasm32v1-none -p "$CARGO_PKG"
echo "✅ Built"

# ─── Step 2: Upload new WASM ────────────────────────────────
echo ""
echo "📤 Uploading new WASM bytecode..."
WASM_HASH=$(stellar contract upload \
  --wasm "$WASM_FILE" \
  --network "$NETWORK" \
  --source-account "$IDENTITY" \
  2>&1)
echo "✅ WASM uploaded. Hash: $WASM_HASH"

# ─── Step 3: Call upgrade() ─────────────────────────────────
echo ""
echo "⬆️  Calling upgrade() on $CONTRACT_ID..."
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source-account "$IDENTITY" \
  --network "$NETWORK" \
  -- upgrade \
  --new_wasm "$WASM_HASH"
echo "✅ Contract upgraded successfully!"

echo ""
echo "🔗 Explorer: https://stellar.expert/explorer/$NETWORK/contract/$CONTRACT_ID"
