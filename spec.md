# spec.md — PaylinkOps (MoonPay)

## 0) Read this first

This spec is written for Codex to execute end-to-end on the user's MacBook.

The job is to fully build, test, fix, test again, document, commit, and push a complete hackathon-ready project called **PaylinkOps**.

Use subagents when useful for parallel, well-scoped workstreams such as implementation slices, research on current submission requirements, or test/documentation preparation. Keep ownership boundaries clear, avoid overlapping edits, and integrate their outputs into the main build.

Do **not** leak or commit any secrets, private keys, emails, auth tokens, or local wallet material.

Do **not** auto-submit the project to Synthesis without an explicit confirmation from the user in the active session. Prepare everything for submission, create the project inside the user's existing Synthesis team using the official Synthesis method if possible, but stop before the final submit action until the user says to submit.

Make meaningful commits throughout the build. Avoid one giant commit.

Keep design **modern minimalist**:
- clean layout
- lots of whitespace
- neutral palette
- subtle accent color
- simple rounded cards
- monospace blocks for receipts / CLI output
- no gimmicks

Build **two layers**:
1. **Demo layer** — works out of the box with seeded/demo data and no MoonPay auth.
2. **Real integration layer** — uses the real MoonPay CLI on the user's machine when available.

The user must be able to experience the real integration layer locally, and have the demo layer as fallback if real integration is unavailable.

---

## 1) Project choice

### Name
**PaylinkOps**

### One-line pitch
A minimalist merchant operations console for AI agents and crypto-native teams that creates MoonPay deposit links, tracks incoming payments, reconciles receipts, and prepares treasury sweeps using MoonPay CLI as the real money rail.

### Why this is the right build
This is the easiest strong MoonPay project to ship because it focuses on features MoonPay CLI explicitly supports:
- wallet management
- deposit links
- deposit transaction inspection
- local wallet security
- optional transfer/sweep actions

It avoids crowded MoonPay patterns already seen in the public field:
- generic wallet copilot
- DCA bot
- portfolio rebalancer
- treasury guardrail engine
- another broad agent wallet

It is specific, useful, sponsor-shaped, and realistic.

### Primary sponsor target
- **MoonPay CLI Agents**

### Secondary / optional sponsor target
- **OpenWallet Standard**
  - treat this as an optional future extension path, not a core current claim
  - only include as a secondary submission target if the wallet layer becomes polished and clearly defensible
  - do not force extra complexity just to chase this

### Explicitly avoid
Do **not** select any of the tracks the user already used on the first project.

---

## 2) Product definition

### Core use case
A founder, operator, or AI workflow wants to:
1. create a crypto payment link tied to a wallet + token + chain
2. monitor whether payment arrived
3. reconcile the payment against an expected invoice/order
4. optionally sweep or route funds to a treasury destination
5. keep receipts proving what happened

### Key user promise
**“Create a payment link, track the money, and keep auditable receipts — with a demo mode that always works and a real MoonPay CLI mode when configured.”**

### Non-goals
Do not build:
- full accounting software
- fiat bookkeeping
- OCR-heavy invoice extraction
- broad portfolio analytics
- a trading terminal
- a deep virtual-account / compliance workflow unless it naturally falls out with low effort

Keep the project tightly scoped.

---

## 3) Success criteria

The project is complete when all of the following are true:

### Product
- There is a polished landing page.
- There is a working dashboard with:
  - wallets
  - paylinks
  - payment ledger
  - receipts
  - settings/mode switch
- Demo mode works without any external dependency.
- Real mode works locally if `mp` is installed and already authenticated.

### MoonPay integration
- The app detects whether MoonPay CLI is installed.
- The app can list local MoonPay wallets in real mode.
- The app can create a real MoonPay deposit link in real mode.
- The app can inspect a deposit link / deposit transactions in real mode.
- The app stores sanitized receipts from real CLI actions.
- The app never exposes secrets.

### UX
- The user can switch between demo mode and real mode.
- Real-mode destructive actions are guarded by explicit confirmation.
- If any real command fails, the UI falls back gracefully and clearly explains what happened.

### Engineering
- App runs locally with one command after install.
- There are unit tests.
- There are end-to-end tests for demo mode.
- There is at least one smoke path for real mode.
- Lint/typecheck/build pass.

### Submission readiness
- README is strong and sponsor-aware.
- Submission files are generated and filled.
- Cover image and screenshots exist.
- Demo script exists.
- `submission/` folder is complete.
- Final project creation inside Synthesis team is prepared.
- Final submit action is blocked behind explicit user confirmation.

