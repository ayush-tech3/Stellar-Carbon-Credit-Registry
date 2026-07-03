use soroban_sdk::{contracttype, Address, String};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    RetireCtr,
    NextId,
    Issuer(Address),
    Credit(u64),
    Balance(Address, u64),
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CreditInfo {
    pub id: u64,
    pub issuer: Address,
    pub project: String,
    pub amount: i128,
    pub retired: i128,
    pub vintage: u32,
    pub method: String,
    pub active: bool,
}
