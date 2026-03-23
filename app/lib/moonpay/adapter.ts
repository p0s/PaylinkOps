import {
  CreatePaylinkInput,
  CreatePaylinkResult,
  MoonPayStatus,
  PaylinkDetails,
  PaylinkTransaction,
  SweepExecutionResult,
  SweepPlan,
  SweepPlanInput,
  WalletSummary,
} from '@/lib/types';

export type CliReceipt = {
  command: string[];
  stdout: string;
  stderr: string;
  parsed: Record<string, unknown>;
  exitCode?: number;
  success: boolean;
};

export interface MoonPayAdapter {
  getStatus(): Promise<MoonPayStatus>;
  listWallets(): Promise<WalletSummary[]>;
  createPaylink(input: CreatePaylinkInput): Promise<CreatePaylinkResult>;
  getPaylink(id: string): Promise<PaylinkDetails | null>;
  listPaylinkTransactions(id: string): Promise<PaylinkTransaction[]>;
  planSweep(input: SweepPlanInput): Promise<SweepPlan>;
  executeSweep?(input: { planId: string; confirmPhrase: string }): Promise<SweepExecutionResult>;
}
