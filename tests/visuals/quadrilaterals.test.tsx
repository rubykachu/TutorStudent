import { readFileSync } from "node:fs";
import path from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { collectVisualRefs } from "@/content/check";
import {
  LESSON_SLUG as PARALLELOGRAM_SLUG,
  VISUAL_SPECS as PARALLELOGRAM_SPECS,
} from "@/visuals/math/hinh-binh-hanh-hinh-thang-can/catalog";
import {
  LESSON_SLUG as RECTANGLE_SLUG,
  VISUAL_SPECS as RECTANGLE_SPECS,
} from "@/visuals/math/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/catalog";
import { stepDone, stepEnabled } from "@/visuals/shared/plane/board-steps";
import { FigureLayers } from "@/visuals/shared/plane/figure";
import type { FigureSpec, Pt } from "@/visuals/shared/plane/figure-spec";
import { dist, polar } from "@/visuals/shared/plane/geometry";
import { probeFigure } from "@/visuals/shared/plane/probe-model";
import {
  BoardVisual,
  PiecesVisual,
} from "@/visuals/shared/quadrilaterals/board-visual";
import {
  ANGLES,
  type BoardShape,
  boardFigure,
  boardSteps,
  cornerOf,
  expectedState,
  isDrawn,
  solvedState,
} from "@/visuals/shared/quadrilaterals/construction";
import {
  boardView,
  trimTop,
} from "@/visuals/shared/quadrilaterals/drawing-frames";
import {
  FIGURE_411,
  FIGURE_412,
  figure413,
  figure414,
  figure415,
  halvesFigure,
  QUAD_NAME,
  type QuadKind,
  quad,
  renamed,
  trayFigure,
  triangleStrip,
  turned,
} from "@/visuals/shared/quadrilaterals/figures";
import { solutions, validators } from "@/visuals/shared/quadrilaterals/logic";
import { TapCards } from "@/visuals/shared/quadrilaterals/tap-cards";

const pt = (figure: FigureSpec, name: string): Pt => {
  const p = figure.pts[name];
  if (!p) throw new Error(`no point ${name}`);
  return p;
};
const length = (figure: FigureSpec, a: string, b: string) =>
  dist(pt(figure, a), pt(figure, b));
const angleAt = (figure: FigureSpec, at: string, a: string, b: string) => {
  const v = pt(figure, at);
  const [ax, ay] = [pt(figure, a)[0] - v[0], pt(figure, a)[1] - v[1]];
  const [bx, by] = [pt(figure, b)[0] - v[0], pt(figure, b)[1] - v[1]];
  return (
    (Math.acos(
      (ax * bx + ay * by) / (Math.hypot(ax, ay) * Math.hypot(bx, by)),
    ) *
      180) /
    Math.PI
  );
};
const same = (x: number, y: number, tolerance = 0.6) =>
  expect(Math.abs(x - y)).toBeLessThan(tolerance);

