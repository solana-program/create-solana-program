#!/usr/bin/env zx
import "zx/globals";
import * as k from "@metaplex-foundation/kinobi";
import { getAllProgramIdls } from "./utils.mjs";

// Instanciate Kinobi.
const kinobi = k.createFromIdls(getAllProgramIdls());

// Update accounts.
kinobi.update(
  k.updateAccountsVisitor({
    addressLookupTable: {
      seeds: [
        k.variablePdaSeedNode(
          "authority",
          k.publicKeyTypeNode(),
          "The address of the LUT's authority"
        ),
        k.variablePdaSeedNode(
          "recentSlot",
          k.numberTypeNode("u64"),
          "The recent slot associated with the LUT"
        ),
      ],
    },
  })
);

// Update instructions.
kinobi.update(
  k.updateInstructionsVisitor({
    createLookupTable: {
      byteDeltas: [k.instructionByteDeltaNode(k.numberValueNode(56))],
      accounts: {
        address: { defaultValue: k.pdaValueNode("addressLookupTable") },
        payer: { defaultValue: k.accountValueNode("authority") },
      },
      arguments: {
        bump: { defaultValue: k.accountBumpValueNode("address") },
      },
    },
    extendLookupTable: {
      byteDeltas: [
        k.instructionByteDeltaNode(
          k.resolverValueNode("resolveExtendLookupTableBytes", {
            dependsOn: [k.argumentValueNode("addresses")],
          })
        ),
      ],
    },
  })
);

// Set account discriminators.
kinobi.update(
  k.setAccountDiscriminatorFromFieldVisitor({
    addressLookupTable: { field: "discriminator", value: k.numberValueNode(1) },
  })
);

// Set default values for structs.
kinobi.update(
  k.setStructDefaultValuesVisitor({
    addressLookupTable: {
      padding: { value: k.numberValueNode(0), strategy: "omitted" },
    },
  })
);

// Render JavaScript.
const jsClient = path.join(__dirname, "..", "clients", "js");
kinobi.accept(
  k.renderJavaScriptExperimentalVisitor(
    path.join(jsClient, "src", "generated"),
    { prettier: require(path.join(jsClient, ".prettierrc.json")) }
  )
);

// Render Rust.
const rustClient = path.join(__dirname, "..", "clients", "rust");
kinobi.accept(
  k.renderRustVisitor(path.join(rustClient, "src", "generated"), {
    formatCode: true,
    crateFolder: rustClient,
  })
);
