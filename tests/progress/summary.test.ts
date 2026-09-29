import { describe, expect, it } from "vitest";
import {
  homeMascotExpression,
  lastStudiedBySubject,
  lessonState,
  lessonsForSubject,
  subjectNudgeDays,
  subjectProgress,
  vnDaysBetween,
} from "@/progress/summary";
import type { ContentIndex, LessonSummary, Subject } from "@/schema/content";

function lesson(
  id: string,
  subject: string,
  overrides: Partial<LessonSummary> = {},
): LessonSummary {
  return {
    id,
    subject,
    series: "kntt",
    order: 0,
    title: id,
    sourceRef: "SGK",
    sections: [
      { id: `${id}.section.one`, title: "Một", minutes: 5 },
      { id: `${id}.section.two`, title: "Hai", minutes: 5 },
    ],
    cardCount: 1,
    ...overrides,
  };
}

const math: Subject = {
  id: "math",
  name: "Toán",
  color: "math",
  series: [
    { id: "kntt", name: "Kết nối" },
    { id: "cd", name: "Cánh diều" },
  ],
  defaultSeries: "kntt",
};

describe("vnDaysBetween", () => {
  it("counts Vietnam calendar days, not 24-hour spans", () => {
    // 23:30 and 00:30 Vietnam time on consecutive days, one hour apart.
    expect(
      vnDaysBetween(
        new Date("2026-03-01T16:30:00Z"),
        new Date("2026-03-01T17:30:00Z"),
      ),
    ).toBe(1);
    // Same Vietnam day although the UTC dates differ.
    expect(
      vnDaysBetween(
        new Date("2026-03-01T17:30:00Z"),
        new Date("2026-03-02T16:30:00Z"),
      ),
    ).toBe(0);
  });
});

describe("subjectNudgeDays", () => {
  const now = new Date("2026-03-10T03:00:00Z");

  it("stays quiet for a subject never studied", () => {
    expect(subjectNudgeDays(undefined, now)).toBeNull();
  });

  it("nudges only after more than three Vietnam days", () => {
    expect(subjectNudgeDays(new Date("2026-03-07T03:00:00Z"), now)).toBeNull();
    expect(subjectNudgeDays(new Date("2026-03-06T03:00:00Z"), now)).toBe(4);
  });

  it("uses the Vietnam day boundary", () => {
    // 23:59 on 6 March in Vietnam is still 6 March: four days before the 10th.
    expect(subjectNudgeDays(new Date("2026-03-06T16:59:00Z"), now)).toBe(4);
    // 00:01 on 7 March in Vietnam (still 6 March in UTC): only three days.
    expect(subjectNudgeDays(new Date("2026-03-06T17:01:00Z"), now)).toBeNull();
  });
});

describe("lastStudiedBySubject", () => {
  it("keeps the latest attempt or section update per subject", () => {
    const lessons = [lesson("powers", "math"), lesson("friend", "literature")];
    const latest = lastStudiedBySubject(
      lessons,
      [
        { lessonId: "powers", at: "2026-03-02T01:00:00.000Z" },
        { lessonId: "powers", at: "2026-03-04T01:00:00.000Z" },
        { lessonId: "retired", at: "2026-03-09T01:00:00.000Z" },
      ],
      [
        { lessonId: "powers", updatedAt: "2026-03-03T01:00:00.000Z" },
        { lessonId: "friend", updatedAt: "2026-03-05T01:00:00.000Z" },
      ],
    );
    expect(Object.fromEntries(latest)).toEqual({
      math: new Date("2026-03-04T01:00:00.000Z"),
      literature: new Date("2026-03-05T01:00:00.000Z"),
    });
  });
});

describe("lessonsForSubject", () => {
  const index: ContentIndex = {
    subjects: [math],
    lessons: [
      lesson("roots", "math", { order: 2 }),
      lesson("powers", "math", { order: 1 }),
      lesson("other-series", "math", { series: "cd" }),
      lesson("friend", "literature"),
    ],
  };

  it("lists the chosen series in textbook order", () => {
    expect(lessonsForSubject(index, "math", "kntt").map((l) => l.id)).toEqual([
      "powers",
      "roots",
    ]);
    expect(lessonsForSubject(index, "math", "cd").map((l) => l.id)).toEqual([
      "other-series",
    ]);
  });

  it("falls back to the subject's default series", () => {
    expect(
      lessonsForSubject(index, "math", undefined).map((l) => l.id),
    ).toEqual(["powers", "roots"]);
    expect(lessonsForSubject(index, "unknown", undefined)).toEqual([]);
  });
});

describe("lessonState", () => {
  const powers = lesson("powers", "math");
  const one = "powers.section.one";
  const two = "powers.section.two";

  it("is not started without progress", () => {
    expect(lessonState(powers, [], new Set())).toBe("not_started");
    expect(
      lessonState(
        powers,
        [{ sectionId: one, state: "not_started" }],
        new Set(),
      ),
    ).toBe("not_started");
  });

  it("is in progress once any section moved", () => {
    expect(
      lessonState(powers, [{ sectionId: one, state: "done" }], new Set()),
    ).toBe("in_progress");
    expect(
      lessonState(
        powers,
        [{ sectionId: two, state: "in_progress" }],
        new Set(),
      ),
    ).toBe("in_progress");
  });

  it("is done when every section is done or a sticker was earned", () => {
    expect(
      lessonState(
        powers,
        [
          { sectionId: one, state: "done" },
          { sectionId: two, state: "done" },
        ],
        new Set(),
      ),
    ).toBe("done");
    expect(lessonState(powers, [], new Set(["powers"]))).toBe("done");
  });
});

describe("subjectProgress", () => {
  it("counts lessons with a sticker out of the lessons shown", () => {
    const lessons = [lesson("powers", "math"), lesson("roots", "math")];
    expect(
      subjectProgress(lessons, [
        { lessonId: "powers" },
        { lessonId: "retired" },
      ]),
    ).toEqual({ done: 1, total: 2 });
  });
});

describe("homeMascotExpression", () => {
  it("stays calm before the first study day", () => {
    expect(homeMascotExpression([], "2026-09-30")).toBe("idle");
  });

  it("is happy once the child studied today", () => {
    expect(
      homeMascotExpression(["2026-09-30", "2026-09-28"], "2026-09-30"),
    ).toBe("happy");
  });

  it("stays calm after a short break", () => {
    expect(homeMascotExpression(["2026-09-28"], "2026-09-30")).toBe("idle");
  });

  it("welcomes the child back after three days away", () => {
    expect(
      homeMascotExpression(["2026-09-20", "2026-09-27"], "2026-09-30"),
    ).toBe("welcome");
  });
});
