"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import { MATH_LINE } from "@/visuals/shared/math-parts";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import {
  DIGIT_RANGE,
  fittingDigits,
  listDivisors,
  paramDivisors,
} from "./logic";
import { DigitTile } from "./tiles";

type DigitBoxProps = VisualProps & {
  before: string;
  after: string;
  divisors: readonly number[];
  goal: boolean;
};

const toDigits = (text: string) => [...text].map(Number);

// A number with one digit left open: the child picks the digit with − and +.
// Reports { d }. With `goal` on a lesson screen it also shows whether the
// number divides, how many fitting digits were found and a closing line. In
// an exercise (`params` present) the task's own numbers replace the spec's
// and nothing is revealed: a verdict or a count would give the answer away.
export function DigitBox({
  before: specBefore,
  after: specAfter,
  divisors: specDivisors,
  goal,
  params,
  onStateChange,
  shownState,
  disabled = false,
}: DigitBoxProps) {
  const [own, setOwn] = useState<number>(DIGIT_RANGE.min);
  const [tried, setTried] = useState<readonly number[]>([DIGIT_RANGE.min]);
  const digit = shownState?.d ?? own;
  const locked = disabled || shownState !== undefined;

  const afterLen = params ? (params.afterLen ?? 0) : specAfter.length;
  const beforeNum = params ? (params.before ?? 0) : Number(specBefore || 0);
  const afterNum = params ? (params.after ?? 0) : Number(specAfter || 0);
  const before = params ? (beforeNum > 0 ? String(beforeNum) : "") : specBefore;
  const after = params
    ? afterLen > 0
      ? String(afterNum).padStart(afterLen, "0")
      : ""
    : specAfter;
  const divisors = params ? paramDivisors(params) : specDivisors;

  const fitting = fittingDigits(beforeNum, afterNum, afterLen, divisors);
  const found = fitting.filter((d) => tried.includes(d)).length;
  const fits = fitting.includes(digit);
  const showCheck = goal && params === undefined;
  const who = divisors.length > 1 ? "cả " : "";

  function change(next: number) {
    setOwn(next);
    setTried((all) => (all.includes(next) ? all : [...all, next]));
    const state: VisualState = { d: next };
    onStateChange?.(state);
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        role="img"
        aria-label={`Số ${before}${digit}${after}, chữ số ở ô trống là ${digit}`}
        className="flex flex-wrap justify-center gap-1.5"
      >
        {toDigits(before).map((d, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: digits are placed by position
          <DigitTile key={`b${i}`} digit={d} />
        ))}
        <DigitTile digit={digit} tone="box" />
        {toDigits(after).map((d, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: digits are placed by position
          <DigitTile key={`a${i}`} digit={d} />
        ))}
      </div>
      <NumberStepper
        label="Chữ số ở ô trống"
        value={digit}
        min={DIGIT_RANGE.min}
        max={DIGIT_RANGE.max}
        color="teal"
        stateKey="d"
        disabled={locked}
        onChange={change}
      />
      {showCheck && (
        <p className={MATH_LINE} aria-live="polite">
          {`${fits ? "" : "không "}chia hết cho ${who}${listDivisors(divisors)}`}
        </p>
      )}
      {showCheck && fitting.length > 0 && (
        <p className="text-center text-caption text-muted-foreground">
          {`Đã tìm ${found}/${fitting.length} chữ số`}
        </p>
      )}
      {showCheck && fitting.length > 0 && found === fitting.length && (
        <p className="flex items-center gap-2 rounded-lg bg-correct-soft px-4 py-2 text-center font-heading text-block font-semibold text-correct-soft-foreground">
          <Check aria-hidden className="size-5" />
          Bạn đã tìm đủ các chữ số.
        </p>
      )}
    </div>
  );
}
