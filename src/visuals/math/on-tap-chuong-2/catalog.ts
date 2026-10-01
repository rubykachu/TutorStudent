import type { LinesSpec, RowsSpec } from "@/visuals/shared/formula-rows";
import type { ChipsSpec } from "@/visuals/shared/pick-chips";

// Every picture of the lesson that is drawn from numbers: the registry builds
// one entry per item (id `on-tap-chuong-2.visual.<key>`), so a new example is
// one item here and its id in lesson.json. Pure data, no React, so
// `content:check` reads it.

export { LESSON_SLUG } from "./logic";

export type VisualSpec =
  // Formulas stacked, each with an optional tag (see `RowsSpec`).
  | ({ kind: "rows" } & RowsSpec)
  // Lines of a worked example, one more on every step (see `LinesSpec`).
  | ({ kind: "lines" } & LinesSpec)
  // Numbers (or short sums) the child taps to pick, state { i0, i1, … } (see
  // `ChipsSpec`). With `wants` it is a lesson screen with progress; without
  // it an exercise picture that reveals nothing.
  | ({ kind: "chips" } & ChipsSpec)
  | { kind: "sticker" };

export type SpecKind = VisualSpec["kind"];
export type SpecOf<K extends SpecKind> = Extract<VisualSpec, { kind: K }>;

// Kinds the child acts on (counted as interactive by `--stats`).
export const INTERACTIVE_KINDS: ReadonlySet<SpecKind> = new Set(["chips"]);

// Validator id of the `manipulate` exercises each interactive kind serves;
// "chon-dung" is the validator shared with the set lesson's pick screens.
export const VALIDATOR_IDS = { chips: "chon-dung" } as const;

