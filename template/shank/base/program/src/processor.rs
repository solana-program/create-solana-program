use borsh::BorshDeserialize;
use solana_program::{
    account_info::AccountInfo, entrypoint::ProgramResult, msg, pubkey::Pubkey, system_program,
};

use crate::assertions::{
    assert_pda, assert_program_owner, assert_same_pubkeys, assert_signer, assert_writable,
};
use crate::instruction::accounts::{CreateAccounts, IncrementAccounts};
use crate::instruction::CounterInstruction;
use crate::state::{Counter, Key};
use crate::utils::create_account;

pub fn process_instruction<'a>(
    _program_id: &Pubkey,
    accounts: &'a [AccountInfo<'a>],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction: CounterInstruction = CounterInstruction::try_from_slice(instruction_data)?;
    match instruction {
        CounterInstruction::Create => {
            msg!("Instruction: Create");
            create(accounts)
        }
        CounterInstruction::Increment { amount } => {
            msg!("Instruction: Increment");
            increment(accounts, amount)
        }
    }
}

fn create<'a>(accounts: &'a [AccountInfo<'a>]) -> ProgramResult {
    // Accounts.
    let ctx = CreateAccounts::context(accounts)?;

    // Guards.
    let counter_bump = assert_pda(
        "counter",
        ctx.accounts.counter,
        &crate::ID,
        &Counter::seeds(ctx.accounts.authority.key),
    )?;
    assert_signer("authority", ctx.accounts.authority)?;
    assert_signer("payer", ctx.accounts.payer)?;
    assert_writable("payer", ctx.accounts.payer)?;
    assert_same_pubkeys(
        "system_program",
        ctx.accounts.system_program,
        &system_program::id(),
    )?;

    // Do nothing if the domain already exists.
    if !ctx.accounts.counter.data_is_empty() {
        return Ok(());
    }

    // Create Counter PDA.
    let counter = Counter {
        key: Key::Counter,
        authority: *ctx.accounts.authority.key,
        value: 0,
    };
    let mut seeds = Counter::seeds(ctx.accounts.authority.key);
    let bump = [counter_bump];
    seeds.push(&bump);
    create_account(
        ctx.accounts.counter,
        ctx.accounts.payer,
        ctx.accounts.system_program,
        Counter::LEN,
        &crate::ID,
        Some(&[&seeds]),
    )?;

    counter.save(ctx.accounts.counter)
}

fn increment<'a>(accounts: &'a [AccountInfo<'a>], amount: Option<u32>) -> ProgramResult {
    // Accounts.
    let ctx = IncrementAccounts::context(accounts)?;

    // Guards.
    assert_signer("authority", ctx.accounts.authority)?;
    assert_pda(
        "counter",
        ctx.accounts.counter,
        &crate::ID,
        &Counter::seeds(ctx.accounts.authority.key),
    )?;
    assert_program_owner("counter", ctx.accounts.counter, &crate::ID)?;
    let mut counter = Counter::load(ctx.accounts.counter)?;
    assert_same_pubkeys("authority", ctx.accounts.authority, &counter.authority)?;

    // Increment Counter PDA.
    counter.value += amount.unwrap_or(1);
    counter.save(ctx.accounts.counter)
}
