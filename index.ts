#!/usr/bin/env node

import chalk from "chalk";
import ejs from "ejs";
import * as fs from "node:fs";
import * as path from "node:path";

import {
  postOrderDirectoryTraverse,
  preOrderDirectoryTraverse,
} from "./utils/directoryTraverse";
import { generateReadme } from "./utils/generateReadme";
import { consoleLogBanner } from "./utils/getBanner";
import { RenderContext, getRenderContext } from "./utils/getRenderContext";
import renderTemplate from "./utils/renderTemplate";

init().catch((e) => {
  console.error(e);
});

async function init() {
  // Welcome message.
  consoleLogBanner();

  // Gather user inputs.
  const ctx = await getRenderContext();
  // console.log(ctx);

  // Prepare the target directory.
  createOrEmptyTargetDirectory(ctx);

  // Log start of scaffolding.
  console.log(
    `\n${ctx.language.infos.scaffolding} ${ctx.targetDirectoryName}...`
  );

  // Prepare rendering function and accumulate callbacks.
  const callbacks = [];
  const render = function render(templateName: string) {
    const directory = path.resolve(ctx.templateDirectory, templateName);
    renderTemplate(directory, ctx.targetDirectory, callbacks);
  };

  // Render base template.
  render("base");

  // Add configs.
  // if (needsJsx) {
  //   render("config/jsx");
  // }

  // An external data store for callbacks to share data
  const dataStore = {};
  // Process callbacks
  for (const cb of callbacks) {
    await cb(dataStore);
  }

  // EJS template rendering
  preOrderDirectoryTraverse(
    ctx.targetDirectory,
    () => {},
    (filepath) => {
      if (filepath.endsWith(".ejs")) {
        const template = fs.readFileSync(filepath, "utf-8");
        const dest = filepath.replace(/\.ejs$/, "");
        const content = ejs.render(template, dataStore[dest]);

        fs.writeFileSync(dest, content);
        fs.unlinkSync(filepath);
      }
    }
  );

  // README generation
  fs.writeFileSync(
    path.resolve(ctx.targetDirectory, "README.md"),
    generateReadme(ctx)
  );

  // Log end of scaffolding.
  console.log(`\n${ctx.language.infos.done}\n`);

  // Log next steps: Cd into the target directory.
  if (ctx.targetDirectory !== ctx.currentDirectory) {
    const cdCommand = `cd ${ctx.targetDirectoryName.includes(" ") ? `"${ctx.targetDirectoryName}"` : ctx.targetDirectoryName}`;
    console.log(`  ${chalk.bold(chalk.green(cdCommand))}`);
  }

  // Log next steps: Install dependencies.
  const installCommand = ctx.getCommand("install");
  console.log(`  ${chalk.bold(chalk.green(installCommand))}`);

  // Log next steps: Generate Idls and clients.
  const generateCommand = ctx.getCommand("generate");
  console.log(`  ${chalk.bold(chalk.green(generateCommand))}`);

  // Final line break.
  console.log();
}

function createOrEmptyTargetDirectory(ctx: RenderContext) {
  if (!fs.existsSync(ctx.targetDirectory)) {
    fs.mkdirSync(ctx.targetDirectory);
  } else if (ctx.shouldOverride) {
    postOrderDirectoryTraverse(
      ctx.targetDirectory,
      (dir) => fs.rmdirSync(dir),
      (file) => fs.unlinkSync(file)
    );
  } else {
    const message = ctx.language.errors.cannotOverrideDirectory.replace(
      "$targetDirectory",
      ctx.targetDirectoryName
    );
    console.log(chalk.red("✖") + ` ${message}`);
    process.exit(1);
  }
}
