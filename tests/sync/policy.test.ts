import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";
import { TutorDb } from "@/progress/db";
import { SYNC_POLICY } from "@/sync/policy";

describe("sync policy", () => {
  let db: TutorDb;
  afterEach(async () => {
    await db.delete();
  });

  it("classifies every table of the schema, and nothing else", async () => {
    db = new TutorDb("tutor-policy-test");
    await db.open();
    expect(Object.keys(SYNC_POLICY).sort()).toEqual(
      db.tables.map((t) => t.name).sort(),
    );
  });

  it("keeps only the sync bookkeeping on the device", () => {
    const local = Object.entries(SYNC_POLICY)
      .filter(([, policy]) => policy.kind === "local-only")
      .map(([name]) => name);
    expect(local).toEqual(["syncState"]);
  });
});
