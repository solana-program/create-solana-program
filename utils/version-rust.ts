import { hasCommand, spawnCommand } from './commands';
import { Language } from './localization';
import {
  assertIsValidVersion,
  getVersionAndVersionWithoutPatch,
  getVersionFromStdout,
  ResolvedVersion,
  Version,
  VersionWithoutPatch,
} from './version-core';

export async function detectRustVersion(): Promise<Version | undefined> {
  const hasRustc = await hasCommand('rustc');
  if (!hasRustc) {
    return undefined;
  }
  return getVersionFromStdout(spawnCommand('rustc', ['--version']));
}

export function resolveRustVersion(
  language: Language,
  solanaVersion: ResolvedVersion,
  inputVersion: string | undefined,
  detectedVersion: Version | undefined
): ResolvedVersion {
  const solanaToRustMap: Record<VersionWithoutPatch, Version> = {
    '1.17': '1.75.0',
    '1.18': '1.75.0',
    '2.0': '1.75.0',
  };
  const fallbackVersion =
    solanaToRustMap[solanaVersion.withoutPatch] ?? '1.53.0';

  const version = inputVersion ?? detectedVersion ?? fallbackVersion;
  assertIsValidVersion(language, 'Rust', version);
  const [full, withoutPatch] = getVersionAndVersionWithoutPatch(version);
  return { full, withoutPatch, detected: detectedVersion };
}
