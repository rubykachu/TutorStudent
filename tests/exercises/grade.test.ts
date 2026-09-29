import { describe, expect, it } from "vitest";
import { grade } from "@/exercises/grade";
import { normalizeText, parseNumber } from "@/exercises/grade/normalize";
import type {
  ManipulateExercise,
  MatchExercise,
  OpenEndedExercise,
  OrderExercise,
  TapRegionExercise,
  TapTextExercise,
} from "@/schema/content";
import {
  choiceExercise,
  fillBlankExercise,
  NO_HINTS,
  numericExercise,
} from "./helpers";

const common = {
  cardIds: [],
  prompt: [{ type: "note" as const, text: "Câu hỏi thử" }],
  hints: NO_HINTS,
  difficulty: 1,
};

function item(id: string) {
  return { id, content: { type: "text" as const, text: id } };
}

describe("normalizeText", () => {
  it("treats composed and decomposed Vietnamese as equal", () => {
    const composed = "Nguyễn".normalize("NFC");
    const decomposed = "Nguyễn".normalize("NFD");
    expect(composed).not.toBe(decomposed);
    expect(normalizeText(decomposed)).toBe(normalizeText(composed));
  });

  it("trims, collapses whitespace and ignores case but keeps diacritics", () => {
    expect(normalizeText("  Hà \t  Nội\n")).toBe("hà nội");
    expect(normalizeText("MÁ")).toBe("má");
    expect(normalizeText("má")).not.toBe(normalizeText("ma"));
  });
});

describe("parseNumber", () => {
  it("rejects empty and non-numeric text", () => {
    expect(parseNumber("")).toBeUndefined();
    expect(parseNumber("   ")).toBeUndefined();
    expect(parseNumber("1,2,3")).toBeUndefined();
    expect(parseNumber("abc")).toBeUndefined();
  });

  it("reads a comma as the decimal separator", () => {
    expect(parseNumber("2,5")).toBe(2.5);
    expect(parseNumber(" 7 ")).toBe(7);
  });
});

describe("grade choice", () => {
  it("accepts exactly the answer set in any order", () => {
    const ex = choiceExercise(["a", "b"]);
    expect(grade(ex, { type: "choice", selected: ["b", "a"] })).toEqual({
      correct: true,
      wrongTargets: [],
    });
  });

  it("points at wrongly chosen options only", () => {
    const ex = choiceExercise(["a", "b"]);
    expect(grade(ex, { type: "choice", selected: ["a", "c"] })).toEqual({
      correct: false,
      wrongTargets: ["c"],
    });
  });

  it("rejects an incomplete selection without revealing the missing option", () => {
    const ex = choiceExercise(["a", "b"]);
    expect(grade(ex, { type: "choice", selected: ["a"] })).toEqual({
      correct: false,
      wrongTargets: [],
    });
  });
});

describe("grade numeric value", () => {
  const ex = numericExercise({ kind: "value", value: 2.5 });

  it("accepts a comma decimal", () => {
    expect(grade(ex, { type: "numeric", kind: "value", value: "2,5" })).toEqual(
      { correct: true, wrongTargets: [] },
    );
  });

  it("marks the value slot when wrong", () => {
    expect(grade(ex, { type: "numeric", kind: "value", value: "25" })).toEqual({
      correct: false,
      wrongTargets: ["value"],
    });
  });

  it("never grades an empty pad as 0", () => {
    const zero = numericExercise({ kind: "value", value: 0 });
    expect(
      grade(zero, { type: "numeric", kind: "value", value: "" }).correct,
    ).toBe(false);
    expect(
      grade(zero, { type: "numeric", kind: "value", value: "0" }).correct,
    ).toBe(true);
  });

  it("rejects a power entry for a plain value", () => {
    expect(
      grade(ex, { type: "numeric", kind: "power", base: "2", exponent: "5" }),
    ).toEqual({ correct: false, wrongTargets: ["value"] });
  });
});

describe("grade numeric power", () => {
  const ex = numericExercise({ kind: "power", base: 2, exponent: 3 });
  const power = (base: string, exponent: string) =>
    ({ type: "numeric", kind: "power", base, exponent }) as const;

  it("accepts the right base and exponent", () => {
    expect(grade(ex, power("2", "3"))).toEqual({
      correct: true,
      wrongTargets: [],
    });
  });

  it("points at the base only when only the base is wrong", () => {
    expect(grade(ex, power("3", "3"))).toEqual({
      correct: false,
      wrongTargets: ["base"],
    });
  });

  it("points at the exponent only when only the exponent is wrong", () => {
    expect(grade(ex, power("2", ""))).toEqual({
      correct: false,
      wrongTargets: ["exponent"],
    });
  });

  it("marks both slots for a plain value such as 8", () => {
    expect(grade(ex, { type: "numeric", kind: "value", value: "8" })).toEqual({
      correct: false,
      wrongTargets: ["base", "exponent"],
    });
  });
});

describe("grade match", () => {
  const ex: MatchExercise = {
    ...common,
    id: "test.ex.ghep",
    type: "match",
    left: [item("hai-nhan-ba"), item("bon-nhan-hai")],
    right: [item("sau"), item("tam"), item("nam")],
    pairs: [
      { left: "hai-nhan-ba", right: "sau" },
      { left: "bon-nhan-hai", right: "tam" },
    ],
  };

  it("accepts all pairs right", () => {
    const pairs = { "hai-nhan-ba": "sau", "bon-nhan-hai": "tam" };
    expect(grade(ex, { type: "match", pairs })).toEqual({
      correct: true,
      wrongTargets: [],
    });
  });

  it("points at the wrong pair's left item and the chosen right item", () => {
    const pairs = { "hai-nhan-ba": "sau", "bon-nhan-hai": "nam" };
    expect(grade(ex, { type: "match", pairs })).toEqual({
      correct: false,
      wrongTargets: ["bon-nhan-hai", "nam"],
    });
  });

  it("points at an unpaired left item", () => {
    expect(
      grade(ex, { type: "match", pairs: { "hai-nhan-ba": "sau" } }),
    ).toEqual({ correct: false, wrongTargets: ["bon-nhan-hai"] });
  });

  it("ignores inherited object keys", () => {
    const tricky: MatchExercise = {
      ...ex,
      pairs: [{ left: "constructor", right: "sau" }],
    };
    expect(grade(tricky, { type: "match", pairs: {} }).correct).toBe(false);
  });
});

