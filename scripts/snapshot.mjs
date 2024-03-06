#!/usr/bin/env zx
import fs from "node:fs";
import "zx/globals";

// $.verbose = false;

const projects = {
  "counter-shank": ["--shank"],
  "counter-anchor": ["--shank"],
};

const bin = path.resolve(__dirname, "../outfile.cjs");
const submodulesDirectory = path.resolve(__dirname, "../submodules/");

if (!fs.existsSync(submodulesDirectory)) {
  fs.mkdirSync(submodulesDirectory);
}

for (const projectName in projects) {
  // Go the submodules directory before creating each project.
  cd(submodulesDirectory);

  // Remove the project if it already exists.
  const projectExists = fs.existsSync(projectName);
  if (projectExists) {
    fs.rmSync(projectName, { recursive: true, force: true });
  }

  // Create the project.
  const verb = projectExists ? "Re-creating" : "Creating";
  echo(`${verb} project ${projectName}...`);
  const projectArgs = projects[projectName];
  await $`node ${[bin, projectName, ...projectArgs, "--force", "--default"]}`;

  // Go inside the created project.
  const projectDirectory = path.resolve(submodulesDirectory, projectName);
  cd(projectDirectory);
  const pkg = require(path.resolve(projectDirectory, "package.json"));

  // Install the project's dependencies.
  await $`pnpm install`;

  // Generate the clients.
  if (pkg.scripts.generate) {
    await $`pnpm generate`;
  }
}

echo(chalk.green("All projects were created successfully!"));
