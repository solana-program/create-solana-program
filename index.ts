#!/usr/bin/env node

import chalk from "chalk";
import * as fs from "node:fs";
import * as path from "node:path";

import { logBanner, logEnd, logStart } from "./utils/getLogs";
import { RenderContext, getRenderContext } from "./utils/getRenderContext";
import { renderTemplate } from "./utils/renderTemplates";

(async function init() {
  logBanner();
  const ctx = await getRenderContext();
  createOrEmptyTargetDirectory(ctx);
  logStart(ctx);
  renderTemplates(ctx);
  logEnd(ctx);
})().catch((e) => console.error(e));

function renderTemplates(ctx: RenderContext) {
  const render = (templateName: string) => {
    const directory = path.resolve(ctx.templateDirectory, templateName);
    renderTemplate(ctx, directory, ctx.targetDirectory);
  };

  render("base");

  if (ctx.programFramework === "anchor") {
    render("programs/counter-anchor");
  } else {
    render("programs/counter-shank");
  }

  if (ctx.clients.length > 0) {
    render("clients/base");
  }

  ctx.clients.forEach((client) => {
    render(`clients/${client}`);
  });
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
    fs.rmSync(fullpath, { recursive: true });
  }
}
