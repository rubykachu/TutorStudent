import { describe, expect, it } from "vitest";
import {
  continueTarget,
  nextSectionIndex,
  type StudyProgress,
  subjectStatus,
} from "@/learn/next-step";
import type { SectionState } from "@/progress/db";
import type { ContentIndex, LessonSummary, Subject } from "@/schema/content";

function lesson(
  id: string,
  subject: string,
  order: number,
  sectionCount = 3,
): LessonSummary {
  return {
    id,
    subject,
    series: "kntt",
    order,
    title: `Bài ${id}`,
    sourceRef: "SGK",
    sections: Array.from({ length: sectionCount }, (_, i) => ({
      id: `${id}.section.${i + 1}`,
      title: `Phần ${i + 1}`,
      minutes: 5,
    })),
    cardCount: 1,
    sticker: { name: "Sao", visualId: "fixture.visual.star-sticker" },
  };
}

function subject(id: string): Subject {
  return {
    id,
    name: id,
    color: "math",
    series: [{ id: "kntt", name: "Kết nối" }],
    defaultSeries: "kntt",
  };
}

function record(
  lessonId: string,
  n: number,
  state: SectionState,
  minute: number,
) {
  return {
    lessonId,
    sectionId: `${lessonId}.section.${n}`,
    state,
    updatedAt: `2026-03-02T01:${String(minute).padStart(2, "0")}:00.000Z`,
  };
}

const EMPTY: StudyProgress = { attempts: [], sections: [], stickers: [] };

const index: ContentIndex = {
  subjects: [subject("math"), subject("literature")],
  lessons: [
    lesson("m2", "math", 2),
    lesson("m1", "math", 1),
    lesson("v1", "literature", 1),
  ],
};

describe("nextSectionIndex", () => {
  const sections = lesson("m1", "math", 1).sections;

  it("starts at the first section of an untouched lesson", () => {
    expect(nextSectionIndex(sections, [])).toBe(0);
  });

  it("resumes the unfinished section touched most recently", () => {
    const records = [
      record("m1", 1, "in_progress", 1),
      record("m1", 3, "in_progress", 5),
    ];
    expect(nextSectionIndex(sections, records)).toBe(2);
  });

  it("goes to the first section not done when none is in progress", () => {
    const records = [record("m1", 1, "done", 1), record("m1", 3, "done", 2)];
    expect(nextSectionIndex(sections, records)).toBe(1);
  });

  it("is null once every section is done", () => {
    const records = [1, 2, 3].map((n) => record("m1", n, "done", n));
    expect(nextSectionIndex(sections, records)).toBeNull();
  });
});

describe("continueTarget", () => {
  const series = { math: "kntt", literature: "kntt" };

  it("offers the first lesson in subject and textbook order to a new child", () => {
    const target = continueTarget(index, series, EMPTY);
    expect(target?.lesson.id).toBe("m1");
    expect(target?.sectionIndex).toBe(0);
    expect(target?.started).toBe(false);
  });

  it("resumes the unfinished lesson studied most recently", () => {
    const target = continueTarget(index, series, {
      ...EMPTY,
      sections: [record("m1", 1, "done", 1), record("v1", 2, "in_progress", 9)],
    });
    expect(target).toMatchObject({ sectionIndex: 1, started: true });
    expect(target?.lesson.id).toBe("v1");
  });

  it("counts answers as activity too", () => {
    const target = continueTarget(index, series, {
      ...EMPTY,
      sections: [record("v1", 1, "in_progress", 1)],
      attempts: [{ lessonId: "m1", at: "2026-03-02T02:00:00.000Z" }],
    });
    expect(target?.lesson.id).toBe("m1");
  });

  it("moves on to the next lesson of the subject after finishing one", () => {
    const target = continueTarget(index, series, {
      ...EMPTY,
      sections: [1, 2, 3].map((n) => record("m1", n, "done", n)),
      stickers: [{ lessonId: "m1" }],
    });
    expect(target).toMatchObject({ sectionIndex: 0, started: false });
    expect(target?.lesson.id).toBe("m2");
  });

  it("is null when every lesson has its sticker", () => {
    const stickers = index.lessons.map((l) => ({ lessonId: l.id }));
    expect(continueTarget(index, series, { ...EMPTY, stickers })).toBeNull();
  });

  it("ignores lessons of another series", () => {
    const target = continueTarget(
      index,
      { math: "other", literature: "kntt" },
      EMPTY,
    );
    expect(target?.lesson.id).toBe("v1");
  });
});

describe("subjectStatus", () => {
  const math = [lesson("m1", "math", 1), lesson("m2", "math", 2)];

  it("has nothing to show for a subject without lessons", () => {
    expect(subjectStatus([], EMPTY)).toEqual({ kind: "empty" });
  });

  it("counts lessons before anything is started", () => {
    expect(subjectStatus(math, EMPTY)).toEqual({ kind: "new", total: 2 });
  });

  it("names the section being studied", () => {
    const status = subjectStatus(math, {
      ...EMPTY,
      sections: [record("m1", 1, "done", 1)],
    });
    expect(status).toEqual({ kind: "learning", total: 2, sectionNumber: 2 });
  });

  it("counts finished lessons when none is in progress", () => {
    const status = subjectStatus(math, {
      ...EMPTY,
      stickers: [{ lessonId: "m1" }],
    });
    expect(status).toEqual({ kind: "progress", done: 1, total: 2 });
  });
});
