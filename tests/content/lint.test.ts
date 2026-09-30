// @vitest-environment node
import { describe, expect, it } from "vitest";
import { checkContent, formatIssue } from "@/content/check";
import { lintLesson } from "@/content/lint";
import { MIN_EXERCISES_PER_CARD } from "@/content/lint/config";
import { evaluateExpr, textValue, texValue } from "@/content/lint/expr";
import { computeReviewedHash } from "@/content/lint/review-hash";
import { sentences, syllableCount } from "@/content/lint/text";
import type { Finding, LintInput, LintRule } from "@/content/lint/types";
import { isVietnameseSyllable } from "@/content/lint/vietnamese";
import {
  type GlossaryFile,
  GlossaryFileSchema,
  type Lesson,
  LessonSchema,
} from "@/schema/content";
import { visualRegistry } from "@/visuals/registry";
import { fixtureContent, fixtureFile, readSkeleton } from "./helpers";

const FILE = "lesson.json";

function fixtureInput(): LintInput {
  const raw = fixtureContent();
  const file = fixtureFile(raw);
  const glossary = raw.glossaries.find((g) => g.subject === "math");
  return {
    file: FILE,
    lesson: LessonSchema.parse(file.data),
    fixture: true,
    glossary: GlossaryFileSchema.parse(glossary?.data),
    sourcePassage: file.sourcePassage,
  };
}

// The lesson-author skeleton as a real lesson: the authoring rules apply.
function skeletonInput(): LintInput {
  const glossary = fixtureContent().glossaries.find(
    (g) => g.subject === "math",
  );
  return {
    file: FILE,
    lesson: LessonSchema.parse(readSkeleton()),
    fixture: false,
    glossary: GlossaryFileSchema.parse(glossary?.data),
  };
}

// The fixture lesson with its first section note replaced by `text`.
function withNote(text: string, input = fixtureInput()): LintInput {
  const block = input.lesson.sections[0]?.blocks[0];
  if (block?.type !== "note") throw new Error("fixture note moved");
  block.text = text;
  return input;
}

function withFormula(tex: string, input = fixtureInput()): LintInput {
  const block = input.lesson.sections[0]?.blocks[2];
  if (block?.type !== "formula") throw new Error("fixture formula moved");
  block.tex = tex;
  return input;
}

function numericExercise(lesson: Lesson, id: string) {
  const found = lesson.exercises.find((e) => e.id === id);
  if (found?.type !== "numeric") throw new Error(`no numeric ${id}`);
  return found;
}

function choiceExercise(lesson: Lesson, id: string) {
  const found = lesson.exercises.find((e) => e.id === id);
  if (found?.type !== "choice") throw new Error(`no choice ${id}`);
  return found;
}

function findings(input: LintInput, rule: LintRule): Finding[] {
  return lintLesson(input).filter((f) => f.rule === rule);
}

function messages(input: LintInput, rule: LintRule): string[] {
  return findings(input, rule).map((f) => f.message);
}

const NOTE_PATH = ["sections", 0, "blocks", 0, "text"];
const FORMULA_PATH = ["sections", 0, "blocks", 2, "tex"];

describe("lintLesson on the fixture", () => {
  it("finds nothing", () => {
    expect(lintLesson(fixtureInput())).toEqual([]);
  });

  it("reports findings with file, JSON path, severity and rule", () => {
    const [finding] = findings(withNote("Hello các em."), "vietnamese");
    expect(finding).toMatchObject({
      file: FILE,
      path: NOTE_PATH,
      severity: "error",
      rule: "vietnamese",
    });
    expect(formatIssue(finding as Finding)).toMatch(
      /^error lesson\.json \$\.sections\[0\]\.blocks\[0\]\.text: .*\[vietnamese\]$/,
    );
  });
});

describe("string fields", () => {
  it("rejects a string field the lint does not know", () => {
    const input = fixtureInput();
    Object.assign(input.lesson.sections[0] as object, { subtitle: "Phụ đề" });
    expect(findings(input, "fields")).toMatchObject([
      { path: ["sections", 0, "subtitle"] },
    ]);
  });
});

