import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VISUAL_SPECS } from "@/visuals/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/catalog";
import {
  quadrilateral,
  shape,
  sideTextAt,
  units,
} from "@/visuals/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/figures";
import { Floor } from "@/visuals/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/floor";
import {
  solutions,
  validators,
} from "@/visuals/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/logic";
import {
  pieceStatus,
  stageGoal,
  type WalkSpec,
  walkFigure,
  walkSum,
} from "@/visuals/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/models";
import {
  parallelogramGeo,
  trapezoidGeo,
} from "@/visuals/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/shapes";
import type { VisualSpec } from "@/visuals/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/spec";
import { Stage } from "@/visuals/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/stage";
import {
  parallelogramSlide,
  rhombusFold,
  trapezoidJoin,
} from "@/visuals/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/stages";
import { Tiles } from "@/visuals/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/tiles";
import { Walk } from "@/visuals/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/walk";
import type { FigureSpec, Pt } from "@/visuals/shared/plane/figure-spec";
import { dist } from "@/visuals/shared/plane/geometry";

const pt = (figure: FigureSpec, name: string): Pt => {
  const p = figure.pts[name];
  if (!p) throw new Error(`no point ${name}`);
  return p;
};
const near = (a: number, b: number, tolerance = 0.01) =>
  expect(Math.abs(a - b)).toBeLessThan(tolerance);
const area = (points: readonly Pt[]) =>
  Math.abs(
    points.reduce((sum, p, i) => {
      const q = points[(i + 1) % points.length] as Pt;
      return sum + p[0] * q[1] - q[0] * p[1];
    }, 0) / 2,
  );
const polyArea = (figure: FigureSpec, names: readonly string[]) =>
  area(names.map((n) => pt(figure, n)));

describe("figures", () => {
  it("builds the quadrilateral with the four sides asked for", () => {
    const [a, b, c, d] = quadrilateral(3, 4, 5, 6, 90) as [Pt, Pt, Pt, Pt];
    near(dist(a, b), 3);
    near(dist(b, c), 4);
    near(dist(c, d), 5);
    near(dist(d, a), 6);
  });

  it("writes a measure on the side away from the middle of the shape", () => {
    const [x, y] = sideTextAt([0, 0], [100, 0], [50, 50], "7 m");
    expect(x).toBeCloseTo(50);
    expect(y).toBeLessThan(0);
  });

  it("names the corners A, B, C, D and puts the sides' texts outside", () => {
    const f = shape({
      label: "Hình chữ nhật",
      corners: units.rect(8, 5),
      sides: [{ i: 0, text: "8 cm" }],
    });
    expect(Object.keys(f.pts)).toEqual(["A", "B", "C", "D"]);
    const text = f.texts?.[0];
    expect(text?.y).toBeLessThan(pt(f, "A")[1]);
  });
});

describe("geometry of the moving pictures", () => {
  it("slides the cut triangle of the parallelogram onto the right side", () => {
    const g = parallelogramGeo(6, 3, 2);
    const dx = (g.pts.BR as Pt)[0] - (g.pts.BL as Pt)[0];
    // BL goes to BR and TL to TR: the triangle ends up on the right.
    near((g.pts.BL as Pt)[0] + dx, (g.pts.BR as Pt)[0]);
    near((g.pts.TL as Pt)[0] + dx, (g.pts.TR as Pt)[0]);
    // The rectangle has the base and the height of the parallelogram.
    near((g.pts.TR as Pt)[0] - (g.pts.TL as Pt)[0], dx);
    near(
      (g.pts.F as Pt)[1] - (g.pts.TL as Pt)[1],
      (g.pts.BL as Pt)[1] - (g.pts.TL as Pt)[1],
    );
  });

  it("turns each outer triangle half a turn onto a quarter of the rhombus", () => {
    const spec = rhombusFold();
    const f = spec.base;
    const whole = polyArea(f, ["BOX_TL", "BOX_TR", "BOX_BR", "BOX_BL"]);
    near(polyArea(f, ["T", "R", "B", "L"]), whole / 2, 0.5);
    const corners = [
      ["BOX_TL", "T", "L"],
      ["BOX_TR", "T", "R"],
      ["BOX_BR", "R", "B"],
      ["BOX_BL", "L", "B"],
    ] as const;
    corners.forEach(([corner, a, b], i) => {
      const move = spec.pieces[i]?.move;
      if (!move || !("turn" in move)) throw new Error("turn expected");
      // The turn is about the middle of the side a-b, so the corner lands on
      // the centre, and the triangle on the quarter a, b, centre.
      const [ax, ay] = pt(f, a);
      const [bx, by] = pt(f, b);
      near(move.cx, (ax + bx) / 2);
      near(move.cy, (ay + by) / 2);
      const [px, py] = pt(f, corner);
      const [cx, cy] = pt(f, "C");
      near(2 * move.cx - px, cx);
      near(2 * move.cy - py, cy);
      near(polyArea(f, [corner, a, b]), polyArea(f, [a, b, "C"]), 0.5);
    });
  });

  it("turns the copy of the trapezoid onto the other half of a parallelogram", () => {
    const g = trapezoidGeo(8, 4, 3);
    const f = { pts: g.pts } as FigureSpec;
    const [mx, my] = pt(f, "M");
    for (const [from, to] of [
      ["BL", "CBL"],
      ["TL", "CTL"],
      ["TR", "CTR"],
      ["BR", "CBR"],
    ] as const) {
      const p = pt(f, from);
      const q = pt(f, to);
      near(p[0] + q[0], 2 * mx);
      near(p[1] + q[1], 2 * my);
    }
    // Two trapezoids fill the parallelogram of base top + bottom.
    near(
      2 * polyArea(f, ["BL", "TL", "TR", "BR"]),
      polyArea(f, ["W_TL", "W_TR", "W_BR", "W_BL"]),
      0.5,
    );
    near(
      dist(pt(f, "W_TL"), pt(f, "W_TR")),
      dist(pt(f, "W_BL"), pt(f, "W_BR")),
    );
  });
});

