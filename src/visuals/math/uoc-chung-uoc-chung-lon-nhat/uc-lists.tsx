"use client";

import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import type { Mode } from "@/visuals/shared/formula-rows";
import { Hole, Legend } from "@/visuals/shared/math-parts";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import { commonDivisors, divisors, gcdOf } from "./logic";

// The divisors of each number written out, then the ones they share: the
// picture of "find the common divisors by listing". A shared divisor is
// picked out in teal (with its shape), the greatest one, in every row it
// appears, in amber.

type Tone = "plain" | "common" | "greatest";

const TONES: Readonly<Record<Tone, string>> = {
  plain: "border-border bg-surface text-foreground",
  common: `${CONCEPT_CLASSES.teal.border} bg-concept-teal/15`,
  greatest: `${CONCEPT_CLASSES.amber.border} bg-concept-amber/20`,
};

const MARKS: Readonly<Record<Tone, ConceptColor | undefined>> = {
  plain: undefined,
  common: "teal",
  greatest: "amber",
};

function Chip({ value, tone }: { value: number; tone: Tone }) {
  const mark = MARKS[tone];
  return (
    <span
      aria-hidden
      className={`flex h-14 min-w-11 flex-col items-center justify-center gap-0.5 rounded-lg border-2 px-1 font-heading text-block font-bold tabular-nums ${TONES[tone]}`}
    >
      {value}
      {mark ? (
        <ConceptMark color={mark} className="size-3.5" />
      ) : (
        <span className="size-3.5" />
      )}
    </span>
  );
}

function ChipRow({
  title,
  values,
  tone,
  common,
  best,
}: {
  title: string;
  values: readonly number[];
  tone: Tone;
  // Values drawn as common divisors, the others keep `tone`.
  common?: readonly number[];
  // The one value drawn as the greatest common divisor.
  best?: number;
}) {
  const spoken = `${title}: ${values.join(", ")}`;
  const toneOf = (value: number): Tone => {
    if (value === best) return "greatest";
    return common?.includes(value) ? "common" : tone;
  };
  return (
    <div className="flex w-full flex-col gap-1">
      <p className="font-heading text-body font-bold">{title}</p>
      <div role="img" aria-label={spoken} className="flex flex-wrap gap-1.5">
        {values.map((value) => (
          <Chip key={value} value={value} tone={toneOf(value)} />
        ))}
      </div>
    </div>
  );
}

export function listNumbers(numbers: readonly number[]): string {
  return numbers.join(", ");
}

// What a divisor-list picture draws: the numbers, how it plays (a hint stops
// before the shared divisors) and whether it ends on the greatest one.
export type UcListsSpec = {
  numbers: readonly number[];
  mode: Mode;
  greatest?: boolean;
};

export function UcLists({ spec }: { spec: UcListsSpec }) {
  const { numbers, mode, greatest = false } = spec;
  const hint = mode === "hint";
  const common = commonDivisors(numbers);
  const best = gcdOf(numbers);
  const rows = numbers.length;
  // Steps: one per list, then the shared divisors picked out, then the
  // greatest one.
  const total = rows + 1 + (greatest ? 1 : 0);
  const label = `Các ước của ${numbers.join(", ")} và các ước chung`;
  const draw = (step: number) => {
    const marked = mode === "still" || step >= rows;
    const shownGreatest = greatest && (mode === "still" || step >= rows + 1);
    const lists = (
      <ul className="flex w-full max-w-xl flex-col gap-3">
        {numbers.map((n, i) => (
          <li key={n}>
            <Reveal shown={mode === "still" || step >= i}>
              <ChipRow
                title={`Ư(${n})`}
                values={divisors(n)}
                tone="plain"
                common={marked && !hint ? common : []}
                best={shownGreatest ? best : undefined}
              />
            </Reveal>
          </li>
        ))}
        <li>
          <Reveal
            shown={marked && !hint}
            placeholder={
              <div className="flex flex-col gap-1">
                <p className="font-heading text-body font-bold">{`ƯC(${listNumbers(numbers)})`}</p>
                <Hole />
              </div>
            }
          >
            <ChipRow
              title={`ƯC(${listNumbers(numbers)})`}
              values={common}
              tone="common"
              best={shownGreatest ? best : undefined}
            />
          </Reveal>
        </li>
      </ul>
    );
    return (
      <div className="flex w-full flex-col items-center gap-3">
        {lists}
        <Legend
          items={[
            { color: "teal", name: "Ước chung" },
            ...(greatest
              ? [{ color: "amber" as const, name: "Ước chung lớn nhất" }]
              : []),
          ]}
        />
      </div>
    );
  };
  if (mode === "still") {
    return (
      <figure aria-label={label} className="w-full">
        {draw(total)}
      </figure>
    );
  }
  return (
    <StepPlayer steps={hint ? rows + 1 : total} label={label}>
      {draw}
    </StepPlayer>
  );
}
