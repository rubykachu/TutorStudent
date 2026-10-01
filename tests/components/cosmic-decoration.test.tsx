import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CosmosHorizon } from "@/components/cosmos-background";
import { PanelArt } from "@/components/panel-art";
import { Sheet } from "@/components/sheet";
import { SubjectTile } from "@/components/subject-tile";
import { SubjectTileArt } from "@/components/subject-tile-art";
import type { Subject } from "@/schema/content";

// Decoration is hidden from screen readers, never takes a tap, has no text
// and nothing focusable.
function expectDecoration(root: Element | null) {
  expect(root).toHaveAttribute("aria-hidden", "true");
  expect(root?.textContent).toBe("");
  expect(root?.querySelectorAll("a, button, input, [tabindex]")).toHaveLength(
    0,
  );
}

// Largest opacity among the shapes of a decoration.
function maxOpacity(root: Element): number {
  return Math.max(
    ...[...root.querySelectorAll("[opacity]")].map((el) =>
      Number(el.getAttribute("opacity")),
    ),
  );
}

const COLORS: Subject["color"][] = ["blue", "terracotta", "teal"];

function subject(color: Subject["color"]): Subject {
  return {
    id: color,
    name: `Môn ${color}`,
    color,
    icon: "calculator",
    language: "vi",
    rules: {
      checkExpr: false,
      verbatimPassage: false,
      requiresOpenEnded: false,
    },
    series: [{ id: "kntt", name: "Kết nối" }],
    defaultSeries: "kntt",
  };
}

describe("SubjectTileArt", () => {
  it.each(COLORS)(
    "%s: darkens only (the dark foreground tint, faint), static decoration",
    (color) => {
      const { container } = render(<SubjectTileArt color={color} />);
      const art = container.querySelector("[data-subject-art]");
      expectDecoration(art);
      // The dark foreground colour at low opacity can only deepen the tile
      // under the white text, so the text keeps (or gains) its contrast.
      expect(art).toHaveClass(
        "text-foreground",
        "pointer-events-none",
        "-z-10",
      );
      expect(maxOpacity(art as Element)).toBeLessThanOrEqual(0.2);
      expect(art?.querySelectorAll("animate, animateTransform")).toHaveLength(
        0,
      );
      expect(art?.innerHTML).not.toMatch(/white|#fff|primary-foreground/i);
    },
  );

  it("gives each colour its own scene", () => {
    const scenes = COLORS.map(
      (color) => render(<SubjectTileArt color={color} />).container.innerHTML,
    );
    expect(new Set(scenes).size).toBe(COLORS.length);
  });

  it("keeps clip ids unique when two tiles share a colour", () => {
    const { container } = render(
      <>
        <SubjectTileArt color="teal" />
        <SubjectTileArt color="teal" />
      </>,
    );
    const ids = [...container.querySelectorAll("clipPath")].map((c) => c.id);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
  });

  it("sits behind a subject tile's text without changing what it says", () => {
    render(
      <SubjectTile
        subject={subject("terracotta")}
        href="/subjects/x"
        progress={{ done: 1, total: 2 }}
        status={{ kind: "new", total: 2 }}
        nudgeDays={null}
      />,
    );
    const tile = screen.getByRole("link", { name: /Môn terracotta/ });
    expect(tile).toHaveClass("isolate", "overflow-hidden");
    expect(
      tile.querySelector("[data-subject-art='terracotta']"),
    ).not.toBeNull();
    expect(tile).toHaveTextContent("2 bài · Chưa học");
  });
});

describe("PanelArt", () => {
  it("is faint decoration behind a panel", () => {
    const { container } = render(<PanelArt />);
    const art = container.querySelector("[data-panel-art]");
    expectDecoration(art);
    expect(art).toHaveClass("pointer-events-none", "-z-10");
    expect(maxOpacity(art as Element)).toBeLessThanOrEqual(0.16);
  });

  it("is under the content of every sheet", () => {
    render(
      <Sheet label="Bảng thử" onClose={() => undefined}>
        <p>Nội dung</p>
      </Sheet>,
    );
    const dialog = screen.getByRole("dialog", { name: "Bảng thử" });
    expect(dialog).toHaveClass("isolate", "overflow-hidden");
    expect(dialog.querySelector("[data-panel-art]")).not.toBeNull();
    // The content scrolls inside, over the art that stays put.
    expect(screen.getByText("Nội dung").parentElement).toHaveClass(
      "overflow-y-auto",
    );
  });
});

describe("CosmosHorizon", () => {
  it("is decoration in the normal flow, with its own room", () => {
    const { container } = render(<CosmosHorizon className="mt-auto" />);
    const horizon = container.querySelector("[data-cosmos-horizon]");
    expectDecoration(horizon);
    expect(horizon).toHaveClass("pointer-events-none", "h-28", "mt-auto");
    // In the flow, so it can never lie under or against content.
    expect(horizon).not.toHaveClass("absolute", "fixed");
    expect(maxOpacity(horizon as Element)).toBeLessThanOrEqual(0.18);
  });
});
