import { describe, expect, it } from "vitest";
import {
  continueTarget,
  nextSectionIndex,
  pausedSectionIndex,
  type StudyProgress,
  stickerFill,
  subjectProgress,
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
    hasOverview: false,
    sticker: { name: "Sao", visualId: "fixture.visual.star-sticker" },
  };
}

function subject(id: string): Subject {
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

  it("goes back to the first unfinished section even when a later one was touched last", () => {
    const records = [
      record("m1", 1, "in_progress", 1),
      record("m1", 3, "in_progress", 5),
    ];
    expect(nextSectionIndex(sections, records)).toBe(0);
  });

  it("goes to an untouched earlier section before a started later one", () => {
    const records = [
      record("m1", 1, "done", 1),
      record("m1", 3, "in_progress", 5),
    ];
    expect(nextSectionIndex(sections, records)).toBe(1);
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

describe("pausedSectionIndex", () => {
  const sections = lesson("m1", "math", 1, 4).sections;

  it("names the later section left half-way, the latest if several", () => {
    const records = [
      record("m1", 1, "done", 1),
      record("m1", 3, "in_progress", 5),
      record("m1", 4, "in_progress", 3),
    ];
    expect(pausedSectionIndex(sections, records)).toBe(2);
  });

  it("is null when the section to study is the one in progress", () => {
    const records = [record("m1", 2, "in_progress", 5)];
    expect(
      pausedSectionIndex(sections, [record("m1", 1, "done", 1), ...records]),
    ).toBeNull();
    expect(pausedSectionIndex(sections, [])).toBeNull();
  });
});

describe("stickerFill", () => {
  const sections = lesson("m1", "math", 1, 4).sections;

  it("counts the sections done, ignoring those in progress", () => {
    const records = [
      record("m1", 1, "done", 1),
      record("m1", 3, "done", 2),
      record("m1", 4, "in_progress", 3),
    ];
    expect(stickerFill(sections, records, false)).toEqual({
      done: 2,
      total: 4,
    });
  });

  it("is full once the sticker is earned", () => {
    expect(stickerFill(sections, [], true)).toEqual({ done: 4, total: 4 });
  });

  it("ignores records of sections the lesson no longer has", () => {
    const records = [{ sectionId: "gone", state: "done" as const }];
    expect(stickerFill(sections, records, false)).toEqual({
      done: 0,
      total: 4,
    });
  });
});

describe("subjectProgress", () => {
  const lessons = [lesson("m1", "math", 1, 4), lesson("m2", "math", 2, 3)];

  it("counts sections done across the subject's lessons, like the stickers", () => {
    const progress = {
      sections: [
        record("m2", 1, "done", 1),
        record("m2", 2, "in_progress", 2),
        record("retired", 1, "done", 3),
      ],
      stickers: [{ lessonId: "m1" }, { lessonId: "retired" }],
    };
    // m1 is earned (4 of 4), m2 has one section done (1 of 3).
    expect(subjectProgress(lessons, progress)).toEqual({ done: 5, total: 7 });
  });

  it("never counts more sections done than the subject has", () => {
    // Repeated records of one section, records of a section the lesson no
    // longer has, and a sticker with section records on top of it.
    const progress = {
      sections: [
        record("m1", 1, "done", 1),
        record("m1", 1, "done", 2),
        record("m1", 9, "done", 3),
        record("m2", 1, "done", 4),
        record("m2", 1, "done", 5),
        record("m2", 2, "done", 6),
        record("m2", 3, "done", 7),
      ],
      stickers: [{ lessonId: "m2" }, { lessonId: "m2" }],
    };
    expect(subjectProgress(lessons, progress)).toEqual({ done: 4, total: 7 });
  });

  it("is zero of every section before studying", () => {
    expect(subjectProgress(lessons, EMPTY)).toEqual({ done: 0, total: 7 });
    expect(subjectProgress([], EMPTY)).toEqual({ done: 0, total: 0 });
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
    // Sections are not locked: part 2 was started first, yet part 1 is the
    // first gap, so it comes first and part 2 is named as left half-way.
    expect(target).toMatchObject({
      sectionIndex: 0,
      pausedIndex: 1,
      started: true,
    });
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
    expect(target).toMatchObject({
      sectionIndex: 0,
      pausedIndex: null,
      started: false,
    });
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
