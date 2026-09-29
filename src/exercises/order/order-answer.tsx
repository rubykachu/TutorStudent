"use client";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AnswerHighlight, surfaceFor } from "@/exercises/answer-highlight";
import { DRAG_ACCESSIBILITY, useDragSensors } from "@/exercises/drag";
import type { AnswerSlotProps } from "@/exercises/exercise-frame";
import type { HighlightSpec } from "@/exercises/feedback";
import type { OrderInput } from "@/exercises/input";
import { ItemContent } from "@/exercises/item-content";
import { seededShuffle } from "@/exercises/shuffle";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import type { Item, OrderExercise } from "@/schema/content";

type OrderAnswerProps = {
  exercise: OrderExercise;
  slot: AnswerSlotProps<OrderInput>;
};

export function OrderAnswer({ exercise, slot }: OrderAnswerProps) {
  const { value, onChange, disabled, highlight, reveal, seed } = slot;
  // Never the authored order, which is the solved one.
  const initial = useMemo(
    () =>
      seededShuffle(
        exercise.items.map((item) => item.id),
        seed,
      ),
    [exercise.items, seed],
  );
  const order = reveal
    ? exercise.items.map((item) => item.id)
    : (value?.order ?? initial);
  const byId = useMemo(
    () => new Map(exercise.items.map((item) => [item.id, item])),
    [exercise],
  );
  // Item tapped first, waiting for the position to move to.
  const [picked, setPicked] = useState<string | null>(null);
  const sensors = useDragSensors();

  // The starting order is already an answer the child may submit, and
  // "Kiểm tra" stays disabled until the frame holds a non-empty input.
  useEffect(() => {
    if (value === null) onChange({ type: "order", order: initial });
  }, [value, onChange, initial]);

  function move(id: string, toId: string) {
    const next = arrayMove([...order], order.indexOf(id), order.indexOf(toId));
    onChange({ type: "order", order: next });
  }

  function tap(id: string) {
    if (picked === null) setPicked(id);
    else {
      if (picked !== id) move(picked, id);
      setPicked(null);
    }
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    setPicked(null);
    if (over && active.id !== over.id) move(String(active.id), String(over.id));
  }

  return (
    <div className="flex flex-col gap-4" data-reveal={reveal || undefined}>
      <p className="text-caption text-muted-foreground">
        Chạm một thẻ rồi chạm vào chỗ muốn đặt, hoặc kéo thẻ.
      </p>
      <DndContext
        sensors={sensors}
        accessibility={DRAG_ACCESSIBILITY}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={[...order]}
          strategy={verticalListSortingStrategy}
        >
          <ol className="flex flex-col gap-3">
            {order.map((id, index) => {
              const item = byId.get(id);
              if (!item) return null;
              return (
                <SortableRow
                  key={id}
                  item={item}
                  position={index + 1}
                  picked={picked === id}
                  disabled={disabled}
                  reveal={reveal}
                  spec={highlight.get(id)}
                  onTap={() => tap(id)}
                />
              );
            })}
          </ol>
        </SortableContext>
      </DndContext>
    </div>
  );
}

type SortableRowProps = {
  item: Item;
  position: number;
  picked: boolean;
  disabled: boolean;
  reveal: boolean;
  spec: HighlightSpec | undefined;
  onTap: () => void;
};

function SortableRow({
  item,
  position,
  picked,
  disabled,
  reveal,
  spec,
  onTap,
}: SortableRowProps) {
  const {
    setNodeRef,
    setActivatorNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled });
  const reducedMotion = usePrefersReducedMotion();
  const tone = reveal
    ? "border-3 border-correct bg-correct-soft"
    : picked
      ? `border-3 border-primary ${surfaceFor(spec)}`
      : `border-2 border-border ${surfaceFor(spec)}`;

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition: reducedMotion ? undefined : transition,
      }}
      className={`flex items-stretch gap-3 ${isDragging ? "relative z-10" : ""}`}
    >
      <AnswerHighlight spec={spec} className="flex-1">
        <button
          type="button"
          aria-pressed={picked}
          disabled={disabled}
          data-item={item.id}
          onClick={onTap}
          className={`flex min-h-16 w-full items-center gap-3 rounded-lg px-4 py-2 text-left motion-safe:transition-transform motion-safe:active:scale-97 ${tone} ${isDragging ? "shadow-card" : ""}`}
        >
          <span
            aria-hidden
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-caption text-muted-foreground"
          >
            {position}
          </span>
          <ItemContent content={item.content} />
        </button>
      </AnswerHighlight>
      {/* Drag starts only from the grip, so the rest of the page scrolls
          normally under a finger; tapping the card is the non-drag path. */}
      <span
        ref={setActivatorNodeRef}
        {...listeners}
        aria-hidden
        data-drag-handle
        className={`flex w-12 shrink-0 touch-none items-center justify-center rounded-lg text-muted-foreground ${disabled ? "opacity-50" : "cursor-grab"}`}
      >
        <GripVertical className="size-7" />
      </span>
    </li>
  );
}
