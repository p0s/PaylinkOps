import { NextRequest, NextResponse } from 'next/server';
import { getRequestMode } from '@/lib/request';
import { listPaylinkTransactions } from '@/lib/operations';
import { requireLiveModeAuth } from '@/lib/security';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const mode = await getRequestMode(_req);
  const authError = requireLiveModeAuth(_req, mode);
  if (authError) return authError;

  const { id } = await context.params;
  const tx = await listPaylinkTransactions(mode, id);
  return NextResponse.json({ transactions: tx });
}
