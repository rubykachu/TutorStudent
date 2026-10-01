import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Line } from "@/visuals/math/thu-tu-trong-tap-hop-cac-so-tu-nhien/line";
import {
  datDiem,
  dotOffsets,
  labelClearance,
  lineTapRegions,
  packRows,
  planLine,
  solutions,
  solveDatDiem,
  tagWidth,
  tickValues,
  tickX,
  tryDotRadius,
  VIEW_WIDTH,
  validators,
  visibleLabels,
} from "@/visuals/math/thu-tu-trong-tap-hop-cac-so-tu-nhien/line-logic";
import { LineTap } from "@/visuals/math/thu-tu-trong-tap-hop-cac-so-tu-nhien/line-tap";
import { LineTry } from "@/visuals/math/thu-tu-trong-tap-hop-cac-so-tu-nhien/line-try";
import type {
  LineSpec,
  LineTapSpec,
  LineTrySpec,
} from "@/visuals/math/thu-tu-trong-tap-hop-cac-so-tu-nhien/types";
import { RegionProvider } from "@/visuals/shared/region";

const ten: LineSpec = {
  from: 0,
  to: 10,
  layers: [
    { type: "point", at: 0, name: "O", color: "amber" },
    { type: "point", at: 3, name: "A", color: "blue", tag: "điểm A" },
    { type: "dots", at: [5, 6, 7], color: "teal", tag: "ba số" },
    { type: "span", from: 2, to: 8, color: "violet", tag: "từ 2 đến 8" },
    { type: "arrow", from: 3, to: 6, tag: "3 đơn vị" },
  ],
  mode: "steps",
  label: "Tia số từ 0 đến 10",
};
const fifty: LineSpec = {
  from: 0,
  to: 50,
  step: 5,
  labelAt: [0, 10, 20, 30, 40, 50],
  layers: [
    { type: "point", at: 15, name: "M", color: "amber", ask: true },
    { type: "arrow", from: 15, to: 30, tag: "15 đơn vị" },
  ],
  mode: "still",
  label: "Tia số từ 0 đến 50, mỗi vạch 5",
};
const twelve: LineSpec = {
  from: 0,
  to: 12,
  layers: [
    { type: "dots", at: [2, 4, 6], color: "teal", tag: "các số chẵn" },
    { type: "point", at: 12, name: "B", color: "amber", tag: "lớn nhất" },
  ],
  mode: "hint",
  hintLayers: 1,
  label: "Tia số từ 0 đến 12",
};

describe("tickValues", () => {
  it("lists the ticks from `from` to `to` by `step`", () => {
    expect(tickValues({ from: 0, to: 4 })).toEqual([0, 1, 2, 3, 4]);
    expect(tickValues({ from: 0, to: 50, step: 5 })).toHaveLength(11);
    expect(tickValues({ from: 10, to: 22, step: 5 })).toEqual([10, 15, 20]);
  });

  it("never loops on a step that is not positive", () => {
    expect(tickValues({ from: 0, to: 3, step: 0 })).toEqual([0, 1, 2, 3]);
  });
});

describe("layout", () => {
  it("spreads the ticks evenly from the first to the last position", () => {
    expect(tickX({ from: 0, to: 10 }, 0)).toBeLessThan(
      tickX({ from: 0, to: 10 }, 10),
    );
    const gaps = [1, 2, 3].map(
      (v) => tickX({ from: 0, to: 10 }, v) - tickX({ from: 0, to: 10 }, v - 1),
    );
    expect(gaps[0]).toBeCloseTo(gaps[2] as number, 6);
  });

  it("keeps the numbers of every kind of line apart in a drawing that fits a 296px frame at 16px", () => {
    expect(VIEW_WIDTH).toBeLessThanOrEqual(296);
    for (const spec of [ten, fifty, twelve]) {
      const points = spec.layers.flatMap((layer) =>
        layer.type === "point" ? [layer.at] : [],
      );
      expect(labelClearance(spec, points), spec.label).toBeGreaterThan(0);
    }
    // A line with a number on each of its 13 ticks still fits two digits.
    expect(labelClearance({ from: 0, to: 12 })).toBeGreaterThan(0);
    // Three digits on every tick of a long line would not.
    expect(labelClearance({ from: 0, to: 120 })).toBeLessThan(0);
  });

  it("puts overlapping tags on different rows and keeps the rest on one", () => {
    expect(
      packRows([
        [0, 100],
        [50, 150],
        [120, 200],
      ]),
    ).toEqual([0, 1, 0]);
    expect(
      packRows([
        [0, 40],
        [60, 100],
      ]),
    ).toEqual([0, 0]);
  });

  it("keeps every tag inside the drawing and clear of its neighbours", () => {
    for (const spec of [ten, fifty, twelve]) {
      const plan = planLine(spec);
      spec.layers.forEach((layer, i) => {
        const centre = plan.tagX[i];
        if (centre === undefined || !("tag" in layer) || !layer.tag) return;
        const width = tagWidth(layer.tag, layer.type !== "arrow");
        expect(centre - width / 2, spec.label).toBeGreaterThanOrEqual(0);
        expect(centre + width / 2, spec.label).toBeLessThanOrEqual(VIEW_WIDTH);
      });
      expect(plan.height).toBeGreaterThan(plan.axisY);
    }
  });
});

