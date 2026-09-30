"use client";

import { useMemo } from "react";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { Mode } from "./catalog";
import { DivisionEquation, Sentence } from "./chia-parts";
import { shareResult, shareSteps } from "./share-logic";
import { SharePicture } from "./share-picture";

type ShareProps = { total: number; people: number; mode: Mode };

function Equation({
  total,
  people,
  shown,
}: {
  total: number;
  people: number;
  shown: boolean;
}) {
  const { quotient, remainder } = shareResult(total, people);
  const withRemainder = remainder > 0;
  return (
    <Reveal
      shown={shown}
      placeholder={
        <DivisionEquation
          dividend={total}
          divisor={people}
          quotient={undefined}
          remainder={undefined}
          withRemainder={withRemainder}
        />
      }
    >
      <DivisionEquation
        dividend={total}
        divisor={people}
        quotient={quotient}
        remainder={remainder}
        withRemainder={withRemainder}
      />
    </Reveal>
  );
}

// Items dealt to plates one round at a time, then the leftover set apart.
// "still" shows the finished picture; a hint stops before the result.
export default function Share({ total, people, mode }: ShareProps) {
  const steps = useMemo(
    () => shareSteps(total, people, mode),
    [total, people, mode],
  );
  const name = `Chia ${total} cái cho ${people} bạn, từng vòng một`;

  const draw = (index: number) => {
    const step = steps[index] ?? steps[steps.length - 1];
    if (!step) return null;
    const left = total - step.rounds * people;
    return (
      <div className="flex w-full flex-col items-center gap-2">
        <SharePicture
          people={people}
          perPlate={step.rounds}
          pool={left}
          apart={step.apart}
          poolCapacity={total}
          label={`${name}: mỗi bạn ${step.rounds} cái, ${step.apart ? "dư" : "còn"} ${left} cái`}
        />
        <Sentence>{step.caption}</Sentence>
        <Equation total={total} people={people} shown={step.result} />
      </div>
    );
  };

  if (mode === "still") {
    return <div className="flex w-full justify-center">{draw(0)}</div>;
  }
  return (
    <StepPlayer steps={steps.length} label={name}>
      {draw}
    </StepPlayer>
  );
}
