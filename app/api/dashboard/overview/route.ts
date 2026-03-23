import { NextRequest, NextResponse } from 'next/server';
import { loadStore } from '@/lib/storage/store';
import { getRequestMode } from '@/lib/request';
import { getAdapter } from '@/lib/moonpay/index';

export async function GET(req: NextRequest) {
  const mode = await getRequestMode(req);
  const store = await loadStore();
  const adapter = await getAdapter(mode);
  const wallets = await adapter.listWallets();
  const modeStatus = await adapter.getStatus();

  const relevant = store.paylinks.filter((item) => item.mode === mode);
  const ledgers = store.ledgers.filter((entry) => {
    const ref = store.paylinks.find((item) => item.id === entry.paylinkId);
    return ref?.mode === mode;
  });

  return NextResponse.json({
    mode,
    modeStatus,
    wallets,
    paylinks: relevant,
    ledgers,
    receipts: store.receipts.slice(0, 20),
  });
}
