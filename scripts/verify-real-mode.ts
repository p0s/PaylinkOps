import { access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

async function main() {
  const candidates = [
    path.resolve(process.cwd(), '.local/npm-global/bin/mp'),
    '/opt/homebrew/bin/mp',
  ];

  for (const candidate of candidates) {
    try {
      await access(candidate, constants.X_OK);
      console.log(`MoonPay CLI binary is present at ${candidate}.`);
      console.log('This script is a smoke-path placeholder and does not perform destructive actions.');
      return;
    } catch {
      continue;
    }
  }

  try {
    await access('/opt/homebrew/bin/mp', constants.X_OK);
    console.log('MoonPay CLI binary is present at /opt/homebrew/bin/mp.');
  } catch {
    console.log('MoonPay CLI binary was not detected in the repo-local or Homebrew locations.');
  }

  console.log('This script is a smoke-path placeholder and does not perform destructive actions.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
