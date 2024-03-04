import chalk from "chalk";
import * as fs from "node:fs";
import { parseArgs } from "node:util";
import prompts from "prompts";

import { Language } from "./getLanguage";
import { kebabCase } from "./strings";

export const allClients = ["js", "rust"] as const;
export type Client = (typeof allClients)[number];

export type Inputs = {
  jsClient: boolean;
  jsClientPackageName: string;
  organizationName: string;
  programAddress: string;
  programCrateName: string;
  programFramework: "shank" | "anchor";
  programName: string;
  rustClient: boolean;
  rustClientCrateName: string;
  shouldOverride: boolean;
  targetDirectoryName: string;
  useDefaults: boolean;
};

export async function getInputs(language: Language): Promise<Inputs> {
  const argInputs = getInputsFromArgs();
  const defaultInputs = getDefaultInputs(argInputs);

  if (argInputs.useDefaults) {
    return defaultInputs;
  }

  return getInputsFromPrompts(language, argInputs);
}

async function getInputsFromPrompts(
  language: Language,
  argInputs: Partial<Inputs>
): Promise<Inputs> {
  type PromptInputs = {
    programName?: string;
    shouldOverride?: boolean;
    organizationName?: string;
    programCrateName?: string;
    programAddress?: string;
    programFramework?: "shank" | "anchor";
    clients?: Array<"js" | "rust">;
    jsClientPackageName?: string;
    rustClientCrateName?: string;
  };

  let defaultInputs = getDefaultInputs(argInputs);

  function parsePromptInputs(promptInputs: PromptInputs): Inputs {
    const inputs = {} as Partial<Inputs>;

    if (promptInputs.programName) inputs.programName = promptInputs.programName;
    if (promptInputs.shouldOverride !== undefined)
      inputs.shouldOverride = promptInputs.shouldOverride;
    if (promptInputs.organizationName)
      inputs.organizationName = promptInputs.organizationName;
    if (promptInputs.programCrateName)
      inputs.programCrateName = promptInputs.programCrateName;
    if (promptInputs.programAddress)
      inputs.programAddress = promptInputs.programAddress;
    if (promptInputs.programFramework)
      inputs.programFramework = promptInputs.programFramework;
    if (promptInputs.clients !== undefined) {
      inputs.jsClient = promptInputs.clients.includes("js");
      inputs.rustClient = promptInputs.clients.includes("rust");
    }
    if (promptInputs.jsClientPackageName)
      inputs.jsClientPackageName = promptInputs.jsClientPackageName;
    if (promptInputs.rustClientCrateName)
      inputs.rustClientCrateName = promptInputs.rustClientCrateName;

    return getDefaultInputs({ ...argInputs, ...inputs });
  }

  try {
    const promptInputs: PromptInputs = await prompts(
      [
        {
          name: "programName",
          type: argInputs.targetDirectoryName ? null : "text",
          message: language.programName.message,
          initial: () => defaultInputs.programName,
        },
        {
          name: "shouldOverride",
          type: (_, values) => {
            if (argInputs.shouldOverride) return null;
            defaultInputs = parsePromptInputs(values);
            return canSkipEmptying(defaultInputs.targetDirectoryName)
              ? null
              : "toggle";
          },
          message: () => {
            const dirForPrompt =
              defaultInputs.targetDirectoryName === "."
                ? language.shouldOverride.dirForPrompts.current
                : `${language.shouldOverride.dirForPrompts.target} "${defaultInputs.targetDirectoryName}"`;

            return `${dirForPrompt} ${language.shouldOverride.message}`;
          },
          initial: false,
          active: language.defaultToggleOptions.active,
          inactive: language.defaultToggleOptions.inactive,
        },
        {
          name: "overwriteChecker",
          type: (_, values) => {
            if (values.shouldOverride === false) {
              throw new Error(
                chalk.red("✖") + ` ${language.errors.operationCancelled}`
              );
            }
            return null;
          },
        },
        {
          name: "organizationName",
          type: argInputs.organizationName ? null : "text",
          message: language.organizationName.message,
          initial: () => defaultInputs.organizationName,
        },
        {
          name: "programCrateName",
          type: argInputs.programCrateName ? null : "text",
          message: language.programCrateName.message,
          initial: (_, values) => {
            defaultInputs = parsePromptInputs(values);
            return defaultInputs.programCrateName;
          },
        },
        {
          name: "programAddress",
          type: argInputs.programAddress ? null : "text",
          message: language.programAddress.message,
          initial: () => defaultInputs.programAddress,
        },
        {
          name: "programFramework",
          type: argInputs.programFramework ? null : "select",
          message: language.programFramework.message,
          hint: language.instructions.select,
          initial: 0,
          choices: [
            {
              title: language.programFramework.selectOptions.shank.title,
              description: language.programFramework.selectOptions.shank.desc,
              value: "shank",
            },
            {
              title: language.programFramework.selectOptions.anchor.title,
              description: language.programFramework.selectOptions.anchor.desc,
              value: "anchor",
              disabled: true,
            },
          ],
        },
        {
          name: "clients",
          type: () => {
            const hasSelectedClients = [
              argInputs.jsClient,
              argInputs.rustClient,
            ].every((client) => typeof client === "boolean");
            return hasSelectedClients ? null : "multiselect";
          },
          message: language.clients.message,
          hint: language.clients.hint,
          instructions: language.instructions.multiselect,
          choices: allClients.map((client) => ({
            title: language.clients.selectOptions[client].title,
            description: language.clients.selectOptions[client].desc,
            value: client,
            selected: true,
          })),
        },
        {
          name: "jsClientPackageName",
          type: (_, values) => {
            if (argInputs.jsClientPackageName) return null;
            defaultInputs = parsePromptInputs(values);
            return defaultInputs.jsClient ? "text" : null;
          },
          message: language.jsClientPackageName.message,
          initial: () => defaultInputs.jsClientPackageName,
        },
        {
          name: "rustClientCrateName",
          type: (_, values) => {
            if (argInputs.rustClientCrateName) return null;
            defaultInputs = parsePromptInputs(values);
            return defaultInputs.rustClient ? "text" : null;
          },
          message: language.rustClientCrateName.message,
          initial: () => defaultInputs.rustClientCrateName,
        },
      ],
      {
        onCancel: () => {
          throw new Error(
            chalk.red("✖") + ` ${language.errors.operationCancelled}`
          );
        },
      }
    );
    return parsePromptInputs(promptInputs);
  } catch (cancelled) {
    console.log(cancelled.message);
    process.exit(1);
  }
}

