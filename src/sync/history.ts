import { lessonIdOfContentId } from "@/progress/parent-report";
import type { HistoryDoc } from "@/sync/schema";

// What a month's history shows once the reset tombstones of the main doc are
// applied: the attempts and writings of a reset lesson at or before its reset
// are hidden, later ones stay. A writing's lesson is the one its exercise id
// starts with. The stored doc is never changed; every reader (apply-back to
// Dexie, the parent report, the import summary) goes through this.
export function visibleHistory(
  doc: HistoryDoc,
  resets: Readonly<Record<string, string>>,
): HistoryDoc {
  const visible = (lessonId: string, at: string): boolean => {
    const resetAt = resets[lessonId];
    return resetAt === undefined || at > resetAt;
  };
  return {
    ...doc,
    attempts: doc.attempts.filter((a) => visible(a.lessonId, a.at)),
    writings: doc.writings.filter((w) =>
      visible(lessonIdOfContentId(w.exerciseId), w.at),
    ),
  };
}
