#!/usr/bin/env zx
import 'zx/globals';
import { workingDirectory, getProgramFolders } from '../utils.mjs';

// Save external programs binaries to the output directory.
import './dump.mjs';

const hasSolfmt = await which('solfmt', { nothrow: true });
// Test the programs.
for (const folder of getProgramFolders()) {
  cd(`${path.join(workingDirectory, folder)}`);

  if (hasSolfmt) {
    await $`RUST_LOG=error cargo test-sbf ${process.argv.slice(3)} 2>&1 | solfmt`;
  } else {
    await $`RUST_LOG=error cargo test-sbf ${process.argv.slice(3)}`;
  }
}
