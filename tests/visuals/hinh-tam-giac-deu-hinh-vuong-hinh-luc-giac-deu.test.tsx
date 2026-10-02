import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Assemble } from "@/visuals/math/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/assemble";
import {
  regionsOf,
  VISUAL_SPECS,
  validatorIdOf,
} from "@/visuals/math/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/catalog";
import { Construct } from "@/visuals/math/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/construct";
import {
  apexOf,
  constructFigure,
  constructSteps,
  solvedState,
  stepDone,
  stepEnabled,
} from "@/visuals/math/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/construction";
import {
  solutions,
  validators,
} from "@/visuals/math/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/logic";
import { FigureLayers } from "@/visuals/shared/plane/figure";
import {
  dist,
  lineIntersection,
  meetingPoints,
  regularPoints,
} from "@/visuals/shared/plane/geometry";
import { Probe } from "@/visuals/shared/plane/probe";
import { probeFigure } from "@/visuals/shared/plane/probe-model";

describe("geometry", () => {
  it("puts the corners of a regular polygon on one circle, equally apart", () => {
    const hexagon = regularPoints(6, 100, 100, 50, 0);
    const side = dist(
      hexagon[0] as [number, number],
      hexagon[1] as [number, number],
    );
    expect(side).toBeCloseTo(50);
    for (const p of hexagon) expect(dist(p, [100, 100])).toBeCloseTo(50);
  });

  it("finds where two compass arcs of the same radius meet", () => {
    const meet = meetingPoints([0, 0], 10, [10, 0], 10);
    expect(meet).toBeDefined();
    const [upper, lower] = meet ?? [];
    expect(upper?.[0]).toBeCloseTo(5);
    expect(upper?.[1]).toBeCloseTo(-Math.sqrt(75));
    expect(lower?.[1]).toBeCloseTo(Math.sqrt(75));
    expect(meetingPoints([0, 0], 4, [10, 0], 4)).toBeUndefined();
  });

  it("crosses two lines", () => {
    expect(lineIntersection([0, 0], [10, 10], [0, 10], [10, 0])).toEqual([
      5, 5,
    ]);
    expect(lineIntersection([0, 0], [1, 0], [0, 1], [1, 1])).toBeUndefined();
  });
});

describe("drawing boards", () => {
  it("lists the steps in the order of the solved state", () => {
    for (const [shape, diagonals] of [
      ["triangle", false],
      ["square", false],
      ["square", true],
    ] as const) {
      const keys = constructSteps(shape, ["A", "B", "C", "D"], diagonals).map(
        (step) => step.key,
      );
      expect(Object.keys(solvedState(shape, 4, diagonals))).toEqual(keys);
    }
  });

  it("lets a step wait for the steps before it", () => {
    const steps = constructSteps("triangle", ["A", "B", "C"], false);
    expect(stepEnabled(steps, 0, {})).toBe(true);
    expect(stepEnabled(steps, 1, {})).toBe(false);
    expect(stepEnabled(steps, 1, { len: 3 })).toBe(true);
    expect(stepDone(steps[2] as (typeof steps)[number], { arcM: 0 })).toBe(
      false,
    );
  });

  it("meets the two arcs only when each radius reaches past half the segment", () => {
    expect(apexOf({ len: 4, open: 4 })).toBeDefined();
    expect(apexOf({ len: 4, open: 2 })).toBeDefined();
    expect(apexOf({ len: 4, open: 1 })).toBeUndefined();
    expect(apexOf({ len: 4 })).toBeUndefined();
  });

  it("draws an equilateral triangle when the compass is opened as the segment", () => {
    const figure = constructFigure(
      "triangle",
      ["M", "N", "P"],
      solvedState("triangle", 5, false),
    );
    const { M, N, P } = figure.pts;
    const [m, n, p] = [M, N, P] as [number, number][];
    const sides = [
      dist(m as never, n as never),
      dist(n as never, p as never),
      dist(p as never, m as never),
    ];
    expect(sides[1]).toBeCloseTo(sides[0] as number);
    expect(sides[2]).toBeCloseTo(sides[0] as number);
    expect(figure.pts.P).toBeDefined();
    expect(p).toBeDefined();
  });

  it("draws a square when both heights equal the side", () => {
    const figure = constructFigure(
      "square",
      ["D", "E", "F", "Q"],
      solvedState("square", 5, true),
    );
    const pts = figure.pts as Record<string, [number, number]>;
    const [d, e, f, q] = [pts.D, pts.E, pts.F, pts.Q] as [number, number][];
    expect(dist(d as never, e as never)).toBeCloseTo(
      dist(e as never, f as never),
    );
    expect(dist(f as never, q as never)).toBeCloseTo(
      dist(q as never, d as never),
    );
    expect(figure.rights?.some((mark) => mark.at === "O")).toBe(true);
  });

  it("draws every partial state of the solved sequence without failing", () => {
    for (const [shape, diagonals] of [
      ["triangle", false],
      ["square", false],
      ["square", true],
    ] as const) {
      const solved = solvedState(shape, 3, diagonals);
      const keys = Object.keys(solved);
      for (let i = 0; i <= keys.length; i++) {
        const partial = Object.fromEntries(
          keys.slice(0, i).map((k) => [k, solved[k] as number]),
        );
        const { container, unmount } = render(
          <svg aria-hidden>
            <FigureLayers
              spec={constructFigure(shape, ["A", "B", "C", "D"], partial)}
            />
          </svg>,
        );
        expect(container.querySelector("svg")).not.toBeNull();
        unmount();
      }
    }
  });
});

