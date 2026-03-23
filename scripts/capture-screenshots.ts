import fs from 'node:fs/promises';
import path from 'node:path';

const output = path.join(process.cwd(), 'public', 'screenshots', 'README.md');

async function main() {
  const content = [
    '# Screenshot Capture Targets',
    '',
    '- `landing.svg`',
    '- `dashboard.svg`',
    '- `receipts.svg`',
    '- `real-mode.svg`',
    '',
    'These assets are placeholders in this pass. Replace them with real captures before final submission.',
    '',
  ].join('\n');

  await fs.writeFile(output, content, 'utf8');
  console.log(`Wrote ${output}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

