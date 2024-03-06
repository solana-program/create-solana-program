#!/usr/bin/env node

import * as fs from "node:fs";
import * as path from "node:path";

import { generateKeypair } from "./utils/generateKeypair";
import {
  logBanner,
  logDone,
  logErrorAndExit,
  logStep,
  spinner,
} from "./utils/getLogs";
import { RenderContext, getRenderContext } from "./utils/getRenderContext";
import { renderTemplate } from "./utils/renderTemplates";

(async function init() {
  logBanner();

  // Get the args inputs, prompt inputs and computed values.
  const ctx = await getRenderContext();
  createOrEmptyTargetDirectory(ctx);

  // Generate a keypair if needed.
  if (!ctx.hasCustomProgramAddress) {
    await logStep(ctx.language.infos.generateKeypair, () =>
      generateKeypair(ctx)
    );
  }

  // Render the templates.
  await logStep(
    ctx.language.infos.scaffold.replace(
      "$targetDirectory",
      ctx.targetDirectoryName
    ),
    () => renderTemplates(ctx)
  );

  // Done.
  logDone(ctx);
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
    fs.mkdirSync(ctx.targetDirectory, { recursive: true });
  } else if (ctx.shouldOverride) {
    emptyDirectory(ctx.targetDirectory);
  } else {
    logErrorAndExit(
      ctx.language.errors.cannotOverrideDirectory.replace(
        "$targetDirectory",
        ctx.targetDirectoryName
      )
    );
  }
}

function emptyDirectory(directory: string) {
  for (const filename of fs.readdirSync(directory)) {
    if (filename === ".git") continue;
    const fullpath = path.resolve(directory, filename);
    fs.rmSync(fullpath, { recursive: true });
  }
}
