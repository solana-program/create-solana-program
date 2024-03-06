import { Language } from "./getLanguage";
import {
  hasCommand,
  readStdout,
  spawnCommand,
  waitForCommand,
} from "./runCommands";

export async function detectSolanaVersion(language: Language): Promise<string> {
  const hasSolanaCli = await hasCommand("solana");
  if (!hasSolanaCli) {
    throw new Error(
      language.errors.solanaCliNotFound.replace("$command", "solana")
    );
  }

  const child = spawnCommand("solana", ["--version"]);
  const [stdout] = await Promise.all([
    readStdout(child),
    waitForCommand(child),
  ]);

  const version = stdout.join("").match(/(\d+\.\d+\.\d+)/)?.[1];
  return version!;
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

export async function generateKeypair(
  language: Language,
  outfile: string
): Promise<string> {
  const hasSolanaKeygen = await hasCommand("solana-keygen");
  if (!hasSolanaKeygen) {
    throw new Error(
      language.errors.solanaCliNotFound.replace("$command", "solana-keygen")
    );
  }

  // Run the solana-keygen command to generate a new keypair.
  const child = spawnCommand("solana-keygen", [
    "new",
    "--no-bip39-passphrase",
    "--outfile",
    outfile,
  ]);

  // Wait for the command to finish and read the stdout.
  const [stdout] = await Promise.all([
    readStdout(child),
    waitForCommand(child),
  ]);

  // Update the render context with the generated address.
  const address = stdout.join("").match(/pubkey: (\w+)/)?.[1];
  if (!address) {
    throw new Error(language.errors.solanaKeygenFailed);
  }

  return address;
}
