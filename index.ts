#!/usr/bin/env node

import chalk from "chalk";
import * as fs from "node:fs";
import * as path from "node:path";

import { logBanner, logEnd, logStart } from "./utils/getLogs";
import { RenderContext, getRenderContext } from "./utils/getRenderContext";
import { renderTemplate } from "./utils/renderTemplates";

init().catch((e) => {
  console.error(e);
});

async function init() {
  logBanner();
  const ctx = await getRenderContext();
  createOrEmptyTargetDirectory(ctx);
  logStart(ctx);

  // Prepare rendering function and accumulate callbacks.
  const render = function render(templateName: string) {
    const directory = path.resolve(ctx.templateDirectory, templateName);
    renderTemplate(ctx, directory, ctx.targetDirectory);
  };

  // Render base template.
  render("base");

  // Add configs.
  // if (needsJsx) {
  //   render("config/jsx");
  // }

  // Log end of scaffolding.
  logEnd(ctx);
}

function createOrEmptyTargetDirectory(ctx: RenderContext) {
  if (!fs.existsSync(ctx.targetDirectory)) {
    fs.mkdirSync(ctx.targetDirectory);
  } else if (ctx.shouldOverride) {
    emptyDirectory(ctx.targetDirectory);
  } else {
    const message = ctx.language.errors.cannotOverrideDirectory.replace(
      "$targetDirectory",
      ctx.targetDirectoryName
    );
    console.log(chalk.red("✖") + ` ${message}`);
    process.exit(1);
  }
}

function emptyDirectory(directory: string) {
  for (const filename of fs.readdirSync(directory)) {
    if (filename === ".git") continue;
    const fullpath = path.resolve(directory, filename);
    if (fs.lstatSync(fullpath).isDirectory()) {
      fs.rmdirSync(fullpath);
    } else {
      fs.unlinkSync(fullpath);
    }
  }
}
