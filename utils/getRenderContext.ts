import * as path from 'node:path';

import { Client, Inputs, allClients } from './getInputs';
import { Language } from './getLanguage';
import {
  PackageManager,
  getPackageManager,
  getPackageManagerCommand,
} from './getPackageManager';
import { toMinorSolanaVersion } from './solanaCli';

export type RenderContext = Omit<Inputs, 'programAddress' | 'solanaVersion'> & {
  anchorVersion: string;
  clientDirectory: string;
  clients: Client[];
  currentDirectory: string;
  getNpmCommand: (scriptName: string, args?: string) => string;
  language: Language;
  programAddress: string;
  programDirectory: string;
  packageManager: PackageManager;
  solanaVersion: string;
  solanaVersionDetected: string;
  solanaVersionWithoutPatch: string;
  targetDirectory: string;
  templateDirectory: string;
  toolchain: string;
};

export function getRenderContext({
  inputs,
  language,
  programAddress,
  solanaVersionDetected,
  anchorVersionDetected,
}: {
  inputs: Inputs;
  language: Language;
  programAddress: string;
  solanaVersionDetected: string;
  anchorVersionDetected?: string;
}): RenderContext {
  const packageManager = getPackageManager();
  const clients = allClients.flatMap((client) =>
    inputs[`${client}Client`] ? [client] : []
  );
  const getNpmCommand: RenderContext['getNpmCommand'] = (...args) =>
    getPackageManagerCommand(packageManager, ...args);
  const solanaVersion = resolveSolanaVersion(
    language,
    inputs.solanaVersion,
    solanaVersionDetected
  );
  const solanaVersionWithoutPatch = toMinorSolanaVersion(
    language,
    solanaVersion
  );
  const toolchain = getToolchainFromSolanaVersion(solanaVersionWithoutPatch);

  // Directories.
  const templateDirectory = path.resolve(__dirname, 'template');
  const currentDirectory = process.cwd();
  const targetDirectory = path.join(
    currentDirectory,
    inputs.targetDirectoryName
  );
  const programDirectory = path.join(targetDirectory, 'program');
  const clientDirectory = path.join(targetDirectory, 'client');

  return {
    ...inputs,
    anchorVersion: resolveAnchorVersion(anchorVersionDetected),
    clientDirectory,
    clients,
    currentDirectory,
    getNpmCommand,
    language,
    packageManager,
    programAddress,
    programDirectory,
    solanaVersion,
    solanaVersionDetected,
    solanaVersionWithoutPatch,
    targetDirectory,
    templateDirectory,
    toolchain,
  };
}

function getToolchainFromSolanaVersion(
  solanaVersionWithoutPatch: string
): string {
  const map: Record<string, string> = {
    '1.17': '1.75.0',
    '1.18': '1.75.0',
    '2.0': '1.75.0',
  };

  return map[solanaVersionWithoutPatch] ?? '1.75.0';
}

function resolveSolanaVersion(
  language: Language,
  inputVersion: string | undefined,
  detectedVersion: string
): string {
  if (!inputVersion) {
    return detectedVersion;
  }
  if (!inputVersion.match(/^\d+\.\d+(\.\d+)?$/)) {
    throw new Error(
      language.errors.invalidSolanaVersion.replace('$version', inputVersion)
    );
  }
  const versionSegments = inputVersion.split('.');
  if (versionSegments.length === 3) {
    return inputVersion;
  }
  const map: Record<string, string> = {
    '1.17': '1.17.34',
    '1.18': '1.18.18',
  };
  return map[inputVersion] ?? `${inputVersion}.0`;
}

function resolveAnchorVersion(detectedVersion: string | undefined): string {
  return detectedVersion ?? '';
}
