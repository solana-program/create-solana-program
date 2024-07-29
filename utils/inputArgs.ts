import { parseArgs } from 'node:util';

import { type Inputs } from './inputCore';
import { kebabCase } from './strings';

type ArgInputs = {
  address?: string;
  anchorProgram: boolean;
  clients: Array<'js' | 'rust'>;
  force: boolean;
  jsClientPackageName?: string;
  noClients: boolean;
  organizationName?: string;
  programCrateName?: string;
  programName?: string;
  rustClientCrateName?: string;
  rustVersion?: string;
  shankProgram: boolean;
  solanaVersion?: string;
  useDefaults: boolean;
  targetDirectoryName?: string;
};

export function getInputsFromArgs(): Partial<Inputs> {
  const args = process.argv.slice(2);
  const { values: options, positionals } = parseArgs({
    args,
    options: {
      address: { type: 'string' },
      anchor: { type: 'boolean' },
      client: { type: 'string', multiple: true },
      default: { type: 'boolean', short: 'd' },
      force: { type: 'boolean' },
      'js-client-package-name': { type: 'string' },
      'no-clients': { type: 'boolean' },
      org: { type: 'string' },
      'program-crate-name': { type: 'string' },
      rust: { type: 'string' },
      'rust-client-crate-name': { type: 'string' },
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
    jsClientPackageName: options['js-client-package-name'],
    noClients: options['no-clients'] ?? false,
    organizationName: options.org,
    programCrateName: options['program-crate-name'],
    programName: positionals[1],
    rustClientCrateName: options['rust-client-crate-name'],
    rustVersion: options.rust,
    shankProgram: options.shank ?? false,
    solanaVersion: options.solana,
    useDefaults: options.default ?? false,
    targetDirectoryName: positionals[0],
  } as ArgInputs);
}

function parseArgInputs(argInputs: ArgInputs): Partial<Inputs> {
  const inputs = {} as Partial<Inputs>;

  if (argInputs.address) inputs.programAddress = argInputs.address;
  if (argInputs.organizationName)
    inputs.organizationName = kebabCase(argInputs.organizationName);
  if (argInputs.programName)
    inputs.programName = kebabCase(argInputs.programName);
  if (argInputs.rustVersion) inputs.rustVersion = argInputs.rustVersion;
  if (argInputs.solanaVersion) inputs.solanaVersion = argInputs.solanaVersion;
  if (argInputs.targetDirectoryName)
    inputs.targetDirectoryName = argInputs.targetDirectoryName;
  if (argInputs.jsClientPackageName)
    inputs.jsClientPackageName = argInputs.jsClientPackageName;
  if (argInputs.programCrateName)
    inputs.programCrateName = argInputs.programCrateName;
  if (argInputs.rustClientCrateName)
    inputs.rustClientCrateName = argInputs.rustClientCrateName;
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
