"use client";

import {
  type Announcements,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { type ReactNode, useId, useMemo, useState } from "react";
import { WRONG_TONE } from "@/exercises/answer-highlight";
import type { AnswerSlotProps } from "@/exercises/exercise-frame";
import type { HighlightSpec } from "@/exercises/feedback";
import type { MatchInput } from "@/exercises/input";
import { ItemContent } from "@/exercises/item-content";
import { useTapSound } from "@/lib/feedback-sounds";
import type { Item, MatchExercise } from "@/schema/content";
import { Highlight } from "@/visuals/shared/highlight";
import {
  type Armed,
  leftOf,
  type Pairs,
  pairItems,
  type Side,
  shuffleRight,
  tapItem,
} from "./pairs";

export type MatchAnswerProps = {
  exercise: MatchExercise;
  slot: AnswerSlotProps<MatchInput>;
};

// A press has to travel this far before it becomes a drag, so a plain tap
// stays a tap and goes through the tap-to-place flow.
const DRAG_DISTANCE_PX = 8;

const NO_PAIRS: Pairs = {};

// Items are announced by the row they are shown on: their content may be a
// formula or a picture with no short spoken form.
function positionLabel(side: Side, index: number): string {
  return side === "left"
    ? `mục ${index + 1} bên trái`
    : `ô ${index + 1} bên phải`;
}

function announcements(columns: Record<Side, readonly Item[]>): Announcements {
  const label = (side: Side, id: string | number) =>
    positionLabel(
      side,
      columns[side].findIndex((item) => item.id === String(id)),
    );
  return {
    onDragStart: ({ active }) => `Đang kéo ${label("left", active.id)}.`,
    onDragOver: ({ over }) =>
      over ? `Đang ở trên ${label("right", over.id)}.` : undefined,
    onDragEnd: ({ active, over }) =>
      over
        ? `Đã nối ${label("left", active.id)} với ${label("right", over.id)}.`
        : "Chưa nối.",
    onDragCancel: () => "Đã huỷ kéo.",
  };
}

const ITEM =
  "relative flex min-h-touch w-full items-center gap-3 rounded-md px-3 py-2 text-left disabled:cursor-default motion-safe:transition-transform motion-safe:active:scale-97";

function itemBorder(armed: boolean, over: boolean, wrong: boolean): string {
  if (armed || over) return "border-3 border-primary bg-surface";
  return wrong ? WRONG_TONE : "border-2 border-border bg-surface";
}

// Number shared by a left item and the right item it is paired with, so a
// pair reads by its number and not by colour alone.
function PairBadge({
  number,
  revealed,
}: {
  number: number | undefined;
  revealed: boolean;
}) {
  if (number === undefined) {
    return (
      <span
        aria-hidden
        className="size-8 shrink-0 rounded-full border-2 border-dashed border-muted-foreground"
      />
    );
  }
  return (
    <span
      aria-hidden
      className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full font-bold text-primary-foreground ${revealed ? "bg-correct" : "bg-primary"}`}
    >
      {number}
    </span>
  );
}

type ItemProps = {
  item: Item;
  armed: boolean;
  disabled: boolean;
  revealed: boolean;
  highlight: HighlightSpec | undefined;
  wrong: boolean;
  onTap: () => void;
};

function Marked({
  highlight,
  children,
}: {
  highlight: HighlightSpec | undefined;
  children: ReactNode;
}) {
  return (
    <Highlight
      active={highlight !== undefined}
      color={highlight?.color}
      strong={highlight?.strong}
      className="w-full"
    >
      {children}
    </Highlight>
  );
}

function LeftItem({
  item,
  index,
  paired,
  armed,
  disabled,
  revealed,
  highlight,
  wrong,
  onTap,
}: ItemProps & { index: number; paired: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: item.id, disabled });
  return (
    <li>
      <Marked highlight={highlight}>
        <button
          ref={setNodeRef}
          type="button"
          {...attributes}
          {...listeners}
          aria-roledescription={undefined}
          aria-pressed={armed}
          disabled={disabled}
          data-item={item.id}
          data-side="left"
          data-armed={armed || undefined}
          data-wrong={wrong || undefined}
          style={{ transform: CSS.Translate.toString(transform) }}
          onClick={onTap}
          // Touch drags would otherwise scroll the page instead of moving the item.
          // A transform transition would make the item trail the finger.
          className={`${ITEM} touch-none ${itemBorder(armed, false, wrong)} ${isDragging ? "z-10 shadow-card transition-none" : ""}`}
        >
          <PairBadge
            number={paired ? index + 1 : undefined}
            revealed={revealed}
          />
          <span className="sr-only">{`Mục ${index + 1}:`}</span>
          <ItemContent content={item.content} />
          {paired && <span className="sr-only">, đã nối</span>}
        </button>
      </Marked>
    </li>
  );
}

function RightItem({
  item,
  pairedWith,
  armed,
  disabled,
  revealed,
  highlight,
  wrong,
  onTap,
}: ItemProps & { pairedWith: number | undefined }) {
  const { setNodeRef, isOver } = useDroppable({ id: item.id, disabled });
  return (
    <li>
      <Marked highlight={highlight}>
        <button
          ref={setNodeRef}
          type="button"
          aria-pressed={armed}
          disabled={disabled}
          data-item={item.id}
          data-side="right"
          data-armed={armed || undefined}
          data-wrong={wrong || undefined}
          onClick={onTap}
          className={`${ITEM} ${itemBorder(armed, isOver, wrong)}`}
        >
          <PairBadge number={pairedWith} revealed={revealed} />
          <ItemContent content={item.content} />
          {pairedWith !== undefined && (
            <span className="sr-only">{`, đã nối với mục ${pairedWith}`}</span>
          )}
        </button>
      </Marked>
    </li>
  );
}

// Drag a left item onto a right item, or tap one and then the other. Right
// items without a pair in the answer are distractors and look like the rest.
export function MatchAnswer({ exercise, slot }: MatchAnswerProps) {
  const { value, onChange, disabled, highlight, wrong, reveal, seed } = slot;
  const right = useMemo(() => shuffleRight(exercise, seed), [exercise, seed]);
  const [armedItem, setArmedItem] = useState<Armed | null>(null);
  const dndId = useId();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: DRAG_DISTANCE_PX },
    }),
  );
  const own = value?.pairs ?? NO_PAIRS;
  const pairs: Pairs = reveal
    ? Object.fromEntries(exercise.pairs.map((p) => [p.left, p.right]))
    : own;
  const armed = disabled ? null : armedItem;
  const leftNumber = new Map(exercise.left.map((item, i) => [item.id, i + 1]));

  function commit(next: Pairs) {
    onChange(
      Object.keys(next).length > 0 ? { type: "match", pairs: next } : null,
    );
  }

  const playTap = useTapSound();

  function tap(tapped: Armed) {
    playTap();
    const result = tapItem(own, armed, tapped);
    setArmedItem(result.armed);
    if (result.pairs !== own) commit(result.pairs);
  }

  function dragEnd({ active, over }: DragEndEvent) {
    if (!over) return;
    setArmedItem(null);
    commit(pairItems(own, String(active.id), String(over.id)));
  }

  const isArmed = (side: Side, id: string) =>
    armed?.side === side && armed.id === id;

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      onDragEnd={dragEnd}
      accessibility={{
        announcements: announcements({ left: exercise.left, right }),
        screenReaderInstructions: {
          draggable:
            "Chạm một mục bên trái rồi chạm một ô bên phải để nối, hoặc kéo mục sang ô.",
        },
      }}
    >
      <div className="grid grid-cols-2 gap-6" data-reveal={reveal || undefined}>
        <ul className="flex flex-col gap-3" aria-label="Cột trái">
          {exercise.left.map((item, index) => (
            <LeftItem
              key={item.id}
              item={item}
              index={index}
              paired={Object.hasOwn(pairs, item.id)}
              armed={isArmed("left", item.id)}
              disabled={disabled}
              revealed={reveal}
              highlight={highlight.get(item.id)}
              wrong={!reveal && wrong.has(item.id)}
              onTap={() => tap({ side: "left", id: item.id })}
            />
          ))}
        </ul>
        <ul className="flex flex-col gap-3" aria-label="Cột phải">
          {right.map((item) => {
            const left = leftOf(pairs, item.id);
            return (
              <RightItem
                key={item.id}
                item={item}
                pairedWith={
                  left === undefined ? undefined : leftNumber.get(left)
                }
                armed={isArmed("right", item.id)}
                disabled={disabled}
                revealed={reveal}
                highlight={highlight.get(item.id)}
                wrong={!reveal && wrong.has(item.id)}
                onTap={() => tap({ side: "right", id: item.id })}
              />
            );
          })}
        </ul>
      </div>
    </DndContext>
  );
}
