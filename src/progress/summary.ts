import { SUBJECT_NUDGE_AFTER_DAYS } from "@/lib/config";
import { vnDayKey } from "@/lib/time";
import type {
  AttemptRecord,
  SectionProgressRecord,
  SectionState,
  StickerRecord,
} from "@/progress/db";
import type { ContentIndex, LessonSummary } from "@/schema/content";

// Pure summaries of a child's progress for the home and subject screens.

const MS_PER_DAY = 86_400_000;

function dayNumber(dayKey: string): number {
  return Date.parse(`${dayKey}T00:00:00Z`) / MS_PER_DAY;
}

// Counted in Vietnam calendar days, so studying at 23:00 and checking at
// 01:00 the next morning is one day apart, not zero.
export function vnDaysBetween(earlier: Date, later: Date): number {
  return dayNumber(vnDayKey(later)) - dayNumber(vnDayKey(earlier));
}

// Days to show in the "not studied for n days" nudge, or null when the subject
// was studied recently or never (a new subject is not something to catch up on).
export function subjectNudgeDays(
  lastStudiedAt: Date | undefined,
  now: Date,
): number | null {
  if (!lastStudiedAt) return null;
  const days = vnDaysBetween(lastStudiedAt, now);
  return days > SUBJECT_NUDGE_AFTER_DAYS ? days : null;
}

// Both answering an exercise and moving through a section's explanation
// count as studying the lesson's subject.
export function lastStudiedBySubject(
  lessons: readonly Pick<LessonSummary, "id" | "subject">[],
  attempts: readonly Pick<AttemptRecord, "lessonId" | "at">[],
  sections: readonly Pick<SectionProgressRecord, "lessonId" | "updatedAt">[],
): Map<string, Date> {
  const subjectOf = new Map(lessons.map((l) => [l.id, l.subject]));
  const latest = new Map<string, Date>();
  const events = [
    ...attempts.map((a) => ({ lessonId: a.lessonId, at: a.at })),
    ...sections.map((s) => ({ lessonId: s.lessonId, at: s.updatedAt })),
  ];
  for (const { lessonId, at } of events) {
    // Progress on a lesson that is no longer served says nothing about a subject.
    const subject = subjectOf.get(lessonId);
    if (!subject) continue;
    const date = new Date(at);
    const current = latest.get(subject);
    if (!current || date > current) latest.set(subject, date);
  }
  return latest;
}

// Lessons a child sees for a subject: those of the series chosen in the
// profile (the subject's default when unset), in textbook order.
export function lessonsForSubject(
  index: ContentIndex,
  subjectId: string,
  series: string | undefined,
): LessonSummary[] {
  const subject = index.subjects.find((s) => s.id === subjectId);
  const chosen = series ?? subject?.defaultSeries;
  return index.lessons
    .filter((l) => l.subject === subjectId && l.series === chosen)
    .sort((a, b) => a.order - b.order);
}

// A sticker means every section was finished, even if section records were
// later lost, so it wins over the per-section states.
export function lessonState(
  lesson: Pick<LessonSummary, "id" | "sections">,
  sections: readonly Pick<SectionProgressRecord, "sectionId" | "state">[],
  stickerLessonIds: ReadonlySet<string>,
): SectionState {
  if (stickerLessonIds.has(lesson.id)) return "done";
  const stateOf = new Map(sections.map((s) => [s.sectionId, s.state]));
  const states = lesson.sections.map((s) => stateOf.get(s.id) ?? "not_started");
  if (states.length > 0 && states.every((s) => s === "done")) return "done";
  return states.some((s) => s !== "not_started")
    ? "in_progress"
    : "not_started";
}

export type SubjectProgress = { done: number; total: number };

// Lessons with a sticker out of the lessons the child can see.
export function subjectProgress(
  lessons: readonly Pick<LessonSummary, "id">[],
  stickers: readonly Pick<StickerRecord, "lessonId">[],
): SubjectProgress {
  const earned = new Set(stickers.map((s) => s.lessonId));
  return {
    done: lessons.filter((l) => earned.has(l.id)).length,
    total: lessons.length,
  };
}
