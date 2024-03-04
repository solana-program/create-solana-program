import chalk from "chalk";
import gradient from "gradient-string";

export function getBanner() {
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

export function consoleLogBanner() {
  console.log(`\n${getBanner()}\n`);
}
