import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test('a customer signs up, orders from the real catalogue and restores a cookie session', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Need an account? Sign up' }).click();
  await page.getByPlaceholder('Full name').fill('Browser Customer');
  await page.getByPlaceholder('Email', { exact: true }).fill(`browser-${randomUUID()}@example.test`);
  await page.getByPlaceholder('Password', { exact: true }).fill(randomUUID());
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Demo Kitchen' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Demo Kitchen' })).toBeVisible();
  await page.getByRole('heading', { name: 'Demo Kitchen' }).click();
  await page.getByRole('button', { name: 'ADD', exact: true }).first().click();
  await page.getByRole('button', { name: /Cart/ }).click();
  await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
  await expect(page.getByRole('heading', { name: /Order #\d+/ })).toBeVisible();
  await expect(page.getByText('Total: ₹215.00')).toBeVisible();
  await page.getByRole('button', { name: 'Logout', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Sign in to your food journey' })).toBeVisible();
});
