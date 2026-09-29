import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CONCEPT_COLORS, type ConceptColor } from "@/schema/content";
import { ConceptMark } from "@/visuals/shared/concept-mark";

// Pairs from the concept colors table in docs/design-system.md.
const EXPECTED: Record<
  ConceptColor,
  { shape: string; tag: string; corners?: number }
> = {
  blue: { shape: "circle", tag: "circle" },
  violet: { shape: "triangle", tag: "polygon", corners: 3 },
  pink: { shape: "diamond", tag: "polygon", corners: 4 },
  amber: { shape: "square", tag: "polygon", corners: 4 },
  teal: { shape: "pentagon", tag: "polygon", corners: 5 },
  sky: { shape: "cross", tag: "polygon", corners: 12 },
  lime: { shape: "star", tag: "polygon", corners: 10 },
  slate: { shape: "bar", tag: "polygon", corners: 4 },
};

describe("ConceptMark", () => {
  it.each(CONCEPT_COLORS)(
    "draws the %s concept with its own shape",
    (color) => {
      const { container } = render(<ConceptMark color={color} />);
      const shape = container.querySelector("[data-shape]");
      const expected = EXPECTED[color];
      expect(shape?.getAttribute("data-shape")).toBe(expected.shape);
      expect(shape?.tagName.toLowerCase()).toBe(expected.tag);
      expect(shape?.getAttribute("class")).toContain(`fill-concept-${color}`);
      if (expected.corners) {
        const points = shape?.getAttribute("points")?.trim().split(/\s+/);
        expect(points).toHaveLength(expected.corners);
      }
    },
  );

  it("gives every color a different shape", () => {
    const shapes = CONCEPT_COLORS.map((color) => {
      const { container, unmount } = render(<ConceptMark color={color} />);
      const shape = container
        .querySelector("[data-shape]")
        ?.getAttribute("data-shape");
      unmount();
      return shape;
    });
    expect(new Set(shapes).size).toBe(CONCEPT_COLORS.length);
  });

  it("is hidden from screen readers unless it has its own label", () => {
    const { container } = render(<ConceptMark color="blue" />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    render(<ConceptMark color="violet" label="Số mũ" />);
    expect(screen.getByRole("img", { name: "Số mũ" })).toBeInTheDocument();
  });
});
