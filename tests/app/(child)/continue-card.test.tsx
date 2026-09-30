import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContinueCard } from "@/app/(child)/continue-card";
import type { LessonSummary, Subject } from "@/schema/content";

const math: Subject = {
  id: "math",
  name: "Toán",
  color: "math",
  series: [{ id: "kntt", name: "Kết nối" }],
  defaultSeries: "kntt",
};

const lesson: LessonSummary = {
  id: "luy-thua",
  subject: "math",
  series: "kntt",
  order: 1,
  title: "Luỹ thừa",
  sourceRef: "SGK",
  sections: [
    { id: "luy-thua.section.mot", title: "Luỹ thừa là gì?", minutes: 8 },
    { id: "luy-thua.section.hai", title: "Bình phương", minutes: 8 },
  ],
  cardCount: 2,
  hasOverview: false,
  sticker: { name: "Sao", visualId: "fixture.visual.star-sticker" },
};

describe("ContinueCard", () => {
  it("opens a lesson on its overview until the child has seen it", () => {
    const withOverview = { ...lesson, hasOverview: true };
    const target = {
      lesson: withOverview,
      sectionIndex: 0,
      pausedIndex: null,
      started: false,
    };
    const { rerender } = render(
      <ContinueCard target={target} subject={math} overviewSeen={false} />,
    );
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/lessons/luy-thua",
    );
    rerender(<ContinueCard target={target} subject={math} overviewSeen />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/lessons/luy-thua/sections/luy-thua.section.mot",
    );
  });

  it("links straight into the next section of a started lesson", () => {
    render(
      <ContinueCard
        target={{ lesson, sectionIndex: 1, pausedIndex: null, started: true }}
        subject={math}
        overviewSeen={false}
      />,
    );
    const card = screen.getByRole("link", { name: /^Học tiếp/ });
    expect(card).toHaveAttribute(
      "href",
      "/lessons/luy-thua/sections/luy-thua.section.hai",
    );
    expect(card).toHaveTextContent("Luỹ thừa");
    expect(card).toHaveTextContent("Phần 2: Bình phương");
  });

  it("says Bắt đầu học for a lesson never opened", () => {
    render(
      <ContinueCard
        target={{ lesson, sectionIndex: 0, pausedIndex: null, started: false }}
        subject={math}
        overviewSeen={false}
      />,
    );
    const card = screen.getByRole("link", { name: /^Bắt đầu học/ });
    expect(card).toHaveAttribute(
      "href",
      "/lessons/luy-thua/sections/luy-thua.section.mot",
    );
  });

  it("mentions a later section left half-way under the one to study", () => {
    render(
      <ContinueCard
        target={{ lesson, sectionIndex: 0, pausedIndex: 1, started: true }}
        subject={math}
        overviewSeen={false}
      />,
    );
    const card = screen.getByRole("link", { name: /^Học tiếp/ });
    expect(card).toHaveAttribute(
      "href",
      "/lessons/luy-thua/sections/luy-thua.section.mot",
    );
    expect(card).toHaveTextContent("Phần 1: ");
    expect(card).toHaveTextContent("Đang dở: Phần 2");
  });
});
