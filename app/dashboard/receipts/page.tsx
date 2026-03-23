'use client';

import { useEffect, useState } from 'react';

type Receipt = {
  id: string;
  mode: 'demo' | 'real';
  action: string;
  sanitizedCommandPreview: string;
  stdout?: string;
  stderr?: string;
  success: boolean;
  createdAt: string;
};

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const modeState = await fetch('/api/mode').then((response) => response.json());
    const data = await fetch(`/api/receipts?mode=${modeState.mode}`).then((response) => response.json());
    setReceipts(data.receipts || []);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(receipts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'paylinkops-receipts.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-600">Loading receipts...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Receipts</h1>
          <p className="text-sm text-slate-600">Every action leaves an auditable record.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn" onClick={() => load()}>Refresh</button>
          <button className="btn" onClick={exportJson}>Export JSON</button>
        </div>
      </div>
      <div className="space-y-4">
        {receipts.map((receipt) => (
          <div key={receipt.id} className="card space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">{receipt.action}</p>
                <p className="text-xs text-slate-500">{receipt.mode} mode • {new Date(receipt.createdAt).toLocaleString()}</p>
              </div>
              <p className="text-sm">{receipt.success ? 'success' : 'error'}</p>
            </div>
            <p className="text-sm text-slate-600">{receipt.sanitizedCommandPreview}</p>
            <pre className="code">{receipt.stdout || receipt.stderr || 'No raw output stored.'}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
