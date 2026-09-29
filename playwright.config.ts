import { defineConfig } from "@playwright/test";
import {
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
  webServer: {
    command: TEST_SERVER_COMMAND,
    url: TEST_BASE_URL,
    reuseExistingServer: !process.env.CI,
    env: TEST_SERVER_ENV,
    timeout: 120_000,
  },
});
