import { describe, expect, it } from "vitest";
import {
  openGrades,
  seriesForGrade,
  seriesOfGrade,
  subjectsOfGrade,
} from "@/content/grades";
import { subjectStatus } from "@/learn/next-step";
import { lessonsForSubject } from "@/progress/summary";
import type { ContentIndex, LessonSummary, Subject } from "@/schema/content";

function subject(id: string, series: [string, number][]): Subject {
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
    series: series.map(([sid, grade]) => ({ id: sid, name: sid, grade })),
    defaultSeries: series[0]?.[0] ?? "",
  };
}

function lesson(id: string, subjectId: string, series: string): LessonSummary {
  return {
    id,
    subject: subjectId,
    series,
    order: 1,
    title: id,
    sourceRef: "SGK",
    sections: [{ id: `${id}.s1`, title: "Phần 1", minutes: 5 }],
    cardCount: 1,
    hasOverview: false,
    sticker: { name: id, visualId: "fixture.visual.star-sticker" },
  };
}

const math = subject("math", [
  ["g6", 6],
  ["g7", 7],
]);
const history = subject("history", [["g6", 6]]);
const index: ContentIndex = {
  subjects: [math, history],
  lessons: [lesson("m6", "math", "g6")],
};

describe("series of a grade", () => {
  it("lists the series of one grade only", () => {
    expect(seriesOfGrade(math, 7).map((s) => s.id)).toEqual(["g7"]);
    expect(seriesOfGrade(math, 8)).toEqual([]);
  });

  it("picks the child's series when it is of the grade, else a default of the grade", () => {
    expect(seriesForGrade(math, 7, "g7")).toBe("g7");
    // The pick of another grade does not carry over.
    expect(seriesForGrade(math, 7, "g6")).toBe("g7");
    expect(seriesForGrade(math, 6)).toBe("g6");
    expect(seriesForGrade(math, 9, "g6")).toBeUndefined();
  });
});

describe("subjects of a grade", () => {
  it("keeps the subjects that teach the grade, with or without lessons", () => {
    expect(subjectsOfGrade(index.subjects, 6).map((s) => s.id)).toEqual([
      "math",
      "history",
    ]);
    expect(subjectsOfGrade(index.subjects, 7).map((s) => s.id)).toEqual([
      "math",
    ]);
    expect(subjectsOfGrade(index.subjects, 1)).toEqual([]);
  });

  it("derives a locked subject from having no lessons in the grade", () => {
    const learner = { grade: 6, series: {} };
    const statusOf = (id: string) =>
      subjectStatus(lessonsForSubject(index, id, learner), {
        sections: [],
        attempts: [],
      }).kind;
    expect(statusOf("math")).toBe("new");
    expect(statusOf("history")).toBe("empty");
    // Math has a grade 7 series, but no lesson for it yet.
    const grade7 = { grade: 7, series: {} };
    expect(lessonsForSubject(index, "math", grade7)).toEqual([]);
    // A lesson published for it opens the subject.
    const more: ContentIndex = {
      ...index,
      lessons: [...index.lessons, lesson("m7", "math", "g7")],
    };
    expect(lessonsForSubject(more, "math", grade7).map((l) => l.id)).toEqual([
      "m7",
    ]);
  });
});

describe("open grades", () => {
  it("is the grades that have a published lesson, ascending", () => {
    expect(openGrades(index)).toEqual([6]);
    expect(openGrades({ ...index, lessons: [] })).toEqual([]);
    expect(
      openGrades({
        ...index,
        lessons: [lesson("m7", "math", "g7"), ...index.lessons],
      }),
    ).toEqual([6, 7]);
  });

  it("ignores a lesson whose series the subject does not list", () => {
    expect(
      openGrades({ ...index, lessons: [lesson("x", "math", "unknown")] }),
    ).toEqual([]);
  });
});
