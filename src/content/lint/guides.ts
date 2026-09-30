import type { GuidedInteraction, Lesson } from "@/schema/content";
import { type AnyExercise, flattenExercises, indexLesson } from "../index";
import {
  type Finding,
  findingCollector,
  type LintInput,
  learned,
} from "./types";

// A child meeting a new way of answering (tap a region, match, drag…) for the
// first time needs a guide screen first: a group marked `guide` in this or an
// earlier section, or in a lesson that comes earlier in the app. A manipulable
// visual is also learnt from its explore screen, so a section block showing
// the same visual counts as its guide.

export function interactionOf(
  exercise: AnyExercise,
): GuidedInteraction | undefined {
  switch (exercise.type) {
    case "tapRegion":
    case "tapText":
    case "match":
    case "order":
    case "manipulate":
      return exercise.type;
    case "fillBlank":
      return exercise.bank ? "fillBlankBank" : undefined;
    case "numeric":
      return exercise.answer.kind === "power" ? "numericPower" : undefined;
    default:
      return undefined;
  }
}

// Interactions taught by the guide screens of a lesson, section by section.
export function guidesBySection(lesson: Lesson): Set<GuidedInteraction>[] {
  return lesson.sections.map(
    (section) =>
      new Set(
        section.blocks.flatMap((block) =>
          block.type === "group" && block.guide ? [block.guide] : [],
        ),
      ),
  );
}

// Section where the child first meets each exercise: the section that checks
// or practises it (an openEnded step goes with its exercise), else, for a
// review exercise, the first section that trains one of its cards.
function firstSection(lesson: Lesson): Map<string, number> {
  const first = new Map<string, number>();
  const index = indexLesson(lesson);
  lesson.sections.forEach((section, i) => {
    for (const id of [...section.checkIds, ...section.practiceIds]) {
      if (!first.has(id)) first.set(id, i);
      const entry = index.exerciseById.get(id)?.exercise;
      if (entry?.type === "openEnded") {
        for (const step of entry.steps)
          if (!first.has(step.id)) first.set(step.id, i);
      }
    }
  });
  const cardSection = new Map<string, number>();
  for (const [id, i] of first) {
    for (const cardId of index.exerciseById.get(id)?.exercise.cardIds ?? []) {
      if ((cardSection.get(cardId) ?? Number.POSITIVE_INFINITY) > i)
        cardSection.set(cardId, i);
    }
  }
  for (const { exercise } of flattenExercises(lesson)) {
    if (first.has(exercise.id)) continue;
    const sections = exercise.cardIds.flatMap((c) => {
      const i = cardSection.get(c);
      return i === undefined ? [] : [i];
    });
    first.set(
      exercise.id,
      sections.length > 0 ? Math.min(...sections) : lesson.sections.length - 1,
    );
  }
  return first;
}

export function lintGuides(input: LintInput): Finding[] {
  const { findings, report } = findingCollector(input.file, "guides");
  const { lesson } = input;
  const guides = guidesBySection(lesson);
  const first = firstSection(lesson);
  const shownVisuals = lesson.sections.map((section) =>
    section.blocks.flatMap((block) =>
      block.type === "visual"
        ? [block.visualId]
        : block.type === "group"
          ? block.children.flatMap((c) =>
              c.type === "visual" ? [c.visualId] : [],
            )
          : [],
    ),
  );
  // Earliest unguided exercise per interaction (per visual for manipulate).
  const unguided = new Map<
    string,
    {
      section: number;
      path: (string | number)[];
      interaction: GuidedInteraction;
    }
  >();
  for (const { exercise, path } of flattenExercises(lesson)) {
    const interaction = interactionOf(exercise);
    if (!interaction || input.priorGuides?.has(interaction)) continue;
    const section = first.get(exercise.id) ?? lesson.sections.length - 1;
    const upTo = (i: number) => i <= section;
    if (guides.some((g, i) => upTo(i) && g.has(interaction))) continue;
    const key =
      exercise.type === "manipulate"
        ? `${interaction} ${exercise.visualId}`
        : interaction;
    if (
      exercise.type === "manipulate" &&
      shownVisuals.some((v, i) => upTo(i) && v.includes(exercise.visualId))
    ) {
      continue;
    }
    const known = unguided.get(key);
    if (!known || known.section > section)
      unguided.set(key, { section, path, interaction });
  }
  for (const { section, path, interaction } of unguided.values()) {
    report(
      path,
      `${interaction} exercise comes before any guide screen for it in this or an earlier lesson; add a group with "guide": "${interaction}" in section ${section} or earlier${learned("LL-04")}`,
      "warning",
    );
  }
  return findings;
}
