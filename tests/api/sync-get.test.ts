// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { decideAccess } from "@/access/gate";
import { SYNC_GET_LIMIT_PER_MINUTE } from "@/lib/config";
import { gateConfig } from "../access/helpers";
import {
  ACCESS,
  CHILD,
  CHILD_2,
  childDoc,
  cookieFor,
  FAMILY,
  harness,
  historyDoc,
  OTHER_FAMILY,
  profileDoc,
  request,
  STRANGER,
} from "./sync-helpers";

async function json(response: Response) {
  return (await response.json()) as Record<string, unknown>;
}

async function seeded() {
  const h = harness();
  await h.seed(
    { kind: "profile", familyId: FAMILY },
    profileDoc(FAMILY, [CHILD]),
  );
  return h;
}

afterEach(() => vi.restoreAllMocks());

describe("GET /api/sync", () => {
  it("returns the stored doc with its etag, the server time and no-store", async () => {
    const h = await seeded();
    const etag = await h.seed(
      { kind: "child", familyId: FAMILY, childId: CHILD },
      childDoc(),
    );
    const response = await h.service.get(
      await request("GET", `?child=${CHILD}`),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await json(response)).toEqual({
      familyId: FAMILY,
      doc: childDoc(),
      etag,
      serverTime: "2026-10-02T03:00:00.000Z",
    });
  });

  it("returns the profile doc, and null while none is stored", async () => {
    const h = harness();
    expect(
      await json(await h.service.get(await request("GET", "?doc=profile"))),
    ).toMatchObject({
      doc: null,
      etag: null,
    });
    await h.seed(
      { kind: "profile", familyId: FAMILY },
      profileDoc(FAMILY, [CHILD]),
    );
    const response = await h.service.get(await request("GET", "?doc=profile"));
    expect((await json(response)).doc).toEqual(profileDoc(FAMILY, [CHILD]));
  });

  it("answers unchanged, without the doc, when known is the current etag", async () => {
    const h = await seeded();
    const etag = await h.seed(
      { kind: "child", familyId: FAMILY, childId: CHILD },
      childDoc(),
    );
    const same = await h.service.get(
      await request("GET", `?child=${CHILD}&known=${etag}`),
    );
    expect(await json(same)).toEqual({
      unchanged: true,
      etag,
      serverTime: "2026-10-02T03:00:00.000Z",
    });
    const stale = await h.service.get(
      await request("GET", `?child=${CHILD}&known=old`),
    );
    expect((await json(stale)).doc).toEqual(childDoc());
  });

  it("returns doc null for a month nothing was stored for, and the month doc when there is one", async () => {
    const h = await seeded();
    const empty = await h.service.get(
      await request("GET", `?child=${CHILD}&month=2026-09`),
    );
    expect(await json(empty)).toMatchObject({ doc: null, etag: null });
    await h.seed(
      { kind: "history", familyId: FAMILY, childId: CHILD, month: "2026-10" },
      historyDoc("2026-10"),
    );
    const found = await h.service.get(
      await request("GET", `?child=${CHILD}&month=2026-10`),
    );
    expect((await json(found)).doc).toEqual(historyDoc("2026-10"));
  });

  it("refuses a month after the current Vietnam month, and a bad query", async () => {
    const h = await seeded();
    // 2026-10-31 20:00 UTC is already 1 November in Vietnam.
    h.setNow("2026-10-31T20:00:00.000Z");
    const get = async (query: string) =>
      (await h.service.get(await request("GET", query))).status;
    expect(await get(`?child=${CHILD}&month=2026-11`)).toBe(200);
    expect(await get(`?child=${CHILD}&month=2026-12`)).toBe(400);
    for (const query of [
      "",
      "?doc=other",
      `?doc=profile&child=${CHILD}`,
      `?child=${CHILD}&doc=profile`,
      "?child=short",
      `?child=${CHILD}&month=2026-13`,
      `?child=${CHILD}&month=../x`,
      `?child=${CHILD}&extra=1`,
      `?child=${CHILD}&child=${CHILD_2}`,
      `?child=${CHILD}&known=a b`,
      "?doc=profile&month=2026-10",
    ]) {
      expect(await get(query), query).toBe(400);
    }
  });

  it("answers 401 without a cookie and for a cookie whose code was removed", async () => {
    const h = await seeded();
    expect(
      (
        await h.service.get(
          await request("GET", "?doc=profile", { cookie: null }),
        )
      ).status,
    ).toBe(401);
    const oldCookie = await cookieFor(OTHER_FAMILY);
    const removed = harness({
      access: gateConfig({ revoked: [OTHER_FAMILY] }),
    });
    expect(
      (
        await removed.service.get(
          await request("GET", "?doc=profile", { cookie: oldCookie }),
        )
      ).status,
    ).toBe(401);
  });

  it("is refused by the proxy decision without a cookie", async () => {
    expect(
      await decideAccess(
        { pathname: "/api/sync", search: "?doc=profile", token: undefined },
        ACCESS,
      ),
    ).toEqual({ kind: "deny" });
  });

  it("never gives one family's child to another family", async () => {
    const h = await seeded();
    await h.seed(
      { kind: "child", familyId: FAMILY, childId: CHILD },
      childDoc(),
    );
    const other = await cookieFor(OTHER_FAMILY);
    const response = await h.service.get(
      await request("GET", `?child=${CHILD}`, { cookie: other }),
    );
    expect(response.status).toBe(403);
    expect(await json(response)).toEqual({ error: "child" });
    const month = await h.service.get(
      await request("GET", `?child=${CHILD}&month=2026-10`, { cookie: other }),
    );
    expect(month.status).toBe(403);
  });

  it("answers 403 for a child the profile doc does not list", async () => {
    const h = await seeded();
    const response = await h.service.get(
      await request("GET", `?child=${STRANGER}`),
    );
    expect(response.status).toBe(403);
    expect(await json(response)).toEqual({ error: "child" });
  });

  it("refuses a request from another site, and allows a same-origin or direct one", async () => {
    const h = await seeded();
    for (const site of ["cross-site", "same-site", "none"]) {
      const response = await h.service.get(
        await request("GET", "?doc=profile", {
          headers: { "sec-fetch-site": site },
        }),
      );
      expect(response.status, site).toBe(403);
      expect(await json(response)).toEqual({ error: "origin" });
    }
    const noHeader = await request("GET", "?doc=profile");
    noHeader.headers.delete("sec-fetch-site");
    expect((await h.service.get(noHeader)).status).toBe(200);
  });

  it("answers 500 stored-invalid for a stored doc that fails the schema", async () => {
    const h = await seeded();
    await h.seed(
      { kind: "child", familyId: FAMILY, childId: CHILD },
      null,
      '{"schema":"x"}',
    );
    const response = await h.service.get(
      await request("GET", `?child=${CHILD}`),
    );
    expect(response.status).toBe(500);
    expect(await json(response)).toEqual({ error: "stored-invalid" });
    await h.seed(
      { kind: "child", familyId: FAMILY, childId: CHILD },
      null,
      "not json",
    );
    expect(
      (await h.service.get(await request("GET", `?child=${CHILD}`))).status,
    ).toBe(500);
  });

  it("answers 503 when sync is not configured, and 404 or 503 for the gate", async () => {
    const noStore = harness({ store: null });
    const response = await noStore.service.get(
      await request("GET", "?doc=profile"),
    );
    expect(response.status).toBe(503);
    expect(await json(response)).toEqual({ error: "sync-unavailable" });

    const open = harness({ access: { mode: "open" } });
    expect(
      (await open.service.get(await request("GET", "?doc=profile"))).status,
    ).toBe(404);
    const closed = harness({ access: { mode: "closed", reason: "x" } });
    expect(
      (await closed.service.get(await request("GET", "?doc=profile"))).status,
    ).toBe(503);
  });

  it("limits a family's reads per minute, with retry-after, and resets after the minute", async () => {
    const h = await seeded();
    for (let i = 0; i < SYNC_GET_LIMIT_PER_MINUTE; i++) {
      expect(
        (await h.service.get(await request("GET", "?doc=profile"))).status,
      ).toBe(200);
    }
    const limited = await h.service.get(await request("GET", "?doc=profile"));
    expect(limited.status).toBe(429);
    expect(Number(limited.headers.get("retry-after"))).toBeGreaterThan(0);
    // Another family is not affected.
    const other = await request("GET", "?doc=profile", {
      cookie: await cookieFor(OTHER_FAMILY),
    });
    expect((await h.service.get(other)).status).toBe(200);
    h.setNow("2026-10-02T03:01:01.000Z");
    expect(
      (await h.service.get(await request("GET", "?doc=profile"))).status,
    ).toBe(200);
  });

  it("logs the route, family, doc kind and status, and never any doc content", async () => {
    const spies = (["log", "info", "warn", "error", "debug"] as const).map(
      (name) => vi.spyOn(console, name).mockImplementation(() => undefined),
    );
    const h = harness({ capture: false });
    const secretName = "Tên-bí-mật-không-được-ghi-log";
    const profile = profileDoc(FAMILY, [CHILD]);
    profile.profiles = profile.profiles.map((p) => ({
      ...p,
      name: secretName,
    }));
    await h.seed({ kind: "profile", familyId: FAMILY }, profile);
    await h.seed(
      { kind: "child", familyId: FAMILY, childId: CHILD },
      null,
      `{"note":"${secretName}"}`,
    );
    await h.service.get(await request("GET", `?child=${CHILD}`));
    await h.service.get(await request("GET", `?child=${STRANGER}`));
    await h.service.get(await request("GET", "?doc=profile", { cookie: null }));
    const lines = spies.flatMap((spy) =>
      spy.mock.calls.map((call) => JSON.stringify(call)),
    );
    expect(lines.length).toBeGreaterThan(0);
    expect(lines.join("\n")).not.toContain(secretName);
    expect(lines[0]).toContain(FAMILY);
  });
});