describe("crowded lines", () => {
  it("drops a plain number that would touch the number of a point next to it", () => {
    const spec = {
      from: 0,
      to: 80,
      step: 5,
      labelAt: [0, 10, 20, 30, 40, 50, 60, 70, 80],
    };
    const shown = visibleLabels(spec, [45]);
    expect(shown).toContain(45);
    expect(shown).not.toContain(40);
    expect(shown).not.toContain(50);
    expect(shown).toContain(30);
    expect(visibleLabels(spec, [])).toEqual(spec.labelAt);
  });

  it("keeps every number when nothing is next to a point", () => {
    expect(visibleLabels({ from: 0, to: 10 }, [5])).toHaveLength(11);
  });

  it("sets points that share a tick side by side, clear of each other", () => {
    const radius = tryDotRadius({ from: 0, to: 12 });
    const [a = 0, b = 0] = dotOffsets([0, 0], radius);
    expect(b - a).toBeGreaterThanOrEqual(radius * 2);
    expect(dotOffsets([3, 5], radius)).toEqual([0, 0]);
    const three = dotOffsets([2, 2, 2], radius);
    expect(three[1]).toBe(0);
    expect((three[2] ?? 0) - (three[1] ?? 0)).toBeGreaterThanOrEqual(
      radius * 2,
    );
  });

  it("keeps dots of neighbouring ticks apart on a 17 tick line", () => {
    const spec = { from: 0, to: 80, step: 5 };
    const radius = tryDotRadius(spec);
    expect(radius * 2).toBeLessThanOrEqual(tickX(spec, 5) - tickX(spec, 0));
  });
});

describe("the place-the-points exercise", () => {
  const params = { p0: 3, p1: 7 };

  it("accepts exactly the wanted values", () => {
    expect(datDiem({ p0: 3, p1: 7 }, params)).toBe(true);
    expect(datDiem({ p0: 7, p1: 3 }, params)).toBe(false);
    expect(datDiem({ p0: 3, p1: 6 }, params)).toBe(false);
  });

  it("rejects a missing or an extra point", () => {
    expect(datDiem({ p0: 3 }, params)).toBe(false);
    expect(datDiem({}, params)).toBe(false);
    expect(datDiem({ p0: 3, p1: 7, p2: 0 }, params)).toBe(false);
  });

  it("ignores keys that are not points", () => {
    expect(datDiem({ p0: 3, p1: 7 }, { ...params, first: 1 })).toBe(true);
    expect(datDiem({ p0: 3, p1: 7, other: 9 }, params)).toBe(true);
  });

  it("solves to a state the validator accepts", () => {
    const solved = solveDatDiem({ ...params, first: 1 });
    expect(solved).toEqual({ p0: 3, p1: 7 });
    expect(validators["dat-diem"](solved, params)).toBe(true);
    expect(solutions["dat-diem"](params)).toEqual(solved);
  });
});

