use soroban_sdk::contracterror;

#[contracterror]
#[derive(Clone, Copy, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum RetireError {
    NotInit = 1,
    AlreadyInit = 2,
    NotAdmin = 3,
    NotReg = 4,
    BadAmount = 5,
    BadId = 6,
    Overflow = 7,
}
