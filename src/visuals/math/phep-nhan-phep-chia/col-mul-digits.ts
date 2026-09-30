import { formatInteger } from "@/lib/number-format";

// Digit logic of column multiplication, without React: which digit is written
// where, which carry each step produces, and the sentence that says it. The
// drawing (col-mul-figure.tsx), the animation, the hands-on screen and the
// `manipulate` exercise all read the same plan, so they cannot disagree.
//
// Columns count from the right: column 0 is the ones place. A partial product
// of the row-th digit of b is written shifted `row` columns to the left.

export type Cell = { column: number; digit: number };

// One digit of `a` times one digit of `b`, plus the carry from the step
// before. On the last digit of `a` the whole total is written (up to two
// digits); on the others its ones digit is written and the tens digit is
// carried to the next column.
export type PartialStep = {
  kind: "partial";
  row: number;
  // Place of the digit of `a` being multiplied.
  column: number;
  digitA: number;
  digitB: number;
  carryIn: number;
  total: number;
  carryOut: number;
  last: boolean;
  // Written digits, in the global column they occupy.
  cells: Cell[];
};

// The two partial products added, only for a two-digit b.
export type SumStep = {
  kind: "sum";
  left: number;
  right: number;
  total: number;
  cells: Cell[];
};

export type Step = PartialStep | SumStep;

export type Plan = {
  a: number;
  b: number;
  product: number;
  // Digits of a and b, ones first.
  aDigits: number[];
  bDigits: number[];
  steps: Step[];
  // Grid width: the widest row in columns.
  columns: number;
};

export const MAX_B_DIGITS = 2;

export function digitsOf(n: number): number[] {
  return String(n).split("").reverse().map(Number);
}

function partialSteps(aDigits: number[], digitB: number, row: number) {
  const steps: PartialStep[] = [];
  let carry = 0;
  aDigits.forEach((digitA, column) => {
    const total = digitA * digitB + carry;
    const last = column === aDigits.length - 1;
    const written = last ? digitsOf(total) : [total % 10];
    steps.push({
      kind: "partial",
      row,
      column,
      digitA,
      digitB,
      carryIn: carry,
      total,
      carryOut: last ? 0 : Math.floor(total / 10),
      last,
      cells: written.map((digit, i) => ({ column: row + column + i, digit })),
    });
    carry = Math.floor(total / 10);
  });
  return steps;
}

// Exact for any a >= 1 and any b >= 1 with up to MAX_B_DIGITS digits.
export function planMultiplication(a: number, b: number): Plan {
  const aDigits = digitsOf(a);
  const bDigits = digitsOf(b);
  if (bDigits.length > MAX_B_DIGITS) {
    throw new Error(`b has more than ${MAX_B_DIGITS} digits`);
  }
  const rows = bDigits.map((digitB, row) => partialSteps(aDigits, digitB, row));
  const steps: Step[] = rows.flat();
  const product = a * b;
  if (rows.length > 1) {
    const left = a * (b % 10);
    const right = a * Math.floor(b / 10) * 10;
    steps.push({
      kind: "sum",
      left,
      right,
      total: product,
      cells: digitsOf(product).map((digit, column) => ({ column, digit })),
    });
  }
  const columns = Math.max(
    aDigits.length,
    digitsOf(product).length,
    ...steps.flatMap((s) => s.cells.map((c) => c.column + 1)),
  );
  return { a, b, product, aDigits, bDigits, steps, columns };
}

// Ids of the parts of the figure, shared by the drawing and its callers.
export const cellId = {
  a: (column: number) => `a${column}`,
  b: (row: number) => `b${row}`,
  carry: (row: number, column: number) => `k${row}c${column}`,
  partial: (row: number, column: number) => `p${row}c${column}`,
  sum: (column: number) => `s${column}`,
  // The dim 0 in a shifted partial product's low places.
  shift: (row: number, column: number) => `z${row}c${column}`,
};

// Id of a cell a step writes.
export function writtenId(step: Step, cell: Cell): string {
  return step.kind === "sum"
    ? cellId.sum(cell.column)
    : cellId.partial(step.row, cell.column);
}

export function writtenIds(step: Step): string[] {
  return step.cells.map((cell) => writtenId(step, cell));
}

// Id of the carry a partial step produces, sitting over the next digit of
// `a`; undefined when nothing is carried.
export function producedCarryId(step: Step): string | undefined {
  return step.kind === "partial" && step.carryOut > 0
    ? cellId.carry(step.row, step.column + 1)
    : undefined;
}

// Everything in play while a step is explained.
export function litIds(step: Step): string[] {
  if (step.kind === "sum") return writtenIds(step);
  const ids = [cellId.a(step.column), cellId.b(step.row), ...writtenIds(step)];
  if (step.carryIn > 0) ids.push(cellId.carry(step.row, step.column));
  const produced = producedCarryId(step);
  if (produced) ids.push(produced);
  return ids;
}

// Ids of everything written once `count` steps of the plan are done.
export function shownAfter(plan: Plan, count: number): Set<string> {
  const ids = new Set<string>();
  for (const step of plan.steps.slice(0, count)) {
    for (const id of writtenIds(step)) ids.add(id);
    const carry = producedCarryId(step);
    if (carry) ids.add(carry);
  }
  return ids;
}

// Carries that appear anywhere in the calculation, per row of b.
export function carryRows(plan: Plan): number[] {
  return plan.bDigits
    .map((_, row) => row)
    .filter((row) =>
      plan.steps.some(
        (s) => s.kind === "partial" && s.row === row && s.carryOut > 0,
      ),
    );
}

const ROW_PREFIX = "Hàng chục, lùi một cột. ";

