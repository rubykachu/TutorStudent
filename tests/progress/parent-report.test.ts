import { describe, expect, it } from "vitest";
import {
  PARENT_RECENT_DAYS,
  PARENT_TOP_COUNT,
  PARENT_WRONG_WINDOW_DAYS,
  STUDY_ATTEMPT_FLOOR_SECONDS,
} from "@/lib/config";
import type { AttemptContext } from "@/progress/db";
import {
  cardConceptNames,
  dayKeyOf,
  displayMinutes,
  lessonIdOfContentId,
  lessonSections,
  promptSummary,
  recentStudyDays,
  shorten,
  skippedExercises,
  studySecondsByDay,
  topForgettingCards,
  topWrongExercises,
  touchedLessonIds,
} from "@/progress/parent-report";
import type { LessonSummary } from "@/schema/content";
import { rate } from "@/srs/rate";
import { applyRating } from "@/srs/schedule";
import type { LessonCardState } from "@/srs/select";
import { CARD_A, CARD_B, LESSON_ID, learnIndex } from "../learn/helpers";

const FLOOR = STUDY_ATTEMPT_FLOOR_SECONDS;
// 09:00 in Vietnam on 2026-09-30.
const MORNING = Date.parse("2026-09-30T02:00:00Z");
const at = (seconds: number) =>
  new Date(MORNING + seconds * 1000).toISOString();

describe("studySecondsByDay", () => {
  it("adds gaps of up to five minutes and credits every answer at least the floor", () => {
    const seconds = studySecondsByDay([
      { at: at(0) }, // first of the day: floor
      { at: at(60) }, // 60 s after the previous one
      { at: at(360) }, // exactly 5 min: still working
      { at: at(360 + 16 * 60) }, // a break: floor only
      { at: at(360 + 16 * 60 + 10) }, // 10 s: raised to the floor
    ]);
    expect(seconds).toEqual(
      new Map([["2026-09-30", FLOOR + 60 + 300 + FLOOR + FLOOR]]),
    );
  });

  it("sorts answers and splits them by Vietnam day, not UTC day", () => {
    const seconds = studySecondsByDay([
      // 00:01 on 1 October in Vietnam, logged before the answer before it.
      { at: "2026-09-30T17:01:00Z" },
      // 23:59 on 30 September in Vietnam.
      { at: "2026-09-30T16:59:00Z" },
      { at: "2026-09-30T16:58:00Z" },
    ]);
    expect(seconds).toEqual(
      new Map([
        ["2026-09-30", FLOOR + 60],
        ["2026-10-01", FLOOR],
      ]),
    );
  });

  it("is empty without answers", () => {
    expect(studySecondsByDay([])).toEqual(new Map());
  });
});

describe("displayMinutes", () => {
  it("rounds to whole minutes but never hides a short session", () => {
    expect(displayMinutes(0)).toBe(0);
    expect(displayMinutes(10)).toBe(1);
    expect(displayMinutes(89)).toBe(1);
    expect(displayMinutes(90)).toBe(2);
    expect(displayMinutes(600)).toBe(10);
  });
});

describe("recentStudyDays", () => {
  it("lists the last days oldest first, ending today, with weekdays", () => {
    const days = recentStudyDays(
      [{ at: at(0) }, { at: at(240) }, { at: "2026-09-27T03:00:00Z" }],
      "2026-09-30",
    );
    expect(days).toHaveLength(PARENT_RECENT_DAYS);
    expect(days[0]).toEqual({ day: "2026-09-24", weekday: 3, minutes: 0 });
    // Sunday 27 September: one answer, credited the floor.
    expect(days[3]).toEqual({
      day: "2026-09-27",
      weekday: 6,
      minutes: displayMinutes(FLOOR),
    });
    // Wednesday 30 September (today): floor + 4 minutes.
    expect(days[6]).toEqual({
      day: "2026-09-30",
      weekday: 2,
      minutes: displayMinutes(FLOOR + 240),
    });
  });

  it("converts day numbers back to day keys", () => {
    expect(dayKeyOf(0)).toBe("1970-01-01");
    expect(dayKeyOf(20_726)).toBe("2026-09-30");
  });
});

