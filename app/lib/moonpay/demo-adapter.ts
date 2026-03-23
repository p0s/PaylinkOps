import crypto from 'node:crypto';
import { AppConfig } from '@/lib/config';
import {
  AppStore,
  CreatePaylinkInput,
  CreatePaylinkResult,
  LedgerEntry,
  MoonPayStatus,
  PaylinkDetails,
  PaylinkTransaction,
  SweepPlan,
  SweepPlanInput,
} from '@/lib/types';
import { loadStore, withStore, createReceiptRecord, addPaylink } from '@/lib/storage/store';
import { createPaylinkSchema } from '@/lib/types';
import { MoonPayAdapter } from '@/lib/moonpay/adapter';

function makeReceipt(mode: AppStore['mode'], action: string, payload: Record<string, unknown>): ReturnType<typeof createReceiptRecord> {
  return createReceiptRecord({
    mode,
    action,
    command: ['paylinkops', action],
    stdout: JSON.stringify(payload, null, 2),
    parsed: payload,
    success: true,
    exitCode: 0,
  });
}

function sanitizeText(value: string): string {
  return value.replace(/[<>]/g, '');
}

export class DemoAdapter implements MoonPayAdapter {
  constructor(private mode: AppStore['mode']) {}

  async executeSweep(_: { planId: string; confirmPhrase: string }) {
    return {
      transactionCount: 0,
      receipts: [],
      status: 'blocked' as const,
    };
  }

  async getStatus(): Promise<MoonPayStatus> {
    return {
      installed: false,
      authenticated: true,
      message: 'Demo mode: local seed data is always available.',
      walletCount: (await loadStore()).wallets.length,
    };
  }

  async listWallets() {
    const store = await loadStore();
    return store.wallets
      .filter((wallet) => wallet.source === 'demo')
      .map((wallet) => ({
        id: wallet.id,
        alias: wallet.alias,
        source: wallet.source,
        chainCount: Object.keys(wallet.addresses).length,
        addresses: wallet.addresses,
      }));
  }

  async createPaylink(input: CreatePaylinkInput): Promise<CreatePaylinkResult> {
    const parsed = createPaylinkSchema.parse(input);
    const id = `pl-demo-${crypto.randomUUID()}`;
    const sourceId = `moonpay-demo-${crypto.randomUUID()}`;
    const paymentUrl = `https://demo.paylinkops.local/paylink/${id}`;

    const record = {
      id,
      sourceId,
      mode: 'demo' as const,
      name: sanitizeText(parsed.name),
      payerLabel: parsed.payerLabel,
      walletAlias: parsed.walletAlias,
      chain: parsed.chain,
      token: parsed.token,
      expectedAmount: parsed.expectedAmount,
      dueDate: parsed.dueDate,
      notes: parsed.notes,
      orderId: parsed.orderId,
      invoiceId: parsed.invoiceId,
      status: 'link-created' as const,
      paymentUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const ledger: LedgerEntry = {
      id: `ledger-${id}`,
      paylinkId: id,
      expectedAmount: parsed.expectedAmount,
      receivedAmount: '0.00',
      deltaAmount: parsed.expectedAmount,
      status: 'link-created',
      evidenceCount: 1,
      lastSyncedAt: new Date().toISOString(),
    };

    await addPaylink({ record, ledger });
    await this.appendReceipt(makeReceipt('demo', 'createPaylink', record));

    return { record, receipt: makeReceipt('demo', 'createPaylink', record) };
  }

  async getPaylink(id: string): Promise<PaylinkDetails | null> {
    const store = await loadStore();
    const paylink = store.paylinks.find((entry) => entry.id === id);
    if (!paylink) {
      return null;
    }

    const transactions = store.transactions.filter((transaction) => transaction.paylinkId === id);
    return {
      ...paylink,
      transactions,
    };
  }

  async listPaylinkTransactions(id: string): Promise<PaylinkTransaction[]> {
    const store = await loadStore();
    return store.transactions.filter((transaction) => transaction.paylinkId === id);
  }

  async planSweep(input: SweepPlanInput): Promise<SweepPlan> {
    const store = await loadStore();
    const paid = store.ledgers.filter((ledger) => {
      const paylink = store.paylinks.find((entry) => entry.id === ledger.paylinkId);
      const matchesWallet = paylink?.walletAlias === input.walletAlias;
      const matchesToken = input.tokenFilter == null ? true : paylink?.token === input.tokenFilter;
      return paylink?.mode === 'demo' && matchesWallet && matchesToken && (ledger.status === 'paid' || ledger.status === 'partially-paid');
    });

    const grouped = new Map<string, { amount: number; ids: string[] }>();

    for (const ledger of paid) {
      const key = ledger.paylinkId;
      const total = Number(ledger.deltaAmount ?? '0');
      grouped.set(key, {
        amount: Number.isFinite(total) ? total : 0,
        ids: [...(grouped.get(key)?.ids ?? []), ledger.paylinkId],
      });
    }

    const entries = Array.from(grouped.entries()).map(([paylinkId, value], index) => {
      const item = store.paylinks.find((entry) => entry.id === paylinkId);
      return {
        chain: item?.chain || 'Unknown',
        token: item?.token || 'USDC',
        amount: String(value.amount || (index + 1) * 10),
        destinationAddress: input.destinationAddress,
        paylinkIds: value.ids,
      };
    });

    const total = entries.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

    const plan: SweepPlan = {
      id: `sweep-${Date.now()}`,
      walletAlias: input.walletAlias,
      destinationAddress: input.destinationAddress,
      entries,
      requiresConfirmation: true,
      commandPreview: `paylinkops transfer --wallet ${input.walletAlias} --to ${input.destinationAddress} --amount ${String(total)} --token ${entries[0]?.token || 'USDC'}`,
    };

    await withStore((state) => ({
      ...state,
      sweepPlans: [plan],
    }));

    return plan;
  }

  async appendReceipt(receipt: ReturnType<typeof makeReceipt>): Promise<void> {
    const store = await loadStore();
    const next = {
      ...store,
      receipts: [receipt, ...store.receipts].slice(0, AppConfig.receiptsRetentionLimit),
    };
    await withStore(() => next);
  }
}
