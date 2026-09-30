// Long division written the Vietnamese way, as pure data: the rounds of the
// algorithm, and the figure (digits, slots, rules, highlights) that shows a
// given point of the calculation. No React, so it is unit-tested directly.

export type DivisionStep = {
  // Number divided in this round, e.g. 15 for the first round of 154 : 12.
  partial: number;
  quotientDigit: number;
  product: number;
  remainder: number;
  // Index, among the dividend's digits, of the last digit of `partial`.
  end: number;
  // Dividend digit brought down after this round; absent after the last one.
  bring?: number;
};

export type Division = {
  dividend: number;
  divisor: number;
  digits: readonly number[];
  steps: readonly DivisionStep[];
  quotient: number;
  remainder: number;
};

// The four things done for every quotient digit, in order.
export const PHASES = ["divide", "multiply", "subtract", "bring"] as const;
export type Phase = (typeof PHASES)[number];

export function divide(dividend: number, divisor: number): Division {
  if (!Number.isInteger(dividend) || dividend < 0) {
    throw new Error(`Dividend must be a whole number, got ${dividend}`);
  }
  if (!Number.isInteger(divisor) || divisor < 1) {
    throw new Error(`Divisor must be a positive whole number, got ${divisor}`);
  }
  const digits = [...String(dividend)].map(Number);
  // The first round takes the fewest leading digits that reach the divisor.
  let end = 0;
  let partial = digits[0] ?? 0;
  while (partial < divisor && end < digits.length - 1) {
    end += 1;
    partial = partial * 10 + (digits[end] ?? 0);
  }
  const steps: DivisionStep[] = [];
  for (;;) {
    const quotientDigit = Math.floor(partial / divisor);
    const product = quotientDigit * divisor;
    const remainder = partial - product;
    const bring = digits[end + 1];
    steps.push({
      partial,
      quotientDigit,
      product,
      remainder,
      end,
      ...(bring === undefined ? {} : { bring }),
    });
    if (bring === undefined) break;
    partial = remainder * 10 + bring;
    end += 1;
  }
  const last = steps[steps.length - 1] as DivisionStep;
  return {
    dividend,
    divisor,
    digits,
    steps,
    quotient: Number(steps.map((s) => s.quotientDigit).join("")),
    remainder: last.remainder,
  };
}

// Whole number as digits from the highest place to the ones, padded with
// leading zeros to at least `length` digits.
export function digitsOf(value: number, length = 1): number[] {
  return [...String(value).padStart(length, "0")].map(Number);
}

export function numberFromDigits(digits: readonly number[]): number {
  return digits.reduce((sum, digit) => sum * 10 + digit, 0);
}

// Places the `colDivFill` exercise offers: the digits of the quotient (at
// least tens and ones) and of the remainder (at least tens and ones).
export const MIN_FILL_PLACES = 2;

export function fillPlaces(
  dividend: number,
  divisor: number,
): { quotient: number; remainder: number } {
  const quotient = Math.floor(dividend / divisor);
  return {
    quotient: Math.max(MIN_FILL_PLACES, String(quotient).length),
    remainder: Math.max(MIN_FILL_PLACES, String(divisor - 1).length),
  };
}

// State keys of a digit place: q0 is the ones of the quotient, q1 the tens.
export function placeKey(kind: "q" | "r", place: number): string {
  return `${kind}${place}`;
}

export function readNumber(
  state: Readonly<Record<string, number>>,
  kind: "q" | "r",
  places: number,
): number {
  let value = 0;
  for (let place = places - 1; place >= 0; place--) {
    value = value * 10 + (state[placeKey(kind, place)] ?? 0);
  }
  return value;
}

// ---- Figure ----

export type CellRole =
  | "dividend"
  | "divisor"
  | "quotient"
  | "product"
  | "remainder"
  | "brought"
  | "sign";

export type FigureCell = {
  key: string;
  // "left" cells sit under the dividend, "right" ones under the divisor.
  zone: "left" | "right";
  col: number;
  row: number;
  role: CellRole;
  // "text" is a digit on screen, "slot" an empty box waiting for input, and
  // "unknown" a dim "?" standing for a digit still to find.
  kind: "text" | "slot" | "unknown";
  text: string;
  highlighted: boolean;
};

export type FigureRule = {
  key: string;
  zone: "left" | "right";
  // The rule runs along the bottom of this row, from column `from` to `to`.
  row: number;
  from: number;
  to: number;
};

export type Figure = {
  cells: FigureCell[];
  rules: FigureRule[];
  // Columns of the left zone and of the right zone, rows of the whole figure.
  leftCols: number;
  rightCols: number;
  rows: number;
};

