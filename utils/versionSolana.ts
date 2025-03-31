import { hasCommand, spawnCommand } from './commands';
import { Language } from './localization';
import {
  assertIsValidVersion,
  getVersionAndVersionWithoutPatch,
  getVersionFromStdout,
  ResolvedVersion,
  Version,
} from './versionCore';

export async function detectSolanaVersion(
  language: Language
): Promise<Version> {
  const hasSolanaCli = await hasCommand('solana');
  if (!hasSolanaCli) {
    throw new Error(
      language.errors.solanaCliNotFound.replace('$command', 'solana')
    );
  }
  return getVersionFromStdout(spawnCommand('solana', ['--version']));
}

export function resolveSolanaVersion(
  language: Language,
  inputVersion: string | undefined,
  detectedVersion: Version
): ResolvedVersion {
  const version = inputVersion ?? detectedVersion ?? '';
  assertIsValidVersion(language, 'Solana', version);
  const [full, withoutPatch] = getVersionAndVersionWithoutPatch(version, {
    '1.17': '1.17.34',
    '1.18': '1.18.18',
    '2.1': '2.1.16',
  });
  return { full, withoutPatch, detected: detectedVersion };
}
