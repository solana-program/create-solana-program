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
import { logBanner, logEnd, logStart } from "./utils/getLogs";
import { RenderContext, getRenderContext } from "./utils/getRenderContext";
import renderTemplate from "./utils/renderTemplate";

init().catch((e) => {
  console.error(e);
});

async function init() {
  logBanner();
  const ctx = await getRenderContext();
  createOrEmptyTargetDirectory(ctx);
  logStart(ctx);

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
  logEnd(ctx);
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