describe("the four shapes", () => {
  const shapes = (kind: QuadKind) => quad(kind, { label: QUAD_NAME[kind] });

  it("rectangle: four right angles, equal opposite sides and diagonals", () => {
    const f = shapes("chu-nhat");
    for (const [at, a, b] of [
      ["A", "D", "B"],
      ["B", "A", "C"],
      ["C", "B", "D"],
      ["D", "C", "A"],
    ] as const) {
      same(angleAt(f, at, a, b), 90, 0.01);
    }
    same(length(f, "A", "B"), length(f, "C", "D"));
    same(length(f, "B", "C"), length(f, "D", "A"));
    same(length(f, "A", "C"), length(f, "B", "D"));
  });

  it("rhombus: four equal sides, 60° at A and C, perpendicular diagonals", () => {
    const f = shapes("thoi");
    const side = length(f, "A", "B");
    for (const [a, b] of [
      ["B", "C"],
      ["C", "D"],
      ["D", "A"],
    ] as const) {
      same(length(f, a, b), side);
    }
    same(angleAt(f, "A", "D", "B"), 60);
    same(angleAt(f, "C", "B", "D"), 60);
    same(angleAt(f, "B", "A", "C"), 120);
    // The short diagonal is as long as a side (two equilateral triangles).
    same(length(f, "B", "D"), side);
  });

  it("parallelogram: opposite sides equal and parallel, 60° and 120°", () => {
    const f = shapes("binh-hanh");
    same(length(f, "A", "B"), length(f, "C", "D"));
    same(length(f, "B", "C"), length(f, "D", "A"));
    same(angleAt(f, "D", "C", "A"), 60);
    same(angleAt(f, "A", "D", "B"), 120);
    same(angleAt(f, "B", "A", "C"), 60);
    same(angleAt(f, "C", "B", "D"), 120);
  });

  it("isosceles trapezoid: parallel bases, equal legs and diagonals", () => {
    const f = shapes("thang-can");
    expect(pt(f, "A")[1]).toBeCloseTo(pt(f, "B")[1], 5);
    expect(pt(f, "D")[1]).toBeCloseTo(pt(f, "C")[1], 5);
    same(length(f, "D", "A"), length(f, "C", "B"));
    same(length(f, "A", "C"), length(f, "B", "D"));
    same(angleAt(f, "D", "C", "A"), 60);
    same(angleAt(f, "C", "B", "D"), 60);
    expect(length(f, "A", "B")).not.toBeCloseTo(length(f, "D", "A"), 0);
  });

  it("a rhombus or a parallelogram can take another acute angle", () => {
    const rhombus = quad("thoi", { label: "x", acute: 75 });
    const side = length(rhombus, "A", "B");
    for (const [a, b] of [
      ["B", "C"],
      ["C", "D"],
      ["D", "A"],
    ] as const) {
      same(length(rhombus, a, b), side);
    }
    same(angleAt(rhombus, "A", "D", "B"), 75);
    same(angleAt(rhombus, "B", "A", "C"), 105);
    const para = quad("binh-hanh", { label: "x", acute: 70 });
    same(length(para, "A", "B"), length(para, "C", "D"));
    same(length(para, "B", "C"), length(para, "D", "A"));
    same(angleAt(para, "B", "A", "C"), 70);
    same(angleAt(para, "A", "D", "B"), 110);
  });

  it("the name O of a rhombus is written in the gap between the diagonals", () => {
    const f = quad("thoi", { label: "x", names: true, centre: true });
    expect(f.names).toEqual(["A", "B", "C", "D"]);
    const o = f.texts?.find((text) => text.text === "O");
    expect(o).toBeDefined();
    const middle = pt(f, "O");
    // Below and to the left of the middle, as far as a right-angle square
    // and half a letter.
    expect((o?.x ?? 0) < middle[0] - 20).toBe(true);
    expect((o?.y ?? 0) > middle[1] + 10).toBe(true);
    // Other shapes keep the name where it is.
    const para = quad("binh-hanh", {
      label: "x",
      names: true,
      diagonals: "mid",
    });
    expect(para.names).toContain("O");
  });

  it("renames points everywhere in a figure and turns a thumbnail over", () => {
    const f = quad("thang-can", {
      label: "x",
      names: true,
      diagonals: "equal",
      angles: { D: "60°" },
      parallel: "bases",
    });
    const r = renamed(f, { A: "E", B: "F", C: "G", D: "H" });
    expect(Object.keys(r.pts).sort()).toEqual(["E", "F", "G", "H"]);
    expect(r.names).toEqual(["E", "F", "G", "H"]);
    expect(r.polys?.[0]?.v).toEqual(["E", "F", "G", "H"]);
    expect(r.segs?.map((seg) => `${seg.a}${seg.b}`)).toEqual(["EG", "FH"]);
    expect(r.angles?.[0]?.at).toBe("H");
    same(length(r, "E", "G"), length(r, "F", "H"));
    // Every name a mark uses is a point of the figure.
    for (const tick of r.ticks ?? []) {
      for (const [a, b] of tick.segs) {
        expect(r.pts[a]).toBeDefined();
        expect(r.pts[b]).toBeDefined();
      }
    }
    const flipped = turned(f, { flip: "y" });
    same(length(flipped, "A", "C"), length(f, "A", "C"), 0.01);
    expect(pt(flipped, "A")[1]).toBeCloseTo(f.h - pt(f, "A")[1], 5);
    const rotated = turned(f, { degrees: 20 });
    same(length(rotated, "A", "B"), length(f, "A", "B"), 0.01);
  });

  it("marks every side, every angle and the diagonals asked for", () => {
    const f = quad("binh-hanh", {
      label: "x",
      names: true,
      sides: "opposite",
      parallel: "opposite",
      angles: { A: "120°", C: "120°" },
      diagonals: "mid",
    });
    expect(f.ticks?.map((t) => t.count)).toEqual([1, 2, 1, 2]);
    expect(f.arrows?.map((a) => a.count)).toEqual([1, 2]);
    expect(f.angles?.map((a) => a.text)).toEqual(["120°", "120°"]);
    expect(f.names).toEqual(["A", "B", "C", "D", "O"]);
    // O is the middle of both diagonals.
    for (const [a, b] of [
      ["A", "C"],
      ["B", "D"],
    ] as const) {
      same(length(f, a, "O"), length(f, "O", b));
    }
  });

  it("renders without throwing for every option", () => {
    for (const kind of Object.keys(QUAD_NAME) as QuadKind[]) {
      for (const diagonals of [
        undefined,
        "plain",
        "equal",
        "perp",
        "mid",
      ] as const) {
        const f = quad(kind, {
          label: "x",
          names: true,
          rights: kind === "chu-nhat",
          sides: "all",
          diagonals,
        });
        const { container, unmount } = render(
          <svg aria-label="x">
            <title>x</title>
            <FigureLayers spec={f} />
          </svg>,
        );
        expect(container.querySelector("polygon")).not.toBeNull();
        unmount();
      }
    }
  });
});

