import fs from 'node:fs/promises';
import path from 'node:path';
import { AppConfig } from '@/lib/config';
import {
  AppStore,
  initialStore,
  LedgerEntry,
  Mode,
  PaylinkRecord,
  PaylinkTransaction,
  Receipt,
} from '@/lib/types';
import { buildSeededStore, seededLedgers, seededPaylinks, seededReceipts, seededTransactions, seededWallets } from '@/lib/storage/seed';

function storeFile(): string {
  return path.resolve(process.cwd(), AppConfig.storePath);
}

async function ensureDir(): Promise<void> {
  await fs.mkdir(path.dirname(storeFile()), { recursive: true });
}

export async function loadStore(): Promise<AppStore> {
  try {
    const raw = await fs.readFile(storeFile(), 'utf8');
    const parsed = JSON.parse(raw) as AppStore;

    return {
      ...initialStore(parsed.mode),
      ...parsed,
      wallets: parsed.wallets?.length ? parsed.wallets : seededWallets(),
      paylinks: parsed.paylinks?.length ? parsed.paylinks : seededPaylinks(),
      ledgers: parsed.ledgers?.length ? parsed.ledgers : seededLedgers(),
      receipts: parsed.receipts?.length ? parsed.receipts : seededReceipts(),
      transactions: parsed.transactions?.length ? parsed.transactions : seededTransactions(),
      sweepPlans: parsed.sweepPlans ?? [],
    };
  } catch {
    const seeded = buildSeededStore();
    await saveStore(seeded);
    return seeded;
  }
}

export async function saveStore(store: AppStore): Promise<void> {
  await ensureDir();
  const value: AppStore = {
    ...store,
    version: 1,
    wallets: store.wallets.length ? store.wallets : seededWallets(),
    paylinks: store.paylinks.length ? store.paylinks : seededPaylinks(),
    ledgers: store.ledgers,
    receipts: store.receipts,
    transactions: store.transactions,
    sweepPlans: store.sweepPlans ?? [],
  };
  await fs.writeFile(storeFile(), JSON.stringify(value, null, 2), 'utf8');
}

export async function resetStoreToSeeded(): Promise<AppStore> {
  const seeded = buildSeededStore();
  await saveStore(seeded);
  return seeded;
}

export async function withStore(mutator: (store: AppStore) => AppStore | Promise<AppStore>): Promise<AppStore> {
  const base = await loadStore();
  const next = await mutator({ ...base });
  await saveStore(next);
  return next;
}

export async function setMode(mode: Mode): Promise<AppStore> {
  return withStore((store) => ({ ...store, mode }));
}

export function createReceiptRecord(values: {
  mode: Mode;
  action: string;
  command?: string[];
  stdout?: string;
  stderr?: string;
  parsed?: Record<string, unknown>;
  success: boolean;
  exitCode?: number;
}): Receipt {
  return {
    id: `receipt-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`,
    mode: values.mode,
    action: values.action,
    command: values.command,
    sanitizedCommandPreview: (values.command ?? []).join(' '),
    stdout: values.stdout?.slice(0, 2000),
    stderr: values.stderr?.slice(0, 1000),
    parsed: values.parsed,
    success: values.success,
    exitCode: values.exitCode,
    createdAt: new Date().toISOString(),
  };
}

export async function appendReceipt(mode: Mode, receipt: Receipt): Promise<Receipt> {
  const store = await withStore((current) => ({
    ...current,
    receipts: [receipt, ...current.receipts].slice(0, AppConfig.receiptsRetentionLimit),
  }));
  return store.receipts[0];
}

export async function setWallets(wallets: AppStore['wallets']): Promise<void> {
  await withStore((store) => ({
    ...store,
    wallets,
  }));
}

export async function mergeWallets(wallets: AppStore['wallets']): Promise<void> {
  await withStore((store) => {
    const byId = new Map<string, AppStore['wallets'][number]>();
    for (const wallet of [...store.wallets, ...wallets]) {
      byId.set(wallet.id, wallet);
    }
    return {
      ...store,
      wallets: Array.from(byId.values()),
    };
  });
}

export async function addPaylink(entry: { record: PaylinkRecord; ledger: LedgerEntry }): Promise<void> {
  await withStore((store) => ({
    ...store,
    paylinks: [entry.record, ...store.paylinks],
    ledgers: [entry.ledger, ...store.ledgers],
  }));
}

export async function removePaylink(paylinkId: string): Promise<void> {
  await withStore((store) => ({
    ...store,
    paylinks: store.paylinks.filter((paylink) => paylink.id !== paylinkId),
    ledgers: store.ledgers.filter((ledger) => ledger.paylinkId !== paylinkId),
    transactions: store.transactions.filter((tx) => tx.paylinkId !== paylinkId),
  }));
}

export async function addTransaction(transaction: PaylinkTransaction): Promise<void> {
  await withStore((store) => ({
    ...store,
    transactions: [transaction, ...store.transactions],
  }));
}

export async function updateLedger(paylinkId: string, values: Partial<LedgerEntry>): Promise<void> {
  await withStore((store) => ({
    ...store,
    ledgers: store.ledgers.map((entry) =>
      entry.paylinkId === paylinkId
        ? {
            ...entry,
            ...values,
            lastSyncedAt: new Date().toISOString(),
          }
        : entry,
    ),
  }));
}

export async function updatePaylink(paylinkId: string, values: Partial<PaylinkRecord>): Promise<void> {
  await withStore((store) => ({
    ...store,
    paylinks: store.paylinks.map((paylink) =>
      paylink.id === paylinkId
        ? {
            ...paylink,
            ...values,
            updatedAt: new Date().toISOString(),
          }
        : paylink,
    ),
  }));
}

export async function setAllowLiveSweeps(enabled: boolean): Promise<void> {
  await withStore((store) => ({
    ...store,
    allowLiveSweeps: enabled,
  }));
}

export async function getAllowLiveSweeps(): Promise<boolean> {
  const store = await loadStore();
  return store.allowLiveSweeps;
}

export async function setSweepPlan(plans: AppStore['sweepPlans']): Promise<void> {
  await withStore((store) => ({
    ...store,
    sweepPlans: plans,
  }));
}
