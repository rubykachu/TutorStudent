import type { VisualState } from "@/visuals/registry";
import type {
  FigureArc,
  FigureRight,
  FigureSeg,
  FigureSpec,
  Pt,
} from "./figure-spec";
import { directionDeg, lineIntersection, meetingPoints } from "./geometry";

// The model of the two drawing boards of the lesson: an equilateral triangle
// drawn with a ruler and a compass, a square drawn with a ruler and a set
// square. A board is a list of steps; the child's state holds one key per
// step (a number for a stepper, 1 for a button pressed, 1 or 2 for a yes/no
// answer), and `constructFigure` draws the board from that state. Pure, so
// the validators, the walk-through frames and the component all agree.

export type ConstructShape = "triangle" | "square";

// Drawing units to the centimetre, and the longest segment the board offers.
export const UNIT = 18;
export const MAX_CM = 7;
export const MIN_CM = 1;

const LEFT = 36;
const BOARD_WIDTH = 196;
const TEXT_SIZE = 20;
// Room above the tallest figure for the name of its top corner.
const TOP_ROOM = 28;
const BASE = MAX_CM * UNIT + TOP_ROOM;
// Where the ruler sits under the first segment, and its height.
const RULER_DROP = 38;
const RULER_HEIGHT = 28;
const ARC_HALF_SPAN = 24;

export const BOARD_HEIGHT = BASE + RULER_DROP + RULER_HEIGHT + 6;

// One step of a board. `text` is the instruction shown while it is the step
// to do; `short` names its control (a stepper's label, a button).
export type ConstructStep =
  | { key: string; kind: "stepper"; text: string; short: string }
  | { key: string; kind: "press"; text: string; short: string }
  | {
      key: string;
      kind: "choice";
      text: string;
      yes: string;
      no: string;
    };

// The steps of a board, in the order the child does them. `names` are the
// corners: base left, base right, then the apex (triangle) or the corner
// above the right one and the corner above the left one (square).
export function constructSteps(
  shape: ConstructShape,
  names: readonly string[],
  diagonals: boolean,
): ConstructStep[] {
  const [first = "", second = "", third = "", fourth = ""] = names;
  if (shape === "triangle") {
    return [
      {
        key: "len",
        kind: "stepper",
        short: `Cạnh ${first}${second} (cm)`,
        text: `Dùng thước vẽ đoạn thẳng ${first}${second}: chọn độ dài.`,
      },
      {
        key: "open",
        kind: "stepper",
        short: "Mở compa (cm)",
        text: "Chọn độ mở của compa.",
      },
      {
        key: "arcM",
        kind: "press",
        short: `Cung ${first}`,
        text: `Đặt kim compa ở ${first}, vẽ một cung tròn.`,
      },
      {
        key: "arcN",
        kind: "press",
        short: `Cung ${second}`,
        text: `Đặt kim compa ở ${second}, vẽ một cung tròn.`,
      },
      {
        key: "apex",
        kind: "press",
        short: `Điểm ${third}`,
        text: `Chấm điểm ${third} ở chỗ hai cung gặp nhau.`,
      },
      {
        key: "join",
        kind: "press",
        short: "Nối",
        text: `Nối ${third} với ${first} và ${second}.`,
      },
    ];
  }
  const steps: ConstructStep[] = [
    {
      key: "len",
      kind: "stepper",
      short: `Cạnh ${first}${second} (cm)`,
      text: `Dùng thước vẽ đoạn thẳng ${first}${second}: chọn độ dài.`,
    },
    {
      key: "perpD",
      kind: "press",
      short: `Êke tại ${first}`,
      text: `Đặt êke ở ${first}, vẽ đường vuông góc với ${first}${second}.`,
    },
    {
      key: "perpE",
      kind: "press",
      short: `Êke tại ${second}`,
      text: `Đặt êke ở ${second}, vẽ đường vuông góc với ${first}${second}.`,
    },
    {
      key: "h",
      kind: "stepper",
      short: `${first}${fourth}, ${second}${third} (cm)`,
      text: `Lấy ${fourth} và ${third} trên hai đường vuông góc: chọn độ dài ${first}${fourth} và ${second}${third}.`,
    },
    {
      key: "join",
      kind: "press",
      short: `Nối ${fourth}${third}`,
      text: `Nối ${fourth} với ${third}.`,
    },
  ];
  if (diagonals) {
    steps.push(
      {
        key: "diag1",
        kind: "press",
        short: `Chéo ${first}${third}`,
        text: `Vẽ đường chéo ${first}${third}.`,
      },
      {
        key: "diag2",
        kind: "press",
        short: `Chéo ${second}${fourth}`,
        text: `Vẽ đường chéo ${second}${fourth}.`,
      },
      {
        key: "ans",
        kind: "choice",
        text: `Dùng êke kiểm tra: ${first}${third} và ${second}${fourth} có vuông góc với nhau không?`,
        yes: "Vuông góc",
        no: "Không vuông góc",
      },
    );
  }
  return steps;
}

