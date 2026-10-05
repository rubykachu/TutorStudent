"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import { DoneLine, ShownLine } from "@/visuals/shared/guided-feedback";
import { useGuidedTask } from "@/visuals/shared/guided-step";
import { decorative, stateSet } from "@/visuals/shared/markers";
import { AXIS_CLASS, LineMark, Strokes } from "./draw";
import { FoldGroup, useFold } from "./fold-view";
import { bandPoints } from "./layout";
import { LineBadge } from "./line-badge";
import {
  type AxisPickerSpec,
  axesState,
  type Candidate,
  candidatesOf,
  type LineRef,
  marksAxes,
  type PickGroup,
  pickKey,
} from "./lines";
import { FRAME, SHAPES, type ShapeId } from "./shapes";

// Two pictures where the child works with the lines of one shape: "gấp thử"
// folds the shape along any line the child taps and says whether the halves
// fit; "chọn trục" lets the child mark the lines that are axes. Both list a
// few candidate lines (the axes and some lines that only look like axes).

// Half the width, in drawing units, of the tappable band round a line.
const HIT_HALF_WIDTH = 12;
// Only the outer part of a line, the end that carries its letter, is
// tappable: lines through the middle of a shape cross there, and a tap in
// the middle would be ambiguous.
const HIT_FROM = 0.65;
// How much bigger the letters of a line are in a picture shown small.
const SMALL_BADGE = 1.5;

function LineButton({
  candidate,
  stateKey,
  pressed,
  disabled,
  onTap,
  label,
}: {
  candidate: Candidate;
  stateKey: string;
  pressed: boolean;
  disabled: boolean;
  onTap: () => void;
  label: string;
}) {
  const { axis } = candidate;
  const startX = axis.p[0] + (axis.q[0] - axis.p[0]) * HIT_FROM;
  const startY = axis.p[1] + (axis.q[1] - axis.p[1]) * HIT_FROM;
  return (
    // biome-ignore lint/a11y/useSemanticElements: an SVG has no <button>; a focusable group with the button role is the equivalent inside a drawing
    <g
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-pressed={pressed}
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
      {...stateSet(stateKey, 1)}
    >
      <polygon
        points={bandPoints([startX, startY], axis.q, HIT_HALF_WIDTH)}
        fill="transparent"
      />
    </g>
  );
}

function allTested(total: number): VisualState {
  return Object.fromEntries(
    Array.from({ length: total }, (_, i) => [`l${i}`, 1]),
  );
}

// ---------------------------------------------------------------------------
// "Gấp thử": fold along the line the child taps.

export type FoldLabSpec = {
  shape: ShapeId;
  lines: readonly LineRef[];
  // Closing line once every line has been tried.
  done: string;
};

