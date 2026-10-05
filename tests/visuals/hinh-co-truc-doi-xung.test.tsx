import { readFileSync } from "node:fs";
import path from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { collectVisualRefs } from "@/content/check";
import {
  AxisCards,
  FoldCards,
} from "@/visuals/math/hinh-co-truc-doi-xung/cards";
import { EdgeBoard } from "@/visuals/math/hinh-co-truc-doi-xung/edge-board";
import { solveEdges } from "@/visuals/math/hinh-co-truc-doi-xung/edges";
import {
  AxisPicker,
  FoldLab,
} from "@/visuals/math/hinh-co-truc-doi-xung/fold-lab";
import {
  angleDeg,
  axisAngles,
  centroid,
  isAxisOf,
  type Line,
  type Pt,
  reflect,
  reflectStroke,
  regularPolygon,
  type Stroke,
} from "@/visuals/math/hinh-co-truc-doi-xung/geometry";
import {
  GLYPH_AXES,
  GLYPH_IDS,
  GLYPHS,
  type GlyphId,
  HORIZONTAL_MIDDLE,
  VERTICAL_MIDDLE,
} from "@/visuals/math/hinh-co-truc-doi-xung/glyphs";
import { mirrorPoint } from "@/visuals/math/hinh-co-truc-doi-xung/lattice";
import {
  candidateIsAxis,
  candidatesOf,
} from "@/visuals/math/hinh-co-truc-doi-xung/lines";
import { LESSON_SLUG } from "@/visuals/math/hinh-co-truc-doi-xung/logic";
import { MirrorBoard } from "@/visuals/math/hinh-co-truc-doi-xung/mirror-board";
import {
  anchorsOf,
  requiredPoints,
  solvedMirror,
  tappablePoints,
} from "@/visuals/math/hinh-co-truc-doi-xung/mirror-model";
import {
  SHAPE_IDS,
  SHAPES,
  through,
} from "@/visuals/math/hinh-co-truc-doi-xung/shapes";
import { VISUAL_SPECS } from "@/visuals/math/hinh-co-truc-doi-xung/visuals";
import { findVisual } from "@/visuals/registry";

const lineAngle = (axis: Line) =>
  ((Math.round(angleDeg(axis)) % 180) + 180) % 180;

describe("the shapes of the lesson", () => {
  it.each(SHAPE_IDS)(
    "%s: declared axes are exactly the axes found by folding",
    (id) => {
      const shape = SHAPES[id];
      const centre = centroid(shape.strokes);
      const found = axisAngles(shape.strokes, centre);
      if (shape.endless) {
        // Every angle is an axis: the scan finds one unbroken run.
        expect(found).toHaveLength(1);
        for (const deg of [0, 17, 45, 73, 90, 133]) {
          expect(isAxisOf(shape.strokes, through(centre, deg))).toBe(true);
        }
        return;
      }
      // Non-integer axes cannot be found by a one-degree scan: none is declared.
      const declared = shape.axes.map(lineAngle).sort((a, b) => a - b);
      expect(found).toEqual(declared);
      for (const axis of shape.axes)
        expect(isAxisOf(shape.strokes, axis)).toBe(true);
      for (const fake of shape.fakes)
        expect(isAxisOf(shape.strokes, fake)).toBe(false);
    },
  );
});

