# `create-solana-program` contributing guide

Before submitting your contribution, please make sure to take a moment and read through the following guide:

## Repo Setup

This repo uses [Git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) to store snapshots of the pre-defined templates after each release. So when cloning the repository, please make sure you have also initialized the submodules. You may do this using the `--recursive` flag when cloning the repository.

```sh
git clone --recursive https://github.com/vuejs/create-vue.git
```

Alternatively, if you have already cloned the repository without the `--recursive` flag, you can initialize the submodules afterwards using the following command:

```sh
git submodule update --init --recursive
```

## Package manager and scripts

The package manager used to install and link dependencies must be [pnpm](https://pnpm.io/).

The following scripts are available:

```sh
pnpm build      # Build the `create-solana-program` package.
pnpm snapshot   # Update the `projects` directory with the latest pre-defined templates.
pnpm test       # Runs a snapshot and executes tests against each generated project.
pnpm lint       # Check the code using Prettier.
pnpm lint:fix   # Format the code using Prettier.
```

Additionally, a `prepublishOnly` script — that executes before every `pnpm publish` command — exists to update the snapshots and commit their changes to the relevant submodules. This allows us to have various template repositories that are always up-to-date with the latest changes of the `create-solana-program` package.

Therefore, please make sure you do not commit any changes to the `projects` directory manually as they will be updated automatically during each release.

## Changesets

This repository uses [Changesets](https://github.com/changesets/changesets) to manage the versioning of the `create-solana-program` package. When submitting a pull request, please make sure to include a Changeset if your contribution introduces a change that requires a version bump.
