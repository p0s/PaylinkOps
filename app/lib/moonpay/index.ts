import { MoonPayStatus, Mode } from '@/lib/types';
import { CliAdapter } from '@/lib/moonpay/cli-adapter';
import { DemoAdapter as DemoAdapterClass } from '@/lib/moonpay/demo-adapter';

export async function getAdapter(mode: Mode) {
  if (mode === 'real') {
    return new CliAdapter(mode);
  }
  return new DemoAdapterClass(mode);
}

export async function getCurrentStatus(mode: Mode): Promise<MoonPayStatus> {
  const adapter = await getAdapter(mode);
  return adapter.getStatus();
}

export async function readWalletsFromMode(mode: Mode) {
  const adapter = await getAdapter(mode);
  return adapter.listWallets();
}
