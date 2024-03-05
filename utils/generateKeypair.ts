import { logErrorAndExit } from "./getLogs";
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
    logErrorAndExit(ctx.language.errors.solanaKeygenNotFound);
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
  ctx.programAddress = address;

  return address;
}