describe("the figures of the workbook exercises", () => {
  it("figure 4.13: M, N, P, Q are the middles of the rectangle and form a rhombus", () => {
    const f = figure413("x");
    const sides = [
      length(f, "M", "N"),
      length(f, "N", "P"),
      length(f, "P", "Q"),
      length(f, "Q", "M"),
    ];
    for (const side of sides) same(side, sides[0] as number);
    same(length(f, "A", "B"), 240, 0.01);
  });

  it("figure 4.14: B and C lie on the sides of EFPQ, whose diagonals cross at their middles", () => {
    const f = figure414("x");
    const onLine = (p: string, a: string, b: string) =>
      same(length(f, a, p) + length(f, p, b), length(f, a, b), 0.05);
    onLine("B", "E", "F");
    onLine("C", "F", "P");
    onLine("D", "P", "Q");
    onLine("A", "Q", "E");
    const mid = (a: string, b: string): Pt => [
      (pt(f, a)[0] + pt(f, b)[0]) / 2,
      (pt(f, a)[1] + pt(f, b)[1]) / 2,
    ];
    same(mid("E", "P")[0], mid("F", "Q")[0], 0.05);
    same(mid("E", "P")[1], mid("F", "Q")[1], 0.05);
    same(length(f, "E", "F"), length(f, "P", "Q"), 0.05);
    same(length(f, "F", "P"), length(f, "Q", "E"), 0.05);
    // ABCD is a rectangle.
    same(angleAt(f, "B", "A", "C"), 90, 0.01);
  });

  it("figure 4.15: five corners of a regular hexagon round O", () => {
    const f = figure415("x");
    const r = length(f, "O", "A");
    for (const name of ["B", "C", "D", "E"]) same(length(f, "O", name), r);
    for (const [a, b] of [
      ["A", "B"],
      ["B", "C"],
      ["C", "D"],
      ["D", "E"],
    ] as const) {
      same(length(f, a, b), r);
    }
    // BE is a diameter and CD is parallel to it.
    same(length(f, "B", "E"), 2 * r);
    expect(pt(f, "C")[1]).toBeCloseTo(pt(f, "D")[1], 5);
    expect(pt(f, "B")[1]).toBeCloseTo(pt(f, "E")[1], 5);
  });

  it("figures 4.11 and 4.12 each hold four shapes with the names of the book", () => {
    expect(FIGURE_411.map((f) => Object.keys(f.pts).join(""))).toEqual([
      "BCDA",
      "FGHE",
      "JKLI",
      "MNOP",
    ]);
    expect(FIGURE_412.map((f) => Object.keys(f.pts).join(""))).toEqual([
      "BCDA",
      "MNPQ",
      "EFGH",
      "KJSRI",
    ]);
    // 4.11b is a rectangle, 4.11d a rhombus; 4.12b is isosceles, 4.12c a parallelogram.
    const rect = FIGURE_411[1] as FigureSpec;
    same(angleAt(rect, "F", "E", "G"), 90, 0.01);
    const rhombus = FIGURE_411[3] as FigureSpec;
    same(length(rhombus, "M", "N"), length(rhombus, "N", "O"));
    same(length(rhombus, "O", "P"), length(rhombus, "P", "M"));
    same(length(rhombus, "M", "N"), length(rhombus, "O", "P"));
    const isosceles = FIGURE_412[1] as FigureSpec;
    same(length(isosceles, "M", "Q"), length(isosceles, "N", "P"));
    const loose = FIGURE_411[0] as FigureSpec;
    expect(
      Math.abs(length(loose, "A", "B") - length(loose, "C", "D")),
    ).toBeGreaterThan(5);
    const para = FIGURE_412[2] as FigureSpec;
    same(length(para, "E", "F"), length(para, "H", "G"));
  });

  it("three triangles make a trapezoid, eight trapezoids a hexagonal tray", () => {
    const strip = triangleStrip("x", { count: 3 });
    expect(strip.polys).toHaveLength(3);
    for (const v of (strip.polys ?? []).map((poly) => poly.v)) {
      const [a, b, c] = v as [string, string, string];
      same(length(strip, a, b), length(strip, b, c), 0.01);
      same(length(strip, b, c), length(strip, c, a), 0.01);
    }
    expect(triangleStrip("x", { count: 1 }).polys).toHaveLength(1);
    expect(triangleStrip("x", { count: 1 }).segs).toHaveLength(6);

    const tray = trayFigure("x", 8);
    expect(tray.polys).toHaveLength(8);
    expect(tray.segs).toBeUndefined();
    for (const poly of tray.polys ?? []) {
      // Each piece has three sides of u and one of 2u, whatever corner it
      // starts from.
      const v = poly.v;
      const sides = v
        .map((name, i) => length(tray, name, v[(i + 1) % 4] as string))
        .sort((x, y) => x - y);
      const unit = sides[0] as number;
      for (const side of sides.slice(0, 3)) same(side, unit, 0.01);
      same(sides[3] as number, 2 * unit, 0.01);
    }
    expect(trayFigure("x", 3).polys).toHaveLength(3);
  });

  it("two trapezoids make a hexagon, cut across it where the tray's cut slants", () => {
    const halves = halvesFigure("x", 2);
    expect(halves.polys).toHaveLength(2);
    expect(halves.segs).toBeUndefined();
    for (const poly of halves.polys ?? []) {
      const v = poly.v;
      const sides = v
        .map((name, i) => length(halves, name, v[(i + 1) % 4] as string))
        .sort((x, y) => x - y);
      const unit = sides[0] as number;
      for (const side of sides.slice(0, 3)) same(side, unit, 0.01);
      same(sides[3] as number, 2 * unit, 0.01);
    }
    // The cut is level; the tray's cut leans.
    expect(pt(halves, "h0")[1]).toBeCloseTo(pt(halves, "h3")[1], 5);
    const tray = trayFigure("x", 8);
    expect(pt(tray, "i2")[1]).not.toBeCloseTo(pt(tray, "i5")[1], 0);
    expect(halvesFigure("x", 0).segs).toHaveLength(8);
    expect(halvesFigure("x", 1).polys).toHaveLength(1);
  });
});

