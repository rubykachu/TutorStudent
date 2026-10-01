import type { AttemptRecord, SectionProgressRecord } from "@/progress/db";
import { lessonState, lessonsForSubject } from "@/progress/summary";
import type { ContentIndex, LessonSummary } from "@/schema/content";

// Pure answers to "what should the child study next?", shared by the home
// "Học tiếp" card, the subject tiles and the lesson page.

type SectionRecord = Pick<
  SectionProgressRecord,
  "lessonId" | "sectionId" | "state" | "updatedAt"
>;

export type StudyProgress = {
  attempts: readonly Pick<AttemptRecord, "lessonId" | "at">[];
  sections: readonly SectionRecord[];
};

// Position (0-based) of the section to study next in a lesson: the first
// section not done yet, in lesson order, whether started or not. Sections are
// never locked, so a child may have started a later one; "Học tiếp" still
// sends them back to the earliest gap. Null once every section is done.
export function nextSectionIndex(
  sections: readonly { id: string }[],
  records: readonly SectionRecord[],
): number | null {
  const recordOf = new Map(records.map((r) => [r.sectionId, r]));
  const first = sections.findIndex(
    (section) => recordOf.get(section.id)?.state !== "done",
  );
  return first >= 0 ? first : null;
}

// Position of a section the child left half-way that comes after the one to
// study next (the most recently touched one if several), so "Học tiếp" can
// mention it on a second line. Null when there is none.
export function pausedSectionIndex(
  sections: readonly { id: string }[],
  records: readonly SectionRecord[],
): number | null {
  const next = nextSectionIndex(sections, records);
  if (next === null) return null;
  const recordOf = new Map(records.map((r) => [r.sectionId, r]));
  let paused: { index: number; at: string } | null = null;
  for (const [index, section] of sections.entries()) {
    const record = recordOf.get(section.id);
    if (index <= next || record?.state !== "in_progress") continue;
    if (!paused || record.updatedAt > paused.at) {
      paused = { index, at: record.updatedAt };
    }
  }
  return paused?.index ?? null;
}

// Sections of a lesson that fill its sticker with colour: every section once
// the sticker is earned, else the sections done. Only for drawing the sticker;
// whether a lesson is finished is read from the section records alone.
export function stickerFill(
  sections: readonly { id: string }[],
  records: readonly Pick<SectionRecord, "sectionId" | "state">[],
  earned: boolean,
): { done: number; total: number } {
  const total = sections.length;
  if (earned) return { done: total, total };
  const done = new Set(
    records.filter((r) => r.state === "done").map((r) => r.sectionId),
  );
  return { done: sections.filter((s) => done.has(s.id)).length, total };
}

export type SubjectProgress = { done: number; total: number };

// Sections done out of every section of a subject's lessons. A lesson whose
// progress was reset counts as not started even though its sticker stays.
export function subjectProgress(
  lessons: readonly Pick<LessonSummary, "id" | "sections">[],
  progress: Pick<StudyProgress, "sections">,
): SubjectProgress {
  let done = 0;
  let total = 0;
  for (const lesson of lessons) {
    const fill = stickerFill(
      lesson.sections,
      progress.sections.filter((s) => s.lessonId === lesson.id),
      false,
    );
    done += fill.done;
    total += fill.total;
  }
  return { done, total };
}

// Latest moment the child answered or moved through each lesson.
function lastActiveByLesson(progress: StudyProgress): Map<string, string> {
  const latest = new Map<string, string>();
  const events = [
    ...progress.attempts.map((a) => ({ lessonId: a.lessonId, at: a.at })),
    ...progress.sections.map((s) => ({
      lessonId: s.lessonId,
      at: s.updatedAt,
    })),
  ];
  for (const { lessonId, at } of events) {
    const current = latest.get(lessonId);
    if (!current || at > current) latest.set(lessonId, at);
  }
  return latest;
}

export type ContinueTarget = {
  lesson: LessonSummary;
  // 0-based position of the section to open in `lesson.sections`.
  sectionIndex: number;
  // 0-based position of a later section left half-way, else null.
  pausedIndex: number | null;
  // False for a lesson the child never opened: the card says "Bắt đầu".
  started: boolean;
};

function targetIn(
  lesson: LessonSummary,
  progress: StudyProgress,
  started: boolean,
): ContinueTarget | null {
  const records = progress.sections.filter((s) => s.lessonId === lesson.id);
  const sectionIndex = nextSectionIndex(lesson.sections, records);
  if (sectionIndex === null) return null;
  const pausedIndex = pausedSectionIndex(lesson.sections, records);
  return { lesson, sectionIndex, pausedIndex, started };
}

// Where the home "Học tiếp" card leads, among the lessons the child can see
// (the profile's series of each subject):
// 1. the unfinished lesson studied most recently;
// 2. after finishing a lesson, the next unfinished one of the same subject;
// 3. otherwise the first unfinished lesson, in subject then textbook order.
// Null when there is no lesson left to study.
export function continueTarget(
  index: ContentIndex,
  series: Readonly<Record<string, string>>,
  progress: StudyProgress,
): ContinueTarget | null {
  const lessons = index.subjects.flatMap((subject) =>
    lessonsForSubject(index, subject.id, series[subject.id]),
  );
  const unfinished = (lesson: LessonSummary) =>
    lessonState(
      lesson,
      progress.sections.filter((s) => s.lessonId === lesson.id),
    ) !== "done";
  const lastActive = lastActiveByLesson(progress);
  const byRecency = lessons
    .filter((lesson) => lastActive.has(lesson.id))
    .sort((a, b) =>
      (lastActive.get(b.id) ?? "").localeCompare(lastActive.get(a.id) ?? ""),
    );

  const resumed = byRecency.find(unfinished);
  if (resumed) return targetIn(resumed, progress, true);

  const latest = byRecency[0];
  const sameSubjectNext = latest
    ? lessons.find(
        (lesson) =>
          lesson.subject === latest.subject &&
          lesson.order > latest.order &&
          unfinished(lesson),
      )
    : undefined;
  const fresh = sameSubjectNext ?? lessons.find(unfinished);
  return fresh ? targetIn(fresh, progress, false) : null;
}

export type SubjectStatus =
  | { kind: "empty" }
  | { kind: "new"; total: number }
  | { kind: "learning"; total: number; sectionNumber: number }
  | { kind: "progress"; done: number; total: number };

// What a subject tile says under its name, for the lessons of one subject in
// textbook order: nothing yet, not started, the section being studied, or
// how many lessons are finished.
export function subjectStatus(
  lessons: readonly LessonSummary[],
  progress: StudyProgress,
): SubjectStatus {
  if (lessons.length === 0) return { kind: "empty" };
  const stateOf = (lesson: LessonSummary) =>
    lessonState(
      lesson,
      progress.sections.filter((s) => s.lessonId === lesson.id),
    );
  const total = lessons.length;
  const lastActive = lastActiveByLesson(progress);
  const learning = lessons
    .filter((lesson) => stateOf(lesson) === "in_progress")
    .sort((a, b) =>
      (lastActive.get(b.id) ?? "").localeCompare(lastActive.get(a.id) ?? ""),
    )[0];
  const target = learning && targetIn(learning, progress, true);
  if (target) {
    return { kind: "learning", total, sectionNumber: target.sectionIndex + 1 };
  }
  const done = lessons.filter((lesson) => stateOf(lesson) === "done").length;
  return done > 0 ? { kind: "progress", done, total } : { kind: "new", total };
}
