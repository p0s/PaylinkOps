import { z } from 'zod';

export type Mode = 'demo' | 'real';

export type WalletProfile = {
  id: string;
  alias: string;
  source: 'demo' | 'moonpay-cli';
  addresses: Record<string, string>;
  createdAt: string;
  updatedAt: string;
};

export type WalletSummary = {
  id: string;
  alias: string;
  source: 'demo' | 'moonpay-cli';
  chainCount: number;
  addresses: Record<string, string>;
};

export type PaylinkRecord = {
  id: string;
  sourceId?: string;
  mode: Mode;
  name: string;
  payerLabel?: string;
  walletAlias: string;
  chain: string;
  token: string;
  expectedAmount?: string;
  dueDate?: string;
  notes?: string;
  invoiceId?: string;
  orderId?: string;
  status: 'draft' | 'link-created' | 'awaiting-payment' | 'partially-paid' | 'paid' | 'reconciled' | 'error';
  paymentUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type PaylinkTransaction = {
  id: string;
  paylinkId: string;
  txHash: string;
  amount: string;
  token: string;
  chain: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
};

export type LedgerEntry = {
  id: string;
  paylinkId: string;
  expectedAmount?: string;
  receivedAmount?: string;
  deltaAmount?: string;
  status:
    | 'draft'
    | 'link-created'
    | 'awaiting-payment'
    | 'partially-paid'
    | 'paid'
    | 'reconciled'
    | 'error';
  evidenceCount: number;
  lastSyncedAt?: string;
};

export type Receipt = {
  id: string;
  mode: Mode;
  action: string;
  command?: string[];
  sanitizedCommandPreview: string;
  exitCode?: number;
  stdout?: string;
  stderr?: string;
  parsed?: Record<string, unknown>;
  success: boolean;
  createdAt: string;
};

export type SweepPlanEntry = {
  chain: string;
  token: string;
  amount: string;
  destinationAddress: string;
  paylinkIds: string[];
};

export type SweepPlan = {
  id: string;
  walletAlias: string;
  destinationAddress: string;
  entries: SweepPlanEntry[];
  commandPreview: string;
  requiresConfirmation: boolean;
};

export type MoonPayStatus = {
  installed: boolean;
  authenticated: boolean;
  walletCount?: number;
  version?: string;
  message: string;
};

export type CreatePaylinkInput = {
  name: string;
  payerLabel?: string;
  walletAlias: string;
  chain: string;
  token: string;
  expectedAmount?: string;
  dueDate?: string;
  notes?: string;
  orderId?: string;
  invoiceId?: string;
};

export type SweepPlanInput = {
  walletAlias: string;
  destinationAddress: string;
  tokenFilter?: string;
};

export type SweepExecutionInput = {
  planId: string;
  confirmPhrase: string;
};

export type PaylinkDetails = PaylinkRecord & {
  transactions: PaylinkTransaction[];
};

export type CreatePaylinkResult = {
  record: PaylinkRecord;
  receipt: Receipt;
};

export type SweepExecutionResult = {
  transactionCount: number;
  receipts: Receipt[];
  status: 'queued' | 'executed' | 'blocked';
};

export const createPaylinkSchema = z.object({
  name: z.string().trim().min(3),
  payerLabel: z.string().trim().min(1).optional(),
  walletAlias: z.string().trim().min(1),
  chain: z.string().trim().min(1),
  token: z.string().trim().min(1),
  expectedAmount: z.string().trim().min(1).optional(),
  dueDate: z.string().optional(),
  notes: z.string().trim().max(300).optional(),
  orderId: z.string().trim().max(80).optional(),
  invoiceId: z.string().trim().max(80).optional(),
});

export type AppStore = {
  mode: Mode;
  wallets: WalletProfile[];
  paylinks: PaylinkRecord[];
  ledgers: LedgerEntry[];
  receipts: Receipt[];
  transactions: PaylinkTransaction[];
  sweepPlans?: SweepPlan[];
  allowLiveSweeps: boolean;
  version: number;
};

export const initialStore = (mode: Mode = 'demo'): AppStore => ({
  mode,
  wallets: [],
  paylinks: [],
  ledgers: [],
  receipts: [],
  transactions: [],
  sweepPlans: [],
  allowLiveSweeps: false,
  version: 1,
});
