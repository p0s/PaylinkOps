import {
  CreatePaylinkInput,
  CreatePaylinkResult,
  Mode,
  PaylinkDetails,
  PaylinkTransaction,
  SweepPlan,
  SweepPlanInput,
  WalletSummary,
} from '@/lib/types';
import { getAdapter } from '@/lib/moonpay/index';
import { MoonPayStatus } from '@/lib/types';
import { loadStore, setAllowLiveSweeps, resetStoreToSeeded } from '@/lib/storage/store';

export type DashboardSnapshot = {
  mode: Mode;
  modeStatus: MoonPayStatus;
  wallets: WalletSummary[];
  paylinksCount: number;
  paidCount: number;
  pendingCount: number;
  paidAmount: number;
  pendingAmount: number;
  receiptCount: number;
};

export async function fetchDashboard(mode: Mode): Promise<DashboardSnapshot> {
  const store = await loadStore();
  const adapter = await getAdapter(mode);
  const wallets = await adapter.listWallets();
  const filtered = store.paylinks.filter((paylink) => paylink.mode === mode);

  const paidAmount = filtered
    .filter((entry) => entry.status === 'paid')
    .reduce((sum, entry) => sum + Number(entry.expectedAmount || 0), 0);

  const pendingAmount = filtered
    .filter((entry) => entry.status === 'awaiting-payment' || entry.status === 'partially-paid')
    .reduce((sum, entry) => sum + Number(entry.expectedAmount || 0), 0);

  const status = await adapter.getStatus();

  return {
    mode,
    modeStatus: status,
    wallets,
    paylinksCount: filtered.length,
    paidCount: filtered.filter((entry) => entry.status === 'paid').length,
    pendingCount: filtered.filter((entry) => entry.status === 'awaiting-payment' || entry.status === 'partially-paid').length,
    paidAmount,
    pendingAmount,
    receiptCount: store.receipts.length,
  };
}

export async function listWallets(mode: Mode) {
  const adapter = await getAdapter(mode);
  return adapter.listWallets();
}

export async function createPaylink(mode: Mode, input: CreatePaylinkInput): Promise<CreatePaylinkResult> {
  const adapter = await getAdapter(mode);
  return adapter.createPaylink(input);
}

export async function getPaylink(mode: Mode, id: string): Promise<PaylinkDetails | null> {
  const adapter = await getAdapter(mode);
  return adapter.getPaylink(id);
}

export async function listPaylinkTransactions(mode: Mode, id: string): Promise<PaylinkTransaction[]> {
  const adapter = await getAdapter(mode);
  return adapter.listPaylinkTransactions(id);
}

export async function planSweep(mode: Mode, input: SweepPlanInput): Promise<SweepPlan> {
  const adapter = await getAdapter(mode);
  return adapter.planSweep(input);
}

export async function setAllowSweeps(flag: boolean): Promise<void> {
  await setAllowLiveSweeps(flag);
}

export async function loadSampleScenario(): Promise<void> {
  await resetStoreToSeeded();
}
