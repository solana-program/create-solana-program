#!/usr/bin/env zx
import 'zx/globals';
import { workingDirectory } from '../utils.mjs';

// Start the local validator if it's not already running.
await $`pnpm validator:restart`;

// Run the tests.
cd(path.join(workingDirectory, 'clients', 'rust'));
const hasSolfmt = await which('solfmt', { nothrow: true });
if (hasSolfmt) {
  await $`cargo test-sbf ${argv._} 2>&1 | solfmt`;
} else {
  await $`cargo test-sbf ${argv._}`;
}
