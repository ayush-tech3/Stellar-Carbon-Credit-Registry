#![no_std]

use soroban_sdk::{contract, contractimpl, Address, BytesN, Env, String};

mod access;
mod errors;
mod events;
mod storage;
#[cfg(test)]
mod test;
mod types;

use errors::RegistryError;
use types::CreditInfo;

// Cross-contract import for the retirement manager.
// This import is used at build time; the WASM must be pre-built.
// In tests, we register the retirement contract directly instead.
#[cfg(not(test))]
#[allow(clippy::all, warnings)]
mod retirement {
    soroban_sdk::contractimport!(file = "../target/wasm32v1-none/release/retirement_manager.wasm");
}

#[contract]
pub struct CarbonCreditRegistry;

#[contractimpl]
impl CarbonCreditRegistry {
    // ─── Initialization ─────────────────────────────────────────────────

    /// Initialize the registry with an admin and the retirement manager contract address.
    /// Can only be called once.
    pub fn initialize(env: Env, admin: Address, retire_ctr: Address) -> Result<(), RegistryError> {
        if storage::has_admin(&env) {
            return Err(RegistryError::AlreadyInit);
        }
        admin.require_auth();

        storage::set_admin(&env, &admin);
        storage::set_retire_ctr(&env, &retire_ctr);

        events::emit_initialized(&env, &admin);
        Ok(())
    }

    // ─── Issuer Management ──────────────────────────────────────────────

    /// Admin adds an authorized issuer.
    pub fn add_issuer(env: Env, issuer: Address) -> Result<(), RegistryError> {
        access::require_admin(&env)?;
        storage::set_issuer(&env, &issuer, true);
        events::emit_issuer_added(&env, &issuer);
        Ok(())
    }

    /// Admin removes an authorized issuer.
    pub fn remove_issuer(env: Env, issuer: Address) -> Result<(), RegistryError> {
        access::require_admin(&env)?;
        storage::set_issuer(&env, &issuer, false);
        events::emit_issuer_removed(&env, &issuer);
        Ok(())
    }

    // ─── Credit Issuance ────────────────────────────────────────────────

    /// Issue a new batch of carbon credits. Only authorized issuers may call.
    /// Returns the new credit_id.
    pub fn issue_credits(
        env: Env,
        issuer: Address,
        project: String,
        amount: i128,
        vintage: u32,
        method: String,
    ) -> Result<u64, RegistryError> {
        access::require_initialized(&env)?;
        issuer.require_auth();
        access::require_issuer(&env, &issuer)?;

        if amount <= 0 {
            return Err(RegistryError::BadAmount);
        }

        let credit_id = storage::incr_next_id(&env);

        let credit = CreditInfo {
            id: credit_id,
            issuer: issuer.clone(),
            project: project.clone(),
            amount,
            retired: 0i128,
            vintage,
            method,
            active: true,
        };

        storage::set_credit(&env, &credit);
        storage::set_balance(&env, &issuer, credit_id, amount);

        events::emit_credit_issued(&env, credit_id, &issuer, &project, amount);

        Ok(credit_id)
    }

    // ─── Transfer ───────────────────────────────────────────────────────

    /// Transfer credits from one address to another.
    pub fn transfer(
        env: Env,
        from: Address,
        to: Address,
        credit_id: u64,
        amount: i128,
    ) -> Result<(), RegistryError> {
        access::require_initialized(&env)?;
        from.require_auth();

        if amount <= 0 {
            return Err(RegistryError::BadAmount);
        }

        // Verify credit exists
        let _credit = storage::get_credit(&env, credit_id).ok_or(RegistryError::BadCredit)?;

        // Check sender balance
        let from_bal = storage::get_balance(&env, &from, credit_id);
        if from_bal < amount {
            return Err(RegistryError::LowBal);
        }

        let new_from_bal = from_bal
            .checked_sub(amount)
            .ok_or(RegistryError::Overflow)?;
        let to_bal = storage::get_balance(&env, &to, credit_id);
        let new_to_bal = to_bal.checked_add(amount).ok_or(RegistryError::Overflow)?;

        storage::set_balance(&env, &from, credit_id, new_from_bal);
        storage::set_balance(&env, &to, credit_id, new_to_bal);

        events::emit_credit_transferred(&env, credit_id, &from, &to, amount);

        Ok(())
    }

    // ─── Retirement ─────────────────────────────────────────────────────

    /// Retire credits. Burns them from owner's balance and records in the
    /// retirement manager via cross-contract call. Returns retirement_id.
    pub fn retire(
        env: Env,
        owner: Address,
        credit_id: u64,
        amount: i128,
    ) -> Result<u64, RegistryError> {
        access::require_initialized(&env)?;
        owner.require_auth();

        if amount <= 0 {
            return Err(RegistryError::BadAmount);
        }

        let mut credit = storage::get_credit(&env, credit_id).ok_or(RegistryError::BadCredit)?;

        let owner_bal = storage::get_balance(&env, &owner, credit_id);
        if owner_bal < amount {
            return Err(RegistryError::LowBal);
        }

        // Burn from owner balance
        let new_bal = owner_bal
            .checked_sub(amount)
            .ok_or(RegistryError::Overflow)?;
        storage::set_balance(&env, &owner, credit_id, new_bal);

        // Update retired counter on the credit
        credit.retired = credit
            .retired
            .checked_add(amount)
            .ok_or(RegistryError::Overflow)?;
        storage::set_credit(&env, &credit);

        // Cross-contract call to retirement manager
        let retire_addr = storage::get_retire_ctr(&env);

        #[cfg(not(test))]
        let retirement_id = {
            let retire_client = retirement::Client::new(&env, &retire_addr);
            retire_client.record(
                &credit.id,
                &owner,
                &amount,
                &credit.project,
                &credit.vintage,
            )
        };

        #[cfg(test)]
        let retirement_id = {
            // In tests, we call the retirement manager directly via its dependency client.
            use retirement_manager::RetirementManagerClient as RetireClient;
            let retire_client = RetireClient::new(&env, &retire_addr);
            retire_client.record(
                &credit.id,
                &owner,
                &amount,
                &credit.project,
                &credit.vintage,
            )
        };

        events::emit_credit_retired(&env, credit_id, &owner, amount, retirement_id);

        Ok(retirement_id)
    }

    // ─── Views ──────────────────────────────────────────────────────────

    /// Get credit info by ID.
    pub fn get_credit(env: Env, credit_id: u64) -> Result<CreditInfo, RegistryError> {
        storage::get_credit(&env, credit_id).ok_or(RegistryError::BadCredit)
    }

    /// Get the balance of a specific credit for an owner.
    pub fn get_balance(env: Env, owner: Address, credit_id: u64) -> i128 {
        storage::get_balance(&env, &owner, credit_id)
    }

    // ─── Admin ──────────────────────────────────────────────────────────

    /// Admin-only WASM upgrade.
    pub fn upgrade(env: Env, new_wasm: BytesN<32>) -> Result<(), RegistryError> {
        access::require_admin(&env)?;
        env.deployer().update_current_contract_wasm(new_wasm);
        Ok(())
    }
}
