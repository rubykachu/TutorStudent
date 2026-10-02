import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import {
  awardSticker,
  listOverviewSeenAt,
  localScope,
  markOverviewSeen,
  type ProfileRecord,
  putProfile,
  saveWriting,
  setSetting,
  TutorDb,
} from "@/progress/db";
import {
  completeSection,
  recordAttempt,
  saveSectionPosition,
} from "@/progress/record";
import { resetLessonProgress } from "@/progress/reset";
import { saveOpenEndedWriting } from "@/progress/writing";
import {
  applyChildDoc,
  applyProfileDoc,
  readChildDoc,
  readProfileDoc,
} from "@/sync/local";
import {
  applyHistoryDoc,
  localMonths,
  readHistoryDoc,
} from "@/sync/local-history";
import { mergeChildDocs } from "@/sync/merge";
import {
  emptyChildDoc,
  emptyHistoryDoc,
  emptyProfileDoc,
  migrateDoc,
  stableStringify,
} from "@/sync/schema";
import { CHILD, FAMILY } from "./generators";

const OTHER_CHILD = "a1b2c3d4e5f60718293a4b5c6d7e8f90";
const scope = localScope(CHILD);
const L = "l-one";
const M = "l-two";
const day = (d: number, h = 3) =>
  new Date(
    `2026-10-${String(d).padStart(2, "0")}T${String(h).padStart(2, "0")}:00:00.000Z`,
  );

let a: TutorDb;
let b: TutorDb;

beforeEach(() => {
  a = new TutorDb("tutor-sync-local-a");
  b = new TutorDb("tutor-sync-local-b");
});

afterEach(async () => {
  await a.delete();
  await b.delete();
});

function answer(
  db: TutorDb,
  lessonId: string,
  at: Date,
  context: "practice" | "check" = "practice",
  child = CHILD,
) {
  return recordAttempt(
    db,
    {
      ...localScope(child),
      lessonId,
      exerciseId: `${lessonId}.ex.q`,
      cardIds: context === "practice" ? [`${lessonId}.card.a`] : [],
      firstTryCorrect: true,
      wrongCount: 0,
      context,
    },
    at,
  );
}

const section = (lessonId: string, name = "a") => ({
  lessonId,
  sectionId: `${lessonId}.section.${name}`,
});

// Everything sync owns for one child, as plain sorted data, to compare stores.
async function snapshot(db: TutorDb, childId = CHILD) {
  const s = localScope(childId);
  const own = <T extends { familyId: string; childId: string }>(rows: T[]) =>
    rows.filter((r) => r.familyId === s.familyId && r.childId === s.childId);
  const sorted = <T>(rows: T[]) =>
    [...rows].sort((x, y) =>
      stableStringify(x).localeCompare(stableStringify(y)),
    );
  return {
    cards: sorted(own(await db.cardStates.toArray())),
    sections: sorted(own(await db.sectionProgress.toArray())),
    stickers: sorted(own(await db.stickers.toArray())),
    days: sorted(own(await db.activityDays.toArray())),
    resets: sorted(own(await db.lessonResets.toArray())),
    attempts: sorted(own(await db.attempts.toArray())),
    writings: sorted(own(await db.writings.toArray())),
    overviewSeen: await listOverviewSeenAt(db, s),
  };
}

async function seed(db: TutorDb) {
  await answer(db, L, new Date("2026-09-20T03:00:00Z"));
  await answer(db, L, day(1));
  await answer(db, L, day(1, 4), "check");
  await answer(db, M, day(2));
  await saveSectionPosition(
    db,
    scope,
    section(L),
    { phase: "practice", index: 2 },
    day(2),
  );
  await completeSection(db, scope, section(M), [section(M).sectionId], day(3));
  await saveSectionPosition(
    db,
    scope,
    section(M),
    { phase: "check", index: 1 },
    day(4),
  );
  await saveOpenEndedWriting(
    db,
    scope,
    `${L}.ex.viet`,
    {
      writing: { text: "Bạn em", checks: [{ criterion: "mở bài", met: true }] },
    },
    day(5),
  );
  await saveOpenEndedWriting(
    db,
    scope,
    `${M}.ex.viet`,
    { writing: { text: "Mùa thu", checks: [] } },
    new Date("2026-09-21T03:00:00Z"),
  );
  await markOverviewSeen(db, scope, L, day(1));
  await awardSticker(db, scope, M, day(3));
  await resetLessonProgress(db, scope, "l-three", day(6));
  await answer(db, L, day(7), "practice", OTHER_CHILD);
  await setSetting(db, scope, "soundEnabled", false);
}

async function pullInto(target: TutorDb, source: TutorDb) {
  await applyProfileDoc(target, await readProfileDoc(source, FAMILY));
  const main = await readChildDoc(source, CHILD, FAMILY);
  await applyChildDoc(target, main);
  for (const month of await localMonths(source, CHILD)) {
    await applyHistoryDoc(
      target,
      await readHistoryDoc(source, CHILD, FAMILY, month),
      main.resets,
    );
  }
}

