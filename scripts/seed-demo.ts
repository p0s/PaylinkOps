import fs from 'node:fs/promises';
import path from 'node:path';

const statePath = path.join(process.cwd(), '.local', 'state.json');

async function main() {
  await fs.mkdir(path.dirname(statePath), { recursive: true });

  const current = {
    mode: 'demo',
    note: 'This is a local seed file placeholder for the submission bundle.',
    updatedAt: new Date().toISOString(),
  };

  await fs.writeFile(statePath, JSON.stringify(current, null, 2), 'utf8');
  console.log(`Wrote ${statePath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

