use soroban_sdk::contracterror;

#[contracterror]
#[derive(Clone, Copy, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum RegistryError {
    NotInit = 1,
    AlreadyInit = 2,
    NotAdmin = 3,
    NotIssuer = 4,
    NotOwner = 5,
    BadAmount = 6,
    BadCredit = 7,
    LowBal = 8,
    Overflow = 9,
}
