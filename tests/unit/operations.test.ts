import { describe, expect, it } from 'vitest';
import { fetchDashboard, planSweep } from '@/lib/operations';
import { withTempCwd } from './helpers';

describe('operations', () => {
  it('builds a demo dashboard snapshot from the seeded store', async () => {
    await withTempCwd(async () => {
      const dashboard = await fetchDashboard('demo');

      expect(dashboard.mode).toBe('demo');
      expect(dashboard.modeStatus.message).toMatch(/demo/i);
      expect(dashboard.wallets.length).toBeGreaterThan(0);
      expect(dashboard.paylinksCount).toBe(3);
      expect(dashboard.receiptCount).toBeGreaterThan(0);
    });
  });

  it('creates a conservative sweep plan for demo mode', async () => {
    await withTempCwd(async () => {
      const plan = await planSweep('demo', {
        walletAlias: 'demo-main',
        destinationAddress: '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae7',
      });

      expect(plan.requiresConfirmation).toBe(true);
      expect(plan.commandPreview).toContain('demo-main');
      expect(plan.destinationAddress).toContain('0xde0b');
    });
  });
});
