"use client";

import { useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import {
  DoneLine,
  ShownLine,
  useGuidedGoal,
} from "@/visuals/shared/guided-feedback";
import { decorative, stateSet } from "@/visuals/shared/markers";
import { AXIS_CLASS, points } from "./draw";
import {
  candidateEdges,
  chosenEdges,
  type EdgeBoardSpec,
  type EdgeParams,
  edgeStateKey,
  figureAxes,
  isDrawnRight,
  solveEdges,
  stateOfEdges,
} from "./edges";
import type { Pt } from "./geometry";
import { axisSegment, chain, isChain } from "./lattice";
import { bandPoints, widthOf } from "./layout";

// The board of "vẽ thêm đường gấp khúc": the lattice, the given polyline and
// the unit pieces the child switches on. On a lesson screen (`goal` given)
// the board says how many axes the figure has and when the goal is met; in an
// exercise nothing is revealed until the answer is shown.

const TARGET = 336;
const MARGIN = 24;
const MAX_UNIT = 56;
// Half the width, in drawing units, of the tappable band round a piece.
const HIT_HALF_WIDTH = 20;
const BOARD_HEIGHT = 330;
const STILL_HEIGHT = 380;

function unitOf(spec: EdgeBoardSpec): number {
  return Math.min(MAX_UNIT, (TARGET - 2 * MARGIN) / (spec.cols - 1));
}

function Drawing({
  spec,
  chosen,
  withAxes,
}: {
  spec: EdgeBoardSpec;
  chosen: readonly (readonly [Pt, Pt])[];
  withAxes: boolean;
}) {
  const unit = unitOf(spec);
  const at = ([x, y]: Pt): Pt => [MARGIN + x * unit, MARGIN + y * unit];
  const lines = [];
  for (let x = 0; x < spec.cols; x++) {
    lines.push([at([x, 0]), at([x, spec.rows - 1])] as const);
  }
  for (let y = 0; y < spec.rows; y++) {
    lines.push([at([0, y]), at([spec.cols - 1, y])] as const);
  }
  const axes = withAxes ? figureAxes(spec, chosen) : [];
  return (
    <g {...decorative}>
      {lines.map(([a, b]) => (
        <line
          key={`${a}${b}`}
          x1={a[0]}
          y1={a[1]}
          x2={b[0]}
          y2={b[1]}
          strokeWidth={1}
          className="stroke-border"
        />
      ))}
      {Array.from({ length: spec.cols * spec.rows }, (_, n) => {
        const [x, y] = at([n % spec.cols, Math.floor(n / spec.cols)]);
        return (
          <circle
            key={`${x},${y}`}
            cx={x}
            cy={y}
            r={2.5}
            className="fill-muted-foreground"
          />
        );
      })}
      {axes.map((axis) => {
        const [a, b] = axisSegment(axis, spec.cols, spec.rows).map(at) as [
          Pt,
          Pt,
        ];
        return (
          <line
            key={`${axis.kind}${axis.at}`}
            x1={a[0]}
            y1={a[1]}
            x2={b[0]}
            y2={b[1]}
            strokeWidth={3}
            strokeDasharray="9 7"
            strokeLinecap="round"
            className={AXIS_CLASS}
          />
        );
      })}
      <polyline
        points={points(spec.given.map(at))}
        fill="none"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-foreground"
      />
      {chosen.map(([a, b]) => (
        <line
          key={`${a}${b}`}
          x1={at(a)[0]}
          y1={at(a)[1]}
          x2={at(b)[0]}
          y2={at(b)[1]}
          strokeWidth={5}
          strokeLinecap="round"
          className="stroke-primary"
        />
      ))}
    </g>
  );
}

export function EdgeBoard({
  spec,
  params,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { spec: EdgeBoardSpec }) {
  const unit = unitOf(spec);
  const width = (spec.cols - 1) * unit + 2 * MARGIN;
  const height = (spec.rows - 1) * unit + 2 * MARGIN;
  const at = ([x, y]: Pt): Pt => [MARGIN + x * unit, MARGIN + y * unit];
  const guided = params === undefined && spec.goal !== undefined;
  const wanted: EdgeParams | undefined = guided
    ? spec.goal
    : params === undefined
      ? undefined
      : { length: params.length ?? 0, axes: params.axes ?? 0 };
  const [own, setOwn] = useState<VisualState>({});
  const [revealed, setRevealed] = useState(false);
  const locked = disabled || shownState !== undefined;
  const solved = (): VisualState => {
    const found = wanted ? solveEdges(spec, wanted) : undefined;
    return found ? stateOfEdges(spec, found) : {};
  };
  const state = shownState ?? (revealed ? solved() : own);
  const edges = candidateEdges(spec);
  const chosen = chosenEdges(spec, state);
  const right = wanted !== undefined && isDrawnRight(spec, state, wanted);
  const axisCount = figureAxes(spec, chosen).length;
  const complete = chosen.length > 0 && isChain(chosen);
  const showAxes = guided || locked || revealed;

  function toggle(index: number) {
    const key = edgeStateKey(index);
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
      onStateChange?.(solved());
    },
  });

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div
        className="w-full"
        style={{ maxWidth: widthOf({ width, height }, BOARD_HEIGHT) }}
      >
        {/* biome-ignore lint/a11y/useSemanticElements: a drawing that holds buttons is a group of them */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="group"
          aria-label={`${spec.label}: chạm vào các đoạn của lưới để vẽ thêm`}
          className="h-auto w-full"
        >
          <Drawing
            spec={spec}
            chosen={chosen}
            withAxes={showAxes && chosen.length > 0 && complete}
          />
          {edges.map((edge, i) => {
            const [a, b] = [at(edge[0]), at(edge[1])];
            const on = state[edgeStateKey(i)] === 1;
            return (
              // biome-ignore lint/a11y/useSemanticElements: an SVG has no <button>; a focusable group with the button role is the equivalent inside a drawing
              <g
                key={edgeStateKey(i)}
                role="button"
                tabIndex={locked ? -1 : 0}
                aria-label={`Đoạn từ điểm hàng ${edge[0][1] + 1}, cột ${edge[0][0] + 1} đến điểm hàng ${edge[1][1] + 1}, cột ${edge[1][0] + 1}`}
                aria-pressed={on}
                aria-disabled={locked || undefined}
                {...decorative}
                className={`outline-none focus-visible:stroke-ring ${locked ? "" : "cursor-pointer"}`}
                onClick={() => {
                  if (!locked) toggle(i);
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  if (!locked) toggle(i);
                }}
                {...stateSet(edgeStateKey(i), 1)}
              >
                <polygon
                  points={bandPoints(a, b, HIT_HALF_WIDTH)}
                  fill="transparent"
                />
              </g>
            );
          })}
        </svg>
      </div>
      <p
        className="min-h-6 text-center text-caption text-muted-foreground"
        aria-live="polite"
      >
        {guided && spec.goal
          ? `Đã vẽ thêm ${chosen.length}/${spec.goal.length} đoạn${complete && showAxes ? `. Hình có ${axisCount} trục đối xứng.` : ""}`
          : `Đã vẽ thêm ${chosen.length} đoạn`}
      </p>
      {guided && right && !shown && spec.goal && (
        <DoneLine>{spec.goal.done}</DoneLine>
      )}
      {guided && shown && spec.goal && <ShownLine>{spec.goal.done}</ShownLine>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// A still picture: the given polyline with the polyline that completes it
// and the axes of the figure.

export type EdgeStillSpec = {
  board: EdgeBoardSpec;
  params: EdgeParams;
  // The polyline to draw, as the chain of its lattice points; without it the
  // first solution the solver finds is drawn.
  path?: readonly Pt[];
};

export function EdgeStill({ spec }: { spec: EdgeStillSpec }) {
  const { board } = spec;
  const unit = unitOf(board);
  const width = (board.cols - 1) * unit + 2 * MARGIN;
  const height = (board.rows - 1) * unit + 2 * MARGIN;
  const found = spec.path
    ? chain(spec.path)
    : (solveEdges(board, spec.params) ?? []);
  return (
    <div
      className="mx-auto w-full"
      style={{ maxWidth: widthOf({ width, height }, STILL_HEIGHT) }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={board.label}
        className="h-auto w-full"
      >
        <Drawing spec={board} chosen={found} withAxes />
      </svg>
    </div>
  );
}