describe("nfc", () => {
  it("rejects decomposed text and accepts composed text", () => {
    const composed = "Số mũ cho biết nhân mấy lần.";
    expect(messages(withNote(composed), "nfc")).toEqual([]);
    expect(findings(withNote(composed.normalize("NFD")), "nfc")).toMatchObject([
      { path: NOTE_PATH },
    ]);
  });

  it("exempts passages", () => {
    const input = fixtureInput();
    const passage = input.lesson.sections[1]?.blocks[0];
    if (passage?.type !== "passage") throw new Error("fixture passage moved");
    const sentence = passage.paragraphs[0]?.sentences[0];
    if (!sentence) throw new Error("fixture sentence moved");
    sentence.text = sentence.text.normalize("NFD");
    expect(messages(input, "nfc")).toEqual([]);
  });
});

describe("symbols", () => {
  it.each([
    ["2 \\times 3", "·"],
    ["2 × 3", "·"],
    ["2 * 3", "·"],
    ["6 \\div 2", ":"],
    ["6 ÷ 2", ":"],
    ["6 / 2", ":"],
  ])("rejects %s in TeX", (tex, use) => {
    expect(findings(withFormula(tex), "symbols")).toMatchObject([
      { path: FORMULA_PATH, message: expect.stringContaining(`"${use}"`) },
    ]);
  });

  it("accepts textbook operators and units written as text in TeX", () => {
    expect(messages(withFormula("2 \\cdot 3 : 1 = 6"), "symbols")).toEqual([]);
    expect(messages(withFormula("60 \\text{ km/h}"), "symbols")).toEqual([]);
    expect(messages(withFormula("\\frac{1}{2}"), "symbols")).toEqual([]);
  });

  it("rejects number–operator–number runs in text only", () => {
    expect(messages(withNote("Tính 2 x 3 và 6/2 nhé."), "symbols")).toEqual([
      expect.stringContaining('":"'),
    ]);
    expect(messages(withNote("Xe đi 60 km/h."), "symbols")).toEqual([]);
    expect(messages(withNote("Hôm nay là 2/9/2024."), "symbols")).toEqual([]);
  });

  it("rejects forbidden operators in check.expr", () => {
    const input = fixtureInput();
    const exercise = numericExercise(input.lesson, "fixture.ex.dem-cham");
    exercise.check = { expr: "2*3" };
    expect(findings(input, "symbols")).toMatchObject([
      { path: ["exercises", 2, "check", "expr"] },
    ]);
    expect(messages(input, "check-expr")).toEqual([]);
  });
});

describe("numbers", () => {
  it("requires U+202F thousands separators from the digit threshold", () => {
    expect(messages(withNote("Có 12345 hạt thóc."), "numbers")).toEqual([
      expect.stringContaining('"12345"'),
    ]);
    expect(messages(withNote("Có 12 345 hạt thóc."), "numbers")).toEqual([
      expect.stringContaining("U+202F"),
    ]);
    expect(messages(withNote("Có 1.000 hạt thóc."), "numbers")).toEqual([
      expect.stringContaining("U+202F"),
    ]);
    expect(messages(withNote("Có 12 345 hạt thóc."), "numbers")).toEqual([]);
    expect(messages(withNote("Có 999 hạt thóc."), "numbers")).toEqual([]);
  });

  it("exempts years, pages and exercise numbers", () => {
    expect(messages(withNote("Năm 2024 em học lớp 6."), "numbers")).toEqual([]);
    expect(messages(withNote("Xem SGK tr.22 nhé."), "numbers")).toEqual([]);
    expect(messages(withNote("Xem trang 1024 nhé."), "numbers")).toEqual([]);
    expect(messages(withNote("Làm bài 1.25 nhé."), "numbers")).toEqual([]);
  });

  it("requires a decimal comma", () => {
    expect(messages(withNote("Cân nặng 2.5 ki lô."), "numbers")).toEqual([
      expect.stringContaining("comma"),
    ]);
    expect(messages(withNote("Cân nặng 2,5 ki lô."), "numbers")).toEqual([]);
  });

  it("checks TeX numbers, ignoring \\htmlId names", () => {
    expect(messages(withFormula("2^{10} = 1024"), "numbers")).toEqual([
      expect.stringContaining("\\,"),
    ]);
    expect(messages(withFormula("2^{10} = 1\\,024"), "numbers")).toEqual([]);
    expect(messages(withFormula("2.5 + 1"), "numbers")).toEqual([
      expect.stringContaining("{,}"),
    ]);
    expect(
      messages(withFormula("\\htmlId{part-2024}{2}^{3}"), "numbers"),
    ).toEqual([]);
  });
});

