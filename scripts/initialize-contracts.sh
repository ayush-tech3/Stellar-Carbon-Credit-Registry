#!/bin/bash
# ============================================================
# Initialize Contracts (post-deployment)
# ============================================================
# Use this after deploying contracts to initialize them with
# cross-references and register the initial issuer.
# ============================================================

set -euo pipefail

IDENTITY="${STELLAR_IDENTITY:-deployer}"
NETWORK="${STELLAR_NETWORK:-testnet}"

if [ -z "${REGISTRY_CONTRACT_ID:-}" ] || [ -z "${RETIREMENT_CONTRACT_ID:-}" ]; then
  echo "❌ Error: Set REGISTRY_CONTRACT_ID and RETIREMENT_CONTRACT_ID env vars"
  echo ""
  echo "Usage:"
  echo "  REGISTRY_CONTRACT_ID=C... RETIREMENT_CONTRACT_ID=C... ./initialize-contracts.sh"
  exit 1
fi

ADMIN_ADDRESS=$(stellar keys address "$IDENTITY" 2>&1)

echo "⚙️  Initializing contracts on $NETWORK..."
echo "   Admin: $ADMIN_ADDRESS"
echo "   Registry: $REGISTRY_CONTRACT_ID"
echo "   Retirement: $RETIREMENT_CONTRACT_ID"
echo ""

# Initialize retirement-manager
echo "1/3 Initializing retirement-manager..."
stellar contract invoke \
  --id "$RETIREMENT_CONTRACT_ID" \
  --source-account "$IDENTITY" \
  --network "$NETWORK" \
  -- initialize \
  --admin "$ADMIN_ADDRESS" \
  --registry "$REGISTRY_CONTRACT_ID"
echo "✅ Done"

# Initialize carbon-credit-registry
echo "2/3 Initializing carbon-credit-registry..."
stellar contract invoke \
  --id "$REGISTRY_CONTRACT_ID" \
  --source-account "$IDENTITY" \
  --network "$NETWORK" \
  -- initialize \
  --admin "$ADMIN_ADDRESS" \
  --retire_ctr "$RETIREMENT_CONTRACT_ID"
echo "✅ Done"

# Register deployer as issuer
echo "3/3 Registering admin as issuer..."
stellar contract invoke \
  --id "$REGISTRY_CONTRACT_ID" \
  --source-account "$IDENTITY" \
  --network "$NETWORK" \
  -- add_issuer \
  --issuer "$ADMIN_ADDRESS"
echo "✅ Done"

echo ""
echo "🎉 All contracts initialized successfully!"
