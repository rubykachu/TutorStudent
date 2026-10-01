"use client";

import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark, ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";
import { Hole, Tint } from "@/visuals/shared/math-parts";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import { SvgFade } from "./bars";
import type { DigitsSpec } from "./types";

// Two numbers written one digit per box, right-aligned, in groups of three.
// The smaller number is blue and the bigger one violet once the picture has
// decided which is which.

const WIDTH = 340;
const GROUP_GAP = 10;
const MAX_PITCH = 42;
const BOX_INSET = 2;
const HEAD_HEIGHT = 34;
const BOX_HEIGHT = 46;
const ROW_HEIGHT = HEAD_HEIGHT + BOX_HEIGHT;
const ROW_GAP = 26;
const SECOND_ROW = ROW_HEIGHT + ROW_GAP;
const HEIGHT = SECOND_ROW + ROW_HEIGHT + 4;
const BAND_PAD = 4;
const FONT = 19;
const TITLE_FONT = 24;
const DIGIT_FONT = 28;
const MARK_RADIUS = 8;
const TITLE_X = 24;
const DONE_OPACITY = 0.35;
const NARROW_SPACE = " ";

const TINT: Readonly<Partial<Record<ConceptColor, string>>> = {
  blue: "fill-concept-blue/15",
  violet: "fill-concept-violet/15",
};

// "40982" -> "40 982" with a narrow no-break space, as the lesson writes it.
function grouped(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+$)/g, NARROW_SPACE);
}

type Plan = {
  sameLength: boolean;
  // Column (from the left) of the first pair that differs; -1 when none.
  firstDiff: number;
  // Which number is smaller; undefined when they are equal.
  smaller: "a" | "b" | undefined;
};

function planOf(a: string, b: string): Plan {
  const sameLength = a.length === b.length;
  const firstDiff = sameLength ? [...a].findIndex((d, i) => d !== b[i]) : -1;
  const smaller = !sameLength
    ? a.length < b.length
      ? "a"
      : "b"
    : firstDiff < 0
      ? undefined
      : (a[firstDiff] ?? "") < (b[firstDiff] ?? "")
        ? "a"
        : "b";
  return { sameLength, firstDiff, smaller };
}

// Steps of the picture. 0: the numbers with their counts of digits.
// Different counts: 1 the bigger count picked out, 2 the result. Same count:
// 1 … d the equal pairs from the left, one per step; d + 1 the first pair that
// differs; d + 2 the result. A hint stops before the pair that differs (or
// right after the counts when the counts differ).
function lastStep(plan: Plan, hint: boolean): number {
  if (plan.smaller === undefined) return hint ? 0 : 1;
  if (!plan.sameLength) return hint ? 0 : 2;
  return hint ? plan.firstDiff : plan.firstDiff + 2;
}

type Cell = "plain" | "current" | "done" | ConceptColor;

type Layout = { pitch: number; length: number };

function layoutOf(length: number): Layout {
  const groups = Math.floor((length - 1) / 3);
  return {
    length,
    pitch: Math.min(MAX_PITCH, (WIDTH - groups * GROUP_GAP) / length),
  };
}

// Left edge of the box of column `fromLeft` (0 = leftmost of the longer
// number), counted so that equal places of both numbers line up.
function boxX({ pitch, length }: Layout, fromLeft: number): number {
  const fromRight = length - 1 - fromLeft;
  return (
    WIDTH -
    (fromRight + 1) * pitch -
    Math.floor(fromRight / 3) * GROUP_GAP +
    BOX_INSET
  );
}

