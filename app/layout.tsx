import Link from 'next/link';
import type { ReactNode } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import './globals.css';

export const metadata = {
  title: 'PaylinkOps',
  description: 'MoonPay-ready merchant operations console for demo and real CLI mode.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 antialiased transition-colors duration-200">
        <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-fg)] transition-colors duration-200">
          <header className="border-b border-[var(--border)] bg-[var(--panel)]/90 backdrop-blur">
            <nav className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
              <Link href="/" className="text-lg font-semibold tracking-tight text-[var(--app-fg)]">
                PaylinkOps
              </Link>
              <Link href="/dashboard" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--app-fg)]">
                Dashboard
              </Link>
              <Link href="/dashboard/paylinks" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--app-fg)]">
                Paylinks
              </Link>
              <Link href="/dashboard/wallets" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--app-fg)]">
                Wallets
              </Link>
              <Link href="/dashboard/ledger" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--app-fg)]">
                Ledger
              </Link>
              <Link href="/dashboard/receipts" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--app-fg)]">
                Receipts
              </Link>
              <Link href="/dashboard/settings" className="ml-auto text-sm font-medium text-[var(--muted)] hover:text-[var(--app-fg)]">
                Settings
              </Link>
              <ThemeToggle />
            </nav>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
