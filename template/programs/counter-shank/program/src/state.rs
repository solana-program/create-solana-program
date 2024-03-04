use borsh::{BorshDeserialize, BorshSerialize};
use shank::ShankAccount;
use solana_program::account_info::AccountInfo;
use solana_program::entrypoint::ProgramResult;
use solana_program::msg;
use solana_program::program_error::ProgramError;
use solana_program::pubkey::Pubkey;

use crate::error::CounterError;

#[derive(Clone, BorshSerialize, BorshDeserialize, Debug)]
pub enum Key {
    Uninitialized,
    Counter,
}

#[repr(C)]
#[derive(Clone, BorshSerialize, BorshDeserialize, Debug, ShankAccount)]
pub struct Counter {
    pub key: Key,
    pub authority: Pubkey,
    pub value: u32,
}

impl Counter {
    pub const LEN: usize = 1 + 32 + 4;

    pub fn seeds(authority: &Pubkey) -> Vec<&[u8]> {
        vec!["counter".as_bytes(), authority.as_ref()]
    }

    pub fn find_pda(authority: &Pubkey) -> (Pubkey, u8) {
        Pubkey::find_program_address(&Self::seeds(authority), &crate::ID)
    }

    pub fn load(account: &AccountInfo) -> Result<Self, ProgramError> {
        let mut bytes: &[u8] = &(*account.data).borrow();
        Counter::deserialize(&mut bytes).map_err(|error| {
            msg!("Error: {}", error);
            CounterError::DeserializationError.into()
        })
    }

    pub fn save(&self, account: &AccountInfo) -> ProgramResult {
        borsh::to_writer(&mut account.data.borrow_mut()[..], self).map_err(|error| {
            msg!("Error: {}", error);
            CounterError::SerializationError.into()
        })
    }
}
