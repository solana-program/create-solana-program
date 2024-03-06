#!/usr/bin/env zx
import "zx/globals";
import * as k from "@metaplex-foundation/kinobi";
import { getAllProgramIdls } from "./utils.mjs";

// Instanciate Kinobi.
const kinobi = k.createFromIdls(getAllProgramIdls());

// Update accounts.
kinobi.update(
  k.updateAccountsVisitor({
    counter: {
      seeds: [
        k.constantPdaSeedNodeFromString("counter"),
        k.variablePdaSeedNode(
          "authority",
          k.publicKeyTypeNode(),
          "The authority of the counter account"
        ),
      ],
    },
  })
);

// Update instructions.
kinobi.update(
  k.updateInstructionsVisitor({
    create: {
      byteDeltas: [k.instructionByteDeltaNode(k.accountLinkNode("counter"))],
      accounts: {
        counter: { defaultValue: k.pdaValueNode("counter") },
        payer: { defaultValue: k.accountValueNode("authority") },
      },
    },
    increment: {
      accounts: {
        counter: { defaultValue: k.pdaValueNode("counter") },
      },
      arguments: {
        amount: { defaultValue: k.noneValueNode() },
      },
    },
  })
);

// Set account discriminators.
const key = (name) => ({ field: "key", value: k.enumValueNode("Key", name) });
kinobi.update(
  k.setAccountDiscriminatorFromFieldVisitor({
    counter: key("counter"),
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