describe("LineTry", () => {
  const spec: LineTrySpec = { from: 0, to: 10, names: ["A", "B"] };

  it("reports the opening state at once, every point on the first tick", () => {
    const onStateChange = vi.fn();
    render(
      <LineTry
        spec={spec}
        params={{ p0: 3, p1: 7 }}
        onStateChange={onStateChange}
      />,
    );
    expect(onStateChange).toHaveBeenCalledWith({ p0: 0, p1: 0 });
  });

  it("moves a point one tick per press and reports the state", () => {
    const onStateChange = vi.fn();
    render(
      <LineTry
        spec={spec}
        params={{ p0: 3, p1: 7 }}
        onStateChange={onStateChange}
      />,
    );
    const upA = screen.getByRole("button", { name: "Tiến điểm A" });
    for (let i = 0; i < 3; i++) fireEvent.click(upA);
    expect(onStateChange).toHaveBeenLastCalledWith({ p0: 3, p1: 0 });
    fireEvent.click(screen.getByRole("button", { name: "Lùi điểm A" }));
    expect(onStateChange).toHaveBeenLastCalledWith({ p0: 2, p1: 0 });
    fireEvent.click(screen.getByRole("button", { name: "Tiến điểm B" }));
    expect(onStateChange).toHaveBeenLastCalledWith({ p0: 2, p1: 1 });
  });

  it("stops at both ends of the line", () => {
    render(<LineTry spec={spec} params={{}} />);
    expect(screen.getByRole("button", { name: "Lùi điểm A" })).toBeDisabled();
    const up = screen.getByRole("button", { name: "Tiến điểm A" });
    for (let i = 0; i < 12; i++) fireEvent.click(up);
    expect(up).toBeDisabled();
  });

  it("jumps by the step of the line", () => {
    const onStateChange = vi.fn();
    render(
      <LineTry
        spec={{ from: 0, to: 50, step: 5, names: ["A"] }}
        params={{ p0: 15 }}
        onStateChange={onStateChange}
      />,
    );
    const up = screen.getByRole("button", { name: "Tiến điểm A" });
    fireEvent.click(up);
    fireEvent.click(up);
    expect(onStateChange).toHaveBeenLastCalledWith({ p0: 10 });
    fireEvent.click(screen.getByRole("button", { name: "Lùi điểm A" }));
    expect(onStateChange).toHaveBeenLastCalledWith({ p0: 5 });
  });

  it("marks each stepper with its key so the walk can drive it", () => {
    const { container } = render(<LineTry spec={spec} params={{}} />);
    expect(container.querySelector('[data-state-key="p0"]')).not.toBeNull();
    expect(container.querySelector('[data-state-key="p1"]')).not.toBeNull();
    expect(
      container.querySelectorAll('[data-state-key="p1"] [data-state-step]'),
    ).toHaveLength(2);
  });

  it("locks when disabled", () => {
    render(<LineTry spec={spec} params={{}} disabled />);
    expect(screen.getByRole("button", { name: "Tiến điểm A" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Tiến điểm B" })).toBeDisabled();
  });

  it("draws the shown answer, locks and does not report a state", () => {
    const onStateChange = vi.fn();
    render(
      <LineTry
        spec={spec}
        params={{ p0: 3, p1: 7 }}
        shownState={{ p0: 3, p1: 7 }}
        onStateChange={onStateChange}
      />,
    );
    expect(screen.getByRole("img")).toHaveAccessibleName(
      "Tia số từ 0 đến 10: điểm A ở 3, điểm B ở 7",
    );
    expect(screen.getByRole("button", { name: "Tiến điểm A" })).toBeDisabled();
    expect(onStateChange).not.toHaveBeenCalled();
  });

  it("never says whether an exercise is right", () => {
    render(
      <LineTry
        spec={{ ...spec, goal: [1, 0], done: "Xong rồi!" }}
        params={{ p0: 1, p1: 0 }}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Tiến điểm A" }));
    expect(screen.queryByText(/Đã đặt đúng/)).toBeNull();
    expect(screen.queryByText("Xong rồi!")).toBeNull();
  });

  it("on a lesson screen counts the points set right and then says it is done", () => {
    render(<LineTry spec={{ ...spec, goal: [2, 1], done: "A ở 2, B ở 1." }} />);
    expect(screen.getByText("Đã đặt đúng 0/2 điểm")).toBeInTheDocument();
    const upA = screen.getByRole("button", { name: "Tiến điểm A" });
    fireEvent.click(upA);
    fireEvent.click(upA);
    expect(screen.getByText("Đã đặt đúng 1/2 điểm")).toBeInTheDocument();
    expect(screen.queryByText("A ở 2, B ở 1.")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Tiến điểm B" }));
    expect(screen.getByText("Đã đặt đúng 2/2 điểm")).toBeInTheDocument();
    expect(screen.getByText("A ở 2, B ở 1.")).toBeInTheDocument();
  });
});

describe("Line", () => {
  it("walks through its layers in steps mode, in a labelled player", () => {
    render(<Line spec={ten} />);
    expect(
      screen.getByRole("figure", { name: "Tia số từ 0 đến 10" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Bước 1 trên 5")).toBeInTheDocument();
  });

  it("draws everything at once in still mode, with no player", () => {
    const { container } = render(<Line spec={{ ...ten, mode: "still" }} />);
    expect(
      screen.getByRole("figure", { name: "Tia số từ 0 đến 10" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Bước/)).toBeNull();
    const text = container.textContent ?? "";
    for (const word of [
      "O",
      "A",
      "điểm A",
      "ba số",
      "từ 2 đến 8",
      "3 đơn vị",
    ]) {
      expect(text).toContain(word);
    }
  });

  it("labels only the ticks of labelAt, and shows a point it asks for as ?", () => {
    const { container } = render(<Line spec={fifty} />);
    const text = [...container.querySelectorAll("text")].map(
      (node) => node.textContent,
    );
    expect(text).toEqual(
      expect.arrayContaining(["0", "10", "20", "30", "40", "50", "?", "M"]),
    );
    expect(text).not.toContain("5");
    expect(text).not.toContain("15");
  });

  it("in hint mode shows the later points only as ? without name, tag or number", () => {
    const { container } = render(<Line spec={twelve} />);
    const text = [...container.querySelectorAll("text")].map(
      (node) => node.textContent,
    );
    expect(text).not.toContain("B");
    expect(text).not.toContain("lớn nhất");
    expect(text).toContain("các số chẵn");
    expect(text).not.toContain("12");
    expect(text.filter((t) => t === "?")).toHaveLength(1);
  });

  it("draws a line that does not start at 0 and stacks touching arrows", () => {
    const spec: LineSpec = {
      from: 22,
      to: 28,
      layers: [
        { type: "arrow", from: 22, to: 25, tag: "3 đơn vị" },
        { type: "arrow", from: 25, to: 28, tag: "3 đơn vị" },
      ],
      mode: "still",
      label: "Tia số từ 22 đến 28",
    };
    expect(planLine(spec).arrowRow).toEqual([0, 1]);
    const { container } = render(<Line spec={spec} />);
    expect(container.textContent).toContain("22");
    expect(container.textContent).toContain("28");
  });

  it("in hint mode leaves later bands and arrows out", () => {
    const spec: LineSpec = {
      ...ten,
      mode: "hint",
      hintLayers: 1,
    };
    const { container } = render(<Line spec={spec} />);
    const text = container.textContent ?? "";
    expect(text).not.toContain("3 đơn vị");
    expect(text).not.toContain("từ 2 đến 8");
    expect(text).not.toContain("ba số");
  });
});

describe("LineTap", () => {
  const spec: LineTapSpec = {
    from: 0,
    to: 12,
    labelAt: [0, 4, 8, 12],
    points: [
      { at: 2, name: "A" },
      { at: 6, name: "B" },
      { at: 10, name: "C" },
    ],
    label: "Tia số có ba điểm A, B, C",
  };

  it("names the regions after the points, in order", () => {
    expect(lineTapRegions(spec)).toEqual(["a", "b", "c"]);
  });

  it("is a plain picture outside an exercise", () => {
    render(<LineTap spec={spec} />);
    expect(screen.getByRole("img")).toHaveAccessibleName(spec.label);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("draws one tappable region per point, in order, inside an exercise", () => {
    const onToggle = vi.fn();
    const { container } = render(
      <RegionProvider
        value={{
          selected: new Set(),
          revealed: new Set(),
          marks: new Map(),
          disabled: false,
          onToggle,
        }}
      >
        <LineTap spec={spec} />
      </RegionProvider>,
    );
    const ids = [...container.querySelectorAll("[data-region]")].map((node) =>
      node.getAttribute("data-region"),
    );
    expect(ids).toEqual(lineTapRegions(spec));
    fireEvent.click(screen.getByRole("button", { name: "Điểm B" }));
    expect(onToggle).toHaveBeenCalledWith("b");
  });

  it("writes no number for a point, only for the labelled ticks", () => {
    const { container } = render(<LineTap spec={spec} />);
    const numbers = [...container.querySelectorAll("text")]
      .map((node) => node.textContent)
      .filter((t) => /^\d+$/.test(t ?? ""));
    expect(numbers).toEqual(["0", "4", "8", "12"]);
  });
});
