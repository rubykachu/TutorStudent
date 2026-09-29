import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SubjectTile } from "@/components/subject-tile";
import type { SubjectStatus } from "@/learn/next-step";
import type { Subject } from "@/schema/content";

const math: Subject = {
  id: "math",
  name: "Toán",
  color: "math",
  series: [{ id: "kntt", name: "Kết nối" }],
  defaultSeries: "kntt",
};

function renderTile(status: SubjectStatus, nudgeDays: number | null = null) {
  render(
    <SubjectTile
      subject={math}
      href="/subjects/math"
      progress={{ done: 0, total: 1 }}
      status={status}
      nudgeDays={nudgeDays}
    />,
  );
  return screen.getByRole("link", { name: /Toán/ });
}

describe("SubjectTile", () => {
  it.each<[SubjectStatus, string]>([
    [{ kind: "empty" }, "Sắp có bài"],
    [{ kind: "new", total: 2 }, "2 bài · Chưa học"],
    [
      { kind: "learning", total: 1, sectionNumber: 2 },
      "1 bài · Đang học phần 2",
    ],
    [{ kind: "progress", done: 1, total: 1 }, "Xong 1/1 bài"],
  ])("always shows a subtitle under the name (%o)", (status, text) => {
    const tile = renderTile(status);
    expect(tile).toHaveAttribute("href", "/subjects/math");
    const subtitle = tile.querySelector("[data-subject-status]");
    expect(subtitle).toHaveAttribute("data-subject-status", status.kind);
    expect(subtitle).toHaveTextContent(text);
  });

  it("adds the nudge after a long break", () => {
    expect(renderTile({ kind: "new", total: 1 }, 5)).toHaveTextContent(
      "5 ngày chưa học",
    );
  });
});
