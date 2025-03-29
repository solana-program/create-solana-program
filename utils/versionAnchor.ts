import { hasCommand, spawnCommand } from './commands';
import { Language } from './localization';
import {
  getVersionAndVersionWithoutPatch,
  getVersionFromStdout,
  ResolvedVersion,
  Version,
  VersionWithoutPatch,
} from './versionCore';

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
  detectedVersion: Version | undefined,
  solanaVersion: ResolvedVersion
): ResolvedVersion | undefined {
  const fallbackVersionMap: Record<VersionWithoutPatch, Version> = {
    '1.17': '0.29.0',
    '1.18': '0.30.0',
    '2.0': '0.30.0',
    '2.1': '0.31.0',
    '2.2': '0.31.0',
  };
  const fallbackVersion: Version =
    fallbackVersionMap[solanaVersion.withoutPatch] ?? '0.30.0';
  const [full, withoutPatch] = getVersionAndVersionWithoutPatch(
    detectedVersion ?? fallbackVersion
  );
  return { full, withoutPatch, detected: detectedVersion };
}
