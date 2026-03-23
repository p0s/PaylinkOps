import { NextRequest, NextResponse } from 'next/server';
import { getMode, setMode } from '@/lib/mode';
import { getRequestMode, safeJson } from '@/lib/request';

export async function GET() {
  const mode = await getMode();
  return NextResponse.json({ mode });
}

export async function POST(req: NextRequest) {
  const payload = await safeJson(req);
  const requested = (payload.mode as string) || (await getRequestMode(req));

  if (requested !== 'demo' && requested !== 'real') {
    return NextResponse.json({ error: 'Mode must be demo or real.' }, { status: 400 });
  }

  const mode = await setMode(requested);
  return NextResponse.json({ mode });
}
