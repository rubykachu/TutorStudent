// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  SYNC_BODY_SLACK_BYTES,
  SYNC_HISTORY_MAX_BYTES,
  SYNC_MAX_PROFILES,
  SYNC_PUT_LIMIT_PER_MINUTE,
} from "@/lib/config";
import { mergeChildDocs, mergeHistoryDocs } from "@/sync/merge";
import type { ChildDoc, HistoryDoc } from "@/sync/schema";
import {
  attempt,
  CHILD,
  CHILD_2,
  childDoc,
  cookieFor,
  FAMILY,
  type Harness,
  harness,
  historyDoc,
  OTHER_FAMILY,
  profileDoc,
  request,
  STRANGER,
} from "./sync-helpers";

const CHILD_KEY = { kind: "child", familyId: FAMILY, childId: CHILD } as const;
const MONTH_KEY = {
  kind: "history",
  familyId: FAMILY,
  childId: CHILD,
  month: "2026-10",
} as const;
const PROFILE_KEY = { kind: "profile", familyId: FAMILY } as const;

async function seeded(): Promise<Harness> {
  const h = harness();
  await h.seed(PROFILE_KEY, profileDoc(FAMILY, [CHILD]));
  return h;
}

type Sent = { doc: unknown; ifMatch?: string; ifNoneMatch?: "*" };

async function putChild(h: Harness, body: Sent, query = `?child=${CHILD}`) {
  return h.service.put(await request("PUT", query, { body }));
}
const putMonth = (h: Harness, body: Sent) =>
  putChild(h, body, `?child=${CHILD}&month=2026-10`);

type Answer = {
  error?: string;
  etag: string;
  doc: { attempts: { at: string }[] } & Record<string, unknown>;
};

async function json(response: Response): Promise<Answer> {
  return (await response.json()) as Answer;
}

async function storedDoc<T>(h: Harness, key: Parameters<Harness["stored"]>[0]) {
  return (await h.stored(key))?.doc as T;
}

function withSticker(lessonId: string, at: string): ChildDoc {
  return { ...childDoc(), stickers: [{ lessonId, at }] };
}

afterEach(() => vi.restoreAllMocks());

describe("PUT /api/sync, two devices", () => {
  it("answers the second writer of the main doc with 412 and the first one's doc; merge and retry keeps both", async () => {
    const h = await seeded();
    const e0 = await h.seed(CHILD_KEY, childDoc());
    const a = withSticker("l-one", "2026-10-01T02:00:00.000Z");
    const b = withSticker("l-two", "2026-10-01T02:05:00.000Z");

    const first = await putChild(h, { doc: a, ifMatch: e0 });
    expect(first.status).toBe(200);
    const eA = (await json(first)).etag as string;

    const second = await putChild(h, { doc: b, ifMatch: e0 });
    expect(second.status).toBe(412);
    expect(await json(second)).toEqual({ error: "conflict", doc: a, etag: eA });

    const merged = mergeChildDocs(b, a);
    const retry = await putChild(h, { doc: merged, ifMatch: eA });
    expect(retry.status).toBe(200);
    const stored = (await h.stored(CHILD_KEY))?.doc as ChildDoc;
    expect(stored.stickers.map((s) => s.lessonId).sort()).toEqual([
      "l-one",
      "l-two",
    ]);
  });

  it("does the same for a month doc, and both devices' answers end up stored", async () => {
    const h = await seeded();
    const e0 = await h.seed(MONTH_KEY, historyDoc());
    const a: HistoryDoc = {
      ...historyDoc(),
      attempts: [attempt("a".repeat(32), "2026-10-01T02:00:00.000Z")],
    };
    const b: HistoryDoc = {
      ...historyDoc(),
      attempts: [attempt("b".repeat(32), "2026-10-01T02:05:00.000Z")],
    };
    const first = await putMonth(h, { doc: a, ifMatch: e0 });
    expect(first.status).toBe(200);
    const eA = (await json(first)).etag as string;

    const second = await putMonth(h, { doc: b, ifMatch: e0 });
    expect(second.status).toBe(412);
    const conflict = await json(second);
    expect(conflict.doc).toEqual(a);

    const merged = mergeHistoryDocs(b, conflict.doc as unknown as HistoryDoc);
    expect((await putMonth(h, { doc: merged, ifMatch: eA })).status).toBe(200);
    const stored = (await h.stored(MONTH_KEY))?.doc as HistoryDoc;
    expect(stored.attempts.map((x) => x.id).sort()).toEqual([
      "a".repeat(32),
      "b".repeat(32),
    ]);
  });

  it("lets one of two simultaneous creates win and gives the other the winner's doc", async () => {
    const h = await seeded();
    const a = withSticker("l-one", "2026-10-01T02:00:00.000Z");
    const b = withSticker("l-two", "2026-10-01T02:05:00.000Z");
    const [x, y] = await Promise.all([
      putChild(h, { doc: a, ifNoneMatch: "*" }),
      putChild(h, { doc: b, ifNoneMatch: "*" }),
    ]);
    expect([x.status, y.status].sort()).toEqual([200, 412]);
    const loser = x.status === 412 ? x : y;
    const winner = (await h.stored(CHILD_KEY)) as {
      doc: unknown;
      etag: string;
    };
    expect(await json(loser)).toEqual({
      error: "conflict",
      doc: winner.doc,
      etag: winner.etag,
    });
  });

  it("answers 412 with a null doc for a replace of a doc that does not exist", async () => {
    const h = await seeded();
    const response = await putChild(h, { doc: childDoc(), ifMatch: "nothing" });
    expect(response.status).toBe(412);
    expect(await json(response)).toEqual({
      error: "conflict",
      doc: null,
      etag: null,
    });
  });
});

