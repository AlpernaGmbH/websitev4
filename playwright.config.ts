import { defineConfig, devices } from '@playwright/test'

// Die Tests laufen gegen den Produktions-Build: erst `npm run build`, dann `npm run test:e2e`.
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  // Lokal läuft der installierte Google Chrome, damit kein eigener Browser geladen werden muss. In CI gilt der Playwright-Browser.
  use: { baseURL: 'http://localhost:3100', trace: 'retain-on-failure', channel: process.env.CI ? undefined : 'chrome' },
  webServer: { command: 'npm run start -- -p 3100', url: 'http://localhost:3100', reuseExistingServer: true, timeout: 60_000 },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } } },
    { name: 'handy', use: { ...devices['Pixel 7'] } },
  ],
})
