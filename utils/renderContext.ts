import * as path from 'node:path';

import { Client, Inputs, allClients } from './inputCore';
import { Language } from './localization';
import {
  PackageManager,
  getPackageManager,
  getPackageManagerCommand,
} from './packageManager';
import { ResolvedVersion, Version } from './versionCore';
import { resolveRustVersion } from './versionRust';
import { resolveAnchorVersion } from './versionAnchor';
import { resolveSolanaVersion } from './versionSolana';

export type RenderContext = Omit<
  Inputs,
  'programAddress' | 'rustVersion' | 'solanaVersion'
> & {
  anchorVersion?: ResolvedVersion;
  clientDirectory: string;
  clients: Client[];
  currentDirectory: string;
  getNpmCommand: (scriptName: string, args?: string) => string;
  language: Language;
  programAddress: string;
  programDirectory: string;
  packageManager: PackageManager;
  repositoryUrl: string;
  rustVersion: ResolvedVersion;
  solanaVersion: ResolvedVersion;
  targetDirectory: string;
  templateDirectory: string;
  toolchain: string;
};

export function getRenderContext({
  inputs,
  language,
  programAddress,
  solanaVersionDetected,
  rustVersionDetected,
  anchorVersionDetected,
}: {
  inputs: Inputs;
  language: Language;
  programAddress: string;
  solanaVersionDetected: Version;
  rustVersionDetected?: Version;
  anchorVersionDetected?: Version;
}): RenderContext {
  const packageManager = getPackageManager();
  const clients = allClients.flatMap((client) =>
    inputs[`${client}Client`] ? [client] : []
  );
  const getNpmCommand: RenderContext['getNpmCommand'] = (...args) =>
    getPackageManagerCommand(packageManager, ...args);
  const repositoryUrl = `https://github.com/${inputs.organizationName}/${inputs.targetDirectoryName}`;

  // Versions.
  const solanaVersion = resolveSolanaVersion(
    language,
    inputs.solanaVersion,
    solanaVersionDetected
  );
  const anchorVersion = resolveAnchorVersion(
    anchorVersionDetected,
    solanaVersion
  );
  const rustVersion = resolveRustVersion(
    language,
    solanaVersion,
    inputs.rustVersion,
    rustVersionDetected
  );

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
    anchorVersion,
    clientDirectory,
    clients,
    currentDirectory,
    getNpmCommand,
    language,
    packageManager,
    programAddress,
    programDirectory,
    repositoryUrl,
    rustVersion,
    solanaVersion,
    targetDirectory,
    templateDirectory,
    toolchain: rustVersion.full,
  };
}
