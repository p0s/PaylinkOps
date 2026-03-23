import { AppStore, WalletProfile } from '@/lib/types';

export const seededWallets = (): WalletProfile[] => [
  {
    id: 'wallet-demo-main',
    alias: 'demo-main',
    source: 'demo',
    addresses: {
      ethereum: '0x4d7f8aa9a3d1f8e6b2f1c0b4f5c9f5f6a1d8bc1e2',
      base: '0x2d1a8f6f9a7d7c4d8b9d8a3e9f1c2d4e5f7a8b9c0',
    },
    createdAt: new Date('2026-03-01T10:00:00.000Z').toISOString(),
    updatedAt: new Date('2026-03-01T10:00:00.000Z').toISOString(),
  },
  {
    id: 'wallet-demo-treasury',
    alias: 'demo-treasury',
    source: 'demo',
    addresses: {
      polygon: '0x3f6c8ca6d1be8e8ca9d8de3f5b8e1f9db4a2c0b1d',
      arbitrum: '0x7d2a4c3f1e8f8f7d6c5b4a9e1f0d3c2b1a8f7e6d5',
    },
    createdAt: new Date('2026-03-01T10:00:00.000Z').toISOString(),
    updatedAt: new Date('2026-03-01T10:00:00.000Z').toISOString(),
  },
];

export const seededPaylinks = () => [
  {
    id: 'pl-demo-paid',
    sourceId: 'moonpay-demo-1',
    mode: 'demo' as const,
    name: 'Starter subscription',
    payerLabel: 'Nova Co',
    walletAlias: 'demo-main',
    chain: 'Ethereum',
    token: 'USDC',
    expectedAmount: '250.00',
    dueDate: new Date('2026-03-20').toISOString(),
    notes: 'Monthly starter tier',
    orderId: 'ORD-1001',
    invoiceId: 'INV-1001',
    status: 'paid' as const,
    paymentUrl: 'https://demo.paylinkops.local/paylink/demo-paid-2026',
    createdAt: '2026-03-18T12:00:00.000Z',
    updatedAt: '2026-03-20T09:30:00.000Z',
  },
  {
    id: 'pl-demo-pending',
    sourceId: 'moonpay-demo-2',
    mode: 'demo' as const,
    name: 'Pro annual plan',
    payerLabel: 'Aurora Labs',
    walletAlias: 'demo-main',
    chain: 'Base',
    token: 'USDC',
    expectedAmount: '900.00',
    dueDate: new Date('2026-04-01').toISOString(),
    notes: 'Follow-up plan',
    orderId: 'ORD-1002',
    invoiceId: 'INV-1002',
    status: 'awaiting-payment' as const,
    paymentUrl: 'https://demo.paylinkops.local/paylink/demo-pending-2026',
    createdAt: '2026-03-19T08:00:00.000Z',
    updatedAt: '2026-03-19T09:00:00.000Z',
  },
  {
    id: 'pl-demo-partial',
    sourceId: 'moonpay-demo-3',
    mode: 'demo' as const,
    name: 'Consulting retainer',
    payerLabel: 'Bridge AI',
    walletAlias: 'demo-treasury',
    chain: 'Polygon',
    token: 'USDT',
    expectedAmount: '1500.00',
    dueDate: new Date('2026-03-30').toISOString(),
    notes: 'Partial deposit expected',
    orderId: 'ORD-1003',
    invoiceId: 'INV-1003',
    status: 'partially-paid' as const,
    paymentUrl: 'https://demo.paylinkops.local/paylink/demo-partial-2026',
    createdAt: '2026-03-20T08:00:00.000Z',
    updatedAt: '2026-03-21T10:45:00.000Z',
  },
];

export const seededTransactions = () => [
  {
    id: 'tx-demo-paid-1',
    paylinkId: 'pl-demo-paid',
    txHash: '0xaaaa1111bbbb2222cccc3333dddd4444555566667777888899990000aaaabbbb',
    amount: '250.00',
    token: 'USDC',
    chain: 'Ethereum',
    status: 'confirmed' as const,
    timestamp: '2026-03-20T09:30:00.000Z',
  },
  {
    id: 'tx-demo-partial-1',
    paylinkId: 'pl-demo-partial',
    txHash: '0x9999aaaabbbbcccc11112222333344445555666677778888',
    amount: '600.00',
    token: 'USDT',
    chain: 'Polygon',
    status: 'confirmed' as const,
    timestamp: '2026-03-21T10:45:00.000Z',
  },
];

export const seededLedgers = () => [
  {
    id: 'ledger-paid',
    paylinkId: 'pl-demo-paid',
    expectedAmount: '250.00',
    receivedAmount: '250.00',
    deltaAmount: '0.00',
    status: 'paid' as const,
    evidenceCount: 1,
    lastSyncedAt: '2026-03-20T09:31:00.000Z',
  },
  {
    id: 'ledger-pending',
    paylinkId: 'pl-demo-pending',
    expectedAmount: '900.00',
    receivedAmount: '0.00',
    deltaAmount: '900.00',
    status: 'awaiting-payment' as const,
    evidenceCount: 1,
    lastSyncedAt: '2026-03-21T08:30:00.000Z',
  },
  {
    id: 'ledger-partial',
    paylinkId: 'pl-demo-partial',
    expectedAmount: '1500.00',
    receivedAmount: '600.00',
    deltaAmount: '900.00',
    status: 'partially-paid' as const,
    evidenceCount: 1,
    lastSyncedAt: '2026-03-21T10:46:00.000Z',
  },
];

export const seededReceipts = () => [
  {
    id: 'r-demo-1',
    mode: 'demo' as const,
    action: 'seeded-demo-data',
    sanitizedCommandPreview: 'seed: bootstrap demo scenario',
    success: true,
    createdAt: new Date('2026-03-19T00:00:00.000Z').toISOString(),
  },
];

export const buildSeededStore = (): AppStore => ({
  mode: 'demo',
  wallets: seededWallets(),
  paylinks: seededPaylinks(),
  ledgers: seededLedgers(),
  receipts: seededReceipts() as any,
  transactions: seededTransactions(),
  allowLiveSweeps: false,
  version: 1,
});
