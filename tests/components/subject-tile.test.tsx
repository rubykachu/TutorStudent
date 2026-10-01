import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SubjectTile } from "@/components/subject-tile";
import type { SubjectStatus } from "@/learn/next-step";
import type { Subject } from "@/schema/content";

const math: Subject = {
  id: "math",
  name: "Toán",
  color: "blue",
  icon: "calculator",
  language: "vi",
  rules: { checkExpr: false, verbatimPassage: false, requiresOpenEnded: false },
  series: [{ id: "kntt", name: "Kết nối", grade: 6 }],
  defaultSeries: "kntt",
};

function renderTile(
  status: SubjectStatus,
  nudgeDays: number | null = null,
  progress = { done: 0, total: 1 },
) {
  render(
    <SubjectTile
      subject={math}
      href="/subjects/math"
      progress={progress}
      status={status}
      nudgeDays={nudgeDays}
    />,
  );
  return screen.getByRole("link", { name: /Toán/ });
}

function renderLocked() {
  const { container } = render(
    <SubjectTile
      subject={math}
      href="/subjects/math"
      progress={{ done: 0, total: 0 }}
      status={{ kind: "empty" }}
      nudgeDays={null}
    />,
  );
  return container.querySelector("[data-subject]") as HTMLElement;
}

describe("SubjectTile", () => {
  it.each<[SubjectStatus, string]>([
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

  it("shows sections done out of all sections in the ring, never a percentage", () => {
    const tile = renderTile(
      { kind: "learning", total: 2, sectionNumber: 2 },
      null,
      {
        done: 3,
        total: 11,
      },
    );
    const ring = screen.getByRole("img", { name: "Xong 3 trên 11 phần" });
    expect(ring).toHaveTextContent("3/11phần");
    expect(tile).not.toHaveTextContent("%");
  });

  it("locks a subject with no lessons: a lock and 'Sắp ra mắt', no link", () => {
    const tile = renderLocked();
    expect(tile).toHaveAttribute("data-locked");
    expect(tile.tagName).not.toBe("A");
    expect(screen.queryByRole("link")).toBeNull();
    expect(tile.querySelector("[data-lock]")).not.toBeNull();
    expect(tile).toHaveTextContent("Toán");
    expect(tile).toHaveTextContent("Sắp ra mắt");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("does not lock a subject that has lessons", () => {
    const tile = renderTile({ kind: "new", total: 2 });
    expect(tile).not.toHaveAttribute("data-locked");
    expect(tile.querySelector("[data-lock]")).toBeNull();
  });
});
