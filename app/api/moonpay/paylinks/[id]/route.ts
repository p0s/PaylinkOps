import { NextRequest, NextResponse } from 'next/server';
import { getRequestMode } from '@/lib/request';
import { getPaylink } from '@/lib/operations';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const mode = await getRequestMode(_req);
  const { id } = await context.params;
  const details = await getPaylink(mode, id);

  if (details === null) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(details);
}
