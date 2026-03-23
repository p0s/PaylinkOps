'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type DashboardData = {
  mode: 'demo' | 'real';
  modeStatus: {
    installed: boolean;
    authenticated: boolean;
    walletCount?: number;
    message: string;
    version?: string;
  };
  wallets: Array<{ id: string }>;
  paylinks: Array<{ id: string; status: string; expectedAmount?: string }>;
  ledgers: Array<{ id: string; status: string }>;
  receipts: Array<{ id: string; action: string; createdAt: string }>;
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const modeState = await fetch('/api/mode').then((response) => response.json());
    const next = await fetch(`/api/dashboard/overview?mode=${modeState.mode}`).then((response) => response.json());
    setData(next);
  }

  async function switchMode(mode: 'demo' | 'real') {
    await fetch('/api/mode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode }),
    });
    await refresh();
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <p className="text-sm text-slate-600">Loading dashboard...</p>;
  }

  const paid = data.paylinks.filter((paylink) => paylink.status === 'paid').length;
  const pending = data.paylinks.filter((paylink) => paylink.status === 'awaiting-payment' || paylink.status === 'partially-paid').length;

  return (
    <div className="space-y-6">
      <section className="card grid gap-6 lg:grid-cols-[1.3fr,0.7fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Operations Console</p>
          <h1 className="text-3xl font-semibold tracking-tight">PaylinkOps dashboard</h1>
          <p className="max-w-2xl text-sm text-slate-600">{data.modeStatus.message}</p>
          <div className="flex gap-3">
            <button className="btn" onClick={() => switchMode('demo')}>Demo Mode</button>
            <button className="btn" onClick={() => switchMode('real')}>Real Mode</button>
            <button className="btn" onClick={() => refresh()}>Refresh</button>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-700">Current mode</p>
          <p className="mt-2 text-2xl font-semibold">{data.mode}</p>
          <p className="mt-2 text-sm text-slate-600">CLI installed: {data.modeStatus.installed ? 'yes' : 'no'}</p>
          <p className="text-sm text-slate-600">Authenticated: {data.modeStatus.authenticated ? 'yes' : 'no'}</p>
          <p className="text-sm text-slate-600">Version: {data.modeStatus.version || 'unknown'}</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="card">
          <p className="text-xs uppercase tracking-wider text-slate-500">Wallets</p>
          <p className="mt-2 text-3xl font-semibold">{data.wallets.length}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wider text-slate-500">Paylinks</p>
          <p className="mt-2 text-3xl font-semibold">{data.paylinks.length}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wider text-slate-500">Paid</p>
          <p className="mt-2 text-3xl font-semibold">{paid}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wider text-slate-500">Pending</p>
          <p className="mt-2 text-3xl font-semibold">{pending}</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Latest receipts</h2>
            <Link href="/dashboard/receipts" className="text-sm text-slate-600 hover:text-slate-900">Open receipts</Link>
          </div>
          <div className="space-y-2">
            {data.receipts.slice(0, 4).map((receipt) => (
              <div key={receipt.id} className="rounded-xl border border-slate-200 p-3">
                <p className="text-sm font-semibold">{receipt.action}</p>
                <p className="text-xs text-slate-500">{new Date(receipt.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card space-y-3">
          <h2 className="text-lg font-semibold">Jump to</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Link href="/dashboard/paylinks" className="btn">Paylinks</Link>
            <Link href="/dashboard/wallets" className="btn">Wallets</Link>
            <Link href="/dashboard/ledger" className="btn">Ledger</Link>
            <Link href="/dashboard/settings" className="btn">Settings</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
