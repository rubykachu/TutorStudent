import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  lastStep,
  NumberLine,
  type NumberLineSpec,
  planOf,
  pointMarks,
} from "@/visuals/shared/number-line";
import {
  ARROW_HEAD,
  AXIS_LEFT,
  AXIS_RIGHT,
  axisSpan,
  dotOffsets,
  MINUS,
  planLine,
  signed,
  tickGap,
  tickValues,
  tickX,
  tryDotRadius,
  VIEW_WIDTH,
  X_FIRST,
  X_LAST,
} from "@/visuals/shared/number-line-geometry";

const five = { from: -5, to: 5 } as const;

const spec: NumberLineSpec = {
  ...five,
  label: "Trục số từ âm 5 đến 5",
  layers: [
    { type: "origin" },
    { type: "point", at: -3, name: "A", color: "amber", step: 1 },
    { type: "arrow", from: 0, to: -3, tag: "3 đơn vị", step: 1 },
    { type: "zone", from: 1, to: 5, tag: "Số dương", color: "lime", step: 2 },
  ],
  mode: "steps",
};

describe("signed", () => {
  it("writes a negative number with the minus sign, not the hyphen", () => {
    expect(signed(-3)).toBe(`${MINUS}3`);
    expect(signed(-3)).not.toContain("-");
    expect(signed(0)).toBe("0");
    expect(signed(7)).toBe("7");
  });
});

describe("tick layout", () => {
  it("has a tick at every integer, negative ones first", () => {
    expect(tickValues(five)).toEqual([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]);
    expect(tickValues({ from: -1, to: 1 })).toEqual([-1, 0, 1]);
  });

  it("puts the ticks evenly from left to right, with room for both arrowheads", () => {
    expect(tickX(five, -5)).toBe(X_FIRST);
    expect(tickX(five, 5)).toBe(X_LAST);
    expect(tickX(five, 0)).toBeCloseTo((X_FIRST + X_LAST) / 2, 6);
    expect(tickX(five, -2) - tickX(five, -3)).toBeCloseTo(tickGap(five), 6);
    expect(X_FIRST).toBeGreaterThan(AXIS_LEFT + 14);
    expect(X_LAST).toBeLessThan(AXIS_RIGHT - 14);
    expect(AXIS_RIGHT).toBeLessThanOrEqual(VIEW_WIDTH);
  });

  it("keeps the numbers of the longest line apart at 16px", () => {
    // "−5" is about 17 units wide; neighbours of an 11 tick line stay clear.
    expect(tickGap(five)).toBeGreaterThan(20);
  });

  it("sets dots that share a tick side by side", () => {
    const radius = tryDotRadius(five);
    const [a = 0, b = 0] = dotOffsets([0, 0], radius);
    expect(b - a).toBeGreaterThanOrEqual(radius * 2);
    expect(dotOffsets([-3, 4], radius)).toEqual([0, 0]);
  });
});

describe("planning the height", () => {
  it("is taller when arrows, names and zone tags need room", () => {
    const plain = planLine({ names: false, arrowRows: 0, zoneTags: false });
    const named = planLine({ names: true, arrowRows: 0, zoneTags: false });
    const arrows = planLine({ names: true, arrowRows: 2, zoneTags: false });
    const zones = planLine({ names: true, arrowRows: 0, zoneTags: true });
    expect(named.axisY).toBeGreaterThan(plain.axisY);
    expect(arrows.axisY).toBeGreaterThan(named.axisY);
    expect(zones.height - zones.axisY).toBeGreaterThan(
      named.height - named.axisY,
    );
  });

  it("reads the needs of a picture from its layers", () => {
    const plan = planOf(spec.layers ?? []);
    expect(plan).toEqual(
      planLine({ names: true, arrowRows: 1, zoneTags: true }),
    );
  });
});

