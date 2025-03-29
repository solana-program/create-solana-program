import { hasCommand, spawnCommand } from './commands';
import { Language } from './localization';
import {
  getVersionAndVersionWithoutPatch,
  getVersionFromStdout,
  ResolvedVersion,
  Version,
} from './versionCore';

export const FALLBACK_ANCHOR_VERSION: Version = '0.31.0';

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
  const [full, withoutPatch] = getVersionAndVersionWithoutPatch(
    detectedVersion ?? FALLBACK_ANCHOR_VERSION
  );
  return { full, withoutPatch, detected: detectedVersion };
}
