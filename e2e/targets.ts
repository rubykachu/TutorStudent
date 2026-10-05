import { tmpdir } from "node:os";
import path from "node:path";
import { familyCode } from "../src/access/code";

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
  FAMILY_CODE_SECRET: "",
  FAMILY_CODES_REVOKED: "",
  SESSION_SECRET: "",
} as const;

// Test values of the two gate secrets, shared by every server with the gate on.
const E2E_SESSION_SECRET = "e2e-secret-of-at-least-thirty-two-characters";
const E2E_FAMILY_CODE_SECRET = "e2e-family-code-secret-of-at-least-32-chars";

// The code of a test family on the E2E servers, made the way
// `pnpm family:code` makes a real one.
export function e2eFamilyCode(familyId: string): Promise<string> {
  return familyCode(E2E_FAMILY_CODE_SECRET, familyId);
}

// A second dev server with the family-code gate on, for the unlock E2E. It
// builds into its own folder because two dev servers cannot share one.
export const GATE_PORT = TEST_PORT + 1000;
export const GATE_BASE_URL = `http://localhost:${GATE_PORT}`;
export const GATE_DIST_DIR = ".next-gate";
export const GATE_SERVER_COMMAND = `pnpm exec next dev --port ${GATE_PORT}`;
export const GATE_FAMILY_ID = "OWLGATE0";
// A family whose codes the gate server no longer accepts.
export const GATE_REVOKED_FAMILY_ID = "OWLREV00";
export const GATE_SERVER_ENV = {
  NEXT_DIST_DIR: GATE_DIST_DIR,
  FAMILY_CODE_SECRET: E2E_FAMILY_CODE_SECRET,
  FAMILY_CODES_REVOKED: GATE_REVOKED_FAMILY_ID,
  SESSION_SECRET: E2E_SESSION_SECRET,
} as const;

// A third dev server for the progress-sync E2E: the gate on, signed family
// codes and the folder store. Every test uses its own family (so tests running
// side by side never share a profile doc or a rate limit) and the store folder
// is new for each run: its name is made once and handed to the workers through
// the environment.
export const SYNC_PORT = TEST_PORT + 2000;
export const SYNC_BASE_URL = `http://localhost:${SYNC_PORT}`;
export const SYNC_DIST_DIR = ".next-sync";
export const SYNC_SERVER_COMMAND = `pnpm exec next dev --port ${SYNC_PORT}`;

// A test family; its code comes from `e2eFamilyCode(id)`.
export type SyncFamily = { id: string };

// One family per scenario and target, plus one stranger family per target.
const SYNC_FAMILY_COUNT = 18;
export const SYNC_FAMILIES: readonly SyncFamily[] = Array.from(
  { length: SYNC_FAMILY_COUNT },
  (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return { id: `OWLE2E${n}` };
  },
);

// The families of the feedback E2E (`e2e/user-feedback.spec.ts`): one per
// scenario and target, on the sync server and store, apart from the sync
// scenarios (a family's profile doc would bring their child along).
export function feedbackFamily(target: string, scenario: number): SyncFamily {
  const targetDigit = Object.keys(TARGET_DEVICES).indexOf(target) + 1;
  if (targetDigit < 1 || scenario < 1 || scenario > 9) {
    throw new Error(`No feedback family for ${target} scenario ${scenario}`);
  }
  return { id: `OWLFB${targetDigit}${scenario}0` };
}

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
    FAMILY_CODE_SECRET: E2E_FAMILY_CODE_SECRET,
    FAMILY_CODES_REVOKED: "",
    SESSION_SECRET: E2E_SESSION_SECRET,
    SYNC_STORE: `fs:${syncStoreDir()}`,
    // Feedback is stored and left pending: no request can reach GitHub.
    GITHUB_FEEDBACK_TOKEN: "",
  };
}

// The offline E2E and the lab runs serve a production build of a committed
// ref from a temporary worktree (`scripts/offline-lab.ts`). The port is the
// test port plus 500 (3600 by default), clear of the dev servers above.
export const OFFLINE_PORT = TEST_PORT + 500;
export const OFFLINE_BASE_URL = `http://localhost:${OFFLINE_PORT}`;
export const OFFLINE_FAMILY_ID = "OWL0FF00";
// Passed to the content emit, the build and the server of every lab run.
// Explicit values win over any `.env*` file, so a build for checks never
// reads the owner's real settings: media comes from the local `/media`
// (never the bucket), the family code and secret are test values, and no
// storage variable is set, so sync stays off (a production server refuses the
// folder store anyway). Offline support is on here, and off by default
// everywhere else (`src/offline/flags.ts`). The deployment id makes Next add
// `?dpl=` to build file URLs as it does on Vercel with Skew Protection on, so
// the worker's lookups are tested against those URLs.
export const OFFLINE_SERVER_ENV = {
  NODE_ENV: "production",
  NEXT_PUBLIC_OFFLINE_ENABLED: "1",
  NEXT_PUBLIC_OFFLINE_KILL_SWITCH: "",
  NEXT_DEPLOYMENT_ID: "offline-lab",
  NEXT_PUBLIC_MEDIA_BASE_URL: "",
  FAMILY_CODE_SECRET: E2E_FAMILY_CODE_SECRET,
  FAMILY_CODES_REVOKED: "",
  SESSION_SECRET: E2E_SESSION_SECRET,
  CONTENT_INCLUDE_FIXTURE: "1",
  R2_ACCOUNT_ID: "",
  R2_ACCESS_KEY_ID: "",
  R2_SECRET_ACCESS_KEY: "",
  R2_PRIVATE_BUCKET: "",
  SYNC_STORE: "",
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
