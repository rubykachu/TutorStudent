// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  FEEDBACK_FAMILY_DAY_LIMIT,
  FEEDBACK_FAMILY_LIMIT,
  FEEDBACK_IP_LIMIT,
  FEEDBACK_PENDING_MAX,
} from "@/lib/config";
import { syncKey } from "@/sync/store/keys";
import { createMemoryStore } from "@/sync/store/memory";
import type { BlobStore } from "@/sync/store/types";
import { familyPseudonym } from "@/user-feedback/identity";
import { gateConfig, SESSION_SECRET } from "../access/helpers";
import { childReport, parentReport } from "../user-feedback/fixtures";
import {
  cookieFor,
  FAMILY,
  feedbackHarness,
  feedbackRequest,
  PREFIX,
  reportId,
} from "./feedback-helpers";

async function status(response: Response) {
  return { status: response.status, body: await response.json() };
}

describe("POST /api/feedback refusals", () => {
  it("refuses a missing or foreign Origin", async () => {
    const h = feedbackHarness();
    for (const origin of [undefined, "https://evil.example"]) {
      const request = await feedbackRequest(parentReport(), {
        headers: origin ? { origin } : {},
      });
      if (!origin) request.headers.delete("origin");
      expect(await status(await h.service.post(request))).toEqual({
        status: 403,
        body: { error: "origin" },
      });
    }
  });

  it("refuses a wrong media type and a bad body", async () => {
    const h = feedbackHarness();
    const wrongType = await feedbackRequest(parentReport(), {
      headers: { "content-type": "text/plain" },
    });
    expect((await h.service.post(wrongType)).status).toBe(400);
    for (const body of [
      "{",
      "null",
      JSON.stringify({ ...parentReport(), x: 1 }),
    ]) {
      expect(
        (await h.service.post(await feedbackRequest({}, { body }))).status,
      ).toBe(400);
    }
    const old = parentReport({ createdAt: "2026-09-20T00:00:00.000Z" });
    expect((await h.service.post(await feedbackRequest(old))).status).toBe(400);
  });

  it("refuses without a cookie and for a revoked family", async () => {
    const h = feedbackHarness();
    const none = await feedbackRequest(parentReport(), { cookie: null });
    expect((await h.service.post(none)).status).toBe(401);
    const revoked = feedbackHarness({
      access: gateConfig({ revoked: [FAMILY] }),
    });
    expect((await revoked.service.post(await feedbackRequest())).status).toBe(
      401,
    );
  });

  it("answers no-gate, unavailable and no store", async () => {
    const open = feedbackHarness({ access: { mode: "open" } });
    expect(
      await status(await open.service.post(await feedbackRequest())),
    ).toEqual({
      status: 404,
      body: { error: "no-gate" },
    });
    const closed = feedbackHarness({ access: { mode: "closed", reason: "x" } });
    expect((await closed.service.post(await feedbackRequest())).status).toBe(
      503,
    );
    const noStore = feedbackHarness({ store: null });
    expect(
      await status(await noStore.service.post(await feedbackRequest())),
    ).toEqual({
      status: 503,
      body: { error: "feedback-unavailable" },
    });
  });

  it("refuses a body over 4096 bytes", async () => {
    const h = feedbackHarness();
    const big = await feedbackRequest({}, { body: "x".repeat(4097) });
    expect((await h.service.post(big)).status).toBe(413);
  });

  it("limits per family, per family day and per address", async () => {
    const send = async (
      h: ReturnType<typeof feedbackHarness>,
      n: number,
      ip = "1.1.1.1",
    ) =>
      h.service.post(
        await feedbackRequest(parentReport({ id: reportId(n) }), {
          headers: { "x-forwarded-for": ip },
        }),
      );
    const h = feedbackHarness();
    for (let n = 1; n <= FEEDBACK_FAMILY_LIMIT; n++) {
      expect((await send(h, n, `10.0.0.${n}`)).status).toBe(202);
    }
    const over = await send(h, 99, "10.0.1.1");
    expect(over.status).toBe(429);
    expect(Number(over.headers.get("retry-after"))).toBeGreaterThan(0);

    const day = feedbackHarness();
    let refused = 0;
    for (let n = 1; n <= FEEDBACK_FAMILY_DAY_LIMIT + 1; n++) {
      // A new short window every 10 reports, inside one day.
      day.setNow(
        new Date(
          Date.parse("2026-10-05T14:00:00.000Z") +
            Math.floor((n - 1) / 10) * 11 * 60_000,
        ).toISOString(),
      );
      const r = await send(day, 1000 + n, `10.1.${n}.1`);
      if (r.status === 429) refused += 1;
    }
    expect(refused).toBe(1);

    const ip = feedbackHarness();
    for (let n = 1; n <= FEEDBACK_IP_LIMIT; n++) {
      const cookie = await cookieFor(
        `OWL${"ABCDEFGHJKMNPQRSTVWXYZ"[n] ?? "Z"}2ZB0`.slice(0, 8),
      );
      const r = await ip.service.post(
        await feedbackRequest(parentReport({ id: reportId(2000 + n) }), {
          cookie,
        }),
      );
      expect(r.status).toBe(202);
    }
    const ipOver = await ip.service.post(
      await feedbackRequest(parentReport({ id: reportId(2100) }), {
        cookie: await cookieFor("OWL9X2ZB"),
      }),
    );
    expect(ipOver.status).toBe(429);
  });
});

