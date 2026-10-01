"use client";

import { FormulaRow, Pending, type Row } from "@/visuals/shared/formula-rows";
import { Legend } from "@/visuals/shared/math-parts";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { SpecOf } from "./catalog";
import { digitSum, digitsOf, divisible, sumTex, verdictTex } from "./logic";
import { DigitRow } from "./tiles";

// The digits of a number, their sum, the sum's verdict, then the number's
// own; with divisor 0 only the sum. In a hint the last line stays a dimmed
// "?".
export function DigitSum({ spec }: { spec: SpecOf<"digitSum"> }) {
  const { n, divisor, mode } = spec;
  const digits = digitsOf(n);
  const sum = digitSum(n);
  const hint = mode === "hint";
  const lines: Row[] = [{ tex: sumTex(n, "lime") }];
  if (divisor > 0) {
    lines.push(
      { tex: verdictTex(sum, divisor, "lime") },
      { tex: verdictTex(n, divisor) },
    );
  }
  const label = hint
    ? `Số ${n}: cộng các chữ số${divisor > 0 ? ` để biết có chia hết cho ${divisor} không` : ""}`
    : divisor === 0
      ? `Tổng các chữ số của ${n} là ${sum}`
      : `Tổng các chữ số của ${n} là ${sum}; ${sum} ${divisible(sum, divisor) ? "chia hết" : "không chia hết"} cho ${divisor}, nên ${n} ${divisible(n, divisor) ? "chia hết" : "không chia hết"} cho ${divisor}`;

  const draw = (step: number) => (
    <div className="flex w-full flex-col items-center gap-4">
      <DigitRow digits={digits} label={`Các chữ số: ${digits.join(", ")}`} />
      <ul
        className="flex w-full flex-col items-center gap-3"
        aria-live="polite"
      >
        {lines.map((row, i) => (
          <li key={row.tex} className="w-full">
            <Reveal
              shown={step >= i + 1 && !(hint && i === lines.length - 1)}
              placeholder={<Pending />}
            >
              <FormulaRow row={row} />
            </Reveal>
          </li>
        ))}
      </ul>
      <Legend items={[{ color: "lime", name: "Tổng các chữ số" }]} />
    </div>
  );

  if (mode === "still") {
    return (
      <figure aria-label={label} className="w-full">
        {draw(lines.length)}
      </figure>
    );
  }
  return (
    <StepPlayer steps={hint ? lines.length : lines.length + 1} label={label}>
      {draw}
    </StepPlayer>
  );
}
