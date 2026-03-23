import { NextRequest } from 'next/server';
import { Mode } from '@/lib/types';
import { getMode as getStoredMode } from '@/lib/mode';

export async function getRequestMode(req: NextRequest): Promise<Mode> {
  const q = req.nextUrl.searchParams.get('mode');
  if (q === 'real' || q === 'demo') {
    return q;
  }

  return await getStoredMode();
}

export async function safeJson(req: NextRequest): Promise<Record<string, unknown>> {
  try {
    return await req.json();
  } catch {
    return {};
  }
}