describe("glossary", () => {
  it("rejects forbidden synonyms, composed or decomposed", () => {
    const text = "Viết tích dưới dạng lũy thừa.";
    expect(messages(withNote(text), "glossary")).toEqual([
      'Use "luỹ thừa" instead of "lũy thừa"',
    ]);
    expect(messages(withNote(text.normalize("NFD")), "glossary")).toEqual([
      'Use "luỹ thừa" instead of "lũy thừa"',
    ]);
    expect(messages(withNote("Viết dưới dạng luỹ thừa."), "glossary")).toEqual(
      [],
    );
  });

  it("matches whole words only", () => {
    const input = fixtureInput();
    input.glossary = {
      terms: [{ term: "thừa số", forbidden: ["tử"] }],
      names: [],
    };
    expect(
      messages(withNote("Tính tử trước.", input), "glossary"),
    ).toHaveLength(1);
    expect(messages(withNote("Tìm nhân tử.", input), "glossary")).toHaveLength(
      1,
    );
    expect(messages(withNote("Tìm thừa số.", input), "glossary")).toEqual([]);
  });

  it("keeps concept colours as in the glossary", () => {
    const input = fixtureInput();
    const concept = input.lesson.concepts[0];
    if (!concept) throw new Error("fixture concept moved");
    concept.color = "pink";
    expect(findings(input, "glossary")).toMatchObject([
      { path: ["concepts", 0, "color"] },
    ]);
  });

  it("paints formula symbols only in colours of the lesson's concepts", () => {
    const tex = (color: string) => `\\concept{${color}}{2}^{3} = 8`;
    expect(findings(withFormula(tex("blue")), "glossary")).toEqual([]);
    expect(findings(withFormula(tex("teal")), "glossary")).toMatchObject([
      { path: FORMULA_PATH, message: "No concept of this lesson is teal" },
    ]);
    expect(findings(withFormula(tex("#f00")), "glossary")).toMatchObject([
      {
        path: FORMULA_PATH,
        message: '"\\concept{#f00}" is not a concept colour',
      },
    ]);
  });

  it("accepts earlier-stage knowledge only for prerequisite terms", () => {
    const input = fixtureInput();
    const [card] = input.lesson.cards;
    const concept = input.lesson.concepts.find(
      (c) => c.id === card?.conceptIds[0],
    );
    if (!card || !concept) throw new Error("fixture card moved");
    card.sourceRef = "Kiến thức nền (tiểu học); tr.22";
    const path = ["cards", 0, "sourceRef"];
    expect(findings(input, "glossary")).toMatchObject([
      { path, message: expect.stringMatching(/needs a concept/) },
    ]);

    input.glossary = {
      terms: [
        {
          term: concept.name,
          forbidden: [],
          color: concept.color,
          prerequisite: "tiểu học",
        },
      ],
      names: [],
    };
    expect(findings(input, "glossary")).toEqual([]);

    card.sourceRef = "Kiến thức nền; tr.22";
    expect(findings(input, "glossary")).toMatchObject([
      { path, message: expect.stringMatching(/one of: tiểu học/) },
    ]);
  });

  it("flags a glossary whose forbidden word is also a term", () => {
    const raw = fixtureContent();
    const glossary = raw.glossaries.find((g) => g.subject === "math");
    const data = glossary?.data as GlossaryFile;
    data.terms.push({ term: "luỹ thừa", forbidden: ["tích"] });
    const errors = checkContent(raw, visualRegistry).issues.map(formatIssue);
    expect(errors).toContainEqual(
      expect.stringMatching(
        /math\.json \$\.terms\[\d+\]\.term: Duplicate term/,
      ),
    );
    expect(errors).toContainEqual(
      expect.stringMatching(/forbidden\[0\]: "tích" is itself a glossary term/),
    );
  });
});

