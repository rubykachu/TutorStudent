"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import { bagLegend } from "@/visuals/shared/bag-groups";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import type { Mode } from "@/visuals/shared/formula-rows";
import { Hole, Legend, MATH_LINE, Tint } from "@/visuals/shared/math-parts";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import { gcdOf, PIECE_RANGE, stripLengths } from "./logic";

// Strips of ribbon cut into equal pieces: the picture of "a common divisor".
// Every strip is `total` units long, cut into pieces of `d` units; what is
// left over is drawn apart, so the child sees at a glance whether the cut
// fits exactly.

const CELL = 22;
const PAD = 4;
const GAP = 8;
const HEIGHT = CELL + 2 * PAD + 4;
const UNIT = "dm";

function boxWidth(units: number): number {
  return units * CELL + 2 * PAD;
}

// Width of a strip of `total` units once cut into pieces of `d`.
function cutWidth(total: number, d: number): number {
  const pieces = Math.floor(total / d);
  const left = total % d;
  const boxes = pieces + (left > 0 ? 1 : 0);
  return (
    pieces * boxWidth(d) + (left > 0 ? boxWidth(left) : 0) + (boxes - 1) * GAP
  );
}

// The strips' common viewBox width, so every strip is drawn at one scale.
function sceneWidth(totals: readonly number[], d: number): number {
  return Math.max(...totals.map((total) => cutWidth(total, d)));
}

function Dots({
  count,
  x,
  color,
}: {
  count: number;
  x: number;
  color: "blue" | "pink";
}) {
  return Array.from({ length: count }, (_, i) => (
    <ConceptShape
      // biome-ignore lint/suspicious/noArrayIndexKey: dots are placed by position
      key={i}
      color={color}
      cx={x + PAD + i * CELL + CELL / 2}
      cy={HEIGHT / 2}
      r={CELL * 0.34}
    />
  ));
}

