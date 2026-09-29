// Shared by playwright.config.ts and scripts/visual-shot.ts so E2E runs and
// visual screenshots always target the same devices and server.

// Separate from the everyday dev port (3000) so a server already running
// there, possibly another project, is never mistaken for this app. TEST_PORT
// moves it when several checkouts of this repo run E2E side by side.
export const TEST_PORT = Number(process.env.TEST_PORT ?? 3100);
export const TEST_BASE_URL = `http://localhost:${TEST_PORT}`;
export const TEST_SERVER_COMMAND = `pnpm dev --port ${TEST_PORT}`;
export const TEST_SERVER_ENV = { CONTENT_INCLUDE_FIXTURE: "1" } as const;

export const TARGET_DEVICES = {
  // Safari engine, portrait iPad Air size: the primary target device.
  ipad: {
    browserName: "webkit",
    viewport: { width: 820, height: 1180 },
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 2,
  },
  phone: {
    browserName: "chromium",
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 2,
  },
} as const;

export type TargetDeviceName = keyof typeof TARGET_DEVICES;
