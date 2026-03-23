import { loadStore, setMode as persistMode } from '@/lib/storage/store';
import { Mode } from '@/lib/types';

export async function getMode(): Promise<Mode> {
  const store = await loadStore();
  return store.mode;
}

export async function setMode(mode: Mode): Promise<Mode> {
  const store = await persistMode(mode);
  return store.mode;
}
