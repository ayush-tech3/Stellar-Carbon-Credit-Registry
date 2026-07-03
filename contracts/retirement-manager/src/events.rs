use soroban_sdk::{symbol_short, Address, Env};

pub fn emit_initialized(env: &Env, admin: &Address) {
    env.events()
        .publish((symbol_short!("init"),), admin.clone());
}

pub fn emit_retirement_recorded(
    env: &Env,
    retirement_id: u64,
    credit_id: u64,
    owner: &Address,
    amount: i128,
) {
    env.events().publish(
        (symbol_short!("retired"), retirement_id),
        (credit_id, owner.clone(), amount),
    );
}
