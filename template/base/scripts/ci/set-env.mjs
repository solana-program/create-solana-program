#!/usr/bin/env zx
import { getToolchain } from '../utils.mjs';

await $`echo "RUSTFMT_NIGHTLY_VERSION=${getToolchain('format')}" >> $GITHUB_ENV`;
await $`echo "CLIPPY_NIGHTLY_VERSION=${getToolchain('lint')}" >> $GITHUB_ENV`;