describe("the redrawn hexagon of exercise 4.25", () => {
  it("is made of eight trapezoids of the same area", () => {
    const spec = VISUAL_SPECS["sbt-hinh-4-25"];
    if (spec?.kind !== "figure") throw new Error("figure expected");
    const polys = spec.figure.polys ?? [];
    expect(polys).toHaveLength(8);
    const areas = polys.map((poly) => polyArea(spec.figure, poly.v));
    for (const a of areas) near(a, areas[0] ?? 0, 1);
  });
});

describe("the walk round a shape", () => {
  const spec: WalkSpec = {
    figure: shape({ label: "Hình chữ nhật", corners: units.rect(6, 4) }),
    sides: [6, 4, 6, 4],
    unit: "m",
    closing: "Chu vi là 20 m.",
  };

  it("writes the running sum and shows each side walked", () => {
    expect(walkSum(spec, 0)).toBe("");
    expect(walkSum(spec, 3)).toBe("6 + 4 + 6 = 16 m");
    expect(walkSum(spec, 4)).toBe("6 + 4 + 6 + 4 = 20 m");
    expect(walkFigure(spec, 2).segs).toHaveLength(2);
    expect(walkFigure(spec, 2).texts).toHaveLength(2);
  });

  it("reports the sides walked and closes with the perimeter", () => {
    const onStateChange = vi.fn();
    render(<Walk spec={spec} onStateChange={onStateChange} params={{}} />);
    const go = screen.getByRole("button", { name: "Đi tiếp" });
    for (let i = 0; i < 4; i++) fireEvent.click(go);
    expect(onStateChange).toHaveBeenLastCalledWith({ k: 4 });
    expect(screen.getByText("Chu vi là 20 m.")).toBeDefined();
    expect(go.hasAttribute("disabled")).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Đi lại" }));
    expect(onStateChange).toHaveBeenLastCalledWith({ k: 0 });
  });
});

describe("the unit squares", () => {
  it("counts the squares the child taps and closes when all are counted", () => {
    const spec = VISUAL_SPECS["tiles-bac-thang"];
    if (spec?.kind !== "tiles") throw new Error("tiles expected");
    const onStateChange = vi.fn();
    render(<Tiles spec={spec} onStateChange={onStateChange} params={{}} />);
    expect(screen.getByText("Đã đếm 0/10")).toBeDefined();
    for (let i = 1; i <= 10; i++) {
      fireEvent.click(screen.getByRole("button", { name: `Ô vuông số ${i}` }));
    }
    expect(screen.getByText("Đã đếm 10/10")).toBeDefined();
    expect(screen.getByText(spec.done)).toBeDefined();
    expect(onStateChange).toHaveBeenCalledTimes(10);
  });
});