describe("round trip", () => {
  it("Dexie records to a main doc and month docs to an empty Dexie give the same records", async () => {
    await seed(a);
    await pullInto(b, a);
    const copy = await snapshot(b);
    const original = await snapshot(a);
    expect(copy).toEqual(original);
    // Substantial: every kind of record was really copied.
    expect(original.cards.length).toBeGreaterThan(1);
    expect(original.sections).toHaveLength(2);
    expect(original.attempts).toHaveLength(4);
    expect(original.writings).toHaveLength(2);
    expect(original.resets).toHaveLength(1);
    expect(copy.sections.map((s) => s.state).sort()).toEqual([
      "done",
      "in_progress",
    ]);
  });

  it("does not take the sound switch or the other child's records", async () => {
    await seed(a);
    await pullInto(b, a);
    expect(await b.settings.toArray()).toEqual([
      expect.objectContaining({ key: `overviewSeen:${L}` }),
    ]);
    expect((await snapshot(b, OTHER_CHILD)).attempts).toEqual([]);
  });

  it("builds docs that pass the schema, and applying the same docs twice changes nothing", async () => {
    await seed(a);
    const main = await readChildDoc(a, CHILD, FAMILY);
    expect(migrateDoc("child", main)).toEqual({ ok: true, doc: main });
    const history = await readHistoryDoc(a, CHILD, FAMILY, "2026-10");
    expect(migrateDoc("history", history)).toEqual({ ok: true, doc: history });
    expect(migrateDoc("profile", await readProfileDoc(a, FAMILY)).ok).toBe(
      true,
    );

    await pullInto(b, a);
    const once = await snapshot(b);
    await pullInto(b, a);
    expect(await snapshot(b)).toEqual(once);
  });

  it("lists months it learned of from the cloud and months it holds records in", async () => {
    await answer(a, L, day(1));
    await a.syncState.put({
      ...scope,
      syncedHash: null,
      etag: null,
      lastSyncAt: null,
      lastError: null,
      docBytes: null,
      months: {
        "2026-07": { hash: null, parts: {}, etag: null, applied: false },
      },
    });
    expect((await readChildDoc(a, CHILD, FAMILY)).historyMonths).toEqual([
      "2026-07",
      "2026-10",
    ]);
  });

  it("sets a section's state from doneAt", async () => {
    const doc = {
      ...emptyChildDoc(FAMILY, CHILD),
      sections: [
        { ...doneRecord(L, "a"), doneAt: day(2).toISOString() },
        { ...doneRecord(L, "b"), doneAt: null },
      ],
    };
    await applyChildDoc(b, doc);
    const states = Object.fromEntries(
      (await b.sectionProgress.toArray()).map((s) => [
        s.sectionId,
        [s.state, s.doneAt],
      ]),
    );
    expect(states).toEqual({
      [`${L}.section.a`]: ["done", day(2).toISOString()],
      [`${L}.section.b`]: ["in_progress", null],
    });
  });
});

function doneRecord(lessonId: string, name: string) {
  return {
    sectionId: `${lessonId}.section.${name}`,
    lessonId,
    doneAt: null as string | null,
    position: { phase: "check" as const, index: 1 },
    updatedAt: day(2).toISOString(),
  };
}

