import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { keepUnits } from "@/visuals/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/builders";
import { VISUAL_SPECS } from "@/visuals/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/catalog";
import { BOOK_PAIR_KEYS } from "@/visuals/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/catalog-book";
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
import type {
  FigureSpec,
  FigureText,
  Pt,
} from "@/visuals/shared/plane/figure-spec";
import { dist } from "@/visuals/shared/plane/geometry";
import { probeFigure } from "@/visuals/shared/plane/probe-model";

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

describe("the redrawn hexagon of the stone-counting question", () => {
  it("is three equal rhombuses, one of them grey", () => {
    const spec = VISUAL_SPECS["dan-luc-giac-3"];
    if (spec?.kind !== "figure") throw new Error("figure expected");
    const polys = spec.figure.polys ?? [];
    expect(polys).toHaveLength(3);
    const areas = polys.map((poly) => polyArea(spec.figure, poly.v));
    for (const a of areas) near(a, areas[0] ?? 0, 1);
    expect(polys.filter((poly) => poly.fill === "slate")).toHaveLength(1);
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

  it("writes each side walked with its unit", () => {
    const texts = walkFigure(spec, 2).texts ?? [];
    expect(texts.map((t) => t.text)).toEqual(["6 m", "4 m"]);
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

// The text as the screen reader tool matches it: a no-break space reads as a
// space.
const readAs = (text: string) => text.replaceAll("\u00a0", " ");

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
    expect(screen.getByText(readAs(spec.done))).toBeDefined();
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
    expect(screen.getByText(readAs(spec.done))).toBeDefined();
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

// ---------------------------------------------------------------- writing

// The writing of a figure must sit clear of every line and of the other
// writing: a letter under a stroke reads as a struck-through sign, and
// writing the picture cuts off is lost. Text is 17 units tall; a character is
// about 9.4 units wide (the width the drawing helpers reserve).
const CHAR_WIDTH = 9.4;
const TEXT_HEIGHT = 17;
const STROKE_CLEARANCE = 2.5;
// The narrowest frame a figure is drawn in (a phone), in pixels.
const PHONE_WIDTH = 342;
const MIN_TEXT_PIXELS = 16;

type Rect = { x0: number; y0: number; x1: number; y1: number };

function textRect(t: FigureText): Rect {
  const width = t.text.length * CHAR_WIDTH;
  const left =
    t.anchor === "start"
      ? t.x
      : t.anchor === "end"
        ? t.x - width
        : t.x - width / 2;
  return {
    x0: left,
    x1: left + width,
    y0: t.y - TEXT_HEIGHT / 2,
    y1: t.y + TEXT_HEIGHT / 2,
  };
}

function rectsOverlap(a: Rect, b: Rect): boolean {
  return a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
}

// Whether the segment p-q passes through the rectangle grown by `pad`.
function segmentHits(p: Pt, q: Pt, rect: Rect, pad: number): boolean {
  const box = {
    x0: rect.x0 - pad,
    x1: rect.x1 + pad,
    y0: rect.y0 - pad,
    y1: rect.y1 + pad,
  };
  let t0 = 0;
  let t1 = 1;
  const dx = q[0] - p[0];
  const dy = q[1] - p[1];
  const clips: [number, number][] = [
    [-dx, p[0] - box.x0],
    [dx, box.x1 - p[0]],
    [-dy, p[1] - box.y0],
    [dy, box.y1 - p[1]],
  ];
  for (const [direction, distance] of clips) {
    if (direction === 0) {
      if (distance < 0) return false;
      continue;
    }
    const t = distance / direction;
    if (direction < 0) t0 = Math.max(t0, t);
    else t1 = Math.min(t1, t);
    if (t0 > t1) return false;
  }
  return true;
}

// Every line a figure draws, as end points.
function linesOf(figure: FigureSpec): [Pt, Pt][] {
  const lines: [Pt, Pt][] = [];
  for (const poly of figure.polys ?? []) {
    poly.v.forEach((name, i) => {
      const next = poly.v[(i + 1) % poly.v.length] as string;
      lines.push([pt(figure, name), pt(figure, next)]);
    });
  }
  for (const seg of figure.segs ?? []) {
    lines.push([pt(figure, seg.a), pt(figure, seg.b)]);
  }
  return lines;
}

// The figures of a spec with their writing: still figures, frames, the
// pictures of a gallery, the figure above a calculation, a probe with every
// part measured, a walk to its end, and a stage with its fixed pieces.
function writtenFigures(spec: VisualSpec): FigureSpec[] {
  switch (spec.kind) {
    case "probe":
      return [
        probeFigure(
          spec,
          spec.parts.map(() => true),
        ),
      ];
    case "stage": {
      const fixed = spec.pieces.filter(
        (piece) => piece.moveAt === undefined && piece.v.length > 1,
      );
      const pts: Record<string, Pt> = { ...spec.base.pts };
      const polys = [...(spec.base.polys ?? [])];
      const segs = [...(spec.base.segs ?? [])];
      for (const piece of fixed) {
        const names = piece.v.map((_, i) => `${piece.id}${i}`);
        names.forEach((name, i) => {
          pts[name] = piece.v[i] as Pt;
        });
        if (piece.v.length === 2) {
          segs.push({ a: names[0] as string, b: names[1] as string });
        } else polys.push({ v: names });
      }
      const texts = [
        ...(spec.base.texts ?? []),
        ...(spec.texts ?? []).map(({ x, y, text, tone }) => ({
          x,
          y,
          text,
          ...(tone ? { tone } : {}),
        })),
      ];
      return [{ ...spec.base, pts, polys, segs, texts }];
    }
    default:
      return figuresOf(spec);
  }
}

// Pixels per drawing unit of a figure in the narrowest frame it is shown in.
function displayScale(spec: VisualSpec, figure: FigureSpec): number {
  const own = figure.maxScale ?? 1.2;
  const byWidth = PHONE_WIDTH / figure.w;
  switch (spec.kind) {
    case "gallery": {
      const columns = spec.columns ?? (spec.items.length >= 3 ? 3 : 2);
      const cap = { 1: 384, 2: 224, 3: 176 }[columns];
      const cell = Math.min((PHONE_WIDTH - 8 * (columns - 1)) / columns, cap);
      return Math.min(own, cell / figure.w);
    }
    case "steps":
      return Math.min(own, byWidth, 280 / figure.h);
    case "calc":
      return Math.min(own, byWidth, 160 / figure.h);
    case "walk":
    case "stage":
    case "probe":
      return Math.min(byWidth, 288 / figure.h);
    default:
      return Math.min(own, byWidth);
  }
}

describe("the writing in the figures", () => {
  it("keeps every piece of writing clear of every line and of other writing", () => {
    const problems: string[] = [];
    for (const [key, spec] of Object.entries(VISUAL_SPECS)) {
      for (const figure of writtenFigures(spec)) {
        const lines = linesOf(figure);
        const texts = figure.texts ?? [];
        texts.forEach((t, i) => {
          const rect = textRect(t);
          if (
            lines.some(([p, q]) => segmentHits(p, q, rect, STROKE_CLEARANCE))
          ) {
            problems.push(
              `${key} (${figure.label}): "${t.text}" is crossed by a line`,
            );
          }
          for (const other of texts.slice(i + 1)) {
            if (rectsOverlap(rect, textRect(other))) {
              problems.push(
                `${key} (${figure.label}): "${t.text}" overlaps "${other.text}"`,
              );
            }
          }
        });
      }
    }
    expect(problems).toEqual([]);
  });

  it("keeps every piece of writing inside its drawing", () => {
    const problems: string[] = [];
    for (const [key, spec] of Object.entries(VISUAL_SPECS)) {
      for (const figure of writtenFigures(spec)) {
        for (const t of figure.texts ?? []) {
          const rect = textRect(t);
          if (
            rect.x0 < 0 ||
            rect.y0 < 0 ||
            rect.x1 > figure.w ||
            rect.y1 > figure.h
          ) {
            problems.push(
              `${key} (${figure.label}): "${t.text}" leaves the drawing`,
            );
          }
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it("draws the writing at 16 pixels or more on a phone", () => {
    const problems: string[] = [];
    for (const [key, spec] of Object.entries(VISUAL_SPECS)) {
      for (const figure of writtenFigures(spec)) {
        if ((figure.texts ?? []).length === 0) continue;
        const pixels =
          (figure.textSize ?? TEXT_HEIGHT) * displayScale(spec, figure);
        if (pixels < MIN_TEXT_PIXELS) {
          problems.push(`${key} (${figure.label}): ${pixels.toFixed(1)}px`);
        }
      }
    }
    expect(problems).toEqual([]);
  });
});

describe("the points of the figures", () => {
  it("keeps every point inside its drawing", () => {
    const problems: string[] = [];
    for (const [key, spec] of Object.entries(VISUAL_SPECS)) {
      for (const figure of writtenFigures(spec)) {
        for (const [name, [x, y]] of Object.entries(figure.pts)) {
          if (x < 0 || y < 0 || x > figure.w || y > figure.h) {
            problems.push(`${key} (${figure.label}): point ${name}`);
          }
        }
      }
    }
    expect(problems).toEqual([]);
  });
});

// ------------------------------------------------------------------- hints

// Numbers of a TeX line, units and exponents left out: "2 · (6 + 8) = 28 m"
// gives 2, 6, 8, 28. A decimal comma written "{,}" reads as a point.
function numbersOf(tex: string): number[] {
  const plain = tex
    .replace(/\\mathrm\{[^}]*\}/g, "")
    .replace(/\^\{[^}]*\}/g, "")
    .replace(/\\,/g, "")
    .replace(/\{,\}/g, ".");
  return (plain.match(/\d+(?:\.\d+)?/g) ?? []).map(Number);
}

// What each line of a row finds: the numbers after its last "=".
function foundBy(tex: string): number[] {
  return tex
    .replace(/\\(?:begin|end)\{gathered\}/g, "")
    .split("\\\\")
    .flatMap((line) => {
      const parts = line.split("=");
      return parts.length > 1
        ? numbersOf(parts[parts.length - 1] as string)
        : [];
    });
}

function calcRows(key: string): readonly { tex: string }[] {
  const spec = VISUAL_SPECS[key];
  if (spec?.kind !== "calc") throw new Error(`calc expected for ${key}`);
  return spec.rows;
}

describe("the hints of the book exercises", () => {
  it("covers the twelve book exercises", () => {
    expect(BOOK_PAIR_KEYS).toHaveLength(12);
  });

  it("shows, before its last row, no number that the solution finds", () => {
    for (const key of BOOK_PAIR_KEYS) {
      const hint = calcRows(`goi-y-${key}`);
      const shown = hint.slice(0, -1).flatMap((row) => numbersOf(row.tex));
      const found = new Set(
        calcRows(`giai-${key}`).flatMap((row) => foundBy(row.tex)),
      );
      const leaked = shown.filter((n) => found.has(n));
      expect(leaked, `hint of ${key} shows ${leaked.join(", ")}`).toEqual([]);
    }
  });

  it("stops every hint at a row it never shows", () => {
    for (const key of BOOK_PAIR_KEYS) {
      const spec = VISUAL_SPECS[`goi-y-${key}`];
      expect(spec?.kind === "calc" && spec.mode, key).toBe("hint");
    }
  });
});

describe("the figures redrawn after the review", () => {
  it("writes the formula of a rule under the picture, not inside it", () => {
    for (const key of ["bbh-quy-tac", "thoi-quy-tac", "thang-quy-tac"]) {
      const spec = VISUAL_SPECS[key];
      if (spec?.kind !== "gallery") throw new Error(`gallery expected: ${key}`);
      expect(spec.items, key).toHaveLength(1);
      const [item] = spec.items;
      expect(item?.caption, key).toMatch(/S\s=/);
      expect(
        item?.figure.texts?.map((t) => t.text).join(" "),
        key,
      ).not.toContain("S =");
    }
  });

  it("names the rhombus's two diagonals in the caption of its rule", () => {
    const spec = VISUAL_SPECS["thoi-quy-tac"];
    if (spec?.kind !== "gallery") throw new Error("gallery expected");
    expect(spec.items[0]?.caption).toContain("a, b là hai đường chéo");
  });

  it("measures the corner block of a square metre outside the grid", () => {
    const spec = VISUAL_SPECS["m2-cm2"];
    if (spec?.kind !== "figure") throw new Error("figure expected");
    const written = (spec.figure.texts ?? []).map((t) => t.text);
    expect(written).toContain("cạnh 10 cm");
    expect(written).toContain("100 cm²");
    expect(written.some((t) => t.startsWith("100 · 100 = 10"))).toBe(true);
    // The block the writing points to is outlined apart from the grid's cells.
    expect(spec.figure.polys?.some((p) => p.tone === "ink")).toBe(true);
  });

  it("leaves a real gap for the gate of the fence, between two posts", () => {
    const spec = VISUAL_SPECS["rao-vuon-giai"];
    if (spec?.kind !== "calc" || !spec.figure)
      throw new Error("calc figure expected");
    const { figure } = spec;
    expect(figure.polys ?? []).toHaveLength(0);
    expect(figure.dots).toEqual(["E", "F"]);
    const gate: Pt = [
      (pt(figure, "E")[0] + pt(figure, "F")[0]) / 2,
      (pt(figure, "E")[1] + pt(figure, "F")[1]) / 2,
    ];
    const fence = (figure.segs ?? []).filter((seg) => seg.bold);
    for (const seg of fence) {
      const [p, q] = [pt(figure, seg.a), pt(figure, seg.b)];
      expect(
        segmentHits(
          p,
          q,
          { x0: gate[0], x1: gate[0], y0: gate[1], y1: gate[1] },
          2,
        ),
        `${seg.a}${seg.b} runs across the gate`,
      ).toBe(false);
    }
  });

  it("puts the name of a reflex corner in the notch, clear of both its sides", () => {
    const spec = VISUAL_SPECS["sbt-hinh-4-20"];
    if (spec?.kind !== "figure") throw new Error("figure expected");
    const { figure } = spec;
    const names = ["A", "B", "C", "D", "E", "F"];
    const polygon = names.map((n) => pt(figure, n));
    const inside = (x: number, y: number) =>
      polygon.reduce((odd, p, i) => {
        const q = polygon[(i + 1) % polygon.length] as Pt;
        const crosses =
          p[1] > y !== q[1] > y &&
          x < ((q[0] - p[0]) * (y - p[1])) / (q[1] - p[1]) + p[0];
        return crosses ? !odd : odd;
      }, false);
    for (const n of names) {
      const t = figure.texts?.find((text) => text.text === n);
      if (!t) throw new Error(`no name ${n}`);
      expect(inside(t.x, t.y), `${n} stands outside the shape`).toBe(false);
    }
  });

  it("marks the two new sides of a cut corner equal to the two stretches they replace", () => {
    const spec = VISUAL_SPECS["khuyet-hai-cap-10-6"];
    if (spec?.kind !== "figure") throw new Error("figure expected");
    const { figure } = spec;
    near(
      dist(pt(figure, "D"), pt(figure, "G")),
      dist(pt(figure, "E"), pt(figure, "F")),
    );
    near(
      dist(pt(figure, "F"), pt(figure, "G")),
      dist(pt(figure, "D"), pt(figure, "E")),
    );
    expect(figure.ticks).toHaveLength(2);
  });

  it("draws the height of the trapezoid in every frame and in the stage", () => {
    const frames = VISUAL_SPECS["thang-ghep"];
    if (frames?.kind !== "steps") throw new Error("steps expected");
    for (const frame of frames.frames) {
      expect(frame.figure.segs?.some((s) => s.a === "TL" && s.b === "F")).toBe(
        true,
      );
      expect(frame.figure.texts?.some((t) => t.text === "3 cm")).toBe(true);
    }
    const stage = trapezoidJoin();
    expect(stage.pieces.some((p) => p.id === "chieu-cao")).toBe(true);
    expect(stage.texts?.some((t) => t.text === "3 cm")).toBe(true);
  });

  it("gives the three bars the lengths 0,3 m, 0,7 m and 1,2 m", () => {
    const spec = VISUAL_SPECS["doi-thanh"];
    if (spec?.kind !== "probe") throw new Error("probe expected");
    expect(spec.parts.map((p) => p.kind === "seg" && p.text)).toEqual([
      "= 30 cm",
      "= 70 cm",
      "= 120 cm",
    ]);
  });

  it("labels the floor with the size of the floor it draws", () => {
    const spec = VISUAL_SPECS["floor-lesson"];
    if (spec?.kind !== "floor") throw new Error("floor expected");
    render(<Floor spec={spec} params={{ perRow: 4, rows: 3 }} />);
    expect(
      screen.getByRole("img", { name: /dài 4 m, rộng 3 m/ }),
    ).toBeDefined();
  });
});

describe("numbers of a thousand or more", () => {
  it("are grouped in every row and every piece of writing", () => {
    const bare = /(^|[^\d.,])\d{4,}/;
    const problems: string[] = [];
    for (const [key, spec] of Object.entries(VISUAL_SPECS)) {
      const strings: string[] = [];
      if (spec.kind === "calc" || spec.kind === "rows") {
        strings.push(...spec.rows.map((row) => row.tex));
      }
      for (const figure of writtenFigures(spec)) {
        strings.push(...(figure.texts ?? []).map((t) => t.text));
      }
      for (const text of strings) {
        if (bare.test(text)) problems.push(`${key}: ${text}`);
      }
    }
    expect(problems).toEqual([]);
  });
});

describe("the rules of the lesson", () => {
  it("each show one large figure per rule, in a single column", () => {
    for (const key of [
      "c4a-quy-tac",
      "c2ab-quy-tac",
      "dt-cn-quy-tac",
      "bbh-quy-tac",
      "thoi-quy-tac",
      "thang-quy-tac",
    ]) {
      const spec = VISUAL_SPECS[key];
      if (spec?.kind !== "gallery") throw new Error(`gallery expected: ${key}`);
      expect(spec.columns, key).toBe(1);
    }
  });

  it("tell how the book writes the half of the rhombus and the trapezoid, and the square", () => {
    const caption = (key: string) => {
      const spec = VISUAL_SPECS[key];
      if (spec?.kind !== "gallery") throw new Error(`gallery expected: ${key}`);
      return spec.items.map((item) => item.caption).join("\n");
    };
    expect(caption("thoi-quy-tac")).toContain("Sách viết ½");
    expect(caption("thang-quy-tac")).toContain("Sách viết ½");
    expect(caption("dt-cn-quy-tac")).toContain("a²");
  });
});

describe("the writing of measures", () => {
  it("keeps a number with its unit on one line", () => {
    expect(keepUnits("dài 6 cm và 10 m².")).toBe(
      "dài 6\u00a0cm và 10\u00a0m².",
    );
    expect(keepUnits("có 5 mét, 3 cmx")).toBe("có 5 mét, 3 cmx");
  });
});

// The visible width of one line of a formula: macros and braces take no room,
// a thin space inside a number counts as one character.
function lineWidth(line: string): number {
  return line
    .replace(/\\concept\{\w+\}/g, "")
    .replace(/\\mathrm/g, "")
    .replace(/\\ /g, " ")
    .replace(/\\,/g, " ")
    .replace(/\\cdot/g, "·")
    .replace(/\^\{2\}/g, "²")
    .replace(/[{}]/g, "")
    .trim().length;
}

describe("the formulas of the explanations and tips", () => {
  it("stay within 22 characters a line, one step a line, so a phone shows them whole", () => {
    const lesson = JSON.parse(
      readFileSync(
        "content/math/kntt/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/lesson.json",
        "utf8",
      ),
    ) as {
      sections: { blocks: { type: string; id?: string; tex?: string }[] }[];
      exercises: { id: string; explain?: { tex?: string } }[];
    };
    const formulas = [
      ...lesson.exercises.map((e) => ({ id: e.id, tex: e.explain?.tex })),
      ...lesson.sections.flatMap((section) =>
        section.blocks
          .filter((block) => block.type === "tip")
          .map((block) => ({ id: block.id ?? "tip", tex: block.tex })),
      ),
    ];
    const tooWide: string[] = [];
    for (const { id, tex } of formulas) {
      if (tex === undefined) continue;
      const lines = tex
        .replace(/\\(?:begin|end)\{gathered\}/g, "")
        .split("\\\\");
      for (const line of lines) {
        if (lineWidth(line) > 22) tooWide.push(`${id}: ${line.trim()}`);
      }
    }
    expect(tooWide).toEqual([]);
  });
});
