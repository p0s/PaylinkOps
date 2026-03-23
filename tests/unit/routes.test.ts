import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { GET as getHealth } from '@/api/health/route';
import { GET as getMode, POST as postMode } from '@/api/mode/route';
import { GET as getOverview } from '@/api/dashboard/overview/route';
import { withTempCwd } from './helpers';

describe('routes', () => {
  it('exposes a health check', async () => {
    const response = await getHealth();
    expect(await response.json()).toEqual({ status: 'ok', project: 'paylinkops' });
  });

  it('reads and updates the mode route', async () => {
    await withTempCwd(async () => {
      const current = await getMode();
      expect((await current.json()).mode).toBe('demo');

      const request = new NextRequest('http://localhost/api/mode', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ mode: 'real' }),
      });

      const updated = await postMode(request);
      expect((await updated.json()).mode).toBe('real');
    });
  });

  it('returns a seeded demo overview payload', async () => {
    await withTempCwd(async () => {
      const request = new NextRequest('http://localhost/api/dashboard/overview?mode=demo');
      const response = await getOverview(request);
      const payload = (await response.json()) as {
        mode: string;
        paylinks: unknown[];
        ledgers: unknown[];
        receipts: unknown[];
        wallets: unknown[];
      };

      expect(payload.mode).toBe('demo');
      expect(payload.wallets.length).toBe(2);
      expect(payload.paylinks.length).toBe(3);
      expect(payload.receipts.length).toBeGreaterThan(0);
    });
  });
});
