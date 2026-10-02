// @vitest-environment node
import { describe, expect, it } from "vitest";
import type { ChildDoc } from "@/sync/schema";
import { createSyncService } from "@/sync/server";
import { syncKey } from "@/sync/store/keys";
import { createMemoryStore } from "@/sync/store/memory";
import type { BlobStore } from "@/sync/store/types";
import {
  ACCESS,
  attempt,
  CHILD,
  childDoc,
  FAMILY,
  harness,
  historyDoc,
  PREFIX,
  profileDoc,
  request,
} from "./sync-helpers";

const CHILD_KEY = { kind: "child", familyId: FAMILY, childId: CHILD } as const;
const PROFILE_KEY = { kind: "profile", familyId: FAMILY } as const;
const snapshotKey = (day: string) =>
  syncKey(PREFIX, { kind: "snapshot", familyId: FAMILY, childId: CHILD, day });

function stickerDoc(...lessons: string[]): ChildDoc {
  return {
    ...childDoc(),
    stickers: lessons.map((lessonId) => ({
      lessonId,
      at: "2026-10-01T02:00:00.000Z",
    })),
  };
}

async function snapshotOf(store: BlobStore, day: string) {
  const found = await store.get(snapshotKey(day));
  return found && "body" in found ? JSON.parse(found.body) : null;
}

async function putChild(
  h: ReturnType<typeof harness>,
  doc: ChildDoc,
  condition: { ifMatch: string } | { ifNoneMatch: "*" },
) {
  const response = await h.service.put(
    await request("PUT", `?child=${CHILD}`, { body: { doc, ...condition } }),
  );
  expect(response.status).toBe(200);
  return ((await response.json()) as { etag: string }).etag;
}

