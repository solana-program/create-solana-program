#!/usr/bin/env zx
import "zx/globals";

$.verbose = false;

const CLIENTS = ["js", "rust"];
const PROJECTS = {
  "counter-shank": ["counter", "--shank"],
};

// Parse CLI arguments.
const selectedProjects = argv._;
const projects =
  selectedProjects.length > 0
    ? Object.keys(PROJECTS).filter((project) =>
        selectedProjects.includes(project)
      )
    : Object.keys(PROJECTS);
const runTests = !!argv.test;

// Resolve paths.
const bin = path.resolve(__dirname, "../outfile.cjs");
const projectsDirectory = path.resolve(__dirname, "../projects/");

if (!fs.existsSync(projectsDirectory)) {
  fs.mkdirSync(projectsDirectory);
}

for (const projectName of projects) {
  // Go the submodules directory before creating each project.
  cd(projectsDirectory);

  // Log project start.
  echo(chalk.blue(chalk.bold(`${projectName}:`)));

  // Scaffold the project.
  const args = [projectName, ...PROJECTS[projectName]];
  await executeStep(
    "scaffold the project",
    () => $`node ${[bin, ...args, "--force", "--default"]}`
  );

  // Go inside the created project.
  const projectDirectory = path.resolve(projectsDirectory, projectName);
  cd(projectDirectory);
  const pkg = require(path.resolve(projectDirectory, "package.json"));

  // Install project's dependencies.
  await executeStep("install NPM dependencies", async () => {
    await $`pnpm install`;
  });

  // Generate IDLs.
  if ("generate:idls" in pkg.scripts) {
    await executeStep("generate IDLs", async () => {
      await $`pnpm generate:idls`;
    });
  }

  // Generate clients.
  if ("generate:clients" in pkg.scripts) {
    await executeStep("generate clients", async () => {
      await $`pnpm generate:clients`;
    });
  }

  if (runTests) {
    // Test programs.
    if ("programs:test" in pkg.scripts) {
      await executeStep("test programs", async () => {
        await $`pnpm programs:test`;
      });
    }

    // Test clients.
    for (const client of CLIENTS) {
      if (`clients:${client}:test` in pkg.scripts) {
        await executeStep(`test ${client} clients`, async () => {
          await $`pnpm clients:${client}:test`;
        });
      }
    }
  }

  // Add line break between projects.
  echo("");
}

echo(chalk.green("All projects were created successfully!"));

async function executeStep(title, fn) {
  try {
    const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);
    await spinner(`${capitalizedTitle}...`, fn);
    echo(chalk.green("✔︎") + ` ${capitalizedTitle}.`);
  } catch (e) {
    echo(chalk.red("✘") + ` Failed to ${title}.\n`);
    echo(e);
    process.exit(1);
  }
}