---

## 4) Recommended stack

Use the simplest production-grade stack:

- **Next.js 14 or 15** with App Router
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** or a minimal custom component layer
- **Zod** for validation
- **Vitest** for unit tests
- **Playwright** for end-to-end tests
- **Node child_process / execa** for MoonPay CLI integration
- lightweight local persistence:
  - default: JSON files in an untracked local `.local/` directory for local development
  - demo deployment: seeded data + browser localStorage fallback
- optional: `react-hook-form`
- optional: `zustand` or server actions for state simplicity

Do **not** add unnecessary infrastructure.

### Hosting
- **Primary recommendation:** Vercel for public demo
- public deployment should default to **demo mode**
- local run on the user's MacBook should support **real mode**
- GitHub Pages is allowed only if the final build can still present a meaningful demo; otherwise use Vercel

---

## 5) App structure

Use a simple repo, no monorepo unless needed.

Suggested structure:

```text
paylinkops/
  app/
    (marketing)/
    dashboard/
      page.tsx
      wallets/
      paylinks/
      ledger/
      receipts/
      settings/
    api/
      health/route.ts
      mode/route.ts
      moonpay/status/route.ts
      moonpay/wallets/route.ts
      moonpay/paylinks/create/route.ts
      moonpay/paylinks/[id]/route.ts
      moonpay/paylinks/[id]/transactions/route.ts
      moonpay/sweeps/plan/route.ts
      moonpay/sweeps/execute/route.ts
      receipts/route.ts
  components/
  lib/
    config.ts
    mode.ts
    storage/
    moonpay/
      adapter.ts
      demo-adapter.ts
      cli-adapter.ts
      parsers.ts
      commands.ts
    receipts/
    demo/
    validation/
  public/
    screenshots/
    cover.png
  scripts/
    verify-real-mode.ts
    seed-demo.ts
    capture-screenshots.ts
    prepare-submission.ts
  submission/
    submission-metadata.json
    tracks.md
    sponsor-notes.md
    demo-script.md
    checklist.md
    agent.json
    agent_log.json
  tests/
    unit/
    e2e/
  .env.example
  README.md
  spec.md
```

---

## 6) Core feature set

### 6.1 Landing page
A sponsor-aware landing page with:
- project name
- one-line pitch
- “Demo mode” and “Real MoonPay mode” callouts
- sponsor-specific section explaining why MoonPay benefits from this solution
- screenshots / GIFs / short walkthrough
- buttons:
  - Try demo
  - Run real mode locally
  - View receipts
  - View README / GitHub

### 6.2 Dashboard overview
Show:
- current mode: demo / real
- MoonPay CLI status
- wallet count
- active paylinks
- paid / pending / overdue counts
- latest receipts
- latest ledger entries

### 6.3 Wallets
In demo mode:
- seeded wallets with realistic chains and addresses

In real mode:
- call MoonPay CLI to list local wallets
- display wallet aliases + addresses by chain
- allow refresh

Do **not** support importing/exporting keys in the UI.

### 6.4 Create paylink
Form fields:
- internal name
- customer / payer label
- wallet alias
- chain
- token
- expected amount (optional but recommended)
- optional notes / order id / invoice id
- optional due date

Behavior:
- demo mode: create a fake paylink with a believable URL/id
- real mode: call MoonPay deposit creation command and store raw receipt + parsed result
- always persist a local record for ledger reconciliation

### 6.5 Paylink detail
Show:
- paylink metadata
- status
- expected vs received amount
- created-at
- transaction list
- raw receipt
- related local notes

### 6.6 Ledger
Table columns:
- created date
- paylink name
- payer label
- expected amount
- received amount
- token / chain
- status
- evidence count

Statuses:
- draft
- link-created
- awaiting-payment
- partially-paid
- paid
- reconciled
- error

### 6.7 Receipts
A first-class receipts page:
- list every real or demo action
- filter by type: wallet, paylink, sync, sweep
- show command or simulated action
- show result summary
- show raw stdout/stderr excerpt (sanitized)
- export JSON

This should be a hackathon strength, not an afterthought.

### 6.8 Sweep planner
Keep actual execution conservative.

Phase 1:
- generate a sweep plan from paid paylinks to a destination address
- calculate grouped transfers by chain/token
- show a recommended CLI command or plan
- no actual transfer yet

