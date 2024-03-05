import * as path from "node:path";

import {
  Client,
  Inputs,
  allClients,
  getDefaultInputs,
  getInputs,
} from "./getInputs";
import { Language, getLanguage } from "./getLanguage";
import {
  PackageManager,
  getPackageManager,
  getPackageManagerCommand,
} from "./getPackageManager";

export type RenderContext = Inputs & {
  clientDirectory: string;
  clients: Client[];
  currentDirectory: string;
  getNpmCommand: (scriptName: string, args?: string) => string;
  hasCustomProgramAddress: boolean;
  language: Language;
  programDirectory: string;
  packageManager: PackageManager;
  targetDirectory: string;
  templateDirectory: string;
};

export async function getRenderContext(): Promise<RenderContext> {
  const language = getLanguage();
  const packageManager = getPackageManager();
  const inputs = await getInputs(language);
  const clients = allClients.flatMap((client) =>
    inputs[`${client}Client`] ? [client] : []
  );
  const hasCustomProgramAddress =
    inputs.programAddress !== getDefaultInputs({}).programAddress;
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
    hasCustomProgramAddress,
    language,
    packageManager,
    programDirectory,
    targetDirectory,
    templateDirectory,
  };
}
