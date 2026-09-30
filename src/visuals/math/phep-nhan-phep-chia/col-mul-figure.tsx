import type { CSSProperties } from "react";
import { formatInteger } from "@/lib/number-format";
import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";
import { carryRows, cellId, type Plan } from "./col-mul-digits";

// Concepts of the lesson as column multiplication paints them: the factors
// a and b are blue, every product row amber, and the carries teal, the one
// colour of the picture that is not a lesson concept.
export const FACTOR_COLOR: ConceptColor = "blue";
export const PRODUCT_COLOR: ConceptColor = "amber";
export const CARRY_COLOR: ConceptColor = "teal";

type Metrics = {
  column: number;
  row: number;
  carryRow: number;
  digit: number;
  carry: number;
  pad: number;
  // Widest the picture grows on a phone and on a wide screen, per viewBox unit.
  phoneScale: number;
  wideScale: number;
};

const NORMAL: Metrics = {
  column: 44,
  row: 50,
  carryRow: 30,
  digit: 32,
  carry: 20,
  pad: 6,
  phoneScale: 0.85,
  wideScale: 0.9,
};
// Two pictures side by side (the mistakes screen).
const COMPACT: Metrics = {
  column: 40,
  row: 46,
  carryRow: 28,
  digit: 28,
  carry: 20,
  pad: 6,
  phoneScale: 1,
  wideScale: 1.1,
};

type Box = { x: number; y: number; w: number; h: number };

export type FigureProps = {
  plan: Plan;
  // Product cells and carries that are written. A product cell left out shows
  // as a dim "?"; a carry left out is not drawn.
  shown: ReadonlySet<string>;
  // Cells in play, on the highlight fill.
  lit?: ReadonlySet<string>;
  // Cells ringed in the orange dashed "try again" ring.
  ringed?: ReadonlySet<string>;
  // Text that replaces a cell's own digit, for a picture of a mistake.
  override?: ReadonlyMap<string, string>;
  // Every digit in the foreground colour, when no legend explains the colours.
  mono?: boolean;
  compact?: boolean;
  label: string;
};

const NO_IDS: ReadonlySet<string> = new Set();
const DIGIT = "font-bold tabular-nums";
const NO_OVERRIDE: ReadonlyMap<string, string> = new Map();

type Layout = {
  boxes: Map<string, Box>;
  lines: { y: number }[];
  signBox: Box;
  width: number;
  height: number;
};

// Every part sits in a grid: column 0 is the ones place, the sign takes the
// column left of the widest row. Rows from the top: carries (last digit of b
// first), a, b, line, partial products, line and sum for two digits of b.
function layoutOf(plan: Plan, m: Metrics): Layout {
  const { columns } = plan;
  const boxes = new Map<string, Box>();
  const colX = (column: number) => m.pad + (columns - column) * m.column;
  const box = (column: number, y: number, h: number): Box => ({
    x: colX(column),
    y,
    w: m.column,
    h,
  });
  const rowsWithCarry = carryRows(plan).sort((p, q) => q - p);
  let y = m.pad;
  for (const row of rowsWithCarry) {
    for (const step of plan.steps) {
      if (step.kind === "partial" && step.row === row && step.carryOut > 0) {
        boxes.set(
          cellId.carry(row, step.column + 1),
          box(step.column + 1, y, m.carryRow),
        );
      }
    }
    y += m.carryRow;
  }
  plan.aDigits.forEach((_, column) => {
    boxes.set(cellId.a(column), box(column, y, m.row));
  });
  y += m.row;
  plan.bDigits.forEach((_, row) => {
    boxes.set(cellId.b(row), box(row, y, m.row));
  });
  const signBox = box(columns, y, m.row);
  y += m.row;
  const lines = [{ y: y + 3 }];
  y += 6;
  for (const step of plan.steps) {
    if (step.kind !== "partial") continue;
    for (const cell of step.cells) {
      boxes.set(
        cellId.partial(step.row, cell.column),
        box(cell.column, y + step.row * m.row, m.row),
      );
    }
  }
  plan.bDigits.forEach((_, row) => {
    for (let column = 0; column < row; column++) {
      boxes.set(cellId.shift(row, column), box(column, y + row * m.row, m.row));
    }
  });
  y += plan.bDigits.length * m.row;
  if (plan.bDigits.length > 1) {
    lines.push({ y: y + 3 });
    y += 6;
    for (const step of plan.steps) {
      if (step.kind !== "sum") continue;
      for (const cell of step.cells) {
        boxes.set(cellId.sum(cell.column), box(cell.column, y, m.row));
      }
    }
    y += m.row;
  }
  return {
    boxes,
    lines,
    signBox,
    width: m.pad * 2 + (columns + 1) * m.column,
    height: y + m.pad,
  };
}

const centre = (b: Box) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });

function CellRing({ box, kind }: { box: Box; kind: "lit" | "wrong" }) {
  return (
    <rect
      {...decorative}
      x={box.x + 2}
      y={box.y + 2}
      width={box.w - 4}
      height={box.h - 4}
      rx={8}
      className={
        kind === "lit" ? "fill-highlight" : "fill-retry-soft stroke-retry"
      }
      strokeWidth={kind === "wrong" ? 2.5 : undefined}
      strokeDasharray={kind === "wrong" ? "5 4" : undefined}
    />
  );
}

