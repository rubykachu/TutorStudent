"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { DoneLine, ShownLine } from "@/visuals/shared/guided-feedback";
import { useGuidedTask } from "@/visuals/shared/guided-step";
import { decorative, stateSet } from "@/visuals/shared/markers";
import { AXIS_CLASS, LineMark } from "./draw";
import {
  axisCountText,
  type Subject,
  SubjectDrawing,
  subjectAxisCount,
  subjectName,
} from "./figures";
import { FoldGroup, useFold } from "./fold-view";
import { candidateIsAxis, type LineRef } from "./lines";
import { FRAME, SHAPES, type ShapeId } from "./shapes";

// Cards the child taps one by one: a card either folds its shape along a line
// ("chạm để gấp") or shows the axes and how many there are ("chạm để xem").
// State is one key per card, { i0, i1, … }, with 1 = done. They serve lesson
// screens: "Tiếp" waits until every card is done, or until "Xem cách làm"
// does them all.

const CARD =
  "flex min-h-touch w-full flex-col items-center gap-0.5 rounded-xl border-2 bg-surface p-1.5 text-center motion-safe:transition-transform motion-safe:active:scale-97";

function allDone(total: number): VisualState {
  return Object.fromEntries(
    Array.from({ length: total }, (_, i) => [`i${i}`, 1]),
  );
}

// Shared state of a list of cards.
function useCards(total: number, onStateChange: VisualProps["onStateChange"]) {
  const [own, setOwn] = useState<VisualState>({});
  const [shown, setShown] = useState(false);
  return {
    doneAt: (i: number, shownState?: VisualState) =>
      (shownState ?? (shown ? allDone(total) : own))[`i${i}`] === 1,
    shown,
    tap(index: number) {
      const next = { ...own, [`i${index}`]: 1 };
      setOwn(next);
      onStateChange?.(next);
    },
    show() {
      setShown(true);
      onStateChange?.(allDone(total));
    },
  };
}

// ---------------------------------------------------------------------------
// "Chạm để gấp"

export type FoldCardItem = { shape: ShapeId; line: LineRef };

export type FoldCardsSpec = {
  label: string;
  items: readonly FoldCardItem[];
  verb: string;
  done: string;
};

function FoldCard({
  item,
  folded,
  disabled,
  index,
  onTap,
}: {
  item: FoldCardItem;
  folded: boolean;
  disabled: boolean;
  index: number;
  onTap: () => void;
}) {
  const def = SHAPES[item.shape];
  const axis = (item.line.src === "axis" ? def.axes : def.fakes)[item.line.i];
  if (!axis) throw new Error(`${item.shape} has no such line`);
  const fits = candidateIsAxis(item.shape, item.line);
  const { t, reduced } = useFold(folded ? 1 : 0, `${folded}`);
  return (
    <button
      type="button"
      className={`${CARD} ${folded ? (fits ? CONCEPT_CLASSES.teal.border : "border-retry") : "border-border"}`}
      disabled={disabled || folded}
      aria-pressed={folded}
      aria-label={
        folded
          ? `${def.name}: ${fits ? "hai nửa chồng khít" : "hai nửa không chồng khít"}`
          : `${def.name}, chạm để gấp đôi`
      }
      onClick={onTap}
      {...stateSet(`i${index}`, 1)}
    >
      <svg
        viewBox={`0 0 ${FRAME} ${FRAME}`}
        role="img"
        aria-label={def.name}
        className="h-auto w-full max-w-28"
      >
        {folded ? (
          <FoldGroup
            strokes={def.strokes}
            axis={axis}
            t={t}
            smoothly={!reduced}
          />
        ) : (
          <SubjectDrawing subject={{ shape: item.shape }} thin />
        )}
        <g {...decorative}>
          <LineMark
            axis={axis}
            className={fits ? AXIS_CLASS : "stroke-muted-foreground"}
          />
        </g>
      </svg>
      <span className="font-heading text-block font-semibold">{def.name}</span>
      {folded ? (
        <span className="flex items-center gap-1 text-caption">
          {fits ? (
            <Check aria-hidden className="size-5 text-correct" />
          ) : (
            <X aria-hidden className="size-5 text-retry" />
          )}
          {fits ? "Hai nửa chồng khít" : "Hai nửa lệch nhau"}
        </span>
      ) : (
        <span className="text-caption text-muted-foreground">Chạm để gấp</span>
      )}
    </button>
  );
}

