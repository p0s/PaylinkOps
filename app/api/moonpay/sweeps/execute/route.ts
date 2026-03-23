import { NextRequest, NextResponse } from 'next/server';
import { getRequestMode, safeJson } from '@/lib/request';
import { getAdapter } from '@/lib/moonpay/index';

export async function POST(req: NextRequest) {
  const mode = await getRequestMode(req);
  const payload = await safeJson(req);
  const confirm = String(payload.confirmPhrase || '').trim();

  if (confirm !== 'SWEEP NOW') {
    return NextResponse.json({ status: 'blocked', reason: 'Missing confirm phrase.' }, { status: 409 });
  }

  const adapter = await getAdapter(mode);
  if (!adapter.executeSweep) {
    return NextResponse.json({ status: 'blocked', reason: 'No sweep execution available for this adapter.' }, { status: 501 });
  }

  const result = await adapter.executeSweep({ planId: String(payload.planId || ''), confirmPhrase: confirm });
  return NextResponse.json(result);
}
