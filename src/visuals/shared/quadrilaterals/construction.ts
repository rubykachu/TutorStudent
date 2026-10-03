import type { VisualState } from "@/visuals/registry";
import type { BoardStep } from "@/visuals/shared/plane/board-steps";
import type {
  FigureAngle,
  FigureArc,
  FigureArrow,
  FigureRight,
  FigureSeg,
  FigureSpec,
  FigureTick,
  Pt,
} from "@/visuals/shared/plane/figure-spec";
import { directionDeg, meetingPoints } from "@/visuals/shared/plane/geometry";

// The model of the four drawing boards of the lesson, each worked as on paper:
// a rectangle (ruler and set square), a rhombus (ruler, protractor and
// compass), a parallelogram from two sides and an angle (ruler, protractor
// and set square) and a parallelogram from two sides and a diagonal (ruler,
// compass and set square). A board is a list of steps; the child's state holds
// one key per step (a number for a stepper or a pick, 1 for a button pressed),
// and `boardFigure` draws the board from that state. Pure, so the validators,
// the walk-through frames and the component all agree.

export type BoardShape =
  | "rectangle"
  | "rhombus"
  | "parallelogram"
  | "parallelogram-diagonal";

// Drawing units to the centimetre.
export const UNIT = 18;
export const MIN_CM = 1;
const MAX_CM = 7;
// A side of the slanted boards is at most this long.
const MAX_SLANT_CM = 6;
// Angles the child may set at the first corner of a slanted board.
export const ANGLES = [45, 60, 75] as const;

const TEXT_SIZE = 20;
// Room above the tallest figure for the name of its top corner.
const TOP_ROOM = 28;
const BASE = MAX_CM * UNIT + TOP_ROOM;
// Where the ruler sits under the first segment, and its height.
const RULER_DROP = 38;
const RULER_HEIGHT = 28;
const ARC_HALF_SPAN = 24;
// How far a guide line runs past the figure, in drawing units.
const GUIDE_OVERRUN = 26;
// Where the names of the corners that guide lines pass through are moved from
// their usual place (away from the middle): the guides leave these corners
// upward and sideways, so the names go to the free side.
const PARALLEL_FOURTH_SHIFT: Pt = [6, 24];
const DIAGONAL_THIRD_SHIFT: Pt = [14, -6];
const DIAGONAL_FOURTH_SHIFT: Pt = [-10, 22];

export const BOARD_HEIGHT = BASE + RULER_DROP + RULER_HEIGHT + 6;

// Left edge and width of each board's drawing.
const LAYOUT: Readonly<Record<BoardShape, { left: number; width: number }>> = {
  rectangle: { left: 36, width: 196 },
  rhombus: { left: 36, width: 250 },
  parallelogram: { left: 36, width: 250 },
  "parallelogram-diagonal": { left: 70, width: 320 },
};

const LONG = { min: MIN_CM, max: MAX_CM } as const;
const SLANT = { min: MIN_CM, max: MAX_SLANT_CM } as const;

const angleOptions = ANGLES.map((value) => ({ value, label: `${value}°` }));