// A point of the calculation: rounds before `step` are complete, `done`
// phases of round `step` are on screen (0 to 4). `step` equal to the number
// of rounds means the whole calculation is done.
export type Progress = {
  step: number;
  done: number;
  // The phase after `done` is being typed: this many of its digits are in,
  // the rest are empty slots. For "bring" nothing is typed.
  typing?: { count: number };
  // The last quotient digit shows as "?" instead of its value (hints).
  hideLastQuotient?: boolean;
};

export function progressStart(): Progress {
  return { step: 0, done: 0 };
}

export function progressEnd(division: Division): Progress {
  return { step: division.steps.length, done: 0 };
}

// Number of events an animated walk-through has: the bare frame, then for
// every round divide, multiply, subtract and (except after the last round)
// bring down, then the result.
export function walkLength(division: Division): number {
  return 1 + (PHASES.length * division.steps.length - 1) + 1;
}

// The progress and caption sentence of event `index` of the walk.
export function walkEvent(
  division: Division,
  index: number,
): { progress: Progress; phase: Phase | "start" | "end"; step: number } {
  if (index <= 0) return { progress: progressStart(), phase: "start", step: 0 };
  const last = walkLength(division) - 1;
  if (index >= last) {
    return { progress: progressEnd(division), phase: "end", step: 0 };
  }
  const flat = index - 1;
  const step = Math.floor(flat / PHASES.length);
  const phaseIndex = flat % PHASES.length;
  return {
    progress: { step, done: phaseIndex + 1 },
    phase: PHASES[phaseIndex] as Phase,
    step,
  };
}

function stepPartialKeys(division: Division, step: number): string[] {
  const { steps } = division;
  const current = steps[step] as DivisionStep;
  if (step === 0) {
    return Array.from({ length: current.end + 1 }, (_, j) => `d${j}`);
  }
  const previous = steps[step - 1] as DivisionStep;
  const keys = [`b${step - 1}`];
  if (previous.remainder > 0) {
    keys.push(
      ...digitsOf(previous.remainder).map((_, k) => `r${step - 1}.${k}`),
    );
  }
  return keys;
}

function digitKeys(prefix: string, value: number): string[] {
  return digitsOf(value).map((_, k) => `${prefix}.${k}`);
}

function highlightKeys(division: Division, progress: Progress): Set<string> {
  const { steps } = division;
  const keys = new Set<string>();
  const { step, done, typing } = progress;
  if (step >= steps.length) return keys;
  const current = steps[step] as DivisionStep;
  if (typing) {
    for (const key of stepPartialKeys(division, step)) keys.add(key);
    keys.add(`slots`);
    return keys;
  }
  switch (done) {
    case 1:
      for (const key of stepPartialKeys(division, step)) keys.add(key);
      keys.add(`q${step}`);
      break;
    case 2:
      keys.add(`q${step}`);
      for (const key of digitKeys(`p${step}`, current.product)) keys.add(key);
      break;
    case 3:
      for (const key of digitKeys(`r${step}`, current.remainder)) keys.add(key);
      break;
    case 4:
      keys.add(`b${step}`);
      keys.add(`d${current.end + 1}`);
      break;
  }
  return keys;
}

