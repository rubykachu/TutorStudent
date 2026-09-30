"use client";

import { useState } from "react";
import type { ConceptColor } from "@/schema/content";
import type { VisualProps } from "@/visuals/registry";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import { type ColumnModel, columnModel } from "./column-validators";
import { formatNumber, type Op, type StepsMode } from "./types";

// Written column calculation ("đặt tính"): digits aligned by place value,
// units at the right, the sign at the left of the second number.

const PALETTE: Readonly<
  Record<
    Op,
    {
      a: ConceptColor;
      b: ConceptColor;
      result: ConceptColor;
      legend: readonly { color: ConceptColor; name: string }[];
    }
  >
> = {
  add: {
    a: "blue",
    b: "blue",
    result: "amber",
    legend: [
      { color: "blue", name: "Số hạng" },
      { color: "amber", name: "Tổng" },
    ],
  },
  sub: {
    a: "violet",
    b: "pink",
    result: "teal",
    legend: [
      { color: "violet", name: "Số bị trừ" },
      { color: "pink", name: "Số trừ" },
      { color: "teal", name: "Hiệu" },
    ],
  },
};

const SIGN: Record<Op, string> = { add: "+", sub: "−" };
const CELL_WIDTH: Record<Op, string> = { add: "3.5rem", sub: "4.25rem" };
const SIGN_WIDTH = "2.5rem";
const DIGIT = "font-heading text-title font-bold tabular-nums";

type ResultCell =
  | { kind: "digit"; digit: number }
  | { kind: "pending" }
  | { kind: "blank" };

// What one place value shows right now.
type GridColumn = {
  place: number;
  a: number | null;
  b: number | null;
  // Add: the small "1" badge above this place.
  carry: boolean;
  // Sub: the top digit after lending or borrowing, drawn above the crossed
  // original; null while the top digit stands as it is.
  reduced: number | null;
  // Sub: chip above the reduced top digit: "+10" for a place that only
  // borrows, "−1 +10" for one that also lent a ten to the place on its right.
  chip: string | null;
  result: ResultCell;
  working: boolean;
};

type Edge = "top" | "middle" | "bottom";

function cellClass(working: boolean, edge: Edge): string {
  const edges =
    edge === "top"
      ? "rounded-t-lg border-t-2"
      : edge === "bottom"
        ? "rounded-b-lg border-b-2"
        : "";
  const tone = working ? "border-primary bg-primary/10" : "border-transparent";
  return `flex items-center justify-center border-x-2 ${edges} ${tone}`;
}

// Neutral like the borrow chips: the carry is a helper, not a concept of the
// lesson, so it never shares a colour or shape with "Tổng".
function CarryBadge() {
  return (
    <span className="rounded-md border-2 border-muted-foreground px-1 text-caption font-bold">
      1
    </span>
  );
}

function BorrowMark({
  value,
  chip,
}: {
  value: number | null;
  chip: string | null;
}) {
  return (
    <span className="inline-flex flex-col items-center text-body font-bold leading-tight tabular-nums">
      {chip !== null && (
        <span className="whitespace-nowrap rounded-md border-2 border-muted-foreground px-1 text-caption">
          {chip}
        </span>
      )}
      {value === null ? null : formatNumber(value)}
    </span>
  );
}

function borrowChip(borrowed: number, lent: number): string | null {
  if (borrowed === 0) return null;
  return lent > 0 ? "−1 +10" : "+10";
}

function ColumnGrid({
  op,
  columns,
  label,
}: {
  op: Op;
  columns: readonly GridColumn[];
  label: string;
}) {
  const palette = PALETTE[op];
  const ordered = [...columns].sort((x, y) => y.place - x.place);
  const template = `${SIGN_WIDTH} repeat(${ordered.length}, ${CELL_WIDTH[op]})`;
  return (
    <div
      role="img"
      aria-label={label}
      className="grid items-center"
      style={{ gridTemplateColumns: template }}
    >
      <span aria-hidden />
      {ordered.map((col) => (
        <div
          key={`top-${col.place}`}
          className={`${op === "sub" ? "h-14" : "h-10"} ${cellClass(col.working, "top")}`}
        >
          <Reveal shown={op === "add" ? col.carry : col.reduced !== null}>
            {op === "add" ? (
              <CarryBadge />
            ) : (
              <BorrowMark value={col.reduced} chip={col.chip} />
            )}
          </Reveal>
        </div>
      ))}
      <span aria-hidden />
      {ordered.map((col) => (
        <div
          key={`a-${col.place}`}
          className={`h-12 ${cellClass(col.working, "middle")}`}
        >
          {col.a !== null && (
            <span
              className={`${DIGIT} ${CONCEPT_CLASSES[palette.a].text} ${
                col.reduced !== null
                  ? `line-through decoration-2 ${CONCEPT_CLASSES[palette.a].decoration}`
                  : ""
              }`}
            >
              {col.a}
            </span>
          )}
        </div>
      ))}
      <span aria-hidden className={`${DIGIT} text-center`}>
        {SIGN[op]}
      </span>
      {ordered.map((col) => (
        <div
          key={`b-${col.place}`}
          className={`h-12 ${cellClass(col.working, "middle")}`}
        >
          {col.b !== null && (
            <span className={`${DIGIT} ${CONCEPT_CLASSES[palette.b].text}`}>
              {col.b}
            </span>
          )}
        </div>
      ))}
      <span aria-hidden />
      {ordered.map((col) => (
        <div
          key={`line-${col.place}`}
          className={`h-2 ${cellClass(col.working, "middle")}`}
        >
          <span aria-hidden className="h-0.5 w-full bg-foreground" />
        </div>
      ))}
      <span aria-hidden />
      {ordered.map((col) => (
        <div
          key={`result-${col.place}`}
          className={`h-12 ${cellClass(col.working, "bottom")}`}
        >
          {col.result.kind !== "blank" && (
            <Reveal
              shown={col.result.kind === "digit"}
              placeholder={
                <span className={`${DIGIT} text-foreground`}>?</span>
              }
            >
              <span
                className={`${DIGIT} ${CONCEPT_CLASSES[palette.result].text}`}
              >
                {col.result.kind === "digit" ? col.result.digit : ""}
              </span>
            </Reveal>
          )}
        </div>
      ))}
    </div>
  );
}