function getInputsFromArgs(): Partial<Inputs> {
  type ArgInputs = {
    address: string;
    anchorProgram: boolean;
    clients: Array<"js" | "rust">;
    force: boolean;
    noClients: boolean;
    organizationName: string;
    shankProgram: boolean;
    useDefaults: boolean;
    targetDirectoryName?: string;
  };

  function parseArgInputs(argInputs: ArgInputs): Partial<Inputs> {
    const inputs = {} as Partial<Inputs>;

    if (argInputs.targetDirectoryName)
      inputs.targetDirectoryName = argInputs.targetDirectoryName;
    if (argInputs.address) inputs.programAddress = argInputs.address;
    if (argInputs.organizationName)
      inputs.organizationName = kebabCase(argInputs.organizationName);
    if (argInputs.force) inputs.shouldOverride = true;
    if (argInputs.useDefaults) inputs.useDefaults = true;

    if (argInputs.anchorProgram) {
      inputs.programFramework = "anchor";
    } else if (argInputs.shankProgram) {
      inputs.programFramework = "shank";
    }

    if (argInputs.noClients) {
      inputs.jsClient = false;
      inputs.rustClient = false;
    } else if (argInputs.clients) {
      inputs.jsClient = argInputs.clients.includes("js");
      inputs.rustClient = argInputs.clients.includes("rust");
    }

    return inputs;
  }

  const args = process.argv.slice(2);
  const { values: options, positionals } = parseArgs({
    args,
    options: {
      address: { type: "string" },
      anchor: { type: "boolean" },
      client: { type: "string", multiple: true },
      default: { type: "boolean", short: "d" },
      force: { type: "boolean" },
      "no-clients": { type: "boolean" },
      org: { type: "string" },
      shank: { type: "boolean" },
    },
    strict: false,
  });

  return parseArgInputs({
    address: options.address,
    anchorProgram: options.anchor ?? false,
    clients: options.client,
    force: options.force ?? false,
    noClients: options["no-clients"] ?? false,
    organizationName: options.org,
    shankProgram: options.shank ?? false,
    useDefaults: options.default ?? false,
    targetDirectoryName: positionals[0],
  } as ArgInputs);
}

function getDefaultInputs(partialInputs: Partial<Inputs>): Inputs {
  const organizationName = kebabCase(
    partialInputs.organizationName ?? "solana-program"
  );
  const programName = kebabCase(
    partialInputs.programName ??
      partialInputs.targetDirectoryName ??
      "my-program"
  );
  const programCrateName =
    partialInputs.programCrateName ?? `${organizationName}-${programName}`;

  return {
    jsClient: true,
    jsClientPackageName: `@${organizationName}/${programName}`,
    organizationName,
    programAddress: "MyProgram1111111111111111111111111111111111",
    programCrateName,
    programFramework: "shank",
    programName,
    rustClient: true,
    rustClientCrateName: `${programCrateName}-client`,
    shouldOverride: false,
    targetDirectoryName: programName,
    useDefaults: false,
    ...partialInputs,
  };
}

function canSkipEmptying(dir: fs.PathLike) {
  if (!fs.existsSync(dir)) {
    return true;
  }

  const files = fs.readdirSync(dir);
  if (files.length === 0) {
    return true;
  }
  if (files.length === 1 && files[0] === ".git") {
    return true;
  }

  return false;
}
