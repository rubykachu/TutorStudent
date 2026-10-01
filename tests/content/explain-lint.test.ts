// @vitest-environment node
import { describe, expect, it } from "vitest";
import { lintLesson } from "@/content/lint";
import type { Finding, LintInput } from "@/content/lint/types";
import {
  type GlossaryFile,
  GlossaryFileSchema,
  type Lesson,
  LessonSchema,
} from "@/schema/content";
import { fixtureContent, readSkeleton, subjectOf } from "./helpers";

function skeletonInput(legacy?: LintInput["legacy"]): LintInput {
  const glossary: GlossaryFile = GlossaryFileSchema.parse(
    fixtureContent().glossaries.find((g) => g.subject === "math")?.data,
  );
  return {
    file: "lesson.json",
    lesson: LessonSchema.parse(readSkeleton()),
    fixture: false,
    subject: subjectOf("math"),
    glossary,
    ...(legacy === undefined ? {} : { legacy }),
  };
}

function explainFindings(input: LintInput): Finding[] {
  return lintLesson(input).filter((f) => f.rule === "explain");
}

function withoutExplain(lesson: Lesson) {
  for (const exercise of lesson.exercises) delete exercise.explain;
}

function choice(lesson: Lesson, id: string) {
  const found = lesson.exercises.find((e) => e.id === id);
  if (found?.type !== "choice") throw new Error(`no choice ${id}`);
  return found;
}

describe("explain lint", () => {
  it("passes the skeleton, which explains every exercise", () => {
    expect(explainFindings(skeletonInput())).toEqual([]);
  });

  it("fails each exercise without an explanation in a new lesson", () => {
    const input = skeletonInput();
    withoutExplain(input.lesson);
    const found = explainFindings(input);
    expect(found).toHaveLength(input.lesson.exercises.length);
    expect(found.every((f) => f.severity === "error")).toBe(true);
    expect(found[0]?.path).toEqual(["exercises", 0, "explain"]);
  });

  it("asks nothing of an exempt legacy lesson or of the fixture", () => {
    const exempt = skeletonInput("exempt");
    withoutExplain(exempt.lesson);
    expect(explainFindings(exempt)).toEqual([]);
    const fixture = { ...skeletonInput(), fixture: true };
    withoutExplain(fixture.lesson);
    expect(explainFindings(fixture)).toEqual([]);
  });

  it("warns once, with the count, for a lesson whose explanations are due", () => {
    const input = skeletonInput("warn");
    withoutExplain(input.lesson);
    const [only, ...rest] = explainFindings(input);
    expect(rest).toEqual([]);
    expect(only).toMatchObject({
      severity: "warning",
      path: ["exercises"],
      message: expect.stringContaining("4 of 4 exercises"),
    });
  });

  it("tells a finished 'warn' lesson to leave the list", () => {
    const [only] = explainFindings(skeletonInput("warn"));
    expect(only).toMatchObject({
      severity: "warning",
      message: expect.stringContaining("delete this lesson"),
    });
  });

  it("limits the explanation and each reason to three sentences", () => {
    const input = skeletonInput();
    const exercise = choice(input.lesson, "bai-moi.ex.kiem-tra");
    const long = "Một câu. Hai câu. Ba câu. Bốn câu.";
    exercise.explain = {
      text: long,
      wrong: [{ optionId: "b", text: long }],
    };
    const messages = explainFindings(input).map((f) => f.message);
    expect(messages).toHaveLength(2);
    expect(messages[0]).toContain("4 sentences");
  });

  it("accepts wrong reasons for options that are not answers only", () => {
    const input = skeletonInput();
    const exercise = choice(input.lesson, "bai-moi.ex.kiem-tra");
    exercise.explain = {
      text: "Tích là 8.",
      wrong: [
        { optionId: "a", text: "Đây là đáp án." },
        { optionId: "z", text: "Không có." },
      ],
    };
    const messages = explainFindings(input).map((f) => f.message);
    expect(messages).toEqual([
      expect.stringContaining("is an answer"),
      expect.stringContaining('Unknown option "z"'),
    ]);
  });

  it("allows wrong reasons on choice exercises only", () => {
    const input = skeletonInput();
    const numeric = input.lesson.exercises.find((e) => e.type === "numeric");
    if (!numeric) throw new Error("no numeric exercise");
    numeric.explain = {
      text: "Nhân hai số.",
      wrong: [{ optionId: "a", text: "Sai." }],
    };
    expect(explainFindings(input).map((f) => f.message)).toEqual([
      expect.stringContaining("choice exercises only"),
    ]);
  });

  it("runs the Vietnamese text rules over the explanation", () => {
    const input = skeletonInput();
    const exercise = choice(input.lesson, "bai-moi.ex.kiem-tra");
    exercise.explain = { text: "Hello the world" };
    expect(
      lintLesson(input).some(
        (f) => f.rule === "vietnamese" && f.path.includes("explain"),
      ),
    ).toBe(true);
  });
});
