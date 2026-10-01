import type { BagsSpec } from "@/visuals/shared/bag-groups";
import type { LinesSpec, Mode, RowsSpec } from "@/visuals/shared/formula-rows";
import type { ChipsSpec } from "@/visuals/shared/pick-chips";

// Every picture of the lesson that is drawn from numbers: the registry builds
// one entry per item (id `quan-he-chia-het-va-tinh-chat.visual.<key>`), so a
// new example is one item here and its id in lesson.json. Pure data, no React,
// so `content:check` reads it.

export { LESSON_SLUG } from "./logic";

export type VisualSpec =
  // Items packed into bags, one bag per step (see `BagsSpec`).
  | ({ kind: "bags" } & BagsSpec)
  // Hands-on screen and `manipulate` exercise: the child changes the bag size
  // for `total` candies (the exercise's params override it). `goal` adds a
  // progress line and a closing line once the bags hold the candies exactly.
  | { kind: "bagTry"; total: number; goal: boolean }
  // Equal hops of `step` from 0 up to `limit`. With `target` the picture asks
  // whether a hop lands on it; with `range` the landings strictly inside it
  // are picked out. In "hint" the last landing shows as "?".
  | {
      kind: "hops";
      step: number;
      limit: number;
      target?: number;
      range?: readonly [number, number];
      mode: Mode;
    }
  // Formulas stacked, each with an optional tag (see `RowsSpec`).
  | ({ kind: "rows" } & RowsSpec)
  // Lines of a worked example, one more on every step (see `LinesSpec`).
  | ({ kind: "lines" } & LinesSpec)
  // `big` as a multiple and `small` as its divisor, with the equations.
  | { kind: "uocBoi"; big: number; small: number }
  // The ways to write n as a product of two numbers, then its divisors.
  | { kind: "pairs"; n: number; mode: Mode }
  // Numbers (or short sums) the child taps to pick, state { i0, i1, … }. With
  // `wants` (indices of the right chips) and `done` it shows progress and a
  // closing line; without them (an exercise) nothing is revealed.
  | ({ kind: "chips" } & ChipsSpec)
  // Two groups of items packed into bags of `m`, and their sum or difference
  // packed the same way. `bag` names the container ("túi" by default);
  // `countBags` adds the final line "total : m = number of bags" for a story
  // that asks how many containers.
  | {
      kind: "sumBars";
      a: number;
      b: number;
      m: number;
      op: "plus" | "minus";
      mode: Mode;
      bag?: string;
      countBags?: boolean;
    }
  | { kind: "sticker" };

export type SpecKind = VisualSpec["kind"];
export type SpecOf<K extends SpecKind> = Extract<VisualSpec, { kind: K }>;

// Kinds the child acts on (counted as interactive by `--stats`).
export const INTERACTIVE_KINDS: ReadonlySet<SpecKind> = new Set([
  "bagTry",
  "chips",
]);

// Validator id of the `manipulate` exercises each interactive kind serves;
// "chon-dung" is the validator shared with the set lesson's pick screens.
export const VALIDATOR_IDS = { bagTry: "tui", chips: "chon-dung" } as const;

