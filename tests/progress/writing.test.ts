import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import { type ChildScope, listWritings, TutorDb } from "@/progress/db";
import { saveOpenEndedWriting } from "@/progress/writing";

const scope: ChildScope = { familyId: LOCAL_FAMILY_ID, childId: "kid-1" };
const EXERCISE = "fixture.ex.viet-ve-ban";
const AT = new Date("2026-03-02T01:00:00Z");

let db: TutorDb;

beforeEach(() => {
  db = new TutorDb();
});

afterEach(async () => {
  await db.delete();
});

describe("saveOpenEndedWriting", () => {
  it("stores the writing and ticks under the child and returns the record", async () => {
    const checks = [
      { criterion: "Kể được việc em đã làm.", met: true },
      { criterion: "Viết từ hai câu trở lên.", met: false },
    ];
    const saved = await saveOpenEndedWriting(
      db,
      scope,
      EXERCISE,
      {
        writing: { text: "Có một lần, em đã giúp bạn học bài.", checks },
      },
      AT,
    );
    expect(saved).toMatchObject({
      ...scope,
      exerciseId: EXERCISE,
      text: "Có một lần, em đã giúp bạn học bài.",
      checks,
      at: AT.toISOString(),
    });
    expect(saved.id).toMatch(/^[0-9a-f]{32}$/);
    expect(await listWritings(db, scope)).toEqual([saved]);
  });

  it("keeps every submission of the same exercise", async () => {
    const result = { writing: { text: "Lần đầu.", checks: [] } };
    await saveOpenEndedWriting(db, scope, EXERCISE, result, AT);
    await saveOpenEndedWriting(
      db,
      scope,
      EXERCISE,
      { writing: { text: "Lần hai.", checks: [] } },
      new Date(AT.getTime() + 60_000),
    );
    const texts = (await listWritings(db, scope)).map((w) => w.text);
    expect(texts).toEqual(["Lần đầu.", "Lần hai."]);
  });
});
