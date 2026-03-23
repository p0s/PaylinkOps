'use client';

import { useEffect, useState } from 'react';

type LedgerRow = {
  id: string;
  paylinkId: string;
  expectedAmount?: string;
  receivedAmount?: string;
  deltaAmount?: string;
  status: string;
  evidenceCount: number;
  name?: string;
  payerLabel?: string;
  token?: string;
  chain?: string;
};

export default function LedgerPage() {
  const [rows, setRows] = useState<LedgerRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const modeState = await fetch('/api/mode').then((response) => response.json());
    const data = await fetch(`/api/moonpay/paylinks?mode=${modeState.mode}`).then((response) => response.json());
    const byId = new Map<string, Record<string, unknown>>();
    for (const paylink of data.paylinks || []) {
      byId.set(paylink.id, paylink);
    }
    setRows(
      (data.ledgers || []).map((ledger: LedgerRow) => ({
        ...ledger,
        name: String(byId.get(ledger.paylinkId)?.name || ''),
        payerLabel: String(byId.get(ledger.paylinkId)?.payerLabel || ''),
        token: String(byId.get(ledger.paylinkId)?.token || ''),
        chain: String(byId.get(ledger.paylinkId)?.chain || ''),
      })),
    );
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-600">Loading ledger...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Ledger</h1>
          <p className="text-sm text-slate-600">Expected versus received amounts with receipt counts.</p>
        </div>
        <button className="btn" onClick={() => load()}>Refresh</button>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Paylink</th>
              <th>Status</th>
              <th>Expected</th>
              <th>Received</th>
              <th>Delta</th>
              <th>Asset</th>
              <th>Evidence</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <div>
                    <p className="font-medium">{row.name || row.paylinkId}</p>
                    <p className="text-xs text-slate-500">{row.payerLabel || 'No payer label'}</p>
                  </div>
                </td>
                <td>{row.status}</td>
                <td>{row.expectedAmount || '-'}</td>
                <td>{row.receivedAmount || '-'}</td>
                <td>{row.deltaAmount || '-'}</td>
                <td>{row.token || '-'} / {row.chain || '-'}</td>
                <td>{row.evidenceCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
