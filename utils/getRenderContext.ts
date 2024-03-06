import * as path from "node:path";

import { Client, Inputs, allClients } from "./getInputs";
import { Language } from "./getLanguage";
import {
  PackageManager,
  getPackageManager,
  getPackageManagerCommand,
} from "./getPackageManager";
import { toMinorSolanaVersion } from "./solanaCli";

export type RenderContext = Omit<Inputs, "programAddress" | "solanaVersion"> & {
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
};

export function getRenderContext({
  inputs,
  language,
  programAddress,
  solanaVersionDetected,
}: {
  inputs: Inputs;
  language: Language;
  programAddress: string;
  solanaVersionDetected: string;
}): RenderContext {
  const packageManager = getPackageManager();
  const clients = allClients.flatMap((client) =>
    inputs[`${client}Client`] ? [client] : []
  );
  const getNpmCommand: RenderContext["getNpmCommand"] = (...args) =>
    getPackageManagerCommand(packageManager, ...args);

  // Directories.
  const templateDirectory = path.resolve(__dirname, "template");
  const currentDirectory = process.cwd();
  const targetDirectory = path.join(
    currentDirectory,
    inputs.targetDirectoryName
  );
  const programDirectory = path.join(targetDirectory, "program");
  const clientDirectory = path.join(targetDirectory, "client");

  return {
    ...inputs,
    clientDirectory,
    clients,
    currentDirectory,
    getNpmCommand,
    language,
    packageManager,
    programAddress,
    programDirectory,
    solanaVersion:
      inputs.solanaVersion ??
      toMinorSolanaVersion(language, solanaVersionDetected),
    solanaVersionDetected,
    targetDirectory,
    templateDirectory,
  };
}
