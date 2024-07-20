#!/usr/bin/env zx
import "zx/globals";
import { getExternalProgramOutputDir } from "../utils.mjs";

// Remove the programs output directories.
const externalProgramOutput = getExternalProgramOutputDir();
await $`rm -rf ${externalProgramOutput}`;

// Remove the target directory.
await $`rm -rf target`;