export function stepDone(step: ConstructStep, state: VisualState): boolean {
  const value = state[step.key];
  if (value === undefined) return false;
  return step.kind === "stepper"
    ? true
    : step.kind === "press"
      ? value === 1
      : value === 1 || value === 2;
}

// A step can be done once every step before it is.
export function stepEnabled(
  steps: readonly ConstructStep[],
  index: number,
  state: VisualState,
): boolean {
  return steps.slice(0, index).every((step) => stepDone(step, state));
}

// The state a finished board of this side length has, keys in step order, so
// a validator compares with it and a solver (or the walk) replays it.
export function solvedState(
  shape: ConstructShape,
  side: number,
  diagonals: boolean,
): VisualState {
  if (shape === "triangle") {
    return { len: side, open: side, arcM: 1, arcN: 1, apex: 1, join: 1 };
  }
  return {
    len: side,
    perpD: 1,
    perpE: 1,
    h: side,
    join: 1,
    ...(diagonals ? { diag1: 1, diag2: 1, ans: 1 } : {}),
  };
}

const flag = (state: VisualState, key: string) => state[key] === 1;

// The two corners of the first segment.
function baseCorners(state: VisualState, base: number): [Pt, Pt | undefined] {
  const first: Pt = [LEFT, base];
  const len = state.len;
  return [first, len === undefined ? undefined : [LEFT + len * UNIT, base]];
}

function ruler() {
  return { x: LEFT, y: BASE + RULER_DROP, cm: MAX_CM, unit: UNIT };
}

function bold(
  a: string,
  b: string,
  tone: FigureSeg["tone"] = "ink",
): FigureSeg {
  return { a, b, tone, bold: true };
}

// Both circles of the compass pass through the apex only when each radius is
// at least half the segment.
export function apexOf(state: VisualState): Pt | undefined {
  const { len, open } = state;
  if (len === undefined || open === undefined) return undefined;
  const meet = meetingPoints(
    [LEFT, BASE],
    open * UNIT,
    [LEFT + len * UNIT, BASE],
    open * UNIT,
  );
  return meet?.[0];
}

