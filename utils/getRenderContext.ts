import * as path from "node:path";

import { Client, Inputs, allClients, getInputs } from "./getInputs";
import { Language, getLanguage } from "./getLanguage";
import {
  PackageManager,
  getPackageManager,
  getPackageManagerCommand,
} from "./getPackageManager";

export type RenderContext = Inputs & {
  clients: Client[];
  currentDirectory: string;
  getCommand: (scriptName: string, args?: string) => string;
  language: Language;
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
  const getCommand: RenderContext["getCommand"] = (...args) =>
    getPackageManagerCommand(packageManager, ...args);

  // Directories.
  const templateDirectory = path.resolve(__dirname, "template");
  const currentDirectory = process.cwd();
  const targetDirectory = path.join(
    currentDirectory,
    inputs.targetDirectoryName
  );

  return {
    ...inputs,
    clients,
    currentDirectory,
    getCommand,
    language,
    packageManager,
    targetDirectory,
    templateDirectory,
  };
}
