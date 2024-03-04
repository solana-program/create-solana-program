#!/usr/bin/env zx
import fs from "node:fs";
import "zx/globals";

$.verbose = false;

const projects = {
  "counter-shank": ["--shank"],
  "counter-anchor": ["--shank"],
};

const playgroundDir = path.resolve(__dirname, "../playground/");
const bin = path.resolve(__dirname, "../outfile.cjs");
cd(playgroundDir);

for (const projectName in projects) {
  const projectArgs = projects[projectName];

  const projectExists = fs.existsSync(projectName);
  if (projectExists) {
    fs.rmSync(projectName, { recursive: true, force: true });
  }

  const verb = projectExists ? "Re-creating" : "Creating";
  echo(`${verb} project ${projectName}...`);
  await $`node ${[bin, projectName, ...projectArgs, "--force", "--default"]}`;
}

echo(chalk.green("All projects were created successfully!"));
