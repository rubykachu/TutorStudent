import type { SectionStep } from "@/learn/section-steps";
import { lessonHeading } from "@/lib/lesson-label";
import type { Lesson, Section } from "@/schema/content";
import type { FeedbackRequest } from "./schema";

// Where a report was sent from, built from what the screen shows: the lesson,
// the section and the step on screen (the one looked at again through "Quay
// lại", not the one reached).

export type FeedbackContext = Pick<
  FeedbackRequest,
  | "lesson"
  | "lessonTitle"
  | "subject"
  | "grade"
  | "section"
  | "sectionNumber"
  | "sectionTitle"
  | "item"
  | "step"
  | "screen"
>;

type LessonFacts = Pick<
  Lesson,
  "id" | "title" | "subject" | "grade" | "number" | "part" | "chapter"
> & {
  sections: readonly Pick<
    Section,
    "id" | "title" | "checkIds" | "practiceIds"
  >[];
};

const TITLE_MAX = 120;
const cut = (text: string) => Array.from(text).slice(0, TITLE_MAX).join("");

function base(lesson: LessonFacts): Omit<FeedbackContext, "screen"> {
  return {
    lesson: lesson.id,
    lessonTitle: cut(lessonHeading(lesson)),
    subject: lesson.subject,
    grade: lesson.grade,
    section: null,
    sectionNumber: null,
    sectionTitle: null,
    item: null,
    step: null,
  };
}

function withSection(
  lesson: LessonFacts,
  section: Pick<Section, "id" | "title">,
): Omit<FeedbackContext, "screen"> {
  const index = lesson.sections.findIndex((s) => s.id === section.id);
  if (index < 0) return base(lesson);
  return {
    ...base(lesson),
    section: section.id,
    sectionNumber: index + 1,
    sectionTitle: cut(section.title),
  };
}

// The lesson page, its overview and its tips page.
export function lessonFeedbackContext(
  lesson: LessonFacts,
  screen: "lesson" | "overview" | "tips",
): FeedbackContext {
  return { ...base(lesson), screen };
}

// The id a section step points at: its exercise, video or tip.
function stepItem(step: SectionStep): string | null {
  if (step.kind === "exercise") return step.exercise.id;
  if (step.kind === "block") {
    if (step.block.type === "video") return step.block.videoId;
    if (step.block.type === "tip") return step.block.id;
  }
  return null;
}

// A step of the section player, or its end screen (`step` null).
export function sectionFeedbackContext(
  lesson: LessonFacts,
  section: Pick<Section, "id" | "title">,
  step: SectionStep | null,
): FeedbackContext {
  const placed = withSection(lesson, section);
  if (step === null) return { ...placed, screen: "done" };
  return {
    ...placed,
    item: stepItem(step),
    step: `${step.position.phase}-${step.position.index}`,
    screen: step.kind,
  };
}

// An exercise of the review player, placed in the section that holds it.
export function reviewFeedbackContext(
  lesson: LessonFacts,
  exerciseId: string,
): FeedbackContext {
  const section = lesson.sections.find(
    (s) =>
      s.checkIds.includes(exerciseId) || s.practiceIds.includes(exerciseId),
  );
  const placed = section ? withSection(lesson, section) : base(lesson);
  return {
    ...placed,
    item: exerciseId.startsWith(`${lesson.id}.`) ? exerciseId : null,
    screen: "review",
  };
}
