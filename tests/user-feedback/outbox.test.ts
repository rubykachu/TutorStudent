// @vitest-environment node
import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { FEEDBACK_OUTBOX_MAX } from "@/lib/config";
import { DEVICE_SCOPE, setSetting, TutorDb } from "@/progress/db";
import { sendFeedback } from "@/user-feedback/client";
import {
  addToOutbox,
  FEEDBACK_OUTBOX_KEY,
  flushOutbox,
  readOutbox,
} from "@/user-feedback/outbox";
import { childReport } from "./fixtures";

const NOW = new Date("2026-10-05T14:00:00.000Z");
const now = () => NOW;
const id = (n: number) => n.toString(16).padStart(32, "0");
const report = (n: number, createdAt = "2026-10-05T13:00:00.000Z") =>
  childReport({ id: id(n), createdAt });

let db: TutorDb;
beforeEach(() => {
  db = new TutorDb(`outbox-${Math.random()}`);
});
afterEach(async () => {
  await db.delete();
});

// A fetch that answers each request from the list (a status, or a thrown
// network error) and records the ids sent.
function server(...answers: (number | "offline" | "hang")[]) {
  const sent: string[] = [];
  const fetch = (async (_url: unknown, init: RequestInit) => {
    sent.push(JSON.parse(String(init.body)).id);
    const answer = answers.shift() ?? 202;
    if (answer === "offline") throw new TypeError("Failed to fetch");
    if (answer === "hang") {
      return new Promise((_, reject) =>
        init.signal?.addEventListener("abort", () =>
          reject(new DOMException("x", "AbortError")),
        ),
      );
    }
    return new Response("{}", { status: answer });
  }) as typeof globalThis.fetch;
  return { fetch, sent };
}

const ids = async () => (await readOutbox(db)).map((r) => r.id);

describe("outbox", () => {
  it("keeps a report while offline and removes it once sent", async () => {
    await addToOutbox(db, report(1));
    const offline = server("offline");
    await flushOutbox(db, { fetch: offline.fetch, now });
    expect(await ids()).toEqual([id(1)]);
    await flushOutbox(db, { fetch: server(202).fetch, now });
    expect(await ids()).toEqual([]);
  });

  it("removes on 2xx and on refusals that will never pass", async () => {
    for (const status of [202, 200, 400, 403, 404, 413]) {
      await addToOutbox(db, report(1));
      await flushOutbox(db, { fetch: server(status).fetch, now });
      expect(await ids(), String(status)).toEqual([]);
    }
  });

  it("keeps the report and ends the flush on 401, 429 and 503", async () => {
    for (const status of [401, 429, 503]) {
      await addToOutbox(db, report(1));
      await addToOutbox(db, report(2));
      const s = server(status);
      await flushOutbox(db, { fetch: s.fetch, now });
      expect(s.sent).toEqual([id(1)]);
      expect(await ids()).toEqual([id(1), id(2)]);
      await flushOutbox(db, { fetch: server().fetch, now });
    }
  });

  it("drops a report older than 7 days without a request", async () => {
    await addToOutbox(db, report(1, "2026-09-27T13:00:00.000Z"));
    const s = server();
    await flushOutbox(db, { fetch: s.fetch, now });
    expect(s.sent).toEqual([]);
    expect(await ids()).toEqual([]);
  });

  it("drops the oldest past the cap", async () => {
    for (let n = 1; n <= FEEDBACK_OUTBOX_MAX + 1; n++)
      await addToOutbox(db, report(n));
    const kept = await ids();
    expect(kept).toHaveLength(FEEDBACK_OUTBOX_MAX);
    expect(kept[0]).toBe(id(2));
  });

  it("reads a damaged value as empty", async () => {
    await setSetting(db, DEVICE_SCOPE, FEEDBACK_OUTBOX_KEY, "{oops");
    expect(await readOutbox(db)).toEqual([]);
    await setSetting(db, DEVICE_SCOPE, FEEDBACK_OUTBOX_KEY, '[{"id":1}]');
    expect(await readOutbox(db)).toEqual([]);
  });

  it("sends each report once when two flushes start together", async () => {
    await addToOutbox(db, report(1));
    await addToOutbox(db, report(2));
    const s = server();
    await Promise.all([
      flushOutbox(db, { fetch: s.fetch, now }),
      flushOutbox(db, { fetch: s.fetch, now }),
    ]);
    expect(s.sent).toEqual([id(1), id(2)]);
  });

  it("resolves sendFeedback once the report is stored, before the network", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = server("hang").fetch;
    try {
      await sendFeedback(report(1), db);
      expect(await ids()).toEqual([id(1)]);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
