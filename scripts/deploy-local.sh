#!/bin/bash
# ============================================================
# Local Development Setup
# ============================================================
# Starts a local Stellar network for development.
# Prerequisites:
#   1. Docker installed and running
#   2. Stellar CLI: cargo install --locked stellar-cli
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "╔══════════════════════════════════════════════════════╗"
echo "║   Carbon Credit Registry — Local Development        ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# ─── Start local network ────────────────────────────────────
echo "🌐 Starting local Stellar network..."
echo "   (This uses Docker — make sure Docker is running)"
echo ""

# Start standalone network with Soroban support
stellar network start local \
  --protocol-version 22 \
  2>/dev/null || echo "ℹ️  Network may already be running"

echo "✅ Local network started"

# ─── Create test identity ───────────────────────────────────
echo ""
echo "🔑 Creating local test identity..."
stellar keys generate local-dev \
  --network local \
  --fund \
  2>/dev/null || echo "ℹ️  Identity may already exist"

LOCAL_ADDRESS=$(stellar keys address local-dev 2>&1)
echo "✅ Test identity: $LOCAL_ADDRESS"

# ─── Build & Deploy ─────────────────────────────────────────
echo ""
echo "🔨 Building contracts..."
cd "$ROOT_DIR/contracts"
cargo build --release --target wasm32v1-none -p retirement-manager
cargo build --release --target wasm32v1-none -p carbon-credit-registry
echo "✅ Contracts built"

echo ""
echo "🚀 Deploying to local network..."

RETIRE_ID=$(stellar contract deploy \
  --wasm target/wasm32v1-none/release/retirement_manager.wasm \
  --network local \
  --source-account local-dev)

REGISTRY_ID=$(stellar contract deploy \
  --wasm target/wasm32v1-none/release/carbon_credit_registry.wasm \
  --network local \
  --source-account local-dev)

echo "✅ Deployed:"
echo "   Registry:   $REGISTRY_ID"
echo "   Retirement: $RETIRE_ID"

# ─── Initialize ─────────────────────────────────────────────
echo ""
echo "⚙️  Initializing contracts..."

stellar contract invoke \
  --id "$RETIRE_ID" \
  --source-account local-dev \
  --network local \
  -- initialize \
  --admin "$LOCAL_ADDRESS" \
  --registry "$REGISTRY_ID"

stellar contract invoke \
  --id "$REGISTRY_ID" \
  --source-account local-dev \
  --network local \
  -- initialize \
  --admin "$LOCAL_ADDRESS" \
  --retire_ctr "$RETIRE_ID"

stellar contract invoke \
  --id "$REGISTRY_ID" \
  --source-account local-dev \
  --network local \
  -- add_issuer \
  --issuer "$LOCAL_ADDRESS"

echo "✅ Contracts initialized"

# ─── Write .env.local ───────────────────────────────────────
ENV_FILE="$ROOT_DIR/frontend/.env.local"
cat > "$ENV_FILE" << EOF
NEXT_PUBLIC_STELLAR_NETWORK=local
NEXT_PUBLIC_SOROBAN_RPC_URL=http://localhost:8000/soroban/rpc
NEXT_PUBLIC_HORIZON_URL=http://localhost:8000
NEXT_PUBLIC_NETWORK_PASSPHRASE="Standalone Network ; February 2017"
NEXT_PUBLIC_REGISTRY_CONTRACT_ID=$REGISTRY_ID
NEXT_PUBLIC_RETIREMENT_CONTRACT_ID=$RETIRE_ID
NEXT_PUBLIC_STELLAR_EXPLORER_URL=http://localhost:8000
NEXT_PUBLIC_EVENT_POLL_INTERVAL_MS=3000
EOF

echo ""
echo "✅ Written to $ENV_FILE"
echo ""
echo "🏁 Start the frontend: cd frontend && npm run dev"