describe("apply-back", () => {
  it("never deletes a local attempt that no reset drops", async () => {
    await answer(b, L, day(1), "check");
    await answer(b, M, day(2), "check");
    await saveOpenEndedWriting(
      b,
      scope,
      `${L}.ex.viet`,
      { writing: { text: "x", checks: [] } },
      day(2),
    );
    const before = await snapshot(b);

    // A doc with none of those records, and a main doc with no resets.
    const month = emptyHistoryDoc(FAMILY, CHILD, "2026-10");
    month.attempts.push({
      id: "from-cloud",
      exerciseId: `${L}.ex.q`,
      lessonId: L,
      cardIds: [],
      firstTryCorrect: false,
      wrongCount: 1,
      at: day(3).toISOString(),
      context: "check",
    });
    await applyHistoryDoc(b, month, {});
    await applyChildDoc(b, emptyChildDoc(FAMILY, CHILD));

    const after = await snapshot(b);
    expect(after.attempts).toHaveLength(before.attempts.length + 1);
    for (const record of before.attempts)
      expect(after.attempts).toContainEqual(record);
    expect(after.writings).toEqual(before.writings);
  });

  it("keeps a record already present when the month doc holds the same id", async () => {
    await answer(b, L, day(1), "check");
    const month = await readHistoryDoc(b, CHILD, FAMILY, "2026-10");
    await applyHistoryDoc(b, month, {});
    expect(await b.attempts.count()).toBe(1);
  });

  it("applying a reset removes the lesson's older local records and keeps the sticker and other lessons", async () => {
    // Device B studied lessons L and M; device A reset L later.
    await answer(b, L, day(1));
    await answer(b, L, day(1, 4), "check");
    await answer(b, M, day(1, 5));
    await completeSection(b, scope, section(L), [section(L).sectionId], day(2));
    await completeSection(b, scope, section(M), [section(M).sectionId], day(2));
    await markOverviewSeen(b, scope, L, day(1));
    await markOverviewSeen(b, scope, M, day(1));
    await awardSticker(b, scope, L, day(2));
    await saveOpenEndedWriting(
      b,
      scope,
      `${L}.ex.viet`,
      { writing: { text: "x", checks: [] } },
      day(2),
    );
    await saveOpenEndedWriting(
      b,
      scope,
      `${M}.ex.viet`,
      { writing: { text: "y", checks: [] } },
      day(2),
    );
    // Studied L again after the reset moment, before syncing.
    await answer(b, L, day(9));
    await saveSectionPosition(
      b,
      scope,
      section(L, "b"),
      { phase: "check", index: 1 },
      day(9),
    );

    const fromA = {
      ...emptyChildDoc(FAMILY, CHILD),
      resets: { [L]: day(5).toISOString() },
    };
    await applyChildDoc(b, fromA);

    const after = await snapshot(b);
    expect(after.attempts.map((x) => [x.lessonId, x.at]).sort()).toEqual(
      [
        [M, day(1, 5).toISOString()],
        [L, day(9).toISOString()],
      ].sort(),
    );
    expect(after.writings.map((w) => w.exerciseId)).toEqual([`${M}.ex.viet`]);
    expect(after.cards.map((c) => c.lessonId).sort()).toEqual([L, M]);
    expect(after.cards.find((c) => c.lessonId === L)?.lastReviewAt).toBe(
      day(9).toISOString(),
    );
    expect(after.sections.map((s) => [s.sectionId, s.state]).sort()).toEqual(
      [
        [`${L}.section.b`, "in_progress"],
        [`${M}.section.a`, "done"],
      ].sort(),
    );
    expect(Object.keys(after.overviewSeen)).toEqual([M]);
    expect(after.stickers.map((s) => s.lessonId).sort()).toEqual([L, M]);
    expect(after.resets).toEqual([
      { ...scope, lessonId: L, at: day(5).toISOString() },
    ]);
  });

  it("applying an old month after a reset does not bring the lesson's earlier answers back", async () => {
    await applyChildDoc(b, {
      ...emptyChildDoc(FAMILY, CHILD),
      resets: { [L]: day(5).toISOString() },
    });
    const old = await readHistoryDoc(a, CHILD, FAMILY, "2026-10");
    old.attempts.push(
      attemptOf("before", L, day(4)),
      attemptOf("same", L, day(5)),
      attemptOf("after", L, day(6)),
      attemptOf("other", M, day(1)),
    );
    old.writings.push({
      id: "w-before",
      exerciseId: `${L}.ex.viet`,
      text: "x",
      checks: [],
      at: day(4).toISOString(),
    });

    // Neither the passed resets nor the local marker alone is needed: both count.
    await applyHistoryDoc(b, old, {});
    expect((await b.attempts.toArray()).map((x) => x.id).sort()).toEqual([
      "after",
      "other",
    ]);
    expect(await b.writings.count()).toBe(0);

    const c = new TutorDb("tutor-sync-local-c");
    try {
      await applyHistoryDoc(c, old, { [L]: day(5).toISOString() });
      expect((await c.attempts.toArray()).map((x) => x.id).sort()).toEqual([
        "after",
        "other",
      ]);
    } finally {
      await c.delete();
    }
  });

  it("an answer recorded between reading the doc and applying the merge is still there", async () => {
    await answer(b, L, day(1));
    await saveSectionPosition(
      b,
      scope,
      section(L),
      { phase: "check", index: 1 },
      day(1),
    );

    // The engine reads local, merges with the cloud copy ...
    const cloud = emptyChildDoc(FAMILY, CHILD);
    cloud.cards.push({
      cardId: `${M}.card.a`,
      lessonId: M,
      due: day(10).toISOString(),
      stability: 2,
      difficulty: 5,
      scheduledDays: 1,
      learningSteps: 0,
      reps: 1,
      lapses: 0,
      state: 2,
      lastReviewAt: day(1).toISOString(),
    });
    cloud.sections.push({
      ...doneRecord(M, "a"),
      doneAt: day(1).toISOString(),
      position: { phase: "blocks", index: 0 },
      updatedAt: day(1).toISOString(),
    });
    const merged = mergeChildDocs(await readChildDoc(b, CHILD, FAMILY), cloud);

    // ... and while the request is in flight the child answers and moves on.
    await answer(b, L, day(2));
    await saveSectionPosition(
      b,
      scope,
      section(L),
      { phase: "practice", index: 3 },
      day(2),
    );
    await completeSection(
      b,
      scope,
      section(M, "b"),
      [section(M, "b").sectionId],
      day(2),
    );

    await applyChildDoc(b, merged);

    const after = await snapshot(b);
    const cardL = after.cards.find((c) => c.cardId === `${L}.card.a`);
    expect(cardL?.lastReviewAt).toBe(day(2).toISOString());
    expect(cardL?.reps).toBe(2);
    const sectionL = after.sections.find(
      (s) => s.sectionId === `${L}.section.a`,
    );
    expect(sectionL?.position).toEqual({ phase: "practice", index: 3 });
    expect(sectionL?.updatedAt).toBe(day(2).toISOString());
    // What the cloud brought is there as well.
    expect(after.cards.map((c) => c.cardId).sort()).toEqual([
      `${L}.card.a`,
      `${M}.card.a`,
    ]);
    expect(after.sections.map((s) => [s.sectionId, s.state]).sort()).toEqual(
      [
        [`${L}.section.a`, "in_progress"],
        [`${M}.section.a`, "done"],
        [`${M}.section.b`, "done"],
      ].sort(),
    );
  });

  it("leaves another child's records alone", async () => {
    await answer(b, L, day(1), "practice", OTHER_CHILD);
    const before = await snapshot(b, OTHER_CHILD);
    await applyChildDoc(b, {
      ...emptyChildDoc(FAMILY, CHILD),
      resets: { [L]: day(9).toISOString() },
    });
    expect(await snapshot(b, OTHER_CHILD)).toEqual(before);
  });
});

