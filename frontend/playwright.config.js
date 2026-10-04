import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: './e2e', timeout: 30000, retries: 0, workers: 1,
  use: { baseURL: 'http://localhost:8080', trace: 'retain-on-failure' }, reporter: 'list' });
