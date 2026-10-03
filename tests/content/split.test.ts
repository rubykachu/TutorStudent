import { describe, expect, it } from "vitest";
import {
  checkSplitLessons,
  groupBookRefs,
  type SplitCandidate,
  splitGroups,
} from "@/content/split";

const chapter = { numeral: "IV" };

function part(
  id: string,
  options: {
    part?: number;
    order: number;
    refs?: string[];
    number?: number | null;
    chapter?: { numeral: string };
    kind?: string;
  },
): SplitCandidate {
  return {
    file: `${id}/lesson.json`,
    fixture: false,
    lesson: {
      id,
      subject: "math",
      series: "kntt",
      ...(options.number === null ? {} : { number: options.number ?? 19 }),
      ...(options.part === undefined ? {} : { part: options.part }),
      ...(options.kind === undefined ? {} : { kind: options.kind }),
      order: options.order,
      chapter: options.chapter ?? chapter,
      exercises: [
        { bookRef: undefined },
        ...(options.refs ?? []).map((bookRef) => ({ bookRef })),
      ],
    },
  };
}

const first = part("hinh-a", {
  part: 1,
  order: 19,
  refs: ["SBT 4.8", "SBT 4.10"],
});
const second = part("hinh-b", {
  part: 2,
  order: 19.1,
  refs: ["SBT 4.9", "SBT 4.11"],
});

describe("a book lesson split across lessons", () => {
  it("accepts parts that hold each book exercise once", () => {
    expect(checkSplitLessons([first, second])).toEqual([]);
  });

  it("accepts lessons that are not split, with or without a number", () => {
    const alone = part("hinh-c", { order: 20, number: 20, refs: ["SBT 4.20"] });
    const review = part("on-tap", {
      number: null,
      kind: "review",
      order: 20.5,
      refs: ["SBT 4.8"],
    });
    expect(checkSplitLessons([first, second, alone, review])).toEqual([]);
    expect(splitGroups([first, second, alone, review])).toHaveLength(1);
  });

  it("reports a book exercise held by two parts, at the later part", () => {
    const repeated = part("hinh-b", {
      part: 2,
      order: 19.1,
      refs: ["SBT 4.9", "sbt  4.8"],
    });
    const issues = checkSplitLessons([first, repeated]);
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({
      severity: "error",
      file: "hinh-b/lesson.json",
      path: ["exercises", 2, "bookRef"],
    });
    expect(issues[0]?.message).toContain('"hinh-a"');
  });

  it("does not mind one part repeating its own reference (the lesson lint does)", () => {
    const twice = part("hinh-b", {
      part: 2,
      order: 19.1,
      refs: ["SBT 4.9", "SBT 4.9"],
    });
    expect(checkSplitLessons([first, twice])).toEqual([]);
  });

  it("needs every lesson of a shared number to carry its part", () => {
    const unnumbered = part("hinh-b", { order: 19.1 });
    const issues = checkSplitLessons([first, unnumbered]);
    expect(issues.map((i) => i.file)).toEqual(["hinh-b/lesson.json"]);
    expect(issues[0]?.path).toEqual(["part"]);
  });

  it("needs the parts to run from 1 without a gap", () => {
    const third = part("hinh-b", { part: 3, order: 19.2 });
    const issues = checkSplitLessons([first, third]);
    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toContain("parts 1 to 2");
  });

  it("keeps the parts together through order = number + (part - 1) / 10", () => {
    const apart = part("hinh-b", { part: 2, order: 19.5 });
    const issues = checkSplitLessons([first, apart]);
    expect(issues).toHaveLength(1);
    expect(issues[0]?.path).toEqual(["order"]);
    const third = part("hinh-c", { part: 3, order: 19.2 });
    expect(
      checkSplitLessons([first, second, third]).filter(
        (i) => i.path[0] === "order",
      ),
    ).toEqual([]);
  });

  it("keeps the parts in one chapter", () => {
    const other = part("hinh-b", {
      part: 2,
      order: 19.1,
      chapter: { numeral: "V" },
    });
    expect(checkSplitLessons([first, other]).map((i) => i.path)).toEqual([
      ["chapter"],
    ]);
  });

  it("rejects a part with no sibling, no number, or on a review lesson", () => {
    expect(checkSplitLessons([first]).map((i) => i.path)).toEqual([["part"]]);
    const orphan = part("hinh-x", { part: 1, order: 3, number: null });
    expect(checkSplitLessons([orphan]).map((i) => i.path)).toEqual([["part"]]);
    const review = part("on-tap", {
      part: 1,
      number: 19,
      kind: "review",
      order: 19.5,
    });
    expect(
      checkSplitLessons([review]).some((i) =>
        i.message.includes("never split"),
      ),
    ).toBe(true);
  });

  it("lists the book exercises of a group in part order", () => {
    const [group] = splitGroups([second, first]);
    expect(group?.lessons.map((l) => l.lesson.id)).toEqual([
      "hinh-a",
      "hinh-b",
    ]);
    expect(group && groupBookRefs(group)).toEqual([
      { ref: "SBT 4.8", lessonId: "hinh-a" },
      { ref: "SBT 4.10", lessonId: "hinh-a" },
      { ref: "SBT 4.9", lessonId: "hinh-b" },
      { ref: "SBT 4.11", lessonId: "hinh-b" },
    ]);
  });
});