describe("content lookups", () => {
  it("reads the lesson from a scoped content id", () => {
    expect(lessonIdOfContentId("luy-thua.ex.viet-gon")).toBe("luy-thua");
    expect(lessonIdOfContentId("luy-thua.card.co-so")).toBe("luy-thua");
  });

  it("collects every lesson the child has touched, once", () => {
    expect(
      touchedLessonIds({
        attempts: [{ lessonId: "b" }, { lessonId: "a" }],
        cardStates: [{ lessonId: "a" }],
        writings: [{ exerciseId: "c.ex.viet" }],
      }),
    ).toEqual(["a", "b", "c"]);
  });

  it("shortens long text at a word boundary with an ellipsis", () => {
    expect(shorten("  Ngắn   gọn ", 20)).toBe("Ngắn gọn");
    expect(shorten("Một hai ba bốn năm sáu bảy tám", 16)).toBe(
      "Một hai ba bốn…",
    );
    // One long word is cut inside the word rather than dropped.
    expect(shorten("Aaaaaaaaaaaaaaaaaaaa", 10)).toBe("Aaaaaaaaa…");
  });

  it("summarises a question by its words and first formula", () => {
    expect(
      promptSummary({
        prompt: [
          { type: "visual", visualId: "x.visual.y" },
          { type: "note", text: "Viết tích sau dưới dạng luỹ thừa." },
          { type: "formula", tex: "2 \\cdot 2" },
          { type: "formula", tex: "3 \\cdot 3" },
        ],
      }),
    ).toEqual({ text: "Viết tích sau dưới dạng luỹ thừa.", tex: "2 \\cdot 2" });
    expect(
      promptSummary({
        prompt: [
          {
            type: "passage",
            paragraphs: [
              {
                sentences: [
                  { id: "s1", text: "Lan bị ốm." },
                  { id: "s2", text: "Minh giúp Lan." },
                ],
              },
            ],
            annotations: [],
          },
          { type: "image", src: "/a.png", alt: "Hai bạn nhỏ" },
        ],
      }),
    ).toEqual({ text: "Lan bị ốm. Minh giúp Lan. Hai bạn nhỏ", tex: null });
  });

  it("names a card by its concepts, skipping ones the lesson lost", () => {
    const index = learnIndex({
      concepts: [
        { id: `${LESSON_ID}.concept.co-so`, name: "Cơ số", color: "blue" },
      ],
    });
    const card = {
      ...index.lesson.cards[0],
      id: CARD_A,
      sourceRef: "tr. 1",
      recap: { type: "formula", tex: "2" } as const,
      conceptIds: [`${LESSON_ID}.concept.co-so`, `${LESSON_ID}.concept.mat`],
    };
    expect(cardConceptNames(card, index)).toEqual(["Cơ số"]);
  });
});

describe("topForgettingCards", () => {
  // Long enough after the review that both an Again and a Good card have
  // dropped below the forgetting threshold.
  const now = new Date("2027-03-01T02:00:00Z");
  const reviewedAt = new Date("2026-09-20T02:00:00Z");

  function state(cardId: string, correct: boolean, lessonId = LESSON_ID) {
    return {
      ...applyRating(undefined, rate(correct), reviewedAt),
      cardId,
      lessonId,
    } satisfies LessonCardState;
  }

  it("puts the card answered wrong before the one answered right", () => {
    const lessons = new Map([[LESSON_ID, learnIndex()]]);
    const top = topForgettingCards(
      [state(CARD_B, true), state(CARD_A, false)],
      lessons,
      now,
    );
    expect(top.map((c) => c.cardId)).toEqual([CARD_A, CARD_B]);
    expect(top[0]?.recall).toBeLessThan(top[1]?.recall ?? 0);
    expect(top[0]?.card.id).toBe(CARD_A);
  });

  it("skips cards the content no longer has and lessons not loaded", () => {
    const lessons = new Map([[LESSON_ID, learnIndex()]]);
    const top = topForgettingCards(
      [
        state(`${LESSON_ID}.card.gone`, false),
        state("other.card.a", false, "other"),
        state(CARD_B, true),
      ],
      lessons,
      now,
    );
    expect(top.map((c) => c.cardId)).toEqual([CARD_B]);
  });

  it("leaves out a card the child still remembers", () => {
    const lessons = new Map([[LESSON_ID, learnIndex()]]);
    const top = topForgettingCards(
      [state(CARD_B, true)],
      lessons,
      new Date(reviewedAt.getTime() + 60_000),
    );
    expect(top).toEqual([]);
  });

  it("keeps only the top few", () => {
    const cards = Array.from(
      { length: 8 },
      (_, i) => `${LESSON_ID}.card.c${i}`,
    );
    const index = learnIndex({
      cards: cards.map((id) => ({
        id,
        sourceRef: "tr. 1",
        conceptIds: [],
        recap: { type: "formula", tex: "1" },
      })),
    });
    const top = topForgettingCards(
      cards.map((id) => state(id, false)),
      new Map([[LESSON_ID, index]]),
      now,
    );
    expect(top).toHaveLength(PARENT_TOP_COUNT);
  });
});