describe("POST /api/feedback storage", () => {
  it("stores the record and lists it as pending before the answer", async () => {
    const h = feedbackHarness();
    const response = await h.service.post(await feedbackRequest());
    expect(await status(response)).toEqual({ status: 202, body: { ok: true } });
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(h.tasks).toHaveLength(1);
    expect(await h.pending()).toEqual([parentReport().id]);
    const record = await h.record(parentReport().id);
    expect(record).toMatchObject({
      schema: "feedback",
      version: 1,
      receivedAt: "2026-10-05T21:00:00+07:00",
      family: await familyPseudonym(SESSION_SECRET, FAMILY),
      app: "5fc3656",
      forward: { state: "pending", attempts: 0 },
    });
    const text = JSON.stringify(record);
    for (const secret of [FAMILY, "203.0.113.7", "tutor_family", "Mozilla"]) {
      expect(text).not.toContain(secret);
    }
  });

  it("sanitizes the note and drops an empty one", async () => {
    const h = feedbackHarness();
    await h.service.post(
      await feedbackRequest(parentReport({ note: "@ai <b>`x`</b>" })),
    );
    expect((await h.record(parentReport().id))?.report.note).toBe(
      "＠ai ‹b›'x'‹/b›",
    );
    const empty = parentReport({ id: reportId(5), note: "\u0000" });
    await h.service.post(await feedbackRequest(empty));
    expect((await h.record(reportId(5)))?.report).not.toHaveProperty("note");
  });

  it("stores a duplicate id once", async () => {
    const h = feedbackHarness();
    await h.service.post(await feedbackRequest());
    const again = await h.service.post(
      await feedbackRequest(parentReport({ note: "khác" })),
    );
    expect(await status(again)).toEqual({
      status: 200,
      body: { ok: true, duplicate: true },
    });
    expect((await h.record(parentReport().id))?.report.note).toBe(
      "Đáp án câu b in sai dấu",
    );
    expect(h.tasks).toHaveLength(1);
    expect(await h.pending()).toEqual([parentReport().id]);
  });

  it("answers busy when the pending list always conflicts, and a retry adds it", async () => {
    const inner = createMemoryStore();
    const pendingKey = syncKey(PREFIX, { kind: "feedback-pending" });
    let jammed = true;
    const store: BlobStore = {
      get: (key, options) => inner.get(key, options),
      put: (key, body, options) =>
        jammed && key === pendingKey
          ? Promise.resolve({ conflict: true as const })
          : inner.put(key, body, options),
      delete: (key) => inner.delete(key),
    };
    const h = feedbackHarness({ store });
    const first = await h.service.post(await feedbackRequest());
    expect(await status(first)).toEqual({
      status: 503,
      body: { error: "busy" },
    });
    expect(h.logs.map((l) => l.event)).toEqual(["pending-busy"]);
    expect(await h.pending()).toEqual([]);
    jammed = false;
    const retry = await h.service.post(await feedbackRequest());
    expect(retry.status).toBe(200);
    expect(await h.pending()).toEqual([parentReport().id]);
  });

  it("keeps both ids of two reports sent at once", async () => {
    const h = feedbackHarness();
    const [a, b] = await Promise.all([
      h.service.post(await feedbackRequest(parentReport({ id: reportId(1) }))),
      h.service.post(await feedbackRequest(childReport({ id: reportId(2) }))),
    ]);
    expect([a.status, b.status]).toEqual([202, 202]);
    expect((await h.pending()).sort()).toEqual([reportId(1), reportId(2)]);
  });

  it("stores but does not list a report past a full pending list", async () => {
    const h = feedbackHarness();
    await h.store.put(
      syncKey(PREFIX, { kind: "feedback-pending" }),
      JSON.stringify({
        schema: "feedback-pending",
        version: 1,
        items: Array.from({ length: FEEDBACK_PENDING_MAX }, (_, n) => ({
          id: reportId(10_000 + n),
          month: "2026-10",
        })),
      }),
    );
    const response = await h.service.post(await feedbackRequest());
    expect(response.status).toBe(202);
    expect(await h.record(parentReport().id)).not.toBeNull();
    expect(h.logs).toEqual([
      {
        route: "POST",
        status: 202,
        event: "pending-full",
        id: parentReport().id,
      },
    ]);
  });

  it("logs no note, title, family id or pseudonym", async () => {
    const h = feedbackHarness();
    await h.service.post(
      await feedbackRequest(parentReport({ id: reportId(1) })),
    );
    await h.service.post(await feedbackRequest({ ...parentReport(), x: 1 }));
    await h.service.post(
      await feedbackRequest(parentReport(), { cookie: null }),
    );
    const text = JSON.stringify(h.logs);
    expect(h.logs.length).toBeGreaterThan(0);
    const pseudonym = await familyPseudonym(SESSION_SECRET, FAMILY);
    for (const secret of [
      FAMILY,
      pseudonym,
      "sai dấu",
      "Lũy thừa",
      "Nhân hai",
    ]) {
      expect(text).not.toContain(secret);
    }
  });

  it("answers 500 server and logs only the error name when the store throws", async () => {
    const broken: BlobStore = {
      get: () => Promise.reject(new Error("secret path")),
      put: () => Promise.reject(new Error("secret path")),
      delete: () => Promise.resolve(),
    };
    const h = feedbackHarness({ store: broken });
    expect(await status(await h.service.post(await feedbackRequest()))).toEqual(
      {
        status: 500,
        body: { error: "server" },
      },
    );
    expect(h.logs).toEqual([
      {
        route: "POST",
        status: 500,
        event: "exception",
        id: parentReport().id,
        detail: "Error",
      },
    ]);
  });
});
