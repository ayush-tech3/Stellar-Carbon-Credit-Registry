#!/bin/bash
# ============================================================
# Generate TypeScript Bindings
# ============================================================
# Generates type-safe TypeScript clients from deployed contracts.
# Prerequisites: stellar-cli installed, contracts deployed.
# ============================================================

set -euo pipefail

NETWORK="${STELLAR_NETWORK:-testnet}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$ROOT_DIR/frontend/src/lib/stellar/bindings"

if [ -z "${REGISTRY_CONTRACT_ID:-}" ] || [ -z "${RETIREMENT_CONTRACT_ID:-}" ]; then
  echo "❌ Error: Set REGISTRY_CONTRACT_ID and RETIREMENT_CONTRACT_ID env vars"
  echo ""
  echo "Usage:"
  echo "  REGISTRY_CONTRACT_ID=C... RETIREMENT_CONTRACT_ID=C... ./generate-bindings.sh"
  exit 1
fi

echo "📦 Generating TypeScript bindings..."
echo ""

# ─── Registry bindings ──────────────────────────────────────
echo "1/2 Generating carbon-credit-registry bindings..."
mkdir -p "$OUTPUT_DIR/registry"
stellar contract bindings typescript \
  --network "$NETWORK" \
  --contract-id "$REGISTRY_CONTRACT_ID" \
  --output-dir "$OUTPUT_DIR/registry" \
  --overwrite
echo "✅ Registry bindings generated"

# ─── Retirement bindings ────────────────────────────────────
echo ""
echo "2/2 Generating retirement-manager bindings..."
mkdir -p "$OUTPUT_DIR/retirement"
stellar contract bindings typescript \
  --network "$NETWORK" \
  --contract-id "$RETIREMENT_CONTRACT_ID" \
  --output-dir "$OUTPUT_DIR/retirement" \
  --overwrite
echo "✅ Retirement bindings generated"

echo ""
echo "🎉 Bindings generated at: $OUTPUT_DIR"
echo "   Import with: import { Client } from '@/lib/stellar/bindings/registry'"
