#!/usr/bin/env zx
import "zx/globals";
import { workingDirectory, getProgramFolders } from "../utils.mjs";

// Format the programs.
await Promise.all(
  getProgramFolders().map(async (folder) => {
    await $`cd ${path.join(workingDirectory, folder)}`.quiet();
    await $`cargo fmt ${argv._}`;
  })
);
