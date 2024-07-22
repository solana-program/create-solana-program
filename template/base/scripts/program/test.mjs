#!/usr/bin/env zx
import 'zx/globals';
import {
  cliArguments,
  getProgramFolders,
  workingDirectory,
} from '../utils.mjs';

// Save external programs binaries to the output directory.
import './dump.mjs';

// Configure additional arguments here, e.g.:
// ['--arg1', '--arg2', ...cliArguments()]
const testArgs = cliArguments();

const hasSolfmt = await which('solfmt', { nothrow: true });

// Test the programs.
await Promise.all(
  getProgramFolders().map(async (folder) => {
    const manifestPath = path.join(workingDirectory, folder, 'Cargo.toml');

    if (hasSolfmt) {
      await $`RUST_LOG=error cargo test-sbf --manifest-path ${manifestPath} ${testArgs} 2>&1 | solfmt`;
    } else {
      await $`RUST_LOG=error cargo test-sbf --manifest-path ${manifestPath} ${testArgs}`;
    }
  })
);
