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
  const solanaVersion =
    inputs.solanaVersion ??
    toMinorSolanaVersion(language, solanaVersionDetected);
  const toolchain = getToolchainFromSolanaVersion({
    solanaVersion,
    programFramework: inputs.programFramework,
  });

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
    anchorVersion: anchorVersionDetected ?? '',
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
    targetDirectory,
    templateDirectory,
    toolchain,
  };
}

function getToolchainFromSolanaVersion(
  ctx: Pick<RenderContext, 'programFramework' | 'solanaVersion'>
): string {
  return '1.75.0';

  if (ctx.programFramework === 'anchor') {
    return '1.75.0';
  }

  const map: Record<string, string> = {
    '1.17': '1.68.0',
    '1.18': '1.75.0',
    '2.0': '1.75.0',
  };

  return map[ctx.solanaVersion] ?? '1.75.0';
}
