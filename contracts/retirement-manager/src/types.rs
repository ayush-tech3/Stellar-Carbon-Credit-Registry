use soroban_sdk::{contracttype, Address, String};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    Registry,
    NextId,
    TotalTons,
    Record(u64),
    OwnerIdx(Address),
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RetRecord {
    pub id: u64,
    pub credit_id: u64,
    pub owner: Address,
    pub amount: i128,
    pub project: String,
    pub vintage: u32,
    pub timestamp: u64,
}
