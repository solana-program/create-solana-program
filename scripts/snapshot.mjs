#!/usr/bin/env zx
import fs from "node:fs";
import "zx/globals";

$.verbose = false;

if (!/pnpm/.test(process.env.npm_config_user_agent ?? ""))
  throw new Error(
    "Please use pnpm ('pnpm run snapshot') to generate snapshots!"
  );

const playgroundDir = path.resolve(__dirname, "../playground/");
cd(playgroundDir);

// remove all previous combinations
for (const flags of flagCombinations) {
  const projectName = flags.join("-");

  console.log(`Removing previously generated project ${projectName}`);
  fs.rmSync(projectName, { recursive: true, force: true });
}

const bin = path.posix.relative("../playground/", "../outfile.cjs");

for (const flags of flagCombinations) {
  const projectName = flags.join("-");

  console.log(`Creating project ${projectName}`);
  await $`node ${[bin, projectName, ...flags.map((flag) => `--${flag}`), "--force"]}`;
}
