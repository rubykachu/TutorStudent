// @vitest-environment node
import { describe, expect, it } from "vitest";
import { FEEDBACK_MAX_ATTEMPTS } from "@/lib/config";
import { syncKey } from "@/sync/store/keys";
import { createMemoryStore } from "@/sync/store/memory";
import type { BlobStore } from "@/sync/store/types";
import { createForwarder } from "@/user-feedback/forward";
import { createGithubIssues } from "@/user-feedback/github";
import type { FeedbackRecord } from "@/user-feedback/schema";
import type { FeedbackLogEntry } from "@/user-feedback/server";
import { fakeGithub, json } from "../user-feedback/fake-github";
import { parentReport } from "../user-feedback/fixtures";
import {
  feedbackHarness,
  feedbackRequest,
  PREFIX,
  reportId,
  START,
} from "./feedback-helpers";

const MONTH = "2026-10";

function github(gh = fakeGithub()) {
  return createGithubIssues({
    token: "test-token",
    repo: "rubykachu/owlyeah-feedback",
    fetch: gh.fetch,
    sleep: async () => {},
  });
}

// Stores `count` reports (ids 1..count, oldest first) without forwarding.
async function seeded(count: number, store: BlobStore = createMemoryStore()) {
  const h = feedbackHarness({ store });
  for (let n = 1; n <= count; n++) {
    await h.service.post(
      await feedbackRequest(parentReport({ id: reportId(n) })),
    );
  }
  return h;
}

function forwarder(
  gh: ReturnType<typeof fakeGithub>,
  now = () => new Date(START),
) {
  const logs: FeedbackLogEntry[] = [];
  const f = createForwarder({
    prefix: PREFIX,
    github: github(gh),
    now,
    log: (e) => logs.push(e),
  });
  return { pass: f.pass, logs };
}

async function patch(
  store: BlobStore,
  id: string,
  change: Partial<FeedbackRecord["forward"]>,
) {
  const key = syncKey(PREFIX, { kind: "feedback", month: MONTH, reportId: id });
  const found = await store.get(key);
  const record = JSON.parse((found as { body: string }).body) as FeedbackRecord;
  await store.put(
    key,
    JSON.stringify({ ...record, forward: { ...record.forward, ...change } }),
  );
}

const fresh = (n: number) => ({ id: reportId(n), month: MONTH });

