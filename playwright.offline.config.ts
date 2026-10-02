import { defineConfig } from "@playwright/test";
import { OFFLINE_BASE_URL, TARGET_DEVICES } from "./e2e/targets";

// The offline E2E. It runs against a production build of the committed HEAD,
// served by `scripts/offline-lab.ts` (`pnpm test:e2e:offline` starts the lab
// and then this config with `OFFLINE_LAB_URL` set). Chromium only, with the
// iPad's viewport: Playwright cannot go offline or see a service worker's
// requests in WebKit. No `webServer`: the lab owns the server.
const { browserName: _webkit, ...ipad } = TARGET_DEVICES.ipad;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "offline.spec.ts",
  // One shared device walks the scenarios in order.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? "github" : "list",
  timeout: 120_000,
  use: {
    baseURL: process.env.OFFLINE_LAB_URL ?? OFFLINE_BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "ipad-chromium", use: { ...ipad, browserName: "chromium" } },
  ],
});