describe("the floor of tiles", () => {
  const spec = VISUAL_SPECS["floor-lesson"];
  if (spec?.kind !== "floor") throw new Error("floor expected");

  it("reports tiles per row and rows, and the validator reads them", () => {
    const onStateChange = vi.fn();
    render(
      <Floor
        spec={spec}
        onStateChange={onStateChange}
        params={{ perRow: 4, rows: 3 }}
      />,
    );
    const up = (name: string) => screen.getByRole("button", { name });
    for (let i = 0; i < 4; i++) fireEvent.click(up("Tăng số ô mỗi hàng"));
    for (let i = 0; i < 3; i++) fireEvent.click(up("Tăng số hàng"));
    expect(onStateChange).toHaveBeenLastCalledWith({ perRow: 4, rows: 3 });
    expect(screen.getByText("4 · 3 = 12 ô")).toBeDefined();
    expect(
      validators["xep-gach"]({ perRow: 4, rows: 3 }, { perRow: 4, rows: 3 }),
    ).toBe(true);
    expect(
      validators["xep-gach"]({ perRow: 3, rows: 4 }, { perRow: 4, rows: 3 }),
    ).toBe(false);
    expect(validators["xep-gach"]({}, { perRow: 4, rows: 3 })).toBe(false);
  });

  it("solves to a state the validator accepts", () => {
    const params = { perRow: 6, rows: 2 };
    expect(validators["xep-gach"](solutions["xep-gach"](params), params)).toBe(
      true,
    );
  });

  it("holds the lesson screen's Tiếp until the floor is covered", () => {
    render(<Floor spec={spec} />);
    expect(screen.getByText("? · ? = ? ô")).toBeDefined();
  });
});

describe("the stages", () => {
  it("presses through the cut and slide of the parallelogram", () => {
    const spec = parallelogramSlide();
    expect(stageGoal(spec)).toBe(3);
    const onStateChange = vi.fn();
    render(<Stage spec={spec} onStateChange={onStateChange} params={{}} />);
    for (const name of ["Kẻ chiều cao", "Cắt tam giác", "Trượt sang phải"]) {
      fireEvent.click(screen.getByRole("button", { name }));
    }
    expect(onStateChange).toHaveBeenLastCalledWith({ step: 3 });
    expect(screen.getByText(spec.done)).toBeDefined();
  });

  it("turns the four triangles of the rhombus by tapping them", () => {
    const spec = rhombusFold();
    expect(stageGoal(spec)).toBe(4);
    const onStateChange = vi.fn();
    render(<Stage spec={spec} onStateChange={onStateChange} params={{}} />);
    expect(screen.getByText("Đã xoay 0/4")).toBeDefined();
    for (const piece of spec.pieces) {
      fireEvent.click(
        screen.getByRole("button", { name: piece.label ?? piece.id }),
      );
    }
    expect(screen.getByText("Đã xoay 4/4")).toBeDefined();
    expect(screen.getByText(spec.done)).toBeDefined();
  });

  it("copies and turns the trapezoid in two presses", () => {
    const spec = trapezoidJoin();
    expect(stageGoal(spec)).toBe(2);
    const copy = spec.pieces.find((p) => p.id === "ban-sao");
    if (!copy) throw new Error("copy missing");
    expect(pieceStatus(copy, 0, new Set())).toEqual({
      visible: false,
      moved: false,
    });
    expect(pieceStatus(copy, 1, new Set())).toEqual({
      visible: true,
      moved: true,
    });
  });
});

// Every figure a spec draws: still figures, the frames of a step player, the
// pictures of a gallery, the one above a calculation, and the base of a stage.
function figuresOf(spec: VisualSpec): FigureSpec[] {
  switch (spec.kind) {
    case "figure":
      return [spec.figure];
    case "steps":
      return spec.frames.map((frame) => frame.figure);
    case "gallery":
      return spec.items.map((item) => item.figure);
    case "calc":
      return spec.figure ? [spec.figure] : [];
    case "probe":
      return [spec.figure];
    case "walk":
      return Array.from({ length: spec.sides.length + 1 }, (_, k) =>
        walkFigure(spec, k),
      );
    case "stage":
      return [spec.base];
    default:
      return [];
  }
}

describe("the catalog", () => {
  it("has only keys the lesson can name and every figure names its points", () => {
    for (const [key, spec] of Object.entries(VISUAL_SPECS)) {
      expect(key).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      for (const figure of figuresOf(spec)) {
        const names = Object.keys(figure.pts);
        for (const poly of figure.polys ?? []) {
          for (const v of poly.v) expect(names, `${key}: ${v}`).toContain(v);
        }
        for (const seg of figure.segs ?? []) {
          expect(names, `${key}: ${seg.a}`).toContain(seg.a);
          expect(names, `${key}: ${seg.b}`).toContain(seg.b);
        }
      }
    }
  });

  it("never draws two polygons or two segments with the same corners (a React key)", () => {
    for (const [key, spec] of Object.entries(VISUAL_SPECS)) {
      for (const figure of figuresOf(spec)) {
        const polys = (figure.polys ?? []).map((p) => p.v.join(""));
        expect(new Set(polys).size, `${key}: polygons ${polys}`).toBe(
          polys.length,
        );
        const segs = (figure.segs ?? []).map((s) => `${s.a}${s.b}`);
        expect(new Set(segs).size, `${key}: segments ${segs}`).toBe(
          segs.length,
        );
        const texts = (figure.texts ?? []).map((t) => `${t.x}${t.y}${t.text}`);
        expect(new Set(texts).size, `${key}: texts`).toBe(texts.length);
      }
    }
  });
});
