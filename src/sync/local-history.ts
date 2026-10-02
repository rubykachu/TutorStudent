import { Dexie } from "dexie";
import { vnDayKey } from "@/lib/time";
import {
  type AttemptRecord,
  localScope,
  type TutorDb,
  type WritingRecord,
} from "@/progress/db";
import { lessonIdOfContentId } from "@/progress/parent-report";
import { visibleHistory } from "@/sync/history";
import {
  emptyHistoryDoc,
  type HistoryDoc,
  monthOfTime,
  type SyncAttempt,
  type SyncWriting,
} from "@/sync/schema";

// Conversion between the local attempts and writings and the history doc of
// one month. Local records stay under the "local" family id.

const MS_PER_DAY = 86_400_000;

// A UTC range wide enough to hold every instant of a Vietnam-time month
// whatever the offset (a day of slack each side), used only to narrow the
// index read; the exact month is checked on each record.
function monthIndexRange(month: string): { from: string; to: string } {
  const [year, mon] = month.split("-").map(Number) as [number, number];
  return {
    from: new Date(Date.UTC(year, mon - 1, 1) - MS_PER_DAY).toISOString(),
    to: new Date(Date.UTC(year, mon, 1) + MS_PER_DAY).toISOString(),
  };
}

export async function readHistoryDoc(
  db: TutorDb,
  childId: string,
  familyId: string,
  month: string,
): Promise<HistoryDoc> {
  const scope = localScope(childId);
  const { from, to } = monthIndexRange(month);
  const range = [scope.familyId, scope.childId] as const;
  const [attempts, writings] = await Promise.all([
    db.attempts
      .where("[familyId+childId+at]")
      .between([...range, from], [...range, to], true, false)
      .toArray(),
    db.writings
      .where("[familyId+childId+at]")
      .between([...range, from], [...range, to], true, false)
      .toArray(),
  ]);
  const doc = emptyHistoryDoc(familyId, childId, month);
  doc.attempts = attempts
    .filter((a) => monthOfTime(a.at) === month)
    .map(
      (a): SyncAttempt => ({
        id: a.id,
        exerciseId: a.exerciseId,
        lessonId: a.lessonId,
        cardIds: a.cardIds,
        firstTryCorrect: a.firstTryCorrect,
        wrongCount: a.wrongCount,
        at: a.at,
        context: a.context,
      }),
    );
  doc.writings = writings
    .filter((w) => monthOfTime(w.at) === month)
    .map(
      (w): SyncWriting => ({
        id: w.id,
        exerciseId: w.exerciseId,
        text: w.text,
        checks: w.checks.map((c) => ({ criterion: c.criterion, met: c.met })),
        at: w.at,
      }),
    );
  return doc;
}

// Every month this child has an attempt or a writing in, oldest first.
export async function localMonths(
  db: TutorDb,
  childId: string,
): Promise<string[]> {
  const scope = localScope(childId);
  const range = [scope.familyId, scope.childId] as const;
  // Index keys only: the records themselves are not read.
  const times = (table: TutorDb["attempts"] | TutorDb["writings"]) =>
    table
      .where("[familyId+childId+at]")
      .between([...range, Dexie.minKey], [...range, Dexie.maxKey])
      .keys();
  const [attempts, writings] = await Promise.all([
    times(db.attempts),
    times(db.writings),
  ]);
  return [
    ...new Set(
      [...attempts, ...writings].map((key) =>
        monthOfTime(String((key as unknown[])[2])),
      ),
    ),
  ].sort();
}

// The previous and the current Vietnam-time month, oldest first: the months a
// routine sync checks (records near a month boundary, a corrected clock).
export function recentMonths(date: Date): string[] {
  const [year, month] = vnDayKey(date).split("-").map(Number) as [
    number,
    number,
  ];
  const previous = month === 1 ? [year - 1, 12] : [year, month - 1];
  const format = (y: number, m: number) =>
    `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}`;
  return [
    format(previous[0] as number, previous[1] as number),
    format(year, month),
  ];
}

// Deletes the child's local attempts and writings of each reset lesson that
// are at or before its reset: a reset made on another device reaches the
// records this device still holds. Later records stay.
export async function eraseHistoryBeforeResets(
  db: TutorDb,
  childId: string,
  resets: Readonly<Record<string, string>>,
): Promise<void> {
  const scope = localScope(childId);
  for (const [lessonId, resetAt] of Object.entries(resets)) {
    await db.attempts
      .where("[familyId+childId+lessonId]")
      .equals([scope.familyId, scope.childId, lessonId])
      .filter((attempt) => attempt.at <= resetAt)
      .delete();
  }
  const writings = await db.writings
    .where("[familyId+childId]")
    .equals([scope.familyId, scope.childId])
    .toArray();
  await db.writings.bulkDelete(
    writings
      .filter((w) => {
        const resetAt = resets[lessonIdOfContentId(w.exerciseId)];
        return resetAt !== undefined && w.at <= resetAt;
      })
      .map((w) => w.id),
  );
}

// Adds the records of a month doc that the reset markers leave visible to
// Dexie. It never deletes a record, and a record the markers hide (an answer
// given before a reset made on any device) is not brought back. `resets` are
// the main doc's; the local markers count too.
export async function applyHistoryDoc(
  db: TutorDb,
  doc: HistoryDoc,
  resets: Readonly<Record<string, string>>,
): Promise<void> {
  const scope = localScope(doc.childId);
  await db.transaction(
    "rw",
    [db.attempts, db.writings, db.lessonResets],
    async () => {
      const markers = await db.lessonResets
        .where("[familyId+childId+lessonId]")
        .between(
          [scope.familyId, scope.childId, ""],
          [scope.familyId, scope.childId, "\uffff"],
        )
        .toArray();
      const allResets: Record<string, string> = { ...resets };
      for (const { lessonId, at } of markers) {
        const known = allResets[lessonId];
        if (known === undefined || at > known) allResets[lessonId] = at;
      }
      const visible = visibleHistory(doc, allResets);

      const haveAttempts = await db.attempts.bulkGet(
        visible.attempts.map((a) => a.id),
      );
      await db.attempts.bulkAdd(
        visible.attempts
          .filter((_, i) => haveAttempts[i] === undefined)
          .map((a): AttemptRecord => ({ ...scope, ...a })),
      );
      const haveWritings = await db.writings.bulkGet(
        visible.writings.map((w) => w.id),
      );
      await db.writings.bulkAdd(
        visible.writings
          .filter((_, i) => haveWritings[i] === undefined)
          .map((w): WritingRecord => ({ ...scope, ...w })),
      );
    },
  );
}
