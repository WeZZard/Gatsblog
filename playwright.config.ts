import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 180_000,
  fullyParallel: true,
  workers: 4,
  reporter: [['list']],
  use: {
    channel: 'chrome',
    headless: true,
  },
  webServer: {
    command: `PARITY_MAX_POST_DATE="${process.env.PARITY_MAX_POST_DATE ?? '2026-11-15T23:59:59Z'}" ASTRO_TELEMETRY_DISABLED=1 npx astro dev --port 4322`,
    url: 'http://localhost:4322',
    reuseExistingServer: false,
    timeout: 30_000,
  },
  projects: [
    {
      name: 'desktop-large',
      use: {
        viewport: { width: 1600, height: 1000 },
        deviceScaleFactor: 2,
      },
    },
    {
      name: 'desktop-laptop',
      use: {
        viewport: { width: 1280, height: 800 },
        deviceScaleFactor: 2,
      },
    },
    {
      name: 'tablet-portrait',
      use: {
        viewport: { width: 768, height: 1024 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'mobile-iphone',
      use: {
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