describe("grade order", () => {
  const ex: OrderExercise = {
    ...common,
    id: "test.ex.sap-xep",
    type: "order",
    items: [item("mot"), item("hai"), item("ba")],
  };

  it("accepts the authored order", () => {
    expect(grade(ex, { type: "order", order: ["mot", "hai", "ba"] })).toEqual({
      correct: true,
      wrongTargets: [],
    });
  });

  it("points at misplaced items", () => {
    expect(grade(ex, { type: "order", order: ["mot", "ba", "hai"] })).toEqual({
      correct: false,
      wrongTargets: ["hai", "ba"],
    });
  });

  it("counts missing items as misplaced", () => {
    expect(grade(ex, { type: "order", order: ["mot"] })).toEqual({
      correct: false,
      wrongTargets: ["hai", "ba"],
    });
  });
});

describe("grade fillBlank", () => {
  const ex = fillBlankExercise(["Nguyễn Lan", "Lan"]);
  const fill = (text: string) =>
    ({ type: "fillBlank", blanks: { ten: text } }) as const;

  it("accepts any accepted spelling after normalisation", () => {
    expect(grade(ex, fill("  nguyễn   LAN ")).correct).toBe(true);
    expect(grade(ex, fill("lan")).correct).toBe(true);
  });

  it("accepts decomposed Vietnamese against a composed answer", () => {
    expect(grade(ex, fill("Nguyễn Lan".normalize("NFD"))).correct).toBe(true);
  });

  it("keeps diacritics significant", () => {
    expect(grade(ex, fill("Nguyen Lan"))).toEqual({
      correct: false,
      wrongTargets: ["ten"],
    });
  });

  it("marks an empty or missing blank wrong", () => {
    expect(grade(ex, fill("   ")).wrongTargets).toEqual(["ten"]);
    expect(grade(ex, { type: "fillBlank", blanks: {} }).wrongTargets).toEqual([
      "ten",
    ]);
  });
});

describe("grade tapText and tapRegion", () => {
  const tapText: TapTextExercise = {
    ...common,
    id: "test.ex.cham-cau",
    type: "tapText",
    answer: ["s2"],
  };
  const tapRegion: TapRegionExercise = {
    ...common,
    id: "test.ex.cham-hinh",
    type: "tapRegion",
    visualId: "fixture.visual.shapes",
    answer: ["circle", "square"],
  };

  it("accepts the exact set of sentences", () => {
    expect(grade(tapText, { type: "tapText", selected: ["s2"] })).toEqual({
      correct: true,
      wrongTargets: [],
    });
  });

  it("points at extra sentences", () => {
    expect(grade(tapText, { type: "tapText", selected: ["s1", "s2"] })).toEqual(
      { correct: false, wrongTargets: ["s1"] },
    );
  });

  it("rejects missed regions without pointing at them", () => {
    expect(
      grade(tapRegion, { type: "tapRegion", selected: ["circle"] }),
    ).toEqual({ correct: false, wrongTargets: [] });
    expect(
      grade(tapRegion, {
        type: "tapRegion",
        selected: ["circle", "triangle", "square"],
      }),
    ).toEqual({ correct: false, wrongTargets: ["triangle"] });
    expect(
      grade(tapRegion, { type: "tapRegion", selected: ["square", "circle"] })
        .correct,
    ).toBe(true);
  });
});

describe("grade manipulate", () => {
  const ex: ManipulateExercise = {
    ...common,
    id: "test.ex.tao-cham",
    type: "manipulate",
    visualId: "fixture.visual.dot-counter",
    validatorId: "count-equals",
    params: { count: 6 },
  };

  it("asks the visual's validator", () => {
    expect(grade(ex, { type: "manipulate", state: { count: 6 } })).toEqual({
      correct: true,
      wrongTargets: [],
    });
    expect(grade(ex, { type: "manipulate", state: { count: 5 } }).correct).toBe(
      false,
    );
  });

  it("throws when the validator is not registered", () => {
    expect(() =>
      grade(
        { ...ex, validatorId: "khong-co" },
        { type: "manipulate", state: { count: 6 } },
      ),
    ).toThrow(/no validator "khong-co"/);
  });
});

describe("grade dispatch", () => {
  it("grades an openEnded step like any basic exercise", () => {
    const openEnded: OpenEndedExercise = {
      ...common,
      id: "test.ex.viet",
      type: "openEnded",
      steps: [{ ...choiceExercise(["a"]), id: "test.ex.buoc-mot" }],
      writing: { starter: "Em", rubric: ["Có mở bài"] },
    };
    const [step] = openEnded.steps;
    if (!step) throw new Error("step missing");
    expect(grade(step, { type: "choice", selected: ["a"] }).correct).toBe(true);
  });

  it("throws on an input of another type", () => {
    expect(() =>
      grade(choiceExercise(["a"]), { type: "order", order: ["a"] }),
    ).toThrow(/cannot grade choice/);
  });
});
