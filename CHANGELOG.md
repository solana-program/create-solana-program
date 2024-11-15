# create-solana-program

## 0.3.18

### Patch Changes

- [#104](https://github.com/solana-program/create-solana-program/pull/104) [`b6115d0`](https://github.com/solana-program/create-solana-program/commit/b6115d02350f0980748c192808d58c0ac2a03cc8) Thanks [@samuelvanderwaal](https://github.com/samuelvanderwaal)! - Cache and restore external accounts

## 0.3.17

### Patch Changes

- [#105](https://github.com/solana-program/create-solana-program/pull/105) [`2898f0f`](https://github.com/solana-program/create-solana-program/commit/2898f0ffec356fd6e753dfb5831a36679e31f807) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Update web3.js to ^2.0.0 (removes the RC tag)

## 0.3.16

### Patch Changes

- [#101](https://github.com/solana-program/create-solana-program/pull/101) [`5f27fdf`](https://github.com/solana-program/create-solana-program/commit/5f27fdfaa93e8bf6065fcb071ed8e846542f1e0e) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Remove unused `@solana/webcrypto-ed25519-polyfill` dependency in JS client

- [#103](https://github.com/solana-program/create-solana-program/pull/103) [`f2e1453`](https://github.com/solana-program/create-solana-program/commit/f2e1453b0d7aefd80d409663f64acd04ed1d0ae6) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Use `2.0.0-rc.4` version of web3.js

## 0.3.15

### Patch Changes

- [#99](https://github.com/solana-program/create-solana-program/pull/99) [`938afd3`](https://github.com/solana-program/create-solana-program/commit/938afd3d0434d290a06dfc89cb5c1f6dcd3cac35) Thanks [@febo](https://github.com/febo)! - Use install-solana action from solana-program

- [#100](https://github.com/solana-program/create-solana-program/pull/100) [`faa8768`](https://github.com/solana-program/create-solana-program/commit/faa87683239dfd63a30d8557670a9512b743ddb6) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Add repository URL to package.json of generated JS clients

- [#96](https://github.com/solana-program/create-solana-program/pull/96) [`3487f44`](https://github.com/solana-program/create-solana-program/commit/3487f448781616bf1ed8b87da3addd0c939b42f8) Thanks [@febo](https://github.com/febo)! - Use loop on program scripts

- [#98](https://github.com/solana-program/create-solana-program/pull/98) [`0e9c6bd`](https://github.com/solana-program/create-solana-program/commit/0e9c6bd3bb237df762afc93172b99bd6932cf23f) Thanks [@febo](https://github.com/febo)! - Use cargo test directly on Rust client script

## 0.3.14

### Patch Changes

- [#93](https://github.com/solana-program/create-solana-program/pull/93) [`e5c620d`](https://github.com/solana-program/create-solana-program/commit/e5c620d05c494a4ce879580b5d9b15fb7f9a0a33) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Use Codama v1.0.0 (See https://github.com/codama-idl/codama/pull/234)

- [#90](https://github.com/solana-program/create-solana-program/pull/90) [`2594fb8`](https://github.com/solana-program/create-solana-program/commit/2594fb891266e4aec0c5f9090ad40ee8d55eda12) Thanks [@kevinrodriguez-io](https://github.com/kevinrodriguez-io)! - Adds extra assertion helpers for shank programs

- [#95](https://github.com/solana-program/create-solana-program/pull/95) [`380ec4f`](https://github.com/solana-program/create-solana-program/commit/380ec4f69a7eb8e2489c2f91a229bcc103851df7) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Use `2.0.0-rc.1` version of web3.js

- [#94](https://github.com/solana-program/create-solana-program/pull/94) [`218cebf`](https://github.com/solana-program/create-solana-program/commit/218cebfbca361df26ff6d043bd70d8e69a52becf) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Use Node v20

## 0.3.13

### Patch Changes

- [#89](https://github.com/solana-program/create-solana-program/pull/89) [`1347315`](https://github.com/solana-program/create-solana-program/commit/13473159ddae78c3cc07bdbaf9ba70ba0bbd07bb) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Add anchor as optional feature in Rust client

- [#91](https://github.com/solana-program/create-solana-program/pull/91) [`399f593`](https://github.com/solana-program/create-solana-program/commit/399f5937089cac3f6dfa42a5b907af1179570c4f) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Bump Kinobi version

- [#83](https://github.com/solana-program/create-solana-program/pull/83) [`afc1c6d`](https://github.com/solana-program/create-solana-program/commit/afc1c6d45d820a76b72b024eebef6feec645d029) Thanks [@buffalojoec](https://github.com/buffalojoec)! - Updates Rust linting scripts to use the proper toolchain.

## 0.3.12

### Patch Changes

- [#85](https://github.com/solana-program/create-solana-program/pull/85) [`bd9a598`](https://github.com/solana-program/create-solana-program/commit/bd9a5985b0be2e5152e0a82a0929d1e20cd63790) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Bump web3.js version to `rc` in JS clients

## 0.3.11

### Patch Changes

- [#81](https://github.com/solana-program/create-solana-program/pull/81) [`2f9e702`](https://github.com/solana-program/create-solana-program/commit/2f9e7020b8eddd14fd65528933a15c89495462db) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Improve Solana version link script

  `pnpm solana:link` now also asks you to download the required Solana version if it's not already installed. Additionally, if the required Solana version is equal to or greater than `1.18.19`, the install URL will use `release.anza.xyz` instead of `release.solana.com`.

## 0.3.10

### Patch Changes

- [`d3c55ba`](https://github.com/solana-program/create-solana-program/commit/d3c55ba445a28ecd04551a95887242d032048314) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Fix typo in main workflow

## 0.3.9

### Patch Changes

- [#78](https://github.com/solana-program/create-solana-program/pull/78) [`f360459`](https://github.com/solana-program/create-solana-program/commit/f360459b0bc274e859a2b80d7577e0c104a2b045) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Add library names to CLI options

## 0.3.8

### Patch Changes

- [#76](https://github.com/solana-program/create-solana-program/pull/76) [`9039243`](https://github.com/solana-program/create-solana-program/commit/903924365df769cc8b34357b749c15f8089541fa) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Add script and CI workflow for publishing JS clients

- [#77](https://github.com/solana-program/create-solana-program/pull/77) [`0544bde`](https://github.com/solana-program/create-solana-program/commit/0544bdea0e706a49808798ef7f128927590e0f41) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Add script and CI workflow for publishing Rust clients

- [#75](https://github.com/solana-program/create-solana-program/pull/75) [`4adf466`](https://github.com/solana-program/create-solana-program/commit/4adf4662648f7a8c765980ab974c30ec4e493a21) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Add CLI versions to workspace Cargo.toml and Solana check scripts

- [#73](https://github.com/solana-program/create-solana-program/pull/73) [`2e17eb9`](https://github.com/solana-program/create-solana-program/commit/2e17eb9f5f0443faad2c1dbdee6293619b7055d6) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Add description and repository to Rust client Cargo.toml

## 0.3.7

### Patch Changes

- [#71](https://github.com/solana-program/create-solana-program/pull/71) [`4a55c62`](https://github.com/solana-program/create-solana-program/commit/4a55c62e77f96382019b9ef42a83c9978f20996e) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Detect installed Rust version

## 0.3.6

### Patch Changes

- [#69](https://github.com/solana-program/create-solana-program/pull/69) [`93f24f2`](https://github.com/solana-program/create-solana-program/commit/93f24f2165065450a7d486cbf9578fcc790fa2d9) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Install Solana in CI for Anchor IDL checks

## 0.3.5

### Patch Changes

- [#67](https://github.com/solana-program/create-solana-program/pull/67) [`8c09a9b`](https://github.com/solana-program/create-solana-program/commit/8c09a9bd521a4758865489a6a53c9f916c2764a7) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Fix workspace Cargo.toml and generated CI

## 0.3.4

### Patch Changes

- [#65](https://github.com/solana-program/create-solana-program/pull/65) [`f3d5e88`](https://github.com/solana-program/create-solana-program/commit/f3d5e887d284f4ba338d5bf3ebe951c1bbc29fc5) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Improve generated CI from feedback

## 0.3.3

### Patch Changes

- [#63](https://github.com/solana-program/create-solana-program/pull/63) [`5780c84`](https://github.com/solana-program/create-solana-program/commit/5780c84ea5e1ee6b2dcedd5434eca263eb83d1cd) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Fix Prettier inconsistencies between generated scripts and JS client

- [`7232fa8`](https://github.com/solana-program/create-solana-program/commit/7232fa83a4d3adf1815e40b586e156a28dcb9449) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Fix tsup version

- [`5f51192`](https://github.com/solana-program/create-solana-program/commit/5f511926d1610f29d5739147b9ac6a36bfa1b86e) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Fix prettier option in JS renderer

- [`fd72e33`](https://github.com/solana-program/create-solana-program/commit/fd72e33579881279ab38c6411b903acf946e281f) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Use double quotes in script folder

## 0.3.2

### Patch Changes

- [`ede1718`](https://github.com/solana-program/create-solana-program/commit/ede17186cc0b560fac8cc47c491b4eee498919ca) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Fix README version badge for shank generated projects

## 0.3.1

### Patch Changes

- [`d5bdaa5`](https://github.com/solana-program/create-solana-program/commit/d5bdaa5cf56da9e15377b76d8296d65b11eb2487) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Fix README badges for generated projects

## 0.3.0

### Minor Changes

- [#59](https://github.com/solana-program/create-solana-program/pull/59) [`c8f8831`](https://github.com/solana-program/create-solana-program/commit/c8f88318206142e2eca3e2d0c62e4632bbc85f1a) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Bump Kinobi to 0.21.0 and web3.js to tp4

## 0.2.9

### Patch Changes

- [#57](https://github.com/solana-program/create-solana-program/pull/57) [`76ecd20`](https://github.com/solana-program/create-solana-program/commit/76ecd2056aab80e8dca1eb1d0e921d1309f9e52c) Thanks [@febo](https://github.com/febo)! - Switch to use cd function

- [#58](https://github.com/solana-program/create-solana-program/pull/58) [`f6f6dfa`](https://github.com/solana-program/create-solana-program/commit/f6f6dfa572f8b335af40ca4e49317e5555d222c9) Thanks [@febo](https://github.com/febo)! - Use loop to build programs sequentially

- [#56](https://github.com/solana-program/create-solana-program/pull/56) [`10a3345`](https://github.com/solana-program/create-solana-program/commit/10a33456e7d57c40042be9cb82044dc01bdcafed) Thanks [@febo](https://github.com/febo)! - Fix command-line args parsing on scripts

- [#54](https://github.com/solana-program/create-solana-program/pull/54) [`289b39b`](https://github.com/solana-program/create-solana-program/commit/289b39bc28e5b58084cef62586cc8d6a35045128) Thanks [@febo](https://github.com/febo)! - Add support for external accounts

## 0.2.8

### Patch Changes

- [#53](https://github.com/solana-program/create-solana-program/pull/53) [`b7f957c`](https://github.com/solana-program/create-solana-program/commit/b7f957cac7981b733fe54e8092b96201c841f9d2) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Add main CI workflow

- [#51](https://github.com/solana-program/create-solana-program/pull/51) [`587286c`](https://github.com/solana-program/create-solana-program/commit/587286c94a8b2b06b1b40bd94a2874f479834591) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Add lint scripts for generated clients

## 0.2.7

### Patch Changes

- [`33bf639`](https://github.com/solana-program/create-solana-program/commit/33bf63950cb8e5a39e21791f05fab11eabc1c576) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Fix Anchor error name

## 0.2.6

### Patch Changes

- [#46](https://github.com/solana-program/create-solana-program/pull/46) [`baede97`](https://github.com/solana-program/create-solana-program/commit/baede97555ffc546deca6ce79e2dc508363d156a) Thanks [@febo](https://github.com/febo)! - Suppress node warnings when running ava

- [#48](https://github.com/solana-program/create-solana-program/pull/48) [`6480919`](https://github.com/solana-program/create-solana-program/commit/64809195f471a27f8bf8dc4f7e136b615a73020f) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Add support for Anchor

## 0.2.5

### Patch Changes

- [#44](https://github.com/solana-program/create-solana-program/pull/44) [`312fb99`](https://github.com/solana-program/create-solana-program/commit/312fb9993c1ff94550ef82ef8252639f7f74a86a) Thanks [@febo](https://github.com/febo)! - Fix program env variable regex

## 0.2.4

### Patch Changes

- [#42](https://github.com/solana-program/create-solana-program/pull/42) [`2d199b4`](https://github.com/solana-program/create-solana-program/commit/2d199b4a66933759dc252388582300f9e1788c98) Thanks [@samuelvanderwaal](https://github.com/samuelvanderwaal)! - Improve close account helper function performance in Rust client

## 0.2.3

### Patch Changes

- [#39](https://github.com/solana-program/create-solana-program/pull/39) [`5a36fc9`](https://github.com/solana-program/create-solana-program/commit/5a36fc9b03797736413a4ab713cb1e287603c421) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Update License to Apache 2.0

- [#40](https://github.com/solana-program/create-solana-program/pull/40) [`1e34b70`](https://github.com/solana-program/create-solana-program/commit/1e34b7082613380fb2c6f1fe6aea36e3a7cb8e6b) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Improve JS client build configurations

## 0.2.2

### Patch Changes

- [#37](https://github.com/solana-program/create-solana-program/pull/37) [`5fb78a5`](https://github.com/solana-program/create-solana-program/commit/5fb78a5ecffb00fae7271a446cb9b005a0c380ce) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Update Kinobi and pnpm

## 0.2.1

### Patch Changes

- [#36](https://github.com/solana-program/create-solana-program/pull/36) [`900ed38`](https://github.com/solana-program/create-solana-program/commit/900ed38281e25f33559c77cc838ff635ebdc0d35) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Use commonjs package type for JS client

- [`41d47d0`](https://github.com/solana-program/create-solana-program/commit/41d47d06339d3af4074ccdbd9de35a63655cff11) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Add prepublishOnly script to JS client

## 0.2.0

### Minor Changes

- [#33](https://github.com/solana-program/create-solana-program/pull/33) [`ecaeae3`](https://github.com/solana-program/create-solana-program/commit/ecaeae3a7d74e0f73af656c26f9d5a764fb6fe4a) Thanks [@lorisleiva](https://github.com/lorisleiva)! - Update Kinobi to 0.19 and Web3.js to tp3

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