describe("PUT /api/sync, history is append-only", () => {
  it("answers 409 shrink, with the stored doc, to a PUT that drops a stored attempt", async () => {
    const h = await seeded();
    const stored: HistoryDoc = {
      ...historyDoc(),
      attempts: [
        attempt("a".repeat(32), "2026-10-01T02:00:00.000Z"),
        attempt("b".repeat(32), "2026-10-01T02:05:00.000Z"),
      ],
    };
    const etag = await h.seed(MONTH_KEY, stored);
    const smaller = { ...stored, attempts: stored.attempts.slice(0, 1) };
    const response = await putMonth(h, { doc: smaller, ifMatch: etag });
    expect(response.status).toBe(409);
    expect(await json(response)).toEqual({
      error: "shrink",
      doc: stored,
      etag,
    });
    expect((await h.stored(MONTH_KEY))?.etag).toBe(etag);
  });

  it("answers 409 shrink when only a writing is dropped, and accepts a doc that adds records", async () => {
    const h = await seeded();
    const writing = {
      id: "w".repeat(32),
      exerciseId: "l-one.ex.w",
      text: "Bài viết",
      checks: [],
      at: "2026-10-01T02:00:00.000Z",
    };
    const stored: HistoryDoc = { ...historyDoc(), writings: [writing] };
    const etag = await h.seed(MONTH_KEY, stored);
    expect(
      (await putMonth(h, { doc: historyDoc(), ifMatch: etag })).status,
    ).toBe(409);
    const grown = {
      ...stored,
      attempts: [attempt("a".repeat(32), "2026-10-01T02:00:00.000Z")],
    };
    expect((await putMonth(h, { doc: grown, ifMatch: etag })).status).toBe(200);
  });

  it("refuses a record outside the doc's month with 400", async () => {
    const h = await seeded();
    const stray = {
      ...historyDoc(),
      attempts: [attempt("a".repeat(32), "2026-09-30T02:00:00.000Z")],
    };
    expect((await putMonth(h, { doc: stray, ifNoneMatch: "*" })).status).toBe(
      400,
    );
    const future = {
      ...historyDoc(),
      attempts: [attempt("a".repeat(32), "2026-11-02T02:00:00.000Z")],
    };
    expect((await putMonth(h, { doc: future, ifNoneMatch: "*" })).status).toBe(
      400,
    );
  });

  it("refuses a record whose time is not a time with 400, not a server error", async () => {
    const h = await seeded();
    const garbled = {
      ...historyDoc(),
      attempts: [attempt("a".repeat(32), "garbage")],
    };
    expect((await putMonth(h, { doc: garbled, ifNoneMatch: "*" })).status).toBe(
      400,
    );
  });
});

