// Shared by playwright.config.ts and scripts/visual-shot.ts so E2E runs and
// visual screenshots always target the same devices and server.

// Separate from the everyday dev port (3000) so a server already running
// there, possibly another project, is never mistaken for this app. TEST_PORT
// moves it when several checkouts of this repo run E2E side by side.
export const TEST_PORT = Number(process.env.TEST_PORT ?? 3100);
export const TEST_BASE_URL = `http://localhost:${TEST_PORT}`;
export const TEST_SERVER_COMMAND = `pnpm dev --port ${TEST_PORT}`;
// The family-code variables are blanked so a `.env.local` that sets them for
// a local production run never locks the everyday E2E server.
export const TEST_SERVER_ENV = {
  CONTENT_INCLUDE_FIXTURE: "1",
  FAMILY_CODES: "",
  SESSION_SECRET: "",
} as const;

// A second dev server with the family-code gate on, for the unlock E2E. It
// builds into its own folder because two dev servers cannot share one.
export const GATE_PORT = TEST_PORT + 1000;
export const GATE_BASE_URL = `http://localhost:${GATE_PORT}`;
export const GATE_DIST_DIR = ".next-gate";
export const GATE_SERVER_COMMAND = `pnpm exec next dev --port ${GATE_PORT}`;
export const GATE_FAMILY_CODE = "Sao-Bien-4k7m";
export const GATE_SERVER_ENV = {
  NEXT_DIST_DIR: GATE_DIST_DIR,
  FAMILY_CODES: GATE_FAMILY_CODE,
  SESSION_SECRET: "e2e-secret-of-at-least-thirty-two-characters",
} as const;

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
