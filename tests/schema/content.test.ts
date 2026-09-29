// @vitest-environment node
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  BASIC_EXERCISE_TYPES,
  BlockSchema,
  ContentIndexSchema,
  ExerciseSchema,
  LessonSchema,
  SectionBlockSchema,
  SubjectsFileSchema,
} from "@/schema/content";

function readJson(relative: string): unknown {
  return JSON.parse(readFileSync(path.join(process.cwd(), relative), "utf8"));
}

const fixture = () =>
  readJson("content/_fixture/math/kntt/fixture/lesson.json") as Record<
    string,
    unknown
  >;

const baseExercise = {
  id: "bai.ex.mot",
  cardIds: [],
  prompt: [{ type: "note", text: "Câu hỏi." }],
  hints: { highlight: [] },
  difficulty: 1,
};

function issuePaths(result: { success: boolean; error?: z.ZodError }) {
  return result.error?.issues.map((issue) => issue.path.join(".")) ?? [];
}

describe("LessonSchema", () => {
  it("accepts the fixture lesson", () => {
    const result = LessonSchema.safeParse(fixture());
    expect(result.error?.issues ?? []).toEqual([]);
  });

  it("the fixture covers every basic exercise type plus openEnded", () => {
    const lesson = LessonSchema.parse(fixture());
    const types = new Set(lesson.exercises.map((e) => e.type));
    for (const type of BASIC_EXERCISE_TYPES) expect(types).toContain(type);
    expect(types).toContain("openEnded");
  });

  it("rejects ids whose kind segment does not match the entity", () => {
    const lesson = fixture();
    const [card] = lesson.cards as Record<string, unknown>[];
    if (!card) throw new Error("no card");
    card.id = "fixture.ex.nhan-lap";
    expect(issuePaths(LessonSchema.safeParse(lesson))).toContain("cards.0.id");
  });

  it("rejects concept colours that are not design tokens", () => {
    const lesson = fixture();
    const [concept] = lesson.concepts as Record<string, unknown>[];
    if (!concept) throw new Error("no concept");
    concept.color = "red";
    expect(issuePaths(LessonSchema.safeParse(lesson))).toContain(
      "concepts.0.color",
    );
  });

  it("accepts a published lesson with a sha256 reviewedHash only", () => {
    const lesson = { ...fixture(), status: "published" };
    expect(
      LessonSchema.safeParse({ ...lesson, reviewedHash: "a".repeat(64) })
        .success,
    ).toBe(true);
    expect(
      issuePaths(LessonSchema.safeParse({ ...lesson, reviewedHash: "abc" })),
    ).toContain("reviewedHash");
  });
});

describe("ExerciseSchema", () => {
  it("accepts value and power numeric answers with an optional check", () => {
    expect(
      ExerciseSchema.safeParse({
        ...baseExercise,
        type: "numeric",
        answer: { kind: "value", value: 2.5 },
      }).success,
    ).toBe(true);
    expect(
      ExerciseSchema.safeParse({
        ...baseExercise,
        type: "numeric",
        answer: { kind: "power", base: 2, exponent: 3 },
        check: { expr: "2·2·2" },
      }).success,
    ).toBe(true);
  });

  it("rejects negative or fractional exponents and out-of-range difficulty", () => {
    const result = ExerciseSchema.safeParse({
      ...baseExercise,
      difficulty: 4,
      type: "numeric",
      answer: { kind: "power", base: 2, exponent: -1 },
    });
    expect(issuePaths(result)).toEqual(
      expect.arrayContaining(["difficulty", "answer.exponent"]),
    );
  });

  it("rejects an openEnded exercise with cards or nested openEnded steps", () => {
    const result = ExerciseSchema.safeParse({
      ...baseExercise,
      cardIds: ["bai.card.mot"],
      type: "openEnded",
      steps: [{ ...baseExercise, type: "openEnded" }],
      writing: { starter: "Em", rubric: ["Đủ ý."] },
    });
    expect(issuePaths(result)).toEqual(
      expect.arrayContaining(["cardIds", "steps.0.type"]),
    );
  });
});

describe("BlockSchema", () => {
  it("accepts image blocks from https or app paths only", () => {
    const image = { type: "image", alt: "Bản đồ" };
    expect(
      BlockSchema.safeParse({
        ...image,
        src: "https://media.example.org/a.svg",
      }).success,
    ).toBe(true);
    expect(
      BlockSchema.safeParse({ ...image, src: "/content/a.svg" }).success,
    ).toBe(true);
    expect(
      BlockSchema.safeParse({ ...image, src: "http://example.org/a.svg" })
        .success,
    ).toBe(false);
  });

  it("rejects blank text", () => {
    expect(BlockSchema.safeParse({ type: "note", text: "   " }).success).toBe(
      false,
    );
  });
});

describe("SectionBlockSchema", () => {
  const note = { type: "note", text: "Nhân hai luỹ thừa cùng cơ số." };
  const formula = { type: "formula", tex: "5^{2} \\cdot 5^{4} = 5^{6}" };

  it("accepts a group of short parts shown on one screen", () => {
    const visual = { type: "visual", visualId: "bai.visual.hinh" };
    expect(
      SectionBlockSchema.safeParse({
        type: "group",
        children: [note, formula, visual],
      }).success,
    ).toBe(true);
  });

  it("rejects a group of one, a nested group and long or moving parts", () => {
    const group = (children: unknown[]) =>
      SectionBlockSchema.safeParse({ type: "group", children }).success;
    expect(group([note])).toBe(false);
    expect(group([note, { type: "group", children: [note, formula] }])).toBe(
      false,
    );
    expect(group([note, { type: "video", videoId: "bai.video.mot" }])).toBe(
      false,
    );
    const passage = { type: "passage", paragraphs: [], annotations: [] };
    expect(group([note, passage])).toBe(false);
    expect(group([note, { type: "note", text: " " }])).toBe(false);
  });

  it("keeps groups out of exercise prompts and recaps", () => {
    const group = { type: "group", children: [note, formula] };
    expect(BlockSchema.safeParse(group).success).toBe(false);
    expect(
      ExerciseSchema.safeParse({
        ...baseExercise,
        type: "choice",
        prompt: [group],
      }).success,
    ).toBe(false);
    const lesson = fixture();
    const sections = lesson.sections as Record<string, unknown>[];
    const first = sections[0] as Record<string, unknown>;
    first.recap = group;
    expect(LessonSchema.safeParse(lesson).success).toBe(false);
    first.recap = formula;
    first.blocks = [group];
    expect(LessonSchema.safeParse(lesson).success).toBe(true);
  });
});

describe("SubjectsFileSchema", () => {
  it("accepts content/subjects.json with the three subjects", () => {
    const subjects = SubjectsFileSchema.parse(
      readJson("content/subjects.json"),
    );
    expect(subjects.subjects.map((s) => [s.id, s.defaultSeries])).toEqual([
      ["math", "kntt"],
      ["literature", "ctst"],
      ["geography", "kntt"],
    ]);
  });
});

describe("z.toJSONSchema", () => {
  it.each([
    ["lesson", LessonSchema, "properties"],
    ["exercise", ExerciseSchema, "oneOf"],
    ["content index", ContentIndexSchema, "properties"],
  ])("converts the %s schema without throwing", (_name, schema, key) => {
    expect(z.toJSONSchema(schema)).toHaveProperty(key);
  });
});
