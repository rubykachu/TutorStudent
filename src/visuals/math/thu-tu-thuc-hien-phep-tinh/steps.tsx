"use client";

import { X } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import { ExprSvg, NEXT_OPERATION_COLOR, RESULT_COLOR } from "./expr-svg";
import {
  type Calculation,
  expressionLines,
  type Line,
  operationAt,
  type Token,
  tokenText,
} from "./expression";

// An expression worked out one operation at a time: each line rings the
// operation to do next in pink and shows its little sum, and the next line
// carries the result in amber.
//
// - "full": plays through every line to the value;
// - "hint": plays up to the last operation and leaves its result as "?";
// - "still": every line at once, for rule screens and recaps.
export type StepsMode = "full" | "hint" | "still";

const SIGN_GLYPH = { "+": "+", "-": "−", "·": "·", ":": ":" } as const;

export function spokenExpression(tokens: readonly Token[]): string {
  return tokens
    .map((t) => tokenText(t).replace("-", "−").replace("^", " mũ "))
    .join(" ");
}

// "12 − 5 = 7", or "2³ = 2 · 2 · 2 = 8" for a power; the result shows as "?"
// while `hidden`.
function CalcText({
  calc,
  hidden,
}: {
  calc: Calculation;
  hidden: boolean;
}): ReactNode {
  const result = hidden ? "?" : calc.result;
  if (calc.sign === "^") {
    const factors = Array.from({ length: calc.right }, () => calc.left);
    return (
      <>
        {calc.left}
        <sup className="text-[max(0.6em,1rem)]">{calc.right}</sup> ={" "}
        {factors.map((f, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: factors never reorder
          <Fragment key={i}>
            {i > 0 && " · "}
            {f}
          </Fragment>
        ))}{" "}
        = {result}
      </>
    );
  }
  return (
    <>
      {calc.left} {SIGN_GLYPH[calc.sign]} {calc.right} = {result}
    </>
  );
}

function Legend() {
  return (
    <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-caption">
      <li className="flex items-center gap-2">
        <ConceptMark color={NEXT_OPERATION_COLOR} className="size-4" />
        Làm trước
      </li>
      <li className="flex items-center gap-2">
        <ConceptMark color={RESULT_COLOR} className="size-4" />
        Kết quả
      </li>
    </ul>
  );
}

// Text size of a line by how many lines share the picture: long worked
// examples shrink so they still fit above the bottom bar.
const ROWS_SHOWN = 4;

export function lineUnit(lines: number): number {
  if (lines <= 3) return 0.75;
  if (lines === 4) return 0.64;
  if (lines <= 6) return 0.54;
  return 0.46;
}

export function Row({
  line,
  first,
  hideResult = false,
  unit,
  tone = "normal",
}: {
  line: Line;
  first: boolean;
  hideResult?: boolean;
  unit?: number;
  tone?: "normal" | "wrong";
}) {
  const { operation } = line;
  return (
    // The little sum sits beside the line, or under it when the line is wide.
    <div className="flex w-full flex-wrap items-center justify-center gap-x-5">
      <div className="flex min-w-0 max-w-full items-center gap-2">
        <span
          aria-hidden
          className={`font-heading text-title font-bold ${first ? "invisible" : ""}`}
        >
          =
        </span>
        <ExprSvg
          tokens={line.tokens}
          label={spokenExpression(line.tokens)}
          next={operation && { start: operation.start, end: operation.end }}
          resultIndex={line.resultIndex}
          unit={unit}
          tone={tone}
        />
      </div>
      {operation && (
        <p className="flex items-center gap-2 font-heading text-block font-semibold">
          {tone === "wrong" ? (
            <X aria-hidden className="size-4 text-muted-foreground" />
          ) : (
            <ConceptMark color={NEXT_OPERATION_COLOR} className="size-4" />
          )}
          <span>
            <CalcText calc={operation.calculation} hidden={hideResult} />
          </span>
        </p>
      )}
    </div>
  );
}

// Rows that have not come yet keep their place, dimmed, so later steps never
// push earlier ones around.
function Pending() {
  return (
    <p className="text-center font-heading text-title font-bold text-muted-foreground">
      = ?
    </p>
  );
}

export function ExprSteps({
  source,
  mode,
  firstAt,
  legend = true,
  unit: unitOverride,
  tone = "normal",
}: {
  source: string;
  mode: StepsMode;
  // The key to the two colours; off where several examples share one.
  legend?: boolean;
  // Token index of an operation to do first against the rules, to show what
  // a wrong order gives.
  firstAt?: number;
  // Text size of each line, where the picture sits in a smaller box.
  unit?: number;
  // "wrong" greys the working of a mistake.
  tone?: "normal" | "wrong";
}) {
  const all = expressionLines(
    source,
    firstAt === undefined
      ? undefined
      : (tokens) => operationAt(tokens, firstAt),
  );
  const hint = mode === "hint";
  // A hint ends on the line whose operation is the last one.
  const lines = hint ? all.slice(0, -1) : all;
  const label = `Tính ${spokenExpression(all[0]?.tokens ?? [])} từng bước`;
  const unit = unitOverride ?? lineUnit(all.length);

  if (mode === "still") {
    return (
      <figure
        className="flex w-full flex-col items-center gap-2"
        aria-label={label}
      >
        {lines.map((line, i) => (
          <Row
            key={spokenExpression(line.tokens)}
            line={line}
            first={i === 0}
            unit={unit}
            tone={tone}
          />
        ))}
        {legend && <Legend />}
      </figure>
    );
  }

  // A long worked example shows a window of rows that follows the step, so
  // it fits the space a picture gets: the row being worked, the ones just
  // before it and the next one still to come.
  const windowed = lines.length > ROWS_SHOWN;
  const rowUnit = unitOverride ?? lineUnit(Math.min(lines.length, ROWS_SHOWN));
  return (
    <StepPlayer steps={lines.length} label={label}>
      {(step) => {
        const start = windowed
          ? Math.min(
              Math.max(step - (ROWS_SHOWN - 2), 0),
              lines.length - ROWS_SHOWN,
            )
          : 0;
        return (
          <div className="flex w-full flex-col items-center gap-2">
            {lines.slice(start, start + ROWS_SHOWN).map((line, k) => {
              const i = start + k;
              return (
                <Reveal
                  key={spokenExpression(line.tokens)}
                  shown={step >= i}
                  placeholder={<Pending />}
                  className="w-full"
                >
                  <Row
                    line={line}
                    first={i === 0}
                    unit={rowUnit}
                    tone={tone}
                    hideResult={hint && i === lines.length - 1}
                  />
                </Reveal>
              );
            })}
            {legend && <Legend />}
          </div>
        );
      }}
    </StepPlayer>
  );
}