export function FoldCards({
  spec,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { spec: FoldCardsSpec }) {
  const total = spec.items.length;
  const cards = useCards(total, onStateChange);
  const done = spec.items.map((_, i) => cards.doneAt(i, shownState));
  const count = done.filter(Boolean).length;
  const finished = count === total;
  const locked = disabled || shownState !== undefined;
  useGuidedTask(finished, cards.show);
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <ul
        aria-label={spec.label}
        className="grid w-full max-w-md grid-cols-2 gap-2"
      >
        {spec.items.map((item, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: cards never reorder
          <li key={i} className="flex min-w-0">
            <FoldCard
              item={item}
              folded={done[i] === true}
              disabled={locked}
              index={i}
              onTap={() => cards.tap(i)}
            />
          </li>
        ))}
      </ul>
      <p
        className="text-center text-caption text-muted-foreground"
        aria-live="polite"
      >
        {`Đã ${spec.verb} ${count}/${total}`}
      </p>
      {finished && !cards.shown && shownState === undefined && (
        <DoneLine>{spec.done}</DoneLine>
      )}
      {finished && (cards.shown || shownState !== undefined) && (
        <ShownLine>{spec.done}</ShownLine>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// "Chạm để xem": the axes of a shape or letter, and how many there are.

export type AxisCardsSpec = {
  label: string;
  items: readonly Subject[];
  verb: string;
  done: string;
};

export function AxisCards({
  spec,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { spec: AxisCardsSpec }) {
  const total = spec.items.length;
  const cards = useCards(total, onStateChange);
  const done = spec.items.map((_, i) => cards.doneAt(i, shownState));
  const count = done.filter(Boolean).length;
  const finished = count === total;
  const locked = disabled || shownState !== undefined;
  useGuidedTask(finished, cards.show);
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <ul
        aria-label={spec.label}
        className="grid w-full max-w-md grid-cols-2 gap-2"
      >
        {spec.items.map((item, i) => {
          const seen = done[i] === true;
          const axes = subjectAxisCount(item);
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: cards never reorder
            <li key={i} className="flex min-w-0">
              <button
                type="button"
                className={`${CARD} ${seen ? CONCEPT_CLASSES.pink.border : "border-border"}`}
                disabled={locked || seen}
                aria-pressed={seen}
                aria-label={
                  seen
                    ? `${subjectName(item)}: ${axisCountText(axes).toLowerCase()}`
                    : `${subjectName(item)}, chạm để xem trục đối xứng`
                }
                onClick={() => cards.tap(i)}
                {...stateSet(`i${i}`, 1)}
              >
                <svg
                  viewBox={`0 0 ${FRAME} ${FRAME}`}
                  role="img"
                  aria-label={subjectName(item)}
                  className="h-auto w-full max-w-28"
                >
                  <SubjectDrawing subject={item} axes={seen} thin />
                </svg>
                <span className="font-heading text-block font-semibold">
                  {subjectName(item)}
                </span>
                {seen ? (
                  <span className="flex items-center gap-2 text-caption">
                    <ConceptMark color="pink" className="size-5" />
                    {axisCountText(axes)}
                  </span>
                ) : (
                  <span className="text-caption text-muted-foreground">
                    Chạm để xem
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <p
        className="text-center text-caption text-muted-foreground"
        aria-live="polite"
      >
        {`Đã ${spec.verb} ${count}/${total}`}
      </p>
      {finished && !cards.shown && shownState === undefined && (
        <DoneLine>{spec.done}</DoneLine>
      )}
      {finished && (cards.shown || shownState !== undefined) && (
        <ShownLine>{spec.done}</ShownLine>
      )}
    </div>
  );
}