describe("the letters and digits", () => {
  it.each(GLYPH_IDS)(
    "%s: its axes are the middle lines it is symmetric about",
    (id) => {
      const strokes = GLYPHS[id];
      const axes = GLYPH_AXES[id];
      expect(isAxisOf(strokes, VERTICAL_MIDDLE, 0.1)).toBe(axes.includes("v"));
      expect(isAxisOf(strokes, HORIZONTAL_MIDDLE, 0.1)).toBe(
        axes.includes("h"),
      );
      // No other line is an axis: the count equals the declared one.
      expect(axisAngles(strokes, centroid(strokes), 0.1)).toHaveLength(
        axes.length,
      );
    },
  );

  it("2 and 5 are mirror images of each other, 6 and 9 are not", () => {
    const mirror = (id: GlyphId) =>
      GLYPHS[id].map((s) => ({
        closed: s.closed,
        pts: s.pts.map((p) => reflect(p, VERTICAL_MIDDLE)),
      }));
    const same = (a: readonly Stroke[], b: readonly Stroke[]) =>
      isAxisOf([...a, ...b], VERTICAL_MIDDLE, 0.1);
    expect(same(GLYPHS["2"], GLYPHS["5"])).toBe(true);
    expect(same(mirror("6"), GLYPHS["9"])).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// The catalog and the lesson

const lesson = JSON.parse(
  readFileSync(
    path.join(
      process.cwd(),
      "content/math/kntt/hinh-co-truc-doi-xung/lesson.json",
    ),
    "utf8",
  ),
) as {
  exercises: {
    id: string;
    type: string;
    bookRef?: string;
    visualId?: string;
    validatorId?: string;
    params?: Record<string, number>;
    answer?: unknown;
  }[];
};

const idOf = (key: string) => `${LESSON_SLUG}.visual.${key}`;

describe("the catalog", () => {
  it("holds exactly the pictures lesson.json uses", () => {
    const used = new Set(collectVisualRefs(lesson).map((r) => r.visualId));
    const listed = new Set(Object.keys(VISUAL_SPECS).map(idOf));
    expect([...used].filter((id) => !listed.has(id))).toEqual([]);
    expect([...listed].filter((id) => !used.has(id))).toEqual([]);
  });

  it("every named line is a line of its shape, and says whether it is an axis as folding does", () => {
    for (const spec of Object.values(VISUAL_SPECS)) {
      const groups =
        spec.kind === "axisPicker"
          ? spec.groups
          : spec.kind === "foldLab" || spec.kind === "lines"
            ? [spec]
            : [];
      for (const group of groups) {
        for (const ref of group.lines) {
          expect(candidatesOf(group.shape, [ref])).toHaveLength(1);
          expect(candidateIsAxis(group.shape, ref)).toBe(ref.src === "axis");
        }
      }
    }
  });

  it("every board puts the mirror images inside the lattice, on the far side of the axis", () => {
    const boards = Object.values(VISUAL_SPECS).flatMap((spec) =>
      spec.kind === "mirror" ||
      spec.kind === "mirrorStill" ||
      spec.kind === "mirrorSteps"
        ? [spec.board]
        : [],
    );
    expect(boards.length).toBeGreaterThan(10);
    for (const board of boards) {
      const required = requiredPoints(board);
      expect(required.length).toBeGreaterThan(0);
      const tappable = tappablePoints(board).map((p) => p.join(","));
      for (const point of required) {
        expect(point[0]).toBeGreaterThanOrEqual(0);
        expect(point[0]).toBeLessThan(board.cols);
        expect(point[1]).toBeGreaterThanOrEqual(0);
        expect(point[1]).toBeLessThan(board.rows);
        expect(tappable).toContain(point.join(","));
      }
      // Every corner of the given half is inside the lattice too.
      for (const part of board.parts) {
        for (const [x, y] of anchorsOf(part)) {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThan(board.cols);
          expect(y).toBeGreaterThanOrEqual(0);
          expect(y).toBeLessThan(board.rows);
        }
      }
      // Mirroring twice gives the corner back.
      for (const part of board.parts) {
        for (const anchor of anchorsOf(part)) {
          expect(
            mirrorPoint(mirrorPoint(anchor, board.axis), board.axis),
          ).toEqual(anchor);
        }
      }
    }
  });

  it("every manipulate exercise has a solver whose state its validator accepts, and a slip it rejects", () => {
    const manipulate = lesson.exercises.filter((e) => e.type === "manipulate");
    expect(manipulate.length).toBeGreaterThan(15);
    for (const ex of manipulate) {
      const entry = findVisual(ex.visualId ?? "");
      const validate = entry?.validators?.[ex.validatorId ?? ""];
      const solve = entry?.solutions?.[ex.validatorId ?? ""];
      expect(validate, ex.id).toBeDefined();
      expect(solve, ex.id).toBeDefined();
      const params = ex.params ?? {};
      const solved = solve?.(params) ?? {};
      expect(validate?.(solved, params), ex.id).toBe(true);
      expect(validate?.({}, params), `${ex.id} empty`).toBe(false);
      // One piece more or less is wrong.
      const keys = Object.keys(solved);
      const less = { ...solved };
      delete less[keys[0] ?? ""];
      expect(validate?.(less, params), `${ex.id} less`).toBe(false);
    }
  });

  it("the book answers agree with the drawings", () => {
    const answerOf = (ref: string) =>
      lesson.exercises.find((e) => e.bookRef === ref)?.answer as string[];
    const ids = BOOK_LETTERS_FOR_TEST;
    const withAxes = (count: number) =>
      ids
        .filter(([, glyph]) => GLYPH_AXES[glyph].length === count)
        .map(([id]) => id);
    expect([...answerOf("SBT 5.3a")].sort()).toEqual(withAxes(1).sort());
    expect([...answerOf("SBT 5.3b")].sort()).toEqual(withAxes(2).sort());
  });
});

const BOOK_LETTERS_FOR_TEST: readonly [string, GlyphId][] = [
  ["a", "A"],
  ["b", "B"],
  ["h", "H"],
  ["m", "M"],
  ["n", "N"],
  ["x", "X"],
  ["y", "Y"],
  ["z", "Z"],
  ["so-0", "0"],
  ["so-2", "2"],
  ["so-3", "3"],
  ["so-8", "8"],
  ["so-9", "9"],
];

// ---------------------------------------------------------------------------
// The tips and the numbers the lesson states

describe("the tips hold for every input", () => {
  it("a shape with n equal sides and n equal angles has n axes", () => {
    for (const n of [3, 4, 5, 6, 8, 10, 12]) {
      const strokes: Stroke[] = [
        { closed: true, pts: regularPolygon(n, 120, 120, 90, -90) },
      ];
      let count = 0;
      let before = false;
      const first: boolean[] = [];
      for (let tenths = 0; tenths < 1800; tenths += 5) {
        const rad = (tenths / 10 / 180) * Math.PI;
        const axis = {
          p: [120, 120] as const,
          q: [120 + Math.cos(rad), 120 + Math.sin(rad)] as const,
        };
        const is = isAxisOf(strokes, axis);
        if (tenths === 0) first.push(is);
        if (is && !before) count += 1;
        before = is;
      }
      // An axis at 0 degrees is met again just before 180.
      if (first[0] && before) count -= 1;
      expect(count, `${n} sides`).toBe(n);
    }
  });

  it("counting squares from a vertical or horizontal axis finds the mirror image", () => {
    for (const [x, at] of [
      [2, 5],
      [0, 3],
      [4, 4],
      [1, 6],
      [5, 2],
    ] as const) {
      const [mx] = mirrorPoint([x, 3], { kind: "v", at });
      // The same number of squares on the far side, on the same row.
      expect(Math.abs(mx - at)).toBe(Math.abs(x - at));
      expect(Math.sign(mx - at) * Math.sign(x - at)).toBeLessThanOrEqual(0);
    }
    for (const [y, at] of [
      [1, 4],
      [0, 2],
      [3, 3],
      [5, 1],
    ] as const) {
      const [, my] = mirrorPoint([2, y], { kind: "h", at });
      expect(Math.abs(my - at)).toBe(Math.abs(y - at));
    }
  });

  it("a rectangle with unequal sides has no diagonal axis, a rhombus has both diagonals as axes", () => {
    for (const [w, h] of [
      [160, 90],
      [120, 100],
      [150, 20],
      [100, 99],
    ] as const) {
      const rectangle: Stroke[] = [
        {
          closed: true,
          pts: [
            [120 - w / 2, 120 - h / 2],
            [120 + w / 2, 120 - h / 2],
            [120 + w / 2, 120 + h / 2],
            [120 - w / 2, 120 + h / 2],
          ],
        },
      ];
      const diagonal = {
        p: [120 - w / 2, 120 - h / 2] as const,
        q: [120 + w / 2, 120 + h / 2] as const,
      };
      expect(isAxisOf(rectangle, diagonal), `${w} by ${h}`).toBe(false);
    }
    for (const [a, b] of [
      [90, 52],
      [80, 80],
      [100, 30],
      [60, 59],
    ] as const) {
      const rhombus: Stroke[] = [
        {
          closed: true,
          pts: [
            [120 - a, 120],
            [120, 120 - b],
            [120 + a, 120],
            [120, 120 + b],
          ],
        },
      ];
      expect(isAxisOf(rhombus, { p: [20, 120], q: [220, 120] })).toBe(true);
      expect(isAxisOf(rhombus, { p: [120, 20], q: [120, 220] })).toBe(true);
    }
  });

  it("a sheet folded twice and cut is symmetric about both folds", () => {
    const cuts: Pt[][] = [
      [
        [100, 92],
        [140, 92],
        [140, 148],
        [100, 148],
      ],
      [
        [110, 100],
        [120, 100],
        [120, 110],
      ],
      [
        [90, 60],
        [110, 80],
        [100, 118],
        [120, 120],
      ],
      [
        [120, 120],
        [150, 130],
        [130, 160],
      ],
      [
        [70, 70],
        [80, 70],
        [80, 80],
        [70, 80],
      ],
    ];
    const vertical = { p: [120, 0] as const, q: [120, 240] as const };
    const horizontal = { p: [0, 120] as const, q: [240, 120] as const };
    for (const cut of cuts) {
      // The quarter, mirrored in the first fold, then both halves in the second.
      const half = [
        { closed: true, pts: cut },
        { closed: true, pts: cut.map((p) => reflect(p, vertical)) },
      ];
      const whole = [...half, ...half.map((s) => reflectStroke(s, horizontal))];
      expect(isAxisOf(whole, vertical)).toBe(true);
      expect(isAxisOf(whole, horizontal)).toBe(true);
    }
  });
});

describe("exercise 5.10", () => {
  // The cards lie side by side, the figure they make is symmetric about its
  // vertical middle line or its horizontal middle line.
  const cards: GlyphId[] = ["0", "1", "2", "5", "6", "8", "9"];
  const symmetric = (digits: GlyphId[]): boolean => {
    const strokes = digits.flatMap((digit, n) =>
      GLYPHS[digit].map((s) => ({
        closed: s.closed,
        pts: s.pts.map(([x, y]): Pt => [x + n * 14, y]),
      })),
    );
    const width = digits.length * 10 + (digits.length - 1) * 4;
    return (
      isAxisOf(strokes, { p: [width / 2, -2], q: [width / 2, 18] }, 0.1) ||
      isAxisOf(strokes, { p: [-2, 8], q: [width + 2, 8] }, 0.1)
    );
  };

  it("has ten numbers, and 108 and 285 are among them", () => {
    const found: string[] = [];
    for (const a of cards) {
      for (const b of cards) {
        for (const c of cards) {
          if (a === b || b === c || a === c || a === "0") continue;
          if (symmetric([a, b, c])) found.push(`${a}${b}${c}`);
        }
      }
    }
    expect(found.sort()).toEqual(
      [
        "108",
        "180",
        "205",
        "215",
        "285",
        "502",
        "512",
        "582",
        "801",
        "810",
      ].sort(),
    );
  });
});

// ---------------------------------------------------------------------------
// The pictures the child touches

describe("the touchable pictures", () => {
  it("fold cards fold one card at a time and are done when all are", () => {
    const spec = VISUAL_SPECS["gap-doi-vat"];
    if (spec?.kind !== "foldCards") throw new Error("not fold cards");
    const onStateChange = vi.fn();
    render(<FoldCards spec={spec} onStateChange={onStateChange} />);
    expect(screen.getByText("Đã gấp 0/4")).toBeInTheDocument();
    const cards = screen.getAllByRole("button");
    fireEvent.click(cards[0] as HTMLElement);
    expect(onStateChange).toHaveBeenLastCalledWith({ i0: 1 });
    for (const card of cards.slice(1)) fireEvent.click(card);
    expect(screen.getByText("Đã gấp 4/4")).toBeInTheDocument();
    expect(screen.getByText(spec.done)).toBeInTheDocument();
  });

  it("the fold lab says whether the tapped line is an axis", () => {
    const spec = VISUAL_SPECS["chu-nhat-gap-thu"];
    if (spec?.kind !== "foldLab") throw new Error("not a fold lab");
    render(<FoldLab spec={spec} />);
    // a: axis, b: diagonal, c: axis, d: diagonal
    fireEvent.click(screen.getByRole("button", { name: "Đường a" }));
    expect(screen.getByText(/Đường a là trục đối xứng/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Đường b" }));
    expect(screen.getByText(/Đường b không phải trục/)).toBeInTheDocument();
    expect(screen.getByText("Đã thử 2/4")).toBeInTheDocument();
  });

  it("the axis picker reports the lines marked and the validator judges them", () => {
    const entry = findVisual(idOf("sbt-5-2-chon"));
    const spec = VISUAL_SPECS["sbt-5-2-chon"];
    if (spec?.kind !== "axisPicker" || !entry) throw new Error("no picker");
    const onStateChange = vi.fn();
    render(
      <AxisPicker spec={spec} params={{}} onStateChange={onStateChange} />,
    );
    const validate = entry.validators?.["chon-truc"];
    fireEvent.click(
      screen.getAllByRole("button", { name: "Đường b" })[0] as HTMLElement,
    );
    expect(onStateChange).toHaveBeenLastCalledWith({ g0l1: 1 });
    // The parallelogram has no axis: marking its line b is wrong.
    expect(validate?.({ g0l1: 1 }, {})).toBe(false);
    expect(entry.solutions?.["chon-truc"]?.({})).toEqual(
      expect.objectContaining({ g1l1: 1, g2l1: 1, g2l3: 1, g3l0: 1, g3l2: 1 }),
    );
  });

  it("the mirror board draws the pieces of the mirror image once their points are placed", () => {
    const spec = VISUAL_SPECS["ve-cung-lam"];
    if (spec?.kind !== "mirror") throw new Error("not a mirror board");
    const { container } = render(<MirrorBoard spec={spec.board} />);
    const solved = solvedMirror(spec.board);
    for (const key of Object.keys(solved)) {
      const point = container.querySelector(`[data-state-set="${key}=1"]`);
      expect(point, key).not.toBeNull();
      fireEvent.click(point as Element);
    }
    expect(screen.getByText(spec.board.done ?? "")).toBeInTheDocument();
  });

  it("the mirror board marks a point that is not a mirror image on a lesson screen", () => {
    const spec = VISUAL_SPECS["ve-cung-lam"];
    if (spec?.kind !== "mirror") throw new Error("not a mirror board");
    const solved = solvedMirror(spec.board);
    const { container } = render(<MirrorBoard spec={spec.board} />);
    const wrong = [...container.querySelectorAll("[data-state-set]")].find(
      (el) =>
        !(
          (el.getAttribute("data-state-set") ?? "").replace("=1", "") in solved
        ),
    );
    expect(wrong).toBeDefined();
    fireEvent.click(wrong as Element);
    expect(screen.getByText(/Có điểm chưa đúng/)).toBeInTheDocument();
  });

  it("an exercise board reveals nothing while the child works", () => {
    const spec = VISUAL_SPECS["ve-tap-lam"];
    if (spec?.kind !== "mirror") throw new Error("not a mirror board");
    const solved = solvedMirror(spec.board);
    const { container } = render(<MirrorBoard spec={spec.board} params={{}} />);
    for (const key of Object.keys(solved)) {
      fireEvent.click(
        container.querySelector(`[data-state-set="${key}=1"]`) as Element,
      );
    }
    // No piece of the mirror image is drawn, no verdict is said.
    expect(container.querySelectorAll("line.stroke-concept-teal")).toHaveLength(
      0,
    );
    expect(screen.queryByText(/chưa đúng/)).toBeNull();
  });

  it("the edge board switches pieces on and off, and the lesson's boards can be solved", () => {
    const spec = VISUAL_SPECS["sbt-5-9-ve"];
    if (spec?.kind !== "edges") throw new Error("not an edge board");
    const onStateChange = vi.fn();
    const { container } = render(
      <EdgeBoard
        spec={spec.board}
        params={{ length: 4, axes: 1 }}
        onStateChange={onStateChange}
      />,
    );
    const first = container.querySelector('[data-state-set="e0=1"]') as Element;
    fireEvent.click(first);
    expect(onStateChange).toHaveBeenLastCalledWith({ e0: 1 });
    fireEvent.click(first);
    expect(onStateChange).toHaveBeenLastCalledWith({});
    for (const [length, axes] of [
      [4, 1],
      [4, 2],
      [8, 4],
    ] as const) {
      expect(
        solveEdges(spec.board, { length, axes }),
        `${length} ${axes}`,
      ).toBeDefined();
    }
  });

  it("the cards show the axes once tapped", () => {
    const spec = VISUAL_SPECS["hinh-deu-the"];
    if (spec?.kind !== "axisCards") throw new Error("not axis cards");
    render(<AxisCards spec={spec} />);
    fireEvent.click(screen.getAllByRole("button")[2] as HTMLElement);
    expect(screen.getByText("6 trục đối xứng")).toBeInTheDocument();
    expect(screen.getByText("Đã xem 1/4")).toBeInTheDocument();
  });

  it("the registry declares the regions of the tappable strips", async () => {
    const entry = findVisual(idOf("sbt-5-3-chu"));
    expect(entry?.regions).toEqual(BOOK_LETTERS_FOR_TEST.map(([id]) => id));
    const { default: Strip } = (await entry?.load()) ?? {};
    if (!Strip) throw new Error("no strip");
    const { container } = render(<Strip />);
    expect(
      [...container.querySelectorAll("[data-region]")].map((el) =>
        el.getAttribute("data-region"),
      ),
    ).toEqual(entry?.regions);
  });
});