describe("daily snapshot of the main doc", () => {
  it("keeps the state before the day's first write and leaves it alone for later writes", async () => {
    const h = harness();
    await h.seed(PROFILE_KEY, profileDoc(FAMILY, [CHILD]));
    const e0 = await h.seed(CHILD_KEY, stickerDoc("l-zero"));

    const e1 = await putChild(h, stickerDoc("l-zero", "l-one"), {
      ifMatch: e0,
    });
    expect(await snapshotOf(h.store, "2026-10-02")).toEqual(
      stickerDoc("l-zero"),
    );

    await putChild(h, stickerDoc("l-zero", "l-one", "l-two"), { ifMatch: e1 });
    expect(await snapshotOf(h.store, "2026-10-02")).toEqual(
      stickerDoc("l-zero"),
    );
  });

  it("starts a new snapshot after midnight in Vietnam, from the server clock", async () => {
    const h = harness({ start: "2026-10-02T16:59:00.000Z" });
    await h.seed(PROFILE_KEY, profileDoc(FAMILY, [CHILD]));
    const e0 = await h.seed(CHILD_KEY, stickerDoc("l-zero"));

    // 23:59 on 2 October in Vietnam.
    const e1 = await putChild(h, stickerDoc("l-zero", "l-one"), {
      ifMatch: e0,
    });
    expect(await snapshotOf(h.store, "2026-10-02")).toEqual(
      stickerDoc("l-zero"),
    );
    expect(await snapshotOf(h.store, "2026-10-03")).toBeNull();

    // 00:01 on 3 October in Vietnam, still 2 October in UTC.
    h.setNow("2026-10-02T17:01:00.000Z");
    await putChild(h, stickerDoc("l-zero", "l-one", "l-two"), { ifMatch: e1 });
    // Stored docs are in canonical order (stickers by lesson id).
    expect(await snapshotOf(h.store, "2026-10-03")).toEqual(
      stickerDoc("l-one", "l-zero"),
    );
    expect(await snapshotOf(h.store, "2026-10-02")).toEqual(
      stickerDoc("l-zero"),
    );
  });

  it("never snapshots on a history or profile write", async () => {
    const h = harness();
    await h.seed(PROFILE_KEY, profileDoc(FAMILY, [CHILD]));
    const month = historyDoc();
    const e0 = await h.seed(
      { kind: "history", familyId: FAMILY, childId: CHILD, month: "2026-10" },
      month,
    );
    const grown = {
      ...month,
      attempts: [attempt("a".repeat(32), "2026-10-01T02:00:00.000Z")],
    };
    const put = await h.service.put(
      await request("PUT", `?child=${CHILD}&month=2026-10`, {
        body: { doc: grown, ifMatch: e0 },
      }),
    );
    expect(put.status).toBe(200);
    const profile = await h.store.get(syncKey(PREFIX, PROFILE_KEY));
    const etag = (profile as { etag: string }).etag;
    const second = await h.service.put(
      await request("PUT", "?doc=profile", {
        body: { doc: profileDoc(FAMILY, [CHILD]), ifMatch: etag },
      }),
    );
    expect(second.status).toBe(200);
    expect(await snapshotOf(h.store, "2026-10-02")).toBeNull();
  });

  it("makes none for a doc created today, since there was no earlier state", async () => {
    const h = harness();
    await h.seed(PROFILE_KEY, profileDoc(FAMILY, [CHILD]));
    const e1 = await putChild(h, stickerDoc("l-one"), { ifNoneMatch: "*" });
    expect(await snapshotOf(h.store, "2026-10-02")).toBeNull();
    await putChild(h, stickerDoc("l-one", "l-two"), { ifMatch: e1 });
    expect(await snapshotOf(h.store, "2026-10-02")).toBeNull();
  });

  it("still answers 200 when the snapshot cannot be written, and logs it without content", async () => {
    const inner = createMemoryStore();
    const failing: BlobStore = {
      ...inner,
      put: async (key, body, options) => {
        if (key.includes("/snapshots/")) throw new Error("store is down");
        return inner.put(key, body, options);
      },
    };
    const h = harness({ store: failing });
    await h.seed(PROFILE_KEY, profileDoc(FAMILY, [CHILD]));
    const e0 = await h.seed(CHILD_KEY, stickerDoc("l-zero"));
    await putChild(h, stickerDoc("l-zero", "l-one"), { ifMatch: e0 });
    expect(h.logs).toEqual([
      {
        route: "PUT",
        familyId: FAMILY,
        doc: "child",
        status: 200,
        bytes: null,
        event: "snapshot-failed",
      },
    ]);
    const stored = (await h.stored(CHILD_KEY))?.doc as ChildDoc | undefined;
    expect(stored?.stickers).toHaveLength(2);
  });

  it("keeps the first snapshot of the day when another server instance made it", async () => {
    const store = createMemoryStore();
    const first = harness({ store });
    await first.seed(PROFILE_KEY, profileDoc(FAMILY, [CHILD]));
    const e0 = await first.seed(CHILD_KEY, stickerDoc("l-zero"));
    const e1 = await putChild(first, stickerDoc("l-zero", "l-one"), {
      ifMatch: e0,
    });

    // A second instance (empty memory) writes the same day.
    const second = createSyncService({
      store,
      prefix: PREFIX,
      readAccess: () => ACCESS,
      now: () => new Date("2026-10-02T05:00:00.000Z"),
    });
    const response = await second.put(
      await request("PUT", `?child=${CHILD}`, {
        body: { doc: stickerDoc("l-zero", "l-one", "l-two"), ifMatch: e1 },
      }),
    );
    expect(response.status).toBe(200);
    expect(await snapshotOf(store, "2026-10-02")).toEqual(stickerDoc("l-zero"));
  });

  it("does not snapshot a write that is refused", async () => {
    const h = harness();
    await h.seed(PROFILE_KEY, profileDoc(FAMILY, [CHILD]));
    await h.seed(CHILD_KEY, stickerDoc("l-zero"));
    const stale = await h.service.put(
      await request("PUT", `?child=${CHILD}`, {
        body: { doc: stickerDoc("l-one"), ifMatch: "stale" },
      }),
    );
    expect(stale.status).toBe(412);
    expect(await snapshotOf(h.store, "2026-10-02")).toBeNull();
  });
});
