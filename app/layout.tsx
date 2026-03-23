import Link from 'next/link';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'PaylinkOps',
  description: 'MoonPay-ready merchant operations console for demo and real CLI mode.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900">
        <div className="min-h-screen bg-[#f7f8fb] text-slate-900">
          <header className="border-b border-slate-200 bg-white/85 backdrop-blur">
            <nav className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
              <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
                PaylinkOps
              </Link>
              <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Dashboard
              </Link>
              <Link href="/dashboard/paylinks" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Paylinks
              </Link>
              <Link href="/dashboard/wallets" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Wallets
              </Link>
              <Link href="/dashboard/ledger" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Ledger
              </Link>
              <Link href="/dashboard/receipts" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Receipts
              </Link>
              <Link href="/dashboard/settings" className="ml-auto text-sm font-medium text-slate-600 hover:text-slate-900">
                Settings
              </Link>
            </nav>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
