import { appendTransactionInstruction, lamports, pipe } from '@solana/web3.js';
import test from 'ava';
import {
  fetchCounter,
  findCounterPda,
  getIncrementInstruction,
  getIncrementInstructionAsync,
} from '../src';
import {
  createCounterForAuthority,
  createDefaultSolanaClient,
  createDefaultTransaction,
  generateKeyPairSignerWithSol,
  getBalance,
  signAndSendTransaction,
} from './_setup';

test('it increments an existing counter by 1 by default', async (t) => {
  // Given an authority key pair with an associated counter account of value 0.
  const client = createDefaultSolanaClient();
  const authority = await generateKeyPairSignerWithSol(client);
  const [counterPda] = await createCounterForAuthority(client, authority);
  t.is((await fetchCounter(client.rpc, counterPda)).data.value, 0);

  // When we increment the counter account.
  const incrementIx = await getIncrementInstructionAsync({ authority });
  await pipe(
    await createDefaultTransaction(client, authority),
    (tx) => appendTransactionInstruction(incrementIx, tx),
    (tx) => signAndSendTransaction(client, tx)
  );

  // Then we expect the counter account to have a value of 1.
  const counter = await fetchCounter(client.rpc, counterPda);
  t.is(counter.data.value, 1);
});

test('it can increment an existing counter by a specified amount', async (t) => {
  // Given an authority key pair with an associated counter account of value 0.
  const client = createDefaultSolanaClient();
  const authority = await generateKeyPairSignerWithSol(client);
  const [counterPda] = await createCounterForAuthority(client, authority);
  t.is((await fetchCounter(client.rpc, counterPda)).data.value, 0);

  // When we increment the counter account by 5.
  const incrementIx = await getIncrementInstructionAsync({
    authority,
    amount: 5,
  });
  await pipe(
    await createDefaultTransaction(client, authority),
    (tx) => appendTransactionInstruction(incrementIx, tx),
    (tx) => signAndSendTransaction(client, tx)
  );

  // Then we expect the counter account to have a value of 5.
  const counter = await fetchCounter(client.rpc, counterPda);
  t.is(counter.data.value, 5);
});

test('it cannot increment a counter that does not exist', async (t) => {
  // Given an authority key pair with no associated counter account.
  const client = createDefaultSolanaClient();
  const authority = await generateKeyPairSignerWithSol(client);
  const [counterPda] = await findCounterPda({ authority: authority.address });
  t.is(await getBalance(client, counterPda), lamports(0n));

  // When we try to increment the inexistent counter account.
  const incrementIx = await getIncrementInstructionAsync({ authority });
  const promise = pipe(
    await createDefaultTransaction(client, authority),
    (tx) => appendTransactionInstruction(incrementIx, tx),
    (tx) => signAndSendTransaction(client, tx)
  );

  // Then we expect the program to throw an error.
  const error = await t.throwsAsync<Error & { data: { logs: string[] } }>(
    promise,
    { message: /Error processing Instruction 0: custom program error: 0x2/ }
  );
  t.regex(
    error.data.logs.join('\n'),
    /Account "counter" \[.+\] expected program owner \[MyProgram1111111111111111111111111111111111\], got \[11111111111111111111111111111111\]/
  );
});

test('it cannot increment a counter that belongs to another authority', async (t) => {
  // Given two authority key pairs such that
  // only one of them (authority A) is associated with a counter account.
  const client = createDefaultSolanaClient();
  const [authorityA, authorityB] = await Promise.all([
    generateKeyPairSignerWithSol(client),
    generateKeyPairSignerWithSol(client),
  ]);
  const [counterPda] = await createCounterForAuthority(client, authorityA);

  // When authority B tries to increment the counter account of authority A.
  const incrementIx = getIncrementInstruction({
    authority: authorityB,
    counter: counterPda,
  });
  const promise = pipe(
    await createDefaultTransaction(client, authorityB),
    (tx) => appendTransactionInstruction(incrementIx, tx),
    (tx) => signAndSendTransaction(client, tx)
  );

  // Then we expect the program to throw an error.
  const error = await t.throwsAsync<Error & { data: { logs: string[] } }>(
    promise,
    { message: /Error processing Instruction 0: custom program error: 0x3/ }
  );
  t.regex(
    error.data.logs.join('\n'),
    /Account "counter" \[.+\] is an invalid PDA. Expected the following valid PDA \[.+\]/
  );
});
