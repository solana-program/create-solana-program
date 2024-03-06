import chalk from "chalk";

// @ts-ignore
import gradient from "gradient-string";

import type { RenderContext } from "./getRenderContext";

export function logBanner() {
  console.log(`\n${getBanner()}\n`);
}

export function logSuccess(message: string) {
  console.log(chalk.green("✔︎") + ` ${message}`);
}

export function logError(message: string) {
  console.log(chalk.red("✖") + ` ${message}`);
}

export function logErrorAndExit(message: string) {
  logError(message);
  process.exit(1);
}

export async function logStep<T>(title: string, callback: () => T): Promise<T> {
  try {
    const result = await spinner(`${title}...`, callback);
    logSuccess(`${title}.`);
    return result;
  } catch (e) {
    logError(`${title}.\n`);
    console.log(e);
    process.exit(1);
  }
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

export async function spinner<T>(callback: () => T): Promise<T>;
export async function spinner<T>(title: string, callback: () => T): Promise<T>;
export async function spinner<T>(
  title: string | (() => T),
  callback?: () => T
): Promise<T> {
  if (typeof title == "function") {
    callback = title;
    title = "";
  }
  let i = 0;
  const spin = () =>
    process.stderr.write(`  ${"⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"[i++ % 10]} ${title}\r`);
  const id = setInterval(spin, 100);
  let result: T;
  try {
    result = await callback!();
  } finally {
    clearInterval(id as NodeJS.Timeout);
    process.stderr.write(" ".repeat(process.stdout.columns - 1) + "\r");
  }
  return result;
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
