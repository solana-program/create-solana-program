import { Language } from './localization';

export type Version = `${number}.${number}.${number}`;
export type VersionWithoutPatch = `${number}.${number}`;
export type ValidVersion = Version | VersionWithoutPatch;

export function isValidVersion(version: string): version is ValidVersion {
  return !!version.match(/^\d+\.\d+(\.\d+)?$/);
}

export function assertIsValidVersion(
  language: Language,
  tool: string,
  version: string
): asserts version is ValidVersion {
  if (!isValidVersion(version)) {
    throw new Error(
      language.errors.invalidVersion
        .replace('$version', version)
        .replace('$tool', tool)
    );
  }
}

export function getVersionWithoutPatch(
  version: ValidVersion
): VersionWithoutPatch {
  return version.match(/^(\d+\.\d+)/)?.[0] as VersionWithoutPatch;
}

export function getVersionAndVersionWithoutPatch(
  version: ValidVersion,
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
