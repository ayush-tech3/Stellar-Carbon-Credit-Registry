use soroban_sdk::{symbol_short, Address, Env, String};

pub fn emit_initialized(env: &Env, admin: &Address) {
    env.events()
        .publish((symbol_short!("init"),), admin.clone());
}

pub fn emit_credit_issued(
    env: &Env,
    credit_id: u64,
    issuer: &Address,
    project: &String,
    amount: i128,
) {
    env.events().publish(
        (symbol_short!("issued"), credit_id),
        (issuer.clone(), project.clone(), amount),
    );
}

pub fn emit_credit_transferred(
    env: &Env,
    credit_id: u64,
    from: &Address,
    to: &Address,
    amount: i128,
) {
    env.events().publish(
        (symbol_short!("xfer"), credit_id),
        (from.clone(), to.clone(), amount),
    );
}

pub fn emit_credit_retired(
    env: &Env,
    credit_id: u64,
    owner: &Address,
    amount: i128,
    retirement_id: u64,
) {
    env.events().publish(
        (symbol_short!("retire"), credit_id),
        (owner.clone(), amount, retirement_id),
    );
}

pub fn emit_issuer_added(env: &Env, issuer: &Address) {
    env.events()
        .publish((symbol_short!("add_iss"),), issuer.clone());
}

pub fn emit_issuer_removed(env: &Env, issuer: &Address) {
    env.events()
        .publish((symbol_short!("rem_iss"),), issuer.clone());
}