describe("drawing boards", () => {
  const SHAPES: {
    shape: BoardShape;
    names: string[];
    params: Record<string, number>;
  }[] = [
    { shape: "rectangle", names: ["D", "E", "F", "G"], params: { a: 3, b: 5 } },
    { shape: "rhombus", names: ["M", "N", "P", "Q"], params: { side: 4 } },
    {
      shape: "rhombus",
      names: ["M", "N", "P", "Q"],
      params: { side: 5, angle: 60 },
    },
    {
      shape: "parallelogram",
      names: ["E", "F", "H", "K"],
      params: { a: 3, b: 4 },
    },
    {
      shape: "parallelogram-diagonal",
      names: ["A", "B", "C", "D"],
      params: { ab: 3, bc: 5, ac: 6 },
    },
  ];

  it("accepts its solved state and nothing else", () => {
    for (const { shape, params } of SHAPES) {
      const solved = solvedState(shape, params);
      expect(isDrawn(shape, solved, params)).toBe(true);
      expect(isDrawn(shape, {}, params)).toBe(false);
      for (const key of Object.keys(solved)) {
        expect(isDrawn(shape, { ...solved, [key]: 0 }, params)).toBe(false);
        const { [key]: _left, ...without } = solved;
        expect(isDrawn(shape, without, params)).toBe(false);
      }
    }
  });

  it("takes any angle when none is asked, only the asked one otherwise", () => {
    const free = { side: 4 };
    for (const angle of ANGLES) {
      const state = { ...solvedState("rhombus", free), angle };
      expect(isDrawn("rhombus", state, free)).toBe(true);
      expect(isDrawn("rhombus", state, { side: 4, angle: 60 })).toBe(
        angle === 60,
      );
    }
    expect(
      isDrawn("rhombus", { ...solvedState("rhombus", free), angle: 90 }, free),
    ).toBe(false);
    expect(
      isDrawn(
        "parallelogram",
        { ...solvedState("parallelogram", { a: 3, b: 4 }), angle: 45 },
        { a: 3, b: 4 },
      ),
    ).toBe(true);
    expect(expectedState("rhombus", { side: 5, angle: 60 }).angle).toBe(60);
  });

  it("registers a validator and a solver for each exercise it serves", () => {
    const ids = [
      ["ve-hinh-chu-nhat", { a: 3, b: 5 }],
      ["ve-hinh-thoi", { side: 4 }],
      ["ve-hinh-thoi", { side: 5, angle: 60 }],
      ["ve-binh-hanh-hai-canh", { a: 3, b: 4 }],
      ["ve-binh-hanh-duong-cheo", { ab: 3, bc: 5, ac: 6 }],
      ["ghep-hinh", { n: 3 }],
      ["ghep-hinh", { n: 8 }],
    ] as const;
    for (const [id, params] of ids) {
      const state = solutions[id](params);
      expect(validators[id](state, params)).toBe(true);
      expect(validators[id]({}, params)).toBe(false);
    }
    expect(validators["ghep-hinh"]({ n: 2 }, { n: 3 })).toBe(false);
  });

  it("each step waits for the ones before it", () => {
    const steps = boardSteps("rhombus", ["M", "N", "P", "Q"]);
    expect(steps.map((s) => s.key)).toEqual([
      "len",
      "angle",
      "markQ",
      "arcQ",
      "arcN",
      "pointP",
      "join",
    ]);
    expect(stepEnabled(steps, 0, {})).toBe(true);
    expect(stepEnabled(steps, 1, {})).toBe(false);
    expect(stepEnabled(steps, 1, { len: 3 })).toBe(true);
    const pick = steps[1] as (typeof steps)[number];
    expect(stepDone(pick, { angle: 60 })).toBe(true);
    expect(stepDone(pick, { angle: 90 })).toBe(false);
  });

  it("draws the finished rectangle with right angles and equal opposite sides", () => {
    const state = solvedState("rectangle", { a: 3, b: 5 });
    const f = boardFigure("rectangle", ["D", "E", "F", "G"], state);
    same(length(f, "D", "E"), 3 * 18, 0.01);
    same(length(f, "E", "F"), 5 * 18, 0.01);
    same(length(f, "D", "G"), length(f, "E", "F"), 0.01);
    same(angleAt(f, "E", "D", "F"), 90, 0.01);
    expect(f.ticks).toHaveLength(2);
  });

  it("draws the finished rhombus with four equal sides and the chosen angle", () => {
    const state = solvedState("rhombus", { side: 5, angle: 60 });
    const f = boardFigure("rhombus", ["M", "N", "P", "Q"], state);
    const side = length(f, "M", "N");
    same(side, 5 * 18, 0.01);
    for (const [a, b] of [
      ["N", "P"],
      ["P", "Q"],
      ["Q", "M"],
    ] as const) {
      same(length(f, a, b), side, 0.01);
    }
    same(angleAt(f, "M", "N", "Q"), 60, 0.01);
    // All four sides are drawn, the first one included.
    const drawn = (f.segs ?? [])
      .filter((seg) => seg.bold)
      .map((seg) => `${seg.a}${seg.b}`);
    expect(drawn.sort()).toEqual(["MN", "MQ", "PN", "QP"].sort());
  });

  it("draws the finished parallelograms with equal opposite sides", () => {
    const sides = boardFigure(
      "parallelogram",
      ["E", "F", "H", "K"],
      solvedState("parallelogram", { a: 3, b: 4 }),
    );
    same(length(sides, "E", "F"), length(sides, "K", "H"), 0.01);
    same(length(sides, "E", "K"), length(sides, "F", "H"), 0.01);
    same(length(sides, "E", "K"), 4 * 18, 0.01);
    expect(sides.arrows).toHaveLength(2);

    const state = solvedState("parallelogram-diagonal", {
      ab: 3,
      bc: 5,
      ac: 6,
    });
    const f = boardFigure(
      "parallelogram-diagonal",
      ["A", "B", "C", "D"],
      state,
    );
    same(length(f, "A", "B"), 3 * 18, 0.01);
    same(length(f, "B", "C"), 5 * 18, 0.01);
    same(length(f, "A", "C"), 6 * 18, 0.01);
    same(length(f, "A", "B"), length(f, "D", "C"), 0.01);
    same(length(f, "B", "C"), length(f, "A", "D"), 0.01);
    expect(cornerOf({ len: 6, rBC: 1, rAC: 1 })).toBeUndefined();
  });

  it("never throws for a half-drawn board", () => {
    for (const { shape, names, params } of SHAPES) {
      const solved = solvedState(shape, params);
      const keys = Object.keys(solved);
      for (let n = 0; n <= keys.length; n++) {
        const partial = Object.fromEntries(
          keys.slice(0, n).map((key) => [key, solved[key] as number]),
        );
        expect(() => boardFigure(shape, names, partial)).not.toThrow();
      }
    }
  });
});