// Column multiplication as written on paper: a over b with the "·" sign and
// a line, carries small above a, partial products, and for a two-digit b the
// second partial product shifted one column with its ones place a dim 0, a
// line and the sum.
export function ColMulFigure({
  plan,
  shown,
  lit = NO_IDS,
  ringed = NO_IDS,
  override = NO_OVERRIDE,
  mono = false,
  compact = false,
  label,
}: FigureProps) {
  const m = compact ? COMPACT : NORMAL;
  const { boxes, lines, signBox, width, height } = layoutOf(plan, m);
  const paint = (color: ConceptColor) =>
    mono ? "fill-foreground" : CONCEPT_CLASSES[color].fill;

  function fixedAt(b: Box, value: string, className: string, key: string) {
    return (
      <text
        key={key}
        x={centre(b).x}
        y={centre(b).y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={m.digit}
        className={`${DIGIT} ${className}`}
      >
        {value}
      </text>
    );
  }

  // The digits of a and b are always written.
  function fixed(id: string, value: string, color: ConceptColor) {
    const b = boxes.get(id);
    return b ? fixedAt(b, value, paint(color), id) : null;
  }

  // A cell of a product row: the written digit, or a dim "?" while it is
  // still to come.
  function product(id: string, value: number) {
    const b = boxes.get(id);
    if (!b) return null;
    const replaced = override.get(id);
    const written = replaced !== undefined || shown.has(id);
    return fixedAt(
      b,
      written ? (replaced ?? String(value)) : "?",
      written ? paint(PRODUCT_COLOR) : "fill-muted-foreground opacity-35",
      id,
    );
  }

  const partials = plan.steps.flatMap((step) =>
    step.kind === "partial"
      ? step.cells.map((cell) => ({
          id: cellId.partial(step.row, cell.column),
          digit: cell.digit,
        }))
      : [],
  );
  const sums = plan.steps.flatMap((step) =>
    step.kind === "sum"
      ? step.cells.map((cell) => ({
          id: cellId.sum(cell.column),
          digit: cell.digit,
        }))
      : [],
  );
  const carries = plan.steps.flatMap((step) =>
    step.kind === "partial" && step.carryOut > 0
      ? [
          {
            id: cellId.carry(step.row, step.column + 1),
            digit: step.carryOut,
          },
        ]
      : [],
  );
  // Shifted partial products start with dim 0s in the lowest places, once the
  // row has begun.
  const shiftZeros = plan.bDigits.flatMap((_, row) =>
    Array.from({ length: row }, (_, column) => ({ row, column })),
  );
  const started = (row: number) =>
    partials.some((p) => p.id.startsWith(`p${row}c`) && shown.has(p.id));

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full max-w-(--phone-width) md:max-w-(--wide-width)"
      style={
        {
          "--phone-width": `${width * m.phoneScale}px`,
          "--wide-width": `${width * m.wideScale}px`,
        } as CSSProperties
      }
    >
      {[...lit, ...ringed].map((id) => {
        const b = boxes.get(id);
        return b ? (
          <CellRing key={id} box={b} kind={ringed.has(id) ? "wrong" : "lit"} />
        ) : null;
      })}
      {plan.aDigits.map((d, column) =>
        fixed(cellId.a(column), String(d), FACTOR_COLOR),
      )}
      {plan.bDigits.map((d, row) =>
        fixed(cellId.b(row), String(d), FACTOR_COLOR),
      )}
      {fixedAt(signBox, "·", "fill-foreground", "sign")}
      {lines.map((line) => (
        <line
          key={line.y}
          x1={m.pad}
          x2={width - m.pad}
          y1={line.y}
          y2={line.y}
          strokeWidth={2.5}
          strokeLinecap="round"
          className="stroke-foreground"
        />
      ))}
      {carries.map(({ id, digit: value }) => {
        const b = boxes.get(id);
        if (!b || !(shown.has(id) || override.has(id))) return null;
        return (
          <text
            key={id}
            x={centre(b).x}
            y={centre(b).y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={m.carry}
            className={`${DIGIT} ${paint(CARRY_COLOR)}`}
          >
            {override.get(id) ?? value}
          </text>
        );
      })}
      {partials.map((p) => product(p.id, p.digit))}
      {shiftZeros.map(({ row, column }) => {
        const b = boxes.get(cellId.shift(row, column));
        return b && started(row)
          ? fixedAt(
              b,
              "0",
              "fill-muted-foreground opacity-60",
              `zero${row}${column}`,
            )
          : null;
      })}
      {sums.map((p) => product(p.id, p.digit))}
    </svg>
  );
}

export type LegendItem = { color: ConceptColor; label: string };

export const COLUMN_LEGEND: LegendItem[] = [
  { color: FACTOR_COLOR, label: "Thừa số" },
  { color: PRODUCT_COLOR, label: "Tích" },
  { color: CARRY_COLOR, label: "Số nhớ" },
];

// Names the colours of a picture, each with its shape mark.
export function Legend({ items }: { items: readonly LegendItem[] }) {
  return (
    <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-caption">
      {items.map(({ color, label }) => (
        <li key={label} className="flex items-center gap-2">
          <ConceptMark color={color} className="size-4" />
          {label}
        </li>
      ))}
    </ul>
  );
}

export function figureLabel(plan: Plan, complete: boolean): string {
  const setup = `Đặt tính ${formatInteger(plan.a)} nhân ${formatInteger(plan.b)}`;
  return complete
    ? `${setup}, tích bằng ${formatInteger(plan.product)}`
    : setup;
}

// Carries only exist for some numbers, so they are named only when drawn.
export function legendFor(plan: Plan): LegendItem[] {
  return COLUMN_LEGEND.filter(
    (item) => item.color !== CARRY_COLOR || carryRows(plan).length > 0,
  );
}
