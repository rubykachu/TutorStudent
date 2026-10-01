import type { BagsSpec } from "@/visuals/shared/bag-groups";
import type { LinesSpec, Mode, RowsSpec } from "@/visuals/shared/formula-rows";
import type { ChipsSpec } from "@/visuals/shared/pick-chips";

// Every picture of the lesson that is drawn from numbers: the registry builds
// one entry per item (id `dau-hieu-chia-het.visual.<key>`), so a new example
// is one item here and its id in lesson.json. Pure data, no React, so
// `content:check` reads it.

export { LESSON_SLUG } from "./logic";

export type VisualSpec =
  // Items packed into bags, one bag per step (see `BagsSpec`).
  | ({ kind: "bags" } & BagsSpec)
  // Formulas stacked, each with an optional tag (see `RowsSpec`).
  | ({ kind: "rows" } & RowsSpec)
  // Lines of a worked example, one more on every step (see `LinesSpec`).
  | ({ kind: "lines" } & LinesSpec)
  // Numbers the child taps to pick, state { i0, i1, … } (see `ChipsSpec`).
  | ({ kind: "chips" } & ChipsSpec)
  // The digits of `n` as tiles; the last one is picked out, then the verdict
  // "n divisible by divisor" with the digit that decided it. `divisor` 0
  // means no verdict: the picture ends on the picked digit. In "hint" the
  // last step stays a "?".
  | { kind: "digits"; n: number; divisor: number; mode: Mode }
  // Still picture: for every divisor a row of the tiles 0..9, filled where a
  // number ending in that digit is divisible; with several divisors a last
  // row marks the digits that fit all of them.
  | { kind: "endDigits"; divisors: readonly number[] }
  // The digits of `n` as tiles, their sum, whether the sum is divisible by
  // `divisor`, then the verdict for `n`; `divisor` 0 means the sum only. In
  // "hint" the last line stays a "?".
  | { kind: "digitSum"; n: number; divisor: number; mode: Mode }
  // Hands-on: `before` digits, one box, `after` digits; the child picks the
  // box's digit 0..9, state { d }. `divisors` are the ones the number must
  // be divisible by. `goal` (lesson screen) adds a live verdict, progress and
  // a closing line; in an exercise the params override before, after,
  // afterLen, divisor and divisor2, and nothing is revealed.
  | {
      kind: "digitBox";
      before: string;
      after: string;
      divisors: readonly number[];
      goal: boolean;
    }
  | { kind: "sticker" };

export type SpecKind = VisualSpec["kind"];
export type SpecOf<K extends SpecKind> = Extract<VisualSpec, { kind: K }>;

// Kinds the child acts on (counted as interactive by `--stats`).
export const INTERACTIVE_KINDS: ReadonlySet<SpecKind> = new Set([
  "chips",
  "digitBox",
]);

// Validator id of the `manipulate` exercises each interactive kind serves;
// "chon-dung" is the validator shared with the set lesson's pick screens.
export const VALIDATOR_IDS = {
  chips: "chon-dung",
  digitBox: "chia-het",
} as const;