describe("PUT /api/sync, request checks", () => {
  it("answers 403 origin for a missing or foreign Origin", async () => {
    const h = await seeded();
    for (const headers of [
      { origin: "https://evil.example" },
      { origin: "null" },
    ]) {
      const response = await h.service.put(
        await request("PUT", `?child=${CHILD}`, {
          headers,
          body: { doc: childDoc(), ifNoneMatch: "*" },
        }),
      );
      expect(response.status).toBe(403);
      expect(await json(response)).toEqual({ error: "origin" });
    }
    const none = await request("PUT", `?child=${CHILD}`, {
      body: { doc: childDoc(), ifNoneMatch: "*" },
    });
    none.headers.delete("origin");
    expect((await h.service.put(none)).status).toBe(403);
    expect(await h.stored(CHILD_KEY)).toBeNull();
  });

  it("answers 400 for a body that is not JSON by content type, by text, or by shape", async () => {
    const h = await seeded();
    const plain = await request("PUT", `?child=${CHILD}`, {
      headers: { "content-type": "text/plain" },
      body: JSON.stringify({ doc: childDoc(), ifNoneMatch: "*" }),
    });
    expect((await h.service.put(plain)).status).toBe(400);
    const cases: BodyInit[] = [
      "not json",
      "[]",
      JSON.stringify({ ifNoneMatch: "*" }),
      JSON.stringify({ doc: childDoc() }),
      JSON.stringify({ doc: childDoc(), ifMatch: "a", ifNoneMatch: "*" }),
      JSON.stringify({ doc: childDoc(), ifNoneMatch: "x" }),
      JSON.stringify({ doc: childDoc(), ifNoneMatch: "*", extra: 1 }),
      JSON.stringify({ doc: { ...childDoc(), extra: 1 }, ifNoneMatch: "*" }),
      JSON.stringify({ doc: historyDoc(), ifNoneMatch: "*" }),
    ];
    for (const body of cases) {
      const response = await h.service.put(
        await request("PUT", `?child=${CHILD}`, { body }),
      );
      expect(response.status, String(body)).toBe(400);
    }
    // An application/json type with a charset is fine.
    const charset = await request("PUT", `?child=${CHILD}`, {
      headers: { "content-type": "application/json; charset=utf-8" },
      body: { doc: childDoc(), ifNoneMatch: "*" },
    });
    expect((await h.service.put(charset)).status).toBe(200);
  });

  it("answers 400 when the doc's ids differ from the cookie's family or the query", async () => {
    const h = await seeded();
    const send = async (doc: unknown, query: string) =>
      h.service.put(
        await request("PUT", query, { body: { doc, ifNoneMatch: "*" } }),
      );
    expect((await send(childDoc(OTHER_FAMILY), `?child=${CHILD}`)).status).toBe(
      400,
    );
    expect(
      (await send(childDoc(FAMILY, CHILD_2), `?child=${CHILD}`)).status,
    ).toBe(400);
    expect(
      (await send(historyDoc("2026-09"), `?child=${CHILD}&month=2026-10`))
        .status,
    ).toBe(400);
    expect(
      (await send(profileDoc(OTHER_FAMILY, []), "?doc=profile")).status,
    ).toBe(400);
  });

  it("answers 413 for a body over the cap without parsing it", async () => {
    const h = await seeded();
    const big = "x".repeat(SYNC_HISTORY_MAX_BYTES + SYNC_BODY_SLACK_BYTES + 10);
    const response = await h.service.put(
      await request("PUT", `?child=${CHILD}&month=2026-10`, { body: big }),
    );
    expect(response.status).toBe(413);
    expect(await json(response)).toEqual({ error: "too-large" });
    // The same text on the main doc is under its cap and fails as a body.
    const main = await h.service.put(
      await request("PUT", `?child=${CHILD}`, { body: big }),
    );
    expect(main.status).toBe(400);
  });

  it("answers 413 from the declared length alone", async () => {
    const h = await seeded();
    const response = await h.service.put(
      await request("PUT", `?child=${CHILD}`, {
        headers: { "content-length": "9999999" },
        body: "{}",
      }),
    );
    expect(response.status).toBe(413);
  });

  it("answers 409 upgrade-required for a doc of a lower version than the stored one", async () => {
    const h = await seeded();
    const etag = await h.seed(CHILD_KEY, { ...childDoc(), version: 2 });
    const response = await putChild(h, { doc: childDoc(), ifMatch: etag });
    expect(response.status).toBe(409);
    expect(await json(response)).toEqual({ error: "upgrade-required" });
    expect((await storedDoc<{ version: number }>(h, CHILD_KEY)).version).toBe(
      2,
    );
  });

  it("answers 403 child for a child the profile doc does not list, and writes nothing", async () => {
    const h = await seeded();
    const stranger = childDoc(FAMILY, STRANGER);
    const response = await putChild(
      h,
      { doc: stranger, ifNoneMatch: "*" },
      `?child=${STRANGER}`,
    );
    expect(response.status).toBe(403);
    expect(await json(response)).toEqual({ error: "child" });
    expect(
      await h.stored({ kind: "child", familyId: FAMILY, childId: STRANGER }),
    ).toBeNull();
  });

  it("never writes into another family's folder", async () => {
    const h = await seeded();
    const other = await cookieFor(OTHER_FAMILY);
    const foreign = await h.service.put(
      await request("PUT", `?child=${CHILD}`, {
        cookie: other,
        body: { doc: childDoc(OTHER_FAMILY), ifNoneMatch: "*" },
      }),
    );
    expect(foreign.status).toBe(403);
    const claimed = await h.service.put(
      await request("PUT", `?child=${CHILD}`, {
        cookie: other,
        body: { doc: childDoc(FAMILY), ifNoneMatch: "*" },
      }),
    );
    expect(claimed.status).toBe(400);
    expect(await h.stored(CHILD_KEY)).toBeNull();
    expect(
      await h.stored({ kind: "child", familyId: OTHER_FAMILY, childId: CHILD }),
    ).toBeNull();
  });

  it("answers 401 without a cookie and 503 without a store", async () => {
    const h = await seeded();
    const body = { doc: childDoc(), ifNoneMatch: "*" };
    expect(
      (
        await h.service.put(
          await request("PUT", `?child=${CHILD}`, { cookie: null, body }),
        )
      ).status,
    ).toBe(401);
    const none = harness({ store: null });
    const response = await none.service.put(
      await request("PUT", `?child=${CHILD}`, { body }),
    );
    expect(response.status).toBe(503);
    expect(await json(response)).toEqual({ error: "sync-unavailable" });
  });

  it("answers 429 with retry-after on the 31st write in a minute", async () => {
    const h = await seeded();
    let etag = await h.seed(CHILD_KEY, childDoc());
    for (let i = 0; i < SYNC_PUT_LIMIT_PER_MINUTE; i++) {
      const response = await putChild(h, { doc: childDoc(), ifMatch: etag });
      expect(response.status).toBe(200);
      etag = (await json(response)).etag;
    }
    const limited = await putChild(h, { doc: childDoc(), ifMatch: etag });
    expect(limited.status).toBe(429);
    expect(Number(limited.headers.get("retry-after"))).toBeGreaterThan(0);
  });

  it("refuses a profile doc of more than 12 profiles", async () => {
    const h = harness();
    const ids = Array.from({ length: SYNC_MAX_PROFILES + 1 }, (_, i) =>
      i.toString(16).padStart(32, "0"),
    );
    const response = await h.service.put(
      await request("PUT", "?doc=profile", {
        body: { doc: profileDoc(FAMILY, ids), ifNoneMatch: "*" },
      }),
    );
    expect(response.status).toBe(400);
  });

  it("refuses to overwrite a stored doc that fails the schema", async () => {
    const h = await seeded();
    const etag = await h.seed(CHILD_KEY, null, '{"broken":true}');
    const response = await putChild(h, { doc: childDoc(), ifMatch: etag });
    expect(response.status).toBe(500);
    expect(await json(response)).toEqual({ error: "stored-invalid" });
    expect((await h.stored(CHILD_KEY))?.body).toBe('{"broken":true}');
  });
});

