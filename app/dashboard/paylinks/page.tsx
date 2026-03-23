'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';

type Paylink = {
  id: string;
  name: string;
  payerLabel?: string;
  walletAlias: string;
  chain: string;
  token: string;
  expectedAmount?: string;
  status: string;
  paymentUrl?: string;
  updatedAt: string;
};

type FormState = {
  name: string;
  payerLabel: string;
  walletAlias: string;
  chain: string;
  token: string;
  expectedAmount: string;
  dueDate: string;
  notes: string;
  orderId: string;
  invoiceId: string;
};

const initialState: FormState = {
  name: 'June retainer',
  payerLabel: 'Northwind',
  walletAlias: 'demo-main',
  chain: 'Ethereum',
  token: 'USDC',
  expectedAmount: '500.00',
  dueDate: '',
  notes: '',
  orderId: '',
  invoiceId: '',
};

export default function PaylinksPage() {
  const [mode, setMode] = useState<'demo' | 'real'>('demo');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(initialState);
  const [paylinks, setPaylinks] = useState<Paylink[]>([]);
  const [message, setMessage] = useState('');

  async function load(nextMode?: 'demo' | 'real') {
    const activeMode = nextMode || (await fetch('/api/mode').then((response) => response.json())).mode;
    setMode(activeMode);
    const payload = await fetch(`/api/moonpay/paylinks?mode=${activeMode}`).then((response) => response.json());
    setPaylinks(payload.paylinks || []);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch(`/api/moonpay/paylinks/create?mode=${mode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const payload = await response.json();
    setMessage(payload.receipt?.success ? 'Paylink created.' : 'Paylink stored with error receipt.');
    await load(mode);
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-600">Loading paylinks...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Paylinks</h1>
          <p className="text-sm text-slate-600">Create, inspect, and reconcile deposit links.</p>
        </div>
        <button className="btn" onClick={() => load(mode)}>Refresh</button>
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
        <form className="card space-y-4" onSubmit={submit}>
          <h2 className="text-lg font-semibold">Create paylink</h2>
          <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Internal name" />
          <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.payerLabel} onChange={(event) => setForm({ ...form, payerLabel: event.target.value })} placeholder="Payer label" />
          <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.walletAlias} onChange={(event) => setForm({ ...form, walletAlias: event.target.value })} placeholder="Wallet alias" />
          <div className="grid gap-3 md:grid-cols-3">
            <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.chain} onChange={(event) => setForm({ ...form, chain: event.target.value })} placeholder="Chain" />
            <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.token} onChange={(event) => setForm({ ...form, token: event.target.value })} placeholder="Token" />
            <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.expectedAmount} onChange={(event) => setForm({ ...form, expectedAmount: event.target.value })} placeholder="Expected amount" />
          </div>
          <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} placeholder="Due date (optional)" />
          <textarea className="min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Notes" />
          <div className="grid gap-3 md:grid-cols-2">
            <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.orderId} onChange={(event) => setForm({ ...form, orderId: event.target.value })} placeholder="Order ID" />
            <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.invoiceId} onChange={(event) => setForm({ ...form, invoiceId: event.target.value })} placeholder="Invoice ID" />
          </div>
          <button className="btn btn-primary" type="submit">Create paylink</button>
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}
        </form>

        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Existing paylinks</h2>
            <p className="text-sm text-slate-500">{mode} mode</p>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Wallet</th>
                <th>Amount</th>
                <th>Open</th>
              </tr>
            </thead>
            <tbody>
              {paylinks.map((paylink) => (
                <tr key={paylink.id}>
                  <td>
                    <div>
                      <p className="font-medium">{paylink.name}</p>
                      <p className="text-xs text-slate-500">{paylink.payerLabel || 'Unlabelled'}</p>
                    </div>
                  </td>
                  <td>{paylink.status}</td>
                  <td>{paylink.walletAlias}</td>
                  <td>{paylink.expectedAmount || '-'}</td>
                  <td><Link href={`/dashboard/paylinks/${encodeURIComponent(paylink.id)}`}>Detail</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