describe("vietnamese", () => {
  it.each([
    "con",
    "ban",
    "to",
    "me",
    "Ví",
    "dụ",
    "nghiêng",
    "khuya",
    "quyển",
    "quỳnh",
    "giữa",
    "gì",
    "xoong",
    "luỹ",
    "lũy",
    "chuyện",
    "Đường",
  ])("accepts the syllable %s", (word) => {
    expect(isVietnameseSyllable(word)).toBe(true);
    expect(isVietnameseSyllable(word.normalize("NFD"))).toBe(true);
  });

  it.each([
    "hello",
    "page",
    "click",
    "and",
    "cat",
    "ka",
    "ce",
    "ghu",
    "ngi",
    "quo",
    "fa",
    "àá",
  ])("rejects %s", (word) => {
    expect(isVietnameseSyllable(word)).toBe(false);
  });

  it("blocks English words in text and lists each once", () => {
    expect(
      messages(withNote("Click vào page, click nữa."), "vietnamese"),
    ).toEqual([
      expect.stringMatching(/^Not Vietnamese: "Click", "page", "click";/),
    ]);
  });

  it("allows variables, units, abbreviations, glossary terms and names", () => {
    const input = fixtureInput();
    input.glossary = { terms: [], names: ["Andersen"] };
    const text = "Với n, xe đi 60 km/h; SGK tr.22 của Andersen.";
    expect(messages(withNote(text, input), "vietnamese")).toEqual([]);
    expect(messages(withNote("aⁿ là luỹ thừa."), "vietnamese")).toEqual([]);
  });
});

describe("length", () => {
  it("counts syllables and splits sentences like a reader", () => {
    expect(syllableCount("Có 12 345 hạt thóc.")).toBe(4);
    expect(sentences("Ví dụ: 2 · 3 = 6. Xem SGK tr. 22 nhé!")).toEqual([
      "Ví dụ: 2 · 3 = 6.",
      "Xem SGK tr. 22 nhé!",
    ]);
    expect(sentences("Số 2,5 lớn hơn 2... Đúng không?")).toHaveLength(2);
  });

  it("limits sentences to the syllable maximum", () => {
    const long = `${Array.from({ length: 26 }, () => "một").join(" ")}.`;
    const ok = `${Array.from({ length: 25 }, () => "một").join(" ")}.`;
    expect(messages(withNote(long), "length")).toEqual([
      expect.stringContaining("26 syllables"),
    ]);
    expect(messages(withNote(ok), "length")).toEqual([]);
  });

  it("limits notes to two sentences", () => {
    expect(messages(withNote("Một câu. Hai câu. Ba câu."), "length")).toEqual([
      expect.stringContaining("3 sentences"),
    ]);
    expect(messages(withNote("Ví dụ: một câu. Hai câu."), "length")).toEqual(
      [],
    );
  });
});

describe("recap", () => {
  const RECAP_PATH = ["sections", 1, "recap", "caption"];

  it("limits section and card recap captions to two sentences", () => {
    const input = fixtureInput();
    const sectionRecap = input.lesson.sections[1]?.recap;
    const cardRecap = input.lesson.cards[2]?.recap;
    if (sectionRecap?.type !== "visual" || cardRecap?.type !== "visual") {
      throw new Error("fixture visual recaps moved");
    }
    sectionRecap.caption = "Một câu. Hai câu! Ba câu?";
    cardRecap.caption = "Một câu… Hai câu. Ba câu.";
    expect(findings(input, "recap")).toMatchObject([
      { path: RECAP_PATH, message: expect.stringContaining("3 sentences") },
      {
        path: ["cards", 2, "recap", "caption"],
        message: expect.stringContaining("3 sentences"),
      },
    ]);
  });

  it("counts sentences like a reader: decimals, abbreviations, quotes", () => {
    const input = fixtureInput();
    const recap = input.lesson.sections[1]?.recap;
    if (recap?.type !== "visual") throw new Error("fixture recap moved");
    recap.caption = "Đọc 2,5 là “hai phẩy năm”. Xem SGK tr. 22 nhé.";
    expect(messages(input, "recap")).toEqual([]);
  });

  it("skips formula recaps, which have no caption", () => {
    const input = fixtureInput();
    expect(input.lesson.sections[0]?.recap.type).toBe("formula");
    expect(messages(input, "recap")).toEqual([]);
  });
});

