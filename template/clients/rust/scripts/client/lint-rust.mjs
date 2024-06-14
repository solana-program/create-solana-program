#!/usr/bin/env zx
import 'zx/globals';
import { workingDirectory } from '../utils.mjs';

// Check the client using Clippy.
cd(path.join(workingDirectory, 'clients', 'rust'));
await $`cargo clippy ${process.argv.slice(3)}`;