Phase 2 (optional but recommended if stable):
- allow execution through real MoonPay CLI with a hard confirmation modal
- store receipt
- make this off by default behind:
  - a settings toggle
  - a confirmation phrase like `SWEEP NOW`

If execution is unstable, keep sweep planning only. A stable planner is better than a broken live transfer.

### 6.9 Settings page
Show:
- current mode
- detected MoonPay CLI version / availability if possible
- guidance for real mode setup
- toggle: allow live transfer actions
- storage reset controls for demo mode
- docs links
- copyable commands for local setup

---

## 7) Demo layer vs real integration layer

This is mandatory.

### 7.1 Demo layer
Must always work without MoonPay auth.

Provide:
- seeded wallets
- seeded paylinks
- seeded incoming transactions
- seeded receipts
- seeded sweep plans
- a guided happy path demo

Add a “Load sample merchant scenario” button that creates:
- 3 paylinks
- 1 paid
- 1 pending
- 1 partial
- 1 sweep plan

### 7.2 Real integration layer
Use the real MoonPay CLI.

Important design choice:
- **Do not** attempt to automate MoonPay login inside the web app.
- Instead, provide a guided setup:
  1. install `@moonpay/cli`
  2. run `mp login --email ...`
  3. run `mp verify --email ... --code ...`
  4. create a wallet if needed
  5. return to the app

The app should then detect the authenticated CLI and use it.

This avoids browser/captcha complexity and is the right tradeoff.

---

## 8) MoonPay integration design

Create an interface:

```ts
interface MoonPayAdapter {
  getStatus(): Promise<MoonPayStatus>;
  listWallets(): Promise<WalletSummary[]>;
  createPaylink(input: CreatePaylinkInput): Promise<CreatePaylinkResult>;
  getPaylink(id: string): Promise<PaylinkDetails>;
  listPaylinkTransactions(id: string): Promise<PaylinkTransaction[]>;
  planSweep(input: SweepPlanInput): Promise<SweepPlan>;
  executeSweep?(input: ExecuteSweepInput): Promise<SweepExecutionResult>;
}
```

Implement two adapters:

### 8.1 Demo adapter
- deterministic fake data
- zero network dependency
- all outputs shaped like the real adapter output
- include `rawReceipt` fields for consistency

### 8.2 CLI adapter
Use `execa` or `child_process.execFile` with hard timeouts.

#### Commands to support
Use the documented MoonPay CLI commands where possible:

- `mp wallet list`
- `mp wallet retrieve --wallet <alias>`
- `mp deposit create --name <name> --wallet <wallet> --chain <chain> --token <token>`
- `mp deposit retrieve --id <id>`
- `mp deposit transaction list --id <id>`

Optional:
- `mp token balance list --wallet <wallet> --chain <chain>`
- `mp token transfer ...`

#### Command wrapper rules
- sanitize all arguments
- never interpolate shell strings unsafely
- use array args
- enforce timeout
- capture stdout + stderr
- persist a sanitized receipt record
- if output is not JSON, keep raw text and parse conservatively
- if parse fails, still return raw output to UI instead of throwing away the result

#### Status detection
Implement `getStatus()` roughly like this:
1. detect `mp` binary
2. run a cheap read-only command
3. infer:
   - installed / not installed
   - authenticated / not authenticated
   - wallets present / absent
4. return human-readable guidance

Do not fail hard on missing CLI.

---

## 9) Parsing strategy

MoonPay CLI output may not be perfectly machine-friendly. Build defensively.

### Rules
- Prefer structured parse if the command supports it.
- Otherwise:
  - keep raw stdout
  - extract key fields with regex / line-based heuristics
  - show “raw receipt” panel
- For deposit creation, attempt to extract:
  - deposit id
  - payment URL / checkout URL
  - wallet alias
  - chain
  - token
- For transaction list, attempt to extract:
  - tx id / hash
  - amount
  - token
  - timestamp
  - status

Write parser fixtures and unit tests around real or mocked CLI output samples.

---

## 10) Data model

Keep it simple.

### WalletProfile
```ts
type WalletProfile = {
  id: string;
  alias: string;
  source: "demo" | "moonpay-cli";
  addresses: Record<string, string>;
  createdAt: string;
  updatedAt: string;
};
```

