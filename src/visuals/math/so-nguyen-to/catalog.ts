import type { Mode } from "@/visuals/shared/formula-rows";
import type { LinesSpec, RowsSpec } from "@/visuals/shared/formula-rows";
import type { ChipsSpec } from "@/visuals/shared/pick-chips";
import type { TreeNode } from "./logic";

// Every picture of the lesson that is drawn from numbers: the registry builds
// one entry per item (id `so-nguyen-to.visual.<key>`), so a new example is
// one item here and its id in lesson.json. Pure data, no React, so
// `content:check` reads it.

export { LESSON_SLUG } from "./logic";

export type VisualSpec =
  // Formulas stacked, each with an optional tag (see `RowsSpec`).
  | ({ kind: "rows" } & RowsSpec)
  // Lines of a worked example, one more on every step (see `LinesSpec`).
  | ({ kind: "lines" } & LinesSpec)
  // Numbers the child taps to pick, state { i0, i1, … } (see `ChipsSpec`).
  | ({ kind: "chips" } & ChipsSpec)
  // The ways to lay `n` squares into a rectangle, as [rows, squares per row],
  // then the divisors they give and, with a `verdict`, whether `n` is prime
  // or composite. In "hint" the divisors stay a "?".
  | {
      kind: "rects";
      n: number;
      ways: readonly (readonly [number, number])[];
      mode: Mode;
      verdict?: "prime" | "composite";
    }
  // The table of 1..100 with the multiples of 2, 3, 5 and 7 crossed out one
  // prime at a time ("steps"), or the finished table of primes ("still").
  | { kind: "sieve"; mode: "steps" | "still" }
  // A factor tree of `root`. `hide` lists nodes (drawing order) shown as "?";
  // in "hint" the last level and the product stay "?".
  | { kind: "tree"; root: TreeNode; hide: readonly number[]; mode: Mode }
  // The division column of `n`. `hide` lists cells (value 0, prime 1, next
  // value 2, …) shown as "?"; in "hint" the product stays "?".
  | { kind: "column"; n: number; hide: readonly number[]; mode: Mode }
  | { kind: "sticker" };

export type SpecKind = VisualSpec["kind"];
export type SpecOf<K extends SpecKind> = Extract<VisualSpec, { kind: K }>;

// Kinds the child acts on (counted as interactive by `--stats`).
export const INTERACTIVE_KINDS: ReadonlySet<SpecKind> = new Set(["chips"]);

// Validator id of the `manipulate` exercises each interactive kind serves;
// "chon-dung" is the validator shared with the set lesson's pick screens.
export const VALIDATOR_IDS = { chips: "chon-dung" } as const;

