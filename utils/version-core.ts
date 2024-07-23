import { ChildProcess } from 'node:child_process';
import { readStdout, waitForCommand } from './commands';
import { Language } from './localization';

export type Version = `${number}.${number}.${number}`;
export type VersionWithoutPatch = `${number}.${number}`;
export type ResolvedVersion = {
  full: Version;
  withoutPatch: VersionWithoutPatch;
  detected?: Version;
};

export function isValidVersion(
  version: string
): version is Version | VersionWithoutPatch {
  return !!version.match(/^\d+\.\d+(\.\d+)?$/);
}

export function assertIsValidVersion(
  language: Language,
  tool: string,
  version: string
): asserts version is Version | VersionWithoutPatch {
  if (!isValidVersion(version)) {
    throw new Error(
      language.errors.invalidVersion
        .replace('$version', version)
        .replace('$tool', tool)
    );
  }
}

export function getVersionWithoutPatch(
  version: Version | VersionWithoutPatch
): VersionWithoutPatch {
  return version.match(/^(\d+\.\d+)/)?.[1] as VersionWithoutPatch;
}

export function getVersionAndVersionWithoutPatch(
  version: Version | VersionWithoutPatch,
  patchMap: Record<VersionWithoutPatch, Version> = {}
): [Version, VersionWithoutPatch] {
  const segments = version.split('.').length;
  if (segments === 3) {
    return [version as Version, getVersionWithoutPatch(version)];
  }
  return [
    patchMap[version as VersionWithoutPatch] ?? `${version}.0`,
    version as VersionWithoutPatch,
  ];
}

export async function getVersionFromStdout(
  child: ChildProcess
): Promise<Version> {
  const [stdout] = await Promise.all([
    readStdout(child),
    waitForCommand(child),
  ]);

  return stdout.join('').match(/(\d+\.\d+\.\d+)/)?.[1] as Version;
}
