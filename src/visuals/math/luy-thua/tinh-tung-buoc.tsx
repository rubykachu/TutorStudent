"use client";

import { formatInteger } from "@/lib/number-format";
import { PowerText } from "@/visuals/shared/power-text";
import { StepPlayer } from "@/visuals/shared/step-player";
import { FactorRow, MATH_LINE, Reveal } from "./parts";

// Computing a power one multiplication at a time, for a child who still
// slips on multiplication tables: multiply the first two factors, then keep
// multiplying the result by the base.
//
// "solution" walks every multiplication to the value; "hint" (second wrong
// answer) shows the first multiplication and the next one still open, so it
// never gives the final value away.
export type Mode = "hint" | "solution";

type Line = { left: bigint; right: bigint | undefined };

function linesOf(base: number, exponent: number, mode: Mode): Line[] {
  const lines: Line[] = [];
  let value = BigInt(base);
  for (let k = 2; k <= exponent; k++) {
    const next = value * BigInt(base);
    lines.push({ left: value, right: next });
    value = next;
  }
  if (mode === "solution") return lines;
  // The hint shows at most the first multiplication done and leaves the next
  // one open; a square has only one multiplication, which stays open.
  const shown = lines.slice(0, 2);
  const last = shown.at(-1);
  return last
    ? [...shown.slice(0, -1), { left: last.left, right: undefined }]
    : shown;
}

const CELL = "text-right tabular-nums";

// A multiplication still to come: which factor it uses is known, the two
// numbers are not yet.
function PendingLine({ base }: { base: number }) {
  return (
    <>
      <span className={CELL}>?</span>
      <span>·</span>
      <span className="text-concept-blue">{base}</span>
      <span>=</span>
      <span className="justify-self-start">?</span>
    </>
  );
}

export function RepeatedProduct({
  base,
  exponent,
  mode,
}: {
  base: number;
  exponent: number;
  mode: Mode;
}) {
  const lines = linesOf(base, exponent, mode);
  const value = BigInt(base) ** BigInt(exponent);
  // Step 0 shows the factors; each later step adds one line; the solution
  // ends on the value of the power.
  const steps = 1 + lines.length + (mode === "solution" ? 1 : 0);
  return (
    <StepPlayer steps={steps} label={`Tính ${base} mũ ${exponent} từng bước`}>
      {(step) => (
        <div className="flex w-full flex-col items-center gap-4">
          <p className={MATH_LINE}>
            <PowerText base={base} exponent={exponent} />
            <span>=</span>
            <FactorRow base={base} count={exponent} />
          </p>
          <div className="grid grid-cols-[repeat(5,auto)] items-baseline gap-x-2 gap-y-2 font-heading text-block font-bold md:text-block-lg">
            {lines.map((line, i) => (
              <Reveal
                key={String(line.left)}
                shown={step >= i + 1}
                placeholder={<PendingLine base={base} />}
                className="col-span-5 grid grid-cols-subgrid"
              >
                <span className={CELL}>{formatInteger(line.left)}</span>
                <span>·</span>
                <span className="text-concept-blue">{base}</span>
                <span>=</span>
                {line.right === undefined ? (
                  // An empty box to fill, so the open step reads as a question.
                  <span className="justify-self-start rounded-md border-2 border-muted-foreground border-dashed px-3 text-muted-foreground">
                    ?
                  </span>
                ) : (
                  <span className={CELL}>{formatInteger(line.right)}</span>
                )}
              </Reveal>
            ))}
          </div>
          {mode === "solution" && (
            <Reveal
              shown={step >= steps - 1}
              placeholder={
                <p className={`${MATH_LINE} px-4 py-1`}>
                  <PowerText base={base} exponent={exponent} />
                  <span>=</span>
                  <span>?</span>
                </p>
              }
            >
              <p className={`${MATH_LINE} rounded-lg bg-highlight px-4 py-1`}>
                <PowerText base={base} exponent={exponent} />
                <span>=</span>
                <span>{formatInteger(value)}</span>
              </p>
            </Reveal>
          )}
        </div>
      )}
    </StepPlayer>
  );
}
