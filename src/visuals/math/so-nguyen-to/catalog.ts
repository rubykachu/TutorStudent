import type { LinesSpec, Mode, RowsSpec } from "@/visuals/shared/formula-rows";
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
  // The primes below 100: the grid of 1..100 with the primes marked ("grid"),
  // or just the 25 primes in a compact list ("list").
  | { kind: "table"; mode: "grid" | "list" }
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
  "xep-20": {
    kind: "rects",
    n: 20,
    ways: [
      [1, 20],
      [2, 10],
      [4, 5],
    ],
    mode: "steps",
  },
  "xep-20-xong": {
    kind: "rects",
    n: 20,
    ways: [
      [1, 20],
      [2, 10],
      [4, 5],
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
    ways: [[3, 5]],
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
        tex: "1,\\ \\concept{sky}{2}",
        tag: { text: "Ước của 2", color: "violet" },
      },
      {
        tex: "1,\\ \\concept{sky}{3}",
        tag: { text: "Ước của 3", color: "violet" },
      },
      {
        tex: "1,\\ \\concept{sky}{5}",
        tag: { text: "Ước của 5", color: "violet" },
      },
      {
        tex: "1,\\ \\concept{sky}{7}",
        tag: { text: "Ước của 7", color: "violet" },
      },
    ],
    legend: [
      { color: "sky", name: "Số nguyên tố" },
      { color: "violet", name: "Ước" },
    ],
  },
  "chon-nt-2-7": {
    kind: "chips",
    items: ["21", "22", "23", "25", "27", "29"],
    wants: [2, 5],
    done: "Bạn đã chọn đủ các số nguyên tố.",
  },
  "chon-nt-bank": {
    kind: "chips",
    items: ["34", "43", "58", "47", "62", "86"],
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
        tex: "1,\\ \\concept{sky}{7}",
        tag: { text: "Ước của 7: hai ước", color: "violet" },
      },
      {
        tex: "1,\\ 2,\\ 3,\\ \\concept{pink}{6}",
        tag: { text: "Ước của 6: bốn ước", color: "violet" },
      },
    ],
    legend: [
      { color: "sky", name: "Số nguyên tố" },
      { color: "pink", name: "Hợp số" },
      { color: "violet", name: "Ước" },
    ],
  },
  "so-sanh-nt-hs-xong": {
    kind: "rows",
    label: "Ước của 7, của 6 và của 1",
    rows: [
      {
        tex: "1,\\ \\concept{sky}{7}",
        tag: { text: "Ước của 7: hai ước", color: "violet" },
      },
      {
        tex: "1,\\ 2,\\ 3,\\ \\concept{pink}{6}",
        tag: { text: "Ước của 6: bốn ước", color: "violet" },
      },
      { tex: "1", tag: { text: "Ước của 1: chỉ có một ước", color: "violet" } },
    ],
    legend: [
      { color: "sky", name: "Số nguyên tố" },
      { color: "pink", name: "Hợp số" },
      { color: "violet", name: "Ước" },
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
    items: ["26", "83", "12", "13", "15", "17"],
  },
  "bang-100": {
    kind: "table",
    mode: "grid",
  },
  "bang-nt": {
    kind: "table",
    mode: "list",
  },
  "chon-nt-bang": {
    kind: "chips",
    items: ["33", "37", "39", "45", "49", "73"],
    wants: [1, 5],
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
  "cot-195": {
    kind: "column",
    n: 195,
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
  "cot-thieu-330": {
    kind: "column",
    n: 330,
    hide: [3],
    mode: "still",
  },
  "giai-cot-330": {
    kind: "column",
    n: 330,
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
    label: "Các số hai chữ số có chữ số hàng chục là 3",
    rows: [
      { tex: "\\overline{3a}" },
      {
        tex: "30,\\ 32,\\ 33,\\ 34",
        tag: {
          text: "Hợp số, không có trong bảng",
          color: "pink",
        },
      },
      {
        tex: "35,\\ 36,\\ 38,\\ 39",
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
    wants: [1, 3, 9],
    done: "Bạn đã chọn đủ các chữ số a.",
  },
  "chon-a-1": {
    kind: "chips",
    items: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  },
  "chan-le": {
    kind: "rows",
    label: "Số chẵn ở hàng trên, số lẻ ở hàng dưới",
    rows: [
      {
        tex: "2,\\ 4,\\ 6,\\ 8,\\ 10",
        tag: { text: "Số chẵn", color: "slate" },
      },
      { tex: "1,\\ 3,\\ 5,\\ 7,\\ 9" },
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
    items: ["2", "9", "16", "21", "26", "34"],
    wants: [2, 4, 5],
    done: "Bạn đã chọn đủ các số chẵn là hợp số.",
  },
  "chon-hs-chan-bank": {
    kind: "chips",
    items: ["2", "3", "64", "65", "68", "69"],
  },
  "le-le": {
    kind: "rows",
    label: "Số nguyên tố khác 2 đều lẻ, tổng của hai số lẻ, tổng có số 2",
    rows: [
      {
        tex: "\\concept{sky}{3},\\ \\concept{sky}{5},\\ \\concept{sky}{7},\\ \\concept{sky}{11}",
        tag: { text: "Số nguyên tố khác 2: đều là số lẻ", color: "sky" },
      },
      {
        tex: "3 + 5 = 8",
        tag: { text: "Số chẵn: tổng của hai số lẻ", color: "slate" },
      },
      {
        tex: "7 + 11 = 18",
        tag: { text: "Số chẵn: tổng của hai số lẻ", color: "slate" },
      },
      {
        tex: "\\concept{sky}{2} + \\concept{sky}{19} = 21",
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
          text: "Số nguyên tố: 23 có trong bảng",
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
  "viet-74": {
    kind: "lines",
    label: "74 viết thành tổng của hai số nguyên tố",
    rows: [
      {
        tex: "74 - 2 = 72",
        tag: {
          text: "Hợp số: bỏ",
          color: "pink",
        },
        muted: true,
      },
      {
        tex: "74 - 3 = 71",
        tag: {
          text: "Số nguyên tố: giữ",
          color: "sky",
        },
      },
      {
        tex: "74 = \\concept{sky}{3} + \\concept{sky}{71}",
        tag: {
          text: "Tổng hai số nguyên tố",
          color: "amber",
        },
      },
    ],
    mode: "steps",
  },
  "viet-74-xong": {
    kind: "lines",
    label: "74 viết thành tổng của hai số nguyên tố",
    rows: [
      {
        tex: "74 - 2 = 72",
        tag: {
          text: "Hợp số: bỏ",
          color: "pink",
        },
        muted: true,
      },
      {
        tex: "74 - 3 = 71",
        tag: {
          text: "Số nguyên tố: giữ",
          color: "sky",
        },
      },
      {
        tex: "74 = \\concept{sky}{3} + \\concept{sky}{71}",
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
        tex: "9 - 2 = 7",
        tag: { text: "Chọn trước một số nguyên tố", color: "sky" },
      },
      {
        tex: "7 = \\concept{sky}{2} + \\concept{sky}{5}",
        tag: {
          text: "Viết số còn lại thành tổng hai số nguyên tố",
          color: "amber",
        },
      },
      {
        tex: "9 = \\concept{sky}{2} + \\concept{sky}{2} + \\concept{sky}{5}",
        tag: { text: "Tổng ba số nguyên tố", color: "amber" },
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
          text: "Tích có thừa số 4: chia hết cho 2",
          color: "amber",
        },
      },
      {
        tex: "6 \\cdot 7 \\chiahet 2",
        tag: {
          text: "Tích có thừa số 6: chia hết cho 2",
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
          text: "Tích có thừa số 4: chia hết cho 2",
          color: "amber",
        },
      },
      {
        tex: "6 \\cdot 7 \\chiahet 2",
        tag: {
          text: "Tích có thừa số 6: chia hết cho 2",
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
          text: "Tích có thừa số 10: chia hết cho 5",
          color: "amber",
        },
      },
      {
        tex: "5 \\cdot 8 \\chiahet 5",
        tag: {
          text: "Tích có thừa số 5: chia hết cho 5",
          color: "amber",
        },
      },
      {
        tex: "10 \\cdot 3 + 5 \\cdot 8 = 70 \\chiahet 5",
      },
      {
        tex: "70 > 5",
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
  "goi-y-xet-69": {
    kind: "lines",
    label: "Số 69 là hợp số vì chia hết cho 3",
    rows: [
      {
        tex: "6 + 9 = 15",
        tag: { text: "Tổng các chữ số", color: "lime" },
      },
      { tex: "69 \\chiahet 3" },
      { tex: "69 > 3" },
      {
        tex: "\\concept{pink}{69}",
        tag: { text: "Hợp số", color: "pink" },
      },
    ],
    mode: "hint",
  },
  "goi-y-cay-20": {
    kind: "tree",
    root: {
      n: 20,
      kids: [
        { n: 5 },
        {
          n: 4,
          kids: [{ n: 2 }, { n: 2 }],
        },
      ],
    },
    hide: [],
    mode: "hint",
  },
  "cot-thieu-78": {
    kind: "column",
    n: 78,
    hide: [2],
    mode: "still",
  },
  "giai-cot-78": {
    kind: "column",
    n: 78,
    hide: [],
    mode: "solution",
  },
  "goi-y-tong-hs": {
    kind: "lines",
    label: "Tổng 7 · 3 + 5 · 9 là hợp số",
    rows: [
      {
        tex: "7 \\cdot 3 \\chiahet 3",
        tag: { text: "Tích có thừa số 3: chia hết cho 3", color: "amber" },
      },
      {
        tex: "5 \\cdot 9 \\chiahet 3",
        tag: { text: "Tích có thừa số 9: chia hết cho 3", color: "amber" },
      },
      {
        tex: "(7 \\cdot 3 + 5 \\cdot 9) \\chiahet 3",
      },
      {
        tex: "7 \\cdot 3 + 5 \\cdot 9 = 66 > 3",
      },
      {
        tex: "\\concept{pink}{66}",
        tag: { text: "Hợp số", color: "pink" },
      },
    ],
    mode: "hint",
  },
  sticker: {
    kind: "sticker",
  },
};