describe("boardView", () => {
  const NAMES = ["M", "N", "P", "Q"];

  it("writes the name of the fourth corner of a rhombus clear of its compass arc and guide line", () => {
    for (const angle of ANGLES) {
      for (const side of [2, 3, 4, 5, 6]) {
        const state = solvedState("rhombus", { side, angle });
        const view = boardView("rhombus", NAMES, state);
        expect(view.names).not.toContain("Q");
        const text = (view.texts ?? []).find((t) => t.text === "Q");
        if (!text) throw new Error("the name Q is not written");
        const spot: Pt = [text.x, text.y];
        same(dist(spot, pt(view, "Q")), 30, 0.01);
        // The arc round M that passes through Q, sampled along its length.
        const arc = (view.arcs ?? []).find((a) => a.c === "M");
        if (!arc) throw new Error("no arc round M");
        const origin = pt(view, "M");
        for (let i = 0; i <= 20; i++) {
          const deg = arc.from + ((arc.to - arc.from) * i) / 20;
          const onArc = polar(origin[0], origin[1], arc.r, deg);
          expect(dist(spot, onArc)).toBeGreaterThan(14);
        }
        // The dashed guide line from M through Q.
        const ray = pt(view, "ray");
        const along =
          ((spot[0] - origin[0]) * (ray[0] - origin[0]) +
            (spot[1] - origin[1]) * (ray[1] - origin[1])) /
          dist(origin, ray) ** 2;
        const foot: Pt = [
          origin[0] + along * (ray[0] - origin[0]),
          origin[1] + along * (ray[1] - origin[1]),
        ];
        expect(dist(spot, foot)).toBeGreaterThan(14);
      }
    }
  });

  it("leaves every other board as boardFigure draws it", () => {
    const state = solvedState("parallelogram", { a: 3, b: 4 });
    expect(boardView("parallelogram", ["E", "F", "H", "K"], state)).toEqual(
      boardFigure("parallelogram", ["E", "F", "H", "K"], state),
    );
    const rectangle = solvedState("rectangle", { a: 3, b: 5 });
    expect(boardView("rectangle", ["D", "E", "F", "G"], rectangle)).toEqual(
      boardFigure("rectangle", ["D", "E", "F", "G"], rectangle),
    );
  });

  it("cuts the empty top rows off a frame and moves everything else up with it", () => {
    const full = boardFigure(
      "rectangle",
      ["A", "B", "C", "D"],
      solvedState("rectangle", { a: 4, b: 3 }),
    );
    const cut = trimTop(full, 4);
    same(cut.h, full.h - 4 * 18, 0.01);
    same(pt(cut, "C")[1], pt(full, "C")[1] - 4 * 18, 0.01);
    same(pt(cut, "C")[0], pt(full, "C")[0], 0.01);
    same((cut.ruler?.y ?? 0) + 4 * 18, full.ruler?.y ?? Number.NaN, 0.01);
    expect(cut.segs).toEqual(full.segs);
  });
});