export function FoldLab({
  spec,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { spec: FoldLabSpec }) {
  const def = SHAPES[spec.shape];
  const candidates = candidatesOf(spec.shape, spec.lines);
  const total = candidates.length;
  const [own, setOwn] = useState<VisualState>({});
  const [shown, setShown] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const tested = (i: number) =>
    (shownState ?? (shown ? allTested(total) : own))[`l${i}`] === 1;
  const count = candidates.filter((_, i) => tested(i)).length;
  const finished = count === total;
  const locked = disabled || shownState !== undefined;
  const chosen = selected === null ? undefined : candidates[selected];
  const { t, reduced } = useFold(1, `${selected}`);

  function tap(index: number) {
    setSelected(index);
    const next = { ...own, [`l${index}`]: 1 };
    setOwn(next);
    onStateChange?.(next);
  }
  function show() {
    setShown(true);
    onStateChange?.(allTested(total));
  }
  useGuidedTask(finished, show);

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="w-full max-w-xs">
        {/* biome-ignore lint/a11y/useSemanticElements: a drawing that holds buttons is a group of them */}
        <svg
          viewBox={`0 0 ${FRAME} ${FRAME}`}
          role="group"
          aria-label={`${def.name}: chạm vào một đường để gấp hình theo đường đó`}
          className="h-auto w-full"
        >
          {chosen ? (
            <FoldGroup
              strokes={def.strokes}
              axis={chosen.axis}
              t={t}
              smoothly={!reduced}
            />
          ) : (
            <Strokes strokes={def.strokes} />
          )}
          <g {...decorative}>
            {candidates.map((c, i) => (
              <LineMark
                key={c.letter}
                axis={c.axis}
                className={
                  !tested(i)
                    ? "stroke-muted-foreground"
                    : c.isAxis
                      ? AXIS_CLASS
                      : "stroke-retry"
                }
                dashed={!tested(i) || !c.isAxis}
                width={selected === i ? 4.5 : 3}
              />
            ))}
          </g>
          {candidates.map((c) => (
            <LineBadge key={c.letter} axis={c.axis} letter={c.letter} />
          ))}
          {candidates.map((c, i) => (
            <LineButton
              key={c.letter}
              candidate={c}
              stateKey={`l${i}`}
              pressed={selected === i}
              disabled={locked}
              onTap={() => tap(i)}
              label={`Đường ${c.letter}`}
            />
          ))}
        </svg>
      </div>
      <p
        className={`flex min-h-14 items-center justify-center gap-2 text-center text-caption ${chosen ? "font-semibold" : "text-muted-foreground"}`}
        aria-live="polite"
        data-fold-verdict
      >
        {chosen ? (
          chosen.isAxis ? (
            <>
              <Check aria-hidden className="size-5 shrink-0 text-correct" />
              {`Gấp theo đường ${chosen.letter}: hai nửa chồng khít. Đường ${chosen.letter} là trục đối xứng.`}
            </>
          ) : (
            <>
              <X aria-hidden className="size-5 shrink-0 text-retry" />
              {`Gấp theo đường ${chosen.letter}: hai nửa không chồng khít. Đường ${chosen.letter} không phải trục.`}
            </>
          )
        ) : (
          "Chạm vào một đường để gấp hình theo đường đó."
        )}
      </p>
      <p
        className="text-center text-caption text-muted-foreground"
        aria-live="polite"
      >
        {`Đã thử ${count}/${total}`}
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

// ---------------------------------------------------------------------------
// "Chọn trục": mark the lines that are axes, on one shape or on several.

function PickShape({
  group,
  index,
  state,
  locked,
  small,
  onToggle,
}: {
  group: PickGroup;
  index: number;
  state: VisualState;
  locked: boolean;
  // Several shapes share the picture, so each is drawn small.
  small: boolean;
  onToggle: (key: string) => void;
}) {
  const def = SHAPES[group.shape];
  const candidates = candidatesOf(group.shape, group.lines);
  const marked = (i: number) => state[pickKey(index, i)] === 1;
  return (
    // biome-ignore lint/a11y/useSemanticElements: a drawing that holds buttons is a group of them
    <svg
      viewBox={`0 0 ${FRAME} ${FRAME}`}
      role="group"
      aria-label={`${def.name}: chạm vào các đường là trục đối xứng`}
      className="h-auto w-full"
    >
      <Strokes strokes={def.strokes} />
      <g {...decorative}>
        {candidates.map((c, i) => (
          <LineMark
            key={c.letter}
            axis={c.axis}
            className={marked(i) ? AXIS_CLASS : "stroke-muted-foreground"}
            dashed={!marked(i)}
            width={marked(i) ? 4.5 : 3}
          />
        ))}
      </g>
      {candidates.map((c) => (
        <LineBadge
          key={c.letter}
          axis={c.axis}
          letter={c.letter}
          scale={small ? SMALL_BADGE : 1}
        />
      ))}
      {candidates.map((c, i) => (
        <LineButton
          key={c.letter}
          candidate={c}
          stateKey={pickKey(index, i)}
          pressed={marked(i)}
          disabled={locked}
          onTap={() => onToggle(pickKey(index, i))}
          label={`Đường ${c.letter}`}
        />
      ))}
    </svg>
  );
}

export function AxisPicker({
  spec,
  params,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { spec: AxisPickerSpec }) {
  const guided = params === undefined && spec.done !== undefined;
  const [own, setOwn] = useState<VisualState>({});
  const [shown, setShown] = useState(false);
  const state = shownState ?? (shown ? axesState(spec) : own);
  const locked = disabled || shownState !== undefined;
  const right = marksAxes(spec, state);
  const count = Object.values(state).filter((v) => v === 1).length;
  const axisTotal = Object.keys(axesState(spec)).length;
  const wrongNow = guided && !shown && count === axisTotal && !right;

  function toggle(key: string) {
    const next = { ...own };
    if (next[key] === 1) delete next[key];
    else next[key] = 1;
    setOwn(next);
    onStateChange?.(next);
  }
  function show() {
    setShown(true);
    onStateChange?.(axesState(spec));
  }
  useGuidedTask(!guided || right || shown, show);
  const many = spec.groups.length > 1;

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div
        className={
          many ? "grid w-full max-w-md grid-cols-2 gap-2" : "w-full max-w-xs"
        }
      >
        {spec.groups.map((group, g) => (
          <PickShape
            // biome-ignore lint/suspicious/noArrayIndexKey: groups never reorder
            key={g}
            group={group}
            index={g}
            state={state}
            locked={locked}
            small={many}
            onToggle={toggle}
          />
        ))}
      </div>
      <p
        className={`min-h-6 text-center text-caption ${wrongNow ? "font-semibold text-retry-soft-foreground" : "text-muted-foreground"}`}
        aria-live="polite"
      >
        {wrongNow
          ? "Chưa đúng. Bạn chạm lại một đường để đổi."
          : `Đã chọn ${count} đường`}
      </p>
      {guided && right && !shown && <DoneLine>{spec.done}</DoneLine>}
      {guided && shown && <ShownLine>{spec.done}</ShownLine>}
    </div>
  );
}
