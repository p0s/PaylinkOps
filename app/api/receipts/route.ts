import { NextRequest, NextResponse } from 'next/server';
import { loadStore } from '@/lib/storage/store';

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get('mode') as string | null;
  const type = req.nextUrl.searchParams.get('type');
  const store = await loadStore();

  const filtered = store.receipts.filter((receipt) => {
    const modeMatch = mode ? receipt.mode === mode : true;
    const typeMatch = type ? receipt.action.includes(type) || (receipt.sanitizedCommandPreview.includes(type) as boolean) : true;
    return modeMatch && typeMatch;
  });

  return NextResponse.json({ receipts: filtered });
}
