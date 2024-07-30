---
"create-solana-program": patch
---

Improve Solana version link script

`pnpm solana:link` now also asks you to download the required Solana version if it's not already installed. Additionally, if the required Solana version is equal to or greater than `1.18.19`, the install URL will use `release.anza.xyz` instead of `release.solana.com`.