function Row({
  digits,
  top,
  layout,
  cells,
  titleColor,
  count,
}: {
  digits: string;
  top: number;
  layout: Layout;
  // State of each digit, from the left of this number.
  cells: readonly Cell[];
  titleColor: ConceptColor | undefined;
  count: string;
}) {
  const offset = layout.length - digits.length;
  return (
    <g>
      <text
        x={TITLE_X}
        y={top + HEAD_HEIGHT / 2 - 2}
        dominantBaseline="central"
        fontSize={TITLE_FONT}
        stroke="none"
        className={`font-heading font-bold tabular-nums ${titleColor ? CONCEPT_CLASSES[titleColor].fill : "fill-foreground"}`}
      >
        {grouped(digits)}
      </text>
      {titleColor ? (
        <SvgFade opacity={1}>
          <ConceptShape
            color={titleColor}
            cx={MARK_RADIUS}
            cy={top + HEAD_HEIGHT / 2 - 2}
            r={MARK_RADIUS}
          />
        </SvgFade>
      ) : null}
      <text
        x={WIDTH}
        y={top + HEAD_HEIGHT / 2 - 2}
        textAnchor="end"
        dominantBaseline="central"
        fontSize={FONT}
        stroke="none"
        className="fill-foreground font-heading"
      >
        {count}
      </text>
      {[...digits].map((digit, i) => {
        const cell = cells[i] ?? "plain";
        const colored =
          cell !== "plain" && cell !== "current" && cell !== "done";
        const x = boxX(layout, offset + i);
        const width = layout.pitch - 2 * BOX_INSET;
        return (
          <g
            // biome-ignore lint/suspicious/noArrayIndexKey: digits repeat; the place is the identity
            key={i}
            opacity={cell === "done" ? DONE_OPACITY : 1}
          >
            <rect
              {...decorative}
              x={x}
              y={top + HEAD_HEIGHT}
              width={width}
              height={BOX_HEIGHT}
              rx={8}
              strokeWidth={2}
              className={
                colored
                  ? `${CONCEPT_CLASSES[cell].stroke} ${TINT[cell] ?? "fill-surface"}`
                  : "fill-surface stroke-border"
              }
            />
            <text
              x={x + width / 2}
              y={top + HEAD_HEIGHT + BOX_HEIGHT / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={DIGIT_FONT}
              stroke="none"
              className={`font-heading font-bold tabular-nums ${colored ? CONCEPT_CLASSES[cell].fill : "fill-foreground"}`}
            >
              {digit}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function colorOf(plan: Plan, who: "a" | "b"): ConceptColor | undefined {
  if (plan.smaller === undefined) return undefined;
  return plan.smaller === who ? "blue" : "violet";
}

function Picture({ spec, step }: { spec: DigitsSpec; step: number }) {
  const { a, b } = spec;
  const plan = planOf(a, b);
  const layout = layoutOf(Math.max(a.length, b.length));
  const hint = spec.mode === "hint";
  const { sameLength, firstDiff } = plan;
  const d = firstDiff;
  // Same count: the pair being looked at, the equal pairs already passed,
  // and whether the pair that differs is on screen.
  const scanning = sameLength && d >= 0 && step >= 1 && step <= d;
  const current = scanning ? step - 1 : -1;
  const passed =
    sameLength && d >= 0 ? Math.min(step <= d ? step - 1 : d, d) : 0;
  const diffShown = sameLength && d >= 0 && step >= d + 1 && !hint;
  const countsPicked = !sameLength && step >= 1 && !hint;
  const resultStep = plan.smaller === undefined ? 1 : sameLength ? d + 2 : 2;
  const result = !hint && step >= resultStep;

  const cellsOf = (who: "a" | "b"): Cell[] => {
    const digits = who === "a" ? a : b;
    const colour = colorOf(plan, who);
    return [...digits].map((_, i): Cell => {
      if (countsPicked && colour) return colour;
      if (!sameLength) return "plain";
      if (diffShown && i === d && colour) return colour;
      if (i === current) return "current";
      if (i < passed) return "done";
      return "plain";
    });
  };
  const titled = (who: "a" | "b") =>
    countsPicked || (sameLength && result) ? colorOf(plan, who) : undefined;
  const top = (row: 0 | 1) => (row === 0 ? 0 : SECOND_ROW);

  const bandX = boxX(layout, Math.max(current, 0)) - BOX_INSET;
  const bandWidth = layout.pitch;
  const aSmaller = plan.smaller === "a";
  const smallDigit = (aSmaller ? a : b)[d] ?? "";
  const bigDigit = (aSmaller ? b : a)[d] ?? "";

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <svg
        role="img"
        aria-label={spec.label}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full max-w-sm"
      >
        <SvgFade opacity={scanning ? 1 : 0} backdrop>
          {[0, SECOND_ROW].map((rowTop) => (
            <rect
              {...decorative}
              key={rowTop}
              x={bandX}
              y={rowTop + HEAD_HEIGHT - BAND_PAD}
              width={bandWidth}
              height={BOX_HEIGHT + 2 * BAND_PAD}
              rx={10}
              className="fill-highlight"
            />
          ))}
        </SvgFade>
        <Row
          digits={a}
          top={top(0)}
          layout={layout}
          cells={cellsOf("a")}
          titleColor={titled("a")}
          count={`${a.length} chữ số`}
        />
        <Row
          digits={b}
          top={top(1)}
          layout={layout}
          cells={cellsOf("b")}
          titleColor={titled("b")}
          count={`${b.length} chữ số`}
        />
      </svg>
      <div className="flex w-full flex-col items-center gap-1 text-center font-heading text-body font-bold">
        {hint || plan.smaller === undefined ? null : sameLength ? (
          <Reveal shown={diffShown}>
            <p>
              Cặp đầu tiên khác nhau cho biết số nào lớn hơn:{" "}
              <Tint color="blue">{smallDigit}</Tint> nhỏ hơn{" "}
              <Tint color="violet">{bigDigit}</Tint>
            </p>
          </Reveal>
        ) : (
          <Reveal shown={countsPicked}>
            <p>Nhiều chữ số hơn thì lớn hơn</p>
          </Reveal>
        )}
        <Reveal
          shown={result}
          placeholder={
            hint ? (
              <p>
                <Hole />
              </p>
            ) : undefined
          }
        >
          <p className="flex flex-wrap items-center justify-center gap-x-2">
            {plan.smaller === undefined ? (
              `${grouped(a)} bằng ${grouped(b)}`
            ) : (
              <>
                <ConceptMark
                  color={colorOf(plan, "a") ?? "blue"}
                  className="size-5"
                />
                <Tint color={colorOf(plan, "a") ?? "blue"}>{grouped(a)}</Tint>
                {aSmaller ? "nhỏ hơn" : "lớn hơn"}
                <ConceptMark
                  color={colorOf(plan, "b") ?? "violet"}
                  className="size-5"
                />
                <Tint color={colorOf(plan, "b") ?? "violet"}>{grouped(b)}</Tint>
              </>
            )}
          </p>
        </Reveal>
      </div>
    </div>
  );
}

// Compares two numbers digit by digit. "steps" plays the whole comparison,
// "still" draws it finished and "hint" plays without the verdict: it never
// shows which number is bigger.
export function Digits({ spec }: { spec: DigitsSpec }) {
  const plan = planOf(spec.a, spec.b);
  const hint = spec.mode === "hint";
  if (spec.mode === "still") {
    return <Picture spec={spec} step={lastStep(plan, false)} />;
  }
  const last = lastStep(plan, hint);
  if (last === 0) return <Picture spec={spec} step={0} />;
  return (
    <StepPlayer steps={last + 1} label={spec.label}>
      {(step) => <Picture spec={spec} step={step} />}
    </StepPlayer>
  );
}
