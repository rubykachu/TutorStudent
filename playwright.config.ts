import { defineConfig } from "@playwright/test";

// Separate from the everyday dev port (3000) so a server already running
// there, possibly another project, is never mistaken for this app.
const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "ipad",
      use: {
        // Safari engine, portrait iPad Air size: the primary target device.
        browserName: "webkit",
        viewport: { width: 820, height: 1180 },
        hasTouch: true,
        isMobile: true,
        deviceScaleFactor: 2,
      },
    },
    {
      name: "phone",
      use: {
        browserName: "chromium",
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true,
        deviceScaleFactor: 2,
      },
    },
  ],
  webServer: {
    command: `pnpm dev --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    env: { CONTENT_INCLUDE_FIXTURE: "1" },
    timeout: 120_000,
  },
});