// The steps of a board, in the order the child does them. `names` are the
// corners: base left, base right, then the corner above the right one and the
// corner above the left one.
export function boardSteps(
  shape: BoardShape,
  names: readonly string[],
): BoardStep[] {
  const [first = "", second = "", third = "", fourth = ""] = names;
  const base: BoardStep = {
    key: "len",
    kind: "stepper",
    ...(shape === "rectangle" ? LONG : SLANT),
    short: `Cạnh ${first}${second} (cm)`,
    text: `Dùng thước vẽ đoạn thẳng ${first}${second}: chọn độ dài.`,
  };
  const press = (key: string, short: string, text: string): BoardStep => ({
    key,
    kind: "press",
    short,
    text,
  });
  const anglePick: BoardStep = {
    key: "angle",
    kind: "pick",
    short: `Góc ${second}${first}${fourth}`,
    options: angleOptions,
    text: `Dùng thước đo góc ở ${first}, kẻ đường ${first}${fourth} tạo với ${first}${second} một góc: chọn góc ${second}${first}${fourth}.`,
  };
  switch (shape) {
    case "rectangle":
      return [
        base,
        press(
          "perpD",
          `Êke tại ${first}`,
          `Đặt êke ở ${first}, vẽ đường vuông góc với ${first}${second}.`,
        ),
        press(
          "perpE",
          `Êke tại ${second}`,
          `Đặt êke ở ${second}, vẽ đường vuông góc với ${first}${second}.`,
        ),
        {
          key: "h",
          kind: "stepper",
          ...LONG,
          short: `${second}${third}, ${first}${fourth} (cm)`,
          text: `Lấy ${third} và ${fourth} trên hai đường vuông góc: chọn độ dài ${second}${third}. ${first}${fourth} dài bằng ${second}${third}.`,
        },
        press("join", `Nối ${fourth}${third}`, `Nối ${fourth} với ${third}.`),
      ];
    case "rhombus":
      return [
        base,
        anglePick,
        press(
          "markQ",
          `Lấy ${fourth}`,
          `Mở compa bằng ${first}${second}. Đặt kim ở ${first}, vẽ cung cắt đường ${first}${fourth} tại ${fourth}.`,
        ),
        press(
          "arcQ",
          `Cung tại ${fourth}`,
          `Giữ nguyên độ mở compa. Đặt kim ở ${fourth}, vẽ một cung tròn.`,
        ),
        press(
          "arcN",
          `Cung tại ${second}`,
          `Đặt kim ở ${second}, vẽ một cung tròn cắt cung vừa vẽ.`,
        ),
        press(
          "pointP",
          `Điểm ${third}`,
          `Chấm điểm ${third} ở chỗ hai cung gặp nhau.`,
        ),
        press("join", "Nối", `Nối ${third} với ${fourth} và với ${second}.`),
      ];
    case "parallelogram":
      return [
        base,
        anglePick,
        {
          key: "side",
          kind: "stepper",
          ...SLANT,
          short: `${first}${fourth}, ${second}${third} (cm)`,
          text: `Lấy ${fourth} trên đường ${first}${fourth}: chọn độ dài ${first}${fourth}. ${second}${third} dài bằng ${first}${fourth}.`,
        },
        press(
          "parF",
          `Êke tại ${second}`,
          `Dùng êke và thước, vẽ qua ${second} đường song song với ${first}${fourth}.`,
        ),
        press(
          "parK",
          `Êke tại ${fourth}`,
          `Dùng êke và thước, vẽ qua ${fourth} đường song song với ${first}${second}.`,
        ),
        press(
          "join",
          "Nối",
          `Hai đường song song gặp nhau tại ${third}. Nối ${fourth} với ${third} và ${second} với ${third}.`,
        ),
      ];
    case "parallelogram-diagonal":
      return [
        base,
        {
          key: "rBC",
          kind: "stepper",
          ...LONG,
          short: `Mở compa ${second}${third} (cm)`,
          text: `Chọn độ mở của compa bằng ${second}${third}.`,
        },
        press(
          "arcB",
          `Cung tại ${second}`,
          `Đặt kim compa ở ${second}, vẽ một cung tròn.`,
        ),
        {
          key: "rAC",
          kind: "stepper",
          ...LONG,
          short: `Mở compa ${first}${third} (cm)`,
          text: `Chọn độ mở của compa bằng ${first}${third}.`,
        },
        press(
          "arcA",
          `Cung tại ${first}`,
          `Đặt kim compa ở ${first}, vẽ một cung tròn.`,
        ),
        press(
          "pointC",
          `Điểm ${third}`,
          `Chấm điểm ${third} ở chỗ hai cung gặp nhau.`,
        ),
        press(
          "parC",
          `Êke tại ${third}`,
          `Dùng êke và thước, vẽ qua ${third} đường song song với ${first}${second}.`,
        ),
        press(
          "parA",
          `Êke tại ${first}`,
          `Dùng êke và thước, vẽ qua ${first} đường song song với ${second}${third}.`,
        ),
        press(
          "join",
          "Nối",
          `Hai đường song song gặp nhau tại ${fourth}. Nối ${third} với ${fourth} và ${fourth} với ${first}.`,
        ),
      ];
  }
}

