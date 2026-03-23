import { NextRequest, NextResponse } from 'next/server';
import { getAllowLiveSweeps, setAllowLiveSweeps } from '@/lib/storage/store';

export async function GET() {
  const allowLiveSweeps = await getAllowLiveSweeps();
  return NextResponse.json({ allowLiveSweeps });
}

export async function POST(req: NextRequest) {
  const payload = (await req.json().catch(() => ({}))) as { allowLiveSweeps?: boolean };
  const value = payload.allowLiveSweeps;
  if (typeof value !== 'boolean') {
    return NextResponse.json({ error: 'allowLiveSweeps must be boolean' }, { status: 400 });
  }

  await setAllowLiveSweeps(value);
  return NextResponse.json({ allowLiveSweeps: value });
}
