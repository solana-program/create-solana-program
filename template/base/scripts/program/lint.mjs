#!/usr/bin/env zx
import "zx/globals";
import { workingDirectory, getProgramFolders } from "../utils.mjs";

// Lint the programs using clippy.
await Promise.all(
  getProgramFolders().map(async (folder) => {
    await $`cd ${path.join(workingDirectory, folder)}`.quiet();
    await $`cargo clippy ${argv._}`;
  })
);