describe("BoardVisual", () => {
  const press = (name: string) =>
    fireEvent.click(screen.getByRole("button", { name }));

  it("is a guided step: it reports each change and says when the figure is right", () => {
    const onStateChange = vi.fn();
    render(
      <BoardVisual
        spec={{
          shape: "rectangle",
          names: ["A", "B", "C", "D"],
          goal: { a: 1, b: 2 },
          done: "Xong hình.",
        }}
        onStateChange={onStateChange}
      />,
    );
    expect(screen.getByText(/Dùng thước vẽ đoạn thẳng AB/)).toBeInTheDocument();
    // Only the step to do is on the screen.
    expect(screen.queryByRole("button", { name: /Êke tại A/ })).toBeNull();
    press("Tăng cạnh ab (cm)");
    press("Êke tại A");
    press("Êke tại B");
    press("Tăng bc, ad (cm)");
    press("Tăng bc, ad (cm)");
    expect(screen.queryByText("Xong hình.")).toBeNull();
    press("Nối DC");
    expect(onStateChange).toHaveBeenLastCalledWith({
      len: 1,
      perpD: 1,
      perpE: 1,
      h: 2,
      join: 1,
    });
    expect(screen.getByText("Xong hình.")).toBeInTheDocument();
  });

  it("shows the step to do and the one before it, and draws again from the start on request", () => {
    const onStateChange = vi.fn();
    render(
      <BoardVisual
        spec={{ shape: "rectangle", names: ["A", "B", "C", "D"] }}
        params={{ a: 3, b: 2 }}
        onStateChange={onStateChange}
      />,
    );
    expect(screen.queryByRole("button", { name: "Vẽ lại từ đầu" })).toBeNull();
    press("Tăng cạnh ab (cm)");
    press("Êke tại A");
    press("Êke tại B");
    // The earlier steps are out of sight now; the last press stays.
    expect(
      screen.queryByRole("button", { name: "Tăng cạnh ab (cm)" }),
    ).toBeNull();
    expect(screen.queryByRole("button", { name: "Êke tại A" })).toBeNull();
    expect(
      screen.getByRole("button", { name: "Êke tại B" }),
    ).toBeInTheDocument();
    press("Vẽ lại từ đầu");
    expect(onStateChange).toHaveBeenLastCalledWith({});
    expect(
      screen.getByRole("button", { name: "Tăng cạnh ab (cm)" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Êke tại B" })).toBeNull();
  });

  it("sets an angle with one button and warns when the arcs of the diagonal board cannot meet", () => {
    const onStateChange = vi.fn();
    const { unmount } = render(
      <BoardVisual
        spec={{ shape: "rhombus", names: ["M", "N", "P", "Q"] }}
        params={{ side: 2 }}
        onStateChange={onStateChange}
      />,
    );
    expect(screen.queryByRole("button", { name: "60°" })).toBeNull();
    press("Tăng cạnh mn (cm)");
    press("60°");
    expect(onStateChange).toHaveBeenLastCalledWith({ len: 1, angle: 60 });
    // An exercise never says whether the figure is right.
    expect(screen.queryByText(/vẽ xong/)).toBeNull();
    unmount();

    render(
      <BoardVisual
        spec={{ shape: "parallelogram-diagonal", names: ["A", "B", "C", "D"] }}
        params={{ ab: 1, bc: 1, ac: 7 }}
      />,
    );
    press("Tăng cạnh ab (cm)");
    press("Tăng mở compa bc (cm)");
    press("Cung tại B");
    for (let i = 0; i < 7; i++) press("Tăng mở compa ac (cm)");
    press("Cung tại A");
    expect(screen.getByText(/Hai cung chưa gặp nhau/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Điểm C/ })).toBeDisabled();
  });

  it("an exercise board says the steps are all pressed, never that the drawing is right", () => {
    render(
      <BoardVisual
        spec={{ shape: "rectangle", names: ["A", "B", "C", "D"] }}
        params={{ a: 3, b: 2 }}
      />,
    );
    // A wrong length (4, not 3), every step pressed.
    for (let i = 0; i < 4; i++) press("Tăng cạnh ab (cm)");
    press("Êke tại A");
    press("Êke tại B");
    press("Tăng bc, ad (cm)");
    press("Tăng bc, ad (cm)");
    press("Nối DC");
    expect(
      screen.getByText("Bạn đã bấm đủ các bước. Hãy bấm Kiểm tra."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Bạn đã làm xong mọi bước.")).toBeNull();
  });

  it("a guided board with every step done but the wrong numbers warns instead of closing", () => {
    render(
      <BoardVisual
        spec={{
          shape: "rectangle",
          names: ["A", "B", "C", "D"],
          goal: { a: 1, b: 2 },
        }}
      />,
    );
    for (let i = 0; i < 2; i++) press("Tăng cạnh ab (cm)");
    press("Êke tại A");
    press("Êke tại B");
    press("Tăng bc, ad (cm)");
    press("Tăng bc, ad (cm)");
    press("Nối DC");
    expect(screen.getByText(/số đo chưa đúng/)).toBeInTheDocument();
    expect(screen.queryByText("Bạn đã làm xong mọi bước.")).toBeNull();
  });

  it("writes no ray, only a line at a given angle", () => {
    for (const shape of ["rhombus", "parallelogram"] as const) {
      for (const step of boardSteps(shape, ["A", "B", "C", "D"])) {
        expect(step.text).not.toMatch(/\btia\b/);
      }
    }
  });

  it("shows a given state locked, with no way to start over", () => {
    render(
      <BoardVisual
        spec={{ shape: "parallelogram", names: ["E", "F", "H", "K"] }}
        params={{ a: 3, b: 4 }}
        shownState={solvedState("parallelogram", { a: 3, b: 4 })}
      />,
    );
    expect(screen.getByRole("button", { name: "Nối" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Vẽ lại từ đầu" })).toBeNull();
  });
});

describe("PiecesVisual", () => {
  it("adds the pieces one at a time and ends the guided step at the goal", () => {
    const onStateChange = vi.fn();
    render(
      <PiecesVisual
        spec={{ which: "strip", goal: 3 }}
        onStateChange={onStateChange}
      />,
    );
    expect(screen.getByText("Đã ghép 0/3 miếng")).toBeInTheDocument();
    const add = screen.getByRole("button", {
      name: "Tăng số miếng tam giác đã ghép",
    });
    fireEvent.click(add);
    fireEvent.click(add);
    fireEvent.click(add);
    expect(onStateChange).toHaveBeenLastCalledWith({ n: 3 });
    expect(
      screen.getByText("Ba miếng ghép thành một hình thang cân."),
    ).toBeInTheDocument();
  });

  it("two trapezoids make the hexagon of the guided step", () => {
    const onStateChange = vi.fn();
    render(
      <PiecesVisual
        spec={{ which: "halves", goal: 2 }}
        onStateChange={onStateChange}
      />,
    );
    expect(screen.getByText("Đã ghép 0/2 miếng")).toBeInTheDocument();
    const add = screen.getByRole("button", {
      name: "Tăng số miếng hình thang cân đã ghép",
    });
    fireEvent.click(add);
    fireEvent.click(add);
    expect(onStateChange).toHaveBeenLastCalledWith({ n: 2 });
    expect(
      screen.getByText("Hai miếng ghép thành một hình lục giác đều."),
    ).toBeInTheDocument();
  });

  it("the tray takes eight pieces", () => {
    render(<PiecesVisual spec={{ which: "tray" }} params={{ n: 8 }} />);
    expect(screen.getByText("Đã ghép 0/8 miếng")).toBeInTheDocument();
  });
});

describe("TapCards", () => {
  it("shows the name of a card once it is tapped and the closing line at the end", () => {
    const onStateChange = vi.fn();
    render(
      <TapCards
        spec={{
          label: "x",
          verb: "xem",
          done: "Bạn đã xem hết.",
          items: [
            { name: "Hình chữ nhật", color: "teal", art: { scene: "door" } },
            {
              name: "Hình thoi",
              color: "pink",
              art: { scene: "fence" },
              facts: ["Bốn cạnh bằng nhau"],
            },
          ],
        }}
        onStateChange={onStateChange}
      />,
    );
    expect(screen.getByText("Đã xem 0/2")).toBeInTheDocument();
    expect(screen.queryByText("Hình thoi")).toBeNull();
    const cards = screen.getAllByRole("button", {
      name: "Chạm để xem tên hình",
    });
    fireEvent.click(cards[0] as HTMLElement);
    expect(screen.getByText("Hình chữ nhật")).toBeInTheDocument();
    fireEvent.click(cards[1] as HTMLElement);
    expect(screen.getByText("Bốn cạnh bằng nhau")).toBeInTheDocument();
    expect(onStateChange).toHaveBeenLastCalledWith({ i0: 1, i1: 1 });
    expect(screen.getByText("Bạn đã xem hết.")).toBeInTheDocument();
  });
});

// Every item of the two lessons' catalogs, keyed by lesson and picture.
const LESSON_CATALOGS = [
  [RECTANGLE_SLUG, RECTANGLE_SPECS],
  [PARALLELOGRAM_SLUG, PARALLELOGRAM_SPECS],
] as const;
const ALL_SPECS = LESSON_CATALOGS.flatMap(([slug, specs]) =>
  Object.entries(specs).map(([key, spec]) => [`${slug}.${key}`, spec] as const),
);

describe("catalog", () => {
  it("each lesson's catalog holds exactly the pictures its lesson names", () => {
    for (const [slug, specs] of LESSON_CATALOGS) {
      const lesson = JSON.parse(
        readFileSync(
          path.join("content/math/kntt", slug, "lesson.json"),
          "utf8",
        ),
      );
      const named = new Set(
        collectVisualRefs(lesson).map((ref) => ref.visualId),
      );
      const held = new Set(
        Object.keys(specs).map((key) => `${slug}.visual.${key}`),
      );
      expect(
        [...named].filter((id) => !held.has(id)),
        slug,
      ).toEqual([]);
      expect(
        [...held].filter((id) => !named.has(id)),
        slug,
      ).toEqual([]);
    }
  });

  it("every probe names points of its figure and writes its measures inside the drawing", () => {
    for (const [key, spec] of ALL_SPECS) {
      if (spec.kind !== "probe") continue;
      const all = spec.parts.map(() => true);
      const shown = probeFigure(spec, all);
      for (const t of shown.texts ?? []) {
        expect(t.x, `${key} ${t.text}`).toBeGreaterThan(0);
        expect(t.x, `${key} ${t.text}`).toBeLessThan(spec.figure.w);
        expect(t.y, `${key} ${t.text}`).toBeGreaterThan(0);
        expect(t.y, `${key} ${t.text}`).toBeLessThan(spec.figure.h);
      }
    }
  });

  it("no picture or step of a drawing writes a ray", () => {
    const words = (o: unknown): string[] =>
      typeof o === "string"
        ? [o]
        : Array.isArray(o)
          ? o.flatMap(words)
          : typeof o === "object" && o !== null
            ? Object.values(o).flatMap(words)
            : [];
    for (const [key, spec] of ALL_SPECS) {
      for (const text of words(spec)) {
        expect(text, key).not.toMatch(/\btia\b/);
      }
    }
  });

  it("every item has a valid kind and boards name four corners", () => {
    for (const [key, spec] of ALL_SPECS) {
      if (spec.kind === "board") {
        expect(spec.names, key).toHaveLength(4);
        if (spec.goal) {
          expect(
            isDrawn(spec.shape, solvedState(spec.shape, spec.goal), spec.goal),
            key,
          ).toBe(true);
        }
      }
    }
  });
});
