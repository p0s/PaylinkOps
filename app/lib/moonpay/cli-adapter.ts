import {
  CreatePaylinkInput,
  CreatePaylinkResult,
  LedgerEntry,
  MoonPayStatus,
  PaylinkDetails,
  PaylinkRecord,
  PaylinkTransaction,
  SweepPlan,
  SweepPlanInput,
  WalletProfile,
  WalletSummary,
} from '@/lib/types';
import { MoonPayAdapter } from '@/lib/moonpay/adapter';
import { runCliCommand, sanitizeCommandPreview } from '@/lib/moonpay/commands';
import {
  parseCreateRecordToPaylink,
  parseCreateResult,
  parseStatus,
  parseTransactions,
  parseWalletList,
} from '@/lib/moonpay/parsers';
import {
  addPaylink,
  appendReceipt,
  createReceiptRecord,
  loadStore,
  mergeWallets,
  updateLedger,
  updatePaylink,
} from '@/lib/storage/store';

function buildLedger(record: PaylinkRecord): LedgerEntry {
  return {
    id: `ledger-${record.id}`,
    paylinkId: record.id,
    expectedAmount: record.expectedAmount,
    receivedAmount: '0.00',
    deltaAmount: record.expectedAmount,
    status: record.status,
    evidenceCount: 1,
    lastSyncedAt: new Date().toISOString(),
  };
}

function buildReceipt(action: string, result: Awaited<ReturnType<typeof runCliCommand>>, parsed: Record<string, unknown>) {
  return createReceiptRecord({
    mode: 'real',
    action,
    command: result.command,
    stdout: result.stdout,
    stderr: result.stderr,
    parsed: {
      ...parsed,
      commandPreview: sanitizeCommandPreview(result.command),
    },
    success: result.success,
    exitCode: result.exitCode,
  });
}

