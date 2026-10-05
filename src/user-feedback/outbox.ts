import { z } from "zod";
import {
  FEEDBACK_OUTBOX_MAX,
  FEEDBACK_OUTBOX_MAX_AGE_DAYS,
  FEEDBACK_SEND_TIMEOUT_MS,
} from "@/lib/config";
import { now as clockNow } from "@/lib/time";
import {
  DEVICE_SCOPE,
  getSetting,
  setSetting,
  type TutorDb,
} from "@/progress/db";
import { type FeedbackRequest, FeedbackRequestSchema } from "./schema";

// The device outbox of feedback reports: every report is kept here first, so
// the child's thank-you never waits for the network, and sent oldest first
// when the network allows. One device setting (never synced) holds the JSON
// list; a damaged value reads as an empty outbox.

export const FEEDBACK_OUTBOX_KEY = "feedbackOutbox";
export const FEEDBACK_ENDPOINT = "/api/feedback";

const OutboxSchema = z.array(FeedbackRequestSchema);
const DAY_MS = 86_400_000;

export async function readOutbox(db: TutorDb): Promise<FeedbackRequest[]> {
  const value = await getSetting(db, DEVICE_SCOPE, FEEDBACK_OUTBOX_KEY);
  if (typeof value !== "string") return [];
  try {
    const parsed = OutboxSchema.safeParse(JSON.parse(value));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

async function update(
  db: TutorDb,
  change: (reports: FeedbackRequest[]) => FeedbackRequest[],
): Promise<void> {
  await db.transaction("rw", db.settings, async () => {
    const next = change(await readOutbox(db));
    await setSetting(
      db,
      DEVICE_SCOPE,
      FEEDBACK_OUTBOX_KEY,
      JSON.stringify(next),
    );
  });
}

// Adds a report; past the cap the oldest ones are dropped.
export async function addToOutbox(
  db: TutorDb,
  report: FeedbackRequest,
): Promise<void> {
  await update(db, (reports) =>
    [...reports.filter((r) => r.id !== report.id), report].slice(
      -FEEDBACK_OUTBOX_MAX,
    ),
  );
}

async function removeFromOutbox(db: TutorDb, id: string): Promise<void> {
  await update(db, (reports) => reports.filter((r) => r.id !== id));
}

// What an answer means for the report: `done` leaves the outbox (sent, or
// refused for good: 400, 403, 404, 413), `wait` keeps it and ends this flush
// (401 until the family code is entered again, 429, 5xx, offline, timeout).
export type SendOutcome = "done" | "wait";

export async function postReport(
  report: FeedbackRequest,
  doFetch: typeof fetch = fetch,
): Promise<SendOutcome> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FEEDBACK_SEND_TIMEOUT_MS);
  try {
    const response = await doFetch(FEEDBACK_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(report),
      credentials: "same-origin",
      cache: "no-store",
      signal: controller.signal,
    });
    if (response.ok || [400, 403, 404, 413].includes(response.status)) {
      return "done";
    }
    return "wait";
  } catch {
    return "wait";
  } finally {
    clearTimeout(timer);
  }
}

export type FlushDeps = { fetch?: typeof fetch; now?: () => Date };

async function flushOnce(db: TutorDb, deps: FlushDeps): Promise<void> {
  const now = deps.now ?? clockNow;
  for (const report of await readOutbox(db)) {
    const age = now().getTime() - Date.parse(report.createdAt);
    if (age > FEEDBACK_OUTBOX_MAX_AGE_DAYS * DAY_MS) {
      await removeFromOutbox(db, report.id);
      continue;
    }
    if ((await postReport(report, deps.fetch)) === "wait") return;
    await removeFromOutbox(db, report.id);
  }
}

// One flush per database at a time; a flush asked for while one runs makes
// that one go over the outbox once more, so no report is sent twice at once.
const running = new WeakMap<TutorDb, { done: Promise<void>; again: boolean }>();

export function flushOutbox(db: TutorDb, deps: FlushDeps = {}): Promise<void> {
  const current = running.get(db);
  if (current) {
    current.again = true;
    return current.done;
  }
  const state = { again: false, done: Promise.resolve() };
  state.done = (async () => {
    try {
      do {
        state.again = false;
        await flushOnce(db, deps);
      } while (state.again);
    } catch {
      // A database error: the reports stay for the next flush.
    } finally {
      running.delete(db);
    }
  })();
  running.set(db, state);
  return state.done;
}
