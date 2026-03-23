import { access } from 'node:fs/promises';
import * as childProcess from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';
import { AppConfig } from '@/lib/config';
import { CliReceipt } from '@/lib/moonpay/adapter';

const run = promisify(childProcess.execFile);

async function resolveCliBinary(): Promise<string> {
  for (const candidate of AppConfig.cliBinaryCandidates) {
    if (candidate.includes('/')) {
      const absolute = path.resolve(process.cwd(), candidate);
      try {
        await access(absolute);
        return absolute;
      } catch {
        continue;
      }
    }
    return candidate;
  }
  return AppConfig.cliBinary;
}

export async function runCliCommand(args: string[], timeoutMs = AppConfig.cliTimeoutMs): Promise<CliReceipt> {
  const start = Date.now();
  const command = await resolveCliBinary();

  try {
    const result = await run(command, args, {
      timeout: timeoutMs,
      maxBuffer: 1_000_000,
      windowsHide: true,
      env: {
        ...process.env,
      },
      encoding: 'utf8',
    });

    const stdout = (result.stdout as string | undefined) ?? '';
    const stderr = (result.stderr as string | undefined) ?? '';
    return {
      command: [command, ...args],
      stdout,
      stderr,
      parsed: {
        durationMs: Date.now() - start,
      },
      exitCode: 0,
      success: true,
    };
  } catch (error) {
    const reason = error as NodeJS.ErrnoException & { stdout?: string; stderr?: string; code?: number };

    return {
      command: [command, ...args],
      stdout: (reason.stdout as string | undefined) ?? '',
      stderr: (reason.stderr as string | undefined) ?? String(reason.message || 'error'),
      parsed: {
        durationMs: Date.now() - start,
        signal: (reason as NodeJS.ErrnoException).code === 'ENOENT' ? 'missing-binary' : undefined,
      },
      exitCode: (reason as NodeJS.ErrnoException).code === 'ENOENT' ? 127 : (reason.code ?? 1),
      success: false,
    };
  }
}

export function sanitizeCommandPreview(command: string[]): string {
  return command
    .map((arg) => arg.replace(/--(email|code|token|private-key|secret|passphrase)=?.*/i, '--redacted'))
    .join(' ');
}
