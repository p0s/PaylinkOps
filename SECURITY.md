# Security Policy

## Supported Branch

Security fixes are handled on `main`.

## Reporting

Please do not open public issues for suspected vulnerabilities or leaked secrets. Report privately to the repository owner through GitHub.

Include the affected commit, reproduction steps, expected behavior, actual behavior, and impact.

## Secret Handling

Never commit MoonPay credentials, CLI auth state, API keys, private wallet material, `.env.local`, `.local/`, `.secrets/`, `.vercel/`, logs, or live submission payloads.

Real mode uses a local authenticated MoonPay CLI. Public deployments should default to demo mode and must not carry private CLI state.
