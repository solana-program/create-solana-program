# create-solana-program

## 0.1.19

### Patch Changes

- [#31](https://github.com/solana-program/create-solana-program/pull/31) [`6c6256f`](https://github.com/solana-program/create-solana-program/commit/6c6256fce97d3599ae5bd7bd0f33e0736dc80bde) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Update Kinobi to 0.18.0

## 0.1.18

### Patch Changes

- [#29](https://github.com/solana-program/create-solana-program/pull/29) [`b55bf91`](https://github.com/solana-program/create-solana-program/commit/b55bf917df3a7fc534ddfb06f02f1c8aa4d7214e) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Use `@solana/eslint-config-solana` preset

- [#27](https://github.com/solana-program/create-solana-program/pull/27) [`43c7662`](https://github.com/solana-program/create-solana-program/commit/43c7662d6c19e69bc7a759483f0368654aad227a) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Remove typedoc-plugin-expand-object-like-types from JS client

- [#26](https://github.com/solana-program/create-solana-program/pull/26) [`990ddce`](https://github.com/solana-program/create-solana-program/commit/990ddcec4d46bd9c899b31a66acb68b5daa57039) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Fix linting for JS clients

## 0.1.17

### Patch Changes

- [#24](https://github.com/solana-program/create-solana-program/pull/24) [`289ccfd`](https://github.com/solana-program/create-solana-program/commit/289ccfd287b38c4cb2614db8805643b898f0a6c9) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Fix exported extensions in package.json

## 0.1.16

### Patch Changes

- [#22](https://github.com/solana-program/create-solana-program/pull/22) [`6d5164b`](https://github.com/solana-program/create-solana-program/commit/6d5164b0287d3adbf6e5f7582ad2c51a4ba9d11d) Thanks [@steveluscher](https://github.com/steveluscher)! - Use `cargo-build-sbf` instead of `cargo build-sbf` when building clients

- [#21](https://github.com/solana-program/create-solana-program/pull/21) [`a25f252`](https://github.com/solana-program/create-solana-program/commit/a25f252e4493850fbb91a73ca955f54dff8df909) Thanks [@steveluscher](https://github.com/steveluscher)! - Generated clients can now be imported into ESM projects

## 0.1.15

### Patch Changes

- [#18](https://github.com/solana-program/create-solana-program/pull/18) [`8fb8cec`](https://github.com/solana-program/create-solana-program/commit/8fb8cecf166875f67e5e614889065522d9ac83cf) Thanks [@steveluscher](https://github.com/steveluscher)! - Point to correct location for TypeScript definitions

## 0.1.14

### Patch Changes

- [`20f4619`](https://github.com/solana-program/create-solana-program/commit/20f46195dcde3c23f9080e2c941121221eeacd1d) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Upgrade Kinobi to 0.17.8

- [#16](https://github.com/solana-program/create-solana-program/pull/16) [`7fd2f2e`](https://github.com/solana-program/create-solana-program/commit/7fd2f2ea99c89d48f71771aa984ffb833b70055c) Thanks [@febo](https://github.com/febo)! - Switch initial package/crate version to 0.0.0

- [#17](https://github.com/solana-program/create-solana-program/pull/17) [`5a7ff73`](https://github.com/solana-program/create-solana-program/commit/5a7ff73f47f4f2c9030fbc97ff73866cb35a8533) Thanks [@febo](https://github.com/febo)! - Add fallback logic for sha checksum

- [#14](https://github.com/solana-program/create-solana-program/pull/14) [`f86fa27`](https://github.com/solana-program/create-solana-program/commit/f86fa279ebf5cfb64d71a55f5feeb61ddf8e1d6c) Thanks [@febo](https://github.com/febo)! - Not start validator for Rust client tests

## 0.1.13

### Patch Changes

- [`363da94`](https://github.com/solana-program/create-solana-program/commit/363da942a8bc38ac3667c7b45d72522d84a8a618) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Generate description in JS client package.json

- [`7c846d0`](https://github.com/solana-program/create-solana-program/commit/7c846d070903031d2b171e61564b5a7ca091e12b) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Urlencode README badges

## 0.1.12

### Patch Changes

- [#11](https://github.com/solana-program/create-solana-program/pull/11) [`097d08a`](https://github.com/solana-program/create-solana-program/commit/097d08a412d0019208bf9982f7ed1ca2f6cba1c9) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Rename validator scripts

- [`a7e46b7`](https://github.com/solana-program/create-solana-program/commit/a7e46b7d060faab7b29d977438a4bce359a7fea4) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Prefix dot files with \_. in templates

- [#9](https://github.com/solana-program/create-solana-program/pull/9) [`2b62bf0`](https://github.com/solana-program/create-solana-program/commit/2b62bf02d198ce6b479c48e68f145e664a6735df) Thanks [@steveluscher](https://github.com/steveluscher)! - Update `@solana/web3.js` to `^2.0.0-preview` – a relative version range that targets the newest version of the preview line

- [#12](https://github.com/solana-program/create-solana-program/pull/12) [`e254142`](https://github.com/solana-program/create-solana-program/commit/e25414264e493f568e5e87e748ca46805dd58c73) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Use fixed counter address in snapshots

  This prevents new keypairs from being generated and avoids having lots of unnecessary address changes between snapshots.

## 0.1.11

### Patch Changes

- [#6](https://github.com/solana-program/create-solana-program/pull/6) [`52e704a`](https://github.com/solana-program/create-solana-program/commit/52e704a3b2a37bdb3e146272c8469a38a36b1c9b) Thanks [@febo](https://github.com/febo)! - Fixes a typo and small tweak to program label

## 0.1.10

### Patch Changes

- [`c67062b`](https://github.com/solana-program/create-solana-program/commit/c67062badb77fc745c4257095cb94103777ac512) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Write generated READMEs

- [`dfff36a`](https://github.com/solana-program/create-solana-program/commit/dfff36a25ba4a72dcead18de41d89e931b3ec738) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Rename --force option to --restart on the validator

## 0.1.9

### Patch Changes

- [`4739d2d`](https://github.com/solana-program/create-solana-program/commit/4739d2dedf90a0c6ebdd953001d16fb9a37fde8c) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Remove nightly features from rustfmt.toml

## 0.1.8

### Patch Changes

- [`6c6d6f7`](https://github.com/solana-program/create-solana-program/commit/6c6d6f733027a181c5acb2f6b1b7b1820a337d22) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Test another publish cycle

## 0.1.7

### Patch Changes

- [`47aa567`](https://github.com/solana-program/create-solana-program/commit/47aa5677115b43ec27641a94c7739fadc2e2ce4f) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Test another publish cycle

## 0.1.6

### Patch Changes

- [`eaa5ce8`](https://github.com/solana-program/create-solana-program/commit/eaa5ce8a739444e4c00d81238bad7c6e4c7cdc55) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Patch dependencies for Solana 1.17

- [`739c2e8`](https://github.com/solana-program/create-solana-program/commit/739c2e8fbe5960a26bbe3d48d90b1781014c690a) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Fix scripts permission denied errors