function attemptOf(id: string, lessonId: string, at: Date) {
  return {
    id,
    exerciseId: `${lessonId}.ex.q`,
    lessonId,
    cardIds: [],
    firstTryCorrect: true,
    wrongCount: 0,
    at: at.toISOString(),
    context: "check" as const,
  };
}

describe("profiles", () => {
  const profile = (
    id: string,
    name: string,
    updatedAt: string,
  ): ProfileRecord => ({
    id,
    familyId: LOCAL_FAMILY_ID,
    name,
    avatar: "fox",
    grade: 6,
    series: { math: "kntt" },
    createdAt: day(1).toISOString(),
    updatedAt,
  });
  const ID_1 = "1".repeat(32);
  const ID_2 = "2".repeat(32);

  it("reads local profiles into a doc with the real family id", async () => {
    await putProfile(a, profile(ID_1, "Na", day(1).toISOString()));
    const doc = await readProfileDoc(a, FAMILY);
    expect(doc.familyId).toBe(FAMILY);
    expect(doc.profiles).toEqual([
      expect.objectContaining({
        id: ID_1,
        name: "Na",
        updatedAt: day(1).toISOString(),
      }),
    ]);
    expect(Object.keys(doc.profiles[0] ?? {})).not.toContain("familyId");
    expect(migrateDoc("profile", doc).ok).toBe(true);
  });

  it("merges the family's profiles into the local ones and deletes none", async () => {
    await putProfile(b, profile(ID_1, "Na", day(1).toISOString()));
    await putProfile(b, profile(ID_2, "Local only", day(1).toISOString()));
    const { familyId: _local, ...cloudProfile } = profile(
      ID_1,
      "Na Na",
      day(3).toISOString(),
    );
    await applyProfileDoc(b, {
      ...emptyProfileDoc(FAMILY),
      profiles: [cloudProfile],
    });
    const stored = await b.profiles.toArray();
    expect(stored.map((p) => [p.id, p.name, p.familyId]).sort()).toEqual(
      [
        [ID_1, "Na Na", LOCAL_FAMILY_ID],
        [ID_2, "Local only", LOCAL_FAMILY_ID],
      ].sort(),
    );
  });

  it("keeps the local copy when it is the later one", async () => {
    await putProfile(b, profile(ID_1, "Newer", day(5).toISOString()));
    const { familyId: _local, ...older } = profile(
      ID_1,
      "Older",
      day(2).toISOString(),
    );
    await applyProfileDoc(b, { ...emptyProfileDoc(FAMILY), profiles: [older] });
    expect((await b.profiles.get(ID_1))?.name).toBe("Newer");
  });
});

describe("history reading", () => {
  it("a writing saved directly is read back in its month", async () => {
    await saveWriting(a, {
      ...scope,
      id: "w-1",
      exerciseId: `${L}.ex.viet`,
      text: "hi",
      checks: [],
      at: day(2).toISOString(),
    });
    expect(
      (await readHistoryDoc(a, CHILD, FAMILY, "2026-10")).writings,
    ).toHaveLength(1);
  });
});
