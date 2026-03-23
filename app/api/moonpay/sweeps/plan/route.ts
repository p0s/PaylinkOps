import { NextRequest, NextResponse } from 'next/server';
import { getRequestMode, safeJson } from '@/lib/request';
import { planSweep } from '@/lib/operations';

export async function POST(req: NextRequest) {
  const mode = await getRequestMode(req);
  const payload = await safeJson(req);

  if (typeof payload.walletAlias !== 'string' || typeof payload.destinationAddress !== 'string') {
    return NextResponse.json({ error: 'walletAlias and destinationAddress are required.' }, { status: 400 });
  }

  const plan = await planSweep(mode, {
    walletAlias: payload.walletAlias,
    destinationAddress: payload.destinationAddress,
    tokenFilter: typeof payload.tokenFilter === 'string' ? payload.tokenFilter : undefined,
  });

  return NextResponse.json(plan);
}
