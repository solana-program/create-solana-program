---
"create-solana-program": patch
---

Use fixed counter address in snapshots

This prevents new keypairs from being generated and avoids having lots of unnecessary address changes between snapshots.