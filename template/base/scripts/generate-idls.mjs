#!/usr/bin/env zx
import "zx/globals";
import { generateIdl } from "@metaplex-foundation/shank-js";
import { getCargo, getProgramFolders } from "./utils.mjs";

// REMOVE ME: START
echo(chalk.red("This program doesn't use Shank."));
echo("This is a temporary guard to prevent accidental execution.");
echo("When the program uses Shank to generate its IDL,");
echo("Remove this guard in `scripts/generate-idls.mjs`.");
process.exit();
// REMOVE ME: END

const binaryInstallDir = path.join(__dirname, "..", ".cargo");

getProgramFolders().forEach((folder) => {
  const cargo = getCargo(folder);
  const isShank = Object.keys(cargo.dependencies).includes("shank");
  const programDir = path.join(__dirname, "..", folder);

  generateIdl({
    generator: isShank ? "shank" : "anchor",
    programName: cargo.package.name.replace(/-/g, "_"),
    programId: cargo.package.metadata.solana["program-id"],
    idlDir: programDir,
    idlName: "idl",
    programDir,
    binaryInstallDir,
  });
});
