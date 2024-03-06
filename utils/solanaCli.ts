import { Language } from "./getLanguage";
import { RenderContext } from "./getRenderContext";
import {
  spawnCommand,
  hasCommand,
  readStdout,
  waitForCommand,
} from "./runCommands";

export async function generateKeypair(ctx: RenderContext): Promise<string> {
  const hasSolanaKeygen = await hasCommand("solana-keygen");
  if (!hasSolanaKeygen) {
    throw new Error(ctx.language.errors.solanaKeygenNotFound);
  }

  // Run the solana-keygen command to generate a new keypair.
  const child = spawnCommand("solana-keygen", [
    "new",
    "--no-bip39-passphrase",
    "--outfile",
    `${ctx.programDirectory}/keypair.json`,
  ]);

  // Wait for the command to finish and read the stdout.
  const [stdout] = await Promise.all([
    readStdout(child),
    waitForCommand(child),
  ]);

  // Update the render context with the generated address.
  const address = stdout.join("").match(/pubkey: (\w+)/)?.[1];
  if (!address) {
    throw new Error(ctx.language.errors.solanaKeygenFailed);
  }

  ctx.programAddress = address;

  return address;
}

export function toMinorSolanaVersion(
  language: Language,
  version: string
): string {
  const validVersion = version.match(/^(\d+\.\d+)/);
  if (!validVersion) {
    throw new Error(
      language.errors.invalidSolanaVersion.replace("$version", version)
    );
  }
  return validVersion[0];
}
