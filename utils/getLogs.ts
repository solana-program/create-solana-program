import chalk from "chalk";
import gradient from "gradient-string";

import type { RenderContext } from "./getRenderContext";

export function logBanner() {
  console.log(`\n${getBanner()}\n`);
}

export function logErrorAndExit(message: string) {
  logError(message);
  process.exit(1);
}

export function logError(message: string) {
  console.log(chalk.red("✖") + ` ${message}`);
}

export function logStep(message: string) {
  console.log(chalk.blue("➤") + ` ${message}`);
}

export function logDone(ctx: RenderContext) {
  console.log(chalk.green("✔︎") + ` ${ctx.language.infos.done}\n`);

  // Log next steps: Cd into the target directory.
  if (ctx.targetDirectory !== ctx.currentDirectory) {
    const cdCommand = `cd ${ctx.targetDirectoryName.includes(" ") ? `"${ctx.targetDirectoryName}"` : ctx.targetDirectoryName}`;
    console.log(`  ${chalk.bold(chalk.green(cdCommand))}`);
  }

  // Log next steps: Install dependencies.
  const installCommand = ctx.getNpmCommand("install");
  console.log(`  ${chalk.bold(chalk.green(installCommand))}`);

  // Log next steps: Generate Idls and clients.
  const generateCommand = ctx.getNpmCommand("generate");
  console.log(`  ${chalk.bold(chalk.green(generateCommand))}`);

  // Final line break.
  console.log();
}

function getBanner() {
  const textBanner = "Create Solana Program";
  const gradientBanner = chalk.bold(
    gradient(["#89d7c8", "#dc7a8b"])(textBanner, {
      interpolation: "hsv",
      hsvSpin: "long",
    })
  );

  return process.stdout.isTTY && process.stdout.getColorDepth() > 8
    ? gradientBanner
    : textBanner;
}
