import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 1,
  reporter: [['html', { outputFolder: '../test-results/html' }], ['list']],
  use: {
    baseURL: 'http://localhost:1313',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'cd .. && hugo server -D -p 1313 --disableFastRender',
    url: 'http://localhost:1313',
    reuseExistingServer: true,
    timeout: 30_000,
  },
  projects: [
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'iphone-15', use: { ...devices['iPhone 15'] } },
    { name: 'pixel-8', use: { ...devices['Pixel 8'] } },
    { name: 'ipad', use: { ...devices['iPad (gen 10)'] } },
  ],
});