// One strip: whole (not cut yet) or cut into pieces with the rest apart.
function Strip({
  total,
  d,
  cut,
  width,
}: {
  total: number;
  d: number;
  cut: boolean;
  width: number;
}) {
  const pieces = Math.floor(total / d);
  const left = total % d;
  const label = cut
    ? `Dải ${total} ${UNIT} cắt thành ${pieces} đoạn ${d} ${UNIT}${left > 0 ? `, còn thừa ${left} ${UNIT}` : ", không thừa"}`
    : `Dải ${total} ${UNIT}, chưa cắt`;
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${width} ${HEIGHT}`}
      className="h-auto w-full"
    >
      {cut ? (
        <>
          {Array.from({ length: pieces }, (_, i) => {
            const x = i * (boxWidth(d) + GAP);
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: pieces are placed by position
              <g key={i}>
                <rect
                  x={x + 1}
                  y={1}
                  width={boxWidth(d) - 2}
                  height={HEIGHT - 2}
                  rx={8}
                  className="fill-surface stroke-concept-violet"
                  strokeWidth={2}
                />
                <Dots count={d} x={x} color="blue" />
              </g>
            );
          })}
          {left > 0 && (
            <g>
              <rect
                x={pieces * (boxWidth(d) + GAP) + 1}
                y={1}
                width={boxWidth(left) - 2}
                height={HEIGHT - 2}
                rx={8}
                className="fill-surface stroke-concept-pink"
                strokeWidth={2}
                strokeDasharray="5 4"
              />
              <Dots
                count={left}
                x={pieces * (boxWidth(d) + GAP)}
                color="pink"
              />
            </g>
          )}
        </>
      ) : (
        <g>
          <rect
            x={1}
            y={1}
            width={boxWidth(total) - 2}
            height={HEIGHT - 2}
            rx={8}
            className="fill-surface stroke-muted-foreground"
            strokeWidth={2}
          />
          <Dots count={total} x={0} color="blue" />
        </g>
      )}
    </svg>
  );
}

function names(numbers: readonly number[]): string {
  if (numbers.length <= 1) return numbers.join("");
  return `${numbers.slice(0, -1).join(", ")} và ${numbers[numbers.length - 1]}`;
}

// A strip with its length above and what the cut gave below.
function StripRow({
  total,
  d,
  cut,
  width,
}: {
  total: number;
  d: number;
  cut: boolean;
  width: number;
}) {
  const pieces = Math.floor(total / d);
  const left = total % d;
  return (
    <li className="flex w-full flex-col gap-1">
      <p className="text-caption text-muted-foreground">{`Dải ${total} ${UNIT}`}</p>
      <Strip total={total} d={d} cut={cut} width={width} />
      <p className="min-h-6 text-caption" aria-live="polite">
        {cut &&
          (left === 0 ? (
            <span className="text-correct">{`${pieces} đoạn, không thừa`}</span>
          ) : (
            <Tint color="pink">{`${pieces} đoạn, còn thừa ${left} ${UNIT}`}</Tint>
          ))}
      </p>
    </li>
  );
}

// The line that says whether `d` is a common divisor of the strip lengths.
function Verdict({ totals, d }: { totals: readonly number[]; d: number }) {
  const fits = totals.every((total) => total % d === 0);
  return (
    <p className={MATH_LINE}>
      {fits ? (
        <>
          <Tint color="teal">{d}</Tint>
          {` là ước chung của ${names(totals)}`}
        </>
      ) : (
        `${d} không là ước chung của ${names(totals)}`
      )}
    </p>
  );
}

function Strips({
  totals,
  d,
  cutCount,
}: {
  totals: readonly number[];
  d: number;
  cutCount: number;
}) {
  const width = sceneWidth(totals, d);
  return (
    <ul className="flex w-full max-w-xl flex-col gap-2">
      {totals.map((total, i) => (
        <StripRow
          key={total}
          total={total}
          d={d}
          cut={i < cutCount}
          width={width}
        />
      ))}
    </ul>
  );
}

// What a strip picture draws: the strip lengths, the piece length and how it
// plays (see `Mode`; a hint stops before the verdict).
export type CutBarsSpec = {
  totals: readonly number[];
  d: number;
  mode: Mode;
};

// The strips are cut one at a time, then the verdict follows. In "still" the
// finished cut is drawn at once.
export function CutBars({ spec }: { spec: CutBarsSpec }) {
  const { totals, d, mode } = spec;
  const hint = mode === "hint";
  const label = `Cắt các dải ${names(totals)} ${UNIT} thành các đoạn ${d} ${UNIT}`;
  const draw = (step: number) => {
    const cutCount = mode === "still" ? totals.length : step;
    const done = mode === "still" || step >= totals.length;
    return (
      <div className="flex w-full flex-col items-center gap-3">
        <Strips totals={totals} d={d} cutCount={cutCount} />
        <div className="min-h-[3.25rem]" aria-live="polite">
          <Reveal shown={done && !hint} placeholder={<Hole />}>
            <Verdict totals={totals} d={d} />
          </Reveal>
        </div>
        <Legend
          items={bagLegend(
            "đoạn",
            totals.some((t) => t % d > 0),
          )}
        />
      </div>
    );
  };
  if (mode === "still") {
    return (
      <figure aria-label={label} className="w-full">
        {draw(totals.length)}
      </figure>
    );
  }
  return (
    <StepPlayer steps={totals.length + 1} label={label}>
      {draw}
    </StepPlayer>
  );
}

// Strips whose piece length the child changes with − and +. Reports { d }.
// `goal` (lesson screen) reads the state back as progress and ends on a
// closing line once the cut fits (`fits`) or is the longest that fits
// (`largest`); without it (an exercise) the strip lengths come from the
// task's params and nothing is revealed.
export function CutTry({
  totals: fixedTotals,
  goal,
  params,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & {
  totals: readonly number[];
  goal?: "fits" | "largest";
}) {
  const fromParams = params === undefined ? [] : stripLengths(params);
  const totals = fromParams.length > 0 ? fromParams : fixedTotals;
  const [own, setOwn] = useState<number>(PIECE_RANGE.min);
  const [tried, setTried] = useState<readonly number[]>([PIECE_RANGE.min]);
  const d = shownState?.d ?? own;
  const locked = disabled || shownState !== undefined;
  const fits = totals.every((total) => total % d === 0);
  const best = d === gcdOf(totals);
  const finished = goal === "largest" ? fits && best : fits;
  const all = totals.length === 2 ? "cả hai" : "cả ba";

  function change(next: number) {
    setOwn(next);
    setTried((all) => (all.includes(next) ? all : [...all, next]));
    const state: VisualState = { d: next };
    onStateChange?.(state);
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <NumberStepper
        label="Mỗi đoạn dài"
        value={d}
        min={PIECE_RANGE.min}
        max={PIECE_RANGE.max}
        color="violet"
        stateKey="d"
        disabled={locked}
        onChange={change}
      />
      <Strips totals={totals} d={d} cutCount={totals.length} />
      <Verdict totals={totals} d={d} />
      {goal && (
        <p className="text-center text-caption text-muted-foreground">
          {`Đã thử ${tried.length} độ dài`}
        </p>
      )}
      {goal && finished && (
        <p className="flex items-center gap-2 rounded-lg bg-correct-soft px-4 py-2 text-center font-heading text-block font-semibold text-correct-soft-foreground">
          <Check aria-hidden className="size-5" />
          {goal === "largest"
            ? `Xong rồi! ${d} ${UNIT} là đoạn dài nhất cắt vừa hết ${all} dải.`
            : `Xong rồi! Đoạn ${d} ${UNIT} cắt vừa hết ${all} dải.`}
        </p>
      )}
      <Legend items={bagLegend("đoạn", !fits)} />
    </div>
  );
}
