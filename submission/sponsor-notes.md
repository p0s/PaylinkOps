# Sponsor Notes

## Judge summary

PaylinkOps fits the MoonPay CLI Agents prize because MoonPay CLI is the actual action rail, not a decorative integration. The live product already proves wallet discovery, live deposit creation, deposit retrieval, and transaction inspection through the real CLI, then adds the missing operator layer around those actions: receipts, reconciliation context, and treasury follow-through.

## Why this project is strong

PaylinkOps is strong because it is narrow, believable, and already evidenced by real execution. Instead of claiming a generic AI wallet assistant, it solves a specific operator problem that teams actually have after a payment rail exists: how to create a paylink, verify what happened, reconcile incoming funds, preserve receipts, and move toward treasury action without losing track of evidence.

That matters for judging because:

- the product is immediately legible
- the sponsor integration is load-bearing
- the evidence chain is explicit
- the demo path and the real path both work
- the project avoids over-claiming features that are not actually live

## MoonPay evidence

- Verified local MoonPay CLI install: `1.12.4`
- Verified authenticated CLI session
- Verified live wallet alias: `main`
- Verified live MoonPay destination wallet: `0x870F29bD50CE5fe3e29437BB46a000318B07aA47`
- Verified live deposit id: `69c0cc009ec7c7dbcfb5e50c`
- Verified live deposit status: `active`
- Verified live deposit URL: [moonpay.hel.io/embed/deposit/b19ac33d-e916-4a88-b12f-cfd25a93a9f9](https://moonpay.hel.io/embed/deposit/b19ac33d-e916-4a88-b12f-cfd25a93a9f9)
- Verified live deposit retrieval in the local CLI on `2026-03-23`
- Verified confirmed inbound chain payment tx: [etherscan.io/tx/0x06d391316044787ee27c790dc797b6ccfc7a796eac02725f508457dfa9d54c54](https://etherscan.io/tx/0x06d391316044787ee27c790dc797b6ccfc7a796eac02725f508457dfa9d54c54)
- Verified live deposit transaction list currently still returns no inbound transactions, which appears to be MoonPay-side indexing lag at the time of capture

## Strongest public evidence

- Deployed app: [paylinkops.xyz](https://paylinkops.xyz)
- Public screenshot: [raw.githubusercontent.com/p0s/PaylinkOps/main/public/screenshots/paylinkops-screenshot.png](https://raw.githubusercontent.com/p0s/PaylinkOps/main/public/screenshots/paylinkops-screenshot.png)
- Live MoonPay wallet: `0x870F29bD50CE5fe3e29437BB46a000318B07aA47`
- Ethereum explorer: [etherscan.io/address/0x870F29bD50CE5fe3e29437BB46a000318B07aA47](https://etherscan.io/address/0x870F29bD50CE5fe3e29437BB46a000318B07aA47)
- Base explorer: [basescan.org/address/0x870F29bD50CE5fe3e29437BB46a000318B07aA47](https://basescan.org/address/0x870F29bD50CE5fe3e29437BB46a000318B07aA47)
- Live deposit id: `69c0cc009ec7c7dbcfb5e50c`
- Deposit URL: [moonpay.hel.io/embed/deposit/b19ac33d-e916-4a88-b12f-cfd25a93a9f9](https://moonpay.hel.io/embed/deposit/b19ac33d-e916-4a88-b12f-cfd25a93a9f9)
- Confirmed inbound payment tx: [etherscan.io/tx/0x06d391316044787ee27c790dc797b6ccfc7a796eac02725f508457dfa9d54c54](https://etherscan.io/tx/0x06d391316044787ee27c790dc797b6ccfc7a796eac02725f508457dfa9d54c54)

## Why this matches MoonPay CLI Agents exactly

- MoonPay CLI is the primary action layer for the live path, not a side integration.
- The project demonstrates several MoonPay CLI capabilities together: wallet discovery, deposit creation, deposit retrieval, and transaction inspection.
- The app wraps those raw CLI actions in an agent- and operator-friendly product surface instead of stopping at a bare terminal demo.
- The receipts layer makes the CLI outputs durable, inspectable, and useful for downstream workflows.
- The product now includes a confirmed on-chain payment proof tied to the live deposit flow, which makes the integration materially stronger than a mock-only submission.

## Operator value

- A founder or operator can create a link and immediately see where funds are meant to land.
- A reviewer can inspect receipts instead of trusting screenshots or memory.
- A treasury or finance workflow can compare expected versus received value in one place.
- Demo mode ensures a full judging walkthrough even if MoonPay auth is unavailable on another machine.
- Real mode proves that the exact same product surface can sit on top of a live sponsor rail.

## On-chain references

- Ethereum destination wallet: `0x870F29bD50CE5fe3e29437BB46a000318B07aA47`
- Ethereum explorer: [etherscan.io/address/0x870F29bD50CE5fe3e29437BB46a000318B07aA47](https://etherscan.io/address/0x870F29bD50CE5fe3e29437BB46a000318B07aA47)
- Base explorer: [basescan.org/address/0x870F29bD50CE5fe3e29437BB46a000318B07aA47](https://basescan.org/address/0x870F29bD50CE5fe3e29437BB46a000318B07aA47)
- Bitcoin wallet: `bc1qqkjqqf2zzvgrfvdy0ecrx30wyjuha0f8gcj7lv`
- Bitcoin explorer: [mempool.space/address/bc1qqkjqqf2zzvgrfvdy0ecrx30wyjuha0f8gcj7lv](https://mempool.space/address/bc1qqkjqqf2zzvgrfvdy0ecrx30wyjuha0f8gcj7lv)
- Synthesis registration transaction: [basescan.org/tx/0x30806b449bf3e1b5e740b94ed9ebcc4c278f40fec702d9f905940263c526b8f7](https://basescan.org/tx/0x30806b449bf3e1b5e740b94ed9ebcc4c278f40fec702d9f905940263c526b8f7)

## Core benefits for judges

- Real MoonPay evidence exists now, not just mocked fixtures.
- The public screenshot is committed in-repo and can be opened directly from GitHub without needing any private asset host.
- Demo mode guarantees a full product walkthrough even if the live CLI path is temporarily unavailable.
- Receipt-first logging makes every live action inspectable instead of forcing judges to trust screenshots or console claims.
- The product solves a specific merchant-ops problem: creating deposit links is easy, but tracking and reconciling them cleanly is not.
- The UI gives both human operators and AI-friendly surfaces a clear way to understand paylink state, receipts, and treasury next steps.

## Track-fit framing

- For `MoonPay CLI Agents`, PaylinkOps matches the track directly: MoonPay CLI is the primary action layer and the product goes beyond a one-command demo by wrapping it in receipts, reconciliation, and operational follow-through.
- For `OpenWallet Standard`, the honest framing is future-facing: the local-first wallet layer could be pushed further later, but the current prize-strength claim is MoonPay-first.

## Honest gap

The chain payment is confirmed, but MoonPay CLI has not yet surfaced that inbound transfer in `deposit transaction list`, so the chain explorer is the strongest proof at capture time.
