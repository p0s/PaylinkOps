import { describe, expect, it, vi } from 'vitest';

vi.mock('node:child_process', () => {
  const execFile = vi.fn();
  return { execFile };
});

import { execFile } from 'node:child_process';
import { runCliCommand, sanitizeCommandPreview } from '@/lib/moonpay/commands';

describe('CLI command wrapper', () => {
  it('redacts sensitive flags in previews', () => {
    expect(
      sanitizeCommandPreview(['mp', 'login', '--email=test@example.com', '--code=123456', '--token=secret']),
    ).toBe('mp login --redacted --redacted --redacted');
  });

  it('returns a useful failure shape when the binary is missing', async () => {
    vi.mocked(execFile).mockImplementation((...mockArgs: any[]) => {
      const cb = mockArgs[mockArgs.length - 1] as (error: NodeJS.ErrnoException | null, stdout: string, stderr: string) => void;
      const error = new Error('spawn mp ENOENT') as NodeJS.ErrnoException;
      error.code = 'ENOENT';
      cb(error, '', '');
      return {} as never;
    });

    const result = await runCliCommand(['wallet', 'list']);

    expect(result.success).toBe(false);
    expect(result.exitCode).toBe(127);
    expect(result.stderr).toMatch(/not found|ENOENT/i);
  });
});