// What a finished board of this shape holds, by step key: a number, or the
// list of numbers any of which is right. Params:
// - rectangle { a, b }: DE = a, EF = b;
// - rhombus { side, angle? }: the angle is any of `ANGLES` when absent;
// - parallelogram { a, b }: EF = a, FH = b, any angle;
// - parallelogram-diagonal { ab, bc, ac }.
export function expectedState(
  shape: BoardShape,
  params: Readonly<Record<string, number>>,
): Record<string, number | readonly number[]> {
  const num = (key: string) => params[key] ?? 0;
  switch (shape) {
    case "rectangle":
      return { len: num("a"), perpD: 1, perpE: 1, h: num("b"), join: 1 };
    case "rhombus":
      return {
        len: num("side"),
        angle: params.angle === undefined ? ANGLES : params.angle,
        markQ: 1,
        arcQ: 1,
        arcN: 1,
        pointP: 1,
        join: 1,
      };
    case "parallelogram":
      return {
        len: num("a"),
        angle: ANGLES,
        side: num("b"),
        parF: 1,
        parK: 1,
        join: 1,
      };
    case "parallelogram-diagonal":
      return {
        len: num("ab"),
        rBC: num("bc"),
        arcB: 1,
        rAC: num("ac"),
        arcA: 1,
        pointC: 1,
        parC: 1,
        parA: 1,
        join: 1,
      };
  }
}

// The angle a solved board uses when any angle is right.
const SOLVED_ANGLE = 60;

// A state the board accepts, so a validator compares with it and a solver (or
// the walk) replays it.
export function solvedState(
  shape: BoardShape,
  params: Readonly<Record<string, number>>,
): VisualState {
  return Object.fromEntries(
    Object.entries(expectedState(shape, params)).map(([key, want]) => [
      key,
      typeof want === "number" ? want : SOLVED_ANGLE,
    ]),
  );
}

export function isDrawn(
  shape: BoardShape,
  state: VisualState,
  params: Readonly<Record<string, number>>,
): boolean {
  return Object.entries(expectedState(shape, params)).every(([key, want]) => {
    const value = state[key];
    return typeof want === "number"
      ? value === want
      : value !== undefined && want.includes(value);
  });
}

const flag = (state: VisualState, key: string) => state[key] === 1;

function bold(
  a: string,
  b: string,
  tone: FigureSeg["tone"] = "ink",
): FigureSeg {
  return { a, b, tone, bold: true };
}

function guide(a: string, b: string): FigureSeg {
  return { a, b, tone: "mute", dash: true };
}

const add = (p: Pt, q: Pt): Pt => [p[0] + q[0], p[1] + q[1]];
const sub = (p: Pt, q: Pt): Pt => [p[0] - q[0], p[1] - q[1]];
const scaled = (p: Pt, k: number): Pt => [p[0] * k, p[1] * k];

// The measure of the angle at the first corner stands on the bisector this
// far from the corner (drawing units): out beyond the arc, but never past the
// end of the shorter side, so it stays inside the figure.
const ANGLE_TEXT_FAR = 46;
const ANGLE_TEXT_SHARE = 0.85;
function angleTextDistance(
  ...sidesCm: readonly (number | undefined)[]
): number {
  const shortest = Math.min(
    ...sidesCm.filter((cm): cm is number => cm !== undefined),
  );
  return Math.min(
    ANGLE_TEXT_FAR,
    Math.round(ANGLE_TEXT_SHARE * shortest * UNIT),
  );
}

