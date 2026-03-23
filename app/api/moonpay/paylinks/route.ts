import { NextRequest, NextResponse } from 'next/server';
import { loadStore } from '@/lib/storage/store';
import { getRequestMode } from '@/lib/request';

export async function GET(req: NextRequest) {
  const mode = await getRequestMode(req);
  const store = await loadStore();
  return NextResponse.json({
    paylinks: store.paylinks.filter((entry) => entry.mode === mode),
    ledgers: store.ledgers.filter((entry) => {
      const match = store.paylinks.find((paylink) => paylink.id === entry.paylinkId);
      return match?.mode === mode;
    }),
  });
}
