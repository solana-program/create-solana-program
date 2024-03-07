#!/usr/bin/env zx
import "zx/globals";
import { PROJECTS } from "./utils.mjs";

await $`pnpm snapshot`;

const { version } = await fs.readJSON("./package.json");
const projects = Object.keys(PROJECTS);

const rootDirectory = path.resolve(__dirname, "..");
const projectsDirectory = path.resolve(rootDirectory, "projects");

for (const projectName of projects) {
  const projectDirectory = path.resolve(projectsDirectory, projectName);
  cd(projectDirectory);

  // Add all changes and commit them.
  await $`git add -A .`;
  try {
    await $`git commit -m "version ${version} snapshot"`;
  } catch (e) {
    if (!e.stdout.includes("nothing to commit")) {
      throw e;
    }
  }

  // Tag the commit.
  await $`git tag -m "v${version}" v${version}`;

  // Push the changes on main.
  await $`git push origin HEAD:main --follow-tags`;
}

// Update submodules on the root directory.
cd(rootDirectory);
await $`git add projects`;
await $`git commit -m 'Update snapshot' --allow-empty`;
await $`git push --follow-tags`;
