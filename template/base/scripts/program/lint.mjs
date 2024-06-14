#!/usr/bin/env zx
import 'zx/globals';
import { workingDirectory, getProgramFolders } from '../utils.mjs';

// Lint the programs using clippy.
await Promise.all(
  getProgramFolders().map(async (folder) => {
    cd(`${path.join(workingDirectory, folder)}`);
    await $`cargo clippy ${process.argv.slice(3)}`;
  })
);
