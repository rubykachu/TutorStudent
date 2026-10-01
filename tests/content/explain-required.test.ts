// @vitest-environment node
import { describe, expect, it } from "vitest";
import { flattenExercises } from "@/content";
import { checkContent } from "@/content/check";
import { readContentRoot } from "@/content/load";
import { LegacyLessonsSchema } from "@/schema/content";
import { visualRegistry } from "@/visuals/registry";
import { CONTENT_ROOT } from "./helpers";

// Guard against forgotten explanations: every real lesson that is not listed
// in content/legacy-lessons.json must give every gradable exercise an
// `explain`. The lint reports the same, but this fails `pnpm test` even if
// the lint is changed or skipped.
const raw = readContentRoot(CONTENT_ROOT);
const { lessons } = checkContent(raw, visualRegistry);
const { lessons: legacy } = LegacyLessonsSchema.parse(raw.legacy?.data);
const real = lessons.filter((l) => !l.fixture);

describe("explain is required", () => {
  it("is given for every gradable exercise of every lesson not listed as legacy", () => {
    const missing = real
      .filter(({ lesson }) => !(lesson.id in legacy))
      .flatMap(({ lesson }) =>
        flattenExercises(lesson)
          .filter(
            ({ exercise }) =>
              exercise.type !== "openEnded" && exercise.explain === undefined,
          )
          .map(({ exercise }) => exercise.id),
      );
    expect(missing).toEqual([]);
  });

  it("lists only lessons that exist in content/legacy-lessons.json", () => {
    const ids = new Set(real.map(({ lesson }) => lesson.id));
    expect(Object.keys(legacy).filter((id) => !ids.has(id))).toEqual([]);
  });
});