describe("forwarding", () => {
  it("without a token keeps the report pending with no-token and logs once", async () => {
    const h = await seeded(2);
    await h.runAfter();
    expect(await h.pending()).toEqual([reportId(1), reportId(2)]);
    for (const n of [1, 2]) {
      expect((await h.record(reportId(n)))?.forward).toMatchObject({
        state: "pending",
        lastError: "no-token",
        attempts: 0,
      });
    }
    expect(h.logs.filter((l) => l.event === "forward-off")).toHaveLength(1);
  });

  it("forwards the queue oldest first on the next report once a token is set", async () => {
    const store = createMemoryStore();
    await (await seeded(1, store)).runAfter();
    const gh = fakeGithub();
    const h = feedbackHarness({ store, github: github(gh) });
    await h.service.post(
      await feedbackRequest(parentReport({ id: reportId(2) })),
    );
    await h.runAfter();
    expect(
      gh
        .issues()
        .map((r) => (r.body as { body: string }).body.includes(reportId(1))),
    ).toEqual([true, false]);
    expect(await h.pending()).toEqual([]);
    expect((await h.record(reportId(1)))?.forward).toMatchObject({
      state: "sent",
      attempts: 1,
      issue: 1,
      url: "https://github.com/rubykachu/owlyeah-feedback/issues/1",
      lastError: null,
    });
  });

  it("stops the pass at once on a 502 or a rate limit", async () => {
    for (const [answer, code] of [
      [json(502, {}), "github-5xx"],
      [json(403, {}, { "retry-after": "60" }), "github-rate"],
    ] as const) {
      const counted = code === "github-5xx" ? 1 : 0;
      const h = await seeded(2);
      const gh = fakeGithub();
      gh.answer(json(201, {}), json(201, {}), json(201, {}), answer);
      const f = forwarder(gh);
      await f.pass(h.store, fresh(2));
      expect(gh.issues()).toHaveLength(1);
      expect(await h.pending()).toEqual([reportId(1), reportId(2)]);
      expect((await h.record(reportId(1)))?.forward).toMatchObject({
        state: "pending",
        attempts: counted,
        claimedAt: null,
        lastError: code,
      });
      expect(f.logs.map((l) => [l.event, l.detail])).toEqual([
        ["forward-failed", code],
      ]);
    }
  });

  it("makes one issue per report when two passes run at once", async () => {
    const h = await seeded(3);
    const gh = fakeGithub();
    const a = forwarder(gh);
    const b = forwarder(gh);
    await Promise.all([a.pass(h.store, fresh(3)), b.pass(h.store, fresh(3))]);
    const ids = gh
      .issues()
      .map((r) => /"id":"(\w+)"/.exec((r.body as { body: string }).body)?.[1]);
    expect(ids.sort()).toEqual([reportId(1), reportId(2), reportId(3)]);
    expect(await h.pending()).toEqual([]);
  });

  it("takes a stale claim again and skips a fresh one", async () => {
    const h = await seeded(2);
    await patch(h.store, reportId(1), {
      state: "sending",
      claimedAt: "2026-10-05T13:57:00.000Z",
      attempts: 1,
    });
    await patch(h.store, reportId(2), {
      state: "sending",
      claimedAt: "2026-10-05T13:59:30.000Z",
      attempts: 1,
    });
    const gh = fakeGithub();
    await forwarder(gh).pass(h.store, fresh(2));
    expect(gh.issues()).toHaveLength(1);
    expect((await h.record(reportId(1)))?.forward).toMatchObject({
      state: "sent",
      attempts: 2,
    });
    expect((await h.record(reportId(2)))?.forward.state).toBe("sending");
    expect(await h.pending()).toEqual([reportId(2)]);
  });

  it("gives up a 422 report and sends the one behind it in the same pass", async () => {
    const h = await seeded(2);
    const gh = fakeGithub();
    gh.answer(
      json(201, {}),
      json(201, {}),
      json(201, {}),
      json(422, { message: "bad" }),
    );
    const f = forwarder(gh);
    await f.pass(h.store, fresh(2));
    expect((await h.record(reportId(1)))?.forward).toMatchObject({
      state: "failed",
      lastError: "github-422",
    });
    expect((await h.record(reportId(2)))?.forward.state).toBe("sent");
    expect(await h.pending()).toEqual([]);
    expect(f.logs.map((l) => l.event)).toEqual(["forward-given-up"]);
  });

  it("gives up on the last allowed attempt", async () => {
    const h = await seeded(1);
    await patch(h.store, reportId(1), { attempts: FEEDBACK_MAX_ATTEMPTS - 1 });
    const gh = fakeGithub();
    gh.answer(json(201, {}), json(201, {}), json(201, {}), json(502, {}));
    await forwarder(gh).pass(h.store, fresh(1));
    expect((await h.record(reportId(1)))?.forward).toMatchObject({
      state: "failed",
      attempts: FEEDBACK_MAX_ATTEMPTS,
      lastError: "github-5xx",
    });
    expect(await h.pending()).toEqual([]);
  });

  it("does not count a token or rate failure as an attempt", async () => {
    const h = await seeded(1);
    await patch(h.store, reportId(1), { attempts: FEEDBACK_MAX_ATTEMPTS - 1 });
    const gh = fakeGithub();
    gh.answer(json(201, {}), json(201, {}), json(201, {}), json(401, {}));
    await forwarder(gh).pass(h.store, fresh(1));
    expect((await h.record(reportId(1)))?.forward).toMatchObject({
      state: "pending",
      attempts: FEEDBACK_MAX_ATTEMPTS - 1,
      lastError: "github-401",
    });
    expect(await h.pending()).toEqual([reportId(1)]);
  });

  it("removes a missing record's id and never resends a sent one", async () => {
    const h = await seeded(2);
    await patch(h.store, reportId(2), {
      state: "sent",
      issue: 7,
      url: "https://github.com/x/y/issues/7",
    });
    const key = syncKey(PREFIX, { kind: "feedback-pending" });
    const found = await h.store.get(key);
    const list = JSON.parse((found as { body: string }).body);
    list.items.unshift({ id: reportId(99), month: MONTH });
    await h.store.put(key, JSON.stringify(list));
    const gh = fakeGithub();
    await forwarder(gh).pass(h.store, fresh(2));
    expect(gh.issues()).toHaveLength(1);
    expect(await h.pending()).toEqual([]);
  });

  it("starts no new report once the budget has passed", async () => {
    const h = await seeded(5);
    const gh = fakeGithub();
    let t = Date.parse(START);
    // Every clock read moves 4 s on, so the 30 s budget ends mid-list.
    const f = forwarder(gh, () => {
      t += 4_000;
      return new Date(t);
    });
    await f.pass(h.store, fresh(5));
    const sent = gh.issues().length;
    expect(sent).toBeGreaterThan(0);
    expect(sent).toBeLessThan(5);
    expect((await h.pending()).length).toBe(5 - sent);
  });
});
