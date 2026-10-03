"use client";

import { useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { DoneLine, ShownLine } from "@/visuals/shared/guided-feedback";
import { useGuidedTask } from "@/visuals/shared/guided-step";
import { decorative, stateSet } from "@/visuals/shared/markers";
import { FigureLayers, strokeClass } from "./figure";
import type { FigureSpec, Tone } from "./figure-spec";
import { unit } from "./geometry";
import {
  bubbleOf,
  type ProbePart,
  type ProbeSpec,
  probeFigure,
} from "./probe-model";

// A figure whose parts the child taps one by one ("chạm để đo"): a tapped
// segment or angle shows what it measures, a tapped region is coloured in.
// State is one key per part, { i0, i1, … }, with 1 = done. It serves lesson
// screens: "Tiếp" waits until every part is done, or until "Xem cách làm"
// shows them all.

const BUBBLE_RADIUS = 13;
// Width in screen pixels of the invisible stroke that makes a segment easy to
// tap, whatever the size of the drawing.
const HIT_WIDTH = 48;
const HIT_RADIUS = 24;
// A button under the figure.
const CHIP =
  "inline-flex min-h-touch items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 px-4 font-semibold disabled:opacity-90 motion-safe:transition-transform motion-safe:active:scale-97";
// Half the length, in drawing units, of the tappable stretch of a segment.
const HIT_REACH = 26;

// The tappable stretch of a segment part: a short piece round its "?", so
// segments that cross each other never share a tap.
function hitEnds(
  figure: FigureSpec,
  part: Extract<ProbePart, { kind: "seg" }>,
  spot: readonly [number, number],
) {
  const from = figure.pts[part.a] as readonly [number, number];
  const to = figure.pts[part.b] as readonly [number, number];
  const [dx, dy] = unit(from, to);
  return {
    x1: spot[0] - dx * HIT_REACH,
    y1: spot[1] - dy * HIT_REACH,
    x2: spot[0] + dx * HIT_REACH,
    y2: spot[1] + dy * HIT_REACH,
  };
}

function PartTarget({
  index,
  part,
  figure,
  disabled,
  onTap,
}: {
  index: number;
  part: Exclude<ProbePart, { kind: "chip" }>;
  figure: FigureSpec;
  disabled: boolean;
  onTap: () => void;
}) {
  const at = bubbleOf(figure, part);
  if (!at) return null;
  const hit =
    part.kind === "seg" ? (
      <line
        {...hitEnds(figure, part, at)}
        stroke="transparent"
        strokeWidth={HIT_WIDTH}
        strokeLinecap="round"
        className="[vector-effect:non-scaling-stroke]"
      />
    ) : part.kind === "angle" ? (
      <circle cx={at[0]} cy={at[1]} r={HIT_RADIUS} fill="transparent" />
    ) : (
      <polygon
        points={part.v.map((name) => figure.pts[name]?.join(",")).join(" ")}
        fill="transparent"
      />
    );
  return (
    // biome-ignore lint/a11y/useSemanticElements: an SVG has no <button>; a focusable group with the button role is the equivalent inside a drawing
    <g
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={part.label}
      aria-pressed={false}
      aria-disabled={disabled || undefined}
      {...decorative}
      className={`outline-none focus-visible:stroke-ring ${disabled ? "" : "cursor-pointer"}`}
      onClick={() => {
        if (!disabled) onTap();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        if (!disabled) onTap();
      }}
      {...stateSet(`i${index}`, 1)}
    >
      {hit}
      <g {...decorative}>
        <circle
          cx={at[0]}
          cy={at[1]}
          r={BUBBLE_RADIUS}
          className={`fill-surface ${strokeClass(part.tone)}`}
          strokeWidth={2.5}
          strokeDasharray="5 4"
        />
        <text
          x={at[0]}
          y={at[1]}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={17}
          stroke="none"
          className="fill-foreground font-heading font-bold"
        >
          ?
        </text>
      </g>
    </g>
  );
}

export function Probe({
  spec,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { spec: ProbeSpec }) {
  const [own, setOwn] = useState<VisualState>({});
  const [shown, setShown] = useState(false);
  const total = spec.parts.length;
  const doneAt = (i: number) =>
    (shownState ?? (shown ? allDone(total) : own))[`i${i}`] === 1;
  const done = spec.parts.map((_, i) => doneAt(i));
  const count = done.filter(Boolean).length;
  const finished = count === total;
  const locked = disabled || shownState !== undefined;

  function tap(index: number) {
    const next = { ...own, [`i${index}`]: 1 };
    setOwn(next);
    onStateChange?.(next);
  }
  function show() {
    setShown(true);
    onStateChange?.(allDone(total));
  }
  useGuidedTask(finished, show);

  const figure = probeFigure(spec, done);
  const background: FigureSpec = spec.figure;
  const chips = spec.parts.flatMap((part, i) =>
    part.kind === "chip" ? [{ part, i }] : [],
  );
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div
        className={`w-full ${spec.maxScale === undefined ? "max-w-md" : ""}`}
        style={
          spec.maxScale === undefined
            ? undefined
            : { maxWidth: background.w * spec.maxScale }
        }
      >
        {/* biome-ignore lint/a11y/useSemanticElements: a drawing that holds buttons is a group of them */}
        <svg
          viewBox={`0 0 ${background.w} ${background.h}`}
          role="group"
          aria-label={background.label}
          className={`h-auto w-full ${spec.maxScale === undefined ? "max-h-72" : ""}`}
          style={
            spec.maxScale === undefined
              ? undefined
              : { maxHeight: background.h * spec.maxScale }
          }
        >
          <FigureLayers spec={figure} />
          {spec.parts.map((part, i) =>
            part.kind === "chip" || done[i] ? null : (
              <PartTarget
                // biome-ignore lint/suspicious/noArrayIndexKey: parts never reorder
                key={i}
                index={i}
                part={part}
                figure={spec.figure}
                disabled={locked}
                onTap={() => tap(i)}
              />
            ),
          )}
        </svg>
      </div>
      {chips.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {chips.map(({ part, i }) => (
            <button
              key={part.label}
              type="button"
              className={`${CHIP} ${done[i] ? "border-correct bg-correct-soft text-correct-soft-foreground" : "border-border bg-surface text-foreground"}`}
              aria-pressed={done[i]}
              disabled={locked || done[i]}
              onClick={() => tap(i)}
              {...stateSet(`i${i}`, 1)}
            >
              <ConceptMark color={chipColor(part.tone)} className="size-5" />
              {part.label}
            </button>
          ))}
        </div>
      )}
      <p
        className="text-center text-caption text-muted-foreground"
        aria-live="polite"
      >
        {`Đã ${spec.verb} ${count}/${total}`}
      </p>
      {finished && !shown && shownState === undefined && (
        <DoneLine>{spec.done}</DoneLine>
      )}
      {finished && (shown || shownState !== undefined) && (
        <ShownLine>{spec.done}</ShownLine>
      )}
    </div>
  );
}

function allDone(total: number): VisualState {
  return Object.fromEntries(
    Array.from({ length: total }, (_, i) => [`i${i}`, 1]),
  );
}

function chipColor(tone: Tone) {
  return tone === "ink" || tone === "mute" ? "slate" : tone;
}