export const VISUAL_SPECS: Readonly<Record<string, VisualSpec>> = {
  "chia-tui-12-3": {
    kind: "bags",
    total: 12,
    size: 3,
    thing: "kẹo",
    unit: "cái",
    bag: "túi",
    mode: "steps",
  },
  "chia-tui-14-3": {
    kind: "bags",
    total: 14,
    size: 3,
    thing: "kẹo",
    unit: "cái",
    bag: "túi",
    mode: "steps",
  },
  "chia-het-12-3": {
    kind: "rows",
    label: "12 bằng 3 nhân 4",
    rows: [
      {
        tex: "\\concept{blue}{12} = \\concept{violet}{3} \\cdot \\concept{amber}{4}",
        tag: { text: "12 chia hết cho 3", color: "teal" },
      },
    ],
    legend: [
      { color: "blue", name: "Số bị chia" },
      { color: "violet", name: "Số chia" },
      { color: "amber", name: "Thương" },
    ],
  },
  "chia-tui-tu-lam-21": { kind: "bagTry", total: 21, goal: true },
  "chia-tui-tu-chon": { kind: "bagTry", total: 24, goal: false },
  "chia-deu-tom-tat": {
    kind: "rows",
    label: "15 bằng 5 nhân 3 nên 15 chia hết cho 5",
    rows: [
      {
        tex: "\\concept{blue}{15} = \\concept{violet}{5} \\cdot \\concept{amber}{3}",
        tag: { text: "15 chia hết cho 5", color: "teal" },
      },
    ],
    legend: [
      { color: "blue", name: "Số bị chia" },
      { color: "violet", name: "Số chia" },
      { color: "amber", name: "Thương" },
    ],
  },
  "chia-tui-goi-y-19-5": {
    kind: "bags",
    total: 19,
    size: 5,
    thing: "kẹo",
    unit: "cái",
    bag: "túi",
    mode: "hint",
  },
  "chia-tui-giai-26-6": {
    kind: "bags",
    total: 26,
    size: 6,
    thing: "bánh",
    unit: "cái",
    bag: "hộp",
    mode: "solution",
  },
  "ky-hieu-doc": {
    kind: "rows",
    label: "Hai cách đọc của dấu chia hết",
    rows: [
      {
        tex: "36 \\chiahet 9",
        tag: { text: "36 chia hết cho 9", color: "teal" },
      },
      {
        tex: "40 \\khongchiahet 6",
        tag: { text: "40 không chia hết cho 6", color: "pink" },
      },
    ],
  },
  "ky-hieu-vi-tri": {
    kind: "rows",
    label: "48 chia hết cho 6, số bị chia đứng trước",
    rows: [{ tex: "\\concept{blue}{48} \\chiahet \\concept{violet}{6}" }],
    legend: [
      { color: "blue", name: "Số bị chia" },
      { color: "violet", name: "Số chia" },
    ],
  },
  "ky-hieu-tom-tat": {
    kind: "rows",
    label: "Dấu chia hết và dấu không chia hết",
    rows: [
      { tex: "24 \\chiahet 4", tag: { text: "chia hết", color: "teal" } },
      {
        tex: "24 \\khongchiahet 5",
        tag: { text: "không chia hết", color: "pink" },
      },
    ],
  },
  "dem-cach-6-42": {
    kind: "hops",
    step: 6,
    limit: 42,
    target: 42,
    mode: "steps",
  },
  "dem-cach-6-40": {
    kind: "hops",
    step: 6,
    limit: 42,
    target: 40,
    mode: "steps",
  },
  "dem-cach-ket-luan": {
    kind: "rows",
    label: "42 bằng 6 nhân 7 nên 42 chia hết cho 6",
    rows: [
      {
        tex: "\\concept{blue}{42} = \\concept{violet}{6} \\cdot \\concept{amber}{7}",
      },
      { tex: "\\concept{blue}{42} \\chiahet \\concept{violet}{6}" },
    ],
    legend: [
      { color: "blue", name: "Số bị chia" },
      { color: "violet", name: "Số chia" },
      { color: "amber", name: "Thương" },
    ],
  },
  "chia-du-52-4": {
    kind: "rows",
    label: "Chia 52 và 53 cho 4 rồi xem số dư",
    rows: [
      { tex: "52 : 4 = 13", tag: { text: "số dư 0", color: "teal" } },
      { tex: "52 = 4 \\cdot 13" },
      { tex: "52 \\chiahet 4" },
      {
        tex: "53 = 4 \\cdot 13 + 1",
        tag: { text: "số dư 1", color: "pink" },
        gapBefore: true,
      },
      { tex: "53 \\khongchiahet 4" },
    ],
  },
  "kiem-tra-tom-tat": {
    kind: "rows",
    label: "72 chia 8 được 9, số dư 0 nên 72 chia hết cho 8",
    rows: [
      { tex: "72 : 8 = 9", tag: { text: "số dư 0", color: "teal" } },
      { tex: "72 \\chiahet 8" },
    ],
  },
  "dem-cach-goi-y-7-37": {
    kind: "hops",
    step: 7,
    limit: 42,
    target: 37,
    mode: "hint",
  },
  "dem-cach-giai-7-59": {
    kind: "hops",
    step: 7,
    limit: 63,
    target: 59,
    mode: "steps",
  },
  "uoc-boi-18-6": { kind: "uocBoi", big: 18, small: 6 },
  "uoc-boi-tom-tat": { kind: "uocBoi", big: 15, small: 3 },
  "tim-uoc-12": { kind: "pairs", n: 12, mode: "steps" },
  "tim-uoc-18": { kind: "pairs", n: 18, mode: "still" },
  "chon-uoc-20-cung-lam": {
    kind: "chips",
    items: ["1", "2", "3", "4", "5", "8", "10", "20"],
    wants: [0, 1, 3, 4, 6, 7],
    done: "Xong rồi! 1, 2, 4, 5, 10 và 20 đều là ước của 20.",
  },
  "chon-uoc-16": {
    kind: "chips",
    items: ["1", "2", "3", "4", "6", "8", "12", "16"],
  },
  "tim-uoc-tom-tat": { kind: "pairs", n: 15, mode: "still" },
  "tim-uoc-goi-y-30": { kind: "pairs", n: 30, mode: "hint" },
  "tim-uoc-giai-28": { kind: "pairs", n: 28, mode: "steps" },
  "tim-boi-4": { kind: "hops", step: 4, limit: 24, mode: "steps" },
  "tim-boi-6-khoang": {
    kind: "hops",
    step: 6,
    limit: 42,
    range: [20, 40],
    mode: "steps",
  },
  "chon-boi-5-cung-lam": {
    kind: "chips",
    items: ["10", "12", "15", "18", "25", "30", "33", "40"],
    wants: [0, 2, 4, 5, 7],
    done: "Xong rồi! 10, 15, 25, 30 và 40 đều là bội của 5.",
  },
  "chon-boi-7-chon": {
    kind: "chips",
    items: ["12", "14", "21", "24", "28", "35", "40", "42"],
  },
  "tim-boi-tom-tat": { kind: "hops", step: 10, limit: 50, mode: "still" },
  "tim-boi-goi-y-5": {
    kind: "hops",
    step: 5,
    limit: 35,
    range: [12, 25],
    mode: "steps",
  },
  "tim-boi-giai-8": {
    kind: "hops",
    step: 8,
    limit: 48,
    range: [30, 40],
    mode: "steps",
  },
  "tong-12-18-6": {
    kind: "sumBars",
    a: 12,
    b: 18,
    m: 6,
    op: "plus",
    mode: "steps",
  },
  "tong-chia-het-ba-dong": {
    kind: "rows",
    label: "12 và 18 chia hết cho 6 nên tổng chia hết cho 6",
    rows: [
      { tex: "\\concept{blue}{12} \\chiahet \\concept{violet}{6}" },
      { tex: "\\concept{blue}{18} \\chiahet \\concept{violet}{6}" },
      {
        tex: "(\\concept{blue}{12} + \\concept{blue}{18}) \\chiahet \\concept{violet}{6}",
        tag: { text: "tổng chia hết", color: "teal" },
      },
    ],
    legend: [
      { color: "blue", name: "Số hạng" },
      { color: "violet", name: "Số chia" },
    ],
  },
  "tong-ba-so-hang": {
    kind: "rows",
    label: "8, 12 và 20 chia hết cho 4 nên tổng chia hết cho 4",
    rows: [
      { tex: "8 \\chiahet 4" },
      { tex: "12 \\chiahet 4" },
      { tex: "20 \\chiahet 4" },
      {
        tex: "(8 + 12 + 20) \\chiahet 4",
        tag: { text: "tổng chia hết", color: "teal" },
      },
    ],
  },
  "chon-tong-5": {
    kind: "chips",
    items: ["30 + 45", "30 + 12", "20 + 35", "25 + 8"],
    wants: [0, 2],
    done: "Xong rồi! 30, 45, 20 và 35 đều chia hết cho 5 nên hai tổng đó chia hết cho 5.",
  },
  "tong-chia-het-tom-tat": {
    kind: "sumBars",
    a: 6,
    b: 9,
    m: 3,
    op: "plus",
    mode: "still",
  },
  "tong-goi-y-8-12": {
    kind: "sumBars",
    a: 8,
    b: 12,
    m: 4,
    op: "plus",
    mode: "hint",
  },
  "tong-giai-10-20": {
    kind: "sumBars",
    a: 10,
    b: 20,
    m: 5,
    op: "plus",
    mode: "steps",
    bag: "hộp",
    countBags: true,
  },
  "tong-10-7-5": {
    kind: "sumBars",
    a: 10,
    b: 7,
    m: 5,
    op: "plus",
    mode: "steps",
  },
  "tong-khong-ba-dong": {
    kind: "rows",
    label:
      "10 chia hết cho 5, 7 không chia hết cho 5 nên tổng không chia hết cho 5",
    rows: [
      { tex: "10 \\chiahet 5", tag: { text: "chia hết", color: "teal" } },
      {
        tex: "7 \\khongchiahet 5",
        tag: { text: "không chia hết", color: "pink" },
      },
      {
        tex: "(10 + 7) \\khongchiahet 5",
        tag: { text: "tổng không chia hết", color: "pink" },
      },
    ],
  },
  "tong-ba-khong": {
    kind: "rows",
    label:
      "20 và 15 chia hết cho 5, 8 không chia hết cho 5 nên tổng không chia hết cho 5",
    rows: [
      { tex: "20 \\chiahet 5" },
      { tex: "15 \\chiahet 5" },
      {
        tex: "8 \\khongchiahet 5",
        tag: { text: "không chia hết", color: "pink" },
      },
      {
        tex: "(20 + 15 + 8) \\khongchiahet 5",
        tag: { text: "tổng không chia hết", color: "pink" },
      },
    ],
  },
  "chon-tong-khong-4": {
    kind: "chips",
    items: ["8 + 12", "8 + 10", "16 + 6", "20 + 28"],
    wants: [1, 2],
    done: "Xong rồi! 10 và 6 không chia hết cho 4 nên hai tổng đó không chia hết cho 4.",
  },
  "tong-khong-tom-tat": {
    kind: "sumBars",
    a: 8,
    b: 3,
    m: 4,
    op: "plus",
    mode: "still",
  },
  "hieu-goi-y-22-8": {
    kind: "sumBars",
    a: 22,
    b: 8,
    m: 4,
    op: "minus",
    mode: "hint",
  },
  "hieu-36-12-6": {
    kind: "sumBars",
    a: 36,
    b: 12,
    m: 6,
    op: "minus",
    mode: "steps",
  },
  "hieu-chia-het-ba-dong": {
    kind: "rows",
    label: "36 và 12 chia hết cho 6 nên hiệu chia hết cho 6",
    rows: [
      { tex: "36 \\chiahet \\concept{violet}{6}" },
      { tex: "12 \\chiahet \\concept{violet}{6}" },
      {
        tex: "(36 - 12) \\chiahet \\concept{violet}{6}",
        tag: { text: "hiệu chia hết", color: "teal" },
      },
    ],
    legend: [{ color: "violet", name: "Số chia" }],
  },
  "chon-hieu-6": {
    kind: "chips",
    items: ["48 − 18", "48 − 20", "30 − 12", "24 − 10"],
    wants: [0, 2],
    done: "Xong rồi! 48, 18, 30 và 12 đều chia hết cho 6 nên hai hiệu đó chia hết cho 6.",
  },
  "hieu-chia-het-tom-tat": {
    kind: "sumBars",
    a: 20,
    b: 8,
    m: 4,
    op: "minus",
    mode: "still",
  },
  "hieu-24-10-6": {
    kind: "sumBars",
    a: 24,
    b: 10,
    m: 6,
    op: "minus",
    mode: "steps",
  },
  "hieu-khong-ba-dong": {
    kind: "rows",
    label:
      "24 chia hết cho 6, 10 không chia hết cho 6 nên hiệu không chia hết cho 6",
    rows: [
      { tex: "24 \\chiahet 6", tag: { text: "chia hết", color: "teal" } },
      {
        tex: "10 \\khongchiahet 6",
        tag: { text: "không chia hết", color: "pink" },
      },
      {
        tex: "(24 - 10) \\khongchiahet 6",
        tag: { text: "hiệu không chia hết", color: "pink" },
      },
    ],
  },
  "hieu-31-12": {
    kind: "lines",
    label:
      "31 không chia hết cho 6, 12 chia hết cho 6 nên hiệu không chia hết cho 6",
    mode: "steps",
    rows: [
      {
        tex: "31 \\khongchiahet 6",
        tag: { text: "không chia hết", color: "pink" },
      },
      { tex: "12 \\chiahet 6", tag: { text: "chia hết", color: "teal" } },
      {
        tex: "(31 - 12) \\khongchiahet 6",
        tag: { text: "hiệu không chia hết", color: "pink" },
      },
    ],
  },
  "hieu-khong-tom-tat": {
    kind: "sumBars",
    a: 18,
    b: 4,
    m: 3,
    op: "minus",
    mode: "still",
  },
  "tim-x-mau": {
    kind: "lines",
    label: "Tổng A bằng 20 cộng 36 cộng x, hai số hạng đã biết chia hết cho 4",
    mode: "steps",
    rows: [
      { tex: "A = 20 + 36 + x" },
      { tex: "20 \\chiahet 4" },
      { tex: "36 \\chiahet 4" },
    ],
  },
  "tim-x-ket-luan": {
    kind: "rows",
    label: "x chia hết hay không chia hết cho 4 quyết định tổng A",
    rows: [
      {
        tex: "x \\chiahet 4",
        tag: { text: "A chia hết cho 4", color: "teal" },
      },
      {
        tex: "x \\khongchiahet 4",
        tag: { text: "A không chia hết cho 4", color: "pink" },
      },
    ],
  },
  "chon-x-12-18": {
    kind: "chips",
    items: ["3", "6", "9", "12", "14", "30"],
    wants: [1, 3, 5],
    done: "Xong rồi! 6, 12 và 30 chia hết cho 6, nên các tổng đó chia hết cho 6.",
  },
  "tim-x-khong-chia-het": {
    kind: "lines",
    label:
      "Tổng 15 cộng 25 cộng x không chia hết cho 5 khi x không chia hết cho 5",
    mode: "steps",
    rows: [
      { tex: "B = 15 + 25 + x" },
      { tex: "15 \\chiahet 5" },
      { tex: "25 \\chiahet 5" },
      {
        tex: "x \\khongchiahet 5",
        tag: { text: "B không chia hết cho 5", color: "pink" },
      },
    ],
  },
  "tim-x-tom-tat": {
    kind: "lines",
    label: "Tổng 6 cộng 21 cộng x chia hết cho 3 khi x chia hết cho 3",
    mode: "still",
    rows: [
      { tex: "C = 6 + 21 + x" },
      { tex: "6 \\chiahet 3" },
      { tex: "21 \\chiahet 3" },
      {
        tex: "x \\chiahet 3",
        tag: { text: "C chia hết cho 3", color: "teal" },
      },
    ],
  },
  "tim-x-goi-y-16-24": {
    kind: "lines",
    label: "Tổng 16 cộng 24 cộng x chia hết cho 8 khi x chia hết cho 8",
    mode: "hint",
    rows: [
      { tex: "D = 16 + 24 + x" },
      { tex: "16 \\chiahet 8" },
      { tex: "24 \\chiahet 8" },
      {
        tex: "x \\chiahet 8",
        tag: { text: "D chia hết cho 8", color: "teal" },
      },
    ],
  },
  "tim-x-giai-18-24": {
    kind: "lines",
    label: "Tổng 18 cộng 24 cộng x chia hết cho 6 khi x chia hết cho 6",
    mode: "steps",
    rows: [
      { tex: "18 + 24 + x" },
      { tex: "18 \\chiahet 6" },
      { tex: "24 \\chiahet 6" },
      {
        tex: "x \\chiahet 6",
        tag: { text: "tổng chia hết cho 6", color: "teal" },
      },
      {
        tex: "x = 6",
        tag: { text: "bội khác 0 nhỏ nhất của 6", color: "blue" },
      },
    ],
  },
  "so-du-34-10": {
    kind: "bags",
    total: 34,
    size: 10,
    thing: "bi",
    unit: "viên",
    bag: "túi",
    mode: "steps",
    openTotal: true,
  },
  "so-du-dang": {
    kind: "rows",
    label: "a bằng 10 nhân q cộng 4",
    rows: [
      {
        tex: "\\concept{blue}{a} = \\concept{violet}{10} \\cdot \\concept{amber}{q} + \\concept{pink}{4}",
      },
    ],
    legend: [
      { color: "blue", name: "Số bị chia" },
      { color: "violet", name: "Số chia" },
      { color: "amber", name: "Thương" },
      { color: "pink", name: "Số dư" },
    ],
  },
  "so-du-chia-het-2": {
    kind: "lines",
    label: "10 nhân q và 4 đều chia hết cho 2 nên a chia hết cho 2",
    mode: "steps",
    rows: [
      { tex: "10 \\cdot q = 2 \\cdot (5 \\cdot q)" },
      { tex: "10 \\cdot q \\chiahet 2" },
      { tex: "4 \\chiahet 2" },
      {
        tex: "a \\chiahet 2",
        tag: { text: "a chia hết cho 2", color: "teal" },
      },
    ],
  },
  "so-du-khong-chia-het-5": {
    kind: "lines",
    label:
      "10 nhân q chia hết cho 5, số dư 4 không, nên a không chia hết cho 5",
    mode: "steps",
    rows: [
      { tex: "10 \\cdot q = 5 \\cdot (2 \\cdot q)" },
      { tex: "10 \\cdot q \\chiahet 5" },
      { tex: "4 \\khongchiahet 5" },
      {
        tex: "a \\khongchiahet 5",
        tag: { text: "a không chia hết cho 5", color: "pink" },
      },
    ],
  },
  "so-du-tom-tat": {
    kind: "lines",
    label: "6 nhân q và 2 đều chia hết cho 2 nên a chia hết cho 2",
    mode: "still",
    rows: [
      { tex: "a = 6 \\cdot q + 2" },
      { tex: "6 \\cdot q \\chiahet 2" },
      { tex: "2 \\chiahet 2" },
      {
        tex: "a \\chiahet 2",
        tag: { text: "a chia hết cho 2", color: "teal" },
      },
    ],
  },
  "so-du-goi-y-15-10": {
    kind: "lines",
    label: "a bằng 15 nhân q cộng 10, xét cho 5",
    mode: "hint",
    rows: [
      { tex: "a = 15 \\cdot q + 10" },
      { tex: "15 \\cdot q \\chiahet 5" },
      { tex: "10 \\chiahet 5" },
      {
        tex: "a \\chiahet 5",
        tag: { text: "a chia hết cho 5", color: "teal" },
      },
    ],
  },
  "so-du-giai-12-9": {
    kind: "lines",
    label: "12 nhân q chia hết cho 3, số dư 9 cũng chia hết cho 3",
    mode: "steps",
    rows: [
      { tex: "a = 12 \\cdot q + 9" },
      { tex: "12 \\cdot q \\chiahet 3" },
      { tex: "9 \\chiahet 3" },
      {
        tex: "a \\chiahet 3",
        tag: { text: "a chia hết cho 3", color: "teal" },
      },
    ],
  },
  "nhom-5-mu": {
    kind: "lines",
    label:
      "Nhóm 5 cộng 5 bình phương, rồi 5 mũ 3 cộng 5 mũ 4, mỗi nhóm có thừa số 6",
    mode: "steps",
    rows: [
      { tex: "5 + 5^{2} + 5^{3} + 5^{4}" },
      { tex: "= (5 + 5^{2}) + (5^{3} + 5^{4})" },
      { tex: "5^{4} = 5^{3} \\cdot 5", aside: true },
      { tex: "= 5 \\cdot (1 + 5) + 5^{3} \\cdot (1 + 5)" },
      { tex: "= 5 \\cdot 6 + 5^{3} \\cdot 6" },
      {
        tex: "(5 + 5^{2} + 5^{3} + 5^{4}) \\chiahet 6",
        tag: { text: "chia hết cho 6", color: "teal" },
      },
    ],
  },
  "nhom-2-mu": {
    kind: "lines",
    label: "Thử với cơ số 2: mỗi nhóm có thừa số 3",
    mode: "steps",
    rows: [
      { tex: "2 + 2^{2} + 2^{3} + 2^{4}" },
      { tex: "= (2 + 2^{2}) + (2^{3} + 2^{4})" },
      { tex: "2^{4} = 2^{3} \\cdot 2", aside: true },
      { tex: "= 2 \\cdot (1 + 2) + 2^{3} \\cdot (1 + 2)" },
      { tex: "= 2 \\cdot 3 + 2^{3} \\cdot 3" },
      {
        tex: "(2 + 2^{2} + 2^{3} + 2^{4}) \\chiahet 3",
        tag: { text: "chia hết cho 3", color: "teal" },
      },
    ],
  },
  "nhom-so-hang-tom-tat": {
    kind: "lines",
    label: "7 cộng 7 bình phương bằng 7 nhân 8",
    mode: "still",
    rows: [
      { tex: "7 + 7^{2} = 7 \\cdot (1 + 7)" },
      { tex: "= 7 \\cdot 8" },
      {
        tex: "(7 + 7^{2}) \\chiahet 8",
        tag: { text: "chia hết cho 8", color: "teal" },
      },
    ],
  },
  "nhom-goi-y-2": {
    kind: "lines",
    label: "2 bình phương cộng 2 lập phương bằng 2 bình phương nhân 3",
    mode: "hint",
    rows: [
      { tex: "2^{2} + 2^{3} = 2^{2} \\cdot (1 + 2)" },
      { tex: "= 2^{2} \\cdot 3" },
      {
        tex: "(2^{2} + 2^{3}) \\chiahet 3",
        tag: { text: "chia hết cho 3", color: "teal" },
      },
    ],
  },
  "nhom-goi-y-3": {
    kind: "lines",
    label: "3 cộng 3 bình phương bằng 3 nhân 4",
    mode: "hint",
    rows: [
      { tex: "3 + 3^{2} = 3 \\cdot (1 + 3)" },
      { tex: "= 3 \\cdot 4" },
      {
        tex: "(3 + 3^{2}) \\chiahet 4",
        tag: { text: "chia hết cho 4", color: "teal" },
      },
    ],
  },
  "nhom-giai-8": {
    kind: "lines",
    label: "8 cộng 8 bình phương bằng 8 nhân 9",
    mode: "steps",
    rows: [
      { tex: "8 + 8^{2} = 8 \\cdot (1 + 8)" },
      { tex: "= 8 \\cdot 9" },
      {
        tex: "(8 + 8^{2}) \\chiahet 9",
        tag: { text: "chia hết cho 9", color: "teal" },
      },
    ],
  },
  sticker: { kind: "sticker" },
};