// Direction on the screen of a ray rising `deg` degrees from the base line.
const rise = (deg: number): Pt => [
  Math.cos((deg * Math.PI) / 180),
  -Math.sin((deg * Math.PI) / 180),
];

// A compass arc round `c`, centred on the direction `centreDeg`.
const arcAround = (
  c: string,
  radius: number,
  centreDeg: number,
): FigureArc => ({
  c,
  r: radius,
  from: centreDeg - ARC_HALF_SPAN,
  to: centreDeg + ARC_HALF_SPAN,
});

// The points, strokes and names a board has drawn so far.
class Drawing {
  pts: Record<string, Pt> = {};
  segs: FigureSeg[] = [];
  dots: string[] = [];
  named: string[] = [];
  arcs: FigureArc[] = [];
  rights: FigureRight[] = [];
  ticks: FigureTick[] = [];
  arrows: FigureArrow[] = [];
  angles: FigureAngle[] = [];

  // A corner of the figure: a dot with its name.
  corner(name: string, point: Pt): void {
    this.pts[name] = point;
    this.dots.push(name);
    this.named.push(name);
  }

  // `moved` shifts the names of corners that guide lines run through, so the
  // name stands in the free quarter beside the corner.
  figure(
    shape: BoardShape,
    label: string,
    first: string,
    second: string,
    moved: Readonly<Record<string, Pt>> = {},
  ) {
    const { left, width } = LAYOUT[shape];
    return {
      label,
      w: width,
      h: BOARD_HEIGHT,
      textSize: TEXT_SIZE,
      pts: this.pts,
      segs: this.segs,
      dots: this.dots,
      names: this.named,
      nameShift: { [first]: [-4, 2], [second]: [4, 2], ...moved },
      ruler: { x: left, y: BASE + RULER_DROP, cm: MAX_CM, unit: UNIT },
      arcs: this.arcs,
      rights: this.rights,
      ticks: this.ticks,
      arrows: this.arrows,
      angles: this.angles,
    } satisfies FigureSpec;
  }
}

function rectangleFigure(
  names: readonly string[],
  state: VisualState,
): FigureSpec {
  const [d = "D", e = "E", f = "F", g = "G"] = names;
  const { left } = LAYOUT.rectangle;
  const draw = new Drawing();
  const first: Pt = [left, BASE];
  draw.corner(d, first);
  const { len, h } = state;
  const top = BASE - MAX_CM * UNIT;
  if (len !== undefined) {
    const second: Pt = [left + len * UNIT, BASE];
    draw.corner(e, second);
    draw.segs.push(bold(d, e));
    const perpendicular = (name: string, x: number, key: string) => {
      if (!flag(state, key)) return;
      draw.pts[`${name}Top`] = [x, top];
      draw.segs.push(guide(name, `${name}Top`));
      draw.rights.push({
        at: name,
        a: name === d ? e : d,
        b: `${name}Top`,
        tone: "violet",
      });
    };
    perpendicular(d, first[0], "perpD");
    perpendicular(e, second[0], "perpE");
    if (h !== undefined && flag(state, "perpD") && flag(state, "perpE")) {
      const y = BASE - h * UNIT;
      draw.corner(g, [first[0], y]);
      draw.corner(f, [second[0], y]);
      draw.segs.push(bold(d, g), bold(e, f));
      if (flag(state, "join")) {
        draw.segs.push(bold(g, f));
        draw.ticks.push(
          {
            segs: [
              [d, e],
              [g, f],
            ],
            count: 1,
            tone: "blue",
          },
          {
            segs: [
              [e, f],
              [d, g],
            ],
            count: 2,
            tone: "blue",
          },
        );
      }
    }
  }
  return draw.figure(
    "rectangle",
    "Bảng vẽ hình chữ nhật bằng thước và êke",
    d,
    e,
  );
}

