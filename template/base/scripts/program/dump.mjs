#!/usr/bin/env zx
import 'zx/globals';
import {
  getExternalProgramAddresses,
  getExternalProgramOutputDir,
} from '../utils.mjs';

// Get input from environment variables.
const rpc = process.env.RPC ?? 'https://api.mainnet-beta.solana.com';
const outputDir = getExternalProgramOutputDir();
await dump();

/** Dump external programs binaries if needed. */
async function dump() {
  // Ensure we have some external programs to dump.
  const addresses = getExternalProgramAddresses();
  if (addresses.length === 0) return;
  echo(`Dumping external accounts to '${outputDir}':`);

  // Create the output directory if needed.
  $`mkdir -p ${outputDir}`.quiet();

  // Copy the binaries from the chain or warn if they are different.
  await Promise.all(
    addresses.map(async (address) => {
      const binary = `${address}.so`;
      const hasBinary = await fs.exists(`${outputDir}/${binary}`);

      if (!hasBinary) {
        await copyFromChain(address, binary);
        echo(`Wrote account data to ${outputDir}/${binary}`);
        return;
      }

      await copyFromChain(address, `onchain-${binary}`);
      const [onChainHash, localHash] = await Promise.all([
        $`sha256sum -b ${outputDir}/onchain-${binary} | cut -d ' ' -f 1`.quiet(),
        $`sha256sum -b ${outputDir}/${binary} | cut -d ' ' -f 1`.quiet(),
      ]);

      if (onChainHash.toString() !== localHash.toString()) {
        echo(
          chalk.yellow('[ WARNING ]'),
          `on-chain and local binaries are different for '${binary}'`
        );
      } else {
        echo(
          chalk.green('[ SKIPPED ]'),
          `on-chain and local binaries are the same for '${binary}'`
        );
      }

      await $`rm ${outputDir}/onchain-${binary}`.quiet();
    })
  );
}

/** Helper function to copy external programs or accounts binaries from the chain. */
async function copyFromChain(address, binary) {
  switch (binary.split('.').pop()) {
    case 'bin':
      return $`solana account -u ${rpc} ${address} -o ${outputDir}/${binary} >/dev/null`.quiet();
    case 'so':
      return $`solana program dump -u ${rpc} ${address} ${outputDir}/${binary} >/dev/null`.quiet();
    default:
      echo(chalk.red(`[  ERROR  ] unknown account type for '${binary}'`));
      await $`exit 1`;
  }
}