export const VISUAL_SPECS: Readonly<Record<string, VisualSpec>> = {
  "goi-y-9816-2": {
    kind: "digits",
    n: 9816,
    divisor: 2,
    mode: "hint",
  },
  "o-trong-61-2": {
    kind: "digitBox",
    before: "61",
    after: "",
    divisors: [2],
    goal: false,
  },
  "tan-cung-4376": {
    kind: "digits",
    n: 4376,
    divisor: 0,
    mode: "still",
  },
  "tui-16-2": {
    kind: "bags",
    total: 16,
    size: 2,
    thing: "bi",
    unit: "viên",
    bag: "túi",
    mode: "steps",
    plainBagCount: true,
  },
  "so-cuoi-2": {
    kind: "endDigits",
    divisors: [2],
  },
  "thu-cuoi-43": {
    kind: "digitBox",
    before: "43",
    after: "",
    divisors: [2],
    goal: true,
  },
  "goi-y-tien-30": {
    kind: "bags",
    total: 30,
    size: 5,
    thing: "đồng",
    unit: "nghìn",
    bag: "tờ",
    mode: "steps",
    plainBagCount: true,
  },
  "giai-tien-45": {
    kind: "bags",
    total: 45,
    size: 5,
    thing: "đồng",
    unit: "nghìn",
    bag: "tờ",
    mode: "solution",
    plainBagCount: true,
  },
  "o-trong-72-5": {
    kind: "digitBox",
    before: "72",
    after: "",
    divisors: [5],
    goal: false,
  },
  "tui-20-5": {
    kind: "bags",
    total: 20,
    size: 5,
    thing: "kẹo",
    unit: "cái",
    bag: "túi",
    mode: "steps",
    plainBagCount: true,
  },
  "so-cuoi-5": {
    kind: "endDigits",
    divisors: [5],
  },
  "thu-cuoi-17": {
    kind: "digitBox",
    before: "17",
    after: "",
    divisors: [5],
    goal: true,
  },
  "tien-135-5": {
    kind: "lines",
    label: "Số 135 chia hết cho 5",
    mode: "still",
    rows: [
      {
        tex: "13\\concept{teal}{5} \\chiahet 5",
        tag: {
          text: "Chữ số tận cùng là 5",
          color: "teal",
        },
      },
    ],
  },
  "o-trong-84-2-5": {
    kind: "digitBox",
    before: "84",
    after: "",
    divisors: [2, 5],
    goal: false,
  },
  "so-cuoi-2-5": {
    kind: "endDigits",
    divisors: [2, 5],
  },
  "lop-30-ban": {
    kind: "lines",
    label: "Lớp có 30 bạn xếp cặp hoặc xếp nhóm",
    mode: "steps",
    rows: [
      {
        tex: "30 \\chiahet 2",
        tag: {
          text: "Xếp cặp 2 bạn, vừa hết",
          color: "slate",
        },
      },
      {
        tex: "30 \\chiahet 5",
        tag: {
          text: "Xếp nhóm 5 bạn, vừa hết",
          color: "slate",
        },
      },
      {
        tex: "3\\concept{teal}{0}",
        tag: {
          text: "Chữ số tận cùng là 0",
          color: "teal",
        },
      },
    ],
  },
  "chon-2-5-20": {
    kind: "chips",
    items: ["20", "35", "40", "58", "70"],
    wants: [0, 2, 4],
    done: "Bạn đã chọn đủ các số chia hết cho cả 2 và 5.",
  },
  "goi-y-cong-4152": {
    kind: "lines",
    label: "Cộng lần lượt các chữ số của 4 152",
    mode: "hint",
    rows: [
      {
        tex: "4\\,152",
        tag: {
          text: "Số đang xét, cộng từng chữ số",
          color: "slate",
        },
      },
      {
        tex: "4 + 1 = 5",
      },
      {
        tex: "5 + 5 = 10",
      },
      {
        tex: "10 + 2 = 12",
      },
    ],
  },
  "giai-cong-7036": {
    kind: "lines",
    label: "Cộng lần lượt các chữ số của 7 036",
    mode: "steps",
    rows: [
      {
        tex: "7 + 0 = 7",
      },
      {
        tex: "7 + 3 = 10",
      },
      {
        tex: "10 + 6 = 16",
      },
    ],
  },
  "tong-5214": {
    kind: "digitSum",
    n: 5214,
    divisor: 0,
    mode: "still",
  },
  "cong-6384": {
    kind: "lines",
    label: "Cộng lần lượt các chữ số của 6 384",
    mode: "steps",
    rows: [
      {
        tex: "6\\,384",
        tag: {
          text: "Số nhà của Hà",
          color: "slate",
        },
      },
      {
        tex: "6 + 3 = 9",
        tag: {
          text: "Cộng hai chữ số đầu",
          color: "slate",
        },
      },
      {
        tex: "9 + 8 = 17",
        tag: {
          text: "Cộng thêm chữ số kế",
          color: "slate",
        },
      },
      {
        tex: "17 + 4 = \\concept{lime}{21}",
        tag: {
          text: "Cộng chữ số tận cùng",
          color: "slate",
        },
      },
    ],
  },
  "chon-tong-9": {
    kind: "chips",
    items: ["2 340", "1 900", "5 400", "3 010"],
    wants: [0, 2],
    done: "Bạn đã chọn đủ các số có tổng các chữ số bằng 9.",
  },
  "tom-tat-tong-8215": {
    kind: "digitSum",
    n: 8215,
    divisor: 0,
    mode: "still",
  },
  "o-trong-4-5-9": {
    kind: "digitBox",
    before: "4",
    after: "5",
    divisors: [9],
    goal: false,
  },
  "hop-27-9": {
    kind: "bags",
    total: 27,
    size: 9,
    thing: "bánh",
    unit: "cái",
    bag: "hộp",
    mode: "steps",
    plainBagCount: true,
  },
  "tong-5976-9": {
    kind: "digitSum",
    n: 5976,
    divisor: 9,
    mode: "still",
  },
  "bang-chin": {
    kind: "rows",
    label: "Các số chia hết cho 9 từ 9 đến 45",
    rows: [
      {
        tex: "9 \\cdot 1 = 9",
      },
      {
        tex: "9 \\cdot 2 = 18",
      },
      {
        tex: "9 \\cdot 3 = 27",
      },
      {
        tex: "9 \\cdot 4 = 36",
      },
      {
        tex: "9 \\cdot 5 = 45",
      },
    ],
  },
  "chon-9-243": {
    kind: "chips",
    items: ["243", "512", "1 620", "730"],
    wants: [0, 2],
    done: "Bạn đã chọn đủ các số chia hết cho 9.",
  },
  "tom-tat-2439-9": {
    kind: "digitSum",
    n: 2439,
    divisor: 9,
    mode: "still",
  },
  "o-trong-5-4-3": {
    kind: "digitBox",
    before: "5",
    after: "4",
    divisors: [3],
    goal: false,
  },
  "tui-24-3": {
    kind: "bags",
    total: 24,
    size: 3,
    thing: "kẹo",
    unit: "cái",
    bag: "túi",
    mode: "steps",
    plainBagCount: true,
  },
  "tong-2415-3": {
    kind: "digitSum",
    n: 2415,
    divisor: 3,
    mode: "still",
  },
  "ba-khac-chin": {
    kind: "rows",
    label: "Tổng 12 chia hết cho 3 nhưng không chia hết cho 9",
    rows: [
      {
        tex: "12 \\chiahet 3",
        tag: {
          text: "Tổng chia hết cho 3",
          color: "lime",
        },
      },
      {
        tex: "12 \\khongchiahet 9",
        tag: {
          text: "Tổng không chia hết cho 9",
          color: "lime",
        },
      },
      {
        tex: "2\\,415 \\chiahet 3",
        tag: {
          text: "Chia hết cho 3",
          color: "slate",
        },
      },
      {
        tex: "2\\,415 \\khongchiahet 9",
        tag: {
          text: "Không chia hết cho 9",
          color: "slate",
        },
      },
    ],
  },
  "chon-3-1410": {
    kind: "chips",
    items: ["1 410", "2 501", "4 080", "3 506"],
    wants: [0, 2],
    done: "Bạn đã chọn đủ các số chia hết cho 3.",
  },
  "tom-tat-3207-3": {
    kind: "digitSum",
    n: 3207,
    divisor: 3,
    mode: "still",
  },
  "xet-2136": {
    kind: "lines",
    label: "Xét 2 136 có chia hết cho cả 2 và 3 không",
    mode: "steps",
    rows: [
      {
        tex: "2\\,136 \\chiahet 2",
        tag: {
          text: "Chữ số tận cùng là 6",
          color: "teal",
        },
      },
      {
        tex: "2 + 1 + 3 + 6 = 12",
        tag: {
          text: "Tổng các chữ số",
          color: "lime",
        },
      },
      {
        tex: "12 \\chiahet 3",
        tag: {
          text: "12 chia hết cho 3",
          color: "lime",
        },
      },
      {
        tex: "",
        tag: {
          text: "Vậy 2 136 chia hết cho cả 2 và 3",
          color: "slate",
        },
      },
    ],
  },
  "hai-dau-hieu": {
    kind: "rows",
    label: "Số 312 chia hết cho cả 2 và 3",
    rows: [
      {
        tex: "312 \\chiahet 2",
        tag: {
          text: "Chữ số tận cùng là 2",
          color: "teal",
        },
      },
      {
        tex: "3 + 1 + 2 = 6 \\chiahet 3",
        tag: {
          text: "Tổng các chữ số là 6",
          color: "lime",
        },
      },
      {
        tex: "",
        tag: {
          text: "Vậy 312 chia hết cho cả 2 và 3",
          color: "slate",
        },
      },
    ],
  },
  "chon-2-3-1230": {
    kind: "chips",
    items: ["1 230", "2 015", "2 160", "1 504"],
    wants: [0, 2],
    done: "Bạn đã chọn đủ các số chia hết cho cả 2 và 3.",
  },
  "tom-tat-hai-dau-hieu": {
    kind: "rows",
    label: "Số 534 chia hết cho cả 2 và 3",
    rows: [
      {
        tex: "534 \\chiahet 2",
        tag: {
          text: "Chữ số tận cùng là 4",
          color: "teal",
        },
      },
      {
        tex: "5 + 3 + 4 = 12 \\chiahet 3",
        tag: {
          text: "Tổng các chữ số là 12",
          color: "lime",
        },
      },
      {
        tex: "",
        tag: {
          text: "Vậy 534 chia hết cho cả 2 và 3",
          color: "slate",
        },
      },
    ],
  },
  "giai-banh-60": {
    kind: "lines",
    label: "Số bánh và số túi",
    mode: "steps",
    rows: [
      {
        tex: "10 : 5 = 2",
        tag: {
          text: "Mỗi hộp xếp được 2 túi",
          color: "amber",
        },
      },
      {
        tex: "2 \\cdot 6 = 12",
        tag: {
          text: "6 hộp xếp được 12 túi",
          color: "amber",
        },
      },
    ],
  },
  "hop-6-7": {
    kind: "lines",
    label: "Tích 6 nhân 7 chia hết cho 3",
    mode: "steps",
    rows: [
      {
        tex: "\\concept{blue}{6} \\chiahet 3",
        tag: {
          text: "Thừa số 6 chia hết cho 3",
          color: "blue",
        },
      },
      {
        tex: "\\concept{blue}{6} \\cdot 7 = \\concept{lime}{42}",
        tag: {
          text: "Tích",
          color: "amber",
        },
      },
      {
        tex: "\\concept{lime}{42} \\chiahet 3",
        tag: {
          text: "Tích chia hết cho 3",
          color: "amber",
        },
      },
    ],
  },
  "tich-12-7": {
    kind: "rows",
    label: "Tích 12 nhân 7 chia hết cho 4",
    rows: [
      {
        tex: "\\concept{blue}{12} \\cdot 7",
        tag: {
          text: "12 chia hết cho 4",
          color: "blue",
        },
      },
      {
        tex: "(12 \\cdot 7) \\chiahet 4",
        tag: {
          text: "Tích chia hết cho 4",
          color: "amber",
        },
      },
    ],
  },
  "chon-tich-5": {
    kind: "chips",
    items: ["15 · 7", "3 · 4", "12 · 20", "2 · 7"],
    wants: [0, 2],
    done: "Bạn đã chọn đủ các tích chia hết cho 5.",
  },
  "tom-tat-tich-10-3": {
    kind: "rows",
    label: "Tích 10 nhân 3 chia hết cho 5",
    rows: [
      {
        tex: "\\concept{blue}{10} \\cdot 3",
        tag: {
          text: "10 chia hết cho 5",
          color: "blue",
        },
      },
      {
        tex: "(10 \\cdot 3) \\chiahet 5",
        tag: {
          text: "Tích chia hết cho 5",
          color: "amber",
        },
      },
    ],
  },
  "tong-1640-3272": {
    kind: "lines",
    label: "Xét tổng 1 640 cộng 3 272 có chia hết cho 2 không",
    mode: "steps",
    rows: [
      {
        tex: "1\\,640 \\chiahet 2",
        tag: {
          text: "Chữ số tận cùng là 0",
          color: "teal",
        },
      },
      {
        tex: "3\\,272 \\chiahet 2",
        tag: {
          text: "Chữ số tận cùng là 2",
          color: "teal",
        },
      },
      {
        tex: "(1\\,640 + 3\\,272) \\chiahet 2",
        tag: {
          text: "Tổng chia hết cho 2",
          color: "slate",
        },
      },
    ],
  },
  "hieu-4275-1132": {
    kind: "lines",
    label: "Xét hiệu 4 275 trừ 1 132 có chia hết cho 5 không",
    mode: "steps",
    rows: [
      {
        tex: "4\\,275 \\chiahet 5",
        tag: {
          text: "Chữ số tận cùng là 5",
          color: "teal",
        },
      },
      {
        tex: "1\\,132 \\khongchiahet 5",
        tag: {
          text: "Chữ số tận cùng là 2",
          color: "teal",
        },
      },
      {
        tex: "(4\\,275 - 1\\,132) \\khongchiahet 5",
        tag: {
          text: "Hiệu không chia hết cho 5",
          color: "slate",
        },
      },
    ],
  },
  "goi-y-hieu-3460-1213": {
    kind: "lines",
    label: "Xét hiệu 3 460 trừ 1 213 có chia hết cho 5 không",
    mode: "hint",
    rows: [
      {
        tex: "3\\,460 \\chiahet 5",
        tag: {
          text: "Chữ số tận cùng là 0",
          color: "teal",
        },
      },
      {
        tex: "1\\,213 \\khongchiahet 5",
        tag: {
          text: "Chữ số tận cùng là 3",
          color: "teal",
        },
      },
      {
        tex: "(3\\,460 - 1\\,213) \\khongchiahet 5",
        tag: {
          text: "Hiệu không chia hết cho 5",
          color: "slate",
        },
      },
    ],
  },
  "goi-y-7062-9": {
    kind: "digitSum",
    n: 7062,
    divisor: 9,
    mode: "hint",
  },
  "tong-40-15": {
    kind: "rows",
    label: "Tổng chia hết và không chia hết cho 5",
    rows: [
      {
        tex: "(40 + 15) \\chiahet 5",
        tag: {
          text: "Hai số đều chia hết cho 5",
          color: "slate",
        },
      },
      {
        tex: "(40 + 12) \\khongchiahet 5",
        tag: {
          text: "Một số không chia hết cho 5",
          color: "slate",
        },
      },
    ],
  },
  "chon-tong-hieu-30": {
    kind: "chips",
    items: ["30 + 14", "25 + 12", "56 − 22", "47 − 20"],
    wants: [0, 2],
    done: "Bạn đã chọn đủ các tổng và hiệu chia hết cho 2.",
  },
  "tom-tat-tong-20-35": {
    kind: "rows",
    label: "Tổng chia hết và không chia hết cho 5",
    rows: [
      {
        tex: "(20 + 35) \\chiahet 5",
        tag: {
          text: "Hai số đều chia hết cho 5",
          color: "slate",
        },
      },
      {
        tex: "(20 + 33) \\khongchiahet 5",
        tag: {
          text: "Một số không chia hết cho 5",
          color: "slate",
        },
      },
    ],
  },
  "mu-10-4": {
    kind: "lines",
    label: "Luỹ thừa 10 mũ 4",
    mode: "still",
    rows: [
      {
        tex: "10^{4} = 10\\,000",
        tag: {
          text: "Một chữ số 1 và bốn chữ số 0",
          color: "slate",
        },
      },
      {
        tex: "1 + 0 + 0 + 0 + 0 = 1",
        tag: {
          text: "Tổng các chữ số là 1",
          color: "lime",
        },
      },
    ],
  },
  "tong-10-2-4": {
    kind: "lines",
    label: "Xét tổng 10 mũ 2 cộng 4 có chia hết cho 9 không",
    mode: "steps",
    rows: [
      {
        tex: "10^{2} + 4 = 104",
        tag: {
          text: "Cộng 4 vào số 100",
          color: "slate",
        },
      },
      {
        tex: "1 + 0 + 0 + 4 = 5",
        tag: {
          text: "Tổng các chữ số là 5",
          color: "lime",
        },
      },
      {
        tex: "(10^{2} + 4) \\khongchiahet 9",
        tag: {
          text: "Không chia hết cho 9",
          color: "slate",
        },
      },
    ],
  },
  "chon-10-3": {
    kind: "chips",
    items: ["10³ + 2", "10³ + 3", "10⁵ + 5", "10⁴ + 4"],
    wants: [0, 2],
    done: "Bạn đã chọn đủ các tổng chia hết cho 3.",
  },
  "tom-tat-10-3": {
    kind: "lines",
    label: "Luỹ thừa 10 mũ 3 cộng thêm một số",
    mode: "still",
    rows: [
      {
        tex: "10^{3} = 1\\,000",
        tag: {
          text: "Một chữ số 1 và ba chữ số 0",
          color: "slate",
        },
      },
      {
        tex: "1 + 0 + 0 + 0 = 1",
        tag: {
          text: "Tổng các chữ số là 1",
          color: "lime",
        },
      },
      {
        tex: "10^{3} + 1 = 1\\,001",
        tag: {
          text: "Cộng thêm 1",
          color: "slate",
        },
      },
      {
        tex: "1 + 0 + 0 + 1 = 2",
        tag: {
          text: "Tổng các chữ số là 1 + 1 = 2",
          color: "lime",
        },
      },
    ],
  },
  "giai-4d6": {
    kind: "lines",
    label: "Tìm chữ số d của số 4d6",
    mode: "steps",
    rows: [
      {
        tex: "4 + d + 6 = 10 + d",
        tag: {
          text: "Tổng các chữ số",
          color: "lime",
        },
      },
      {
        tex: "10 + d = 18",
        tag: {
          text: "Tổng từ 10 đến 19, chỉ 18 chia hết cho 9",
          color: "lime",
        },
      },
      {
        tex: "d = 8",
        tag: {
          text: "Số cần tìm là 486",
          color: "slate",
        },
      },
    ],
  },
  "o-trong-7-5-9": {
    kind: "digitBox",
    before: "7",
    after: "5",
    divisors: [9],
    goal: false,
  },
  "giai-ab-12d": {
    kind: "lines",
    label: "Tìm chữ số d của số 12d",
    mode: "steps",
    rows: [
      {
        tex: "1 + 2 + d = 3 + d",
        tag: {
          text: "Tổng các chữ số của số 12d",
          color: "lime",
        },
      },
      {
        tex: "3 + d = 9",
        tag: {
          text: "Tổng từ 3 đến 12, chỉ 9 chia hết cho 9",
          color: "lime",
        },
      },
      {
        tex: "d = 6",
        tag: {
          text: "Số 12d là 126",
          color: "slate",
        },
      },
      {
        tex: "\\overline{ab} = 126 : 9 = 14",
        tag: {
          text: "Vậy số ab là 14",
          color: "slate",
        },
      },
    ],
  },
  "tim-38a": {
    kind: "lines",
    label: "Tìm chữ số a của số 38a chia hết cho 9",
    mode: "steps",
    rows: [
      {
        tex: "\\overline{38a} \\chiahet 9",
        tag: {
          text: "Tìm chữ số a",
          color: "slate",
        },
      },
      {
        tex: "3 + 8 + a = 11 + a",
        tag: {
          text: "Tổng các chữ số",
          color: "lime",
        },
      },
      {
        tex: "11 \\leq 11 + a \\leq 20",
        tag: {
          text: "a từ 0 đến 9",
          color: "lime",
        },
      },
      {
        tex: "11 + a = 18",
        tag: {
          text: "Chỉ có 18 chia hết cho 9",
          color: "lime",
        },
      },
      {
        tex: "a = 7",
        tag: {
          text: "Số cần tìm là 387",
          color: "slate",
        },
      },
    ],
  },
  "tim-24a": {
    kind: "lines",
    label: "Tìm chữ số a của số 24a chia hết cho cả 3 và 5",
    mode: "still",
    rows: [
      {
        tex: "\\overline{24a}",
        tag: {
          text: "Tìm a để số chia hết cho cả 3 và 5",
          color: "slate",
        },
      },
      {
        tex: "\\overline{24a} \\chiahet 5",
        tag: {
          text: "a là 0 hoặc 5",
          color: "teal",
        },
      },
      {
        tex: "2 + 4 + 0 = 6 \\chiahet 3",
        tag: {
          text: "Thử a = 0: được",
          color: "lime",
        },
      },
      {
        tex: "2 + 4 + 5 = 11 \\khongchiahet 3",
        tag: {
          text: "Thử a = 5: không được",
          color: "lime",
        },
      },
      {
        tex: "a = 0",
        tag: {
          text: "Số cần tìm là 240",
          color: "slate",
        },
      },
    ],
  },
  "thu-5-2-9": {
    kind: "digitBox",
    before: "5",
    after: "2",
    divisors: [9],
    goal: true,
  },
  "tim-ab-11d": {
    kind: "lines",
    label: "Tìm số ab của phép nhân ab nhân 9 bằng 11d",
    mode: "steps",
    rows: [
      {
        tex: "\\overline{ab} \\cdot 9 = \\overline{11d}",
        tag: {
          text: "Thay chữ bằng chữ số",
          color: "slate",
        },
      },
      {
        tex: "\\overline{11d} \\chiahet 9",
        tag: {
          text: "Là tích có thừa số 9",
          color: "slate",
        },
      },
      {
        tex: "1 + 1 + d = 9",
        tag: {
          text: "Chỉ 9 chia hết cho 9, nên d = 7",
          color: "lime",
        },
      },
      {
        tex: "\\overline{11d} = 117",
        tag: {
          text: "Thay d bằng 7",
          color: "slate",
        },
      },
      {
        tex: "\\overline{ab} = 117 : 9 = 13",
        tag: {
          text: "Vậy số ab là 13",
          color: "slate",
        },
      },
    ],
  },
  "tom-tat-tim-58c": {
    kind: "lines",
    label: "Tìm chữ số c của số 58c chia hết cho cả 5 và 9",
    mode: "still",
    rows: [
      {
        tex: "\\overline{58c}",
        tag: {
          text: "Tìm c để số chia hết cho cả 5 và 9",
          color: "slate",
        },
      },
      {
        tex: "\\overline{58c} \\chiahet 5",
        tag: {
          text: "c là 0 hoặc 5",
          color: "teal",
        },
      },
      {
        tex: "5 + 8 + 0 = 13 \\khongchiahet 9",
        tag: {
          text: "Thử c = 0: không được",
          color: "lime",
        },
      },
      {
        tex: "5 + 8 + 5 = 18 \\chiahet 9",
        tag: {
          text: "Thử c = 5: được",
          color: "lime",
        },
      },
      {
        tex: "c = 5",
        tag: {
          text: "Số cần tìm là 585",
          color: "slate",
        },
      },
    ],
  },
  "lan-7-2": {
    kind: "lines",
    label: "Điểm của bạn Lan",
    mode: "steps",
    rows: [
      {
        tex: "6 \\cdot 7 = 42",
        tag: {
          text: "Điểm được",
          color: "amber",
        },
      },
      {
        tex: "3 \\cdot 2 = 6",
        tag: {
          text: "Điểm bị trừ",
          color: "pink",
        },
      },
      {
        tex: "42 - 6 = 36",
        tag: {
          text: "Điểm cả bài",
          color: "slate",
        },
      },
      {
        tex: "36 \\chiahet 3",
        tag: {
          text: "Chia hết cho 3",
          color: "slate",
        },
      },
    ],
  },
  "diem-chia-het-3": {
    kind: "rows",
    label: "Điểm của bài chia hết cho 3",
    rows: [
      {
        tex: "6 \\chiahet 3",
        tag: {
          text: "Điểm mỗi câu đúng",
          color: "amber",
        },
      },
      {
        tex: "3 \\chiahet 3",
        tag: {
          text: "Điểm mỗi câu sai bị trừ",
          color: "pink",
        },
      },
      {
        tex: "6 \\cdot 7 - 3 \\cdot 2 = 36 \\chiahet 3",
        tag: {
          text: "Điểm cả bài, chia hết cho 3",
          color: "slate",
        },
      },
      {
        tex: "29 \\khongchiahet 3",
        tag: {
          text: "Báo 29 điểm: chắc chắn tính sai",
          color: "slate",
        },
      },
    ],
  },
  "chon-diem-24": {
    kind: "chips",
    items: ["24", "35", "48", "50"],
    wants: [1, 3],
    done: "Bạn đã chọn đủ các số điểm chắc chắn tính sai.",
  },
  "tom-tat-diem": {
    kind: "rows",
    label: "Điểm của bài chia hết cho 3",
    rows: [
      {
        tex: "12 \\chiahet 3",
        tag: {
          text: "Điểm mỗi câu đúng",
          color: "amber",
        },
      },
      {
        tex: "3 \\chiahet 3",
        tag: {
          text: "Điểm mỗi câu sai bị trừ",
          color: "pink",
        },
      },
      {
        tex: "12 \\cdot 2 - 3 \\cdot 5 = 9 \\chiahet 3",
        tag: {
          text: "Điểm cả bài, chia hết cho 3",
          color: "slate",
        },
      },
      {
        tex: "31 \\khongchiahet 3",
        tag: {
          text: "Báo 31 điểm: chắc chắn tính sai",
          color: "slate",
        },
      },
    ],
  },
  "giai-vo-65": {
    kind: "lines",
    label: "Số bút và số vở",
    mode: "steps",
    rows: [
      {
        tex: "9 \\cdot x \\chiahet 5",
        tag: {
          text: "Tiền bút chia hết cho 5",
          color: "slate",
        },
      },
      {
        tex: "9,\\; 18,\\; 27,\\; 36,\\; 45,\\; 54",
        tag: {
          text: "Tiền bút nhỏ hơn 65",
          color: "amber",
        },
      },
      {
        tex: "9 \\cdot 5 = 45",
        tag: {
          text: "Tiền bút là 45 nghìn đồng",
          color: "amber",
        },
      },
      {
        tex: "65 - 45 = 20",
        tag: {
          text: "Tiền vở",
          color: "amber",
        },
      },
      {
        tex: "20 : 5 = 4",
        tag: {
          text: "Mua 4 quyển vở",
          color: "amber",
        },
      },
    ],
  },
  "but-vo-55": {
    kind: "lines",
    label: "Tiền bút, tiền vở và tổng tiền",
    mode: "still",
    rows: [
      {
        tex: "7 \\cdot x",
        tag: {
          text: "Tiền bút: x cái, mỗi cái 7 nghìn",
          color: "amber",
        },
      },
      {
        tex: "5 \\cdot y",
        tag: {
          text: "Tiền vở: y quyển, mỗi quyển 5 nghìn",
          color: "pink",
        },
      },
      {
        tex: "7 \\cdot x + 5 \\cdot y = 55",
        tag: {
          text: "Tổng tiền 55 nghìn",
          color: "slate",
        },
      },
    ],
  },
  "tien-vo-chia-het-5": {
    kind: "lines",
    label: "Tiền bút phải chia hết cho 5",
    mode: "still",
    rows: [
      {
        tex: "5 \\cdot y \\chiahet 5",
        tag: {
          text: "Tiền vở chia hết cho 5",
          color: "pink",
        },
      },
      {
        tex: "55 \\chiahet 5",
        tag: {
          text: "Tổng tiền chia hết cho 5",
          color: "slate",
        },
      },
      {
        tex: "7 \\cdot x \\chiahet 5",
        tag: {
          text: "Tiền bút chia hết cho 5",
          color: "amber",
        },
      },
    ],
  },
  "chon-tien-but": {
    kind: "chips",
    items: ["7", "14", "21", "28", "35", "42", "49"],
    wants: [4],
    done: "Mua 5 cái bút thì tiền bút là 35 nghìn đồng.",
  },
  "but-vo-giai-55": {
    kind: "lines",
    label: "Mẹ mua 5 cái bút và 4 quyển vở",
    mode: "steps",
    rows: [
      {
        tex: "x = 5",
        tag: {
          text: "35 = 7 · 5, mua 5 cái bút",
          color: "amber",
        },
      },
      {
        tex: "55 - 35 = 20",
        tag: {
          text: "Tiền vở",
          color: "pink",
        },
      },
      {
        tex: "20 : 5 = 4",
        tag: {
          text: "Mua 4 quyển vở",
          color: "pink",
        },
      },
    ],
  },
  "tom-tat-but-vo": {
    kind: "lines",
    label: "Tiền bút phải chia hết cho 5",
    mode: "still",
    rows: [
      {
        tex: "4 \\cdot x + 5 \\cdot y = 30",
        tag: {
          text: "Bút 4, vở 5, tổng 30 nghìn",
          color: "slate",
        },
      },
      {
        tex: "5 \\cdot y \\chiahet 5",
        tag: {
          text: "Tiền vở chia hết cho 5",
          color: "pink",
        },
      },
      {
        tex: "30 \\chiahet 5",
        tag: {
          text: "Tổng tiền chia hết cho 5",
          color: "slate",
        },
      },
      {
        tex: "4 \\cdot x \\chiahet 5",
        tag: {
          text: "Tiền bút chia hết cho 5",
          color: "amber",
        },
      },
      {
        tex: "x = 5",
        tag: {
          text: "Tiền bút là 20 nghìn",
          color: "amber",
        },
      },
    ],
  },
  "lap-235": {
    kind: "lines",
    label: "Lập số chia hết cho 5 từ các chữ số 2, 3 và 5",
    mode: "steps",
    rows: [
      {
        tex: "2,\\; 3,\\; 5",
        tag: {
          text: "Lập số ba chữ số chia hết cho 5",
          color: "slate",
        },
      },
      {
        tex: "5",
        tag: {
          text: "Chữ số tận cùng phải là 5",
          color: "teal",
        },
      },
      {
        tex: "\\overline{235}",
        tag: {
          text: "Xếp 2 rồi 3 vào trước",
          color: "slate",
        },
      },
      {
        tex: "\\overline{325}",
        tag: {
          text: "Xếp 3 rồi 2 vào trước",
          color: "slate",
        },
      },
    ],
  },
  "lap-2-chia-het-5": {
    kind: "rows",
    label: "Các số lập được từ 1, 8 và 9 chia hết cho 2",
    rows: [
      {
        tex: "\\overline{198} \\chiahet 2",
        tag: {
          text: "Tận cùng là 8",
          color: "teal",
        },
      },
      {
        tex: "\\overline{918} \\chiahet 2",
        tag: {
          text: "Tận cùng là 8",
          color: "teal",
        },
      },
    ],
  },
  "lap-035": {
    kind: "lines",
    label: "Lập số chia hết cho 5 từ các chữ số 0, 3 và 5",
    mode: "steps",
    rows: [
      {
        tex: "\\overline{350},\\; \\overline{530}",
        tag: {
          text: "Tận cùng là 0: lập được 2 số",
          color: "teal",
        },
      },
      {
        tex: "\\overline{305}",
        tag: {
          text: "Tận cùng là 5: lập được 1 số",
          color: "teal",
        },
      },
      {
        tex: "\\overline{035}",
        tag: {
          text: "Chữ số 0 đứng đầu, không phải số ba chữ số",
          color: "slate",
        },
        muted: true,
      },
      {
        tex: "2 + 1 = 3",
        tag: {
          text: "Được 3 số",
          color: "slate",
        },
      },
    ],
  },
  "chon-lap-2": {
    kind: "chips",
    items: ["235", "253", "325", "352", "523", "532"],
    wants: [3, 5],
    done: "Bạn đã chọn đủ các số chia hết cho 2.",
  },
  "tom-tat-lap": {
    kind: "rows",
    label: "Các số lập được từ 3, 6 và 7 chia hết cho 2",
    rows: [
      {
        tex: "3,\\; 6,\\; 7",
        tag: {
          text: "Lập số chia hết cho 2",
          color: "slate",
        },
      },
      {
        tex: "\\overline{376} \\chiahet 2",
        tag: {
          text: "Tận cùng là 6",
          color: "teal",
        },
      },
      {
        tex: "\\overline{736} \\chiahet 2",
        tag: {
          text: "Tận cùng là 6",
          color: "teal",
        },
      },
    ],
  },
  "goi-y-nhom-it-nhat": {
    kind: "lines",
    label: "Số nhỏ nhất khác 0 chia hết cho cả 2 và 5",
    mode: "hint",
    rows: [
      {
        tex: "\\overline{\\ldots 0}",
        tag: {
          text: "Cả 2 và 5: tận cùng là 0",
          color: "teal",
        },
      },
      {
        tex: "0",
        tag: {
          text: "Đội có bạn, nên bỏ số 0",
          color: "slate",
        },
      },
      {
        tex: "\\overline{? 0}",
        tag: {
          text: "Số nhỏ nhất còn lại",
          color: "slate",
        },
      },
    ],
  },
  "goi-y-107-9": {
    kind: "digitSum",
    n: 107,
    divisor: 9,
    mode: "hint",
  },
  sticker: {
    kind: "sticker",
  },
};
