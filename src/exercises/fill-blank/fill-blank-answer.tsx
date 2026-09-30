"use client";

import {
  DndContext,
  type DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { RichText } from "@/components/rich-text";
import { AnswerHighlight, WRONG_TONE } from "@/exercises/answer-highlight";
import { DRAG_ACCESSIBILITY, useDragSensors } from "@/exercises/drag";
import type { AnswerSlotProps } from "@/exercises/exercise-frame";
import type { HighlightSpec } from "@/exercises/feedback";
import { ownValue } from "@/exercises/grade/result";
import type { FillBlankInput } from "@/exercises/input";
import { seededShuffle } from "@/exercises/shuffle";
import { useTapSound } from "@/lib/feedback-sounds";
import type { FillBlankExercise } from "@/schema/content";

type FillBlankAnswerProps = {
  exercise: FillBlankExercise;
  slot: AnswerSlotProps<FillBlankInput>;
};

type Blanks = Readonly<Record<string, string>>;

function revealedBlanks(exercise: FillBlankExercise): Blanks {
  const blanks: Record<string, string> = {};
  for (const segment of exercise.segments) {
    if (segment.type === "blank") blanks[segment.id] = segment.accept[0];
  }
  return blanks;
}

const CHIP_DRAG_PREFIX = "chip:";

// The last word before a blank, with an operator or punctuation just before
// it ("2 · " in "5 247 = 5 · 10³ + 2 · ▢"), is kept on the blank's line:
// a line ending in "2 ·" with the blank alone below reads as two sentences.
// Punctuation right after a blank (the full stop, a comma) stays with it too.
const TAIL_BEFORE_BLANK = /(\S+\s+[^\p{L}\p{N}\s]+\s*|\S+\s*)$/u;
const LEAD_AFTER_BLANK = /^[^\p{L}\p{N}\s]+/u;

export function splitAfterBlank(text: string): { lead: string; rest: string } {
  const lead = LEAD_AFTER_BLANK.exec(text)?.[0] ?? "";
  return { lead, rest: text.slice(lead.length) };
}

export function splitBeforeBlank(text: string): { head: string; tail: string } {
  const match = TAIL_BEFORE_BLANK.exec(text);
  if (!match) return { head: text, tail: "" };
  return { head: text.slice(0, match.index), tail: match[0] };
}

export function FillBlankAnswer({ exercise, slot }: FillBlankAnswerProps) {
  const { value, onChange, disabled, highlight, wrong, reveal, seed } = slot;
  const blanks = reveal ? revealedBlanks(exercise) : (value?.blanks ?? {});
  // Bank index of the word tapped first, waiting for a blank to go into.
  const [picked, setPicked] = useState<number | null>(null);
  const sensors = useDragSensors();
  const playTap = useTapSound();
  const { bank } = exercise;
  // Bank indexes in the order the chips are shown; a word may repeat, so two
  // chips with the same word count as looking the same.
  const chipOrder = useMemo(
    () =>
      bank
        ? seededShuffle(
            bank.map((_, index) => index),
            seed,
            { key: (index) => bank[index] },
          )
        : [],
    [bank, seed],
  );

  function setBlank(id: string, text: string) {
    const next = { ...(value?.blanks ?? {}), [id]: text };
    const empty = Object.values(next).every((t) => t.trim() === "");
    onChange(empty ? null : { type: "fillBlank", blanks: next });
  }

  let blankNumber = 0;
  const { segments } = exercise;
  // A text segment between blanks gives its leading punctuation to the blank
  // before it and its last word to the blank after it.
  const partsOf = (index: number) => {
    const segment = segments[index];
    if (segment?.type !== "text") return { lead: "", middle: "", tail: "" };
    const { lead, rest } =
      segments[index - 1]?.type === "blank"
        ? splitAfterBlank(segment.text)
        : { lead: "", rest: segment.text };
    const { head, tail } =
      segments[index + 1]?.type === "blank"
        ? splitBeforeBlank(rest)
        : { head: rest, tail: "" };
    return { lead, middle: head, tail };
  };
  const sentence = segments.map((segment, index) => {
    if (segment.type === "text") {
      const text = partsOf(index).middle;
      return (
        // Segments have no ids; their order is fixed content.
        // biome-ignore lint/suspicious/noArrayIndexKey: static list
        <span key={index}>
          <RichText text={text} />
        </span>
      );
    }
    blankNumber += 1;
    const text = ownValue(blanks, segment.id) ?? "";
    const common = {
      id: segment.id,
      number: blankNumber,
      text,
      spec: highlight.get(segment.id),
      wrong: wrong.has(segment.id),
      disabled,
      reveal,
    };
    const blank = bank ? (
      <BankBlank
        key={segment.id}
        {...common}
        bank={bank}
        onTap={() => {
          playTap();
          if (picked !== null) {
            setBlank(segment.id, bank[picked]);
            setPicked(null);
          } else if (text !== "") {
            setBlank(segment.id, "");
          }
        }}
      />
    ) : (
      <TypedBlank
        key={segment.id}
        {...common}
        onType={(typed) => setBlank(segment.id, typed)}
      />
    );
    const tail = partsOf(index - 1).tail;
    const lead = partsOf(index + 1).lead;
    return (
      <span key={segment.id} className="whitespace-nowrap">
        {tail && <RichText text={tail} />}
        {blank}
        {lead && <RichText text={lead} />}
      </span>
    );
  });

  const body = (
    <p className="text-body leading-14 md:text-body-lg">{sentence}</p>
  );
  if (!bank) {
    return <div data-reveal={reveal || undefined}>{body}</div>;
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over) return;
    const index = Number(String(active.id).slice(CHIP_DRAG_PREFIX.length));
    setBlank(String(over.id), bank?.[index] ?? "");
    setPicked(null);
  }

  return (
    <DndContext
      sensors={sensors}
      accessibility={DRAG_ACCESSIBILITY}
      onDragEnd={onDragEnd}
    >
      <div className="flex flex-col gap-6" data-reveal={reveal || undefined}>
        {body}
        <fieldset
          className="min-w-0 flex flex-wrap gap-3"
          aria-label="Chọn từ rồi chạm vào ô trống"
        >
          {chipOrder.map((index) => (
            <BankChip
              // Bank words may repeat, so the bank index is the identity.
              key={index}
              index={index}
              word={bank[index]}
              picked={picked === index}
              disabled={disabled}
              onTap={() => {
                playTap();
                setPicked(picked === index ? null : index);
              }}
            />
          ))}
        </fieldset>
      </div>
    </DndContext>
  );
}

