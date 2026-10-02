import { defineConfig } from "@playwright/test";
import {
  GATE_BASE_URL,
  GATE_SERVER_COMMAND,
  GATE_SERVER_ENV,
  SYNC_BASE_URL,
  SYNC_SERVER_COMMAND,
  syncServerEnv,
  TARGET_DEVICES,
  TEST_BASE_URL,
  TEST_SERVER_COMMAND,
  TEST_SERVER_ENV,
} from "./e2e/targets";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: TEST_BASE_URL,
    trace: "on-first-retry",
  },
  projects: Object.entries(TARGET_DEVICES).map(([name, device]) => ({
    name,
    use: device,
  })),
  webServer: [
    {
      command: TEST_SERVER_COMMAND,
      url: TEST_BASE_URL,
      reuseExistingServer: !process.env.CI,
      env: TEST_SERVER_ENV,
      timeout: 120_000,
    },
    {
      command: GATE_SERVER_COMMAND,
      url: `${GATE_BASE_URL}/unlock`,
      reuseExistingServer: !process.env.CI,
      env: GATE_SERVER_ENV,
      timeout: 120_000,
    },
    {
      command: SYNC_SERVER_COMMAND,
      url: `${SYNC_BASE_URL}/unlock`,
      // Its store folder is new for every run, so a server left over from an
      // earlier run would write somewhere else.
      reuseExistingServer: false,
      env: syncServerEnv(),
      timeout: 120_000,
    },
  ],
});
