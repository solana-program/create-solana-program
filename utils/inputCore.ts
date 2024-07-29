import * as fs from 'node:fs';

import { Language } from './localization';
import { kebabCase } from './strings';

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

// export async function getInputs(language: Language): Promise<Inputs> {
//   const argInputs = getInputsFromArgs();
//   const defaultInputs = getDefaultInputs(argInputs);

//   if (argInputs.useDefaults) {
//     return defaultInputs;
//   }

//   return getInputsFromPrompts(language, argInputs);
// }

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
