#!/usr/bin/env zx
import 'zx/globals';
import {
  cliArguments,
  getProgramFolders,
  getToolchainArgument,
  partitionArguments,
  popArgument,
  workingDirectory,
} from '../utils.mjs';

// Configure additional arguments here, e.g.:
// ['--arg1', '--arg2', ...cliArguments()]
const formatArgs = cliArguments();

const fix = popArgument(formatArgs, '--fix');
const [cargoArgs, fmtArgs] = partitionArguments(formatArgs, '--');
const toolchain = getToolchainArgument('format');

// Format the programs.
await Promise.all(
  getProgramFolders().map(async (folder) => {
    const manifestPath = path.join(workingDirectory, folder, 'Cargo.toml');

    if (fix) {
      await $`cargo ${toolchain} fmt --manifest-path ${manifestPath} ${cargoArgs} -- ${fmtArgs}`;
    } else {
      await $`cargo ${toolchain} fmt --manifest-path ${manifestPath} ${cargoArgs} -- --check ${fmtArgs}`;
    }
  })
);
