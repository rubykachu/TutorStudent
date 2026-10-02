// @vitest-environment node
import { describe, expect, it } from "vitest";
import { isSubjectVisible, visibleIndex } from "@/content/visibility";
import { recordsOfLessons } from "@/progress/parent-report";
import type { ContentIndex, LessonSummary, Subject } from "@/schema/content";
import { SubjectSchema } from "@/schema/content";

function subject(id: string, visible?: boolean): Subject {
  return {
    id,
    name: id,
    color: "blue",
    icon: "calculator",
    language: "vi",
    rules: {
      checkExpr: false,
      verbatimPassage: false,
      requiresOpenEnded: false,
    },
    series: [{ id: "s", name: "s", grade: 6 }],
    defaultSeries: "s",
    ...(visible === undefined ? {} : { visible }),
  };
}

function lesson(id: string, subjectId: string): LessonSummary {
  return {
    id,
    subject: subjectId,
    series: "s",
    order: 1,
    title: id,
    sourceRef: "SGK",
    sections: [{ id: `${id}.s1`, title: "Phần 1", minutes: 5 }],
    cardCount: 1,
    hasOverview: false,
    sticker: { name: id, visualId: "fixture.visual.star-sticker" },
  };
}

const index: ContentIndex = {
  subjects: [subject("math"), subject("literature", false)],
  lessons: [lesson("m1", "math"), lesson("l1", "literature")],
};

describe("subject visibility switch", () => {
  it("shows a subject unless its visible flag is false", () => {
    expect(isSubjectVisible(subject("a"))).toBe(true);
    expect(isSubjectVisible(subject("a", true))).toBe(true);
    expect(isSubjectVisible(subject("a", false))).toBe(false);
  });

  it("accepts the flag in the subject schema", () => {
    expect(SubjectSchema.safeParse(subject("a", false)).success).toBe(true);
    expect(SubjectSchema.safeParse(subject("a")).success).toBe(true);
  });

  it("leaves hidden subjects and their lessons out of the listing index", () => {
    const shown = visibleIndex(index);
    expect(shown.subjects.map((s) => s.id)).toEqual(["math"]);
    expect(shown.lessons.map((l) => l.id)).toEqual(["m1"]);
  });

  it("returns the same index when nothing is hidden", () => {
    const all: ContentIndex = { ...index, subjects: [subject("math")] };
    expect(visibleIndex(all)).toBe(all);
  });

  it("does not touch the full index, which direct links still read", () => {
    visibleIndex(index);
    expect(index.subjects).toHaveLength(2);
    expect(index.lessons).toHaveLength(2);
  });

  it("keeps only the parent records of shown lessons", () => {
    const data = {
      attempts: [{ lessonId: "m1" }, { lessonId: "l1" }],
      cardStates: [{ lessonId: "m1" }, { lessonId: "l1" }],
      sections: [{ lessonId: "l1" }],
      stickers: [{ lessonId: "m1" }, { lessonId: "l1" }],
      writings: [{ exerciseId: "l1.w1" }, { exerciseId: "m1.w1" }],
    };
    const kept = recordsOfLessons(data, new Set(["m1"]));
    expect(kept.attempts).toEqual([{ lessonId: "m1" }]);
    expect(kept.cardStates).toEqual([{ lessonId: "m1" }]);
    expect(kept.sections).toEqual([]);
    expect(kept.stickers).toEqual([{ lessonId: "m1" }]);
    expect(kept.writings).toEqual([{ exerciseId: "m1.w1" }]);
  });
});
