"use client";

import { Fragment } from "react";
import { formatInteger } from "@/lib/number-format";
import { PowerText } from "@/visuals/shared/power-text";
import { StepPlayer } from "@/visuals/shared/step-player";
import { MATH_LINE, Reveal, ZeroTerms } from "./parts";

// A zero digit, as in the exercises: its term is dropped from the sum.
const NUMBER = 6084;
const DIGITS = [...String(NUMBER)].map(Number);
// Exponent of 10 for each column, left to right: thousands … units.
const PLACES = DIGITS.map((_, i) => DIGITS.length - 1 - i);
// Step 0 shows the digits in their columns; each next step names one term;
// the last step writes the whole sum.
const SUM_STEP = DIGITS.length + 1;
// The sum leaves out a place whose digit is 0, as the textbook writes it.
const SUM_TERMS = DIGITS.map((digit, i) => ({
  digit,
  exponent: PLACES[i] ?? 0,
})).filter(({ digit }) => digit !== 0);

function PlaceValue({ exponent }: { exponent: number }) {
  if (exponent === 0) return <span>1</span>;
  if (exponent === 1) return <span className="text-concept-blue">10</span>;
  return <PowerText base={10} exponent={exponent} />;
}

// One term of the sum; the units digit stands alone, as the textbook writes it.
function Term({ digit, exponent }: { digit: number; exponent: number }) {
  if (exponent === 0) return <span>{digit}</span>;
  return (
    <span className="whitespace-nowrap">
      {digit} · <PlaceValue exponent={exponent} />
    </span>
  );
}

export default function TachSo() {
  return (
    <StepPlayer
      steps={SUM_STEP + 1}
      label="Viết 6 084 thành tổng theo luỹ thừa của 10"
    >
      {(step) => (
        <div className="flex w-full flex-col items-center gap-5">
          <div className="grid grid-cols-4 gap-x-2 text-center">
            {PLACES.map((exponent) => (
              <span
                key={`head-${exponent}`}
                className="rounded-t-lg bg-muted px-3 py-1 font-heading text-block font-bold md:text-block-lg"
              >
                <PlaceValue exponent={exponent} />
              </span>
            ))}
            {DIGITS.map((digit, i) => (
              <span
                key={`digit-${PLACES[i]}`}
                className="rounded-b-lg border-2 border-muted py-1 font-heading text-title font-bold md:text-title-lg"
              >
                {digit}
              </span>
            ))}
            {DIGITS.map((digit, i) => (
              <Reveal
                key={`term-${PLACES[i]}`}
                shown={step >= i + 1}
                placeholder={<span>?</span>}
                className="pt-2 font-heading text-body font-bold md:text-body-lg"
              >
                <Term digit={digit} exponent={PLACES[i] ?? 0} />
              </Reveal>
            ))}
          </div>
          <Reveal
            shown={step >= SUM_STEP}
            placeholder={
              <p className={`${MATH_LINE} px-4 py-1`}>
                <span className="whitespace-nowrap">
                  {formatInteger(NUMBER)}
                </span>
                <span>= ?</span>
              </p>
            }
          >
            {/* One size down from the other lines so the sum fits one phone line. */}
            <p className="flex flex-wrap items-baseline justify-center gap-x-2 rounded-lg bg-highlight px-4 py-1 font-heading text-block font-bold md:text-title-lg">
              <span className="whitespace-nowrap">{formatInteger(NUMBER)}</span>
              <span>=</span>
              {SUM_TERMS.map(({ digit, exponent }, i) => (
                <Fragment key={`sum-${exponent}`}>
                  {i > 0 && <span>+</span>}
                  <Term digit={digit} exponent={exponent} />
                </Fragment>
              ))}
            </p>
            <ZeroTerms value={NUMBER} />
          </Reveal>
        </div>
      )}
    </StepPlayer>
  );
}