describe("pointMarks", () => {
  it("writes the number of each shown point under its tick", () => {
    const marks = pointMarks(spec.layers ?? [], () => true);
    expect(marks.get(-3)?.text).toBe(`${MINUS}3`);
    expect(marks.size).toBe(1);
  });

  it("leaves out a point that has not come yet, or hides its number", () => {
    expect(pointMarks(spec.layers ?? [], () => false).size).toBe(0);
    expect(
      pointMarks(
        [{ type: "point", at: 2, color: "amber", hideNumber: true }],
        () => true,
      ).size,
    ).toBe(0);
  });

  it("asks with a question mark when the number is to be found", () => {
    const marks = pointMarks(
      [{ type: "point", at: 2, color: "amber", ask: true }],
      () => true,
    );
    expect(marks.get(2)?.text).toBe("?");
  });
});

describe("NumberLine", () => {
  it("walks through its layers in steps mode, in a labelled player", () => {
    render(<NumberLine spec={spec} />);
    expect(
      screen.getByRole("figure", { name: "Trục số từ âm 5 đến 5" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Bước 1 trên 3")).toBeInTheDocument();
  });

  it("draws everything at once in still mode, with no player", () => {
    const { container } = render(
      <NumberLine spec={{ ...spec, mode: "still" }} />,
    );
    expect(container.querySelector("[data-step-player]")).toBeNull();
    expect(screen.getByRole("img")).toHaveAccessibleName(
      "Trục số từ âm 5 đến 5",
    );
    expect(container.textContent).toContain("Số dương");
    expect(container.textContent).toContain("3 đơn vị");
  });

  it("stops a hint one step early and never draws the last layers", () => {
    const { container } = render(
      <NumberLine spec={{ ...spec, mode: "hint" }} />,
    );
    expect(lastStep(spec.layers ?? [])).toBe(2);
    expect(screen.getByText("Bước 1 trên 2")).toBeInTheDocument();
    const hidden = [...container.querySelectorAll(".invisible")].map(
      (el) => el.textContent,
    );
    expect(hidden.some((text) => text?.includes("Số dương"))).toBe(true);
  });

  it("numbers every tick unless `labelAt` picks some", () => {
    const all = render(<NumberLine spec={{ ...spec, mode: "still" }} />);
    expect(all.container.querySelectorAll("text").length).toBeGreaterThan(10);
    all.unmount();
    const some = render(
      <NumberLine
        spec={{ ...five, label: "x", labelAt: [0, 1], mode: "still" }}
      />,
    );
    expect(
      [...some.container.querySelectorAll("text")].map((el) => el.textContent),
    ).toEqual(["0", "1"]);
  });
});

describe("axis arrowheads", () => {
  const bare: NumberLineSpec = {
    from: 0,
    to: 5,
    label: "Trục số từ 0 đến 5",
    mode: "still",
  };
  const heads = (container: HTMLElement) =>
    container.querySelectorAll("polygon").length;

  it("draws an arrowhead at both ends by default", () => {
    const { container } = render(<NumberLine spec={bare} />);
    expect(heads(container)).toBe(2);
    expect(axisSpan()).toEqual({
      x1: AXIS_LEFT + ARROW_HEAD,
      x2: AXIS_RIGHT - ARROW_HEAD,
      negativeHead: true,
    });
  });

  it("draws one arrowhead, at the positive end, when asked", () => {
    const { container } = render(
      <NumberLine spec={{ ...bare, arrows: "positive" }} />,
    );
    expect(heads(container)).toBe(1);
    const [head] = container.querySelectorAll("polygon");
    const tip = head?.getAttribute("points")?.split(" ")[1];
    expect(tip?.startsWith(`${AXIS_RIGHT},`)).toBe(true);
    // The bare left end of the stroke reaches the edge of the drawing.
    const axis = container.querySelector("line");
    expect(Number(axis?.getAttribute("x1"))).toBe(AXIS_LEFT);
    expect(axisSpan("positive").negativeHead).toBe(false);
  });
});
