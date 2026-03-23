# AGENTS.md

Repository operating rules for `OWSpolicywallet`.

## Product alignment

- Use `SPEC.md` as the current product-alignment document.
- Use it to decide what to build and to stay aligned on the core demo and submission goal.
- If `SPEC.md` does not exist yet, create it before substantial product work so the repo has a current alignment document.
- If the human asks for something significantly different from `SPEC.md`, confirm the new direction first.
- After the direction is agreed, update `SPEC.md` so the repo has a current source of truth.
- Do not spend time on generic marketplace features, growth features, or unrelated dashboards.

## Implementation style

- Use a hard cutover approach. Do not prioritize backward compatibility unless the human explicitly asks for it.
- Keep code boring, explicit, and readable.
- Prefer simple contracts and straightforward app flows over clever abstractions.
- Use strong typing end to end.
- If an integration is blocked, replace it with the smallest honest implementation that preserves the demo loop.

## Security and privacy

- Keep secrets, env vars, API keys, and private data out of git.
- Keep secrets and private data out of logs, screenshots, and shared artifacts.
- Use repo-local ignored files such as `.secrets/`, `tooling.md`, and `.vercel/` for local-only operational state.

## Tooling memory

- Record important tooling realities in `tooling.md` whenever something materially works, fails, or requires a non-obvious workaround in this environment.
