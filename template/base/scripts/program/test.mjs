#!/usr/bin/env zx
import 'zx/globals';
import { workingDirectory, getProgramFolders } from '../utils.mjs';

// Save external programs binaries to the output directory.
import './dump.mjs';

// Test the programs.
await Promise.all(
  getProgramFolders().map(async (folder) => {
    await $`cd ${path.join(workingDirectory, folder)}`.quiet();
    const hasSolfmt = await which('solfmt', { nothrow: true });

    if (hasSolfmt) {
      await $`RUST_LOG=error cargo test-sbf ${argv._} 2>&1 | solfmt`;
    } else {
      await $`RUST_LOG=error cargo test-sbf ${argv._}`;
    }
  })
);
