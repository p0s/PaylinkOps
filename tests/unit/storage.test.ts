import { describe, expect, it } from 'vitest';
import { setAllowLiveSweeps, loadStore, resetStoreToSeeded, setMode } from '@/lib/storage/store';
import { getAllowLiveSweeps } from '@/lib/storage/store';
import { withTempCwd } from './helpers';

describe('storage', () => {
  it('bootstraps the seeded demo store in a fresh workspace', async () => {
    await withTempCwd(async () => {
      const store = await loadStore();

      expect(store.mode).toBe('demo');
      expect(store.wallets).toHaveLength(2);
      expect(store.paylinks).toHaveLength(3);
      expect(store.receipts[0]?.action).toBe('seeded-demo-data');
    });
  });

  it('persists mode and settings changes', async () => {
    await withTempCwd(async () => {
      await resetStoreToSeeded();
      await setMode('real');
      await setAllowLiveSweeps(true);

      const store = await loadStore();
      expect(store.mode).toBe('real');
      expect(await getAllowLiveSweeps()).toBe(true);
    });
  });
});
