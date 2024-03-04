export type PackageManager = "npm" | "yarn" | "pnpm";

export function getPackageManager(): PackageManager {
  // Supported package managers: pnpm > yarn > npm
  const userAgent = process.env.npm_config_user_agent ?? "";
  return /pnpm/.test(userAgent)
    ? "pnpm"
    : /yarn/.test(userAgent)
      ? "yarn"
      : "npm";
}

export function getPackageManagerCommand(
  packageManager: PackageManager,
  scriptName: string,
  args?: string
) {
  if (scriptName === "install") {
    return packageManager === "yarn" ? "yarn" : `${packageManager} install`;
  }

  if (args) {
    return packageManager === "npm"
      ? `npm run ${scriptName} -- ${args}`
      : `${packageManager} ${scriptName} ${args}`;
  } else {
    return packageManager === "npm"
      ? `npm run ${scriptName}`
      : `${packageManager} ${scriptName}`;
  }
}
