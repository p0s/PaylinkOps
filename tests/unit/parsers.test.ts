import { describe, expect, it } from 'vitest';
import {
  parseCreateRecordToPaylink,
  parseCreateResult,
  parseStatus,
  parseTransactions,
  parseWalletList,
} from '@/lib/moonpay/parsers';

describe('MoonPay parsers', () => {
  it('parses wallet lists from JSON or text', () => {
    const fromJson = parseWalletList(
      JSON.stringify([
        { alias: 'demo-main', addresses: { ethereum: '0xabc', base: '0xdef' } },
      ]),
    );
    const fromText = parseWalletList('demo-main: ethereum=0xabc, base=0xdef');

    expect(fromJson).toEqual([
      {
        id: 'wallet-demo-main',
        alias: 'demo-main',
        source: 'moonpay-cli',
        chainCount: 2,
        addresses: { ethereum: '0xabc', base: '0xdef' },
      },
    ]);
    expect(fromText[0]?.alias).toBe('demo-main');
    expect(fromText[0]?.chainCount).toBe(2);
  });

  it('parses create output and status text defensively', () => {
    const parsed = parseCreateResult(
      'id: dep_123 checkout https://pay.moonpay.com/demo wallet: demo-main chain: base token: usdc',
    );

    expect(parsed.id).toBe('dep_123');
    expect(parsed.paymentUrl).toContain('https://pay.moonpay.com/demo');
    expect(parseStatus('MoonPay CLI v1.2.3')).toEqual({
      version: '1.2.3',
      authenticated: true,
      message: 'MoonPay CLI available.',
    });

    const paylink = parseCreateRecordToPaylink(parsed, 'Demo invoice');
    expect(paylink.name).toBe('Demo invoice');
    expect(paylink.status).toBe('link-created');
  });

  it('parses transaction lists from JSON and table-like output', () => {
    const fromJson = parseTransactions(
      JSON.stringify([
        {
          id: 'tx-1',
          paylinkId: 'pl-1',
          txHash: '0xabc',
          amount: '12.50',
          token: 'USDC',
          chain: 'Base',
          status: 'confirmed',
          timestamp: '2026-03-23T00:00:00.000Z',
        },
      ]),
    );
    const fromTable = parseTransactions('txHash\tchain\tamount\tstatus\n0xdef\tEthereum\t9.99\tconfirmed');

    expect(fromJson[0]?.txHash).toBe('0xabc');
    expect(fromTable[0]?.chain).toBe('Ethereum');
    expect(fromTable[0]?.amount).toBe('9.99');
  });
});
