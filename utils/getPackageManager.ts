export type PackageManager = 'npm' | 'yarn' | 'pnpm';

export function getPackageManager(): PackageManager {
  // For now, we only support pnpm.
  return 'pnpm';
}

export function getPackageManagerCommand(
  packageManager: PackageManager,
  scriptName: string,
  args?: string
) {
  if (scriptName === 'install') {
    return packageManager === 'yarn' ? 'yarn' : `${packageManager} install`;
  }

  if (args) {
    return packageManager === 'npm'
      ? `npm run ${scriptName} -- ${args}`
      : `${packageManager} ${scriptName} ${args}`;
  } else {
    return packageManager === 'npm'
      ? `npm run ${scriptName}`
      : `${packageManager} ${scriptName}`;
  }
}
