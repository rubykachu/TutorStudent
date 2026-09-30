"use client";

import { ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { VisualProps } from "@/visuals/registry";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { useVisualTransition } from "@/visuals/shared/motion";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import {
  BAR_FILL,
  DeltaToken,
  EQUATION_LINE,
  NamedMark,
  NumberChip,
  OP_SIGN,
  RoundBadge,
  Swap,
} from "./arrange-parts";
import { shiftRound } from "./pair-validators";
import { formatNumber, type Op, type StepsMode } from "./types";

// Steps of the animated shift: the two numbers, the change moving over them,
// the new line with its result.
const MOVE_STEP = 1;
const RESULT_STEP = 2;
const STEP_COUNT = RESULT_STEP + 1;
// Most the child may move in the practice picture.
const MAX_SHIFT = 9;

// How much each number of an `op` line changes when `delta` is applied:
// a sum keeps its total by giving `delta` from a to b; a difference keeps its
// gap by moving both numbers the same way.
function changes(op: Op, delta: number): { da: number; db: number } {
  return op === "add" ? { da: -delta, db: delta } : { da: delta, db: delta };
}

function outcome(op: Op, a: number, b: number): number {
  return op === "add" ? a + b : a - b;
}

// Two numbers as chips, each under a token saying how it changed; the tokens
// hold their place while `showTokens` is off so nothing jumps.
function AddPicture({
  a,
  b,
  da,
  db,
  showTokens,
}: {
  a: number;
  b: number;
  da: number;
  db: number;
  showTokens: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-end gap-3">
        {[
          { value: a, token: da },
          { value: b, token: db },
        ].map(({ value, token }, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: two fixed slots
            key={i}
            className="flex items-center gap-3"
          >
            {i === 1 && (
              <span
                aria-hidden
                className="self-end pb-2 font-heading text-block font-bold text-muted-foreground"
              >
                +
              </span>
            )}
            <div className="flex flex-col items-center gap-2">
              <Reveal shown={showTokens}>
                <DeltaToken value={token} />
              </Reveal>
              <NumberChip color="blue">
                <Swap value={formatNumber(value)} />
              </NumberChip>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
        <NamedMark color="blue" name="Số hạng" />
        <NamedMark color="amber" name="Tổng" />
      </div>
    </div>
  );
}

// A bar from the common left edge, as long as its share of `max`, headed by
// its concept name, its number and the token of its change.
function BarRow({
  color,
  name,
  value,
  token,
  max,
  showToken,
}: {
  color: "violet" | "pink";
  name: string;
  value: number;
  token: number;
  max: number;
  showToken: boolean;
}) {
  const transition = useVisualTransition();
  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex items-center gap-3">
        <NamedMark color={color} name={name} />
        <span
          className={`font-heading text-block font-bold tabular-nums ${CONCEPT_CLASSES[color].text}`}
        >
          <Swap value={formatNumber(value)} />
        </span>
        <Reveal shown={showToken}>
          <DeltaToken value={token} />
        </Reveal>
      </div>
      <div className="h-8 w-full">
        <motion.div
          initial={false}
          animate={{ scaleX: value / max }}
          transition={transition}
          className={`h-full w-full origin-left rounded-md ${BAR_FILL[color].solid}`}
        />
      </div>
    </div>
  );
}

// The gap between the two bar ends, bracketed and named "Hiệu". It slides
// with the bar ends and keeps its size.
function GapBracket({
  gap,
  offset,
  max,
}: {
  gap: number;
  offset: number;
  max: number;
}) {
  const transition = useVisualTransition();
  return (
    <div className="relative h-16 w-full">
      <motion.div
        initial={false}
        animate={{ x: `${(offset / gap) * 100}%` }}
        transition={transition}
        style={{ width: `${(gap / max) * 100}%` }}
        className={`absolute top-0 left-0 h-3 rounded-b-md border-x-2 border-b-2 ${CONCEPT_CLASSES.teal.border}`}
      >
        <span className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <NamedMark color="teal" name="Hiệu" />
        </span>
      </motion.div>
    </div>
  );
}

function SubPicture({
  a,
  b,
  da,
  db,
  max,
  showTokens,
}: {
  a: number;
  b: number;
  da: number;
  db: number;
  max: number;
  showTokens: boolean;
}) {
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <BarRow
        color="violet"
        name="Số bị trừ"
        value={a}
        token={da}
        max={max}
        showToken={showTokens}
      />
      <BarRow
        color="pink"
        name="Số trừ"
        value={b}
        token={db}
        max={max}
        showToken={showTokens}
      />
      {a > b && <GapBracket gap={a - b} offset={b} max={max} />}
    </div>
  );
}

type ShiftProps = {
  op: Op;
  a: number;
  b: number;
  // Signed. For "add", a gives `delta` to b (a − delta, b + delta), or takes
  // it back when negative. For "sub", both numbers change by `delta`.
  delta: number;
  mode: StepsMode;
};

function describe({ op, a, b, delta }: Omit<ShiftProps, "mode">): string {
  const { da, db } = changes(op, delta);
  const before = `${formatNumber(a)} ${OP_SIGN[op]} ${formatNumber(b)}`;
  const after = `${formatNumber(a + da)} ${OP_SIGN[op]} ${formatNumber(b + db)}`;
  return op === "add"
    ? `Chuyển ${formatNumber(Math.abs(delta))} giữa hai số hạng của ${before}: thành ${after}, tổng không đổi`
    : `Cùng ${delta > 0 ? "thêm" : "bớt"} ${formatNumber(Math.abs(delta))} cho cả hai số của ${before}: thành ${after}, hiệu không đổi`;
}

function ResultLine({
  op,
  a,
  b,
  hidden,
}: {
  op: Op;
  a: number;
  b: number;
  hidden: boolean;
}) {
  const result = outcome(op, a, b);
  return (
    <p className={EQUATION_LINE}>
      <span className={CONCEPT_CLASSES.blue.text}>{formatNumber(a)}</span>
      <span>{OP_SIGN[op]}</span>
      <span className={CONCEPT_CLASSES.blue.text}>{formatNumber(b)}</span>
      <span>=</span>
      <span
        className={
          hidden ? "text-muted-foreground" : CONCEPT_CLASSES.amber.text
        }
      >
        {hidden ? "?" : formatNumber(result)}
      </span>
    </p>
  );
}

function Picture({
  op,
  a,
  b,
  delta,
  moved,
}: Omit<ShiftProps, "mode"> & { moved: boolean }) {
  const { da, db } = changes(op, delta);
  const a2 = a + da;
  const b2 = b + db;
  const shownA = moved ? a2 : a;
  const shownB = moved ? b2 : b;
  if (op === "add") {
    return (
      <AddPicture a={shownA} b={shownB} da={da} db={db} showTokens={moved} />
    );
  }
  return (
    <SubPicture
      a={shownA}
      b={shownB}
      da={da}
      db={db}
      max={Math.max(a, b, a2, b2)}
      showTokens={moved}
    />
  );
}

// A sum or difference changed without changing its result. "add": a gives
// `delta` to b, the total stays. "sub": both numbers move by `delta`, the gap
// (hiệu) stays. 3 steps; "hint" leaves the result as "?", "still" shows the
// line before and after at once.
export function Shift({ op, a, b, delta, mode }: ShiftProps) {
  const label = describe({ op, a, b, delta });
  const { da, db } = changes(op, delta);
  const a2 = a + da;
  const b2 = b + db;

  if (mode === "still") {
    return (
      <figure
        aria-label={label}
        className="flex w-full flex-col items-center gap-3"
      >
        <Picture op={op} a={a} b={b} delta={delta} moved={false} />
        <ArrowDown aria-hidden className="size-5 text-muted-foreground" />
        <Picture op={op} a={a} b={b} delta={delta} moved />
        <ResultLine op={op} a={a2} b={b2} hidden={false} />
      </figure>
    );
  }

  return (
    <StepPlayer steps={STEP_COUNT} label={label}>
      {(step) => (
        <div className="flex w-full flex-col items-center gap-4">
          <Picture
            op={op}
            a={a}
            b={b}
            delta={delta}
            moved={step >= MOVE_STEP}
          />
          <Reveal
            shown={step >= RESULT_STEP}
            placeholder={<p className={EQUATION_LINE}>= ?</p>}
          >
            <ResultLine op={op} a={a2} b={b2} hidden={mode === "hint"} />
          </Reveal>
        </div>
      )}
    </StepPlayer>
  );
}

type ShiftTryProps = VisualProps & {
  a: number;
  b: number;
  // The second number should become a multiple of this (10 or 100).
  unit: number;
};

// The child moves k from the first addend to the second and watches the
// total stay while the second becomes round. Reports { k }.
export function ShiftTry({
  a,
  b,
  unit,
  onStateChange,
  shownState,
  disabled = false,
}: ShiftTryProps) {
  const [own, setOwn] = useState(0);
  const k = shownState?.k ?? own;
  const locked = disabled || shownState !== undefined;
  const round = shiftRound({ k }, { a, b, unit });

  function update(value: number) {
    setOwn(value);
    onStateChange?.({ k: value });
  }

  return (
    <figure
      aria-label={`Chuyển ${k} từ ${formatNumber(a)} sang ${formatNumber(b)}`}
      className="flex w-full flex-col items-center gap-4"
    >
      <NumberStepper
        label="Số chuyển"
        stateKey="k"
        value={k}
        min={0}
        max={Math.min(MAX_SHIFT, a - 1)}
        disabled={locked}
        onChange={update}
      />
      <AddPicture a={a - k} b={b + k} da={-k} db={k} showTokens={k > 0} />
      <ResultLine op="add" a={a - k} b={b + k} hidden={false} />
      <div
        className="flex min-h-24 flex-col items-center justify-center gap-2"
        aria-live="polite"
      >
        <RoundBadge round={round} unit={unit} />
        {round && (
          <p className="text-body font-semibold text-correct md:text-body-lg">
            Đúng rồi.
          </p>
        )}
      </div>
    </figure>
  );
}
