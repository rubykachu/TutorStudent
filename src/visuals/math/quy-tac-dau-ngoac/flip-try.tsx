"use client";

import { useEffect, useState } from "react";
import type { ConceptColor } from "@/schema/content";
import type { VisualProps, VisualState } from "@/visuals/registry";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import {
  DoneLine,
  isLessonScreen,
  ShownLine,
  useGuidedGoal,
} from "@/visuals/shared/guided-feedback";
import { stateSet } from "@/visuals/shared/markers";
import {
  bracketFree,
  bracketTerms,
  flipKey,
  goalMask,
  type Lead,
  maskState,
  type Piece,
  stateMask,
} from "./logic";

// A sum written with brackets. The child taps the terms inside the brackets
// to change their sign, then reads the sum without brackets that the signs
// make. State is { f0, f1, … }, one key per bracketed term in reading order,
// 1 = its sign was changed (see `logic.ts`).
//
// On a lesson screen it is a guided step: "Tiếp" works once exactly the terms
// of the brackets with a minus before them are changed. In an exercise the
// validator decides and the picture never says whether the child is right.

export type FlipTrySpec = {
  label: string;
  pieces: readonly Piece[];
  // The closing line of a lesson screen the child did right.
  done?: string;
};

const POSITIVE: ConceptColor = "lime";
const NEGATIVE: ConceptColor = "pink";
const MINUS = "−";
const PLUS = "+";

const signColor = (value: number): ConceptColor =>
  value < 0 ? NEGATIVE : POSITIVE;
const signChar = (value: number) => (value < 0 ? MINUS : PLUS);

const CHIP =
  "inline-flex min-h-touch min-w-touch items-center justify-center rounded-xl border-2 bg-surface px-3 font-heading text-block font-bold tabular-nums motion-safe:transition-transform motion-safe:active:scale-97 disabled:opacity-60";

function Bracket({ children }: { children: string }) {
  return (
    <span
      aria-hidden
      className="font-heading text-title font-bold text-muted-foreground"
    >
      {children}
    </span>
  );
}

const leadText = (lead: Lead) => (lead === "" ? undefined : lead);

export function FlipTry({
  spec,
  params,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { spec: FlipTrySpec }) {
  const terms = bracketTerms(spec.pieces);
  const size = terms.length;
  const goal = goalMask(spec.pieces);
  const [own, setOwn] = useState<VisualState>(maskState(0, size));
  const state = shownState ?? own;
  const mask = stateMask(state, size);
  const locked = disabled || shownState !== undefined;

  // biome-ignore lint/correctness/useExhaustiveDependencies: report the opening state once, on mount
  useEffect(() => {
    if (shownState === undefined) onStateChange?.(own);
  }, []);

  function change(next: number) {
    const nextState = maskState(next, size);
    setOwn(nextState);
    onStateChange?.(nextState);
  }

  const guided = isLessonScreen(params);
  const met = guided && mask === goal;
  const { shown } = useGuidedGoal({
    met,
    guided,
    reveal: () => change(goal),
  });

  const result = bracketFree(spec.pieces, mask);
  const changed = terms.filter((_, i) => (mask >> i) & 1).length;
  // Index of the first bracketed term of each piece.
  const starts: number[] = [];
  spec.pieces.reduce((count, piece) => {
    starts.push(count);
    return count + (piece.kind === "group" ? piece.terms.length : 0);
  }, 0);

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <fieldset
        aria-label={spec.label}
        className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2"
      >
        {spec.pieces.map((piece, p) => {
          if (piece.kind === "term") {
            return (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: pieces never reorder
                key={p}
                className="font-heading text-block font-bold tabular-nums"
              >
                {p === 0
                  ? piece.value < 0
                    ? `${MINUS}${-piece.value}`
                    : piece.value
                  : `${signChar(piece.value)} ${Math.abs(piece.value)}`}
              </span>
            );
          }
          const lead = leadText(piece.lead);
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: pieces never reorder
            <span key={p} className="flex flex-wrap items-center gap-1">
              {lead && (
                <span className="font-heading text-block font-bold">
                  {lead === "-" ? MINUS : PLUS}
                </span>
              )}
              <Bracket>(</Bracket>
              {piece.terms.map((value, t) => {
                const index = (starts[p] ?? 0) + t;
                const flipped = ((mask >> index) & 1) === 1;
                const shownValue = flipped ? -value : value;
                const color = signColor(shownValue);
                return (
                  <button
                    // biome-ignore lint/suspicious/noArrayIndexKey: terms never reorder
                    key={t}
                    type="button"
                    className={`${CHIP} ${CONCEPT_CLASSES[color].border} ${CONCEPT_CLASSES[color].text}`}
                    aria-pressed={flipped}
                    aria-label={`Số hạng ${signChar(shownValue)}${Math.abs(value)}, chạm để đổi dấu`}
                    disabled={locked}
                    onClick={() => change(mask ^ (1 << index))}
                    {...stateSet(flipKey(index), flipped ? 0 : 1)}
                  >
                    {signChar(shownValue)}
                    {Math.abs(value)}
                  </button>
                );
              })}
              <Bracket>)</Bracket>
            </span>
          );
        })}
      </fieldset>
      <div className="flex w-full flex-col items-center gap-1 rounded-xl bg-muted px-3 py-2">
        <p className="text-caption text-muted-foreground">
          Tổng khi bỏ ngoặc theo các dấu bạn chọn
        </p>
        <output
          aria-live="polite"
          className="flex flex-wrap items-center justify-center gap-x-3 font-heading text-block font-bold tabular-nums"
        >
          {result.map((value, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: terms never reorder
              key={i}
              className={CONCEPT_CLASSES[signColor(value)].text}
            >
              {i === 0 && value > 0
                ? value
                : `${signChar(value)}${Math.abs(value)}`}
            </span>
          ))}
        </output>
      </div>
      <p
        className="text-center text-caption text-muted-foreground"
        aria-live="polite"
      >
        {changed === 0
          ? "Chưa đổi dấu số hạng nào"
          : `Đã đổi dấu ${changed} số hạng`}
      </p>
      {met && !shown && <DoneLine>{spec.done ?? "Xong rồi!"}</DoneLine>}
      {met && shown && (
        <ShownLine>{spec.done ?? "Các dấu đã đổi đúng."}</ShownLine>
      )}
    </div>
  );
}