// "8 · 6 = 48: viết 8, nhớ 4"; "3 · 6 = 18, cộng 4 được 22: viết 22". With
// `hideResult` the last number is "?", for a hint that stops before it.
export function stepSentence(step: Step, hideResult = false): string {
  if (step.kind === "sum") {
    const total = hideResult ? "?" : formatInteger(step.total);
    return `${formatInteger(step.left)} + ${formatInteger(step.right)} = ${total}`;
  }
  const { digitA, digitB, carryIn, total, carryOut, last } = step;
  const product = digitA * digitB;
  const prefix = step.row > 0 && step.column === 0 ? ROW_PREFIX : "";
  const head = `${prefix}${digitA} · ${digitB} = `;
  if (hideResult) {
    return carryIn > 0
      ? `${head}${product}, cộng ${carryIn} được ?`
      : `${head}?`;
  }
  const worked =
    carryIn > 0
      ? `${head}${product}, cộng ${carryIn} được ${total}`
      : `${head}${total}`;
  if (last || total < 10) return `${worked}: viết ${total}`;
  return `${worked}: viết ${total % 10}, nhớ ${carryOut}`;
}

export const SETUP_SENTENCE =
  "Đặt tính: viết các chữ số thẳng hàng, nhân từ phải sang trái.";

// What the sum of the two partial products looks like column by column, for
// the hands-on screen: the digits added in a column and the carry into it.
export type SumColumn = {
  column: number;
  first: number;
  second: number;
  carryIn: number;
  total: number;
};

export function sumColumns(plan: Plan): SumColumn[] {
  const [low, high] = plan.bDigits;
  if (low === undefined || high === undefined) return [];
  const first = digitsOf(plan.a * low);
  // The second partial product is shifted one column: its ones place is 0.
  const second = [0, ...digitsOf(plan.a * high)];
  const columns: SumColumn[] = [];
  let carry = 0;
  for (let column = 0; column < digitsOf(plan.product).length; column++) {
    const x = first[column] ?? 0;
    const y = second[column] ?? 0;
    const total = x + y + carry;
    columns.push({ column, first: x, second: y, carryIn: carry, total });
    carry = Math.floor(total / 10);
  }
  return columns;
}

// One digit cell the child fills in: what to do, the tip after a wrong digit
// and what is said once it is right. Order: first partial product, second
// partial product, sum; each right to left.
export type TryCell = {
  id: string;
  digit: number;
  prompt: string;
  tip: string;
  after: string;
  // Ids of the digits and carry the cell's digit is worked out from.
  inputs: string[];
  // Id of the carry written once this cell is right, if any.
  carry?: string;
};

const WRITE_RESULT = "Viết kết quả.";
const WRITE_ONES = "Viết hàng đơn vị, nhớ hàng chục.";
const WRITE_ONES_OF_TWO = "Viết chữ số hàng đơn vị của kết quả.";
const WRITE_REST = "Viết nốt chữ số hàng chục của kết quả.";

function partialCell(
  step: PartialStep,
  index: number,
): Omit<TryCell, "id" | "digit"> {
  if (index > 0) {
    return {
      prompt: "chữ số hàng chục còn lại của kết quả",
      tip: `Kết quả có hai chữ số. ${WRITE_REST}`,
      after: stepSentence(step),
      inputs: [],
    };
  }
  const carry = step.carryIn > 0 ? ` cộng số nhớ ${step.carryIn}` : "";
  const where =
    step.cells.length > 1
      ? WRITE_ONES_OF_TWO
      : step.total < 10
        ? WRITE_RESULT
        : WRITE_ONES;
  return {
    prompt: `${step.digitA} · ${step.digitB}${carry}`,
    tip: `Nhân ${step.digitA} · ${step.digitB}${carry ? ` rồi${carry}` : ""}. ${where}`,
    // A two-digit result still has its tens digit to come.
    after: step.cells.length > 1 ? "Còn chữ số hàng chục." : stepSentence(step),
    inputs: [
      cellId.a(step.column),
      cellId.b(step.row),
      ...(step.carryIn > 0 ? [cellId.carry(step.row, step.column)] : []),
    ],
    carry: producedCarryId(step),
  };
}

function sumCell(column: SumColumn): Omit<TryCell, "id" | "digit"> {
  const carry = column.carryIn > 0 ? ` cộng số nhớ ${column.carryIn}` : "";
  const sum = `${column.first} + ${column.second}${carry}`;
  const write =
    column.total < 10
      ? `viết ${column.total}`
      : `viết ${column.total % 10}, nhớ ${Math.floor(column.total / 10)}`;
  return {
    prompt: sum,
    tip: `Cộng các chữ số cùng cột: ${sum}. ${column.total < 10 ? WRITE_RESULT : WRITE_ONES}`,
    after: `${sum} = ${column.total}: ${write}`,
    inputs: [
      cellId.partial(0, column.column),
      cellId.partial(1, column.column),
    ],
  };
}

export function tryCells(plan: Plan): TryCell[] {
  return plan.steps.flatMap((step) => {
    if (step.kind === "partial") {
      return step.cells.map((cell, i) => ({
        id: writtenId(step, cell),
        digit: cell.digit,
        ...partialCell(step, i),
      }));
    }
    return sumColumns(plan).map((column) => ({
      id: cellId.sum(column.column),
      digit: column.total % 10,
      ...sumCell(column),
    }));
  });
}

// Cells and carries on the paper once the first `done` cells are right.
export function tryShown(cells: readonly TryCell[], done: number): Set<string> {
  const ids = new Set<string>();
  for (const cell of cells.slice(0, done)) {
    ids.add(cell.id);
    if (cell.carry) ids.add(cell.carry);
  }
  return ids;
}
