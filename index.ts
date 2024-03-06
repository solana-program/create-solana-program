#!/usr/bin/env node

import * as fs from "node:fs";
import * as path from "node:path";

import { getInputs } from "./utils/getInputs";
import { Language, getLanguage } from "./utils/getLanguage";
import { logBanner, logDone, logErrorAndExit, logStep } from "./utils/getLogs";
import { RenderContext, getRenderContext } from "./utils/getRenderContext";
import { renderTemplate } from "./utils/renderTemplates";
import { detectSolanaVersion, generateKeypair } from "./utils/solanaCli";

(async function init() {
  logBanner();

  // Get arguments from CLI and prompt.
  const language = getLanguage();
  const inputs = await getInputs(language);

  // Create or empty the target directory.
  createOrEmptyTargetDirectory(
    language,
    inputs.targetDirectoryName,
    inputs.shouldOverride
  );

  // Detect the solana version.
  const solanaVersionDetected = await logStep(
    language.infos.detectSolanaVersion,
    () => detectSolanaVersion(language)
  );

  // Generate a keypair if needed.
  const programAddress =
    inputs.programAddress ??
    (await logStep(language.infos.generateKeypair, () => {
      const outfile = path.join(
        process.cwd(),
        inputs.targetDirectoryName,
        "program",
        "keypair.json"
      );
      return generateKeypair(language, outfile);
    }));

  // Get the args inputs, prompt inputs and computed values.
  const ctx = getRenderContext({
    language,
    inputs,
    programAddress,
    solanaVersionDetected,
  });

  // Render the templates.
  await logStep(
    language.infos.scaffold.replace(
      "$targetDirectory",
      inputs.targetDirectoryName
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

function createOrEmptyTargetDirectory(
  language: Language,
  targetDirectoryName: string,
  shouldOverride: boolean
) {
  const targetDirectory = path.join(process.cwd(), targetDirectoryName);
  if (!fs.existsSync(targetDirectory)) {
    fs.mkdirSync(targetDirectory, { recursive: true });
  } else if (shouldOverride) {
    emptyDirectory(targetDirectory);
  } else {
    logErrorAndExit(
      language.errors.cannotOverrideDirectory.replace(
        "$targetDirectory",
        targetDirectoryName
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
