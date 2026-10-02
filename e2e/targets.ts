import { tmpdir } from "node:os";
import path from "node:path";

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

// A third dev server for the progress-sync E2E: the gate on, named family
// codes and the folder store. Every test uses its own family (so tests running
// side by side never share a profile doc or a rate limit) and the store folder
// is new for each run: its name is made once and handed to the workers through
// the environment.
export const SYNC_PORT = TEST_PORT + 2000;
export const SYNC_BASE_URL = `http://localhost:${SYNC_PORT}`;
export const SYNC_DIST_DIR = ".next-sync";
export const SYNC_SERVER_COMMAND = `pnpm exec next dev --port ${SYNC_PORT}`;

export type SyncFamily = { id: string; code: string };

// One family per scenario and target, plus one stranger family per target.
const SYNC_FAMILY_COUNT = 18;
export const SYNC_FAMILIES: readonly SyncFamily[] = Array.from(
  { length: SYNC_FAMILY_COUNT },
  (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return { id: `e2e-family-${n}`, code: `Sync-E2E-Code-${n}` };
  },
);

const SYNC_STORE_ENV_KEY = "TUTOR_E2E_SYNC_STORE";

// The folder of this run's store, named on first call, in the system's
// temporary folder. It must lie outside the project: the dev server watches
// the project and reloads pages when a file in it changes, which every write
// of the store would do. The server creates the folder when it first writes,
// so a run that never syncs leaves nothing behind.
export function syncStoreDir(): string {
  const known = process.env[SYNC_STORE_ENV_KEY];
  if (known) return known;
  const dir = path.join(
    tmpdir(),
    `tutor-sync-e2e-${Date.now()}-${process.pid}`,
  );
  process.env[SYNC_STORE_ENV_KEY] = dir;
  return dir;
}

export function syncServerEnv(): Record<string, string> {
  return {
    NEXT_DIST_DIR: SYNC_DIST_DIR,
    CONTENT_INCLUDE_FIXTURE: "1",
    FAMILY_CODES: SYNC_FAMILIES.map((f) => `${f.id}:${f.code}`).join(","),
    SESSION_SECRET: "e2e-secret-of-at-least-thirty-two-characters",
    SYNC_STORE: `fs:${syncStoreDir()}`,
  };
}

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
