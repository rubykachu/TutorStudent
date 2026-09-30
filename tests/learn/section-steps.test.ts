import { describe, expect, it } from "vitest";
import {
  resumeStepIndex,
  sectionSteps,
  stepLabels,
} from "@/learn/section-steps";
import { LESSON_ID, learnIndex, learnLesson, SECTION_ID } from "./helpers";

function section(overrides: Parameters<typeof learnLesson>[0] = {}) {
  const index = learnIndex(overrides);
  const found = index.sectionById.get(SECTION_ID);
  if (!found) throw new Error("section missing");
  return { index, section: found };
}

describe("sectionSteps", () => {
  it("lists blocks, checks, practice and the recap in order", () => {
    const { index, section: s } = section();
    const steps = sectionSteps(s, index);
    expect(steps.map((step) => [step.kind, step.position])).toEqual([
      ["block", { phase: "blocks", index: 0 }],
      ["block", { phase: "blocks", index: 1 }],
      ["exercise", { phase: "check", index: 0 }],
      ["exercise", { phase: "practice", index: 0 }],
      ["exercise", { phase: "practice", index: 1 }],
      ["recap", { phase: "recap", index: 0 }],
    ]);
    const exercises = steps.flatMap((step) =>
      step.kind === "exercise" ? [[step.context, step.exercise.id]] : [],
    );
    expect(exercises).toEqual([
      ["check", `${LESSON_ID}.ex.kiem-tra`],
      ["practice", `${LESSON_ID}.ex.luyen-a`],
      ["practice", `${LESSON_ID}.ex.luyen-b`],
    ]);
  });

  it("counts a group of blocks as one screen", () => {
    const [first] = learnLesson().sections;
    const { index, section: s } = section({
      sections: [
        {
          ...first,
          blocks: [
            {
              type: "group",
              children: [
                { type: "note", text: "Quy tắc" },
                { type: "formula", tex: "2^{3} = 8" },
              ],
            },
          ],
        },
      ],
    });
    const blocks = sectionSteps(s, index).filter((st) => st.kind === "block");
    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toMatchObject({
      position: { phase: "blocks", index: 0 },
      block: { type: "group" },
    });
  });

  it("skips missing exercises without gaps in positions", () => {
    const base = learnLesson();
    const [first] = base.sections;
    const { index, section: s } = section({
      sections: [
        {
          ...first,
          practiceIds: [`${LESSON_ID}.ex.gone`, `${LESSON_ID}.ex.luyen-b`],
        },
      ],
    });
    const practice = sectionSteps(s, index).filter(
      (step) => step.position.phase === "practice",
    );
    expect(practice).toHaveLength(1);
    expect(practice[0]).toMatchObject({
      position: { phase: "practice", index: 0 },
      exercise: { id: `${LESSON_ID}.ex.luyen-b` },
    });
  });
});

describe("resumeStepIndex", () => {
  const { index, section: s } = section();
  const steps = sectionSteps(s, index);

  it("finds the saved item", () => {
    expect(resumeStepIndex(steps, { phase: "practice", index: 1 })).toBe(4);
    expect(resumeStepIndex(steps, { phase: "recap", index: 0 })).toBe(5);
  });

  it("restarts the phase when the saved item is gone", () => {
    expect(resumeStepIndex(steps, { phase: "practice", index: 7 })).toBe(3);
  });

  it("restarts the section when the phase has no items left", () => {
    const noChecks = steps.filter((step) => step.position.phase !== "check");
    expect(resumeStepIndex(noChecks, { phase: "check", index: 0 })).toBe(0);
  });
});

describe("stepLabels", () => {
  it("names theory screens, counts every exercise as a question, and names the recap", () => {
    const { index, section: s } = section();
    expect(stepLabels(sectionSteps(s, index))).toEqual([
      "Lý thuyết 1",
      "Lý thuyết 2",
      "Câu 1",
      "Câu 2",
      "Câu 3",
      "Nhớ nhé",
    ]);
  });
});
