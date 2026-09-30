import type { VisualState } from "@/visuals/registry";
import type { Op } from "./types";

// One place value of a written column calculation, units first.
export type ColumnCalc = {
  // Digit of each number in this place; null where the number is shorter.
  a: number | null;
  b: number | null;
  // Add: carry arriving from the place to the right. Sub: 1 when the place to
  // the right borrowed a ten from this one.
  carryIn: 0 | 1;
  // Digit written under the line.
  digit: number;
  // Add: carry handed to the place to the left. Sub: 1 when this place
  // borrows a ten from the left.
  carryOut: 0 | 1;
  // "1 + 4 + 5" or "12 − 7"; null when the digit is simply brought down.
  expression: string | null;
  // Number after "=" in the working label: the column sum for add, the digit
  // for sub.
  value: number;
};

export type ColumnModel = {
  op: Op;
  columns: readonly ColumnCalc[];
  // Add: the digit a last carry puts in front of the result (0 when none).
  lead: 0 | 1;
  // Places up to the leading digit of the result, so leading zeros of a
  // difference never get a step of their own.
  active: number;
};

function digitsOf(value: number): number[] {
  return String(value).split("").reverse().map(Number);
}

export function columnModel(op: Op, a: number, b: number): ColumnModel {
  if (op === "sub" && a < b) {
    throw new RangeError("A column subtraction needs a >= b");
  }
  const da = digitsOf(a);
  const db = digitsOf(b);
  const count = Math.max(da.length, db.length);
  const columns: ColumnCalc[] = [];
  let carry = 0 as 0 | 1;
  for (let place = 0; place < count; place++) {
    const top = da[place] ?? null;
    const bottom = db[place] ?? null;
    const carryIn: 0 | 1 = carry;
    if (op === "add") {
      const terms = [carryIn > 0 ? carryIn : null, top, bottom].filter(
        (t): t is number => t !== null,
      );
      const sum = terms.reduce((x, y) => x + y, 0);
      carry = sum >= 10 ? 1 : 0;
      columns.push({
        a: top,
        b: bottom,
        carryIn,
        digit: sum % 10,
        carryOut: carry,
        expression: terms.length > 1 ? terms.join(" + ") : null,
        value: sum,
      });
    } else {
      const above = (top ?? 0) - carryIn;
      const borrow: 0 | 1 = above < (bottom ?? 0) ? 1 : 0;
      const worked = above + 10 * borrow;
      carry = borrow;
      columns.push({
        a: top,
        b: bottom,
        carryIn,
        digit: worked - (bottom ?? 0),
        carryOut: borrow,
        expression:
          bottom === null && carryIn === 0
            ? null
            : `${worked} − ${bottom ?? 0}`,
        value: worked - (bottom ?? 0),
      });
    }
  }
  const lead = op === "add" && carry === 1 ? 1 : 0;
  let active = count;
  if (op === "sub") {
    while (active > 1 && columns[active - 1]?.digit === 0) active--;
  }
  return { op, columns, lead, active };
}

// The digit to write and the carry (add) or borrow (sub) to hand on for one
// place of a calculation, counting what arrives from the place to the right.
// Place 0 is the units; the place just after the last one of an addition holds
// the leading digit of a final carry.
export function expectedColumn(
  op: Op,
  a: number,
  b: number,
  column: number,
): { digit: number; carry: number } {
  const model = columnModel(op, a, b);
  const calc = model.columns[column];
  if (calc) return { digit: calc.digit, carry: calc.carryOut };
  return { digit: column === model.columns.length ? model.lead : 0, carry: 0 };
}

// A guided column step is right when the child wrote the digit and handed on
// the carry or borrow the exercise asks for.
export function columnStep(
  state: VisualState,
  params: Record<string, number>,
): boolean {
  return state.digit === params.digit && state.carry === params.carry;
}

export function solveColumnStep(params: Record<string, number>): VisualState {
  return { digit: params.digit ?? 0, carry: params.carry ?? 0 };
}
