import { MoonPayStatus, PaylinkTransaction, PaylinkRecord, WalletSummary } from '@/lib/types';

export function parseWalletList(raw: string): WalletSummary[] {
  const candidates = tryParseJson(raw);
  if (Array.isArray(candidates)) {
    return candidates
      .map((item) => {
        const source = item as Record<string, unknown>;
        const alias = String(source.alias || source.name || '').trim();
        const addresses = (source.addresses as Record<string, string>) || {};
        if (alias === '') {
          return null;
        }
        return {
          id: 'wallet-' + alias,
          alias,
          source: 'moonpay-cli',
          chainCount: Object.keys(addresses).length,
          addresses: addresses,
        } as WalletSummary;
      })
      .filter((item): item is WalletSummary => item !== null && item !== undefined);
  }

  const lines = raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');

  if (lines.length === 0) {
    return [];
  }

  return lines
    .map((line) => {
      const [alias, rest] = line.split(':');
      if (alias == null || rest == null || alias === '' || rest === '') {
        return null;
      }

      const entries = rest
        .split(',')
        .map((segment) => segment.trim())
        .filter((segment) => segment !== '');

      const addresses: Record<string, string> = {};
      for (const entry of entries) {
        const [chain, address] = entry.split('=');
        if (chain != null && address != null) {
          addresses[chain.trim()] = address.trim();
        }
      }

      return {
        id: 'wallet-' + alias.trim(),
        alias: alias.trim(),
        source: 'moonpay-cli',
        chainCount: Object.keys(addresses).length,
        addresses,
      } as WalletSummary;
    })
    .filter((item): item is WalletSummary => item !== null && item !== undefined);
}

export function parseCreateResult(raw: string): {
  id?: string;
  paymentUrl?: string;
  walletAlias?: string;
  chain?: string;
  token?: string;
  raw: string;
} {
  const parsed = tryParseJson(raw);
  if (parsed && typeof parsed === 'object' && Array.isArray(parsed) === false) {
    return {
      id: String((parsed as Record<string, unknown>).id || ''),
      paymentUrl: String((parsed as Record<string, unknown>).paymentUrl || ''),
      walletAlias: String((parsed as Record<string, unknown>).walletAlias || ''),
      chain: String((parsed as Record<string, unknown>).chain || ''),
      token: String((parsed as Record<string, unknown>).token || ''),
      raw,
    };
  }

  const idMatch = /id[:=]\s*([\w-]+)/i.exec(raw);
  const urlMatch = /(https?:\/\/[\w./?=&-]+)/i.exec(raw);
  const walletMatch = /(wallet|alias)[:=]\s*([\w-]+)/i.exec(raw);
  const chainMatch = /chain[:=]\s*([\w]+)/i.exec(raw);
  const tokenMatch = /token[:=]\s*([\w]+)/i.exec(raw);

  return {
    id: idMatch == null ? undefined : idMatch[1],
    paymentUrl: urlMatch == null ? undefined : urlMatch[1],
    walletAlias: walletMatch == null ? undefined : walletMatch[2],
    chain: chainMatch == null ? undefined : chainMatch[1],
    token: tokenMatch == null ? undefined : tokenMatch[1],
    raw,
  };
}

export function parseStatus(raw: string): Pick<MoonPayStatus, 'authenticated' | 'message' | 'version'> {
  const isAuthError = /login|unauthorized|forbidden|not logged/i.test(raw);
  const versionMatch = /\bv(\d+\.\d+\.\d+)\b/.exec(raw);
  return {
    version: versionMatch == null ? undefined : versionMatch[1],
    authenticated: isAuthError ? false : true,
    message: isAuthError ? 'MoonPay CLI available but authentication is required.' : 'MoonPay CLI available.',
  };
}

export function parseTransactions(raw: string): PaylinkTransaction[] {
  const parsed = tryParseJson(raw);
  if (Array.isArray(parsed)) {
    return parsed.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        id: String(row.id || row.txId || row.transactionId || 'tx-' + Math.random().toString(36).slice(2, 10)),
        paylinkId: String(row.paylinkId || ''),
        txHash: String(row.txHash || row.hash || row.transactionHash || ''),
        amount: String(row.amount || '0'),
        token: String(row.token || row.currency || 'USDC'),
        chain: String(row.chain || 'Unknown'),
        status: String(row.status || 'pending') as PaylinkTransaction['status'],
        timestamp: String(row.timestamp || new Date().toISOString()),
      };
    });
  }

  const lines = raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .slice(1);

  return lines.map((line, index) => {
    const cols = line.split('\t').map((column) => column.trim()).filter((column) => column !== '');
    const tx = cols[0];
    const chain = cols[1];
    const amount = cols[2];
    const status = cols[3];

    return {
      id: 'tx-' + index + '-' + Math.random().toString(36).slice(2, 8),
      paylinkId: '',
      txHash: tx || '',
      amount: amount || '0',
      token: 'USDC',
      chain: chain || 'Unknown',
      status: String(status == null ? 'confirmed' : status).toLowerCase() as PaylinkTransaction['status'],
      timestamp: new Date().toISOString(),
    };
  });
}

export function parseCreateRecordToPaylink(parsed: ReturnType<typeof parseCreateResult>, inputName: string): PaylinkRecord {
  return {
    id: parsed.id || 'paylink-' + Date.now(),
    sourceId: parsed.id,
    mode: 'real',
    name: inputName,
    payerLabel: 'payer',
    walletAlias: parsed.walletAlias || 'default',
    chain: parsed.chain || 'Unknown',
    token: parsed.token || 'USDC',
    status: 'link-created',
    paymentUrl: parsed.paymentUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function tryParseJson(raw: string): unknown | null {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