function Legend({ op }: { op: Op }) {
  return (
    <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-caption">
      {PALETTE[op].legend.map((item) => (
        <li key={item.name} className="flex items-center gap-2">
          <ConceptMark color={item.color} className="size-4" />
          {item.name}
        </li>
      ))}
    </ul>
  );
}

function ColumnFigure({
  op,
  columns,
  label,
  caption,
}: {
  op: Op;
  columns: readonly GridColumn[];
  label: string;
  // Short working line under the grid; omitted entirely when undefined.
  caption?: string;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <ColumnGrid op={op} columns={columns} label={label} />
      {caption !== undefined && (
        <p
          className="min-h-8 text-center text-body font-semibold tabular-nums md:text-body-lg"
          aria-live="polite"
        >
          {caption}
        </p>
      )}
      <Legend op={op} />
    </div>
  );
}

function describe(op: Op, a: number, b: number): string {
  return `Đặt tính ${formatNumber(a)} ${op === "add" ? "cộng" : "trừ"} ${formatNumber(b)}`;
}

// Columns at `step` of the player: step 0 has only the numbers set out, step k
// has places 0 to k − 1 worked. With `hideAnswer` the last digit (and the
// leading digit of a final carry) stays "?" on the last step.
function columnsAt(
  model: ColumnModel,
  step: number,
  hideAnswer: boolean,
  highlight: boolean,
): GridColumn[] {
  const { columns, active, lead, op } = model;
  const finalStep = step >= active;
  const hidden = hideAnswer && finalStep;
  const grid: GridColumn[] = columns.map((calc, place) => {
    const worked = place < step;
    const previousWorked = place <= step;
    let result: ResultCell = { kind: "pending" };
    if (place >= active) result = { kind: "blank" };
    else if (worked && !(hidden && place === active - 1)) {
      result = { kind: "digit", digit: calc.digit };
    }
    const carry =
      op === "add" && place >= 1 && columns[place - 1]?.carryOut === 1
        ? place - 1 < step
        : false;
    const reducedNow = op === "sub" && (calc.carryIn > 0 || calc.carryOut > 0);
    const bin = previousWorked ? calc.carryIn : 0;
    const own = worked ? calc.carryOut : 0;
    return {
      place,
      a: calc.a,
      b: calc.b,
      carry,
      reduced:
        reducedNow && (bin > 0 || own > 0)
          ? (calc.a ?? 0) - bin + 10 * own
          : null,
      chip: borrowChip(own, bin),
      result,
      working: highlight && step >= 1 && place === step - 1 && place < active,
    };
  });
  if (lead > 0) {
    grid.push({
      place: columns.length,
      a: null,
      b: null,
      carry: !hidden && columns.length - 1 < step,
      reduced: null,
      chip: null,
      result:
        finalStep && !hidden
          ? { kind: "digit", digit: lead }
          : { kind: "pending" },
      working: false,
    });
  }
  return grid;
}

function captionAt(
  model: ColumnModel,
  step: number,
  hideAnswer: boolean,
): string | undefined {
  if (step === 0) return "Đặt tính";
  const calc = model.columns[step - 1];
  if (!calc || step > model.active) return undefined;
  const hidden = hideAnswer && step === model.active;
  if (calc.expression === null) {
    return `Hạ ${hidden ? "?" : calc.digit}`;
  }
  return `${calc.expression} = ${hidden ? "?" : calc.value}`;
}

type ColumnProps = {
  op: Op;
  a: number;
  b: number;
  mode: StepsMode;
};

