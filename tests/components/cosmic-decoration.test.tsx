import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CosmosHorizon } from "@/components/cosmos-background";
import { PanelArt } from "@/components/panel-art";
import { ProfilePicker } from "@/components/profile-picker";
import { SectionCardArt } from "@/components/section-card-art";
import { Sheet } from "@/components/sheet";
import { SubjectTile } from "@/components/subject-tile";
import { LessonCardArt, SubjectTileArt } from "@/components/subject-tile-art";
import { DoneScreen } from "@/learn/done-screen";
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
    series: [{ id: "kntt", name: "Kết nối", grade: 6 }],
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

describe("LessonCardArt", () => {
  it("is faint, static decoration in the card's right-hand column", () => {
    const { container } = render(
      <LessonCardArt position={0} tint="text-subject-blue" />,
    );
    const art = container.querySelector("[data-lesson-art]");
    expectDecoration(art);
    expect(art).toHaveClass("pointer-events-none", "-z-10", "w-2/5");
    expect(art?.querySelector("svg")).toHaveClass("text-subject-blue");
    expect(maxOpacity(art as Element)).toBeLessThanOrEqual(0.2);
    expect(art?.querySelectorAll("animate, animateTransform")).toHaveLength(0);
  });

  it("varies from card to card and repeats, with unique clip ids", () => {
    const html = (n: number) =>
      render(<LessonCardArt position={n} tint="text-subject-blue" />).container
        .innerHTML;
    const first = [0, 1, 2, 3, 4, 5].map(html);
    expect(new Set(first).size).toBe(first.length);
    const ids = [
      ...render(
        <>
          <LessonCardArt position={2} tint="text-subject-teal" />
          <LessonCardArt position={2} tint="text-subject-teal" />
        </>,
      ).container.querySelectorAll("clipPath"),
    ].map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("SectionCardArt", () => {
  it("fills a column of its own with shapes at most 0.24 opaque and no text", () => {
    for (let position = 0; position < 4; position++) {
      const { container } = render(<SectionCardArt position={position} />);
      const art = container.querySelector("[data-section-art]");
      expectDecoration(art);
      expect(art).toHaveClass("pointer-events-none", "absolute", "inset-0");
      expect(maxOpacity(art as Element)).toBeLessThanOrEqual(0.24);
      // Present, not a few specks: several shapes per sky.
      expect(art?.children.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("gives four different skies and repeats them", () => {
    const html = (n: number) =>
      render(<SectionCardArt position={n} />).container.innerHTML;
    expect(new Set([0, 1, 2, 3].map(html)).size).toBe(4);
    expect(html(4)).toBe(html(0));
  });
});

describe("the cosmos on the profile picker and the done screen", () => {
  it("puts the panel sky on every profile card", () => {
    const { container } = render(
      <ProfilePicker
        profiles={[
          {
            id: "a",
            familyId: "f",
            name: "An",
            avatar: "cat",
            grade: 6,
            series: {},
            createdAt: "",
          },
        ]}
        onPick={() => undefined}
        onEdit={() => undefined}
      />,
    );
    const card = screen.getByRole("listitem");
    expect(card).toHaveClass("isolate", "overflow-hidden");
    expect(container.querySelector("[data-panel-art]")).not.toBeNull();
  });

  it("ends a done screen with the horizon above the action bar", () => {
    const { container } = render(
      <DoneScreen
        stepAttr={{ name: "data-section-step", value: "done" }}
        title="Xong"
        actions={<button type="button">Tiếp</button>}
      />,
    );
    const horizon = container.querySelector("[data-cosmos-horizon]");
    const bar = container.querySelector("[data-bottom-bar]");
    expect(horizon).not.toBeNull();
    const order = (horizon as Element).compareDocumentPosition(bar as Element);
    expect(order & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
