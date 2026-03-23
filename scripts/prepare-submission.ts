import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const required = [
  'submission/submission-metadata.json',
  'submission/project-payload.json',
  'submission/tracks.md',
  'submission/sponsor-notes.md',
  'submission/demo-script.md',
  'submission/checklist.md',
  'submission/conversation-log.md',
  'submission/agent.json',
  'submission/agent_log.json',
  'submission/manual-fallback.md',
];

async function main() {
  const missing: string[] = [];

  for (const item of required) {
    try {
      await fs.access(path.join(root, item));
    } catch {
      missing.push(item);
    }
  }

  if (missing.length > 0) {
    console.error('Missing submission files:');
    for (const item of missing) {
      console.error(`- ${item}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Submission bundle is present.');
  console.log('Final publish is intentionally blocked until the user confirms it in the active session.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

