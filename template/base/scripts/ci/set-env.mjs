#!/usr/bin/env zx
import { getToolchain } from '../utils.mjs';

await $`echo "TOOLCHAIN_FORMAT=${getToolchain('format')}" >> $GITHUB_ENV`;
await $`echo "TOOLCHAIN_LINT=${getToolchain('lint')}" >> $GITHUB_ENV`;
