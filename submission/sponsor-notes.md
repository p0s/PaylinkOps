# Sponsor Notes

## MoonPay usage

PaylinkOps demonstrates MoonPay CLI as the primary action layer.

Implemented sponsor-facing behaviors:

- CLI detection through `mp --version`
- Wallet listing in real mode
- Deposit link creation in real mode
- Deposit retrieval and transaction inspection in real mode
- Sanitized receipts for CLI actions
- Explicit confirmation for sweep execution

## Demo receipts

Demo receipts are seeded locally so the product works without MoonPay auth.

They show:

- Sample paylink creation
- Sample ledger reconciliation states
- Seeded wallet and receipt history

## Real receipts

Real receipts are stored locally when the CLI succeeds or fails.

They keep:

- Command preview
- Exit code
- Sanitized stdout and stderr excerpts
- Parsed output when available

## Assets

Current capture targets:

- `public/cover.png`
- `public/cover.svg`
- `public/screenshots/`

Replace the placeholder assets with real captures before final submission if you want polished judging materials.

