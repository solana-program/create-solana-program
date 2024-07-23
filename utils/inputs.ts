import chalk from 'chalk';
import * as fs from 'node:fs';
import { parseArgs } from 'node:util';
import prompts from 'prompts';

import { Language } from './localization';
import { kebabCase } from './strings';
import { toMinorSolanaVersion } from './solanaCli';

export const allClients = ['js', 'rust'] as const;
export type Client = (typeof allClients)[number];

export type Inputs = {
  jsClient: boolean;
  jsClientPackageName: string;
  organizationName: string;
  programAddress?: string;
  programCrateName: string;
  programFramework: 'shank' | 'anchor';
  programName: string;
  rustClient: boolean;
  rustClientCrateName: string;
  rustVersion?: string;
  shouldOverride: boolean;
  solanaVersion?: string;
  targetDirectoryName: string;
  useDefaults: boolean;
};

export async function getInputs(language: Language): Promise<Inputs> {
  const argInputs = getInputsFromArgs(language);
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
    programFramework?: 'shank' | 'anchor';
    clients?: Array<'js' | 'rust'>;
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
    if (promptInputs.programFramework)
      inputs.programFramework = promptInputs.programFramework;
    if (promptInputs.clients !== undefined) {
      inputs.jsClient = promptInputs.clients.includes('js');
      inputs.rustClient = promptInputs.clients.includes('rust');
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
          name: 'programName',
          type: argInputs.programName ? null : 'text',
          message: language.programName.message,
          initial: () => defaultInputs.programName,
        },
        {
          name: 'shouldOverride',
          type: (_, values) => {
            if (argInputs.shouldOverride) return null;
            defaultInputs = parsePromptInputs(values);
            return canSkipEmptying(defaultInputs.targetDirectoryName)
              ? null
              : 'toggle';
          },
          message: () => {
            const dirForPrompt =
              defaultInputs.targetDirectoryName === '.'
                ? language.shouldOverride.dirForPrompts!.current
                : `${language.shouldOverride.dirForPrompts!.target} "${defaultInputs.targetDirectoryName}"`;

            return `${dirForPrompt} ${language.shouldOverride.message}`;
          },
          initial: false,
          active: language.defaultToggleOptions.active,
          inactive: language.defaultToggleOptions.inactive,
        },
        {
          name: 'overwriteChecker',
          type: (_, values) => {
            if (values.shouldOverride === false) {
              throw new Error(
                chalk.red('✖') + ` ${language.errors.operationCancelled}`
              );
            }
            return null;
          },
        },
        {
          name: 'organizationName',
          type: argInputs.organizationName ? null : 'text',
          message: language.organizationName.message,
          initial: () => defaultInputs.organizationName,
        },
        {
          name: 'programCrateName',
          type: argInputs.programCrateName ? null : 'text',
          message: language.programCrateName.message,
          initial: (_, values) => {
            defaultInputs = parsePromptInputs(values);
            return defaultInputs.programCrateName;
          },
        },
        {
          name: 'programFramework',
          type: argInputs.programFramework ? null : 'select',
          message: language.programFramework.message,
          hint: language.instructions.select,
          initial: 0,
          choices: [
            {
              title: language.programFramework.selectOptions!.shank.title,
              description: language.programFramework.selectOptions!.shank.desc,
              value: 'shank',
            },
            {
              title: language.programFramework.selectOptions!.anchor.title,
              description: language.programFramework.selectOptions!.anchor.desc,
              value: 'anchor',
            },
          ],
        },
        {
          name: 'clients',
          type: () => {
            const hasSelectedClients = [
              argInputs.jsClient,
              argInputs.rustClient,
            ].every((client) => typeof client === 'boolean');
            return hasSelectedClients ? null : 'multiselect';
          },
          message: language.clients.message,
          hint: language.clients.hint,
          instructions: language.instructions.multiselect,
          choices: allClients.map((client) => ({
            title: language.clients.selectOptions![client].title,
            description: language.clients.selectOptions![client].desc,
            value: client,
            selected: true,
          })),
        },
        {
          name: 'jsClientPackageName',
          type: (_, values) => {
            if (argInputs.jsClientPackageName) return null;
            defaultInputs = parsePromptInputs(values);
            return defaultInputs.jsClient ? 'text' : null;
          },
          message: language.jsClientPackageName.message,
          initial: () => defaultInputs.jsClientPackageName,
        },
        {
          name: 'rustClientCrateName',
          type: (_, values) => {
            if (argInputs.rustClientCrateName) return null;
            defaultInputs = parsePromptInputs(values);
            return defaultInputs.rustClient ? 'text' : null;
          },
          message: language.rustClientCrateName.message,
          initial: () => defaultInputs.rustClientCrateName,
        },
      ],
      {
        onCancel: () => {
          throw new Error(
            chalk.red('✖') + ` ${language.errors.operationCancelled}`
          );
        },
      }
    );

    // Add a line break after the prompts
    console.log('');

    return parsePromptInputs(promptInputs);
  } catch (cancelled) {
    console.log((cancelled as Error).message);
    process.exit(1);
  }
}

