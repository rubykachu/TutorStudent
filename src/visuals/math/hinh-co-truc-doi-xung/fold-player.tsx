"use client";

import { useId } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { decorative } from "@/visuals/shared/markers";
import { StepPlayer } from "@/visuals/shared/step-player";
import { AXIS_CLASS, LineMark, Strokes } from "./draw";
import { FixedHalf, FoldGroup } from "./fold-view";
import { angleDeg, type Line } from "./geometry";
import { PAPERS, type PaperId, SHEETS_TWICE, type TwiceSheet } from "./paper";
import { FRAME, SHAPES, type ShapeId } from "./shapes";

// Pictures that play a fold frame by frame: a shape folding along its axis,
// a sheet of paper opening after a cut, and the sheet folded twice.

const FOLD_MS = 700;

type Frame = { t: number; caption: string };

function Captioned({
  caption,
  children,
  label,
}: {
  caption: string;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="w-full max-w-48">
        <svg
          viewBox={`0 0 ${FRAME} ${FRAME}`}
          role="img"
          aria-label={label}
          className="h-auto w-full"
        >
          {children}
        </svg>
      </div>
      <p className="min-h-14 text-center font-heading text-block font-semibold">
        {caption}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A shape folded along one of its axes.

export type FoldStepsSpec = {
  shape: ShapeId;
  // Which axis of the shape the fold follows.
  axis: number;
  // Folds along this line that is not an axis instead (an index into the
  // shape's `fakes`).
  fake?: number;
  frames: readonly Frame[];
};

export function FoldSteps({ spec }: { spec: FoldStepsSpec }) {
  const reduced = usePrefersReducedMotion();
  const def = SHAPES[spec.shape];
  const axis =
    spec.fake === undefined ? def.axes[spec.axis] : def.fakes[spec.fake];
  if (!axis) throw new Error(`${spec.shape} has no line to fold along`);
  const label =
    spec.fake === undefined
      ? `${def.name} gấp đôi theo trục đối xứng`
      : `${def.name} gấp đôi theo một đường không phải trục`;
  return (
    <StepPlayer steps={spec.frames.length} label={label}>
      {(step) => {
        const frame = spec.frames[Math.min(step, spec.frames.length - 1)];
        if (!frame) return null;
        return (
          <Captioned caption={frame.caption} label={label}>
            <FoldGroup
              strokes={def.strokes}
              axis={axis}
              t={frame.t}
              smoothly={!reduced}
            />
            <g {...decorative}>
              <LineMark axis={axis} className={AXIS_CLASS} />
            </g>
          </Captioned>
        );
      }}
    </StepPlayer>
  );
}

// ---------------------------------------------------------------------------
// A sheet of paper, folded and cut, opening.

export type PaperOpenSpec = { paper: PaperId; frames: readonly Frame[] };

export function PaperOpen({ spec }: { spec: PaperOpenSpec }) {
  const reduced = usePrefersReducedMotion();
  const paper = PAPERS[spec.paper];
  return (
    <StepPlayer steps={spec.frames.length} label={paper.name}>
      {(step) => {
        const frame = spec.frames[Math.min(step, spec.frames.length - 1)];
        if (!frame) return null;
        return (
          <Captioned caption={frame.caption} label={paper.name}>
            <FoldGroup
              strokes={paper.strokes}
              axis={paper.fold}
              t={frame.t}
              smoothly={!reduced}
            />
            <g {...decorative}>
              <LineMark axis={paper.fold} className={AXIS_CLASS} />
            </g>
          </Captioned>
        );
      }}
    </StepPlayer>
  );
}

// The sheet as it lies folded: only the half the cut is drawn on, with its
// fold line marked.
export function PaperFolded({ paper: id }: { paper: PaperId }) {
  const paper = PAPERS[id];
  const [x, y, w, h] = paper.foldedBox;
  return (
    <div className="mx-auto w-full max-w-36">
      <svg
        viewBox={`${x} ${y} ${w} ${h}`}
        role="img"
        aria-label={`${paper.name}, đã gấp đôi theo đường màu hồng`}
        className="h-auto w-full"
      >
        <FixedHalf strokes={paper.strokes} axis={paper.fold} />
        <g {...decorative}>
          <LineMark axis={paper.fold} className={AXIS_CLASS} dashed={false} />
        </g>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The sheet folded twice, with a cut at the corner where the folds meet.

export type PaperTwiceSpec = {
  // Which sheet is folded (default: the one cut at the corner).
  sheet?: "corner" | "holes";
  frames: readonly (Frame & { u: number })[];
};

// A piece of the open sheet: the strokes of the sheet cut to one quadrant.
function Quadrant({
  uid,
  clip,
  strokes,
}: {
  uid: string;
  clip: string;
  strokes: TwiceSheet["strokes"];
}) {
  return (
    <g clipPath={`url(#${uid}-${clip})`}>
      <Strokes strokes={strokes} />
    </g>
  );
}

// Turning over a line by `t` (0 open, 1 folded), as a CSS transform.
function foldTransform(axis: Line, t: number): string {
  const [px, py] = axis.p;
  const theta = angleDeg(axis);
  return `translate(${px}px, ${py}px) rotate(${theta}deg) scaleY(${1 - 2 * t}) rotate(${-theta}deg) translate(${-px}px, ${-py}px)`;
}

export function PaperTwice({ spec }: { spec: PaperTwiceSpec }) {
  const reduced = usePrefersReducedMotion();
  const uid = useId().replaceAll(":", "");
  const sheet = SHEETS_TWICE[spec.sheet ?? "corner"];
  const { vertical, horizontal, strokes } = sheet;
  const style = (axis: Line, t: number) => ({
    transform: foldTransform(axis, t),
    transformOrigin: "0 0",
    transition: reduced ? "none" : `transform ${FOLD_MS}ms ease-in-out`,
  });
  const mid = 120;
  const rect = (x: number, y: number, w: number, h: number) => (
    <rect x={x} y={y} width={w} height={h} />
  );
  return (
    <StepPlayer
      steps={spec.frames.length}
      label="Tờ giấy gấp hai lần rồi mở ra"
    >
      {(step) => {
        const frame = spec.frames[Math.min(step, spec.frames.length - 1)];
        if (!frame) return null;
        // `t` folds the first line (vertical), `u` the second (horizontal).
        return (
          <Captioned
            caption={frame.caption}
            label="Tờ giấy gấp hai lần rồi mở ra"
          >
            <defs>
              <clipPath id={`${uid}-tl`}>{rect(0, 0, mid, mid)}</clipPath>
              <clipPath id={`${uid}-tr`}>{rect(mid, 0, mid, mid)}</clipPath>
              <clipPath id={`${uid}-bl`}>{rect(0, mid, mid, mid)}</clipPath>
              <clipPath id={`${uid}-br`}>{rect(mid, mid, mid, mid)}</clipPath>
            </defs>
            <g {...decorative}>
              <Quadrant uid={uid} clip="tl" strokes={strokes} />
              <g style={style(vertical, frame.t)}>
                <Quadrant uid={uid} clip="tr" strokes={strokes} />
              </g>
              <g style={style(horizontal, frame.u)}>
                <Quadrant uid={uid} clip="bl" strokes={strokes} />
                <g style={style(vertical, frame.t)}>
                  <Quadrant uid={uid} clip="br" strokes={strokes} />
                </g>
              </g>
              <LineMark axis={vertical} className={AXIS_CLASS} />
              <LineMark axis={horizontal} className={AXIS_CLASS} />
            </g>
          </Captioned>
        );
      }}
    </StepPlayer>
  );
}