function triangleFigure(
  names: readonly string[],
  state: VisualState,
): FigureSpec {
  const [left = "M", right = "N", top = "P"] = names;
  const [first, second] = baseCorners(state, BASE);
  const pts: Record<string, Pt> = { [left]: first };
  const segs: FigureSeg[] = [];
  const arcs: FigureArc[] = [];
  const dots: string[] = [left];
  const labelled = [left];
  if (second) {
    pts[right] = second;
    labelled.push(right);
    dots.push(right);
    segs.push(bold(left, right));
  }
  const { open } = state;
  if (open !== undefined && second) {
    // The compass opening, marked on the ruler from 0 to `open`.
    const y = BASE + RULER_DROP;
    pts.k0 = [LEFT, y];
    pts.k1 = [LEFT + open * UNIT, y];
    segs.push({ a: "k0", b: "k1", tone: "teal", bold: true });
    dots.push("k0", "k1");
  }
  const apex = apexOf(state);
  if (open !== undefined && second) {
    const radius = open * UNIT;
    const toward = (from: Pt, fallback: number) =>
      apex ? directionDeg(from, apex) : fallback;
    if (flag(state, "arcM")) {
      const centre = toward(first, -45);
      arcs.push({
        c: left,
        r: radius,
        from: centre - ARC_HALF_SPAN,
        to: centre + ARC_HALF_SPAN,
      });
    }
    if (flag(state, "arcN")) {
      const centre = toward(second, -135);
      arcs.push({
        c: right,
        r: radius,
        from: centre - ARC_HALF_SPAN,
        to: centre + ARC_HALF_SPAN,
      });
    }
  }
  if (apex && flag(state, "apex")) {
    pts[top] = apex;
    labelled.push(top);
    dots.push(top);
    if (flag(state, "join")) segs.push(bold(top, left), bold(top, right));
  }
  return {
    label: "Bảng vẽ hình tam giác đều bằng thước và compa",
    w: BOARD_WIDTH,
    h: BOARD_HEIGHT,
    textSize: TEXT_SIZE,
    pts,
    segs,
    arcs,
    dots,
    names: labelled,
    nameShift: { [left]: [-4, 2], [right]: [4, 2] },
    ruler: ruler(),
  };
}

function squareFigure(
  names: readonly string[],
  state: VisualState,
): FigureSpec {
  const [d = "D", e = "E", f = "F", q = "Q"] = names;
  const [first, second] = baseCorners(state, BASE);
  const pts: Record<string, Pt> = { [d]: first };
  const segs: FigureSeg[] = [];
  const rights: FigureRight[] = [];
  const dots: string[] = [d];
  const labelled = [d];
  const top = BASE - MAX_CM * UNIT;
  if (second) {
    pts[e] = second;
    labelled.push(e);
    dots.push(e);
    segs.push(bold(d, e));
    const corner = (name: string, x: number, key: string) => {
      if (!flag(state, key)) return;
      pts[`${name}Top`] = [x, top];
      segs.push({ a: name, b: `${name}Top`, tone: "mute", dash: true });
      rights.push({
        at: name,
        a: name === d ? e : d,
        b: `${name}Top`,
        tone: "violet",
      });
    };
    corner(d, first[0], "perpD");
    corner(e, second[0], "perpE");
  }
  const { h } = state;
  if (
    second &&
    h !== undefined &&
    flag(state, "perpD") &&
    flag(state, "perpE")
  ) {
    const y = BASE - h * UNIT;
    pts[q] = [first[0], y];
    pts[f] = [second[0], y];
    labelled.push(f, q);
    dots.push(f, q);
    segs.push(bold(d, q), bold(e, f));
    if (flag(state, "join")) segs.push(bold(q, f));
    if (flag(state, "diag1"))
      segs.push({ a: d, b: f, tone: "amber", bold: true, dash: true });
    if (flag(state, "diag2"))
      segs.push({ a: e, b: q, tone: "amber", bold: true, dash: true });
    if (flag(state, "diag1") && flag(state, "diag2") && state.ans === 1) {
      const meet = lineIntersection(first, pts[f] as Pt, second, pts[q] as Pt);
      if (meet) {
        pts.O = meet;
        rights.push({ at: "O", a: d, b: e, tone: "violet" });
      }
    }
  }
  return {
    label: "Bảng vẽ hình vuông bằng thước và êke",
    w: BOARD_WIDTH,
    h: BOARD_HEIGHT,
    textSize: TEXT_SIZE,
    pts,
    segs,
    rights,
    dots,
    names: labelled,
    nameShift: { [d]: [-4, 2], [e]: [4, 2] },
    ruler: ruler(),
  };
}

// The board as it looks in this state.
export function constructFigure(
  shape: ConstructShape,
  names: readonly string[],
  state: VisualState,
): FigureSpec {
  return shape === "triangle"
    ? triangleFigure(names, state)
    : squareFigure(names, state);
}
