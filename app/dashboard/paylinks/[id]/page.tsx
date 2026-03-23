'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Detail = {
  id: string;
  name: string;
  payerLabel?: string;
  walletAlias: string;
  chain: string;
  token: string;
  expectedAmount?: string;
  paymentUrl?: string;
  status: string;
  transactions: Array<{
    id: string;
    txHash: string;
    amount: string;
    token: string;
    chain: string;
    status: string;
    timestamp: string;
  }>;
};

export default function PaylinkDetailPage() {
  const params = useParams<{ id: string }>();
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const modeState = await fetch('/api/mode').then((response) => response.json());
      const data = await fetch(`/api/moonpay/paylinks/${encodeURIComponent(params.id)}?mode=${modeState.mode}`).then((response) => response.json());
      setDetail(data);
    }
    load().finally(() => setLoading(false));
  }, [params.id]);

  if (loading || !detail) {
    return <p className="text-sm text-slate-600">Loading paylink...</p>;
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/paylinks" className="text-sm text-slate-600 hover:text-slate-900">Back to paylinks</Link>
      <section className="card space-y-3">
        <h1 className="text-3xl font-semibold">{detail.name}</h1>
        <p className="text-sm text-slate-600">Status: {detail.status}</p>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">Wallet</p>
            <p>{detail.walletAlias}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">Asset</p>
            <p>{detail.token} on {detail.chain}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">Expected amount</p>
            <p>{detail.expectedAmount || '-'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">Payment URL</p>
            <p className="break-all text-sm">{detail.paymentUrl || 'Unavailable'}</p>
          </div>
        </div>
      </section>

      <section className="card space-y-4">
        <h2 className="text-lg font-semibold">Transactions</h2>
        {detail.transactions.length === 0 ? (
          <p className="text-sm text-slate-600">No transactions recorded yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Hash</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {detail.transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="font-mono text-xs">{transaction.txHash}</td>
                  <td>{transaction.amount} {transaction.token}</td>
                  <td>{transaction.status}</td>
                  <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