describe("validators and solvers", () => {
  it("accept the state their solver builds", () => {
    expect(
      validators["ve-tam-giac-deu"](solutions["ve-tam-giac-deu"]({ side: 4 }), {
        side: 4,
      }),
    ).toBe(true);
    expect(
      validators["ve-hinh-vuong"](solutions["ve-hinh-vuong"]({ side: 6 }), {
        side: 6,
      }),
    ).toBe(true);
    expect(
      validators["ve-hinh-vuong-cheo"](
        solutions["ve-hinh-vuong-cheo"]({ side: 5 }),
        { side: 5 },
      ),
    ).toBe(true);
    expect(
      validators["ghep-luc-giac"](solutions["ghep-luc-giac"]({ n: 6 }), {
        n: 6,
      }),
    ).toBe(true);
  });

  it("refuse a wrong length, a missing step or a wrong answer", () => {
    const solved = solutions["ve-tam-giac-deu"]({ side: 4 });
    expect(
      validators["ve-tam-giac-deu"]({ ...solved, open: 3 }, { side: 4 }),
    ).toBe(false);
    expect(
      validators["ve-tam-giac-deu"]({ ...solved, len: 5 }, { side: 4 }),
    ).toBe(false);
    expect(
      validators["ve-tam-giac-deu"]({ ...solved, join: 0 }, { side: 4 }),
    ).toBe(false);
    expect(validators["ve-tam-giac-deu"]({}, { side: 4 })).toBe(false);
    const square = solutions["ve-hinh-vuong-cheo"]({ side: 5 });
    expect(
      validators["ve-hinh-vuong-cheo"]({ ...square, ans: 2 }, { side: 5 }),
    ).toBe(false);
    expect(
      validators["ve-hinh-vuong-cheo"]({ ...square, h: 4 }, { side: 5 }),
    ).toBe(false);
    expect(validators["ve-hinh-vuong"](square, {})).toBe(false);
    expect(validators["ghep-luc-giac"]({ n: 5 }, { n: 6 })).toBe(false);
  });
});

describe("Construct", () => {
  const press = (name: string) =>
    fireEvent.click(screen.getByRole("button", { name }));

  it("is a guided step: it reports each change and says when the figure is right", () => {
    const onStateChange = vi.fn();
    render(
      <Construct
        spec={{
          shape: "triangle",
          names: ["A", "B", "C"],
          goal: 2,
          done: "Xong hình.",
        }}
        onStateChange={onStateChange}
      />,
    );
    expect(screen.getByText(/Dùng thước vẽ đoạn thẳng AB/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cung A/ })).toBeDisabled();
    press("Tăng cạnh ab (cm)");
    press("Tăng cạnh ab (cm)");
    press("Tăng mở compa (cm)");
    press("Tăng mở compa (cm)");
    press("Cung A");
    press("Cung B");
    press("Điểm C");
    expect(screen.queryByText("Xong hình.")).toBeNull();
    press("Nối");
    expect(onStateChange).toHaveBeenLastCalledWith({
      len: 2,
      open: 2,
      arcM: 1,
      arcN: 1,
      apex: 1,
      join: 1,
    });
    expect(screen.getByText("Xong hình.")).toBeInTheDocument();
  });

  it("warns when the compass is too narrow for the arcs to meet", () => {
    render(
      <Construct
        spec={{ shape: "triangle", names: ["A", "B", "C"] }}
        params={{ side: 4 }}
      />,
    );
    for (let i = 0; i < 4; i++) press("Tăng cạnh ab (cm)");
    press("Tăng mở compa (cm)");
    press("Cung A");
    press("Cung B");
    expect(screen.getByText(/Hai cung chưa gặp nhau/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Điểm C/ })).toBeDisabled();
    press("Tăng mở compa (cm)");
    expect(screen.queryByText(/Hai cung chưa gặp nhau/)).toBeNull();
  });

  it("asks the yes or no question only after the diagonals are drawn", () => {
    const onStateChange = vi.fn();
    render(
      <Construct
        spec={{ shape: "square", names: ["D", "E", "F", "Q"], diagonals: true }}
        params={{ side: 2 }}
        onStateChange={onStateChange}
      />,
    );
    expect(screen.queryByRole("button", { name: "Vuông góc" })).toBeNull();
    for (let i = 0; i < 2; i++) press("Tăng cạnh de (cm)");
    press("Êke tại D");
    press("Êke tại E");
    for (let i = 0; i < 2; i++) press("Tăng dq, ef (cm)");
    press("Nối QF");
    press("Chéo DF");
    press("Chéo EQ");
    press("Vuông góc");
    expect(onStateChange).toHaveBeenLastCalledWith(
      solvedState("square", 2, true),
    );
    // An exercise never says whether the figure is right.
    expect(screen.queryByText(/vẽ xong/)).toBeNull();
  });

  it("takes a press back and shows a given state locked", () => {
    const onStateChange = vi.fn();
    const { rerender } = render(
      <Construct
        spec={{ shape: "square", names: ["A", "B", "C", "D"] }}
        params={{ side: 3 }}
        onStateChange={onStateChange}
      />,
    );
    press("Tăng cạnh ab (cm)");
    press("Êke tại A");
    press("Êke tại A");
    expect(onStateChange).toHaveBeenLastCalledWith({ len: 1, perpD: 0 });
    rerender(
      <Construct
        spec={{ shape: "square", names: ["A", "B", "C", "D"] }}
        params={{ side: 3 }}
        shownState={solvedState("square", 3, false)}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Tăng cạnh ab (cm)" }),
    ).toBeDisabled();
  });
});

