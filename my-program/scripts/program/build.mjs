#!/usr/bin/env zx
import "zx/globals";
import { workingDirectory, getProgramFolders } from "../utils.mjs";

// Save external programs binaries to the output directory.
import "./dump.mjs";

// Build the programs.
await Promise.all(
  getProgramFolders().map(async (folder) => {
    await $`cd ${path.join(workingDirectory, folder)}`.quiet();
    await $`cargo build-sbf ${argv._}`;
  })
);
