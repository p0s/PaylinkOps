import { NextRequest, NextResponse } from 'next/server';
import { getAdapter } from '@/lib/moonpay/index';
import { getRequestMode } from '@/lib/request';

export async function GET(req: NextRequest) {
  const mode = await getRequestMode(req);
  const adapter = await getAdapter(mode);
  const wallets = await adapter.listWallets();
  return NextResponse.json({ wallets });
}
