import { vnDayKey } from "@/lib/time";
import { localScope, type TutorDb } from "@/progress/db";
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
  const key = [scope.familyId, scope.childId];
  const [attempts, writings] = await Promise.all([
    db.attempts.where("[familyId+childId]").equals(key).toArray(),
    db.writings.where("[familyId+childId]").equals(key).toArray(),
  ]);
  return [
    ...new Set([...attempts, ...writings].map((r) => monthOfTime(r.at))),
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
