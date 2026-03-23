import { NextRequest, NextResponse } from 'next/server';
import { loadStore, resetStoreToSeeded } from '@/lib/storage/store';

export async function POST() {
  const before = await loadStore();
  await resetStoreToSeeded();
  const after = await loadStore();
  return NextResponse.json({
    before: { paylinks: before.paylinks.length },
    after: { paylinks: after.paylinks.length },
  });
}
