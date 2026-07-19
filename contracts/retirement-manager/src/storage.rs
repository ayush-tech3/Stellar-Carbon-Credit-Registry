use soroban_sdk::{Address, Env, Vec};

use crate::types::{DataKey, RetRecord};

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

pub fn get_registry(env: &Env) -> Address {
    env.storage().instance().get(&DataKey::Registry).unwrap()
}

pub fn set_registry(env: &Env, registry: &Address) {
    env.storage().instance().set(&DataKey::Registry, registry);
}

pub fn get_next_id(env: &Env) -> u64 {
    env.storage().instance().get(&DataKey::NextId).unwrap_or(0)
}

pub fn incr_next_id(env: &Env) -> u64 {
    let id = get_next_id(env);
    env.storage().instance().set(&DataKey::NextId, &(id + 1));
    id
}

pub fn get_total_tons(env: &Env) -> i128 {
    env.storage()
        .instance()
        .get(&DataKey::TotalTons)
        .unwrap_or(0i128)
}

pub fn set_total_tons(env: &Env, total: &i128) {
    env.storage().instance().set(&DataKey::TotalTons, total);
}

// ── Persistent storage ──

pub fn get_record(env: &Env, id: u64) -> Option<RetRecord> {
    let key = DataKey::Record(id);
    env.storage().persistent().get(&key)
}

pub fn set_record(env: &Env, record: &RetRecord) {
    let key = DataKey::Record(record.id);
    env.storage().persistent().set(&key, record);
}

pub fn get_owner_index(env: &Env, owner: &Address) -> Vec<u64> {
    let key = DataKey::OwnerIdx(owner.clone());
    env.storage()
        .persistent()
        .get(&key)
        .unwrap_or(Vec::new(env))
}

pub fn set_owner_index(env: &Env, owner: &Address, ids: &Vec<u64>) {
    let key = DataKey::OwnerIdx(owner.clone());
    env.storage().persistent().set(&key, ids);
}
