import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StickerStrip, stickerStripCaption } from "@/app/(child)/sticker-strip";
import type { LessonSummary } from "@/schema/content";

function lesson(id: string, name: string): LessonSummary {
  return {
    id,
    subject: "math",
    series: "kntt",
    order: 1,
    title: id,
    sourceRef: "SGK",
    sections: [1, 2, 3].map((n) => ({
      id: `${id}.section.${n}`,
      title: `Phần ${n}`,
      minutes: 5,
    })),
    cardCount: 1,
    hasOverview: false,
    sticker: { name, visualId: "fixture.visual.star-sticker" },
  };
}

describe("StickerStrip", () => {
  it("colours each sticker by the sections done, full once earned", () => {
    render(
      <StickerStrip
        lessons={[lesson("a", "Sao"), lesson("b", "Trăng"), lesson("c", "Mây")]}
        earnedLessonIds={new Set(["c"])}
        sections={[
          { lessonId: "a", sectionId: "a.section.1", state: "done" },
          { lessonId: "a", sectionId: "a.section.2", state: "done" },
          { lessonId: "a", sectionId: "a.section.3", state: "in_progress" },
          { lessonId: "b", sectionId: "b.section.1", state: "in_progress" },
        ]}
      />,
    );
    expect(
      screen.getByRole("img", { name: "Sticker Sao, đã tô 2/3 phần" }),
    ).toHaveAttribute("data-sticker-fill", "2/3");
    expect(
      screen.getByRole("img", { name: "Sticker Trăng, chưa nhận" }),
    ).toHaveAttribute("data-sticker-fill", "0/3");
    expect(screen.getByRole("img", { name: "Sticker Mây" })).toHaveAttribute(
      "data-sticker-earned",
      "true",
    );
    expect(
      screen.getByText("Đã có 1/3 sticker · 1 đang tô màu"),
    ).toBeInTheDocument();
  });

  it.each([
    [[{ done: 0, total: 3 }], "Học xong một bài là có sticker"],
    [
      [
        { done: 1, total: 3 },
        { done: 0, total: 2 },
      ],
      "Đã có 0/2 sticker · 1 đang tô màu",
    ],
    [
      [
        { done: 3, total: 3 },
        { done: 0, total: 2 },
      ],
      "Đã có 1/2 sticker",
    ],
  ])(
    "counts earned stickers and mentions those being coloured (%o)",
    (fills, text) => {
      expect(stickerStripCaption(fills)).toBe(text);
    },
  );
});
