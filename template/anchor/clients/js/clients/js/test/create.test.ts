import {
  Account,
  appendTransactionMessageInstruction,
  generateKeyPairSigner,
  pipe,
} from '@solana/web3.js';
import test from 'ava';
import { Counter, fetchCounter, getCreateInstruction } from '../src';
import {
  createDefaultSolanaClient,
  createDefaultTransaction,
  generateKeyPairSignerWithSol,
  signAndSendTransaction,
} from './_setup';

test('it creates a new counter account', async (t) => {
  // Given an authority key pair with some SOL.
  const client = createDefaultSolanaClient();
  const [authority, counter] = await Promise.all([
    generateKeyPairSignerWithSol(client),
    generateKeyPairSigner(),
  ]);

  // When we create a new counter account.
  const createIx = getCreateInstruction({
    authority: authority.address,
    counter,
    payer: authority,
  });
  await pipe(
    await createDefaultTransaction(client, authority),
    (tx) => appendTransactionMessageInstruction(createIx, tx),
    (tx) => signAndSendTransaction(client, tx)
  );

  // Then we expect the counter account to exist and have a value of 0.
  t.like(await fetchCounter(client.rpc, counter.address), <Account<Counter>>{
    data: {
      authority: authority.address,
      count: 0n,
    },
  });
});