describe("PUT /api/sync, profile doc and the child list", () => {
  it("accepts a child PUT right after another instance added the profile (stale cache)", async () => {
    const h = await seeded();
    // This instance learns the list [CHILD].
    expect(
      (await putChild(h, { doc: childDoc(), ifNoneMatch: "*" })).status,
    ).toBe(200);
    // Another instance adds CHILD_2 to the profile doc.
    await h.seed(PROFILE_KEY, profileDoc(FAMILY, [CHILD, CHILD_2]));
    const response = await putChild(
      h,
      { doc: childDoc(FAMILY, CHILD_2), ifNoneMatch: "*" },
      `?child=${CHILD_2}`,
    );
    expect(response.status).toBe(200);
  });

  it("knows a child at once after this instance stored the profile doc", async () => {
    const h = harness();
    const profile = await h.service.put(
      await request("PUT", "?doc=profile", {
        body: { doc: profileDoc(FAMILY, [CHILD]), ifNoneMatch: "*" },
      }),
    );
    expect(profile.status).toBe(200);
    expect(
      (await putChild(h, { doc: childDoc(), ifNoneMatch: "*" })).status,
    ).toBe(200);
  });

  it("answers a child PUT with 403 while the profile doc does not exist", async () => {
    const h = harness();
    expect(
      (await putChild(h, { doc: childDoc(), ifNoneMatch: "*" })).status,
    ).toBe(403);
  });
});

