#!/usr/bin/env zx
import 'zx/globals';
import { workingDirectory } from '../utils.mjs';

// Check the client using ESLint and Prettier.
cd(path.join(workingDirectory, 'clients', 'js'));
await $`pnpm install`;
await $`pnpm lint`;
await $`pnpm format`;
