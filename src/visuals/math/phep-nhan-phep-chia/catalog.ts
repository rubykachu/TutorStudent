// Every picture of the lesson that is drawn from numbers: the registry builds
// one entry per item (id `phep-nhan-phep-chia.visual.<key>`), so a new example
// is one item here and its id in lesson.json. Pure data and helpers: no React,
// so `content:check` reads it.

export const LESSON_SLUG = "phep-nhan-phep-chia";

// How a picture with several steps plays:
// - steps: animated walk-through that ends on the full result;
// - still: the finished picture, no animation;
// - hint: the walk-through of other numbers that stops at a "?" before the
//   result;
// - solution: walk-through of the exercise's own numbers up to the result.
export type Mode = "steps" | "still" | "hint" | "solution";

export type VisualSpec =
  // `groups` boxes of `size` items each, added one box at a time:
  // 6 + 6 + 6 + 6 = 4 · 6.
  | {
      kind: "repeatAdd";
      groups: number;
      size: number;
      groupWord: string;
      itemWord: string;
      mode: Mode;
    }
  // Hands-on screen: the child steps rows and columns of a dot grid until it
  // shows `rows` rows of `cols` dots. Reports progress and a closing line.
  | { kind: "gridTry"; rows: number; cols: number }
  // `manipulate` exercise: build the grid the params `rows` and `cols` ask for.
  | { kind: "gridFill" }
  // Multiplication table from..to; `mark` paints one row, or the hard block
  // of factors 6 to 9.
  | {
      kind: "mulTable";
      from: number;
      to: number;
      mark: { row: number } | "hard";
    }
  // Table of products for factors from..to with one tappable cell per pair,
  // region id `r<row>c<column>` (see `mulTableRegions`).
  | { kind: "mulTableTap"; from: number; to: number }
  // Number line: `hops` jumps of `step` from 0.
  | { kind: "skip"; step: number; hops: number; mode: Mode }
  // A labelled equation. mul: a · b = c with "Thừa số" and "Tích"; div:
  // a : b = c with "Số bị chia", "Số chia", "Thương"; divRem: the same with a
  // remainder ("Số dư"), a : b = q dư r; both: a · b = c and c : a = b.
  | {
      kind: "tags";
      form: "mul" | "div" | "divRem" | "both";
      a: number;
      b: number;
    }
  // Grid of rows x cols turned a quarter turn: same number of dots, factors
  // swapped.
  | { kind: "swap"; rows: number; cols: number; mode: Mode }
  // Three numbers a, b and a · b with the four equations they give.
  | { kind: "factFamily"; a: number; b: number }
  // Calculation lines revealed one per step. A line ending in "?" is the
  // unfinished last step of a hint.
  | { kind: "steps"; lines: readonly string[] }
  // Factor pairs whose product is a round number.
  | { kind: "pairs"; pairs: readonly (readonly [number, number])[] }
  // Area model of a · (p1 + p2 + ...): rectangle with `a` rows split into
  // columns of the listed widths. A negative width is the part taken away
  // from the whole, as in 12 · (20 − 1).
  | { kind: "splitArea"; a: number; parts: readonly number[]; mode: Mode }
  // Hands-on screen: the child splits `b` into tens and ones for a · b and sees
  // the two partial products. Reports progress and a closing line.
  | { kind: "splitTry"; a: number; b: number }
  // Column multiplication a · b written out: partial products, carries
  // highlighted, sum of partial products when b has two digits.
  | { kind: "colMul"; a: number; b: number; mode: Mode }
  // Hands-on screen: the child picks the digit of every product cell, right to
  // left, and sees the carry appear. Reports progress and a closing line.
  | { kind: "colMulTry"; a: number; b: number }
  // `manipulate` exercise: fill the digits of a · b (params `a`, `b`).
  | { kind: "colMulFill" }
  // Number line with the bounds lowA · b and highA · b around a · b. In
  // "solution" mode, `options` are placed on the line to show which one fits.
  | {
      kind: "estimate";
      a: number;
      b: number;
      lowA: number;
      highA: number;
      mode: Mode;
      options?: readonly number[];
    }
  // `total` items dealt one at a time to `people` plates; what is left over is
  // the remainder.
  | { kind: "share"; total: number; people: number; mode: Mode }
  // Hands-on screen: the child deals one round at a time until fewer items
  // remain than plates. Reports progress and a closing line.
  | { kind: "shareTry"; total: number; people: number }
  // `manipulate` exercise: how many each gets and how many remain (params
  // `total`, `people`).
  | { kind: "shareFill" }
  // A division with remainder checked as divisor · q + r = dividend; ok is
  // false when r is not smaller than the divisor (or the equation fails).
  | {
      kind: "remCheck";
      dividend: number;
      divisor: number;
      q: number;
      r: number;
      ok: boolean;
    }
  // Long division written out: divide, multiply, subtract, bring down.
  | { kind: "colDiv"; dividend: number; divisor: number; mode: Mode }
  // Hands-on screen: the child picks the digits of each divide, multiply,
  // subtract step. Reports progress and a closing line.
  | { kind: "colDivTry"; dividend: number; divisor: number }
  // `manipulate` exercise: quotient and remainder of params `dividend` :
  // `divisor`.
  | { kind: "colDivFill" }
  // `total` items packed in groups of `per`. goal "up": every item must go
  // in, so a started group counts; goal "down": only full groups count.
  | {
      kind: "pack";
      total: number;
      per: number;
      goal: "up" | "down";
      mode: Mode;
      groupWord: string;
      itemWord: string;
    }
  // Three worked examples marked wrong: a forgotten carry, a remainder not
  // smaller than the divisor, a missing zero in the quotient.
  | { kind: "mistakes" }
  | { kind: "sticker" };