describe("PUT /api/sync, times in the server's future", () => {
  it("stores a time a day ahead as server time and returns the stored doc", async () => {
    const h = await seeded();
    const doc: ChildDoc = {
      ...childDoc(),
      stickers: [{ lessonId: "l-one", at: "2026-10-03T03:00:00.000Z" }],
      resets: { "l-two": "2026-10-04T03:00:00.000Z" },
      activityDays: ["2026-10-02", "2026-10-03"],
      cards: [
        {
          cardId: "l-one.card.a",
          lessonId: "l-one",
          due: "2026-10-09T03:00:00.000Z",
          stability: 1,
          difficulty: 5,
          scheduledDays: 7,
          learningSteps: 0,
          reps: 1,
          lapses: 0,
          state: 2,
          lastReviewAt: "2026-10-03T03:00:00.000Z",
        },
      ],
    };
    const response = await putChild(h, { doc, ifNoneMatch: "*" });
    expect(response.status).toBe(200);
    const body = await json(response);
    const stored = (await h.stored(CHILD_KEY))?.doc as ChildDoc;
    expect(body.doc).toEqual(stored);
    expect(stored.stickers[0]?.at).toBe("2026-10-02T03:00:00.000Z");
    expect(stored.resets["l-two"]).toBe("2026-10-02T03:00:00.000Z");
    expect(stored.cards[0]?.lastReviewAt).toBe("2026-10-02T03:00:00.000Z");
    // A schedule is not a moment that happened.
    expect(stored.cards[0]?.due).toBe("2026-10-09T03:00:00.000Z");
    expect(stored.activityDays).toEqual(["2026-10-02"]);
  });

  it("leaves a time within the allowed skew alone and omits doc from the answer", async () => {
    const h = await seeded();
    const soon = "2026-10-02T03:09:00.000Z";
    const response = await putChild(h, {
      doc: withSticker("l-one", soon),
      ifNoneMatch: "*",
    });
    expect(response.status).toBe(200);
    expect(await json(response)).not.toHaveProperty("doc");
    expect((await storedDoc<ChildDoc>(h, CHILD_KEY)).stickers[0]?.at).toBe(
      soon,
    );
  });

  it("clamps the time of a record in a month doc and keeps it in its month", async () => {
    const h = await seeded();
    const doc = {
      ...historyDoc(),
      attempts: [attempt("a".repeat(32), "2026-10-25T02:00:00.000Z")],
    };
    const response = await putMonth(h, { doc, ifNoneMatch: "*" });
    expect(response.status).toBe(200);
    const body = await json(response);
    expect(body.doc.attempts[0].at).toBe("2026-10-02T03:00:00.000Z");
  });
});

describe("PUT /api/sync, logging", () => {
  it("logs failures with the family, doc kind, status and size but no content", async () => {
    const spies = (["log", "info", "warn", "error", "debug"] as const).map(
      (name) => vi.spyOn(console, name).mockImplementation(() => undefined),
    );
    const h = harness({ capture: false });
    await h.seed(PROFILE_KEY, profileDoc(FAMILY, [CHILD]));
    const secret = "Nội-dung-bí-mật-bài-viết";
    const doc = {
      ...historyDoc(),
      writings: [
        {
          id: "w".repeat(32),
          exerciseId: "l-one.ex.w",
          text: secret,
          checks: [],
          at: "2026-09-01T00:00:00.000Z",
        },
      ],
    };
    // Fails: the writing is outside the month.
    await putMonth(h, { doc, ifNoneMatch: "*" });
    const lines = spies.flatMap((spy) =>
      spy.mock.calls.map((call) => JSON.stringify(call)),
    );
    expect(lines).toHaveLength(1);
    expect(lines[0]).not.toContain(secret);
    expect(lines[0]).toContain(FAMILY);
    expect(lines[0]).toContain("history");
    expect(lines[0]).toContain("400");
  });
});
