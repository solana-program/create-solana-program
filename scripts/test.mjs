#!/usr/bin/env zx
import "zx/globals";

const submodulesDirectory = path.resolve(__dirname, "../submodules/");
const clients = ["js", "rust"];

let projects = fs
  .readdirSync(submodulesDirectory, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)
  .filter((name) => !name.startsWith(".") && name !== "node_modules");

if (process.argv[2])
  projects = projects.filter((project) => project.includes(process.argv[2]));

cd(submodulesDirectory);
console.log("Installing playground dependencies");
await $`pnpm install`;

for (const projectName of projects) {
  // Go inside the project.
  const projectDirectory = path.resolve(submodulesDirectory, projectName);
  cd(projectDirectory);
  const pkg = require(path.resolve(projectDirectory, "package.json"));

  // Test programs.
  if ("programs:test" in pkg.scripts) {
    await $`pnpm programs:test`;
  }

  // Test clients.
  for (const client of clients) {
    if (`clients:${client}:test` in pkg.scripts) {
      await $`pnpm clients:${client}:test`;
    }
  }
}
