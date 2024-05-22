use borsh::{BorshDeserialize, BorshSerialize};
use shank::{ShankContext, ShankInstruction};

#[derive(BorshDeserialize, BorshSerialize, Clone, Debug, ShankContext, ShankInstruction)]
#[rustfmt::skip]
pub enum CounterInstruction {
    /// Creates the counter account derived from the provided authority.
    #[account(0, writable, name="counter", desc = "The program derived address of the counter account to create (seeds: ['counter', authority])")]
    #[account(1, signer, name="authority", desc = "The authority of the counter")]
    #[account(2, writable, signer, name="payer", desc = "The account paying for the storage fees")]
    #[account(3, name="system_program", desc = "The system program")]
    Create,

    /// Increments the counter by the provided amount or 1 if no amount is provided.
    #[account(0, writable, name="counter", desc = "The program derived address of the counter account to increment (seeds: ['counter', authority])")]
    #[account(1, signer, name="authority", desc = "The authority of the counter")]
    Increment { amount: Option<u32> },
}
