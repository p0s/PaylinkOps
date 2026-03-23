'use client';

import { useEffect, useState } from 'react';

type SettingsState = {
  mode: 'demo' | 'real';
  allowLiveSweeps: boolean;
  status: {
    installed: boolean;
    authenticated: boolean;
    walletCount?: number;
    version?: string;
    message: string;
  };
};

export default function SettingsPage() {
  const [state, setState] = useState<SettingsState | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const [modeState, sweepsState] = await Promise.all([
      fetch('/api/mode').then((response) => response.json()),
      fetch('/api/settings').then((response) => response.json()),
    ]);
    const status = await fetch(`/api/moonpay/status?mode=${modeState.mode}`).then((response) => response.json());
    setState({
      mode: modeState.mode,
      allowLiveSweeps: sweepsState.allowLiveSweeps,
      status,
    });
  }

  async function updateMode(mode: 'demo' | 'real') {
    await fetch('/api/mode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode }),
    });
    await load();
  }

  async function toggleSweeps(value: boolean) {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ allowLiveSweeps: value }),
    });
    await load();
  }

  async function resetDemo() {
    await fetch('/api/seed', { method: 'POST' });
    await load();
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  if (loading || !state) {
    return <p className="text-sm text-slate-600">Loading settings...</p>;
  }

  return (
    <div className="space-y-6">
      <section className="card space-y-4">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-sm text-slate-600">Switch modes, reset demo state, and gate destructive actions.</p>
        <div className="flex gap-3">
          <button className="btn" onClick={() => updateMode('demo')}>Use demo mode</button>
          <button className="btn" onClick={() => updateMode('real')}>Use real mode</button>
          <button className="btn" onClick={() => resetDemo()}>Load sample merchant scenario</button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card space-y-3">
          <h2 className="text-lg font-semibold">Environment</h2>
          <p className="text-sm">Mode: {state.mode}</p>
          <p className="text-sm">CLI installed: {state.status.installed ? 'yes' : 'no'}</p>
          <p className="text-sm">Authenticated: {state.status.authenticated ? 'yes' : 'no'}</p>
          <p className="text-sm">Wallet count: {state.status.walletCount ?? 0}</p>
          <p className="text-sm">Version: {state.status.version || 'unknown'}</p>
          <p className="text-sm text-slate-600">{state.status.message}</p>
        </div>
        <div className="card space-y-3">
          <h2 className="text-lg font-semibold">Sweep guardrail</h2>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={state.allowLiveSweeps} onChange={(event) => toggleSweeps(event.target.checked)} />
            Allow live sweep actions
          </label>
          <p className="text-sm text-slate-600">Execution is still blocked behind the confirmation phrase `SWEEP NOW`.</p>
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="text-lg font-semibold">Real mode setup</h2>
        <pre className="code">{`npm install -g @moonpay/cli
mp login --email YOUR_EMAIL
mp verify --email YOUR_EMAIL --code YOUR_CODE
mp wallet create --name main
npm install
npm run dev`}</pre>
        <p className="text-sm text-slate-600">Authentication intentionally happens outside the app so browser captcha/login flows are not automated.</p>
      </section>
    </div>
  );
}
