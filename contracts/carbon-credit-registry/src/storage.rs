use soroban_sdk::{Address, Env};

use crate::types::{CreditInfo, DataKey};

// ── Instance storage ──

pub fn has_admin(env: &Env) -> bool {
    env.storage().instance().has(&DataKey::Admin)
}

pub fn get_admin(env: &Env) -> Address {
    env.storage().instance().get(&DataKey::Admin).unwrap()
}

pub fn set_admin(env: &Env, admin: &Address) {
    env.storage().instance().set(&DataKey::Admin, admin);
}

pub fn get_retire_ctr(env: &Env) -> Address {
    env.storage().instance().get(&DataKey::RetireCtr).unwrap()
}

pub fn set_retire_ctr(env: &Env, addr: &Address) {
    env.storage().instance().set(&DataKey::RetireCtr, addr);
}

pub fn get_next_id(env: &Env) -> u64 {
    env.storage()
        .instance()
        .get(&DataKey::NextId)
        .unwrap_or(0)
}

pub fn incr_next_id(env: &Env) -> u64 {
    let id = get_next_id(env);
    env.storage()
        .instance()
        .set(&DataKey::NextId, &(id + 1));
    id
}

// ── Persistent storage ──

pub fn is_issuer(env: &Env, addr: &Address) -> bool {
    let key = DataKey::Issuer(addr.clone());
    env.storage()
        .persistent()
        .get(&key)
        .unwrap_or(false)
}

pub fn set_issuer(env: &Env, addr: &Address, authorized: bool) {
    let key = DataKey::Issuer(addr.clone());
    env.storage().persistent().set(&key, &authorized);
}

pub fn get_credit(env: &Env, id: u64) -> Option<CreditInfo> {
    let key = DataKey::Credit(id);
    env.storage().persistent().get(&key)
}

pub fn set_credit(env: &Env, credit: &CreditInfo) {
    let key = DataKey::Credit(credit.id);
    env.storage().persistent().set(&key, credit);
}

pub fn get_balance(env: &Env, owner: &Address, credit_id: u64) -> i128 {
    let key = DataKey::Balance(owner.clone(), credit_id);
    env.storage()
        .persistent()
        .get(&key)
        .unwrap_or(0i128)
}

pub fn set_balance(env: &Env, owner: &Address, credit_id: u64, amount: i128) {
    let key = DataKey::Balance(owner.clone(), credit_id);
    env.storage().persistent().set(&key, &amount);
}