describe("card-exercises", () => {
  it("requires the minimum number of exercises per card, steps included", () => {
    const input = fixtureInput();
    const found = input.lesson.exercises.find(
      (e) => e.id === "fixture.ex.chon-luy-thua",
    );
    if (!found) throw new Error("fixture exercise moved");
    found.cardIds = [];
    expect(findings(input, "card-exercises")).toMatchObject([
      {
        path: ["cards", 1],
        severity: "error",
        message: `Card "fixture.card.luy-thua" needs at least ${MIN_EXERCISES_PER_CARD} exercises, has ${MIN_EXERCISES_PER_CARD - 1}`,
      },
    ]);
  });

  it("counts an openEnded step towards its card", () => {
    // fixture.card.doc-hieu reaches the minimum only with its openEnded step.
    expect(messages(fixtureInput(), "card-exercises")).toEqual([]);
  });
});

describe("group blocks", () => {
  // The fixture's first section with its note and formula moved into a group.
  function withGroup(text: string): LintInput {
    const input = withNote(text);
    const section = input.lesson.sections[0];
    const [note, visual, formula] = section?.blocks ?? [];
    if (!section || note?.type !== "note" || formula?.type !== "formula") {
      throw new Error("fixture blocks moved");
    }
    if (visual?.type !== "visual") throw new Error("fixture visual moved");
    section.blocks = [{ type: "group", children: [note, formula, visual] }];
    return input;
  }

  it("applies the note and text rules to the sentence inside a group", () => {
    const path = ["sections", 0, "blocks", 0, "children", 0, "text"];
    const length = findings(withGroup("Một câu. Hai câu. Ba câu."), "length");
    expect(length.map((f) => [f.path, f.message])).toEqual([
      [path, expect.stringContaining("3 sentences")],
    ]);
    expect(
      findings(withGroup("Nhân lên được 1234 hạt."), "numbers").map(
        (f) => f.path,
      ),
    ).toEqual([path]);
    expect(findings(withGroup("Nhân lên được 12 hạt."), "fields")).toEqual([]);
  });
});

describe("check-expr", () => {
  it("evaluates textbook expressions", () => {
    expect(evaluateExpr("2^3·2^2")).toEqual({ ok: true, value: 32 });
    expect(evaluateExpr("(2+3)·4 : 2")).toEqual({ ok: true, value: 10 });
    expect(evaluateExpr("2^3^2")).toEqual({ ok: true, value: 512 });
    expect(evaluateExpr("10 - -2^2")).toEqual({ ok: true, value: 14 });
    expect(evaluateExpr("2,5·2")).toEqual({ ok: true, value: 5 });
    expect(evaluateExpr("1 000 : 10")).toEqual({ ok: true, value: 100 });
    for (const bad of ["2·", "(2", "2 3)", "2.5", "4 : 0", "a"]) {
      expect(evaluateExpr(bad).ok).toBe(false);
    }
    expect(texValue("\\htmlId{co-so}{2}^{\\htmlId{so-mu}{3}}")).toBe(8);
    expect(
      texValue("\\htmlId{co-so}{\\concept{blue}{2}}^{\\concept{violet}{3}}"),
    ).toBe(8);
    expect(texValue("2{,}5 \\cdot 2")).toBe(5);
    expect(texValue("\\frac{1}{2}")).toBeUndefined();
    expect(texValue("3 + 3 = 6")).toBeUndefined();
    expect(textValue("1 024")).toBe(1024);
    expect(textValue("tám")).toBeUndefined();
  });

  it("requires check.expr on numeric exercises of math lessons", () => {
    const input = fixtureInput();
    delete numericExercise(input.lesson, "fixture.ex.dem-cham").check;
    expect(findings(input, "check-expr")).toMatchObject([
      { path: ["exercises", 2] },
    ]);
    input.lesson.subject = "literature";
    expect(findings(input, "check-expr")).toEqual([]);
  });

  it("compares numeric answers, including powers", () => {
    const input = fixtureInput();
    numericExercise(input.lesson, "fixture.ex.dem-cham").answer = {
      kind: "value",
      value: 5,
    };
    numericExercise(input.lesson, "fixture.ex.viet-luy-thua").answer = {
      kind: "power",
      base: 3,
      exponent: 2,
    };
    expect(messages(input, "check-expr")).toEqual([
      "Answer is 5 but check.expr gives 6",
      "Answer is 9 but check.expr gives 8",
    ]);
  });

  it("reports an expression it cannot evaluate", () => {
    const input = fixtureInput();
    numericExercise(input.lesson, "fixture.ex.dem-cham").check = {
      expr: "2·(3",
    };
    expect(findings(input, "check-expr")).toMatchObject([
      { path: ["exercises", 2, "check", "expr"] },
    ]);
  });

  it("checks that exactly the answer options match in a choice", () => {
    const input = fixtureInput();
    const exercise = choiceExercise(input.lesson, "fixture.ex.chon-luy-thua");
    exercise.check = { expr: "2^3" };
    expect(messages(input, "check-expr")).toEqual([]);

    exercise.answer = ["a"];
    expect(messages(input, "check-expr")).toEqual([
      "Option equals check.expr (8) but is not an answer",
    ]);
    exercise.answer = ["a", "b", "c"];
    expect(messages(input, "check-expr")).toEqual([
      "Answer option is 6 but check.expr gives 8",
    ]);
    exercise.options[0] = {
      id: "a",
      content: { type: "text", text: "tám" },
    };
    exercise.answer = ["a", "b"];
    expect(messages(input, "check-expr")).toEqual([
      "Answer option has no computable value to verify",
    ]);
  });
});