describe("topWrongExercises", () => {
  const now = new Date("2026-09-30T02:00:00Z");
  const daysAgo = (days: number) =>
    new Date(now.getTime() - days * 86_400_000).toISOString();

  function attempt(
    exerciseId: string,
    wrongCount: number,
    at: string,
    firstTryCorrect = wrongCount === 0,
    context: AttemptContext = "practice",
  ) {
    return {
      exerciseId,
      lessonId: "l",
      firstTryCorrect,
      wrongCount,
      at,
      context,
    };
  }

  it("leaves a skipped question out: it was not answered, so it is no mistake", () => {
    expect(
      topWrongExercises(
        [attempt("l.ex.a", 0, daysAgo(1), false, "skipped")],
        now,
      ),
    ).toEqual([]);
  });

  it("ranks questions missed in the window by wrong checks, then misses, then recency", () => {
    const top = topWrongExercises(
      [
        attempt("l.ex.a", 1, daysAgo(1)),
        attempt("l.ex.a", 2, daysAgo(2)),
        attempt("l.ex.b", 3, daysAgo(3)),
        attempt("l.ex.c", 1, daysAgo(5)),
        attempt("l.ex.d", 1, daysAgo(4)),
        // Right first time: not a miss.
        attempt("l.ex.e", 0, daysAgo(1)),
        // Too long ago.
        attempt("l.ex.f", 3, daysAgo(15)),
      ],
      now,
    );
    expect(top).toEqual([
      {
        exerciseId: "l.ex.a",
        lessonId: "l",
        wrongCount: 3,
        misses: 2,
        lastAt: daysAgo(1),
      },
      {
        exerciseId: "l.ex.b",
        lessonId: "l",
        wrongCount: 3,
        misses: 1,
        lastAt: daysAgo(3),
      },
      {
        exerciseId: "l.ex.d",
        lessonId: "l",
        wrongCount: 1,
        misses: 1,
        lastAt: daysAgo(4),
      },
      {
        exerciseId: "l.ex.c",
        lessonId: "l",
        wrongCount: 1,
        misses: 1,
        lastAt: daysAgo(5),
      },
    ]);
  });

  it("counts an answer not right on the first try even with no wrong check logged", () => {
    const top = topWrongExercises(
      [attempt("l.ex.a", 0, daysAgo(1), false)],
      now,
    );
    expect(top).toEqual([
      expect.objectContaining({
        exerciseId: "l.ex.a",
        wrongCount: 0,
        misses: 1,
      }),
    ]);
  });

  it("keeps only the top few", () => {
    const attempts = Array.from({ length: 9 }, (_, i) =>
      attempt(`l.ex.q${i}`, i + 1, daysAgo(1)),
    );
    const top = topWrongExercises(attempts, now);
    expect(top).toHaveLength(PARENT_TOP_COUNT);
    expect(top[0]?.exerciseId).toBe("l.ex.q8");
  });
});

describe("skippedExercises", () => {
  const now = new Date("2026-09-30T02:00:00Z");
  const daysAgo = (days: number) =>
    new Date(now.getTime() - days * 86_400_000).toISOString();
  const skip = (
    exerciseId: string,
    at: string,
    context: AttemptContext = "skipped",
  ) => ({
    exerciseId,
    lessonId: "l",
    at,
    context,
  });

  it("lists questions skipped in the window, most skipped first, ignoring answered ones", () => {
    const list = skippedExercises(
      [
        skip("l.ex.a", daysAgo(1)),
        skip("l.ex.b", daysAgo(2)),
        skip("l.ex.b", daysAgo(3)),
        skip("l.ex.c", daysAgo(1), "practice"),
        skip("l.ex.d", daysAgo(PARENT_WRONG_WINDOW_DAYS + 1)),
      ],
      now,
    );
    expect(list.map((item) => [item.exerciseId, item.skips])).toEqual([
      ["l.ex.b", 2],
      ["l.ex.a", 1],
    ]);
  });
});

describe("lessonSections", () => {
  const lesson = (id: string, sections: string[]): LessonSummary => ({
    id,
    subject: "math",
    series: "kntt",
    order: 1,
    title: id,
    sourceRef: "tr. 1",
    sections: sections.map((s) => ({ id: s, title: s, minutes: 5 })),
    cardCount: 0,
    hasOverview: false,
    sticker: { name: "Sao", visualId: `${id}.visual.sao` },
  });

  it("counts finished sections, and a sticker as every section done", () => {
    const rows = lessonSections(
      [
        lesson("a", ["a.section.1", "a.section.2"]),
        lesson("b", ["b.section.1"]),
      ],
      [
        { sectionId: "a.section.1", state: "done" },
        { sectionId: "a.section.2", state: "in_progress" },
      ],
      [{ lessonId: "b" }],
    );
    expect(
      rows.map(({ lesson: l, ...rest }) => ({ id: l.id, ...rest })),
    ).toEqual([
      { id: "a", done: 1, total: 2, sticker: false },
      { id: "b", done: 1, total: 1, sticker: true },
    ]);
  });
});
