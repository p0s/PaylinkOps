import { NextRequest, NextResponse } from 'next/server';
import { getRequestMode } from '@/lib/request';
import { listPaylinkTransactions } from '@/lib/operations';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const mode = await getRequestMode(_req);
  const { id } = await context.params;
  const tx = await listPaylinkTransactions(mode, id);
  return NextResponse.json({ transactions: tx });
}
