<a href="https://www.npmjs.com/package/create-solana-program"><img src="https://badgen.net/npm/v/create-solana-program" alt="npm package"></a> 
<a href="https://nodejs.org/en/about/previous-releases"><img src="https://img.shields.io/node/v/create-solana-program" alt="node compatibility"></a>
# create-solana-program <a href="https://npmjs.com/package/create-solana-program">

The fastest way to get started with Solana program development.

![Solana Program banner](https://github.com/solana-program/create-solana-program/assets/3642397/ebd0c01e-52d3-45ef-b1f3-e07bee53ab13)

## Usage

```sh
pnpm create solana-program
```

Note that, when using `npm`, the `@latest` tag name must be provided, otherwise `npm` may resolve to a cached and outdated version of the package.

```sh
npm create solana-program@latest
```

## CLI arguments

Whilst you don't need to provide any CLI arguments, you can use them to customize the generated program repository. Any missing information will either be inferred from the provided input or prompted to the user.

The first CLI argument allows you to specify the program name and the directory of the new program repository.

```sh
# The generated directory is "counter" and the program name is "counter".
pnpm create solana-program counter
```

When a second CLI argument is provided, it allows you to specify a program name that differs from the directory name.

```sh
# The generated directory is "my-projects/counter-program" and the program name is "counter".
pnpm create solana-program my-projects/counter-program counter
```

## CLI options

Various CLI options are also available to customize the generated program repository further and even skip user input altogether.

```sh
# Specify the organization name for the program.
pnpm create solana-program --org acme

# Select a program framework.
pnpm create solana-program --anchor
pnpm create solana-program --shank

# Select the clients to generate for your program (default to all clients).
pnpm create solana-program --client js --client rust

# Opt out of generating any clients for your program.
pnpm create solana-program --no-clients

# Do not prompt use input and use all default values (alias: -d).
pnpm create solana-program --default

# The --default flag can be combined with other flags.
pnpm create solana-program counter --org acme --default

# Skip generating a new program keypair and use the provided address instead.
pnpm create solana-program --address "MyProgram11111111111111111"

# Use a specific Solana version instead of detecting the one installed on the system.
pnpm create solana-program --solana 1.18

# Force the creation of the program repository even if the directory is not empty.
pnpm create solana-program --force

# Override the library names.
pnpm create solana-program --program-crate-name acme-counter
pnpm create solana-program --rust-client-crate-name acme-counter-client
pnpm create solana-program --js-client-package-name @acme/counter
```

## Existing Anchor programs

If you already have an existing Solana program built with Anchor, you can use this tool to scaffold a new program repository and replace the generated program with your existing one. Here’s how you can do it:

1. Ensure the installed Solana and Anchor versions are the same as the ones your existing program requires.
2. Scaffold a new Solana program using Anchor. `pnpm create solana-program --anchor`.
3. Replace the `program` folder with your existing program directory (not the workspace directory). If you have more than one program, add more folders to the root directory and update the `members` attribute of the top-level `Cargo.toml` accordingly.
4. Ensure your program’s `Cargo.toml` contains the following metadata:
   ```toml
   [package.metadata.solana]
   program-id = "YOUR_PROGRAM_ADDRESS"
   program-dependencies = []
   ```
5. Build your program and clients.
   ```sh
   pnpm install
   pnpm programs:build
   pnpm generate
   ```
6. If you have a generated Rust client, update the `clients/rust/src/lib.rs` file so the `ID` alias points to the correct generated constant.
7. If you have any generated clients, update the scaffolded tests so they work with your existing program.

## Contributing

If you're interested in contributing to this project, please make sure to read our [contributing guide](./CONTRIBUTING.md).
