#!/usr/bin/env zx
import 'zx/globals';
import { CLIENTS, PROJECTS, executeStep } from './utils.mjs';

$.verbose = false;

// Parse CLI arguments.
const selectedProjects = argv._;
const projects =
  selectedProjects.length > 0
    ? Object.keys(PROJECTS).filter((project) =>
        selectedProjects.includes(project)
      )
    : Object.keys(PROJECTS);
const runTests = !!argv.test;
const scaffoldOnly = !!argv['scaffold-only'];

// Resolve paths.
const bin = path.resolve(__dirname, '../outfile.cjs');
const projectsDirectory = path.resolve(__dirname, '../projects/');

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
    'scaffold the project',
    () => $`node ${[bin, ...args, '--force', '--default']}`
  );

  if (scaffoldOnly) continue;

  // Go inside the created project.
  const projectDirectory = path.resolve(projectsDirectory, projectName);
  cd(projectDirectory);
  const pkg = await fs.readJSON(path.resolve(projectDirectory, 'package.json'));

  // Install project's dependencies.
  await executeStep('install NPM dependencies', async () => {
    await $`pnpm install`;
  });

  // Generate IDLs.
  if ('generate:idls' in pkg.scripts) {
    await executeStep('generate IDLs', async () => {
      await $`pnpm generate:idls`;
    });
  }

  // Generate clients.
  if ('generate:clients' in pkg.scripts) {
    await executeStep('generate clients', async () => {
      await $`pnpm generate:clients`;
    });
  }

  // Build programs.
  if ('programs:build' in pkg.scripts) {
    await executeStep('build programs', async () => {
      await $`pnpm programs:build`;
    });
  }

  if (!runTests) continue;

  // Test programs.
  if ('programs:test' in pkg.scripts) {
    await executeStep('test programs', async () => {
      await $`pnpm programs:test`;
    });
  }

  // Lint and test clients.
  for (const client of CLIENTS) {
    if (`clients:${client}:test` in pkg.scripts) {
      await executeStep(`lint ${client} client`, async () => {
        await $`pnpm clients:${client}:lint`;
      });
      await executeStep(`test ${client} client`, async () => {
        await $`pnpm clients:${client}:test`;
      });
    }
  }

  // Add line break between projects.
  echo('');
}

echo(chalk.green('All projects were created successfully!'));