function rhombusFigure(
  names: readonly string[],
  state: VisualState,
): FigureSpec {
  const [m = "M", n = "N", p = "P", q = "Q"] = names;
  const { left } = LAYOUT.rhombus;
  const draw = new Drawing();
  const first: Pt = [left, BASE];
  draw.corner(m, first);
  const { len, angle } = state;
  if (len !== undefined) {
    const second: Pt = [left + len * UNIT, BASE];
    draw.corner(n, second);
    draw.segs.push(bold(m, n));
    if (angle !== undefined) {
      const dir = rise(angle);
      const radius = len * UNIT;
      const corner = add(first, scaled(dir, radius));
      draw.pts.ray = add(first, scaled(dir, MAX_SLANT_CM * UNIT));
      draw.segs.push(guide(m, "ray"));
      draw.angles.push({
        at: m,
        a: n,
        b: "ray",
        text: `${angle}°`,
        tone: "violet",
        radius: 24,
        textDistance: angleTextDistance(len),
      });
      if (flag(state, "markQ")) {
        draw.corner(q, corner);
        draw.segs.push(bold(m, q));
        draw.arcs.push(arcAround(m, radius, -angle));
        if (flag(state, "arcQ")) draw.arcs.push(arcAround(q, radius, 0));
      }
      if (flag(state, "arcN")) draw.arcs.push(arcAround(n, radius, -angle));
      if (flag(state, "pointP") && flag(state, "markQ")) {
        draw.corner(p, add(second, sub(corner, first)));
        if (flag(state, "join")) {
          draw.segs.push(bold(q, p), bold(p, n));
          draw.ticks.push({
            segs: [
              [m, n],
              [n, p],
              [p, q],
              [q, m],
            ],
            count: 1,
            tone: "blue",
          });
        }
      }
    }
  }
  return draw.figure(
    "rhombus",
    "Bảng vẽ hình thoi bằng thước, thước đo góc và compa",
    m,
    n,
  );
}

function parallelogramFigure(
  names: readonly string[],
  state: VisualState,
): FigureSpec {
  const [e = "E", f = "F", h = "H", k = "K"] = names;
  const { left } = LAYOUT.parallelogram;
  const draw = new Drawing();
  const first: Pt = [left, BASE];
  draw.corner(e, first);
  const { len, angle, side } = state;
  if (len !== undefined) {
    const second: Pt = [left + len * UNIT, BASE];
    draw.corner(f, second);
    draw.segs.push(bold(e, f));
    if (angle !== undefined) {
      const dir = rise(angle);
      draw.pts.ray = add(first, scaled(dir, MAX_SLANT_CM * UNIT));
      draw.segs.push(guide(e, "ray"));
      draw.angles.push({
        at: e,
        a: f,
        b: "ray",
        text: `${angle}°`,
        tone: "violet",
        radius: 24,
        textDistance: angleTextDistance(len, side),
      });
      if (side !== undefined) {
        const slant = scaled(dir, side * UNIT);
        const upper = add(first, slant);
        draw.corner(k, upper);
        draw.segs.push(bold(e, k));
        if (flag(state, "parF")) {
          draw.pts.fRay = add(second, scaled(dir, MAX_SLANT_CM * UNIT));
          draw.segs.push(guide(f, "fRay"));
        }
        if (flag(state, "parK")) {
          draw.pts.kRay = add(upper, [len * UNIT + 2 * GUIDE_OVERRUN, 0]);
          draw.segs.push(guide(k, "kRay"));
        }
        if (flag(state, "parF") && flag(state, "parK")) {
          draw.corner(h, add(second, slant));
          if (flag(state, "join")) {
            draw.segs.push(bold(k, h), bold(h, f));
            draw.arrows.push(
              {
                segs: [
                  [e, f],
                  [k, h],
                ],
                count: 1,
                tone: "slate",
              },
              {
                segs: [
                  [e, k],
                  [f, h],
                ],
                count: 2,
                tone: "slate",
              },
            );
          }
        }
      }
    }
  }
  return draw.figure(
    "parallelogram",
    "Bảng vẽ hình bình hành bằng thước, thước đo góc và êke",
    e,
    f,
    { [h]: PARALLEL_FOURTH_SHIFT },
  );
}

