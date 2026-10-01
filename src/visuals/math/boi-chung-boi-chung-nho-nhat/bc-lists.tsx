"use client";

import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import type { Mode } from "@/visuals/shared/formula-rows";
import { Hole, Legend } from "@/visuals/shared/math-parts";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import { commonMultiples, lcmOf, multiplesUpTo } from "./logic";

// The multiples of each number written out, then the ones they share: the
// picture of "find the common multiples by listing". A shared multiple is
// picked out in lime (with its shape), the smallest one, in every row it
// appears, in pink.

type Tone = "plain" | "common" | "least";

const TONES: Readonly<Record<Tone, string>> = {
  plain: "border-border bg-surface text-foreground",
  common: `${CONCEPT_CLASSES.lime.border} bg-concept-lime/15`,
  least: `${CONCEPT_CLASSES.pink.border} bg-concept-pink/20`,
};

const MARKS: Readonly<Record<Tone, ConceptColor | undefined>> = {
  plain: undefined,
  common: "lime",
  least: "pink",
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
  // Values drawn as common multiples, the others keep `tone`.
  common?: readonly number[];
  // The one value drawn as the least common multiple.
  best?: number;
}) {
  const spoken = `${title}: ${values.join(", ")}`;
  const toneOf = (value: number): Tone => {
    if (value === best) return "least";
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

// "6 và 8", "4, 6 và 10": numbers read out in a title.
function spoken(numbers: readonly number[]): string {
  return numbers.length < 2
    ? numbers.join("")
    : `${numbers.slice(0, -1).join(", ")} và ${numbers[numbers.length - 1]}`;
}

// A row of the picture: its title and the length of one round.
export type BcRow = { title: string; step: number };

// What a multiples picture draws: one row per number, how far the lists go,
// how it plays (a hint stops before the shared multiples) and whether it
// ends on the least one. `commonTitle` names the shared row; by default it
// reads "Bội chung của a và b".
export type BcListsSpec = {
  rows: readonly BcRow[];
  upTo: number;
  mode: Mode;
  least?: boolean;
  commonTitle?: string;
};

export function BcLists({ spec }: { spec: BcListsSpec }) {
  const { rows, upTo, mode, least = false } = spec;
  const hint = mode === "hint";
  const steps = rows.map((row) => row.step);
  const common = commonMultiples(steps, upTo);
  const best = lcmOf(steps);
  const commonTitle = spec.commonTitle ?? `Bội chung của ${spoken(steps)}`;
  // Steps: one per list, then the shared multiples picked out, then the
  // least one.
  const total = rows.length + 1 + (least ? 1 : 0);
  const label = `Các bội của ${steps.join(", ")} và các bội chung`;
  const draw = (step: number) => {
    const marked = mode === "still" || step >= rows.length;
    const shownLeast = least && (mode === "still" || step >= rows.length + 1);
    return (
      <div className="flex w-full flex-col items-center gap-3">
        <ul className="flex w-full max-w-xl flex-col gap-3">
          {rows.map((row, i) => (
            <li key={row.title}>
              <Reveal shown={mode === "still" || step >= i}>
                <ChipRow
                  title={row.title}
                  values={multiplesUpTo(row.step, upTo)}
                  tone="plain"
                  common={marked && !hint ? common : []}
                  best={shownLeast ? best : undefined}
                />
              </Reveal>
            </li>
          ))}
          <li>
            <Reveal
              shown={marked && !hint}
              placeholder={
                <div className="flex flex-col gap-1">
                  <p className="font-heading text-body font-bold">
                    {commonTitle}
                  </p>
                  <Hole />
                </div>
              }
            >
              <ChipRow
                title={commonTitle}
                values={common}
                tone="common"
                best={shownLeast ? best : undefined}
              />
            </Reveal>
          </li>
        </ul>
        <Legend
          items={[
            { color: "lime", name: "Bội chung" },
            ...(least
              ? [{ color: "pink" as const, name: "Bội chung nhỏ nhất" }]
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
    <StepPlayer steps={hint ? rows.length + 1 : total} label={label}>
      {draw}
    </StepPlayer>
  );
}