export const VISUAL_SPECS: Readonly<Record<string, VisualSpec>> = {
  "tong-12-18": {
    kind: "rows",
    label: "Hai số hạng chia hết cho 6 thì tổng chia hết cho 6",
    rows: [
      {
        tex: "12 \\chiahet 6",
        tag: { text: "12 chia hết cho 6", color: "teal" },
      },
      {
        tex: "18 \\chiahet 6",
        tag: { text: "18 chia hết cho 6", color: "teal" },
      },
      {
        tex: "12 + 18 = 30 \\chiahet 6",
        tag: { text: "Tổng chia hết cho 6", color: "teal" },
        gapBefore: true,
      },
    ],
  },
  "tong-12-19": {
    kind: "rows",
    label: "Một số hạng không chia hết cho 6 thì tổng không chia hết cho 6",
    rows: [
      {
        tex: "12 \\chiahet 6",
        tag: { text: "12 chia hết cho 6", color: "teal" },
      },
      {
        tex: "19 \\khongchiahet 6",
        tag: { text: "19 không chia hết cho 6", color: "pink" },
      },
      {
        tex: "12 + 19 = 31 \\khongchiahet 6",
        tag: { text: "Tổng không chia hết cho 6", color: "pink" },
        gapBefore: true,
      },
    ],
  },
  "tong-2-4-5": {
    kind: "rows",
    label: "Hai số hạng không chia hết cho 3, tổng có thể chia hết hoặc không",
    rows: [
      {
        tex: "2 + 4 = 6 \\chiahet 3",
        tag: {
          text: "2 và 4 không chia hết cho 3, tổng 6 chia hết cho 3",
          color: "teal",
        },
      },
      {
        tex: "2 + 5 = 7 \\khongchiahet 3",
        tag: {
          text: "2 và 5 không chia hết cho 3, tổng 7 không chia hết cho 3",
          color: "pink",
        },
        gapBefore: true,
      },
    ],
  },
  "tn1-goi-y": {
    kind: "lines",
    label: "Thử một ví dụ với số 3",
    rows: [
      { tex: "1 \\khongchiahet 3" },
      { tex: "2 \\khongchiahet 3" },
      { tex: "1 + 2 = 3" },
      {
        tex: "3 \\chiahet 3",
        tag: { text: "Tổng chia hết cho 3", color: "teal" },
      },
    ],
    mode: "hint",
  },
  "chia-9-4536": {
    kind: "lines",
    label: "Số 4 536 chia hết cho 9",
    rows: [
      {
        tex: "4 + 5 + 3 + 6 = 18",
        tag: { text: "Tổng các chữ số", color: "lime" },
      },
      {
        tex: "18 \\chiahet 9",
        tag: { text: "18 chia hết cho 9", color: "teal" },
      },
      {
        tex: "4\\,536 \\chiahet 9",
        tag: { text: "4 536 chia hết cho 9", color: "teal" },
      },
    ],
    mode: "steps",
  },
  "chia-5-7205": {
    kind: "rows",
    label: "Chữ số tận cùng là 5 hoặc 0 thì chia hết cho 5",
    rows: [
      {
        tex: "7\\,20\\concept{teal}{5} \\chiahet 5",
        tag: { text: "Chữ số tận cùng là 5", color: "teal" },
      },
      {
        tex: "7\\,21\\concept{teal}{0} \\chiahet 5",
        tag: { text: "Chữ số tận cùng là 0", color: "teal" },
      },
      {
        tex: "7\\,20\\concept{teal}{3} \\khongchiahet 5",
        tag: { text: "Chữ số tận cùng là 3", color: "pink" },
        gapBefore: true,
      },
    ],
  },
  "chon-chia-9": {
    kind: "chips",
    items: ["27", "45", "52", "108", "91"],
    wants: [0, 1, 3],
    done: "Bạn đã chọn đủ các số chia hết cho 9.",
  },
  "tn4-goi-y": {
    kind: "lines",
    label: "Thử với số 6 372",
    rows: [
      {
        tex: "6 + 3 + 7 + 2 = 18",
        tag: { text: "Tổng các chữ số", color: "lime" },
      },
      {
        tex: "18 \\chiahet 9",
        tag: { text: "18 chia hết cho 9", color: "teal" },
      },
      { tex: "6\\,372 \\chiahet 9" },
    ],
    mode: "hint",
  },
  "tn5-goi-y": {
    kind: "lines",
    label: "Thử với số 4 536",
    rows: [
      {
        tex: "4 + 5 + 3 + 6 = 18 \\chiahet 9",
        tag: { text: "Chia hết cho 9", color: "teal" },
      },
      {
        tex: "4\\,53\\concept{teal}{6}",
        tag: { text: "Chữ số tận cùng là 6", color: "teal" },
      },
      { tex: "4\\,536 \\khongchiahet 5" },
    ],
    mode: "hint",
  },
  "nt-vi-du": {
    kind: "rows",
    label: "Ước của 13 và của 9",
    rows: [
      {
        tex: "1,\\ \\concept{sky}{13}",
        tag: { text: "Ước của 13", color: "violet" },
      },
      {
        tex: "1,\\ 3,\\ \\concept{pink}{9}",
        tag: { text: "Ước của 9", color: "violet" },
      },
    ],
    legend: [
      { color: "sky", name: "Số nguyên tố" },
      { color: "pink", name: "Hợp số" },
    ],
  },
  "loai-hop-so": {
    kind: "rows",
    label: "Dùng dấu hiệu chia hết để nhận ra hợp số",
    rows: [
      {
        tex: "4\\,326 \\chiahet 2",
        tag: { text: "Tận cùng là 6: hợp số", color: "pink" },
      },
      {
        tex: "1\\,275 \\chiahet 5",
        tag: { text: "Tận cùng là 5: hợp số", color: "pink" },
      },
      {
        tex: "1 + 2 + 3 = 6 \\chiahet 3",
        tag: { text: "Số 123 chia hết cho 3: hợp số", color: "pink" },
      },
    ],
  },
  "chon-chia-235": {
    kind: "chips",
    items: ["35", "91", "124", "61", "201"],
    wants: [0, 2, 4],
    done: "Bạn đã chọn đủ các số chia hết cho 2, 3 hoặc 5.",
  },
  "tn2-goi-y": {
    kind: "lines",
    label: "Thử với bốn số khác",
    rows: [
      {
        tex: "1\\,350 \\chiahet 2",
        tag: { text: "Tận cùng là 0", color: "teal" },
      },
      {
        tex: "2 + 1 + 1 + 5 = 9 \\chiahet 3",
        tag: { text: "Số 2 115: tổng các chữ số là 9", color: "lime" },
      },
      { tex: "73 \\khongchiahet 2,\\ 3,\\ 5" },
    ],
    mode: "hint",
  },
  "tn3-goi-y": {
    kind: "lines",
    label: "Thử với số 1 645",
    rows: [
      {
        tex: "1\\,64\\concept{teal}{5}",
        tag: { text: "Chữ số tận cùng là 5", color: "teal" },
      },
      { tex: "1\\,645 \\chiahet 5" },
      { tex: "1\\,645 > 5", tag: { text: "Lớn hơn 5", color: "slate" } },
    ],
    mode: "hint",
  },
  "tong-hs-vi-du": {
    kind: "lines",
    label: "Tổng của hai số chia hết cho 3",
    rows: [
      {
        tex: "6 \\chiahet 3",
        tag: { text: "6 chia hết cho 3", color: "teal" },
      },
      {
        tex: "9 \\chiahet 3",
        tag: { text: "9 chia hết cho 3", color: "teal" },
      },
      {
        tex: "6 + 9 = 15 \\chiahet 3",
        tag: { text: "Tổng chia hết cho 3", color: "teal" },
      },
      {
        tex: "15 = 3 \\cdot 5",
        tag: { text: "Có ước 3 nên là hợp số", color: "pink" },
      },
    ],
    mode: "steps",
  },
  "tich-chia-het": {
    kind: "rows",
    label: "Một tích chia hết cho mỗi thừa số",
    rows: [
      {
        tex: "3 \\cdot 5 \\cdot 8 \\chiahet 3",
        tag: { text: "Có thừa số 3", color: "blue" },
      },
      {
        tex: "3 \\cdot 5 \\cdot 8 \\chiahet 5",
        tag: { text: "Có thừa số 5", color: "blue" },
      },
      {
        tex: "3 \\cdot 5 \\cdot 8 \\chiahet 8",
        tag: { text: "Có thừa số 8", color: "blue" },
      },
    ],
  },
  "tn256a-goi-y": {
    kind: "lines",
    label: "Thử với một tổng khác",
    rows: [
      {
        tex: "3 \\cdot 5 \\cdot 6 \\chiahet 5",
        tag: { text: "Có thừa số 5", color: "blue" },
      },
      {
        tex: "25 \\cdot 11 \\chiahet 5",
        tag: { text: "25 = 5 · 5", color: "blue" },
      },
      {
        tex: "3 \\cdot 5 \\cdot 6 + 25 \\cdot 11 \\chiahet 5",
        tag: {
          text: "Tổng chia hết cho 5 và lớn hơn 5: hợp số",
          color: "pink",
        },
      },
    ],
    mode: "hint",
  },
  "tn256b-goi-y": {
    kind: "lines",
    label: "Thử với một tổng khác",
    rows: [
      {
        tex: "7 \\cdot 8 \\cdot 9 \\chiahet 2",
        tag: { text: "Có thừa số chẵn 8", color: "blue" },
      },
      {
        tex: "10 \\cdot 11 \\cdot 13 \\chiahet 2",
        tag: { text: "Có thừa số chẵn 10", color: "blue" },
      },
      {
        tex: "7 \\cdot 8 \\cdot 9 + 10 \\cdot 11 \\cdot 13 \\chiahet 2",
        tag: {
          text: "Tổng chia hết cho 2 và lớn hơn 2: hợp số",
          color: "pink",
        },
      },
    ],
    mode: "hint",
  },
  "tong-3-so-hang": {
    kind: "lines",
    label: "Tổng có một số hạng không chia hết cho 2",
    rows: [
      {
        tex: "40 \\chiahet 2",
        tag: { text: "40 chia hết cho 2", color: "teal" },
      },
      {
        tex: "15 \\khongchiahet 2",
        tag: { text: "15 không chia hết cho 2", color: "pink" },
      },
      {
        tex: "30 \\chiahet 2",
        tag: { text: "30 chia hết cho 2", color: "teal" },
      },
      {
        tex: "40 + 15 + 30 = 85 \\khongchiahet 2",
        tag: { text: "Tổng không chia hết cho 2", color: "pink" },
        gapBefore: true,
      },
    ],
    mode: "steps",
  },
  "chia-2-tan-cung": {
    kind: "rows",
    label: "Chữ số tận cùng quyết định chia hết cho 2",
    rows: [
      {
        tex: "7\\,23\\concept{teal}{4} \\chiahet 2",
        tag: { text: "Chữ số tận cùng là 4", color: "teal" },
      },
      {
        tex: "7\\,23\\concept{teal}{5} \\khongchiahet 2",
        tag: { text: "Chữ số tận cùng là 5", color: "pink" },
      },
    ],
  },
  "chon-tong-5": {
    kind: "chips",
    items: ["10 + 25", "15 + 21", "30 + 45", "18 + 40"],
    wants: [0, 2],
    done: "Bạn đã chọn đủ các tổng chia hết cho 5.",
  },
  "tn259a-goi-y": {
    kind: "lines",
    label: "Thử với một tổng khác",
    rows: [
      { tex: "120 \\chiahet 2" },
      {
        tex: "305 \\khongchiahet 2",
        tag: { text: "305 có chữ số tận cùng là 5", color: "teal" },
      },
      { tex: "40 \\chiahet 2" },
      {
        tex: "120 + 305 + 40 \\khongchiahet 2",
        tag: { text: "Tổng không chia hết cho 2", color: "pink" },
      },
    ],
    mode: "hint",
  },
  "tn259b-goi-y": {
    kind: "lines",
    label: "Thử với một tổng khác",
    rows: [
      { tex: "250 \\chiahet 5" },
      { tex: "105 \\chiahet 5" },
      { tex: "70 \\chiahet 5" },
      {
        tex: "250 + 105 + 70 \\chiahet 5",
        tag: { text: "Tổng chia hết cho 5", color: "teal" },
      },
    ],
    mode: "hint",
  },
  "chia-3-216": {
    kind: "lines",
    label: "Số 216 chia hết cho 3",
    rows: [
      { tex: "2 + 1 + 6 = 9", tag: { text: "Tổng các chữ số", color: "lime" } },
      {
        tex: "9 \\chiahet 3",
        tag: { text: "9 chia hết cho 3", color: "teal" },
      },
      {
        tex: "216 \\chiahet 3",
        tag: { text: "216 chia hết cho 3", color: "teal" },
      },
    ],
    mode: "steps",
  },
  "bac-3-9": {
    kind: "rows",
    label: "Số chia hết cho 9 thì chia hết cho 3",
    rows: [
      {
        tex: "27 \\chiahet 9",
        tag: { text: "27 chia hết cho 9", color: "teal" },
      },
      {
        tex: "27 \\chiahet 3",
        tag: { text: "27 cũng chia hết cho 3", color: "teal" },
      },
      {
        tex: "20 \\khongchiahet 3",
        tag: { text: "20 không chia hết cho 3", color: "pink" },
        gapBefore: true,
      },
      {
        tex: "20 \\khongchiahet 9",
        tag: { text: "20 cũng không chia hết cho 9", color: "pink" },
      },
    ],
  },
  "tong-chia-3": {
    kind: "lines",
    label: "Tổng có một số hạng không chia hết cho 3",
    rows: [
      { tex: "9 \\chiahet 3" },
      { tex: "12 \\chiahet 3" },
      {
        tex: "10 \\khongchiahet 3",
        tag: { text: "10 không chia hết cho 3", color: "pink" },
      },
      {
        tex: "9 + 12 + 10 = 31 \\khongchiahet 3",
        tag: { text: "Tổng không chia hết cho 3", color: "pink" },
        gapBefore: true,
      },
    ],
    mode: "steps",
  },
  "tn259c-goi-y": {
    kind: "lines",
    label: "Thử với một tổng khác",
    rows: [
      { tex: "120 \\chiahet 3", tag: { text: "1 + 2 + 0 = 3", color: "lime" } },
      {
        tex: "301 \\khongchiahet 3",
        tag: { text: "3 + 0 + 1 = 4", color: "lime" },
      },
      { tex: "60 \\chiahet 3", tag: { text: "6 + 0 = 6", color: "lime" } },
      {
        tex: "120 + 301 + 60 \\khongchiahet 3",
        tag: { text: "Tổng không chia hết cho 3", color: "pink" },
      },
    ],
    mode: "hint",
  },
  "tn259d-goi-y": {
    kind: "lines",
    label: "Thử với một số B",
    rows: [
      {
        tex: "B \\khongchiahet 3",
        tag: { text: "B không chia hết cho 3", color: "pink" },
      },
      {
        tex: "9 = 3 \\cdot 3",
        tag: { text: "Số chia hết cho 9 thì chia hết cho 3", color: "teal" },
      },
      { tex: "B \\khongchiahet 9" },
    ],
    mode: "hint",
  },
  "tinh-vi-du": {
    kind: "lines",
    label: "Tính một biểu thức có luỹ thừa",
    rows: [
      { tex: "3^{2} : 3 + 5 \\cdot 4" },
      {
        tex: "= 9 : 3 + 20",
        tag: { text: "Tính luỹ thừa, rồi nhân", color: "amber" },
      },
      { tex: "= 3 + 20 = 23", tag: { text: "Chia, rồi cộng", color: "amber" } },
    ],
    mode: "steps",
  },
  "phan-tich-60": {
    kind: "lines",
    label: "Phân tích 60 ra thừa số nguyên tố",
    rows: [
      { tex: "60 : 2 = 30" },
      { tex: "30 : 2 = 15" },
      { tex: "15 : 3 = 5" },
      { tex: "5 : 5 = 1" },
      {
        tex: "60 = \\concept{sky}{2} \\cdot \\concept{sky}{2} \\cdot \\concept{sky}{3} \\cdot \\concept{sky}{5}",
        tag: { text: "Các thừa số nguyên tố", color: "sky" },
        gapBefore: true,
      },
    ],
    mode: "steps",
  },
  "viet-gon-72": {
    kind: "rows",
    label: "Viết gọn bằng luỹ thừa",
    rows: [
      { tex: "72 = 2 \\cdot 2 \\cdot 2 \\cdot 3 \\cdot 3" },
      {
        tex: "72 = 2^{3} \\cdot 3^{2}",
        tag: { text: "Ba thừa số 2 và hai thừa số 3", color: "sky" },
      },
    ],
  },
  "tn257a-goi-y": {
    kind: "lines",
    label: "Thử với một biểu thức khác",
    rows: [
      { tex: "8^{2} : 4 + 3 \\cdot 6" },
      { tex: "= 64 : 4 + 18" },
      { tex: "= 16 + 18 = 34" },
      {
        tex: "34 = 2 \\cdot 17",
        tag: { text: "Phân tích ra thừa số nguyên tố", color: "sky" },
      },
    ],
    mode: "hint",
  },
  "tn257b-goi-y": {
    kind: "lines",
    label: "Thử với một biểu thức khác",
    rows: [
      { tex: "6 \\cdot 3^{2} - 48 : 2^{2}" },
      { tex: "= 6 \\cdot 9 - 48 : 4" },
      { tex: "= 54 - 12 = 42" },
      {
        tex: "42 = 2 \\cdot 3 \\cdot 7",
        tag: { text: "Phân tích ra thừa số nguyên tố", color: "sky" },
      },
    ],
    mode: "hint",
  },
  "uoc-boi-18-6": {
    kind: "rows",
    label: "Ước và bội",
    rows: [
      {
        tex: "18 \\chiahet 6",
        tag: { text: "6 là ước của 18, 18 là bội của 6", color: "violet" },
      },
    ],
  },
  "uoc-cua-8": {
    kind: "lines",
    label: "Các ước của 8",
    rows: [
      { tex: "8 = 1 \\cdot 8" },
      { tex: "8 = 2 \\cdot 4" },
      {
        tex: "1,\\ 2,\\ 4,\\ 8",
        tag: { text: "Các ước của 8", color: "violet" },
        gapBefore: true,
      },
    ],
    mode: "steps",
  },
  "chon-uoc-8": {
    kind: "chips",
    items: ["1", "2", "3", "4", "6", "8"],
    wants: [0, 1, 3, 5],
    done: "Bạn đã chọn đủ các ước của 8.",
  },
  "tim-n-8": {
    kind: "lines",
    label: "Tìm n khi 8 chia hết cho n + 1",
    rows: [
      { tex: "8 \\chiahet (n + 1)" },
      {
        tex: "n + 1 = 1,\\ 2,\\ 4,\\ 8",
        tag: { text: "n + 1 là ước của 8", color: "violet" },
      },
      {
        tex: "n = 0,\\ 1,\\ 3,\\ 7",
        tag: { text: "Bớt 1 ở mỗi ước", color: "teal" },
      },
    ],
    mode: "steps",
  },
  "chon-n-6": { kind: "chips", items: ["0", "1", "2", "3", "4", "5", "6"] },
  "tn262-goi-y": {
    kind: "lines",
    label: "Thử với 10 chia hết cho n + 1",
    rows: [
      { tex: "10 \\chiahet (n + 1)" },
      {
        tex: "n + 1 = 1,\\ 2,\\ 5,\\ 10",
        tag: { text: "n + 1 là ước của 10", color: "violet" },
      },
      {
        tex: "n = 0,\\ 1,\\ 4,\\ 9",
        tag: { text: "Bớt 1 ở mỗi ước", color: "teal" },
      },
    ],
    mode: "hint",
  },
  "uc-12-18": {
    kind: "rows",
    label: "Ước chung và ƯCLN của 12 và 18",
    rows: [
      {
        tex: "1,\\ 2,\\ 3,\\ 6",
        tag: { text: "Ước chung của 12 và 18", color: "teal" },
      },
      { tex: "6", tag: { text: "ƯCLN(12, 18)", color: "amber" } },
      {
        tex: "6 = 1 \\cdot 6 = 2 \\cdot 3",
        tag: { text: "Ước của 6 là 1, 2, 3, 6", color: "violet" },
      },
    ],
  },
  "bc-4-6": {
    kind: "rows",
    label: "Bội chung và BCNN của 4 và 6",
    rows: [
      {
        tex: "12,\\ 24,\\ 36,\\ 48,\\ \\ldots",
        tag: { text: "Bội chung của 4 và 6", color: "lime" },
      },
      { tex: "12", tag: { text: "BCNN(4, 6)", color: "pink" } },
      {
        tex: "12 \\cdot 1,\\ 12 \\cdot 2,\\ 12 \\cdot 3,\\ \\ldots",
        tag: { text: "Bội của 12", color: "blue" },
      },
    ],
  },
  "uc-bc-12-18": {
    kind: "rows",
    label: "ƯCLN là ước của BCNN",
    rows: [
      {
        tex: "12 \\chiahet 6,\\ 18 \\chiahet 6",
        tag: { text: "6 là ước của 12 và 18", color: "amber" },
      },
      {
        tex: "36 \\chiahet 12,\\ 36 \\chiahet 18",
        tag: { text: "36 là bội của 12 và 18", color: "pink" },
      },
      {
        tex: "36 \\chiahet 6",
        tag: { text: "Nên 6 là ước của 36", color: "violet" },
      },
    ],
  },
  "tn6-goi-y": {
    kind: "lines",
    label: "Thử với a = 4, b = 10, c = 20",
    rows: [
      { tex: "4 \\khongchiahet 20" },
      { tex: "10 \\khongchiahet 20" },
      { tex: "20", tag: { text: "BCNN(4, 10)", color: "pink" } },
      {
        tex: "20 \\chiahet 20",
        tag: { text: "BCNN chia hết cho c", color: "teal" },
      },
    ],
    mode: "hint",
  },
  "khoang-bcnn": {
    kind: "lines",
    label: "Tìm số trong một khoảng",
    rows: [
      { tex: "12", tag: { text: "BCNN(4, 6)", color: "pink" } },
      {
        tex: "12,\\ 24,\\ 36,\\ 48,\\ 60,\\ \\ldots",
        tag: { text: "Các bội chung của 4 và 6", color: "lime" },
      },
      {
        tex: "30 < n < 50:\\ n = 36,\\ 48",
        tag: { text: "Chọn số trong khoảng", color: "amber" },
      },
    ],
    mode: "steps",
  },
  "thua-xep": {
    kind: "rows",
    label: "Xếp hàng còn dư",
    rows: [
      {
        tex: "n - 3 \\chiahet 4",
        tag: { text: "Bớt 3 em, xếp hàng 4 vừa hết", color: "teal" },
      },
      {
        tex: "n - 3 \\chiahet 6",
        tag: { text: "Bớt 3 em, xếp hàng 6 vừa hết", color: "teal" },
      },
      {
        tex: "n - 3 \\chiahet 12",
        tag: { text: "n − 3 là bội của BCNN(4, 6) = 12", color: "pink" },
        gapBefore: true,
      },
    ],
  },
  "chon-bc-4-6": {
    kind: "chips",
    items: ["12", "16", "24", "30", "36", "42"],
    wants: [0, 2, 4],
    done: "Bạn đã chọn đủ các bội chung của 4 và 6.",
  },
  "tn258-goi-y": {
    kind: "lines",
    label: "Thử với một bài tương tự",
    rows: [
      { tex: "12", tag: { text: "BCNN(4, 6)", color: "pink" } },
      {
        tex: "n - 3 = 96,\\ 108,\\ 120,\\ \\ldots",
        tag: { text: "Bội của 12", color: "lime" },
      },
      {
        tex: "100 < n < 120:\\ n = 111",
        tag: { text: "Chỉ có một số trong khoảng", color: "amber" },
      },
    ],
    mode: "hint",
  },
  "mu-ucln": {
    kind: "rows",
    label: "ƯCLN lấy số mũ nhỏ nhất",
    rows: [
      { tex: "12 = 2^{\\concept{violet}{2}} \\cdot 3^{\\concept{violet}{1}}" },
      { tex: "18 = 2^{\\concept{violet}{1}} \\cdot 3^{\\concept{violet}{2}}" },
      {
        tex: "2^{1} \\cdot 3^{1} = 6",
        tag: { text: "Số mũ nhỏ nhất: ƯCLN", color: "amber" },
        gapBefore: true,
      },
    ],
  },
  "mu-bcnn": {
    kind: "rows",
    label: "BCNN lấy số mũ lớn nhất",
    rows: [
      { tex: "12 = 2^{\\concept{violet}{2}} \\cdot 3^{\\concept{violet}{1}}" },
      { tex: "18 = 2^{\\concept{violet}{1}} \\cdot 3^{\\concept{violet}{2}}" },
      {
        tex: "2^{2} \\cdot 3^{2} = 36",
        tag: { text: "Số mũ lớn nhất: BCNN", color: "pink" },
        gapBefore: true,
      },
    ],
  },
  "mu-tim-b": {
    kind: "lines",
    label: "Tìm số mũ chưa biết",
    rows: [
      {
        tex: "2^{5} \\cdot 3^{a}",
        tag: { text: "Số thứ nhất", color: "slate" },
      },
      { tex: "2^{b} \\cdot 3", tag: { text: "Số thứ hai", color: "slate" } },
      {
        tex: "2^{2} \\cdot 3",
        tag: { text: "ƯCLN", color: "amber" },
        gapBefore: true,
      },
      { tex: "2^{5} \\cdot 3^{4}", tag: { text: "BCNN", color: "pink" } },
      {
        tex: "b = 2,\\ a = 4",
        tag: {
          text: "Thừa số 2: số mũ nhỏ nhất là 2. Thừa số 3: số mũ lớn nhất là 4.",
          color: "teal",
        },
        gapBefore: true,
      },
    ],
    mode: "steps",
  },
  "tn263-goi-y": {
    kind: "lines",
    label: "Thử với hai số khác",
    rows: [
      {
        tex: "\\min(4, b) = 3",
        tag: { text: "Thừa số 2: số mũ nhỏ nhất", color: "amber" },
      },
      { tex: "b = 3" },
      {
        tex: "\\max(a, 2) = 5",
        tag: { text: "Thừa số 3: số mũ lớn nhất", color: "pink" },
      },
      { tex: "a = 5" },
    ],
    mode: "hint",
  },
  "tich-12-18": {
    kind: "lines",
    label: "ƯCLN nhân BCNN bằng tích hai số",
    rows: [
      { tex: "6", tag: { text: "ƯCLN(12, 18)", color: "amber" } },
      { tex: "36", tag: { text: "BCNN(12, 18)", color: "pink" } },
      { tex: "12 \\cdot 18 = 216", gapBefore: true },
      {
        tex: "6 \\cdot 36 = 216",
        tag: { text: "Hai tích bằng nhau", color: "teal" },
      },
    ],
    mode: "steps",
  },
  "chia-luy-thua": {
    kind: "rows",
    label: "Chia hai luỹ thừa cùng cơ số",
    rows: [
      { tex: "2^{5} : 2^{2} = 2^{5 - 2} = 2^{3}" },
      { tex: "3^{4} : 3 = 3^{4 - 1} = 3^{3}" },
    ],
  },
  "tn260-goi-y": {
    kind: "lines",
    label: "Thử với hai số khác",
    rows: [
      {
        tex: "(2 \\cdot 3) \\cdot (2^{2} \\cdot 3^{2} \\cdot 5)",
        tag: { text: "ƯCLN nhân BCNN", color: "amber" },
      },
      { tex: "= 2^{3} \\cdot 3^{3} \\cdot 5" },
      {
        tex: "2^{3} \\cdot 3^{3} \\cdot 5 : (2 \\cdot 3^{2})",
        tag: { text: "Chia cho số đã biết", color: "teal" },
      },
      { tex: "2^{2} \\cdot 3 \\cdot 5" },
    ],
    mode: "hint",
  },
  "quy-dong-vi-du": {
    kind: "lines",
    label: "Cộng hai phân số khác mẫu",
    rows: [
      { tex: "\\frac{1}{4} + \\frac{1}{6}" },
      {
        tex: "= \\frac{1 \\cdot 3}{4 \\cdot 3} + \\frac{1 \\cdot 2}{6 \\cdot 2} = \\frac{3}{12} + \\frac{2}{12}",
        tag: { text: "Quy đồng với mẫu số chung 12", color: "blue" },
      },
      {
        tex: "= \\frac{5}{12}",
        tag: { text: "Cộng hai tử, giữ nguyên mẫu", color: "teal" },
      },
    ],
    mode: "steps",
  },
  "tru-vi-du": {
    kind: "lines",
    label: "Trừ hai phân số khác mẫu",
    rows: [
      { tex: "\\frac{5}{6} - \\frac{3}{4}" },
      {
        tex: "= \\frac{5 \\cdot 2}{6 \\cdot 2} - \\frac{3 \\cdot 3}{4 \\cdot 3} = \\frac{10}{12} - \\frac{9}{12}",
        tag: { text: "Quy đồng với mẫu số chung 12", color: "blue" },
      },
      {
        tex: "= \\frac{1}{12}",
        tag: { text: "Trừ hai tử, giữ nguyên mẫu", color: "teal" },
      },
    ],
    mode: "steps",
  },
  "tn264a-goi-y": {
    kind: "lines",
    label: "Thử với một tổng khác",
    rows: [
      { tex: "12", tag: { text: "BCNN(6, 4)", color: "pink" } },
      {
        tex: "\\frac{5}{6} = \\frac{10}{12},\\ \\frac{3}{4} = \\frac{9}{12}",
        tag: { text: "Quy đồng", color: "blue" },
      },
      {
        tex: "\\frac{5}{6} + \\frac{3}{4} = \\frac{10}{12} + \\frac{9}{12} = \\frac{19}{12}",
      },
    ],
    mode: "hint",
  },
  "tn264b-goi-y": {
    kind: "lines",
    label: "Thử với một hiệu khác",
    rows: [
      { tex: "20", tag: { text: "BCNN(10, 4)", color: "pink" } },
      {
        tex: "\\frac{7}{10} = \\frac{14}{20},\\ \\frac{1}{4} = \\frac{5}{20}",
        tag: { text: "Quy đồng", color: "blue" },
      },
      {
        tex: "\\frac{7}{10} - \\frac{1}{4} = \\frac{14}{20} - \\frac{5}{20} = \\frac{9}{20}",
      },
    ],
    mode: "hint",
  },
  "giao-hoan-ket-hop": {
    kind: "lines",
    label: "Đổi chỗ và nhóm các thừa số",
    rows: [
      {
        tex: "7 \\cdot 4 \\cdot 25 = 7 \\cdot 25 \\cdot 4",
        tag: { text: "Đổi chỗ các thừa số", color: "teal" },
      },
      {
        tex: "= (7 \\cdot 25) \\cdot 4",
        tag: { text: "Nhóm hai thừa số", color: "blue" },
      },
      { tex: "= 175 \\cdot 4 = 700" },
    ],
    mode: "steps",
  },
  "nhan-111": {
    kind: "rows",
    label: "Nhân 111 111 111 với một chữ số",
    rows: [
      { tex: "111\\,111\\,111 \\cdot 7 = 777\\,777\\,777" },
      { tex: "111\\,111\\,111 \\cdot 2 = 222\\,222\\,222" },
    ],
  },
  "tn261-goi-y": {
    kind: "lines",
    label: "Thử với một bài tương tự",
    rows: [
      {
        tex: "25 \\cdot a \\cdot 4 = 25 \\cdot 4 \\cdot a",
        tag: { text: "Đổi chỗ các thừa số", color: "teal" },
      },
      {
        tex: "= (25 \\cdot 4) \\cdot a",
        tag: { text: "Nhóm hai thừa số", color: "blue" },
      },
      { tex: "= 100 \\cdot a" },
    ],
    mode: "hint",
  },
  sticker: { kind: "sticker" },
  "chia-9-4536-xong": {
    kind: "lines",
    label: "Số 4 536 chia hết cho 9",
    rows: [
      {
        tex: "4 + 5 + 3 + 6 = 18",
        tag: { text: "Tổng các chữ số", color: "lime" },
      },
      {
        tex: "18 \\chiahet 9",
        tag: { text: "18 chia hết cho 9", color: "teal" },
      },
      {
        tex: "4\\,536 \\chiahet 9",
        tag: { text: "4 536 chia hết cho 9", color: "teal" },
      },
    ],
    mode: "still",
  },
  "tong-hs-vi-du-xong": {
    kind: "lines",
    label: "Tổng của hai số chia hết cho 3",
    rows: [
      {
        tex: "6 \\chiahet 3",
        tag: { text: "6 chia hết cho 3", color: "teal" },
      },
      {
        tex: "9 \\chiahet 3",
        tag: { text: "9 chia hết cho 3", color: "teal" },
      },
      {
        tex: "6 + 9 = 15 \\chiahet 3",
        tag: { text: "Tổng chia hết cho 3", color: "teal" },
      },
      {
        tex: "15 = 3 \\cdot 5",
        tag: { text: "Có ước 3 nên là hợp số", color: "pink" },
      },
    ],
    mode: "still",
  },
  "tong-3-so-hang-xong": {
    kind: "lines",
    label: "Tổng có một số hạng không chia hết cho 2",
    rows: [
      {
        tex: "40 \\chiahet 2",
        tag: { text: "40 chia hết cho 2", color: "teal" },
      },
      {
        tex: "15 \\khongchiahet 2",
        tag: { text: "15 không chia hết cho 2", color: "pink" },
      },
      {
        tex: "30 \\chiahet 2",
        tag: { text: "30 chia hết cho 2", color: "teal" },
      },
      {
        tex: "40 + 15 + 30 = 85 \\khongchiahet 2",
        tag: { text: "Tổng không chia hết cho 2", color: "pink" },
        gapBefore: true,
      },
    ],
    mode: "still",
  },
  "chia-3-216-xong": {
    kind: "lines",
    label: "Số 216 chia hết cho 3",
    rows: [
      { tex: "2 + 1 + 6 = 9", tag: { text: "Tổng các chữ số", color: "lime" } },
      {
        tex: "9 \\chiahet 3",
        tag: { text: "9 chia hết cho 3", color: "teal" },
      },
      {
        tex: "216 \\chiahet 3",
        tag: { text: "216 chia hết cho 3", color: "teal" },
      },
    ],
    mode: "still",
  },
  "phan-tich-60-xong": {
    kind: "lines",
    label: "Phân tích 60 ra thừa số nguyên tố",
    rows: [
      { tex: "60 : 2 = 30" },
      { tex: "30 : 2 = 15" },
      { tex: "15 : 3 = 5" },
      { tex: "5 : 5 = 1" },
      {
        tex: "60 = \\concept{sky}{2} \\cdot \\concept{sky}{2} \\cdot \\concept{sky}{3} \\cdot \\concept{sky}{5}",
        tag: { text: "Các thừa số nguyên tố", color: "sky" },
        gapBefore: true,
      },
    ],
    mode: "still",
  },
  "tim-n-8-xong": {
    kind: "lines",
    label: "Tìm n khi 8 chia hết cho n + 1",
    rows: [
      { tex: "8 \\chiahet (n + 1)" },
      {
        tex: "n + 1 = 1,\\ 2,\\ 4,\\ 8",
        tag: { text: "n + 1 là ước của 8", color: "violet" },
      },
      {
        tex: "n = 0,\\ 1,\\ 3,\\ 7",
        tag: { text: "Bớt 1 ở mỗi ước", color: "teal" },
      },
    ],
    mode: "still",
  },
  "uoc-cua-8-xong": {
    kind: "lines",
    label: "Các ước của 8",
    rows: [
      { tex: "8 = 1 \\cdot 8" },
      { tex: "8 = 2 \\cdot 4" },
      {
        tex: "1,\\ 2,\\ 4,\\ 8",
        tag: { text: "Các ước của 8", color: "violet" },
        gapBefore: true,
      },
    ],
    mode: "still",
  },
  "khoang-bcnn-xong": {
    kind: "lines",
    label: "Tìm số trong một khoảng",
    rows: [
      { tex: "12", tag: { text: "BCNN(4, 6)", color: "pink" } },
      {
        tex: "12,\\ 24,\\ 36,\\ 48,\\ 60,\\ \\ldots",
        tag: { text: "Các bội chung của 4 và 6", color: "lime" },
      },
      {
        tex: "30 < n < 50:\\ n = 36,\\ 48",
        tag: { text: "Chọn số trong khoảng", color: "amber" },
      },
    ],
    mode: "still",
  },
  "mu-tim-b-xong": {
    kind: "lines",
    label: "Tìm số mũ chưa biết",
    rows: [
      {
        tex: "2^{5} \\cdot 3^{a}",
        tag: { text: "Số thứ nhất", color: "slate" },
      },
      { tex: "2^{b} \\cdot 3", tag: { text: "Số thứ hai", color: "slate" } },
      {
        tex: "2^{2} \\cdot 3",
        tag: { text: "ƯCLN", color: "amber" },
        gapBefore: true,
      },
      { tex: "2^{5} \\cdot 3^{4}", tag: { text: "BCNN", color: "pink" } },
      {
        tex: "b = 2,\\ a = 4",
        tag: {
          text: "Thừa số 2: số mũ nhỏ nhất là 2. Thừa số 3: số mũ lớn nhất là 4.",
          color: "teal",
        },
        gapBefore: true,
      },
    ],
    mode: "still",
  },
  "tich-12-18-xong": {
    kind: "lines",
    label: "ƯCLN nhân BCNN bằng tích hai số",
    rows: [
      { tex: "6", tag: { text: "ƯCLN(12, 18)", color: "amber" } },
      { tex: "36", tag: { text: "BCNN(12, 18)", color: "pink" } },
      { tex: "12 \\cdot 18 = 216", gapBefore: true },
      {
        tex: "6 \\cdot 36 = 216",
        tag: { text: "Hai tích bằng nhau", color: "teal" },
      },
    ],
    mode: "still",
  },
  "quy-dong-vi-du-xong": {
    kind: "lines",
    label: "Cộng hai phân số khác mẫu",
    rows: [
      { tex: "\\frac{1}{4} + \\frac{1}{6}" },
      {
        tex: "= \\frac{1 \\cdot 3}{4 \\cdot 3} + \\frac{1 \\cdot 2}{6 \\cdot 2} = \\frac{3}{12} + \\frac{2}{12}",
        tag: { text: "Quy đồng với mẫu số chung 12", color: "blue" },
      },
      {
        tex: "= \\frac{5}{12}",
        tag: { text: "Cộng hai tử, giữ nguyên mẫu", color: "teal" },
      },
    ],
    mode: "still",
  },
  "tru-vi-du-xong": {
    kind: "lines",
    label: "Trừ hai phân số khác mẫu",
    rows: [
      { tex: "\\frac{5}{6} - \\frac{3}{4}" },
      {
        tex: "= \\frac{5 \\cdot 2}{6 \\cdot 2} - \\frac{3 \\cdot 3}{4 \\cdot 3} = \\frac{10}{12} - \\frac{9}{12}",
        tag: { text: "Quy đồng với mẫu số chung 12", color: "blue" },
      },
      {
        tex: "= \\frac{1}{12}",
        tag: { text: "Trừ hai tử, giữ nguyên mẫu", color: "teal" },
      },
    ],
    mode: "still",
  },
  "giao-hoan-ket-hop-xong": {
    kind: "lines",
    label: "Đổi chỗ và nhóm các thừa số",
    rows: [
      {
        tex: "7 \\cdot 4 \\cdot 25 = 7 \\cdot 25 \\cdot 4",
        tag: { text: "Đổi chỗ các thừa số", color: "teal" },
      },
      {
        tex: "= (7 \\cdot 25) \\cdot 4",
        tag: { text: "Nhóm hai thừa số", color: "blue" },
      },
      { tex: "= 175 \\cdot 4 = 700" },
    ],
    mode: "still",
  },
};
