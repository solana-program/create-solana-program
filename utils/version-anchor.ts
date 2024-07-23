import { hasCommand, spawnCommand } from './commands';
import { Language } from './localization';
import {
  getVersionAndVersionWithoutPatch,
  getVersionFromStdout,
  ResolvedVersion,
  Version,
} from './version-core';

export async function detectAnchorVersion(
  language: Language
): Promise<Version> {
  const hasAnchorCli = await hasCommand('anchor');
  if (!hasAnchorCli) {
    throw new Error(
      language.errors.solanaCliNotFound.replace('$command', 'anchor')
    );
  }
  return getVersionFromStdout(spawnCommand('anchor', ['--version']));
}

export function resolveAnchorVersion(
  detectedVersion: Version | undefined
): ResolvedVersion | undefined {
  if (!detectedVersion) return undefined;
  const [full, withoutPatch] =
    getVersionAndVersionWithoutPatch(detectedVersion);
  return { full, withoutPatch, detected: detectedVersion };
}