function getInputsFromArgs(language: Language): Partial<Inputs> {
  type ArgInputs = {
    address?: string;
    anchorProgram: boolean;
    clients: Array<'js' | 'rust'>;
    force: boolean;
    noClients: boolean;
    organizationName?: string;
    programName?: string;
    rustVersion?: string;
    shankProgram: boolean;
    solanaVersion?: string;
    useDefaults: boolean;
    targetDirectoryName?: string;
  };

  function parseArgInputs(argInputs: ArgInputs): Partial<Inputs> {
    const inputs = {} as Partial<Inputs>;

    if (argInputs.address) inputs.programAddress = argInputs.address;
    if (argInputs.organizationName)
      inputs.organizationName = kebabCase(argInputs.organizationName);
    if (argInputs.programName)
      inputs.programName = kebabCase(argInputs.programName);
    if (argInputs.rustVersion) inputs.rustVersion = argInputs.rustVersion;
    if (argInputs.solanaVersion)
      inputs.solanaVersion = toMinorSolanaVersion(
        language,
        argInputs.solanaVersion
      );
    if (argInputs.targetDirectoryName)
      inputs.targetDirectoryName = argInputs.targetDirectoryName;
    if (argInputs.force) inputs.shouldOverride = true;
    if (argInputs.useDefaults) inputs.useDefaults = true;

    if (argInputs.anchorProgram) {
      inputs.programFramework = 'anchor';
    } else if (argInputs.shankProgram) {
      inputs.programFramework = 'shank';
    }

    if (argInputs.noClients) {
      inputs.jsClient = false;
      inputs.rustClient = false;
    } else if (argInputs.clients) {
      inputs.jsClient = argInputs.clients.includes('js');
      inputs.rustClient = argInputs.clients.includes('rust');
    }

    return inputs;
  }

  const args = process.argv.slice(2);
  const { values: options, positionals } = parseArgs({
    args,
    options: {
      address: { type: 'string' },
      anchor: { type: 'boolean' },
      client: { type: 'string', multiple: true },
      default: { type: 'boolean', short: 'd' },
      force: { type: 'boolean' },
      'no-clients': { type: 'boolean' },
      org: { type: 'string' },
      rust: { type: 'string' },
      shank: { type: 'boolean' },
      solana: { type: 'string' },
    },
    strict: false,
  });

  return parseArgInputs({
    address: options.address,
    anchorProgram: options.anchor ?? false,
    clients: options.client,
    force: options.force ?? false,
    noClients: options['no-clients'] ?? false,
    organizationName: options.org,
    programName: positionals[1],
    rustVersion: options.rust,
    shankProgram: options.shank ?? false,
    solanaVersion: options.solana,
    useDefaults: options.default ?? false,
    targetDirectoryName: positionals[0],
  } as ArgInputs);
}

export function getDefaultInputs(partialInputs: Partial<Inputs>): Inputs {
  const organizationName = kebabCase(
    partialInputs.organizationName ?? 'solana-program'
  );
  const parsedTargetDirectoryName = partialInputs.targetDirectoryName
    ? partialInputs.targetDirectoryName.split('/').pop()
    : '';
  const programName = kebabCase(
    partialInputs.programName ?? (parsedTargetDirectoryName || 'my-program')
  );
  const programCrateName =
    partialInputs.programCrateName ?? `${organizationName}-${programName}`;

  return {
    jsClient: true,
    jsClientPackageName: `@${organizationName}/${programName}`,
    organizationName,
    programCrateName,
    programFramework: 'shank',
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
  if (files.length === 1 && files[0] === '.git') {
    return true;
  }

  return false;
}
