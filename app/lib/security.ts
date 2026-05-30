import { NextRequest, NextResponse } from 'next/server';
import type { Mode } from '@/lib/types';

function isProductionLike() {
  return process.env.NODE_ENV === 'production';
}

export function requireAdminMutationAuth(req: NextRequest, message = 'Admin token required.') {
  const token = process.env.PAYLINKOPS_ADMIN_TOKEN;
  if (!token && isProductionLike()) {
    return NextResponse.json({ error: message }, { status: 401 });
  }
  if (token && req.headers.get('authorization') !== `Bearer ${token}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export function requireLiveModeAuth(req: NextRequest, mode: Mode) {
  if (mode !== 'real') return null;
  return requireAdminMutationAuth(req, 'Real MoonPay mode requires PAYLINKOPS_ADMIN_TOKEN.');
}
