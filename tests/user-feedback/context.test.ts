import { describe, expect, it } from "vitest";
import { sectionSteps } from "@/learn/section-steps";
import {
  lessonFeedbackContext,
  reviewFeedbackContext,
  sectionFeedbackContext,
} from "@/user-feedback/context";
import { FeedbackRequestSchema } from "@/user-feedback/schema";
import { LESSON_ID, learnIndex, SECTION_ID } from "../learn/helpers";

const index = learnIndex({
  number: 6,
  sections: [
    {
      ...learnIndex().lesson.sections[0],
      blocks: [
        { type: "note", text: "Khối" },
        { type: "video", videoId: `${LESSON_ID}.video.gioi-thieu` },
        {
          type: "tip",
          id: `${LESSON_ID}.tip.nhanh`,
          kind: "làm nhanh",
          title: "Mẹo",
          text: "Mẹo",
        },
      ],
    } as never,
  ],
});
const { lesson } = index;
const section = index.sectionById.get(SECTION_ID);
if (!section) throw new Error("section missing");
const steps = sectionSteps(section, index);

// A context passes the request schema once the device fields are added.
function valid(context: object): boolean {
  return FeedbackRequestSchema.safeParse({
    id: "0".repeat(32),
    ...context,
    reason: "kho-hieu",
    source: "be",
    device: { kind: "ipad", os: "ios" },
    createdAt: "2026-10-05T13:15:00.000Z",
  }).success;
}

describe("feedback context", () => {
  it("names the lesson for the lesson page, overview and tips", () => {
    for (const screen of ["lesson", "overview", "tips"] as const) {
      const context = lessonFeedbackContext(lesson, screen);
      expect(context).toEqual({
        lesson: LESSON_ID,
        lessonTitle: "Bài 6: Bài học thử",
        subject: lesson.subject,
        grade: lesson.grade,
        section: null,
        sectionNumber: null,
        sectionTitle: null,
        item: null,
        step: null,
        screen,
      });
      expect(valid(context)).toBe(true);
    }
  });

  it("gives each section step its screen, item and step", () => {
    const got = steps.map((step) => {
      const c = sectionFeedbackContext(lesson, section, step);
      expect(valid(c)).toBe(true);
      return [c.screen, c.item, c.step];
    });
    expect(got).toEqual([
      ["block", null, "blocks-0"],
      ["block", `${LESSON_ID}.video.gioi-thieu`, "blocks-1"],
      ["block", `${LESSON_ID}.tip.nhanh`, "blocks-2"],
      ["exercise", `${LESSON_ID}.ex.kiem-tra`, "check-0"],
      ["exercise", `${LESSON_ID}.ex.luyen-a`, "practice-0"],
      ["exercise", `${LESSON_ID}.ex.luyen-b`, "practice-1"],
      ["recap", null, "recap-0"],
    ]);
    const done = sectionFeedbackContext(lesson, section, null);
    expect(done).toMatchObject({
      screen: "done",
      section: SECTION_ID,
      sectionNumber: 1,
      sectionTitle: "Phần một",
      item: null,
      step: null,
    });
  });

  it("places a review exercise in its section", () => {
    const c = reviewFeedbackContext(lesson, `${LESSON_ID}.ex.luyen-b`);
    expect(c).toMatchObject({
      screen: "review",
      section: SECTION_ID,
      sectionNumber: 1,
      item: `${LESSON_ID}.ex.luyen-b`,
    });
    expect(valid(c)).toBe(true);
  });
});