describe("Probe", () => {
  it("shows the measure of every part tapped and the closing line at the end", () => {
    const spec = VISUAL_SPECS["do-tam-giac-deu"];
    if (spec?.kind !== "probe") throw new Error("not a probe");
    render(<Probe spec={spec} />);
    expect(screen.getByText("Đã đo 0/6")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cạnh AB" }));
    expect(screen.getByText("Đã đo 1/6")).toBeInTheDocument();
    expect(screen.getByText("3 cm")).toBeInTheDocument();
    for (const name of ["Cạnh BC", "Cạnh CA", "Góc A", "Góc B", "Góc C"]) {
      fireEvent.click(screen.getByRole("button", { name }));
    }
    expect(
      screen.getByText("Ba cạnh đều dài 3 cm và ba góc đều bằng 60°."),
    ).toBeInTheDocument();
  });

  it("colours a region when it is tapped, and a button outlines the whole", () => {
    const spec = VISUAL_SPECS["dem-cung-lam"];
    if (spec?.kind !== "probe") throw new Error("not a probe");
    const done = spec.parts.map((part) => part.kind === "chip");
    const figure = probeFigure(spec, done);
    expect(figure.polys?.length).toBe((spec.figure.polys?.length ?? 0) + 1);
  });

  it("shows every part when the answer is shown", () => {
    const spec = VISUAL_SPECS["do-cheo-chinh"];
    if (spec?.kind !== "probe") throw new Error("not a probe");
    render(<Probe spec={spec} shownState={{ i0: 1, i1: 1, i2: 1 }} />);
    expect(screen.getByText("Đã đo 3/3")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Đường chéo chính AD/ }),
    ).toBeNull();
  });
});

describe("Assemble", () => {
  it("places one more triangle at each press and says when the hexagon is whole", () => {
    const onStateChange = vi.fn();
    render(
      <Assemble
        spec={{ label: "Ghép", goal: 2, done: "Đủ miếng." }}
        onStateChange={onStateChange}
      />,
    );
    expect(screen.getByText("Đã ghép 0/6 miếng")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Tăng số miếng tam giác đã ghép" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Tăng số miếng tam giác đã ghép" }),
    );
    expect(onStateChange).toHaveBeenLastCalledWith({ n: 2 });
    expect(screen.getByText("Đủ miếng.")).toBeInTheDocument();
  });
});

describe("catalog", () => {
  it("declares the regions of the figure to tap, in drawing order", () => {
    const spec = VISUAL_SPECS["chon-luc-giac"];
    expect(spec && regionsOf(spec)).toEqual([
      "hinh-1",
      "hinh-2",
      "hinh-3",
      "hinh-4",
      "hinh-5",
      "hinh-6",
    ]);
    const plain = VISUAL_SPECS["ba-hinh-deu"];
    expect(plain && regionsOf(plain)).toBeUndefined();
  });

  it("names the validator of each board and of the hexagon", () => {
    const id = (key: string) => {
      const spec = VISUAL_SPECS[key];
      return spec && validatorIdOf(spec);
    };
    expect(id("ve-td-tap-lam")).toBe("ve-tam-giac-deu");
    expect(id("ve-hv-tap-lam")).toBe("ve-hinh-vuong");
    expect(id("sbt-4-3-ve")).toBe("ve-hinh-vuong-cheo");
    expect(id("ghep-cung-lam")).toBe("ghep-luc-giac");
    expect(id("ba-hinh-deu")).toBeUndefined();
  });

  it("keeps the hexagon of the exercise 4.8 as six short diagonals and twelve points", () => {
    const spec = VISUAL_SPECS["sbt-hinh-4-8"];
    if (spec?.kind !== "figure") throw new Error("not a figure");
    expect(Object.keys(spec.figure.pts)).toHaveLength(12);
    expect(spec.figure.segs).toHaveLength(6);
  });
});
