import { FAMILY_ID_PATTERN } from "@/lib/config";
import { CHILD_ID_PATTERN, DAY_PATTERN, MONTH_PATTERN } from "@/sync/schema";

// The only place an object key is built, for the profile doc, the main doc,
// the month docs and the snapshots alike:
//
//   <prefix>progress/<familyId>/profile.json
//   <prefix>progress/<familyId>/<childId>.json
//   <prefix>progress/<familyId>/<childId>/history/<yyyy-mm>.json
//   <prefix>snapshots/<familyId>/<childId>/<yyyy-mm-dd>.json
//   <prefix>feedback/<yyyy-mm>/<reportId>.json   (one feedback report)
//   <prefix>feedback/pending.json                (reports not yet on GitHub)
//
// The prefix says which environment owns the key. It comes from
// `syncEnvPrefix` or `testPrefix` below and from no setting of its own, so a
// non-production server can never write under `prod/`.

export type SyncPrefix = "prod/" | "dev/" | `test/${string}/`;

type Env = Record<string, string | undefined>;

// `prod/` only on a production Vercel deployment; `dev/` everywhere else
// (local dev, `next start` on a laptop, Vercel preview).
export function syncEnvPrefix(env: Env = process.env): SyncPrefix {
  return env.VERCEL_ENV === "production" ? "prod/" : "dev/";
}

const RUN_ID_PATTERN = /^[a-z0-9][a-z0-9-]{5,62}$/;
export const TEST_PREFIX_PATTERN = /^test\/[a-z0-9][a-z0-9-]{5,62}\/$/;

// The prefix of one run of the optional real-bucket smoke test.
export function testPrefix(runId: string): SyncPrefix {
  if (!RUN_ID_PATTERN.test(runId)) {
    throw new Error("a test run id is 6 to 63 lowercase letters, digits or -");
  }
  return `test/${runId}/`;
}

export function isSyncPrefix(prefix: string): prefix is SyncPrefix {
  return (
    prefix === "prod/" || prefix === "dev/" || TEST_PREFIX_PATTERN.test(prefix)
  );
}

export type SyncKeyTarget =
  | { kind: "profile"; familyId: string }
  | { kind: "child"; familyId: string; childId: string }
  | { kind: "history"; familyId: string; childId: string; month: string }
  | { kind: "snapshot"; familyId: string; childId: string; day: string }
  // Feedback reports carry no family id in their key.
  | { kind: "feedback"; month: string; reportId: string }
  | { kind: "feedback-pending" };

// A feedback report id: 32 hex digits, like a child id.
const REPORT_ID_PATTERN = /^[0-9a-f]{32}$/;

function part(value: string, pattern: RegExp, what: string): string {
  if (!pattern.test(value)) throw new Error(`invalid ${what} in a sync key`);
  return value;
}

export function syncKey(prefix: SyncPrefix, target: SyncKeyTarget): string {
  if (!isSyncPrefix(prefix)) throw new Error("invalid sync key prefix");
  if (target.kind === "feedback") {
    const month = part(target.month, MONTH_PATTERN, "month");
    return `${prefix}feedback/${month}/${part(target.reportId, REPORT_ID_PATTERN, "report id")}.json`;
  }
  if (target.kind === "feedback-pending")
    return `${prefix}feedback/pending.json`;
  const family = part(target.familyId, FAMILY_ID_PATTERN, "family id");
  switch (target.kind) {
    case "profile":
      return `${prefix}progress/${family}/profile.json`;
    case "child":
      return `${prefix}progress/${family}/${part(target.childId, CHILD_ID_PATTERN, "child id")}.json`;
    case "history": {
      const child = part(target.childId, CHILD_ID_PATTERN, "child id");
      return `${prefix}progress/${family}/${child}/history/${part(target.month, MONTH_PATTERN, "month")}.json`;
    }
    case "snapshot": {
      const child = part(target.childId, CHILD_ID_PATTERN, "child id");
      return `${prefix}snapshots/${family}/${child}/${part(target.day, DAY_PATTERN, "day")}.json`;
    }
  }
}
