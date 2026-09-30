import type { Lesson } from "@/schema/content";
import type { VisualCatalog } from "@/visuals/registry";
import { collectVisualRefs } from "./check";

// Size and variety of a lesson, compared with the minimums of docs/spec.md
// ("Tiêu chí thành công") by `content:check --stats`.

export type LessonStats = {
  sections: number;
  cards: number;
  // openEnded counts as one exercise; its steps are part of it.
  exercises: number;
  // Distinct basic types among top-level exercises (openEnded is not a type).
  exerciseTypes: number;
  interactiveVisuals: number;
  // Sections with a visual block on an explanation screen (groups included;
  // the recap does not count, every recap being a visual).
  sectionsWithVisual: number;
  openEnded: number;
};

export const LESSON_MINIMUMS = {
  sections: 3,
  cards: 8,
  exercises: 20,
  exerciseTypes: 5,
  // One interactive visual per this many sections, rounded up.
  sectionsPerInteractiveVisual: 3,
  // Literature lessons end with a writing task.
  literatureOpenEnded: 1,
} as const;

export function lessonStats(
  lesson: Lesson,
  catalog: VisualCatalog,
): LessonStats {
  const types = new Set(
    lesson.exercises.filter((e) => e.type !== "openEnded").map((e) => e.type),
  );
  const interactive = new Set(
    collectVisualRefs(lesson)
      .map((ref) => ref.visualId)
      .filter((id) => catalog[id]?.interactive),
  );
  const sectionsWithVisual = lesson.sections.filter((section) =>
    section.blocks.some((block) =>
      block.type === "group"
        ? block.children.some((child) => child.type === "visual")
        : block.type === "visual",
    ),
  ).length;
  return {
    sections: lesson.sections.length,
    cards: lesson.cards.length,
    exercises: lesson.exercises.length,
    exerciseTypes: types.size,
    interactiveVisuals: interactive.size,
    sectionsWithVisual,
    openEnded: lesson.exercises.filter((e) => e.type === "openEnded").length,
  };
}

export type Criterion = {
  name: string;
  actual: number;
  required: number;
  pass: boolean;
  // How `required` follows from the lesson, when it is not a fixed number.
  basis?: string;
};

export function lessonCriteria(
  lesson: Lesson,
  stats: LessonStats,
): Criterion[] {
  const min = LESSON_MINIMUMS;
  const criterion = (
    name: string,
    actual: number,
    required: number,
    basis?: string,
  ): Criterion => ({
    name,
    actual,
    required,
    pass: actual >= required,
    ...(basis === undefined ? {} : { basis }),
  });
  const criteria = [
    criterion("sections", stats.sections, min.sections),
    criterion("cards", stats.cards, min.cards),
    criterion("exercises", stats.exercises, min.exercises),
    criterion("exercise types", stats.exerciseTypes, min.exerciseTypes),
    criterion(
      "sections with a visual",
      stats.sectionsWithVisual,
      stats.sections,
      "every section",
    ),
    criterion(
      "interactive visuals",
      stats.interactiveVisuals,
      Math.ceil(stats.sections / min.sectionsPerInteractiveVisual),
      `ceil(${stats.sections} sections / ${min.sectionsPerInteractiveVisual})`,
    ),
  ];
  if (lesson.subject === "literature") {
    criteria.push(
      criterion("openEnded", stats.openEnded, min.literatureOpenEnded),
    );
  }
  return criteria;
}