export type SpecKind = VisualSpec["kind"];
export type SpecOf<K extends SpecKind> = Extract<VisualSpec, { kind: K }>;

// Hands-on screens and `manipulate` exercises: the child acts on them.
export const INTERACTIVE_KINDS: ReadonlySet<SpecKind> = new Set([
  "gridTry",
  "gridFill",
  "splitTry",
  "colMulTry",
  "colMulFill",
  "shareTry",
  "shareFill",
  "colDivTry",
  "colDivFill",
]);

// Validator id of each `manipulate` kind (`validatorId` in lesson.json).
export const VALIDATOR_IDS = {
  gridFill: "luoi",
  colMulFill: "tich-cot",
  shareFill: "chia",
  colDivFill: "thuong-du",
} as const satisfies Partial<Record<SpecKind, string>>;

// Region ids of a `mulTableTap` picture, row by row.
export function mulTableRegions(spec: SpecOf<"mulTableTap">): string[] {
  const ids: string[] = [];
  for (let row = spec.from; row <= spec.to; row++) {
    for (let col = spec.from; col <= spec.to; col++) {
      ids.push(`r${row}c${col}`);
    }
  }
  return ids;
}

export const VISUAL_SPECS: Readonly<Record<string, VisualSpec>> = {
  "xep-luoi-cung-lam": {
    kind: "gridTry",
    rows: 3,
    cols: 5,
  },
  "tinh-ba-keo-goi-y": {
    kind: "repeatAdd",
    groups: 3,
    size: 7,
    groupWord: "bao",
    itemWord: "viên kẹo",
    mode: "hint",
  },
  "tinh-ba-keo-giai": {
    kind: "repeatAdd",
    groups: 5,
    size: 8,
    groupWord: "bao",
    itemWord: "viên kẹo",
    mode: "solution",
  },
  "xep-luoi": {
    kind: "gridFill",
  },
  "bang-nhan-day-du": {
    kind: "mulTable",
    from: 1,
    to: 9,
    mark: {
      row: 6,
    },
  },
  "bang-nhan-nhay-cach": {
    kind: "skip",
    step: 6,
    hops: 5,
    mode: "steps",
  },
  "bang-nhan-cham": {
    kind: "mulTableTap",
    from: 6,
    to: 9,
  },
  "tinh-tuan-ngay-goi-y": {
    kind: "skip",
    step: 9,
    hops: 4,
    mode: "hint",
  },
  "tinh-tuan-ngay-giai": {
    kind: "skip",
    step: 7,
    hops: 8,
    mode: "solution",
  },
  "ten-goi-nhan": {
    kind: "tags",
    form: "mul",
    a: 25,
    b: 2,
  },
  "ten-goi-chia": {
    kind: "tags",
    form: "div",
    a: 36,
    b: 12,
  },
  "dien-7-9-goi-y": {
    kind: "swap",
    rows: 4,
    cols: 6,
    mode: "hint",
  },
  "dien-7-9-giai": {
    kind: "swap",
    rows: 7,
    cols: 9,
    mode: "solution",
  },
  "cap-so-tron": {
    kind: "pairs",
    pairs: [
      [2, 5],
      [4, 25],
      [8, 125],
    ],
  },
  "tinh-thung-sua-goi-y": {
    kind: "steps",
    lines: ["24 · 25", "= 6 · 4 · 25", "= 6 · (4 · 25)", "= 6 · ?"],
  },
  "tinh-thung-sua-giai": {
    kind: "steps",
    lines: ["28 · 25", "= 7 · 4 · 25", "= 7 · (4 · 25)", "= 7 · 100", "= 700"],
  },
  "phan-phoi-26-12": {
    kind: "steps",
    lines: [
      "26 · 12",
      "= 26 · (10 + 2)",
      "= 26 · 10 + 26 · 2",
      "= 260 + 52",
      "= 312",
    ],
  },
  "phan-phoi-tach": {
    kind: "splitTry",
    a: 14,
    b: 12,
  },
  "tinh-tui-keo-goi-y": {
    kind: "splitArea",
    a: 4,
    parts: [10, 2],
    mode: "hint",
  },
  "tinh-tui-keo-giai": {
    kind: "splitArea",
    a: 5,
    parts: [10, 3],
    mode: "solution",
  },
  "gan-tron-12-19": {
    kind: "splitArea",
    a: 12,
    parts: [20, -1],
    mode: "steps",
  },
  "mua-sach-49-goi-y": {
    kind: "steps",
    lines: ["8 · 29", "= 8 · (30 − 1)", "= 8 · 30 − 8 · 1", "= 240 − ?"],
  },
  "mua-sach-49-giai": {
    kind: "steps",
    lines: [
      "6 · 49",
      "= 6 · (50 − 1)",
      "= 6 · 50 − 6 · 1",
      "= 300 − 6",
      "= 294",
    ],
  },
  "nhan-cot-54-7-xong": {
    kind: "colMul",
    a: 54,
    b: 7,
    mode: "still",
  },
  "nhan-cot-26-4-cung-lam": {
    kind: "colMulTry",
    a: 26,
    b: 4,
  },
  "tinh-46-7-goi-y": {
    kind: "colMul",
    a: 35,
    b: 8,
    mode: "hint",
  },
  "tinh-46-7-giai": {
    kind: "colMul",
    a: 46,
    b: 7,
    mode: "solution",
  },
  "nhan-cot": {
    kind: "colMulFill",
  },
  "nhan-cot-47-13-xong": {
    kind: "colMul",
    a: 47,
    b: 13,
    mode: "still",
  },
  "nhan-cot-23-14-cung-lam": {
    kind: "colMulTry",
    a: 23,
    b: 14,
  },
  "tinh-35-26-goi-y": {
    kind: "colMul",
    a: 45,
    b: 21,
    mode: "hint",
  },
  "tinh-35-26-giai": {
    kind: "colMul",
    a: 35,
    b: 26,
    mode: "solution",
  },
  "chon-tich-53-7-goi-y": {
    kind: "estimate",
    a: 43,
    b: 6,
    lowA: 40,
    highA: 50,
    mode: "hint",
  },
  "chon-tich-53-7-giai": {
    kind: "estimate",
    a: 53,
    b: 7,
    lowA: 50,
    highA: 60,
    mode: "solution",
    options: [271, 371, 471, 3710],
  },
  "gia-dinh-6-4": {
    kind: "factFamily",
    a: 6,
    b: 4,
  },
  "chia-56-8-goi-y": {
    kind: "share",
    total: 45,
    people: 9,
    mode: "hint",
  },
  "chia-56-8-giai": {
    kind: "share",
    total: 56,
    people: 8,
    mode: "solution",
  },
  "ten-goi-chia-du": {
    kind: "tags",
    form: "divRem",
    a: 38,
    b: 7,
  },
  "chia-keo-17-5-cung-lam": {
    kind: "shareTry",
    total: 17,
    people: 5,
  },
  "chia-keo-29-6-goi-y": {
    kind: "share",
    total: 19,
    people: 4,
    mode: "hint",
  },
  "chia-keo-29-6-giai": {
    kind: "share",
    total: 29,
    people: 6,
    mode: "solution",
  },
  "chia-keo": {
    kind: "shareFill",
  },
  "kiem-tra-du-37-5": {
    kind: "remCheck",
    dividend: 37,
    divisor: 5,
    q: 6,
    r: 7,
    ok: false,
  },
  "chia-cot-268-12-xong": {
    kind: "colDiv",
    dividend: 268,
    divisor: 12,
    mode: "still",
  },
  "chia-cot-75-6-cung-lam": {
    kind: "colDivTry",
    dividend: 75,
    divisor: 6,
  },
  "chia-154-12-goi-y": {
    kind: "colDiv",
    dividend: 87,
    divisor: 5,
    mode: "hint",
  },
  "chia-154-12-giai": {
    kind: "colDiv",
    dividend: 154,
    divisor: 12,
    mode: "solution",
  },
  "chia-cot": {
    kind: "colDivFill",
  },
  "chon-thung-150-24-goi-y": {
    kind: "pack",
    total: 38,
    per: 9,
    goal: "up",
    mode: "hint",
    groupWord: "thùng",
    itemWord: "chai",
  },
  "chon-thung-150-24-giai": {
    kind: "pack",
    total: 150,
    per: 24,
    goal: "up",
    mode: "solution",
    groupWord: "thùng",
    itemWord: "chai",
  },
  "loi-sai-ba": {
    kind: "mistakes",
  },
  "loi-sai-soat": {
    kind: "remCheck",
    dividend: 367,
    divisor: 9,
    q: 40,
    r: 7,
    ok: true,
  },
  "nhan-hop-banh": {
    kind: "repeatAdd",
    groups: 4,
    size: 6,
    groupWord: "hộp",
    itemWord: "cái bánh",
    mode: "steps",
  },
  "nhan-cong-lap-tom-tat": {
    kind: "repeatAdd",
    groups: 3,
    size: 5,
    groupWord: "hàng",
    itemWord: "chấm",
    mode: "still",
  },
  "bang-nhan-tom-tat": {
    kind: "mulTable",
    from: 1,
    to: 9,
    mark: "hard",
  },
  "ten-goi-tom-tat": {
    kind: "tags",
    form: "both",
    a: 6,
    b: 4,
  },
  "giao-hoan-ghe": {
    kind: "swap",
    rows: 3,
    cols: 7,
    mode: "steps",
  },
  "giao-hoan-tom-tat": {
    kind: "swap",
    rows: 4,
    cols: 5,
    mode: "still",
  },
  "ket-hop-44-25": {
    kind: "steps",
    lines: [
      "44 · 25",
      "= 11 · 4 · 25",
      "= 11 · (4 · 25)",
      "= 11 · 100",
      "= 1 100",
    ],
  },
  "ket-hop-tom-tat": {
    kind: "steps",
    lines: ["18 · 25", "= 9 · 2 · 25", "= 9 · (2 · 25)", "= 9 · 50", "= 450"],
  },
  "phan-phoi-goi-banh": {
    kind: "splitArea",
    a: 3,
    parts: [10, 2],
    mode: "steps",
  },
  "phan-phoi-tom-tat": {
    kind: "splitArea",
    a: 4,
    parts: [10, 3],
    mode: "still",
  },
  "gan-tron-35-98": {
    kind: "steps",
    lines: [
      "35 · 98",
      "= 35 · (100 − 2)",
      "= 35 · 100 − 35 · 2",
      "= 3 500 − 70",
      "= 3 430",
    ],
  },
  "gan-tron-tom-tat": {
    kind: "splitArea",
    a: 4,
    parts: [20, -1],
    mode: "still",
  },
  "nhan-cot-38-6": {
    kind: "colMul",
    a: 38,
    b: 6,
    mode: "steps",
  },
  "nhan-mot-chu-so-tom-tat": {
    kind: "colMul",
    a: 29,
    b: 4,
    mode: "still",
  },
  "nhan-cot-36-24": {
    kind: "colMul",
    a: 36,
    b: 24,
    mode: "steps",
  },
  "nhan-hai-chu-so-tom-tat": {
    kind: "colMul",
    a: 38,
    b: 25,
    mode: "still",
  },
  "uoc-luong-62-8": {
    kind: "estimate",
    a: 62,
    b: 8,
    lowA: 60,
    highA: 70,
    mode: "steps",
  },
  "uoc-luong-tom-tat": {
    kind: "estimate",
    a: 47,
    b: 6,
    lowA: 40,
    highA: 50,
    mode: "still",
  },
  "chia-deu-24-6": {
    kind: "share",
    total: 24,
    people: 6,
    mode: "steps",
  },
  "chia-het-tom-tat": {
    kind: "factFamily",
    a: 7,
    b: 5,
  },
  "chia-keo-23-4": {
    kind: "share",
    total: 23,
    people: 4,
    mode: "steps",
  },
  "chia-co-du-tom-tat": {
    kind: "tags",
    form: "divRem",
    a: 43,
    b: 8,
  },
  "kiem-tra-chia-tom-tat": {
    kind: "remCheck",
    dividend: 47,
    divisor: 9,
    q: 5,
    r: 2,
    ok: true,
  },
  "chia-cot-95-4": {
    kind: "colDiv",
    dividend: 95,
    divisor: 4,
    mode: "steps",
  },
  "dat-tinh-chia-tom-tat": {
    kind: "colDiv",
    dividend: 76,
    divisor: 5,
    mode: "still",
  },
  "xep-xe-50-12": {
    kind: "pack",
    total: 50,
    per: 12,
    goal: "up",
    mode: "steps",
    groupWord: "xe",
    itemWord: "học sinh",
  },
  "mua-vo-100-12": {
    kind: "pack",
    total: 100,
    per: 12,
    goal: "down",
    mode: "steps",
    groupWord: "quyển vở",
    itemWord: "nghìn đồng",
  },
  "bai-toan-chia-tom-tat": {
    kind: "pack",
    total: 27,
    per: 5,
    goal: "up",
    mode: "still",
    groupWord: "hộp",
    itemWord: "cái bánh",
  },
  "tim-loi-sai-tom-tat": {
    kind: "mistakes",
  },
  sticker: {
    kind: "sticker",
  },
};
