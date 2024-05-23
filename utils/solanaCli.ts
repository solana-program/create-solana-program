import { Language } from './getLanguage';
import { RenderContext } from './getRenderContext';
import {
  hasCommand,
  readStdout,
  spawnCommand,
  waitForCommand,
} from './runCommands';

export async function detectSolanaVersion(language: Language): Promise<string> {
  const hasSolanaCli = await hasCommand('solana');
  if (!hasSolanaCli) {
    throw new Error(
      language.errors.solanaCliNotFound.replace('$command', 'solana')
    );
  }

  const child = spawnCommand('solana', ['--version']);
  const [stdout] = await Promise.all([
    readStdout(child),
    waitForCommand(child),
  ]);

  const version = stdout.join('').match(/(\d+\.\d+\.\d+)/)?.[1];
  return version!;
}

export async function detectAnchorVersion(language: Language): Promise<string> {
  const hasAnchorCli = await hasCommand('anchor');
  if (!hasAnchorCli) {
    throw new Error(
      language.errors.solanaCliNotFound.replace('$command', 'anchor')
    );
  }

  const child = spawnCommand('anchor', ['--version']);
  const [stdout] = await Promise.all([
    readStdout(child),
    waitForCommand(child),
  ]);

  const version = stdout.join('').match(/(\d+\.\d+\.\d+)/)?.[1];
  return version!;
}

export async function patchSolanaDependencies(
  ctx: Pick<RenderContext, 'solanaVersion' | 'targetDirectory'>
): Promise<void> {
  const patchMap: Record<string, string[]> = {
    '1.17': ['-p ahash@0.8 --precise 0.8.6'],
  };

  const patches = patchMap[ctx.solanaVersion] ?? [];
  await Promise.all(
    patches.map((patch) =>
      waitForCommand(
        spawnCommand('cargo', ['update', ...patch.split(' ')], {
          cwd: ctx.targetDirectory,
        })
      )
    )
  );
}

export function toMinorSolanaVersion(
  language: Language,
  version: string
): string {
  const validVersion = version.match(/^(\d+\.\d+)/);
  if (!validVersion) {
    throw new Error(
      language.errors.invalidSolanaVersion.replace('$version', version)
    );
  }
  return validVersion[0];
}

export async function generateKeypair(
  language: Language,
  outfile: string
): Promise<string> {
  const hasSolanaKeygen = await hasCommand('solana-keygen');
  if (!hasSolanaKeygen) {
    throw new Error(
      language.errors.solanaCliNotFound.replace('$command', 'solana-keygen')
    );
  }

  // Run the solana-keygen command to generate a new keypair.
  const child = spawnCommand('solana-keygen', [
    'new',
    '--no-bip39-passphrase',
    '--outfile',
    outfile,
  ]);

  // Wait for the command to finish and read the stdout.
  const [stdout] = await Promise.all([
    readStdout(child),
    waitForCommand(child),
  ]);

  // Update the render context with the generated address.
  const address = stdout.join('').match(/pubkey: (\w+)/)?.[1];
  if (!address) {
    throw new Error(language.errors.solanaKeygenFailed);
  }

  return address;
}
