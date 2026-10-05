"use client";

import { useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import {
  DoneLine,
  ShownLine,
  useGuidedGoal,
} from "@/visuals/shared/guided-feedback";
import { decorative, stateSet } from "@/visuals/shared/markers";
import { StepPlayer } from "@/visuals/shared/step-player";
import {
  AXIS_CLASS,
  AXIS_FILL_CLASS,
  MIRROR_FILL_CLASS,
  MIRROR_STROKE_CLASS,
  points,
} from "./draw";
import type { Pt } from "./geometry";
import { axisSegment, mirrorPoint, onAxis } from "./lattice";
import { widthOf } from "./layout";
import {
  arcPoints,
  isMirrored,
  isPartDrawn,
  isPlaced,
  type MirrorPart,
  type MirrorSpec,
  pointKey,
  requiredPoints,
  solvedMirror,
  tappablePoints,
  wrongPoints,
} from "./mirror-model";

// The drawing board of "vẽ thêm cho đối xứng": a lattice, the axis, the given
// half of a drawing and the points the child has placed. On a lesson screen
// (`done` given) the pieces of the mirror image appear as their corners are
// placed right and a wrong point is marked; in an exercise nothing is
// revealed until the answer is shown.

const TARGET = 336;
const MARGIN = 30;
const MAX_UNIT = 52;
// The tallest a picture may be, in pixels, with the text and buttons it comes
// with still inside a frame of 480.
const BOARD_HEIGHT = 330;
const STILL_HEIGHT = 380;
const STEPS_HEIGHT = 290;
const GIVEN_LINE = 3.5;

export function unitOf(spec: MirrorSpec): number {
  return Math.min(MAX_UNIT, (TARGET - 2 * MARGIN) / (spec.cols - 1));
}

type Frame = {
  unit: number;
  width: number;
  height: number;
  at: (p: Pt) => Pt;
};

export function frameOf(spec: MirrorSpec): Frame {
  const unit = unitOf(spec);
  return {
    unit,
    width: (spec.cols - 1) * unit + 2 * MARGIN,
    height: (spec.rows - 1) * unit + 2 * MARGIN,
    at: ([x, y]) => [MARGIN + x * unit, MARGIN + y * unit],
  };
}

function PartDrawing({
  part,
  spec,
  frame,
  mirror,
  className,
  ready = () => true,
}: {
  part: MirrorPart;
  spec: MirrorSpec;
  frame: Frame;
  mirror: boolean;
  className: string;
  // Whether a corner of the given half has its mirror image placed: a piece
  // of a line is drawn between two corners that have.
  ready?: (corner: Pt) => boolean;
}) {
  const place = (p: Pt): Pt => frame.at(mirror ? mirrorPoint(p, spec.axis) : p);
  switch (part.kind) {
    case "line": {
      const pieces: [Pt, Pt][] = [];
      for (let i = 0; i + 1 < part.pts.length; i++) {
        pieces.push([part.pts[i] as Pt, part.pts[i + 1] as Pt]);
      }
      const first = part.pts[0];
      const last = part.pts[part.pts.length - 1];
      if (part.closed && first && last) pieces.push([last, first]);
      return (
        <>
          {pieces.flatMap(([a, b]) =>
            ready(a) && ready(b)
              ? [
                  <line
                    key={`${a}${b}`}
                    x1={place(a)[0]}
                    y1={place(a)[1]}
                    x2={place(b)[0]}
                    y2={place(b)[1]}
                    strokeWidth={GIVEN_LINE}
                    strokeLinecap="round"
                    className={className}
                  />,
                ]
              : [],
          )}
        </>
      );
    }
    case "ring": {
      const [cx, cy] = place(part.c);
      return (
        <circle
          cx={cx}
          cy={cy}
          r={part.r * frame.unit}
          fill="none"
          strokeWidth={GIVEN_LINE}
          className={className}
        />
      );
    }
    case "dot": {
      const [cx, cy] = place(part.c);
      return (
        <circle
          cx={cx}
          cy={cy}
          r={frame.unit * 0.16}
          className={className.replace("stroke-", "fill-")}
          stroke="none"
        />
      );
    }
    case "arc": {
      const pts = arcPoints(part.c, part.r, part.from, part.to).map(place);
      return (
        <polyline
          points={points(pts)}
          fill="none"
          strokeWidth={GIVEN_LINE}
          strokeLinecap="round"
          className={className}
        />
      );
    }
  }
}

// Where the name "d" of the axis stands: just past the end of the axis that
// has room for it.
function axisNameSpot(kind: MirrorSpec["axis"]["kind"], end: Pt): Pt {
  switch (kind) {
    case "v":
      return [end[0], end[1] + 18];
    case "h":
      return [end[0] + 16, end[1]];
    case "d":
      return [end[0] + 15, end[1] + 15];
    case "a":
      return [end[0] + 15, end[1] - 15];
  }
}

// The lattice with its axis and the given half of the drawing.
export function Lattice({ spec, frame }: { spec: MirrorSpec; frame: Frame }) {
  const [a, b] = axisSegment(spec.axis, spec.cols, spec.rows).map(frame.at) as [
    Pt,
    Pt,
  ];
  const [dx, dy] = axisNameSpot(spec.axis.kind, b);
  const lines: {
    key: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }[] = [];
  for (let x = 0; x < spec.cols; x++) {
    const [px, py] = frame.at([x, 0]);
    lines.push({
      key: `c${x}`,
      x1: px,
      y1: py,
      x2: px,
      y2: frame.at([x, spec.rows - 1])[1],
    });
  }
  for (let y = 0; y < spec.rows; y++) {
    const [px, py] = frame.at([0, y]);
    lines.push({
      key: `r${y}`,
      x1: px,
      y1: py,
      x2: frame.at([spec.cols - 1, y])[0],
      y2: py,
    });
  }
  return (
    <g {...decorative}>
      {lines.map(({ key, ...line }) => (
        <line key={key} {...line} strokeWidth={1} className="stroke-border" />
      ))}
      <line
        x1={a[0]}
        y1={a[1]}
        x2={b[0]}
        y2={b[1]}
        strokeWidth={3}
        strokeDasharray="9 7"
        strokeLinecap="round"
        className={AXIS_CLASS}
      />
      <text
        x={dx}
        y={dy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={20}
        stroke="none"
        className={`font-heading font-bold ${AXIS_FILL_CLASS}`}
      >
        d
      </text>
      {spec.numbering &&
        Array.from(
          { length: spec.numbering === "cols" ? spec.cols : spec.rows },
          (_, i) => {
            const [x, y] =
              spec.numbering === "cols" ? frame.at([i, 0]) : frame.at([0, i]);
            return (
              <text
                // biome-ignore lint/suspicious/noArrayIndexKey: the numbers of a ruler never reorder
                key={`n${i}`}
                x={spec.numbering === "cols" ? x : x - 18}
                y={spec.numbering === "cols" ? y - 18 : y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={18}
                stroke="none"
                className="fill-muted-foreground font-heading font-semibold"
              >
                {i + 1}
              </text>
            );
          },
        )}
      {spec.parts.map((part, i) => (
        <PartDrawing
          // biome-ignore lint/suspicious/noArrayIndexKey: parts never reorder
          key={i}
          part={part}
          spec={spec}
          frame={frame}
          mirror={false}
          className="stroke-foreground"
        />
      ))}
    </g>
  );
}

// The pieces of the mirror image whose corners are placed.
function MirrorLayer({
  spec,
  frame,
  state,
}: {
  spec: MirrorSpec;
  frame: Frame;
  state: VisualState;
}) {
  const ready = (corner: Pt) =>
    onAxis(corner, spec.axis) ||
    isPlaced(spec, state, mirrorPoint(corner, spec.axis));
  return (
    <g {...decorative}>
      {spec.parts.map(
        (part, i) =>
          (part.kind === "line" || isPartDrawn(spec, state, part)) && (
            <PartDrawing
              // biome-ignore lint/suspicious/noArrayIndexKey: parts never reorder
              key={i}
              part={part}
              spec={spec}
              frame={frame}
              mirror
              ready={ready}
              className={MIRROR_STROKE_CLASS}
            />
          ),
      )}
    </g>
  );
}

// A shift beside a point, turned over the axis along with the point.
function mirrorVector([dx, dy]: Pt, kind: MirrorSpec["axis"]["kind"]): Pt {
  switch (kind) {
    case "v":
      return [-dx, dy];
    case "h":
      return [dx, -dy];
    case "d":
      return [dy, dx];
    case "a":
      return [-dy, -dx];
  }
}

function Names({
  spec,
  frame,
  prime,
  state,
  all,
}: {
  spec: MirrorSpec;
  frame: Frame;
  prime: boolean;
  state: VisualState;
  all: boolean;
}) {
  const names = Object.entries(spec.names ?? {});
  return (
    <g {...decorative}>
      {names.map(([name, p]) => {
        const shift = spec.nameShift?.[name] ?? [-0.35, -0.35];
        const image = mirrorPoint(p, spec.axis);
        const shown = !prime || all || isPlaced(spec, state, image);
        if (!shown) return null;
        const [x, y] = frame.at(prime ? image : p);
        const [sx, sy] = prime ? mirrorVector(shift, spec.axis.kind) : shift;
        return (
          <text
            key={`${name}${prime}`}
            x={x + sx * frame.unit}
            y={y + sy * frame.unit}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={20}
            stroke="none"
            className={`font-heading font-bold ${prime ? MIRROR_FILL_CLASS : "fill-foreground"}`}
          >
            {prime ? `${name}′` : name}
          </text>
        );
      })}
    </g>
  );
}

export function MirrorBoard({
  spec,
  params,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { spec: MirrorSpec }) {
  const frame = frameOf(spec);
  const guided = params === undefined && spec.done !== undefined;
  const [own, setOwn] = useState<VisualState>({});
  const locked = disabled || shownState !== undefined;
  const [revealed, setRevealed] = useState(false);
  const state = shownState ?? (revealed ? solvedMirror(spec) : own);
  const right = isMirrored(spec, state);
  const showMirror = guided || locked || revealed;
  const wrong = guided && !revealed ? wrongPoints(spec, state) : [];
  const required = requiredPoints(spec);
  const placed = tappablePoints(spec).filter((p) => isPlaced(spec, state, p));

  function toggle(point: Pt) {
    const key = pointKey(spec, point);
    const next = { ...own };
    if (next[key] === 1) delete next[key];
    else next[key] = 1;
    setOwn(next);
    onStateChange?.(next);
  }
  const { shown } = useGuidedGoal({
    met: guided && right,
    guided,
    reveal: () => {
      setRevealed(true);
      onStateChange?.(solvedMirror(spec));
    },
  });

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div
        className="w-full"
        style={{ maxWidth: widthOf(frame, BOARD_HEIGHT) }}
      >
        {/* biome-ignore lint/a11y/useSemanticElements: a drawing that holds buttons is a group of them */}
        <svg
          viewBox={`0 0 ${frame.width} ${frame.height}`}
          role="group"
          aria-label={`${spec.label}: chạm vào các điểm đối xứng`}
          className="h-auto w-full"
        >
          <Lattice spec={spec} frame={frame} />
          {showMirror && (
            <MirrorLayer spec={spec} frame={frame} state={state} />
          )}
          <Names spec={spec} frame={frame} prime={false} state={state} all />
          {showMirror && (
            <Names
              spec={spec}
              frame={frame}
              prime
              state={state}
              all={locked || revealed}
            />
          )}
          {tappablePoints(spec).map((point) => {
            const [cx, cy] = frame.at(point);
            const key = pointKey(spec, point);
            const on = isPlaced(spec, state, point);
            const bad = wrong.some(
              (p) => p[0] === point[0] && p[1] === point[1],
            );
            return (
              // biome-ignore lint/a11y/useSemanticElements: an SVG has no <button>; a focusable group with the button role is the equivalent inside a drawing
              <g
                key={key}
                role="button"
                tabIndex={locked ? -1 : 0}
                aria-label={`Điểm hàng ${point[1] + 1}, cột ${point[0] + 1}`}
                aria-pressed={on}
                aria-disabled={locked || undefined}
                {...decorative}
                className={`outline-none focus-visible:stroke-ring ${locked ? "" : "cursor-pointer"}`}
                onClick={() => {
                  if (!locked) toggle(point);
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  if (!locked) toggle(point);
                }}
                {...stateSet(key, 1)}
              >
                <rect
                  x={cx - frame.unit / 2}
                  y={cy - frame.unit / 2}
                  width={frame.unit}
                  height={frame.unit}
                  fill="transparent"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={on ? frame.unit * 0.2 : 3.5}
                  strokeWidth={bad ? 3 : 0}
                  strokeDasharray={bad ? "5 4" : undefined}
                  className={
                    bad
                      ? "fill-surface stroke-retry"
                      : on
                        ? MIRROR_FILL_CLASS
                        : "fill-muted-foreground"
                  }
                />
              </g>
            );
          })}
        </svg>
      </div>
      <p
        className={`min-h-6 text-center text-caption ${wrong.length > 0 ? "font-semibold text-retry-soft-foreground" : "text-muted-foreground"}`}
        aria-live="polite"
      >
        {wrong.length > 0
          ? "Có điểm chưa đúng. Chạm lại điểm đó để bỏ chọn."
          : guided
            ? `Đã đặt ${placed.length}/${required.length} điểm`
            : `Đã chạm ${placed.length} điểm`}
      </p>
      {guided && right && !shown && <DoneLine>{spec.done}</DoneLine>}
      {guided && shown && <ShownLine>{spec.done}</ShownLine>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Still pictures of a board.

export type MirrorStillSpec = {
  board: MirrorSpec;
  // The finished drawing; or a one-point demonstration of how to count
  // (`demo`).
  show: "solved" | "demo" | "given";
  // `given`: only the lattice, the axis and the given half.
  // `demo`: the point whose mirror image is asked for, with its distance to
  // the axis counted out.
  from?: Pt;
  // `solved`: draws the way from each named point to its image, counted out.
  links?: boolean;
};

export function MirrorStill({ spec }: { spec: MirrorStillSpec }) {
  const { board } = spec;
  const frame = frameOf(board);
  const solved = spec.show === "solved";
  const state = solvedMirror(board);
  const from = spec.from;
  return (
    <div
      className="mx-auto w-full"
      style={{ maxWidth: widthOf(frame, STILL_HEIGHT) }}
    >
      <svg
        viewBox={`0 0 ${frame.width} ${frame.height}`}
        role="img"
        aria-label={board.label}
        className="h-auto w-full"
      >
        <Lattice spec={board} frame={frame} />
        {solved && <MirrorLayer spec={board} frame={frame} state={state} />}
        {solved && <PlacedDots spec={board} frame={frame} state={state} />}
        <Names spec={board} frame={frame} prime={false} state={state} all />
        {solved && <Names spec={board} frame={frame} prime state={state} all />}
        {solved &&
          spec.links &&
          Object.values(board.names ?? {}).map((point) => (
            <DemoCount
              key={`${point}`}
              board={board}
              frame={frame}
              from={point}
              question={false}
            />
          ))}
        {!solved && from && (
          <DemoCount board={board} frame={frame} from={from} question />
        )}
      </svg>
    </div>
  );
}

// The points placed so far, as dots.
function PlacedDots({
  spec,
  frame,
  state,
}: {
  spec: MirrorSpec;
  frame: Frame;
  state: VisualState;
}) {
  return (
    <g {...decorative}>
      {requiredPoints(spec)
        .filter((p) => isPlaced(spec, state, p))
        .map((p) => {
          const [x, y] = frame.at(p);
          return (
            <circle
              key={`${p}`}
              cx={x}
              cy={y}
              r={frame.unit * 0.17}
              className={MIRROR_FILL_CLASS}
            />
          );
        })}
    </g>
  );
}

// The board drawn step by step: each frame places one more point, and the
// piece of the mirror image between two placed points appears.
export type MirrorStepsSpec = { board: MirrorSpec; start: string; end: string };

export function MirrorSteps({ spec }: { spec: MirrorStepsSpec }) {
  const { board } = spec;
  const frame = frameOf(board);
  const order = requiredPoints(board);
  const names = Object.entries(board.names ?? {});
  const captionOf = (k: number): string => {
    if (k === 0) return spec.start;
    if (k > order.length) return spec.end;
    const point = order[k - 1] as Pt;
    const name = names.find(([, p]) => {
      const image = mirrorPoint(p, board.axis);
      return image[0] === point[0] && image[1] === point[1];
    })?.[0];
    return name === undefined
      ? "Đặt thêm một điểm đối xứng."
      : `Đặt điểm ${name}′ đối xứng với điểm ${name} qua d.`;
  };
  return (
    <StepPlayer steps={order.length + 2} label={board.label}>
      {(step) => {
        const placed = Math.min(step, order.length);
        const state: VisualState = Object.fromEntries(
          order.slice(0, placed).map((p) => [pointKey(board, p), 1]),
        );
        return (
          <div className="flex w-full flex-col items-center gap-2">
            <div
              className="w-full"
              style={{ maxWidth: widthOf(frame, STEPS_HEIGHT) }}
            >
              <svg
                viewBox={`0 0 ${frame.width} ${frame.height}`}
                role="img"
                aria-label={board.label}
                className="h-auto w-full"
              >
                <Lattice spec={board} frame={frame} />
                <MirrorLayer spec={board} frame={frame} state={state} />
                <PlacedDots spec={board} frame={frame} state={state} />
                <Names
                  spec={board}
                  frame={frame}
                  prime={false}
                  state={state}
                  all
                />
                <Names
                  spec={board}
                  frame={frame}
                  prime
                  state={state}
                  all={false}
                />
              </svg>
            </div>
            <p className="min-h-14 text-center font-heading text-block font-semibold">
              {captionOf(step)}
            </p>
          </div>
        );
      }}
    </StepPlayer>
  );
}

// The way from a point to its image, one square at a time: across to the
// axis, then (for a diagonal axis) along, ending at a "?".
function DemoCount({
  board,
  frame,
  from,
  question,
}: {
  board: MirrorSpec;
  frame: Frame;
  from: Pt;
  // The image is hidden behind a "?" (a hint) or shown (a rule picture).
  question: boolean;
}) {
  const image = mirrorPoint(from, board.axis);
  const diagonal = board.axis.kind === "d" || board.axis.kind === "a";
  // The point where the walk from `from` first meets the axis.
  const foot: Pt = diagonal
    ? board.axis.kind === "d"
      ? [from[1] - board.axis.at, from[1]]
      : [board.axis.at - from[1], from[1]]
    : board.axis.kind === "v"
      ? [board.axis.at, from[1]]
      : [from[0], board.axis.at];
  const [fx, fy] = frame.at(from);
  const [ox, oy] = frame.at(foot);
  const [ix, iy] = frame.at(image);
  const steps = Math.abs(from[0] - foot[0]) + Math.abs(from[1] - foot[1]);
  const half = (a: number, b: number) => (a + b) / 2;
  return (
    <g {...decorative}>
      <polyline
        points={`${fx},${fy} ${ox},${oy} ${ix},${iy}`}
        fill="none"
        strokeWidth={3}
        strokeDasharray="3 7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={MIRROR_STROKE_CLASS}
      />
      {question && (
        <circle
          cx={fx}
          cy={fy}
          r={frame.unit * 0.2}
          className="fill-foreground"
        />
      )}
      <text
        // A walk straight down or up keeps its count beside the line.
        x={half(fx, ox) + (fx === ox ? frame.unit * 0.6 : 0)}
        y={half(fy, oy) - (fx === ox ? 0 : frame.unit * 0.45)}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={21}
        stroke="none"
        className={`font-heading font-bold ${MIRROR_FILL_CLASS}`}
      >
        {`${steps} ô`}
      </text>
      {question && (
        <>
          <circle
            cx={ix}
            cy={iy}
            r={frame.unit * 0.3}
            strokeWidth={2.5}
            strokeDasharray="5 4"
            className={`fill-surface ${MIRROR_STROKE_CLASS}`}
          />
          <text
            x={ix}
            y={iy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={21}
            stroke="none"
            className="fill-foreground font-heading font-bold"
          >
            ?
          </text>
        </>
      )}
    </g>
  );
}