// Where the two compass arcs of the diagonal board meet (the upper point),
// when both radii are set and the circles cross.
export function cornerOf(state: VisualState): Pt | undefined {
  const { len, rBC, rAC } = state;
  if (len === undefined || rBC === undefined || rAC === undefined)
    return undefined;
  const { left } = LAYOUT["parallelogram-diagonal"];
  return meetingPoints(
    [left, BASE],
    rAC * UNIT,
    [left + len * UNIT, BASE],
    rBC * UNIT,
  )?.[0];
}

function diagonalFigure(
  names: readonly string[],
  state: VisualState,
): FigureSpec {
  const [a = "A", b = "B", c = "C", d = "D"] = names;
  const { left } = LAYOUT["parallelogram-diagonal"];
  const draw = new Drawing();
  const first: Pt = [left, BASE];
  draw.corner(a, first);
  const { len, rBC, rAC } = state;
  const meet = cornerOf(state);
  if (len !== undefined) {
    const second: Pt = [left + len * UNIT, BASE];
    draw.corner(b, second);
    draw.segs.push(bold(a, b));
    const toward = (from: Pt, fallback: number) =>
      meet ? directionDeg(from, meet) : fallback;
    if (rBC !== undefined && flag(state, "arcB")) {
      draw.arcs.push(arcAround(b, rBC * UNIT, toward(second, -120)));
    }
    if (rAC !== undefined && flag(state, "arcA")) {
      draw.arcs.push(arcAround(a, rAC * UNIT, toward(first, -60)));
    }
    if (meet && flag(state, "pointC")) {
      draw.corner(c, meet);
      draw.segs.push(bold(b, c), bold(a, c, "amber"));
      const shift = sub(meet, second);
      if (flag(state, "parC")) {
        draw.pts.cLeft = [meet[0] - (len * UNIT + 2 * GUIDE_OVERRUN), meet[1]];
        draw.pts.cRight = [meet[0] + GUIDE_OVERRUN, meet[1]];
        draw.segs.push(guide("cLeft", "cRight"));
      }
      if (flag(state, "parA")) {
        draw.pts.aFar = add(first, scaled(shift, 1.25));
        draw.segs.push(guide(a, "aFar"));
      }
      if (flag(state, "parC") && flag(state, "parA")) {
        draw.corner(d, add(first, shift));
        if (flag(state, "join")) {
          draw.segs.push(bold(c, d), bold(d, a));
          draw.arrows.push(
            {
              segs: [
                [a, b],
                [d, c],
              ],
              count: 1,
              tone: "slate",
            },
            {
              segs: [
                [b, c],
                [a, d],
              ],
              count: 2,
              tone: "slate",
            },
          );
        }
      }
    }
  }
  return draw.figure(
    "parallelogram-diagonal",
    "Bảng vẽ hình bình hành bằng thước, compa và êke",
    a,
    b,
    { [c]: DIAGONAL_THIRD_SHIFT, [d]: DIAGONAL_FOURTH_SHIFT },
  );
}

// The board as it looks in this state.
export function boardFigure(
  shape: BoardShape,
  names: readonly string[],
  state: VisualState,
): FigureSpec {
  switch (shape) {
    case "rectangle":
      return rectangleFigure(names, state);
    case "rhombus":
      return rhombusFigure(names, state);
    case "parallelogram":
      return parallelogramFigure(names, state);
    case "parallelogram-diagonal":
      return diagonalFigure(names, state);
  }
}
