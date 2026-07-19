#![cfg(test)]

use soroban_sdk::{testutils::Address as _, Address, Env, String};

use crate::{CarbonCreditRegistry, CarbonCreditRegistryClient};

// Re-export the retirement manager so lib.rs can use it in cfg(test) blocks.
pub(crate) mod retirement_manager {
    soroban_sdk::contractimport!(
        file = "../target/wasm32-unknown-unknown/release/retirement_manager.wasm"
    );
}

/// Helper: set up the test environment with both contracts registered.
fn setup_env() -> (
    Env,
    Address,                          // registry contract id
    CarbonCreditRegistryClient<'static>,
    Address,                          // retirement contract id
) {
    let env = Env::default();
    env.mock_all_auths();

    let registry_id = env.register(CarbonCreditRegistry, ());
    let registry_client = CarbonCreditRegistryClient::new(&env, &registry_id);

    // Register the retirement manager from its WASM
    let retire_id = env.register(retirement_manager::WASM, ());

    (env, registry_id, registry_client, retire_id)
}

/// Helper: initialize both contracts.
fn init_contracts(
    env: &Env,
    registry_client: &CarbonCreditRegistryClient,
    retire_id: &Address,
    registry_id: &Address,
) -> Address {
    let admin = Address::generate(env);

    registry_client.initialize(&admin, retire_id);

    // Initialize retirement manager
    let retire_client = retirement_manager::Client::new(env, retire_id);
    retire_client.initialize(&admin, registry_id);

    admin
}

// ─── Tests ──────────────────────────────────────────────────────────────────

#[test]
fn test_initialize() {
    let (env, registry_id, client, retire_id) = setup_env();
    let admin = Address::generate(&env);

    client.initialize(&admin, &retire_id);

    // Double init should fail
    let result = client.try_initialize(&admin, &retire_id);
    assert!(result.is_err());

    // Verify we can call get_balance without error (contract is alive)
    let bal = client.get_balance(&admin, &0u64);
    assert_eq!(bal, 0i128);

    let _ = registry_id; // suppress unused warning
}

#[test]
fn test_issue_credits() {
    let (env, registry_id, client, retire_id) = setup_env();
    let admin = init_contracts(&env, &client, &retire_id, &registry_id);

    let issuer = Address::generate(&env);
    client.add_issuer(&issuer);

    let project = String::from_str(&env, "Solar Farm Alpha");
    let method = String::from_str(&env, "PV Panel");
    let amount: i128 = 1_000;
    let vintage: u32 = 2024;

    let credit_id = client.issue_credits(&issuer, &project, &amount, &vintage, &method);
    assert_eq!(credit_id, 0);

    // Verify credit info
    let credit = client.get_credit(&credit_id);
    assert_eq!(credit.issuer, issuer);
    assert_eq!(credit.amount, 1_000i128);
    assert_eq!(credit.retired, 0i128);
    assert_eq!(credit.vintage, 2024);
    assert_eq!(credit.active, true);

    // Issuer should hold the full balance
    let bal = client.get_balance(&issuer, &credit_id);
    assert_eq!(bal, 1_000i128);
}

#[test]
fn test_transfer() {
    let (env, registry_id, client, retire_id) = setup_env();
    let admin = init_contracts(&env, &client, &retire_id, &registry_id);

    let issuer = Address::generate(&env);
    client.add_issuer(&issuer);

    let project = String::from_str(&env, "Wind Farm Beta");
    let method = String::from_str(&env, "Turbine");

    let credit_id = client.issue_credits(&issuer, &project, &500i128, &2025u32, &method);

    let buyer = Address::generate(&env);

    // Transfer 200 from issuer to buyer
    client.transfer(&issuer, &buyer, &credit_id, &200i128);

    assert_eq!(client.get_balance(&issuer, &credit_id), 300i128);
    assert_eq!(client.get_balance(&buyer, &credit_id), 200i128);

    // Transfer remaining
    client.transfer(&issuer, &buyer, &credit_id, &300i128);
    assert_eq!(client.get_balance(&issuer, &credit_id), 0i128);
    assert_eq!(client.get_balance(&buyer, &credit_id), 500i128);

    let _ = admin;
}

#[test]
fn test_unauthorized_issue() {
    let (env, registry_id, client, retire_id) = setup_env();
    let _admin = init_contracts(&env, &client, &retire_id, &registry_id);

    // This address is NOT an authorized issuer
    let random = Address::generate(&env);
    let project = String::from_str(&env, "Fake Project");
    let method = String::from_str(&env, "None");

    let result = client.try_issue_credits(&random, &project, &100i128, &2024u32, &method);
    assert!(result.is_err()); // NotIssuer
}

#[test]
fn test_transfer_insufficient_balance() {
    let (env, registry_id, client, retire_id) = setup_env();
    let _admin = init_contracts(&env, &client, &retire_id, &registry_id);

    let issuer = Address::generate(&env);
    client.add_issuer(&issuer);

    let project = String::from_str(&env, "Hydro Project");
    let method = String::from_str(&env, "Hydro");

    let credit_id = client.issue_credits(&issuer, &project, &100i128, &2024u32, &method);

    let buyer = Address::generate(&env);

    // Try to transfer more than available
    let result = client.try_transfer(&issuer, &buyer, &credit_id, &200i128);
    assert!(result.is_err()); // LowBal
}

#[test]
fn test_retire_cross_contract() {
    let (env, registry_id, client, retire_id) = setup_env();
    let _admin = init_contracts(&env, &client, &retire_id, &registry_id);

    let issuer = Address::generate(&env);
    client.add_issuer(&issuer);

    let project = String::from_str(&env, "Reforestation Gamma");
    let method = String::from_str(&env, "TreePlant");

    let credit_id = client.issue_credits(&issuer, &project, &1_000i128, &2024u32, &method);

    // Retire 400 credits
    let retirement_id = client.retire(&issuer, &credit_id, &400i128);
    assert_eq!(retirement_id, 0);

    // Issuer balance should decrease
    assert_eq!(client.get_balance(&issuer, &credit_id), 600i128);

    // Credit retired counter should increase
    let credit = client.get_credit(&credit_id);
    assert_eq!(credit.retired, 400i128);

    // Verify on the retirement manager side
    let retire_client = retirement_manager::Client::new(&env, &retire_id);
    let record = retire_client.get_record(&retirement_id);
    assert_eq!(record.credit_id, credit_id);
    assert_eq!(record.amount, 400i128);
    assert_eq!(record.owner, issuer);

    assert_eq!(retire_client.get_total(), 400i128);
    assert_eq!(retire_client.get_count(), 1);
}

#[test]
fn test_issuer_add_remove() {
    let (env, registry_id, client, retire_id) = setup_env();
    let _admin = init_contracts(&env, &client, &retire_id, &registry_id);

    let issuer = Address::generate(&env);

    // Add issuer, issue credits should work
    client.add_issuer(&issuer);
    let project = String::from_str(&env, "Test Project");
    let method = String::from_str(&env, "Test");
    let _id = client.issue_credits(&issuer, &project, &100i128, &2024u32, &method);

    // Remove issuer, issue should now fail
    client.remove_issuer(&issuer);
    let result = client.try_issue_credits(&issuer, &project, &100i128, &2024u32, &method);
    assert!(result.is_err()); // NotIssuer
}
