import { Language } from './localization';
import { RenderContext } from './renderContext';
import {
  hasCommand,
  readStdout,
  spawnCommand,
  waitForCommand,
} from './commands';
import { VersionWithoutPatch } from './versionCore';

export async function patchSolanaDependencies(
  ctx: Pick<RenderContext, 'solanaVersion' | 'targetDirectory'>
): Promise<void> {
  const patchMap: Record<VersionWithoutPatch, string[]> = {
    '1.17': ['-p ahash@0.8.12 --precise 0.8.6'],
  };

  const patches = patchMap[ctx.solanaVersion.withoutPatch] ?? [];
  await Promise.all(
    patches.map(async (patch) =>
      waitForCommand(
        spawnCommand('cargo', ['update', ...patch.split(' ')], {
          cwd: ctx.targetDirectory,
        })
      )
    )
  );
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
