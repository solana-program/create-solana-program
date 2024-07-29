import chalk from 'chalk';
import * as fs from 'node:fs';
import prompts from 'prompts';

import { Language } from './localization';
import { allClients, getDefaultInputs, Inputs } from './inputCore';

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

export async function getInputsFromPrompts(
  language: Language,
  argInputs: Partial<Inputs>
): Promise<Inputs> {
  let defaultInputs = getDefaultInputs(argInputs);

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
            defaultInputs = parsePromptInputs(values, argInputs);
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
            defaultInputs = parsePromptInputs(values, argInputs);
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
            defaultInputs = parsePromptInputs(values, argInputs);
            return defaultInputs.jsClient ? 'text' : null;
          },
          message: language.jsClientPackageName.message,
          initial: () => defaultInputs.jsClientPackageName,
        },
        {
          name: 'rustClientCrateName',
          type: (_, values) => {
            if (argInputs.rustClientCrateName) return null;
            defaultInputs = parsePromptInputs(values, argInputs);
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

    return parsePromptInputs(promptInputs, argInputs);
  } catch (cancelled) {
    console.log((cancelled as Error).message);
    process.exit(1);
  }
}

function parsePromptInputs(
  promptInputs: PromptInputs,
  argInputs: Partial<Inputs>
): Inputs {
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
