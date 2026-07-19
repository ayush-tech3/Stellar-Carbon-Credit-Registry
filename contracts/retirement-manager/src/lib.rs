#![no_std]

use soroban_sdk::{contract, contractimpl, Address, BytesN, Env, String, Vec};

mod errors;
mod events;
mod storage;
mod types;
#[cfg(test)]
mod test;

use errors::RetireError;
use types::RetRecord;

#[contract]
pub struct RetirementManager;

#[contractimpl]
impl RetirementManager {
    /// Initialize the contract with an admin and the registry contract address.
    /// Can only be called once.
    pub fn initialize(env: Env, admin: Address, registry: Address) -> Result<(), RetireError> {
        if storage::has_admin(&env) {
            return Err(RetireError::AlreadyInit);
        }
        admin.require_auth();

        storage::set_admin(&env, &admin);
        storage::set_registry(&env, &registry);
        storage::set_total_tons(&env, &0i128);

        events::emit_initialized(&env, &admin);
        Ok(())
    }

    /// Record a retirement event. Only callable by the registered registry contract.
    /// Returns the new retirement_id.
    pub fn record(
        env: Env,
        credit_id: u64,
        owner: Address,
        amount: i128,
        project: String,
        vintage: u32,
    ) -> Result<u64, RetireError> {
        if !storage::has_admin(&env) {
            return Err(RetireError::NotInit);
        }
        if amount <= 0 {
            return Err(RetireError::BadAmount);
        }

        // Only the registry contract may call this
        let registry = storage::get_registry(&env);
        registry.require_auth();

        let retirement_id = storage::incr_next_id(&env);

        let record = RetRecord {
            id: retirement_id,
            credit_id,
            owner: owner.clone(),
            amount,
            project,
            vintage,
            timestamp: env.ledger().timestamp(),
        };

        storage::set_record(&env, &record);

        // Update owner index
        let mut ids = storage::get_owner_index(&env, &owner);
        ids.push_back(retirement_id);
        storage::set_owner_index(&env, &owner, &ids);

        // Update global total
        let current_total = storage::get_total_tons(&env);
        let new_total = current_total
            .checked_add(amount)
            .ok_or(RetireError::Overflow)?;
        storage::set_total_tons(&env, &new_total);

        events::emit_retirement_recorded(&env, retirement_id, credit_id, &owner, amount);

        Ok(retirement_id)
    }

    /// Get a specific retirement record by ID.
    pub fn get_record(env: Env, retirement_id: u64) -> Result<RetRecord, RetireError> {
        storage::get_record(&env, retirement_id).ok_or(RetireError::BadId)
    }

    /// Get the global total CO2 tons retired.
    pub fn get_total(env: Env) -> i128 {
        storage::get_total_tons(&env)
    }

    /// Get all retirement IDs belonging to an owner.
    pub fn get_by_owner(env: Env, owner: Address) -> Vec<u64> {
        storage::get_owner_index(&env, &owner)
    }

    /// Get the total number of retirement records.
    pub fn get_count(env: Env) -> u64 {
        storage::get_next_id(&env)
    }

    /// Admin-only WASM upgrade.
    pub fn upgrade(env: Env, new_wasm: BytesN<32>) -> Result<(), RetireError> {
        if !storage::has_admin(&env) {
            return Err(RetireError::NotInit);
        }
        let admin = storage::get_admin(&env);
        admin.require_auth();
        env.deployer().update_current_contract_wasm(new_wasm);
        Ok(())
    }
}