// - "full": works the places from the units to the left, one per step;
// - "hint": the same, but the last digit stays "?";
// - "still": the finished calculation with every carry and borrow.
export function Column({ op, a, b, mode }: ColumnProps) {
  const model = columnModel(op, a, b);
  const label = describe(op, a, b);
  const steps = model.active + 1;
  if (mode === "still") {
    return (
      <ColumnFigure
        op={op}
        columns={columnsAt(model, steps - 1, false, false)}
        label={label}
      />
    );
  }
  const hide = mode === "hint";
  return (
    <StepPlayer steps={steps} label={label}>
      {(step) => (
        <ColumnFigure
          op={op}
          columns={columnsAt(model, step, hide, true)}
          label={label}
          caption={captionAt(model, step, hide)}
        />
      )}
    </StepPlayer>
  );
}

type ColumnTryProps = VisualProps & {
  op: Op;
  a: number;
  b: number;
  // 0-based place to work out, counted from the units.
  column: number;
};

const START = { digit: 0, carry: 0 };

// What the child will do with the working place, as a short sum.
function workingSum(op: Op, model: ColumnModel, column: number): string {
  const calc = model.columns[column];
  if (!calc) return "";
  if (op === "add") {
    return [calc.carryIn > 0 ? calc.carryIn : null, calc.a, calc.b]
      .filter((t): t is number => t !== null)
      .join(" + ");
  }
  return `${calc.a ?? 0}${calc.carryIn > 0 ? " − 1" : ""} − ${calc.b ?? 0}`;
}

// Guided practice on one place of a column calculation: the places to its
// right are finished, it takes the digit to write and the carry (add) or
// borrow (sub) the child picks, and the places to its left wait as "?".
export function ColumnTry({
  op,
  a,
  b,
  column,
  onStateChange,
  shownState,
  disabled = false,
}: ColumnTryProps) {
  const [own, setOwn] = useState(START);
  // The working digit stays a dim "?" until the child changes something.
  const [touched, setTouched] = useState(false);
  const digit = shownState?.digit ?? own.digit;
  const carry = shownState?.carry ?? own.carry;
  const locked = disabled || shownState !== undefined;
  const answered = touched || shownState !== undefined;
  const model = columnModel(op, a, b);
  const calc = model.columns[column];
  const palette = PALETTE[op];

  function update(next: { digit: number; carry: number }) {
    setOwn(next);
    setTouched(true);
    onStateChange?.(next);
  }

  // Carry out (add) or borrow taken (sub) of a place: known for the places
  // already finished, the child's pick for the working one.
  function handedOn(place: number): number {
    if (place < column) return model.columns[place]?.carryOut ?? 0;
    return place === column ? carry : 0;
  }

  const columns: GridColumn[] = model.columns.map((c, place) => {
    const working = place === column;
    let result: ResultCell = { kind: "blank" };
    if (place < column) result = { kind: "digit", digit: c.digit };
    else if (working) {
      result = answered ? { kind: "digit", digit } : { kind: "pending" };
    } else if (place < model.active) result = { kind: "pending" };
    const bin = place >= 1 ? handedOn(place - 1) : 0;
    const took = handedOn(place);
    return {
      place,
      a: c.a,
      b: c.b,
      carry: op === "add" && bin > 0,
      reduced:
        op === "sub" && (bin > 0 || took > 0)
          ? (c.a ?? 0) - bin + 10 * took
          : null,
      chip: op === "sub" ? borrowChip(took, bin) : null,
      result,
      working,
    };
  });
  if (op === "add") {
    const last = model.columns.length;
    columns.push({
      place: last,
      a: null,
      b: null,
      carry: handedOn(last - 1) > 0,
      reduced: null,
      chip: null,
      result: model.lead > 0 ? { kind: "pending" } : { kind: "blank" },
      working: false,
    });
  }

  const expected = calc
    ? { digit: calc.digit, carry: calc.carryOut }
    : { digit: 0, carry: 0 };
  const right =
    answered && digit === expected.digit && carry === expected.carry;
  const carryName = op === "add" ? "Số nhớ" : "Số mượn";
  const label = `${describe(op, a, b)}, làm cột thứ ${column + 1} từ phải sang`;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <ColumnGrid op={op} columns={columns} label={label} />
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
        <NumberStepper
          label="Chữ số viết"
          stateKey="digit"
          color={palette.result}
          value={digit}
          min={0}
          max={9}
          disabled={locked}
          onChange={(value) => update({ digit: value, carry })}
        />
        <NumberStepper
          label={carryName}
          stateKey="carry"
          value={carry}
          min={0}
          max={1}
          disabled={locked}
          onChange={(value) => update({ digit, carry: value })}
        />
      </div>
      <p className="text-center text-body font-semibold tabular-nums md:text-body-lg">
        {workingSum(op, model, column)}
      </p>
      <p
        className={`text-center text-caption ${right ? "font-semibold text-foreground" : "text-muted-foreground"}`}
        aria-live="polite"
      >
        {right
          ? "Đúng rồi."
          : op === "add"
            ? "Chọn chữ số viết và số nhớ."
            : "Chọn chữ số viết và số mượn."}
      </p>
      <Legend op={op} />
    </div>
  );
}