### PaylinkRecord
```ts
type PaylinkRecord = {
  id: string;
  sourceId?: string; // MoonPay deposit id if real
  mode: "demo" | "real";
  name: string;
  payerLabel?: string;
  walletAlias: string;
  chain: string;
  token: string;
  expectedAmount?: string;
  dueDate?: string;
  notes?: string;
  status: "draft" | "link-created" | "awaiting-payment" | "partially-paid" | "paid" | "reconciled" | "error";
  paymentUrl?: string;
  createdAt: string;
  updatedAt: string;
};
```

### LedgerEntry
```ts
type LedgerEntry = {
  id: string;
  paylinkId: string;
  expectedAmount?: string;
  receivedAmount?: string;
  deltaAmount?: string;
  status: string;
  lastSyncedAt?: string;
};
```

### Receipt
```ts
type Receipt = {
  id: string;
  mode: "demo" | "real";
  action: string;
  command?: string[];
  sanitizedCommandPreview: string;
  exitCode?: number;
  stdout?: string;
  stderr?: string;
  parsed?: Record<string, unknown>;
  success: boolean;
  createdAt: string;
};
```

---

## 11) UX notes

### Design language
- white / off-white background
- restrained accent color
- large typography
- compact but elegant tables
- receipt cards in monospace blocks
- no noisy gradients
- no mascot illustrations unless they look polished

### Tone
- calm
- operator-grade
- trustworthy
- “local-first financial rail” vibe

### Copy suggestions
- “Paylinks with receipts”
- “MoonPay-powered merchant ops for agents”
- “Demo mode always works. Real mode uses your local MoonPay CLI.”

---

## 12) Security / privacy rules

Mandatory:
- never commit `~/.config/moonpay/*`
- never commit user email
- never commit auth tokens
- never store private keys in repo
- never log secrets to UI or files
- sanitize all CLI output before persistence
- `.env.example` only; no real `.env` values
- add `.gitignore` rules for:
  - `.env*`
  - `.local/`
  - logs
  - screenshots generated during local testing if needed
  - any MoonPay credentials references

Do not pretend there is stronger security than exists.

---

## 13) Local setup flow for real mode

The README and settings page must document this exactly:

1. Install Node deps
2. Install MoonPay CLI:
   ```bash
   npm install -g @moonpay/cli
   ```
3. Authenticate in terminal:
   ```bash
   mp login --email YOUR_EMAIL
   mp verify --email YOUR_EMAIL --code YOUR_CODE
   ```
4. Create a wallet if needed:
   ```bash
   mp wallet create --name main
   ```
5. Start the app:
   ```bash
   npm install
   npm run dev
   ```
6. Switch to Real Mode in settings
7. Refresh wallets
8. Create a live paylink

Also document that login is handled outside the app on purpose.

---

## 14) Testing plan

### 14.1 Unit tests
At minimum:
- parsers
- mode switching
- paylink status derivation
- sweep plan generation
- storage adapters
- CLI wrapper error handling

### 14.2 End-to-end tests
Use Playwright for demo mode:
- landing page loads
- user enters dashboard
- user creates demo paylink
- user sees receipt
- user loads sample scenario
- user opens ledger
- user exports receipts

### 14.3 Real mode smoke tests
Guard behind env flags and skip when unavailable.

Example smoke cases:
- MoonPay CLI detection
- wallet list command
- paylink create command with a test label
- paylink detail readback

Do not make real destructive transfer tests mandatory.

### 14.4 CI
If GitHub Actions are available:
- install deps
- lint
- typecheck
- unit tests
- Playwright demo tests
- build

Real integration smoke tests should be opt-in and not break CI.

---

## 15) README requirements

README must clearly explain:
- what PaylinkOps does
- why it matters
- why MoonPay benefits from it
- what is demo mode vs real mode
- how to run locally
- how to enable real MoonPay mode
- screenshots
- architecture diagram (simple)
- sponsor alignment section
- limitations / honest notes
- future work
- submission tracks being targeted

### Sponsor-focused README section
Be explicit that the app demonstrates:
- MoonPay CLI as the actual financial execution layer
- local, non-custodial wallet handling
- deposit link creation and reconciliation
- operator-facing receipts and traceability

Do not overclaim support for features not implemented.

---

## 16) Submission files to generate

Create a `submission/` folder with:

### 16.1 `submission-metadata.json`
Populate with the latest official Synthesis schema at execution time by reading:
- `https://synthesis.md/skill.md`
- `https://synthesis.md/submission/skill.md`

Do not hardcode stale assumptions if the live docs differ.

### 16.2 `tracks.md`
Recommended tracks:
- primary: MoonPay CLI Agents
- optional secondary: OpenWallet Standard (only if the wallet layer becomes strong enough to defend as more than future roadmap)

