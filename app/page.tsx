import Link from 'next/link';

const features = [
  'Create MoonPay payment links with live or seeded demo mode',
  'Track wallet balance and paylink activity in one ledger',
  'Store human-readable CLI receipts for every action',
  'Generate sweep plans with safe confirmation flow',
];

export default function LandingPage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-6 rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-10 lg:grid-cols-[1.15fr,0.85fr]">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">MoonPay-ready merchant ops</p>
          <h1 className="text-4xl font-semibold leading-tight text-[var(--app-fg)]">PaylinkOps</h1>
          <p className="max-w-2xl text-sm text-[var(--muted)]">
            Demo always works. Real mode powers live wallets and deposit actions when MoonPay CLI is installed and authenticated.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard" className="btn btn-primary">
              Open Dashboard
            </Link>
            <a className="btn" href="#features">
              View capabilities
            </a>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--soft)] p-6">
            <svg viewBox="0 0 320 160" className="h-32 w-full" aria-hidden="true">
              <rect x="0.5" y="0.5" width="319" height="159" rx="24" fill="transparent" stroke="currentColor" strokeOpacity="0.12" />
              <rect x="32" y="28" width="132" height="104" rx="22" fill="currentColor" fillOpacity="0.9" />
              <rect x="52" y="48" width="92" height="18" rx="9" fill="white" fillOpacity="0.9" />
              <rect x="52" y="78" width="62" height="12" rx="6" fill="white" fillOpacity="0.5" />
              <rect x="178" y="42" width="104" height="16" rx="8" fill="currentColor" fillOpacity="0.12" />
              <rect x="178" y="72" width="104" height="16" rx="8" fill="currentColor" fillOpacity="0.12" />
              <rect x="178" y="102" width="72" height="16" rx="8" fill="currentColor" fillOpacity="0.12" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[var(--muted)]">Mode options</p>
          <div className="space-y-3">
            <div className="card">
              <p className="text-sm font-semibold">Demo mode</p>
              <p className="text-xs text-[var(--muted)]">Seeded wallets, paylinks, transactions, and receipts.</p>
            </div>
            <div className="card">
              <p className="text-sm font-semibold">Real mode</p>
              <p className="text-xs text-[var(--muted)]">Uses local MoonPay CLI when available. No auth in app UI.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="card space-y-4">
        <h2 className="text-2xl font-semibold">What PaylinkOps includes</h2>
        <ul className="list-disc pl-5 text-sm text-[var(--muted)]">
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Link href="/dashboard/wallets" className="card">Wallets</Link>
        <Link href="/dashboard/paylinks" className="card">Paylinks</Link>
        <Link href="/dashboard/receipts" className="card">Receipts</Link>
        <Link href="/dashboard/ledger" className="card">Ledger</Link>
      </section>
    </div>
  );
}
