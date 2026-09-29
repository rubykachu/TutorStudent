import type {
  AttemptRecord,
  SectionProgressRecord,
  StickerRecord,
} from "@/progress/db";
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
  stickers: readonly Pick<StickerRecord, "lessonId">[];
};

// Position (0-based) of the section to study next in a lesson: the unfinished
// section the child touched most recently, so "Học tiếp" resumes where they
// were, else the first section not done yet. Null once every section is done.
export function nextSectionIndex(
  sections: readonly { id: string }[],
  records: readonly SectionRecord[],
): number | null {
  const recordOf = new Map(records.map((r) => [r.sectionId, r]));
  let resume: { index: number; at: string } | null = null;
  for (const [index, section] of sections.entries()) {
    const record = recordOf.get(section.id);
    if (record?.state !== "in_progress") continue;
    if (!resume || record.updatedAt > resume.at) {
      resume = { index, at: record.updatedAt };
    }
  }
  if (resume) return resume.index;
  const first = sections.findIndex(
    (section) => recordOf.get(section.id)?.state !== "done",
  );
  return first >= 0 ? first : null;
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
  // False for a lesson the child never opened: the card says "Bắt đầu".
  started: boolean;
};

function targetIn(
  lesson: LessonSummary,
  progress: StudyProgress,
  started: boolean,
): ContinueTarget | null {
  const sectionIndex = nextSectionIndex(
    lesson.sections,
    progress.sections.filter((s) => s.lessonId === lesson.id),
  );
  return sectionIndex === null ? null : { lesson, sectionIndex, started };
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
  const stickers = new Set(progress.stickers.map((s) => s.lessonId));
  const unfinished = (lesson: LessonSummary) =>
    lessonState(
      lesson,
      progress.sections.filter((s) => s.lessonId === lesson.id),
      stickers,
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
  const stickers = new Set(progress.stickers.map((s) => s.lessonId));
  const stateOf = (lesson: LessonSummary) =>
    lessonState(
      lesson,
      progress.sections.filter((s) => s.lessonId === lesson.id),
      stickers,
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
