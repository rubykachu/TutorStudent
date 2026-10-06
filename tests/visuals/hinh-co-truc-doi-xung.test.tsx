import { readFileSync } from "node:fs";
import path from "node:path";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { collectVisualRefs } from "@/content/check";
import {
  BOOK_58A,
  BOOK_59,
  COLUMN_QUESTION,
  DIAGONAL_DEMO,
  DIAGONAL_EXERCISE,
  LEAD_58A,
  LEAD_59,
  ROW_QUESTION,
} from "@/visuals/math/hinh-co-truc-doi-xung/boards";
import {
  AxisCards,
  FoldCards,
} from "@/visuals/math/hinh-co-truc-doi-xung/cards";
import { EdgeBoard } from "@/visuals/math/hinh-co-truc-doi-xung/edge-board";
import {
  candidateEdges,
  figureAxes,
  solveEdges,
} from "@/visuals/math/hinh-co-truc-doi-xung/edges";
import {
  AxisPicker,
  FoldLab,
} from "@/visuals/math/hinh-co-truc-doi-xung/fold-lab";
import { FOLD_MS } from "@/visuals/math/hinh-co-truc-doi-xung/fold-view";
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
import {
  chain,
  edgeKey,
  isChain,
  mirrorPoint,
} from "@/visuals/math/hinh-co-truc-doi-xung/lattice";
import {
  BADGE_RADIUS,
  badgeSpot,
  candidateIsAxis,
  candidatesOf,
  type PickGroup,
} from "@/visuals/math/hinh-co-truc-doi-xung/lines";
import { LESSON_SLUG } from "@/visuals/math/hinh-co-truc-doi-xung/logic";
import { MirrorBoard } from "@/visuals/math/hinh-co-truc-doi-xung/mirror-board";
import {
  anchorsOf,
  requiredPoints,
  solvedMirror,
  tappablePoints,
} from "@/visuals/math/hinh-co-truc-doi-xung/mirror-model";
import { PAPERS } from "@/visuals/math/hinh-co-truc-doi-xung/paper";
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

  describe("the fold lab folds one line at a time from the whole shape", () => {
    const spec = VISUAL_SPECS["chu-nhat-gap-thu"];
    if (spec?.kind !== "foldLab") throw new Error("not a fold lab");
    const picture = () =>
      screen.getByRole("group", { name: /chạm vào một đường/ });
    const state = () => [
      picture().getAttribute("data-fold-line"),
      picture().getAttribute("data-fold-t"),
    ];
    const tap = (letter: string) =>
      fireEvent.click(screen.getByRole("button", { name: `Đường ${letter}` }));
    // Long enough for one fold or unfold and the two frames before a fold.
    const settle = () => act(() => vi.advanceTimersByTime(FOLD_MS + 50));

    beforeEach(() => {
      vi.useFakeTimers({
        toFake: [
          "setTimeout",
          "clearTimeout",
          "requestAnimationFrame",
          "cancelAnimationFrame",
        ],
      });
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it("tapping the folded line again opens the shape", () => {
      render(<FoldLab spec={spec} />);
      tap("a");
      expect(state()).toEqual(["a", "0"]);
      settle();
      expect(state()).toEqual(["a", "1"]);
      expect(screen.getByText(/Vậy đường a là trục đối xứng/)).toBeVisible();
      tap("a");
      expect(state()).toEqual(["a", "0"]);
      settle();
      expect(state()).toEqual(["", "0"]);
      expect(
        screen.getByText(
          "Bạn chạm vào một đường, hình sẽ gấp đôi theo đường đó.",
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("Đã thử 1/4")).toBeInTheDocument();
    });

    // a: axis, b: diagonal, c: axis, e: diagonal
    it("another line first opens the shape, then folds along the new line", () => {
      render(<FoldLab spec={spec} />);
      tap("a");
      settle();
      tap("b");
      // Opening along a: the shape is not folded along b before it is whole.
      expect(state()).toEqual(["a", "0"]);
      expect(
        screen.getByText("Hình mở ra trước, rồi gấp đôi theo đường b."),
      ).toBeInTheDocument();
      act(() => vi.advanceTimersByTime(FOLD_MS));
      expect(state()).toEqual(["b", "0"]);
      settle();
      expect(state()).toEqual(["b", "1"]);
      expect(
        screen.getByText(/Vậy đường b không phải trục đối xứng/),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Đường b" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      expect(screen.getByText("Đã thử 2/4")).toBeInTheDocument();
    });

    it("the open button opens the folded shape", () => {
      render(<FoldLab spec={spec} />);
      tap("c");
      settle();
      fireEvent.click(screen.getByRole("button", { name: "Mở hình ra" }));
      settle();
      expect(state()).toEqual(["", "0"]);
    });

    it("with reduced motion every change is instant", () => {
      const matchMedia = window.matchMedia;
      window.matchMedia = (query: string) => ({
        ...matchMedia(query),
        matches: query === "(prefers-reduced-motion: reduce)",
      });
      try {
        render(<FoldLab spec={spec} />);
        tap("a");
        expect(state()).toEqual(["a", "1"]);
        tap("b");
        expect(state()).toEqual(["b", "1"]);
        tap("b");
        expect(state()).toEqual(["", "0"]);
      } finally {
        window.matchMedia = matchMedia;
      }
    });
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

// ---------------------------------------------------------------------------
// Fixes of review round 1

const exerciseOf = (suffix: string) =>
  lesson.exercises.find((e) => e.id === `${LESSON_SLUG}.ex.${suffix}`) as
    | { answer?: { value?: number }; params?: Record<string, number> }
    | undefined;

describe("pictures used as options fit a landscape iPad", () => {
  it("every option picture is drawn small", () => {
    const thumbs = Object.entries(VISUAL_SPECS).filter(([key]) =>
      key.startsWith("thumb-"),
    );
    expect(thumbs.length).toBeGreaterThan(5);
    for (const [key, spec] of thumbs) {
      if (spec.kind !== "subject") throw new Error(key);
      expect(spec.width, key).toBeLessThanOrEqual(90);
    }
  });
});

describe("the names of the lines of a picture do not crowd each other", () => {
  it("every pair of names keeps a badge's width between them", () => {
    const pictures = Object.entries(VISUAL_SPECS).flatMap(
      ([key, spec]): (readonly [string, PickGroup])[] =>
        spec.kind === "axisPicker"
          ? spec.groups.map((g, n) => [`${key}#${n}`, g] as const)
          : spec.kind === "foldLab" || spec.kind === "lines"
            ? [[key, spec] as const]
            : [],
    );
    expect(pictures.length).toBeGreaterThan(10);
    for (const [key, group] of pictures) {
      const spots = candidatesOf(group.shape, group.lines).map((c) =>
        badgeSpot(c.axis, c.end),
      );
      spots.forEach((a, i) => {
        spots.slice(i + 1).forEach((b) => {
          const gap = Math.hypot(a[0] - b[0], a[1] - b[1]);
          expect(gap, key).toBeGreaterThanOrEqual(2 * BADGE_RADIUS + 4);
        });
      });
    }
  });
});

describe("the letter d", () => {
  it("names no candidate line: d is the name of an axis of symmetry", () => {
    for (const spec of Object.values(VISUAL_SPECS)) {
      const groups =
        spec.kind === "axisPicker"
          ? spec.groups
          : spec.kind === "foldLab" || spec.kind === "lines"
            ? [spec]
            : [];
      for (const group of groups) {
        const letters = candidatesOf(group.shape, group.lines).map(
          (c) => c.letter,
        );
        expect(letters).not.toContain("d");
        expect(letters.slice(0, 3)).toEqual(["a", "b", "c"]);
      }
    }
  });
});

describe("the figures of exercise 5.5 are the workbook's", () => {
  it("eight squares with no axis, a star with five, four squares in a chain with two", () => {
    expect(SHAPES.pentomino.axes).toHaveLength(0);
    expect(SHAPES.star.axes).toHaveLength(5);
    expect(SHAPES.staircase.axes).toHaveLength(2);
    expect(SHAPES.staircase.strokes).toHaveLength(4);
  });
});

describe("the paper of exercise 5.7 and the example", () => {
  it("the diamond has clearly sharp corners: the cut half is a narrow triangle", () => {
    const [tip, top, bottom] = (PAPERS.t.strokes[1] as { pts: readonly Pt[] })
      .pts as [Pt, Pt, Pt];
    // The corner of the open diamond on the fold is twice the angle between
    // the fold and the side of the triangle.
    const corner =
      2 * Math.atan2(120 - tip[0], (bottom[1] - top[1]) / 2) * (180 / Math.PI);
    expect(corner).toBeLessThan(65);
  });
});

describe("the polylines of exercise 5.9 and its lead-ins", () => {
  const solutions = (length: number, axes: number) => {
    const edges = candidateEdges(LEAD_59);
    const found: string[] = [];
    const walk = (from: number, chosen: number[]) => {
      if (chosen.length === length) {
        const picked = chosen.map((i) => edges[i] as (typeof edges)[number]);
        if (isChain(picked) && figureAxes(LEAD_59, picked).length === axes) {
          found.push(picked.map((e) => `${e[0]}-${e[1]}`).join(" "));
        }
        return;
      }
      for (let i = from; i < edges.length; i++) walk(i + 1, [...chosen, i]);
    };
    walk(0, []);
    return found;
  };

  it("the lead-in with four pieces and two axes has exactly the two rectangles, joined to the given polyline", () => {
    const found = solutions(4, 2);
    expect(found).toHaveLength(2);
    const joined = found.every((solution) =>
      ["1,1", "2,2"].some((end) => solution.includes(end)),
    );
    expect(joined).toBe(true);
  });

  it("the other lead-ins can be solved", () => {
    expect(solutions(1, 1).length).toBeGreaterThan(0);
    expect(solutions(2, 4).length).toBeGreaterThan(0);
  });

  it("the solutions shown for the workbook's 5.9a and 5.9b are made of pieces of the lattice and have the axes asked", () => {
    const paths: [string, readonly Pt[], number][] = [
      ["sbt-5-9a-giai", pathOf("sbt-5-9a-giai"), 1],
      ["sbt-5-9b-giai", pathOf("sbt-5-9b-giai"), 2],
    ];
    for (const [key, path, axes] of paths) {
      const pieces = chain(path);
      const free = new Set(
        candidateEdges(BOOK_59).map((e) => `${e[0]}-${e[1]}`),
      );
      expect(
        pieces.every(
          (e) => free.has(`${e[0]}-${e[1]}`) || free.has(`${e[1]}-${e[0]}`),
        ),
        key,
      ).toBe(true);
      expect(isChain(pieces), key).toBe(true);
      expect(figureAxes(BOOK_59, pieces), key).toHaveLength(axes);
    }
  });
});

describe("the solution shown for a polyline exercise", () => {
  // The shown solution joins the two ends of the given polyline, which is the
  // answer the explanation and the picture of the third hint teach.
  const edgeSet = (edges: readonly (readonly [Pt, Pt])[]) =>
    edges.map(edgeKey).sort().join(" ");

  it.each([
    ["sbt-5-9a-giai", { length: 4, axes: 1 }],
    ["sbt-5-9b-giai", { length: 4, axes: 2 }],
  ])("%s is the line the workbook draws", (key, params) => {
    const found = solveEdges(BOOK_59, params);
    expect(edgeSet(found ?? [])).toBe(edgeSet(chain(pathOf(key))));
  });

  it("joins the two ends of the given polyline whenever such a line exists", () => {
    const first = BOOK_59.given[0] as Pt;
    const last = BOOK_59.given[BOOK_59.given.length - 1] as Pt;
    for (const params of [
      { length: 4, axes: 1 },
      { length: 4, axes: 2 },
      { length: 8, axes: 4 },
    ]) {
      const found = solveEdges(BOOK_59, params) ?? [];
      const degree = new Map<string, number>();
      for (const [a, b] of found)
        for (const p of [a, b])
          degree.set(`${p}`, (degree.get(`${p}`) ?? 0) + 1);
      expect(degree.get(`${first}`)).toBe(1);
      expect(degree.get(`${last}`)).toBe(1);
    }
  });
});

function pathOf(key: string): readonly Pt[] {
  const spec = VISUAL_SPECS[key];
  if (spec?.kind !== "edgesStill" || !spec.path) throw new Error(key);
  return spec.path;
}

describe("the hint of 5.8 and the exercises of the diagonal axis", () => {
  it("counts out a point that is not a corner or an answer of the exercise or of 5.8a", () => {
    const used = new Set<string>();
    for (const board of [DIAGONAL_EXERCISE, BOOK_58A, LEAD_58A]) {
      for (const part of board.parts)
        for (const anchor of anchorsOf(part)) used.add(anchor.join(","));
      for (const point of requiredPoints(board)) used.add(point.join(","));
    }
    const dot = DIAGONAL_DEMO.parts.flatMap(anchorsOf)[0] as Pt;
    expect(used.has(dot.join(","))).toBe(false);
    expect(used.has(mirrorPoint(dot, DIAGONAL_DEMO.axis).join(","))).toBe(
      false,
    );
  });
});

describe("the questions that name a column or a row", () => {
  it("the numbered boards agree with the answers of the lesson", () => {
    // Columns and rows are numbered from 1; the axis is the lattice line at
    // `at` (0 for the first).
    const image = (board: typeof COLUMN_QUESTION, axis: "x" | "y") => {
      const dot = board.parts.flatMap(anchorsOf)[0] as Pt;
      return mirrorPoint(dot, board.axis)[axis === "x" ? 0 : 1] + 1;
    };
    expect(image(COLUMN_QUESTION, "x")).toBe(
      exerciseOf("s9-cot-cua-diem-doi-xung")?.answer?.value,
    );
    expect(image(ROW_QUESTION, "y")).toBe(
      exerciseOf("s9-on-hang-cua-diem")?.answer?.value,
    );
  });
});

describe("the lead-ins of exercise 5.10", () => {
  const strokesOf = (ids: GlyphId[]) =>
    ids.flatMap((id, n) =>
      GLYPHS[id].map((s) => ({
        closed: s.closed,
        pts: s.pts.map(([x, y]): Pt => [x + n * 14, y]),
      })),
    );
  const orders = (ids: GlyphId[]): GlyphId[][] =>
    ids.length <= 1
      ? [ids]
      : ids.flatMap((id, i) =>
          orders([...ids.slice(0, i), ...ids.slice(i + 1)]).map((rest) => [
            id,
            ...rest,
          ]),
        );

  it("three cards with a horizontal axis make six rows of letters, each with a horizontal axis", () => {
    const rows = orders(["H", "X", "E"]);
    expect(rows).toHaveLength(exerciseOf("l510-ba-the")?.answer?.value ?? 0);
    for (const row of rows) {
      expect(isAxisOf(strokesOf(row), { p: [-2, 8], q: [44, 8] }, 0.1)).toBe(
        true,
      );
    }
  });

  it("b and d are mirror images, so b, H, d is symmetric about its middle", () => {
    expect(
      isAxisOf(strokesOf(["b", "H", "d"]), { p: [19, -2], q: [19, 18] }, 0.1),
    ).toBe(true);
    expect(
      isAxisOf(strokesOf(["b", "d", "H"]), { p: [19, -2], q: [19, 18] }, 0.1),
    ).toBe(false);
  });
});
