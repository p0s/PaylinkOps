import { expect, test } from '@playwright/test';

test('demo mode landing, dashboard, wallets, and receipts API work', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'PaylinkOps', exact: true })).toBeVisible();
  await expect(page.getByText('Demo mode', { exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'Open Dashboard' }).click();
  await expect(page.getByRole('heading', { name: 'PaylinkOps dashboard' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Demo Mode' })).toBeVisible();

  await page.goto('/dashboard/wallets');
  await expect(page.getByRole('heading', { name: 'Wallets' })).toBeVisible();
  await expect(page.getByText('demo-main', { exact: true })).toBeVisible();
  await expect(page.getByText('demo-treasury', { exact: true })).toBeVisible();

  const receipts = await request.get('/api/receipts?mode=demo');
  expect(receipts.ok()).toBeTruthy();
  const body = (await receipts.json()) as { receipts: Array<{ action: string }> };
  expect(body.receipts.some((receipt) => receipt.action === 'seeded-demo-data')).toBeTruthy();
});
