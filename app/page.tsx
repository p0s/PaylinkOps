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
      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-10 lg:grid-cols-[1.2fr,1fr]">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">MoonPay-ready merchant ops</p>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900">PaylinkOps</h1>
          <p className="max-w-2xl text-sm text-slate-600">
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
          <p className="text-sm font-semibold text-slate-600">Mode options</p>
          <div className="space-y-3">
            <div className="card">
              <p className="text-sm font-semibold">Demo mode</p>
              <p className="text-xs text-slate-600">Seeded wallets, paylinks, transactions, and receipts.</p>
            </div>
            <div className="card">
              <p className="text-sm font-semibold">Real mode</p>
              <p className="text-xs text-slate-600">Uses local MoonPay CLI when available. No auth in app UI.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="card space-y-4">
        <h2 className="text-2xl font-semibold">What PaylinkOps includes</h2>
        <ul className="list-disc pl-5 text-sm text-slate-700">
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