describe("passage", () => {
  it("accepts passages that differ only in typography", () => {
    const input = fixtureInput();
    input.sourcePassage = `“Minh”   có một người bạn tên là Lan.\n\nHai bạn thường cùng nhau đi học. Một hôm, Lan bị ốm và phải nghỉ học. Minh chép bài giúp Lan và mang sang nhà bạn.`;
    const passage = input.lesson.sections[1]?.blocks[0];
    if (passage?.type !== "passage") throw new Error("fixture passage moved");
    const first = passage.paragraphs[0]?.sentences[0];
    if (!first) throw new Error("fixture sentence moved");
    first.text = '"Minh" có một người bạn tên là Lan.';
    expect(messages(input, "passage")).toEqual([]);
  });

  it("rejects a changed word, in sections and in exercise prompts", () => {
    const input = fixtureInput();
    input.sourcePassage = input.sourcePassage?.replace("chép bài", "chép vở");
    expect(findings(input, "passage").map((f) => f.path)).toEqual([
      ["sections", 1, "blocks", 0],
      ["exercises", 9, "prompt", 0],
    ]);
  });

  it("requires the source file for verbatim subjects only", () => {
    const input = fixtureInput();
    delete input.sourcePassage;
    expect(messages(input, "passage")).toEqual([]);
    input.lesson.subject = "literature";
    expect(messages(input, "passage")).toEqual([
      "Passages need source-passage.txt next to lesson.json",
    ]);
  });
});

describe("review-hash", () => {
  it("ignores status, reviewedHash, key order and Unicode composition", () => {
    const { lesson } = fixtureInput();
    const hash = computeReviewedHash(lesson);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    const reordered = Object.fromEntries(
      Object.entries(lesson).reverse(),
    ) as Lesson;
    expect(computeReviewedHash(reordered)).toBe(hash);
    expect(
      computeReviewedHash({
        ...lesson,
        status: "published",
        reviewedHash: hash,
      }),
    ).toBe(hash);
    const decomposed = { ...lesson, title: lesson.title.normalize("NFD") };
    expect(computeReviewedHash(decomposed)).toBe(hash);
    expect(computeReviewedHash({ ...lesson, title: "Bài khác" })).not.toBe(
      hash,
    );
  });

  it("blocks a published lesson without a matching hash", () => {
    const input = fixtureInput();
    input.lesson.status = "published";
    expect(findings(input, "review-hash")).toMatchObject([
      { path: ["status"], severity: "error" },
    ]);

    input.lesson.reviewedHash = computeReviewedHash(input.lesson);
    expect(findings(input, "review-hash")).toEqual([]);

    withNote("Có ba hàng chấm.", input);
    expect(findings(input, "review-hash")).toMatchObject([
      { path: ["reviewedHash"], severity: "error" },
    ]);
  });

  it("only warns about a stale hash on a draft", () => {
    const input = fixtureInput();
    input.lesson.reviewedHash = computeReviewedHash(input.lesson);
    withNote("Có ba hàng chấm.", input);
    expect(findings(input, "review-hash")).toMatchObject([
      { path: ["reviewedHash"], severity: "warning" },
    ]);
  });
});

