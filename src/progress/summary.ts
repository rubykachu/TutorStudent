import { type Learner, seriesForGrade } from "@/content/grades";
import {
  MASCOT_WELCOME_AFTER_DAYS,
  SUBJECT_NUDGE_AFTER_DAYS,
} from "@/lib/config";
import { dayNumber, vnDayKey } from "@/lib/time";
import type { MascotExpression } from "@/mascot/expressions";
import type {
  AttemptRecord,
  SectionProgressRecord,
  SectionState,
} from "@/progress/db";
import type { ContentIndex, LessonSummary } from "@/schema/content";

// Pure summaries of a child's progress for the home and subject screens.

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

// Lessons a child sees for a subject: those of the series they study in
// their grade (see `seriesForGrade`), in textbook order. None when the
// subject has no series for the grade.
export function lessonsForSubject(
  index: ContentIndex,
  subjectId: string,
  learner: Learner,
): LessonSummary[] {
  const subject = index.subjects.find((s) => s.id === subjectId);
  const chosen =
    subject &&
    seriesForGrade(subject, learner.grade, learner.series[subjectId]);
  if (!chosen) return [];
  return index.lessons
    .filter((l) => l.subject === subjectId && l.series === chosen)
    .sort((a, b) => a.order - b.order);
}

// Only the section records decide: a sticker is a title the child keeps, and
// stays after the lesson's progress is reset to relearn it.
export function lessonState(
  lesson: Pick<LessonSummary, "sections">,
  sections: readonly Pick<SectionProgressRecord, "sectionId" | "state">[],
): SectionState {
  const stateOf = new Map(sections.map((s) => [s.sectionId, s.state]));
  const states = lesson.sections.map((s) => stateOf.get(s.id) ?? "not_started");
  if (states.length > 0 && states.every((s) => s === "done")) return "done";
  return states.some((s) => s !== "not_started")
    ? "in_progress"
    : "not_started";
}

// The owl's mood on the home screen: pleased after studying today, glad to
// see the child again after a long break (never a reproach), calm otherwise.
export function homeMascotExpression(
  activityDays: readonly string[],
  today: string,
): MascotExpression {
  const last = activityDays.reduce<string | undefined>(
    (latest, day) => (latest === undefined || day > latest ? day : latest),
    undefined,
  );
  if (last === undefined) return "idle";
  if (last >= today) return "happy";
  return dayNumber(today) - dayNumber(last) >= MASCOT_WELCOME_AFTER_DAYS
    ? "welcome"
    : "idle";
}
