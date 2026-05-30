import { NextRequest, NextResponse } from 'next/server';
import { loadStore, resetStoreToSeeded } from '@/lib/storage/store';
import { requireAdminMutationAuth } from '@/lib/security';

export async function POST(req: NextRequest) {
  const authError = requireAdminMutationAuth(req);
  if (authError) return authError;

  const before = await loadStore();
  await resetStoreToSeeded();
  const after = await loadStore();
  return NextResponse.json({
    before: { paylinks: before.paylinks.length },
    after: { paylinks: after.paylinks.length },
  });
}
