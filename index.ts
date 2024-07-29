#!/usr/bin/env node

import * as fs from 'node:fs';
import * as path from 'node:path';

import { createOrEmptyTargetDirectory } from './utils/filesystem';
import { getInputs } from './utils/inputs';
import { getLanguage } from './utils/localization';
import { logBanner, logDone, logStep } from './utils/logs';
import { RenderContext, getRenderContext } from './utils/renderContext';
import { renderTemplate } from './utils/renderTemplates';
import { generateKeypair, patchSolanaDependencies } from './utils/solanaCli';
import { detectAnchorVersion } from './utils/versionAnchor';
import { detectRustVersion } from './utils/versionRust';
import { detectSolanaVersion } from './utils/versionSolana';
import { Version } from './utils/versionCore';

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

  // Detect the Solana version.
  const solanaVersionDetected = await logStep(
    language.infos.detectSolanaVersion,
    () => detectSolanaVersion(language)
  );

  // Detect the Rust version.
  const rustVersionDetected = await logStep(
    language.infos.detectRustVersion,
    () => detectRustVersion()
  );

  // Detect the Anchor version.
  let anchorVersionDetected: Version | undefined;
  if (inputs.programFramework === 'anchor') {
    anchorVersionDetected = await logStep(
      language.infos.detectAnchorVersion,
      () => detectAnchorVersion(language)
    );
  }

  // Generate a keypair if needed.
  const programAddress =
    inputs.programAddress ??
    (await logStep(language.infos.generateKeypair, () => {
      const outfile = path.join(
        process.cwd(),
        inputs.targetDirectoryName,
        'program',
        'keypair.json'
      );
      return generateKeypair(language, outfile);
    }));

  // Get the args inputs, prompt inputs and computed values.
  const ctx = getRenderContext({
    language,
    inputs,
    programAddress,
    solanaVersionDetected,
    rustVersionDetected,
    anchorVersionDetected,
  });

  // Render the templates.
  await logStep(
    language.infos.scaffold.replace(
      '$targetDirectory',
      inputs.targetDirectoryName
    ),
    async () => {
      renderTemplates(ctx);
      await patchSolanaDependencies(ctx);
    }
  );

  // Done.
  logDone(ctx);
})().catch((e) => console.error(e));

function renderTemplates(ctx: RenderContext) {
  const render = (templateName: string) => {
    const directory = path.resolve(ctx.templateDirectory, templateName);
    if (!fs.existsSync(directory)) return;
    renderTemplate(ctx, directory, ctx.targetDirectory);
  };

  render('base');
  render(`${ctx.programFramework}/base`);

  if (ctx.clients.length > 0) {
    render('clients/base');
    render(`${ctx.programFramework}/clients/base`);
  }

  ctx.clients.forEach((client) => {
    render(`clients/${client}`);
    render(`${ctx.programFramework}/clients/${client}`);
  });
}
