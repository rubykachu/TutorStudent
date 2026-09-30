"use client";

import { useMemo } from "react";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { Mode } from "./catalog";
import { DivisionEquation, Sentence } from "./chia-parts";
import { DivisionFigure } from "./division-figure";
import {
  buildFigure,
  type Division,
  divide,
  progressEnd,
  sentenceFor,
  walkEvent,
  walkLength,
} from "./long-division";

type ColDivProps = { dividend: number; divisor: number; mode: Mode };

function figureLabel(division: Division): string {
  return `Đặt tính ${division.dividend} chia ${division.divisor}: số bị chia bên trái, số chia bên phải, thương dưới số chia`;
}

function Result({ division, shown }: { division: Division; shown: boolean }) {
  const withRemainder = division.remainder > 0;
  return (
    <Reveal
      shown={shown}
      placeholder={
        <DivisionEquation
          dividend={division.dividend}
          divisor={division.divisor}
          quotient={undefined}
          remainder={undefined}
          withRemainder={withRemainder}
        />
      }
    >
      <DivisionEquation
        dividend={division.dividend}
        divisor={division.divisor}
        quotient={division.quotient}
        remainder={division.remainder}
        withRemainder={withRemainder}
      />
    </Reveal>
  );
}

// "still": the finished calculation, nothing moves.
function Still({ division }: { division: Division }) {
  const figure = buildFigure(division, progressEnd(division));
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <DivisionFigure
        figure={figure}
        label={figureLabel(division)}
        finalRemainderStep={division.steps.length - 1}
      />
      <Result division={division} shown />
    </div>
  );
}

// Walks the calculation: for every quotient digit divide, multiply, subtract
// and bring down, each with its sentence under the figure. A hint stops at the
// divide of the last digit, where its value is still "?".
function Walk({ division, hint }: { division: Division; hint: boolean }) {
  const m = division.steps.length;
  const total = hint ? 1 + 4 * (m - 1) + 1 : walkLength(division);
  return (
    <StepPlayer steps={total} label={figureLabel(division)}>
      {(index) => {
        const event = walkEvent(division, index);
        const figure = buildFigure(division, {
          ...event.progress,
          hideLastQuotient: hint,
        });
        const isEnd = event.phase === "end";
        let text: string;
        if (event.phase === "start") {
          text = `Chia ${division.dividend} cho ${division.divisor} từng chữ số một.`;
        } else if (event.phase === "end") {
          text = `Hết chữ số để hạ. Thương là ${division.quotient}, số dư là ${division.remainder}.`;
        } else {
          text = sentenceFor(
            division,
            event.phase,
            event.step,
            hint && event.step === m - 1 && event.phase === "divide",
          );
        }
        return (
          <div className="flex w-full flex-col items-center gap-2">
            <DivisionFigure
              figure={figure}
              label={figureLabel(division)}
              finalRemainderStep={isEnd ? m - 1 : undefined}
            />
            <Sentence>{text}</Sentence>
            <Result division={division} shown={isEnd} />
          </div>
        );
      }}
    </StepPlayer>
  );
}

export default function ColDiv({ dividend, divisor, mode }: ColDivProps) {
  const division = useMemo(
    () => divide(dividend, divisor),
    [dividend, divisor],
  );
  return mode === "still" ? (
    <Still division={division} />
  ) : (
    <Walk division={division} hint={mode === "hint"} />
  );
}
