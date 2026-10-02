import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";
import { localScope, TutorDb } from "@/progress/db";
import { recordAttempt } from "@/progress/record";
import { saveOpenEndedWriting } from "@/progress/writing";
import {
  localMonths,
  readHistoryDoc,
  recentMonths,
} from "@/sync/local-history";
import { migrateDoc } from "@/sync/schema";
import { CHILD, FAMILY } from "./generators";

const scope = localScope(CHILD);
let db: TutorDb;

afterEach(async () => {
  await db.delete();
});

async function answerAt(time: string, exerciseId = "l-one.ex.q") {
  await recordAttempt(
    db,
    {
      ...scope,
      lessonId: "l-one",
      exerciseId,
      cardIds: [],
      firstTryCorrect: true,
      wrongCount: 0,
      context: "check",
    },
    new Date(time),
  );
}

describe("readHistoryDoc", () => {
  it("puts a record in the month it has in Vietnam time, at the boundaries", async () => {
    db = new TutorDb("tutor-local-history-test");
    // 16:59 UTC on 30 September is 23:59 in Vietnam; 17:00 is 1 October.
    await answerAt("2026-09-30T16:59:59.999Z");
    await answerAt("2026-09-30T17:00:00.000Z");
    await answerAt("2026-10-31T16:59:59.999Z");
    await answerAt("2026-10-31T17:00:00.000Z");

    const september = await readHistoryDoc(db, CHILD, FAMILY, "2026-09");
    const october = await readHistoryDoc(db, CHILD, FAMILY, "2026-10");
    const november = await readHistoryDoc(db, CHILD, FAMILY, "2026-11");
    expect(september.attempts.map((a) => a.at)).toEqual([
      "2026-09-30T16:59:59.999Z",
    ]);
    expect(october.attempts.map((a) => a.at).sort()).toEqual([
      "2026-09-30T17:00:00.000Z",
      "2026-10-31T16:59:59.999Z",
    ]);
    expect(november.attempts.map((a) => a.at)).toEqual([
      "2026-10-31T17:00:00.000Z",
    ]);
  });

  it("reads one child's attempts and writings, as a doc that passes the schema", async () => {
    db = new TutorDb("tutor-local-history-test");
    await answerAt("2026-10-02T03:00:00.000Z");
    await saveOpenEndedWriting(
      db,
      scope,
      "l-one.ex.viet",
      {
        writing: {
          text: "Bạn em",
          checks: [{ criterion: "mở bài", met: true }],
        },
      },
      new Date("2026-10-02T03:05:00.000Z"),
    );
    await recordAttempt(
      db,
      {
        ...localScope("f".repeat(32)),
        lessonId: "l-one",
        exerciseId: "l-one.ex.q",
        cardIds: [],
        firstTryCorrect: true,
        wrongCount: 0,
        context: "check",
      },
      new Date("2026-10-02T03:00:00.000Z"),
    );

    const doc = await readHistoryDoc(db, CHILD, FAMILY, "2026-10");
    expect(doc.attempts).toHaveLength(1);
    expect(doc.writings).toHaveLength(1);
    expect(migrateDoc("history", doc)).toEqual({ ok: true, doc });
    expect(Object.keys(doc.attempts[0] ?? {}).sort()).toEqual(
      [
        "id",
        "exerciseId",
        "lessonId",
        "cardIds",
        "firstTryCorrect",
        "wrongCount",
        "at",
        "context",
      ].sort(),
    );
  });

  it("is an empty doc for a month with no records", async () => {
    db = new TutorDb("tutor-local-history-test");
    expect(await readHistoryDoc(db, CHILD, FAMILY, "2026-10")).toMatchObject({
      attempts: [],
      writings: [],
      month: "2026-10",
    });
  });
});

describe("localMonths", () => {
  it("lists the months of attempts and writings, oldest first, once each", async () => {
    db = new TutorDb("tutor-local-history-test");
    await answerAt("2026-10-02T03:00:00.000Z");
    await answerAt("2026-09-02T03:00:00.000Z");
    await answerAt("2026-10-03T03:00:00.000Z");
    await saveOpenEndedWriting(
      db,
      scope,
      "l-one.ex.viet",
      { writing: { text: "x", checks: [] } },
      new Date("2026-08-31T20:00:00.000Z"),
    );
    expect(await localMonths(db, CHILD)).toEqual(["2026-09", "2026-10"]);
    expect(await localMonths(db, "f".repeat(32))).toEqual([]);
  });
});

describe("recentMonths", () => {
  it("is the previous and the current Vietnam month, oldest first", () => {
    expect(recentMonths(new Date("2026-10-15T03:00:00Z"))).toEqual([
      "2026-09",
      "2026-10",
    ]);
  });

  it("wraps over the new year and follows Vietnam time at the month end", () => {
    expect(recentMonths(new Date("2027-01-10T03:00:00Z"))).toEqual([
      "2026-12",
      "2027-01",
    ]);
    // 17:00 UTC on 30 Sep is already October in Vietnam.
    expect(recentMonths(new Date("2026-09-30T17:00:00Z"))).toEqual([
      "2026-09",
      "2026-10",
    ]);
  });
});