describe("authoring rules", () => {
  const AUTHORING: LintRule[] = [
    "screens",
    "practice",
    "recap",
    "review-bank",
    "placeholder",
  ];

  function exerciseOf(input: LintInput, id: string) {
    const found = input.lesson.exercises.find(
      (e) => e.id === `bai-moi.ex.${id}`,
    );
    if (!found) throw new Error(`skeleton exercise ${id} moved`);
    return found;
  }

  it("skip the fixture lesson, which exercises every renderer path", () => {
    const input = fixtureInput();
    expect(input.lesson.sections[0]?.recap.type).toBe("formula");
    for (const rule of AUTHORING) expect(findings(input, rule)).toEqual([]);
  });

  it("find nothing in the skeleton but its placeholder visuals", () => {
    const input = skeletonInput();
    for (const rule of AUTHORING.filter((r) => r !== "placeholder")) {
      expect(findings(input, rule)).toEqual([]);
    }
  });

  it("warn about a note or formula alone on a screen", () => {
    const input = skeletonInput();
    const section = input.lesson.sections[0];
    if (!section) throw new Error("skeleton section moved");
    section.blocks.push(
      { type: "note", text: "Một câu." },
      { type: "formula", tex: "1 + 1 = 2" },
    );
    expect(findings(input, "screens")).toMatchObject([
      { path: ["sections", 0, "blocks", 2], severity: "warning" },
      { path: ["sections", 0, "blocks", 3], severity: "warning" },
    ]);
  });

  it("allow one practice exercise per card", () => {
    const input = skeletonInput();
    input.lesson.sections[0]?.practiceIds.push("bai-moi.ex.chon-tich");
    expect(findings(input, "practice")).toMatchObject([
      {
        path: ["cards", 0],
        severity: "error",
        message: expect.stringContaining("2 practice exercises"),
      },
    ]);
  });

  it("require a recap to be a visual with a caption", () => {
    const input = skeletonInput();
    const section = input.lesson.sections[0];
    const card = input.lesson.cards[0];
    if (!section || card?.recap.type !== "visual") {
      throw new Error("skeleton recaps moved");
    }
    section.recap = { type: "formula", tex: "2 \\cdot 3 = 6" };
    card.recap = { type: "visual", visualId: card.recap.visualId };
    expect(findings(input, "recap")).toMatchObject([
      { path: ["sections", 0, "recap"], severity: "error" },
      { path: ["cards", 0, "recap"], severity: "error" },
    ]);
  });

  it("warn when a review exercise repeats the practice numbers", () => {
    const input = skeletonInput();
    const practice = exerciseOf(input, "tinh-tich");
    const bank = exerciseOf(input, "tinh-tich-khac");
    bank.prompt = structuredClone(practice.prompt);
    expect(findings(input, "review-bank")).toMatchObject([
      {
        path: ["exercises", 3, "prompt"],
        severity: "warning",
        message: expect.stringContaining('"bai-moi.ex.tinh-tich"'),
      },
    ]);
  });

  it("read superscripts and grouped thousands as numbers of their own", () => {
    const input = skeletonInput();
    exerciseOf(input, "tinh-tich").prompt = [
      { type: "note", text: "Tính 3⁵ và 1\u202f000." },
    ];
    const bank = exerciseOf(input, "tinh-tich-khac");
    bank.prompt = [{ type: "formula", tex: "5^{3} + 1\\,000" }];
    expect(findings(input, "review-bank")).toHaveLength(1);
    bank.prompt = [{ type: "note", text: "Tính 35 và 1000." }];
    expect(findings(input, "review-bank")).toEqual([]);
  });

  it("warn about placeholder visuals in a draft and block them once published", () => {
    const input = skeletonInput();
    expect(findings(input, "placeholder")).toMatchObject([
      { path: ["sections", 0, "blocks", 0, "visualId"], severity: "warning" },
      { path: ["sections", 0, "recap", "visualId"], severity: "warning" },
      { path: ["cards", 0, "recap", "visualId"], severity: "warning" },
      { path: ["sticker", "visualId"], severity: "warning" },
    ]);
    input.lesson.status = "published";
    expect(
      findings(input, "placeholder").every((f) => f.severity === "error"),
    ).toBe(true);
  });
});
