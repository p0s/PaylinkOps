import { NextRequest, NextResponse } from 'next/server';
import { getRequestMode, safeJson } from '@/lib/request';
import { createPaylinkSchema } from '@/lib/types';
import { createPaylink as runCreatePaylink } from '@/lib/operations';

export async function POST(req: NextRequest) {
  const mode = await getRequestMode(req);
  const payload = await safeJson(req);

  const parsed = createPaylinkSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid paylink payload', details: parsed.error.format() }, { status: 400 });
  }

  const result = await runCreatePaylink(mode, parsed.data);
  return NextResponse.json(result);
}