function toWalletProfiles(wallets: WalletSummary[]): WalletProfile[] {
  const timestamp = new Date().toISOString();
  return wallets.map((wallet) => ({
    id: wallet.id,
    alias: wallet.alias,
    source: 'moonpay-cli',
    addresses: wallet.addresses,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));
}

function summarizeTransactions(id: string, transactions: PaylinkTransaction[]) {
  const received = transactions
    .filter((tx) => tx.status === 'confirmed')
    .reduce((total, tx) => total + Number(tx.amount || 0), 0);
  return {
    id,
    transactionCount: transactions.length,
    confirmedAmount: received.toFixed(2),
  };
}

export class CliAdapter implements MoonPayAdapter {
  constructor(private readonly mode: 'real' = 'real') {}

  async executeSweep(_: { planId: string; confirmPhrase: string }) {
    return {
      transactionCount: 0,
      receipts: [],
      status: 'blocked' as const,
    };
  }

  async getStatus(): Promise<MoonPayStatus> {
    const versionResult = await runCliCommand(['--version']);
    if (!versionResult.success) {
      const installed = versionResult.exitCode !== 127;
      return {
        installed,
        authenticated: false,
        message: installed
          ? 'MoonPay CLI detected, but authentication is unavailable. Run mp login in your terminal.'
          : 'MoonPay CLI is not installed. Demo mode remains available.',
      };
    }

    const walletResult = await runCliCommand(['wallet', 'list']);
    const parsed = parseStatus(`${versionResult.stdout}\n${versionResult.stderr}\n${walletResult.stdout}\n${walletResult.stderr}`);
    const wallets = walletResult.success ? parseWalletList(`${walletResult.stdout}\n${walletResult.stderr}`) : [];

    return {
      installed: true,
      authenticated: parsed.authenticated,
      version: parsed.version,
      walletCount: wallets.length,
      message: parsed.authenticated
        ? 'MoonPay CLI is ready for live wallet and paylink operations.'
        : 'MoonPay CLI is installed, but authentication is required before live actions can run.',
    };
  }

  async listWallets(): Promise<WalletSummary[]> {
    const result = await runCliCommand(['wallet', 'list']);
    const wallets = result.success ? parseWalletList(`${result.stdout}\n${result.stderr}`) : [];
    if (wallets.length > 0) {
      await mergeWallets(toWalletProfiles(wallets));
    }
    await appendReceipt('real', buildReceipt('wallet-list', result, { walletCount: wallets.length }));
    return wallets;
  }

  async createPaylink(input: CreatePaylinkInput): Promise<CreatePaylinkResult> {
    const args = [
      'deposit',
      'create',
      '--name',
      input.name,
      '--wallet',
      input.walletAlias,
      '--chain',
      input.chain,
      '--token',
      input.token,
    ];

    if (input.expectedAmount) {
      args.push('--expected-amount', input.expectedAmount);
    }

    const result = await runCliCommand(args);
    const parsed = parseCreateResult(`${result.stdout}\n${result.stderr}`);
    const record: PaylinkRecord = {
      ...parseCreateRecordToPaylink(parsed, input.name),
      mode: 'real',
      payerLabel: input.payerLabel,
      walletAlias: input.walletAlias,
      chain: input.chain,
      token: input.token,
      expectedAmount: input.expectedAmount,
      dueDate: input.dueDate,
      notes: input.notes,
      orderId: input.orderId,
      invoiceId: input.invoiceId,
      status: result.success ? 'link-created' : 'error',
    };
    const receipt = buildReceipt('paylink-create', result, {
      id: record.id,
      sourceId: parsed.id,
      paymentUrl: parsed.paymentUrl,
      walletAlias: record.walletAlias,
      chain: record.chain,
      token: record.token,
    });

    await addPaylink({
      record,
      ledger: buildLedger(record),
    });
    await appendReceipt('real', receipt);

    return { record, receipt };
  }

  async getPaylink(id: string): Promise<PaylinkDetails | null> {
    const store = await loadStore();
    const existing = store.paylinks.find((paylink) => paylink.id === id || paylink.sourceId === id);
    const lookupId = existing?.sourceId || existing?.id || id;
    const result = await runCliCommand(['deposit', 'retrieve', '--id', lookupId]);
    const parsed = parseCreateResult(`${result.stdout}\n${result.stderr}`);
    const base = existing ?? parseCreateRecordToPaylink(parsed, lookupId);
    const transactions = await this.listPaylinkTransactions(lookupId);
    const receipt = buildReceipt('paylink-retrieve', result, {
      id: lookupId,
      sourceId: parsed.id,
      paymentUrl: parsed.paymentUrl,
      transactionCount: transactions.length,
    });
    await appendReceipt('real', receipt);

    const confirmed = transactions
      .filter((tx) => tx.status === 'confirmed')
      .reduce((total, tx) => total + Number(tx.amount || 0), 0);
    const expected = Number(base.expectedAmount || 0);
    const nextStatus =
      confirmed === 0
        ? 'awaiting-payment'
        : expected > 0 && confirmed < expected
          ? 'partially-paid'
          : 'paid';

    await updatePaylink(base.id, {
      sourceId: parsed.id || base.sourceId,
      paymentUrl: parsed.paymentUrl || base.paymentUrl,
      status: nextStatus,
    });
    await updateLedger(base.id, {
      status: nextStatus,
      receivedAmount: confirmed.toFixed(2),
      deltaAmount: expected > 0 ? Math.max(expected - confirmed, 0).toFixed(2) : undefined,
      evidenceCount: transactions.length + 1,
    });

    return {
      ...base,
      sourceId: parsed.id || base.sourceId,
      paymentUrl: parsed.paymentUrl || base.paymentUrl,
      status: nextStatus,
      transactions,
      updatedAt: new Date().toISOString(),
    };
  }

  async listPaylinkTransactions(id: string): Promise<PaylinkTransaction[]> {
    const result = await runCliCommand(['deposit', 'transaction', 'list', '--id', id]);
    const transactions = result.success
      ? parseTransactions(`${result.stdout}\n${result.stderr}`).map((tx) => ({
          ...tx,
          paylinkId: id,
        }))
      : [];
    await appendReceipt('real', buildReceipt('paylink-transactions', result, summarizeTransactions(id, transactions)));
    return transactions;
  }

  async planSweep(input: SweepPlanInput): Promise<SweepPlan> {
    const store = await loadStore();
    const paid = store.paylinks.filter((paylink) => {
      if (paylink.mode !== 'real' || paylink.walletAlias !== input.walletAlias) {
        return false;
      }
      if (input.tokenFilter && paylink.token !== input.tokenFilter) {
        return false;
      }
      return paylink.status === 'paid' || paylink.status === 'partially-paid';
    });

    const groups = new Map<string, { chain: string; token: string; amount: number; paylinkIds: string[] }>();
    for (const paylink of paid) {
      const key = `${paylink.chain}:${paylink.token}`;
      const current = groups.get(key) ?? {
        chain: paylink.chain,
        token: paylink.token,
        amount: 0,
        paylinkIds: [],
      };
      current.amount += Number(paylink.expectedAmount || 0);
      current.paylinkIds.push(paylink.id);
      groups.set(key, current);
    }

    const entries = Array.from(groups.values()).map((group) => ({
      chain: group.chain,
      token: group.token,
      amount: group.amount.toFixed(2),
      destinationAddress: input.destinationAddress,
      paylinkIds: group.paylinkIds,
    }));
    const preview = entries[0]
      ? sanitizeCommandPreview([
          'mp',
          'token',
          'transfer',
          '--wallet',
          input.walletAlias,
          '--to',
          input.destinationAddress,
          '--token',
          entries[0].token,
          '--amount',
          entries[0].amount,
        ])
      : 'No paid paylinks available to sweep.';

    return {
      id: `sweep-${Date.now()}`,
      walletAlias: input.walletAlias,
      destinationAddress: input.destinationAddress,
      entries,
      commandPreview: preview,
      requiresConfirmation: true,
    };
  }
}
