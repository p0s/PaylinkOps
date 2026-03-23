import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export async function withTempCwd<T>(fn: () => Promise<T>): Promise<T> {
  const cwd = process.cwd();
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'paylinkops-test-'));

  try {
    process.chdir(tempDir);
    return await fn();
  } finally {
    process.chdir(cwd);
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}
