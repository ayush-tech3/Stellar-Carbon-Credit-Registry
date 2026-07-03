use soroban_sdk::{Address, Env};

use crate::errors::RegistryError;
use crate::storage;

/// Panics if the contract is not initialized.
pub fn require_initialized(env: &Env) -> Result<(), RegistryError> {
    if !storage::has_admin(env) {
        return Err(RegistryError::NotInit);
    }
    Ok(())
}

/// Requires the stored admin to authorize the current invocation.
pub fn require_admin(env: &Env) -> Result<(), RegistryError> {
    require_initialized(env)?;
    let admin = storage::get_admin(env);
    admin.require_auth();
    Ok(())
}

/// Checks that the given address is an authorized issuer.
pub fn require_issuer(env: &Env, addr: &Address) -> Result<(), RegistryError> {
    if !storage::is_issuer(env, addr) {
        return Err(RegistryError::NotIssuer);
    }
    Ok(())
}