// The figure at `progress`: which digits are written, which are still empty
// slots, and which are in play (highlighted).
export function buildFigure(division: Division, progress: Progress): Figure {
  const { digits, steps, divisor } = division;
  const m = steps.length;
  const divisorDigits = digitsOf(divisor);
  const highlight = highlightKeys(division, progress);
  const slotsHighlighted = highlight.has("slots");
  const cells: FigureCell[] = [];
  const rules: FigureRule[] = [];

  const put = (
    cell: Omit<FigureCell, "highlighted" | "kind" | "text"> &
      Partial<Pick<FigureCell, "kind" | "text">>,
  ) => {
    const kind = cell.kind ?? "text";
    cells.push({
      ...cell,
      kind,
      text: cell.text ?? "",
      highlighted: kind === "slot" ? slotsHighlighted : highlight.has(cell.key),
    });
  };

  digits.forEach((digit, j) => {
    put({
      key: `d${j}`,
      zone: "left",
      col: 1 + j,
      row: 0,
      role: "dividend",
      text: String(digit),
    });
  });
  divisorDigits.forEach((digit, k) => {
    put({
      key: `v${k}`,
      zone: "right",
      col: k,
      row: 0,
      role: "divisor",
      text: String(digit),
    });
  });
  rules.push({
    key: "quotient-rule",
    zone: "right",
    row: 0,
    from: 0,
    to: Math.max(divisorDigits.length, m) - 1,
  });

  // A written number: its digits right-aligned on `endCol`; while it is being
  // typed the digits not typed yet are slots.
  const writeNumber = (
    prefix: string,
    row: number,
    endCol: number,
    value: number,
    role: CellRole,
    typedCount: number | undefined,
    skipLeadingZero = false,
  ) => {
    const numberDigits = digitsOf(value);
    if (skipLeadingZero && value === 0) return;
    numberDigits.forEach((digit, k) => {
      const col = endCol - (numberDigits.length - 1) + k;
      const isSlot = typedCount !== undefined && k >= typedCount;
      put({
        key: `${prefix}.${k}`,
        zone: "left",
        col,
        row,
        role,
        kind: isSlot ? "slot" : "text",
        text: isSlot ? "" : String(digit),
      });
    });
  };

  for (let i = 0; i < m; i++) {
    const s = steps[i] as DivisionStep;
    const complete = i < progress.step;
    const current = i === progress.step;
    if (!complete && !current) break;
    const done = complete ? PHASES.length : progress.done;
    const typingPhase = current && progress.typing ? done + 1 : 0;
    const typed = progress.typing?.count;

    // Divide: the quotient digit.
    if (done >= 1 || typingPhase === 1) {
      const isHidden = progress.hideLastQuotient && i === m - 1;
      if (done >= 1) {
        put({
          key: `q${i}`,
          zone: "right",
          col: i,
          row: 1,
          role: "quotient",
          kind: isHidden ? "unknown" : "text",
          text: isHidden ? "?" : String(s.quotientDigit),
        });
      } else {
        put({
          key: `q${i}`,
          zone: "right",
          col: i,
          row: 1,
          role: "quotient",
          kind: "slot",
        });
      }
    }

    const productRow = 1 + 2 * i;
    const endCol = 1 + s.end;
    const productLength = digitsOf(s.product).length;
    // Multiply: the product with its minus sign and rule.
    if (done >= 2 || typingPhase === 2) {
      put({
        key: `s${i}`,
        zone: "left",
        col: endCol - productLength,
        row: productRow,
        role: "sign",
        text: "−",
      });
      rules.push({
        key: `rule${i}`,
        zone: "left",
        row: productRow,
        from: endCol - productLength,
        to: endCol,
      });
      writeNumber(
        `p${i}`,
        productRow,
        endCol,
        s.product,
        "product",
        done >= 2 ? undefined : typed,
      );
    }

    // Subtract: the remainder, hiding its zero once a digit is brought down.
    const remainderRow = productRow + 1;
    if (done >= 3 || typingPhase === 3) {
      const broughtShown = done >= 4 && s.bring !== undefined;
      writeNumber(
        `r${i}`,
        remainderRow,
        endCol,
        s.remainder,
        "remainder",
        done >= 3 ? undefined : typed,
        broughtShown,
      );
    }

    // Bring down: the next dividend digit beside the remainder.
    if (done >= 4 && s.bring !== undefined) {
      put({
        key: `b${i}`,
        zone: "left",
        col: endCol + 1,
        row: remainderRow,
        role: "brought",
        text: String(s.bring),
      });
    }
  }

  return {
    cells,
    rules,
    leftCols: digits.length + 1,
    rightCols: Math.max(divisorDigits.length, m),
    rows: 1 + 2 * m,
  };
}

// ---- Sentences ----

export function sentenceFor(
  division: Division,
  phase: Phase,
  step: number,
  hidden = false,
): string {
  const s = division.steps[step] as DivisionStep;
  const d = division.divisor;
  switch (phase) {
    case "divide":
      return `Chia: ${s.partial} : ${d} được ${hidden ? "?" : s.quotientDigit}`;
    case "multiply":
      return `Nhân: ${s.quotientDigit} · ${d} = ${s.product}`;
    case "subtract":
      return `Trừ: ${s.partial} − ${s.product} = ${s.remainder}`;
    case "bring":
      return `Hạ: hạ chữ số ${s.bring}, được ${s.remainder * 10 + (s.bring ?? 0)}`;
  }
}

// What the walk says before the first round: a divisor with more digits than
// the first digit of the dividend takes a longer first partial number.
export function openingSentence(division: Division): string {
  const first = division.steps[0] as DivisionStep;
  if (first.end === 0) {
    return `Chia ${division.dividend} cho ${division.divisor} từng chữ số một.`;
  }
  const count = first.end + 1;
  const digit = division.digits[0];
  return `${digit} nhỏ hơn ${division.divisor} nên lấy ${count === 2 ? "hai" : count} chữ số đầu: ${first.partial}.`;
}