export const VISUAL_SPECS: Readonly<Record<string, VisualSpec>> = {
  "xep-16": {
    kind: "rects",
    n: 16,
    ways: [
      [1, 16],
      [2, 8],
      [4, 4],
    ],
    mode: "steps",
  },
  "xep-16-xong": {
    kind: "rects",
    n: 16,
    ways: [
      [1, 16],
      [2, 8],
      [4, 4],
    ],
    mode: "still",
  },
  "xep-8": {
    kind: "rects",
    n: 8,
    ways: [
      [1, 8],
      [2, 4],
    ],
    mode: "steps",
  },
  "chon-uoc-10": {
    kind: "chips",
    items: ["1", "2", "3", "4", "5", "10"],
    wants: [0, 1, 4, 5],
    done: "Bạn đã chọn đủ các ước của 10.",
  },
  "goi-y-xep-10": {
    kind: "rects",
    n: 10,
    ways: [
      [1, 10],
      [2, 5],
    ],
    mode: "hint",
  },
  "giai-xep-15": {
    kind: "rects",
    n: 15,
    ways: [
      [1, 15],
      [3, 5],
    ],
    mode: "solution",
  },
  "chon-uoc-18": {
    kind: "chips",
    items: ["1", "2", "4", "6", "9", "12", "18"],
  },
  "xep-11": {
    kind: "rects",
    n: 11,
    ways: [[1, 11]],
    mode: "steps",
    verdict: "prime",
  },
  "ngto-dau": {
    kind: "rows",
    label: "Các số nguyên tố đầu tiên và ước của chúng",
    rows: [
      {
        tex: "1,\\ 2",
        tag: {
          text: "Ước của 2",
          color: "sky",
        },
      },
      {
        tex: "1,\\ 3",
        tag: {
          text: "Ước của 3",
          color: "sky",
        },
      },
      {
        tex: "1,\\ 5",
        tag: {
          text: "Ước của 5",
          color: "sky",
        },
      },
      {
        tex: "1,\\ 7",
        tag: {
          text: "Ước của 7",
          color: "sky",
        },
      },
    ],
    legend: [
      {
        color: "sky",
        name: "Số nguyên tố",
      },
    ],
  },
  "chon-nt-2-7": {
    kind: "chips",
    items: ["2", "3", "4", "5", "6", "7"],
    wants: [0, 1, 3, 5],
    done: "Bạn đã chọn đủ các số nguyên tố.",
  },
  "chon-nt-bank": {
    kind: "chips",
    items: ["3", "9", "12", "19", "21", "23"],
  },
  "xep-9": {
    kind: "rects",
    n: 9,
    ways: [
      [1, 9],
      [3, 3],
    ],
    mode: "steps",
    verdict: "composite",
  },
  "so-sanh-nt-hs": {
    kind: "rows",
    label: "Ước của 7 và ước của 6",
    rows: [
      {
        tex: "1,\\ 7",
        tag: {
          text: "Ước của 7: hai ước",
          color: "sky",
        },
      },
      {
        tex: "1,\\ 2,\\ 3,\\ 6",
        tag: {
          text: "Ước của 6: bốn ước",
          color: "pink",
        },
      },
    ],
    legend: [
      {
        color: "sky",
        name: "Số nguyên tố",
      },
      {
        color: "pink",
        name: "Hợp số",
      },
    ],
  },
  "uoc-cua-1": {
    kind: "rows",
    label: "Ước của số 1",
    rows: [
      {
        tex: "1",
        tag: {
          text: "Ước của 1: chỉ có một ước",
          color: "violet",
        },
      },
    ],
  },
  "chon-hs-1": {
    kind: "chips",
    items: ["2", "4", "5", "8", "9", "11"],
    wants: [1, 3, 4],
    done: "Bạn đã chọn đủ các hợp số.",
  },
  "chon-hs-bank": {
    kind: "chips",
    items: ["6", "7", "12", "13", "15", "17"],
  },
  "sang-100": {
    kind: "sieve",
    mode: "steps",
  },
  "bang-100": {
    kind: "sieve",
    mode: "still",
  },
  "chon-nt-bang": {
    kind: "chips",
    items: ["21", "23", "27", "29", "33", "39"],
    wants: [1, 3],
    done: "Bạn đã chọn đủ các số nguyên tố.",
  },
  "chon-nt-bang-2": {
    kind: "chips",
    items: ["61", "63", "67", "69", "81", "89"],
  },
  "xet-65": {
    kind: "lines",
    label: "Số 65 là hợp số vì chia hết cho 5",
    rows: [
      {
        tex: "65 \\chiahet 5",
        tag: {
          text: "Tận cùng là 5",
          color: "teal",
        },
      },
      {
        tex: "65 > 5",
      },
      {
        tex: "\\concept{pink}{65}",
        tag: {
          text: "Hợp số",
          color: "pink",
        },
      },
    ],
    mode: "steps",
  },
  "xet-65-xong": {
    kind: "lines",
    label: "Số 65 là hợp số vì chia hết cho 5",
    rows: [
      {
        tex: "65 \\chiahet 5",
        tag: {
          text: "Tận cùng là 5",
          color: "teal",
        },
      },
      {
        tex: "65 > 5",
      },
      {
        tex: "\\concept{pink}{65}",
        tag: {
          text: "Hợp số",
          color: "pink",
        },
      },
    ],
    mode: "still",
  },
  "xet-51": {
    kind: "lines",
    label: "Số 51 là hợp số vì chia hết cho 3",
    rows: [
      {
        tex: "5 + 1 = 6",
        tag: {
          text: "Tổng các chữ số",
          color: "lime",
        },
      },
      {
        tex: "51 \\chiahet 3",
      },
      {
        tex: "51 > 3",
      },
      {
        tex: "\\concept{pink}{51}",
        tag: {
          text: "Hợp số",
          color: "pink",
        },
      },
    ],
    mode: "steps",
  },
  "chon-hs-dh": {
    kind: "chips",
    items: ["39", "41", "55", "67", "70"],
    wants: [0, 2, 4],
    done: "Bạn đã chọn đủ các hợp số.",
  },
  "chon-hs-dh-2": {
    kind: "chips",
    items: ["13", "24", "29", "45", "53", "60"],
  },
  "cay-12": {
    kind: "tree",
    root: {
      n: 12,
      kids: [
        {
          n: 3,
        },
        {
          n: 4,
          kids: [
            {
              n: 2,
            },
            {
              n: 2,
            },
          ],
        },
      ],
    },
    hide: [],
    mode: "steps",
  },
  "cay-12-xong": {
    kind: "tree",
    root: {
      n: 12,
      kids: [
        {
          n: 3,
        },
        {
          n: 4,
          kids: [
            {
              n: 2,
            },
            {
              n: 2,
            },
          ],
        },
      ],
    },
    hide: [],
    mode: "still",
  },
  "cay-30": {
    kind: "tree",
    root: {
      n: 30,
      kids: [
        {
          n: 2,
        },
        {
          n: 15,
          kids: [
            {
              n: 3,
            },
            {
              n: 5,
            },
          ],
        },
      ],
    },
    hide: [],
    mode: "steps",
  },
  "cay-18": {
    kind: "tree",
    root: {
      n: 18,
      kids: [
        {
          n: 2,
        },
        {
          n: 9,
          kids: [
            {
              n: 3,
            },
            {
              n: 3,
            },
          ],
        },
      ],
    },
    hide: [],
    mode: "steps",
  },
  "cay-thieu-28": {
    kind: "tree",
    root: {
      n: 28,
      kids: [
        {
          n: 4,
          kids: [
            {
              n: 2,
            },
            {
              n: 2,
            },
          ],
        },
        {
          n: 7,
        },
      ],
    },
    hide: [4],
    mode: "still",
  },
  "goi-y-cay-40": {
    kind: "tree",
    root: {
      n: 40,
      kids: [
        {
          n: 4,
          kids: [
            {
              n: 2,
            },
            {
              n: 2,
            },
          ],
        },
        {
          n: 10,
          kids: [
            {
              n: 2,
            },
            {
              n: 5,
            },
          ],
        },
      ],
    },
    hide: [],
    mode: "hint",
  },
  "giai-cay-28": {
    kind: "tree",
    root: {
      n: 28,
      kids: [
        {
          n: 4,
          kids: [
            {
              n: 2,
            },
            {
              n: 2,
            },
          ],
        },
        {
          n: 7,
        },
      ],
    },
    hide: [],
    mode: "solution",
  },
  "cay-thieu-45": {
    kind: "tree",
    root: {
      n: 45,
      kids: [
        {
          n: 5,
        },
        {
          n: 9,
          kids: [
            {
              n: 3,
            },
            {
              n: 3,
            },
          ],
        },
      ],
    },
    hide: [2],
    mode: "still",
  },
  "giai-cay-45": {
    kind: "tree",
    root: {
      n: 45,
      kids: [
        {
          n: 5,
        },
        {
          n: 9,
          kids: [
            {
              n: 3,
            },
            {
              n: 3,
            },
          ],
        },
      ],
    },
    hide: [],
    mode: "solution",
  },
  "cot-60": {
    kind: "column",
    n: 60,
    hide: [],
    mode: "steps",
  },
  "cot-60-xong": {
    kind: "column",
    n: 60,
    hide: [],
    mode: "still",
  },
  "cot-84": {
    kind: "column",
    n: 84,
    hide: [],
    mode: "steps",
  },
  "cot-105": {
    kind: "column",
    n: 105,
    hide: [],
    mode: "steps",
  },
  "cot-thieu-36": {
    kind: "column",
    n: 36,
    hide: [2],
    mode: "still",
  },
  "goi-y-cot-90": {
    kind: "column",
    n: 90,
    hide: [],
    mode: "hint",
  },
  "giai-cot-36": {
    kind: "column",
    n: 36,
    hide: [],
    mode: "solution",
  },
  "cot-thieu-150": {
    kind: "column",
    n: 150,
    hide: [3],
    mode: "still",
  },
  "giai-cot-150": {
    kind: "column",
    n: 150,
    hide: [],
    mode: "solution",
  },
  "gon-60": {
    kind: "lines",
    label: "60 viết gọn bằng luỹ thừa",
    rows: [
      {
        tex: "60 = \\concept{sky}{2} \\cdot \\concept{sky}{2} \\cdot \\concept{sky}{3} \\cdot \\concept{sky}{5}",
        tag: {
          text: "Tích các thừa số nguyên tố",
          color: "amber",
        },
      },
      {
        tex: "60 = \\concept{sky}{2}^{2} \\cdot \\concept{sky}{3} \\cdot \\concept{sky}{5}",
        tag: {
          text: "Viết gọn",
          color: "amber",
        },
      },
    ],
    mode: "steps",
  },
  "gon-72": {
    kind: "lines",
    label: "72 viết gọn bằng luỹ thừa",
    rows: [
      {
        tex: "72 = \\concept{sky}{2} \\cdot \\concept{sky}{2} \\cdot \\concept{sky}{2} \\cdot \\concept{sky}{3} \\cdot \\concept{sky}{3}",
        tag: {
          text: "Tích các thừa số nguyên tố",
          color: "amber",
        },
      },
      {
        tex: "72 = \\concept{sky}{2}^{3} \\cdot \\concept{sky}{3}^{2}",
        tag: {
          text: "Viết gọn",
          color: "amber",
        },
      },
    ],
    mode: "steps",
  },
  "gon-72-xong": {
    kind: "lines",
    label: "72 viết gọn bằng luỹ thừa",
    rows: [
      {
        tex: "72 = \\concept{sky}{2} \\cdot \\concept{sky}{2} \\cdot \\concept{sky}{2} \\cdot \\concept{sky}{3} \\cdot \\concept{sky}{3}",
        tag: {
          text: "Tích các thừa số nguyên tố",
          color: "amber",
        },
      },
      {
        tex: "72 = \\concept{sky}{2}^{3} \\cdot \\concept{sky}{3}^{2}",
        tag: {
          text: "Viết gọn",
          color: "amber",
        },
      },
    ],
    mode: "still",
  },
  "gon-6-6-5": {
    kind: "lines",
    label: "Phân tích 6 · 6 · 5 ra thừa số nguyên tố",
    rows: [
      {
        tex: "6 \\cdot 6 \\cdot 5 = 2 \\cdot 3 \\cdot 2 \\cdot 3 \\cdot 5",
      },
      {
        tex: "= 2 \\cdot 2 \\cdot 3 \\cdot 3 \\cdot 5",
      },
      {
        tex: "= \\concept{sky}{2}^{2} \\cdot \\concept{sky}{3}^{2} \\cdot \\concept{sky}{5}",
        tag: {
          text: "Viết gọn",
          color: "amber",
        },
      },
    ],
    mode: "steps",
  },
  "thu-3a": {
    kind: "rows",
    label: "Các số 3a với a từ 0 đến 9",
    rows: [
      {
        tex: "30,\\ 32,\\ 33,\\ 34,\\ 35,\\ 36,\\ 38,\\ 39",
        tag: {
          text: "Hợp số, không có trong bảng",
          color: "pink",
        },
      },
      {
        tex: "31,\\ 37",
        tag: {
          text: "Số nguyên tố, có trong bảng",
          color: "sky",
        },
      },
    ],
    legend: [
      {
        color: "sky",
        name: "Số nguyên tố",
      },
      {
        color: "pink",
        name: "Hợp số",
      },
    ],
  },
  "chon-a-6": {
    kind: "chips",
    items: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    wants: [1, 7],
    done: "Bạn đã chọn đủ các chữ số a.",
  },
  "chon-a-1": {
    kind: "chips",
    items: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  },
  "chan-le": {
    kind: "rows",
    label: "Số chẵn và số lẻ",
    rows: [
      {
        tex: "2,\\ 4,\\ 6,\\ 8,\\ 10",
        tag: {
          text: "Số chẵn: chia hết cho 2",
          color: "slate",
        },
      },
      {
        tex: "1,\\ 3,\\ 5,\\ 7,\\ 9",
        tag: {
          text: "Số lẻ: không chia hết cho 2",
          color: "slate",
        },
      },
    ],
  },
  "chan-nt": {
    kind: "rows",
    label: "Số 2 và các số chẵn lớn hơn 2",
    rows: [
      {
        tex: "\\concept{sky}{2}",
        tag: {
          text: "Số nguyên tố chẵn",
          color: "sky",
        },
      },
      {
        tex: "4,\\ 6,\\ 8,\\ 10",
        tag: {
          text: "Số chẵn lớn hơn 2: hợp số",
          color: "pink",
        },
      },
    ],
    legend: [
      {
        color: "sky",
        name: "Số nguyên tố",
      },
      {
        color: "pink",
        name: "Hợp số",
      },
    ],
  },
  "chon-chan-hs": {
    kind: "chips",
    items: ["2", "4", "6", "9", "12", "13"],
    wants: [1, 2, 4],
    done: "Bạn đã chọn đủ các số chẵn là hợp số.",
  },
  "chon-chan-lon": {
    kind: "chips",
    items: ["2", "3", "14", "15", "16", "17"],
  },
  "le-le": {
    kind: "rows",
    label: "Tổng của hai số lẻ và tổng có số 2",
    rows: [
      {
        tex: "3 + 5 = 8",
        tag: {
          text: "Lẻ cộng lẻ là chẵn",
          color: "slate",
        },
      },
      {
        tex: "7 + 11 = 18",
        tag: {
          text: "Lẻ cộng lẻ là chẵn",
          color: "slate",
        },
      },
      {
        tex: "2 + 19 = 21",
        tag: {
          text: "Có số 2: tổng là số lẻ",
          color: "sky",
        },
      },
    ],
  },
  "tong-25": {
    kind: "lines",
    label: "25 viết thành tổng của hai số nguyên tố",
    rows: [
      {
        tex: "25 - 2 = 23",
      },
      {
        tex: "\\concept{sky}{23}",
        tag: {
          text: "23 có trong bảng: số nguyên tố",
          color: "sky",
        },
      },
      {
        tex: "25 = \\concept{sky}{2} + \\concept{sky}{23}",
        tag: {
          text: "Tổng hai số nguyên tố",
          color: "amber",
        },
      },
    ],
    mode: "steps",
  },
  "tong-27": {
    kind: "lines",
    label: "27 không viết được thành tổng của hai số nguyên tố",
    rows: [
      {
        tex: "27 - 2 = 25",
      },
      {
        tex: "25 \\chiahet 5",
      },
      {
        tex: "\\concept{pink}{25}",
        tag: {
          text: "Hợp số, không có trong bảng",
          color: "pink",
        },
      },
    ],
    mode: "steps",
  },
  "viet-20": {
    kind: "lines",
    label: "20 viết thành tổng của hai số nguyên tố",
    rows: [
      {
        tex: "20 - 2 = 18",
        tag: {
          text: "18 là hợp số: bỏ",
          color: "pink",
        },
        muted: true,
      },
      {
        tex: "20 - 3 = 17",
        tag: {
          text: "17 là số nguyên tố",
          color: "sky",
        },
      },
      {
        tex: "20 = \\concept{sky}{3} + \\concept{sky}{17}",
        tag: {
          text: "Tổng hai số nguyên tố",
          color: "amber",
        },
      },
    ],
    mode: "steps",
  },
  "viet-20-xong": {
    kind: "lines",
    label: "20 viết thành tổng của hai số nguyên tố",
    rows: [
      {
        tex: "20 - 2 = 18",
        tag: {
          text: "18 là hợp số: bỏ",
          color: "pink",
        },
        muted: true,
      },
      {
        tex: "20 - 3 = 17",
        tag: {
          text: "17 là số nguyên tố",
          color: "sky",
        },
      },
      {
        tex: "20 = \\concept{sky}{3} + \\concept{sky}{17}",
        tag: {
          text: "Tổng hai số nguyên tố",
          color: "amber",
        },
      },
    ],
    mode: "still",
  },
  "viet-9-ba": {
    kind: "rows",
    label: "9 viết thành tổng của ba số nguyên tố",
    rows: [
      {
        tex: "9 = \\concept{sky}{2} + \\concept{sky}{2} + \\concept{sky}{5}",
        tag: {
          text: "Tổng ba số nguyên tố",
          color: "amber",
        },
      },
    ],
  },
  "tong-hs-1": {
    kind: "lines",
    label: "Tổng 3 · 4 · 5 + 6 · 7 là hợp số",
    rows: [
      {
        tex: "3 \\cdot 4 \\cdot 5 \\chiahet 2",
        tag: {
          text: "Thừa số 4 chia hết cho 2",
          color: "amber",
        },
      },
      {
        tex: "6 \\cdot 7 \\chiahet 2",
        tag: {
          text: "Thừa số 6 chia hết cho 2",
          color: "amber",
        },
      },
      {
        tex: "(3 \\cdot 4 \\cdot 5 + 6 \\cdot 7) \\chiahet 2",
      },
      {
        tex: "3 \\cdot 4 \\cdot 5 + 6 \\cdot 7 = 102 > 2",
      },
      {
        tex: "\\concept{pink}{102}",
        tag: {
          text: "Hợp số",
          color: "pink",
        },
      },
    ],
    mode: "steps",
  },
  "tong-hs-1-xong": {
    kind: "lines",
    label: "Tổng 3 · 4 · 5 + 6 · 7 là hợp số",
    rows: [
      {
        tex: "3 \\cdot 4 \\cdot 5 \\chiahet 2",
        tag: {
          text: "Thừa số 4 chia hết cho 2",
          color: "amber",
        },
      },
      {
        tex: "6 \\cdot 7 \\chiahet 2",
        tag: {
          text: "Thừa số 6 chia hết cho 2",
          color: "amber",
        },
      },
      {
        tex: "(3 \\cdot 4 \\cdot 5 + 6 \\cdot 7) \\chiahet 2",
      },
      {
        tex: "3 \\cdot 4 \\cdot 5 + 6 \\cdot 7 = 102 > 2",
      },
      {
        tex: "\\concept{pink}{102}",
        tag: {
          text: "Hợp số",
          color: "pink",
        },
      },
    ],
    mode: "still",
  },
  "tong-hs-2": {
    kind: "rows",
    label: "Tổng 10 · 3 + 5 · 8 là hợp số",
    rows: [
      {
        tex: "10 \\cdot 3 \\chiahet 5",
        tag: {
          text: "Thừa số 10 chia hết cho 5",
          color: "amber",
        },
      },
      {
        tex: "5 \\cdot 8 \\chiahet 5",
        tag: {
          text: "Thừa số 5 chia hết cho 5",
          color: "amber",
        },
      },
      {
        tex: "10 \\cdot 3 + 5 \\cdot 8 = 70 \\chiahet 5",
      },
      {
        tex: "\\concept{pink}{70}",
        tag: {
          text: "Hợp số",
          color: "pink",
        },
      },
    ],
  },
  sticker: {
    kind: "sticker",
  },
};