Do **not** include any track already used in the user's first project.

### 16.3 `sponsor-notes.md`
Include:
- what MoonPay feature set is actually used
- what demo receipts exist
- what real receipts exist
- screenshots proving sponsor integration

### 16.4 `demo-script.md`
A short step-by-step script for a 60–120 second demo:
1. open landing page
2. switch to dashboard
3. show demo mode
4. create a demo paylink
5. open receipts
6. switch to real mode
7. show detected wallets
8. create a live MoonPay paylink if configured
9. show raw receipt

### 16.5 `checklist.md`
A final checklist:
- build passes
- tests pass
- screenshots captured
- repo pushed
- deployment live
- submission metadata filled
- user approved final submission

### 16.6 `agent.json` and `agent_log.json`
Generate simple, honest, useful artifacts for Synthesis if helpful:
- what the agent can do
- how it decides
- evidence trail
- known limits

Do not fabricate logs.

---

## 17) Synthesis project creation + submission flow

This is mandatory but must stop before final submit unless the user explicitly confirms.

### Runtime rule
When the project is complete:
1. fetch the latest official Synthesis docs:
   - `https://synthesis.md/skill.md`
   - `https://synthesis.md/submission/skill.md`
2. read the latest method for:
   - team/project creation
   - required metadata fields
   - track selection
   - submission shape
3. create the new project **inside the user's team**, not as a separate personal project, if the current team context is available
4. prepare all payloads and local files
5. ask the user for explicit confirmation
6. only after explicit confirmation, execute final submission

### Important
- do not submit automatically
- do not choose previously used tracks
- do not include any private info
- do not include secrets in screenshots

If API/project creation fails, leave behind a clear manual fallback doc with exact steps and ready-to-paste JSON.

---

## 18) Git and commit plan

Use meaningful commits such as:

1. `feat: scaffold PaylinkOps app shell and design system`
2. `feat: add dashboard, wallets, paylinks, and ledger views`
3. `feat: implement demo data and local storage adapters`
4. `feat: add MoonPay CLI adapter with status detection`
5. `feat: support real paylink creation and receipt capture`
6. `test: add unit and demo e2e coverage`
7. `docs: write sponsor-focused README and submission assets`
8. `chore: prepare deployment and submission package`

Do not squash everything into one commit.

Push to GitHub when stable.
If `gh` is installed and authenticated, create the repo automatically.
If not authenticated, initialize git locally and leave precise instructions.

---

## 19) Deployment plan

### Public deployment
Deploy a demo-safe version to Vercel:
- default mode: demo
- no secrets required
- real mode disabled unless explicitly configured

### Local real integration
The user's MacBook run is the primary real-integration environment.

If simple and stable, also support a local production build:
```bash
npm run build
npm run start
```

---

## 20) Nice-to-have additions (only after core is stable)

Do these only if everything above already works:
- CSV export for ledger
- saved sweep templates
- local-first wallet policy profiles
- optional support for showing MoonPay token balances
- a small command palette
- optional OpenWallet Standard framing page

Do **not** let these delay the core flow.

---

## 21) Final acceptance checklist

Before considering the project done, verify all of this:

### Product
- [ ] landing page polished
- [ ] dashboard polished
- [ ] demo mode works fully
- [ ] real mode detects MoonPay CLI
- [ ] wallets page works
- [ ] paylink creation works in demo mode
- [ ] paylink creation works in real mode if configured
- [ ] receipts page is useful and readable
- [ ] ledger is coherent

### Quality
- [ ] lint passes
- [ ] typecheck passes
- [ ] unit tests pass
- [ ] Playwright demo tests pass
- [ ] build passes

### Docs
- [ ] README complete
- [ ] screenshots captured
- [ ] cover image created
- [ ] submission folder complete
- [ ] sponsor notes written

### Git / deployment
- [ ] meaningful commits made
- [ ] repo pushed
- [ ] demo deployed

### Submission
- [ ] latest Synthesis method re-read
- [ ] project prepared inside existing team
- [ ] user explicitly confirmed before final submit

---

## 22) Final instruction to Codex

Be pragmatic.

If a real MoonPay command is flaky, do not derail the whole project. Keep the demo layer excellent, keep the real layer honest, and store raw receipts so the sponsor value is obvious.

A tight, reliable MoonPay project with real CLI receipts is better than an over-scoped product with half-working features.
