# Sponsor Notes

## Judge summary

PaylinkOps fits the MoonPay CLI Agents prize because MoonPay CLI is the actual action rail, not a decorative integration. The live product already proves wallet discovery, live deposit creation, deposit retrieval, and transaction inspection through the real CLI, then adds the missing operator layer around those actions: receipts, reconciliation context, and treasury follow-through.

## MoonPay evidence

- Verified local MoonPay CLI install: `1.12.4`
- Verified authenticated CLI session
- Verified live wallet alias: `main`
- Verified live MoonPay destination wallet: `0x870F29bD50CE5fe3e29437BB46a000318B07aA47`
- Verified live deposit id: `69c0cc009ec7c7dbcfb5e50c`
- Verified live deposit status: `active`
- Verified live deposit URL: [moonpay.hel.io/embed/deposit/b19ac33d-e916-4a88-b12f-cfd25a93a9f9](https://moonpay.hel.io/embed/deposit/b19ac33d-e916-4a88-b12f-cfd25a93a9f9)
- Verified live deposit retrieval in the local CLI on `2026-03-23`
- Verified live deposit transaction list currently returns no inbound transactions yet

## Strongest public evidence

- Deployed app: [paylinkops.xyz](https://paylinkops.xyz)
- Public screenshot: [raw.githubusercontent.com/p0s/PaylinkOps/main/public/screenshots/paylinkops-screenshot.png](https://raw.githubusercontent.com/p0s/PaylinkOps/main/public/screenshots/paylinkops-screenshot.png)
- Live MoonPay wallet: `0x870F29bD50CE5fe3e29437BB46a000318B07aA47`
- Ethereum explorer: [etherscan.io/address/0x870F29bD50CE5fe3e29437BB46a000318B07aA47](https://etherscan.io/address/0x870F29bD50CE5fe3e29437BB46a000318B07aA47)
- Base explorer: [basescan.org/address/0x870F29bD50CE5fe3e29437BB46a000318B07aA47](https://basescan.org/address/0x870F29bD50CE5fe3e29437BB46a000318B07aA47)
- Live deposit id: `69c0cc009ec7c7dbcfb5e50c`
- Deposit URL: [moonpay.hel.io/embed/deposit/b19ac33d-e916-4a88-b12f-cfd25a93a9f9](https://moonpay.hel.io/embed/deposit/b19ac33d-e916-4a88-b12f-cfd25a93a9f9)

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

No confirmed inbound payment transaction has been executed yet, so there is not yet a payment tx hash to include as settlement proof.
