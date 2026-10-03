import type { Row } from "@/visuals/shared/formula-rows";
import type { FigureSpec, Pt, Tone } from "@/visuals/shared/plane/figure-spec";
import { centroid, sideTextAt } from "./figures";

// What the interactive pictures of the lesson are made of. Pure data and
// small pure functions, no React, so `content:check` and the tests read it.

// ---------------------------------------------------------------- walking

// A walk once round a shape: the child presses "Đi tiếp" and the marker goes
// along the next side, which then shows its length and joins the running sum.
export type WalkSpec = {
  // The shape, drawn with its outline only; its corners are named A, B, C, …
  figure: FigureSpec;
  // Length of each side in `unit`, from corner A round to A again.
  sides: readonly number[];
  unit: string;
  // The line said once the walk is complete.
  closing: string;
  // Tone of the sides already walked (default blue, the colour of the
  // perimeter).
  tone?: Tone;
};

export function walkCorners(spec: WalkSpec): string[] {
  return spec.sides.map((_, i) => String.fromCharCode(65 + i));
}

// The figure after `k` sides were walked: those sides drawn bold, each with
// its length beside it.
export function walkFigure(spec: WalkSpec, k: number): FigureSpec {
  const names = walkCorners(spec);
  const points = names.map((n) => spec.figure.pts[n] as Pt);
  const middle = centroid(points);
  const tone = spec.tone ?? "blue";
  const walked = names.slice(0, k);
  return {
    ...spec.figure,
    segs: [
      ...(spec.figure.segs ?? []),
      ...walked.map((name, i) => ({
        a: name,
        b: names[(i + 1) % names.length] as string,
        tone,
        bold: true,
      })),
    ],
    texts: [
      ...(spec.figure.texts ?? []),
      ...walked.map((name, i) => {
        const a = spec.figure.pts[name] as Pt;
        const b = spec.figure.pts[
          names[(i + 1) % names.length] as string
        ] as Pt;
        const text = String(spec.sides[i]);
        const [x, y] = sideTextAt(a, b, middle, text);
        return { x, y, text, tone };
      }),
    ],
  };
}

// The sum written under the picture: "5 + 3 + 9 = 17 cm".
export function walkSum(spec: WalkSpec, k: number): string {
  if (k === 0) return "";
  const parts = spec.sides.slice(0, k);
  const total = parts.reduce((sum, side) => sum + side, 0);
  return `${parts.join(" + ")} = ${total} ${spec.unit}`;
}

// ------------------------------------------------------------------ tiles

// Unit squares the child taps one by one to count them.
export type TilesSpec = {
  label: string;
  cols: number;
  rows: number;
  // The squares of the shape, [column, row]; the whole block when left out.
  cells?: readonly (readonly [number, number])[];
  // Written under the picture: what one square is ("Mỗi ô là 1 cm²").
  legend: string;
  // Said once every square is counted.
  done: string;
};

export function tileCells(
  spec: TilesSpec,
): readonly (readonly [number, number])[] {
  return (
    spec.cells ??
    Array.from({ length: spec.cols * spec.rows }, (_, i) => [
      i % spec.cols,
      Math.floor(i / spec.cols),
    ])
  );
}

// ------------------------------------------------------------------ floor

// A floor to cover with square tiles laid in rows: the child sets how many
// tiles go in a row and how many rows.
export type FloorSpec = {
  label: string;
  // The floor of a lesson screen, in tiles; an exercise gives its own.
  goal: { perRow: number; rows: number };
  // Side of one tile, said in the closing line ("1 m").
  tile: string;
  done: string;
};

export const FLOOR_EXTRA = 2;

// ------------------------------------------------------------------ stage

// A drawing whose parts move as the child presses buttons (or taps a part):
// a piece is cut and slid, or copied and turned half a turn.
export type StagePiece = {
  id: string;
  // Corners of a polygon, or the two ends of a line.
  v: readonly Pt[];
  tone: Tone;
  // Filled polygon (a line is never filled).
  filled?: boolean;
  dash?: boolean;
  // The step from which the piece is on the picture (always when left out).
  appearAt?: number;
  // How it moves once its trigger comes: the step, or "tap" for a piece the
  // child taps.
  moveAt?: number | "tap";
  move?: { dx: number; dy: number } | { turn: number; cx: number; cy: number };
  // Spoken name of a tappable piece.
  label?: string;
};

export type StageText = {
  x: number;
  y: number;
  text: string;
  tone?: Tone;
  appearAt?: number;
};

export type StageSpec = {
  label: string;
  // What stays on the picture throughout.
  base: FigureSpec;
  pieces: readonly StagePiece[];
  texts?: readonly StageText[];
  // Buttons pressed in order; the picture shows `captions[step]`.
  actions?: readonly string[];
  captions?: readonly string[];
  // Word of the tap progress: "Đã xoay 2/4".
  verb?: string;
  done: string;
};

export function stageTapIds(spec: StageSpec): string[] {
  return spec.pieces.flatMap((p) => (p.moveAt === "tap" ? [p.id] : []));
}

export function isTapStage(spec: StageSpec): boolean {
  return stageTapIds(spec).length > 0;
}

// Number of presses (buttons) or taps (pieces) that finish the stage.
export function stageGoal(spec: StageSpec): number {
  return isTapStage(spec)
    ? stageTapIds(spec).length
    : (spec.actions?.length ?? 0);
}

// Whether a piece is on the picture, and whether it has moved, after `step`
// presses and with the `tapped` pieces turned.
export function pieceStatus(
  piece: StagePiece,
  step: number,
  tapped: ReadonlySet<string>,
): { visible: boolean; moved: boolean } {
  const visible = piece.appearAt === undefined || step >= piece.appearAt;
  const moved =
    piece.moveAt === undefined
      ? false
      : piece.moveAt === "tap"
        ? tapped.has(piece.id)
        : step >= piece.moveAt;
  return { visible, moved };
}

// ------------------------------------------------------------------- calc

// A worked calculation, line by line, with an optional picture above it. In
// "hint" mode the last line stays a "?" and is never shown.
export type CalcSpec = {
  label: string;
  figure?: FigureSpec;
  rows: readonly Row[];
  mode: "steps" | "hint" | "still";
};

// ---------------------------------------------------------------- gallery

export type GalleryItem = { caption: string; figure: FigureSpec };

export type GallerySpec = {
  label: string;
  items: readonly GalleryItem[];
  columns?: 1 | 2 | 3;
};
