import { access } from 'node:fs/promises';
import { constants } from 'node:fs';

async function main() {
  try {
    await access('/opt/homebrew/bin/mp', constants.X_OK);
    console.log('MoonPay CLI binary is present at /opt/homebrew/bin/mp.');
  } catch {
    console.log('MoonPay CLI binary was not detected at /opt/homebrew/bin/mp.');
  }

  console.log('This script is a smoke-path placeholder and does not perform destructive actions.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

