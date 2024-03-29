# create-solana-program <a href="https://npmjs.com/package/create-solana-program"><img src="https://badgen.net/npm/v/create-solana-program" alt="npm package"></a> <a href="https://nodejs.org/en/about/previous-releases"><img src="https://img.shields.io/node/v/create-solana-program" alt="node compatibility"></a>

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
```

## Contributing

If you're interested in contributing to this project, please make sure to read our [contributing guide](./CONTRIBUTING.md).
