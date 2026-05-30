import { NextRequest, NextResponse } from 'next/server';
import { loadStore } from '@/lib/storage/store';
import { getRequestMode } from '@/lib/request';
import { requireLiveModeAuth } from '@/lib/security';

export async function GET(req: NextRequest) {
  const mode = await getRequestMode(req);
  const authError = requireLiveModeAuth(req, mode);
  if (authError) return authError;

  const store = await loadStore();
  return NextResponse.json({
    paylinks: store.paylinks.filter((entry) => entry.mode === mode),
    ledgers: store.ledgers.filter((entry) => {
      const match = store.paylinks.find((paylink) => paylink.id === entry.paylinkId);
      return match?.mode === mode;
    }),
  });
}
