"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import { Legend, MATH_LINE, Tint } from "@/visuals/shared/math-parts";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import { lcm, multiplesUpTo, ROUND_RANGE } from "./logic";

// Two things that repeat, side by side: the child counts the rounds of each
// (trips of a bus, turns of a gear) and sees the places each one reaches.
// A place both reach is lime; the first one both reach is the least common
// multiple. State is { a, b }, the rounds counted on each side.

// What a "two things that repeat" picture draws: the length of one round of
// each side, who they are, and the words around the numbers. In an exercise
// `params` give the two lengths (p, q), so only the words come from here.
export type MeetTrySpec = {
  numbers: readonly [number, number];
  names: readonly [string, string];
  // What one round is called ("chuyến", "vòng") and what it does ("chạy").
  round: string;
  verb: string;
  // What the places are measured in ("phút", "răng").
  unit: string;
  // Lesson screen: shows progress and a closing line once the first place
  // both reach is found.
  goal?: boolean;
};

// "Xe B" read after a comma is "xe B".
function lowerFirst(text: string): string {
  return text.charAt(0).toLocaleLowerCase("vi") + text.slice(1);
}

function Places({
  values,
  other,
}: {
  values: readonly number[];
  other: readonly number[];
}) {
  return (
    <ul
      aria-label={`Các mốc: ${values.join(", ")}`}
      className="flex flex-wrap gap-1.5"
    >
      {values.map((value) => (
        <li
          key={value}
          className={`flex h-12 min-w-11 items-center justify-center rounded-lg border-2 px-1 font-heading text-block font-bold tabular-nums ${other.includes(value) ? "border-concept-lime bg-concept-lime/15" : "border-border bg-surface"}`}
        >
          {value}
        </li>
      ))}
    </ul>
  );
}

export function MeetTry({
  spec,
  params,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { spec: MeetTrySpec }) {
  const [p, q] = [params?.p ?? spec.numbers[0], params?.q ?? spec.numbers[1]];
  const { names, round, verb, unit, goal = false } = spec;
  const start = { a: ROUND_RANGE.min, b: ROUND_RANGE.min };
  const [own, setOwn] = useState<VisualState>(start);
  const [tried, setTried] = useState(1);
  const a = shownState?.a ?? own.a ?? start.a;
  const b = shownState?.b ?? own.b ?? start.b;
  const locked = disabled || shownState !== undefined;
  const places = [multiplesUpTo(p, p * a), multiplesUpTo(q, q * b)] as const;
  const same = p * a === q * b;
  const first = same && p * a === lcm(p, q);

  // biome-ignore lint/correctness/useExhaustiveDependencies: report the opening state once, on mount
  useEffect(() => {
    if (!goal) onStateChange?.(start);
  }, []);

  function change(key: "a" | "b", value: number) {
    const next = { ...own, a, b, [key]: value };
    setOwn(next);
    setTried((count) => count + 1);
    onStateChange?.(next);
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="grid w-full max-w-xl gap-4 md:grid-cols-2">
        {([0, 1] as const).map((side) => {
          const step = side === 0 ? p : q;
          const count = side === 0 ? a : b;
          const key = side === 0 ? "a" : "b";
          return (
            <section key={key} className="flex flex-col items-center gap-2">
              <NumberStepper
                label={`${names[side]} đã ${verb}`}
                value={count}
                min={ROUND_RANGE.min}
                max={ROUND_RANGE.max}
                stateKey={key}
                disabled={locked}
                onChange={(value) => change(key, value)}
              />
              <p className="text-center text-caption text-muted-foreground">
                {`Mỗi ${round} là ${step} ${unit}`}
              </p>
              <Places values={places[side]} other={places[1 - side]} />
            </section>
          );
        })}
      </div>
      <p className={MATH_LINE} aria-live="polite">
        {same ? (
          <Tint color="lime">{`Cả hai cùng ở ${p * a} ${unit}`}</Tint>
        ) : (
          `${names[0]} ở ${p * a} ${unit}, ${lowerFirst(names[1])} ở ${q * b} ${unit}`
        )}
      </p>
      {goal && (
        <p className="text-center text-caption text-muted-foreground">
          {`Đã thử ${tried} lần`}
        </p>
      )}
      {goal && first && (
        <p className="flex items-center gap-2 rounded-lg bg-correct-soft px-4 py-2 text-center font-heading text-block font-semibold text-correct-soft-foreground">
          <Check aria-hidden className="size-5" />
          {`Xong rồi! Lần đầu cả hai cùng ở ${p * a} ${unit}.`}
        </p>
      )}
      {goal && same && !first && (
        <p className="text-center text-caption text-muted-foreground">
          Cả hai gặp nhau rồi, nhưng chưa phải lần đầu tiên.
        </p>
      )}
      <Legend items={[{ color: "lime", name: "Cả hai cùng ở đó" }]} />
    </div>
  );
}