type BlankProps = {
  id: string;
  number: number;
  text: string;
  spec: HighlightSpec | undefined;
  wrong: boolean;
  disabled: boolean;
  reveal: boolean;
};

function blankTone(text: string, reveal: boolean, wrong: boolean) {
  if (reveal) return "border-2 border-correct bg-correct-soft";
  if (wrong) return WRONG_TONE;
  return text === ""
    ? "border-2 border-dashed border-muted-foreground bg-surface"
    : "border-2 border-primary bg-surface";
}

function BankBlank({
  id,
  number,
  text,
  spec,
  wrong,
  disabled,
  reveal,
  bank,
  onTap,
}: BlankProps & { bank: readonly string[]; onTap: () => void }) {
  const { setNodeRef, isOver } = useDroppable({ id, disabled });
  return (
    <AnswerHighlight spec={spec} className="align-middle">
      <button
        ref={setNodeRef}
        type="button"
        aria-label={`Ô trống ${number}: ${text === "" ? "chưa điền" : text}`}
        disabled={disabled}
        data-blank={id}
        data-wrong={wrong || undefined}
        onClick={onTap}
        // As wide as the widest word of the bank (same padding as a chip), so
        // placing or removing a word never changes the blank's width and the
        // sentence never reflows. Every bank word sits invisibly in the same
        // grid cell as the word shown; the cell takes the widest.
        className={`inline-grid h-12 min-w-20 content-center items-center justify-items-center rounded-sm px-5 font-semibold ${blankTone(text, reveal, wrong)} ${isOver ? "outline-3 outline-primary" : ""}`}
      >
        <span className="col-start-1 row-start-1 whitespace-nowrap">
          {/* An empty blank still holds a (zero-width) character, so the
              button sits on the same baseline filled or not. */}
          {text === "" ? "\u200B" : <RichText text={text} />}
        </span>
        {bank.map((word, index) => (
          <span
            // Bank words may repeat, so the bank index is the identity.
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            key={index}
            aria-hidden
            data-blank-sizer
            className="invisible col-start-1 row-start-1 h-0 overflow-hidden whitespace-nowrap"
          >
            <RichText text={word} />
          </span>
        ))}
      </button>
    </AnswerHighlight>
  );
}

function TypedBlank({
  id,
  number,
  text,
  spec,
  wrong,
  disabled,
  reveal,
  onType,
}: BlankProps & { onType: (text: string) => void }) {
  return (
    <AnswerHighlight spec={spec} className="align-middle">
      <label className="inline-flex items-center gap-1">
        <span className="text-caption text-muted-foreground">({number})</span>
        {/* Raw text with no reformatting, so IME composition (Vietnamese
            Telex/VNI) is never interrupted; grading normalises it later. */}
        <input
          type="text"
          lang="vi"
          aria-label={`Ô trống ${number}`}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="done"
          disabled={disabled}
          data-blank={id}
          data-wrong={wrong || undefined}
          value={text}
          onChange={(event) => onType(event.target.value)}
          className={`h-12 w-36 rounded-sm px-3 text-body md:text-body-lg ${blankTone(text, reveal, wrong)}`}
        />
      </label>
    </AnswerHighlight>
  );
}

function BankChip({
  index,
  word,
  picked,
  disabled,
  onTap,
}: {
  index: number;
  word: string;
  picked: boolean;
  disabled: boolean;
  onTap: () => void;
}) {
  const { setNodeRef, listeners, transform, isDragging } = useDraggable({
    id: `${CHIP_DRAG_PREFIX}${index}`,
    disabled,
  });
  return (
    <button
      ref={setNodeRef}
      type="button"
      {...listeners}
      aria-pressed={picked}
      disabled={disabled}
      data-chip={word}
      onClick={onTap}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={`inline-flex min-h-12 min-w-12 touch-none items-center justify-center rounded-full px-5 font-semibold select-none ${
        // A transition would make the chip lag behind the finger.
        isDragging
          ? "relative z-10 shadow-card"
          : "motion-safe:transition-transform motion-safe:active:scale-97"
      } ${
        picked
          ? "border-3 border-primary bg-primary text-primary-foreground"
          : "border-2 border-border bg-surface"
      }`}
    >
      <RichText text={word} />
    </button>
  );
}
