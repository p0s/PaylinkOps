'use client';

import { useEffect, useState } from 'react';

type Wallet = {
  id: string;
  alias: string;
  chainCount: number;
  addresses: Record<string, string>;
};

export default function WalletsPage() {
  const [mode, setMode] = useState<'demo' | 'real'>('demo');
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const modeState = await fetch('/api/mode').then((response) => response.json());
    setMode(modeState.mode);
    const payload = await fetch(`/api/moonpay/wallets?mode=${modeState.mode}`).then((response) => response.json());
    setWallets(payload.wallets || []);
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-600">Loading wallets...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Wallets</h1>
          <p className="text-sm text-slate-600">Mode: {mode}</p>
        </div>
        <button className="btn" onClick={() => load()}>Refresh</button>
      </div>
      <div className="space-y-4">
        {wallets.map((wallet) => (
          <div key={wallet.id} className="card space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{wallet.alias}</p>
                <p className="text-xs text-slate-500">{wallet.id}</p>
              </div>
              <p className="text-sm text-slate-600">{wallet.chainCount} chains</p>
            </div>
            <pre className="code">{JSON.stringify(wallet.addresses, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
