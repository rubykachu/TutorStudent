import type { LinesSpec, RowsSpec } from "@/visuals/shared/formula-rows";
import type { ChipsSpec } from "@/visuals/shared/pick-chips";
import type { CutBarsSpec } from "./cut-bars";
import type { ExpTableSpec } from "./exp-table";
import type { LadderSpec } from "./ladder";
import type { NotationSpec } from "./notation";
import type { PlatesSpec } from "./plates";
import type { UcListsSpec } from "./uc-lists";

// Every picture of the lesson that is drawn from numbers: the registry builds
// one entry per item (id `uoc-chung-uoc-chung-lon-nhat.visual.<key>`), so a
// new example is one item here and its id in lesson.json. Pure data, no
// React, so `content:check` reads it.

export { LESSON_SLUG } from "./logic";

export type VisualSpec =
  // Strips cut into equal pieces, one strip per step (see `CutBarsSpec`).
  | ({ kind: "cutBars" } & CutBarsSpec)
  // Hands-on: the child sets the piece length with − and +, state { d }.
  // `goal` (lesson screen) adds the verdict line, progress and a closing line
  // once the cut fits every strip (`fits`) or is the longest that fits
  // (`largest`); `start` is the piece length the screen opens on. In an
  // exercise the params give the strips (a, b, c) and, optionally, `start`;
  // no verdict is shown.
  | {
      kind: "cutTry";
      totals: readonly number[];
      goal?: "fits" | "largest";
      start?: number;
    }
  // The divisors of each number, then the ones they share (see `UcListsSpec`).
  | ({ kind: "ucLists" } & UcListsSpec)
  // A number split into primes by repeated division (see `LadderSpec`).
  | ({ kind: "ladder" } & LadderSpec)
  // The prime factors of several numbers side by side, to find the greatest
  // common divisor (see `ExpTableSpec`).
  | ({ kind: "expTable" } & ExpTableSpec)
  // Several kinds of things shared into equal plates (see `PlatesSpec`).
  | ({ kind: "plates" } & PlatesSpec)
  // Lines of written notation such as "ƯCLN(12, 18) = 6" (see `NotationSpec`).
  | ({ kind: "notation" } & NotationSpec)
  // Formulas stacked, each with an optional tag (see `RowsSpec`).
  | ({ kind: "rows" } & RowsSpec)
  // Lines of a worked example, one more on every step (see `LinesSpec`).
  | ({ kind: "lines" } & LinesSpec)
  // Numbers the child taps to pick, state { i0, i1, … } (see `ChipsSpec`).
  | ({ kind: "chips" } & ChipsSpec)
  | { kind: "sticker" };

export type SpecKind = VisualSpec["kind"];
export type SpecOf<K extends SpecKind> = Extract<VisualSpec, { kind: K }>;

// Kinds the child acts on (counted as interactive by `--stats`).
export const INTERACTIVE_KINDS: ReadonlySet<SpecKind> = new Set([
  "chips",
  "cutTry",
]);

// Validator id of the `manipulate` exercises each interactive kind serves;
// "chon-dung" is the validator shared with the set lesson's pick screens.
export const VALIDATOR_IDS = {
  chips: "chon-dung",
  cutTry: "cat-vua-het",
} as const;

export const VISUAL_SPECS: Readonly<Record<string, VisualSpec>> = {
  "cat-12-18-3": {
    kind: "cutBars",
    totals: [12, 18],
    d: 3,
    mode: "steps",
  },
  "cat-12-18-4": {
    kind: "cutBars",
    totals: [12, 18],
    d: 4,
    mode: "steps",
  },
  "cat-thu-12-18": {
    kind: "cutTry",
    totals: [12, 18],
    goal: "fits",
    start: 4,
  },
  "cat-tom-tat": {
    kind: "cutBars",
    totals: [12, 18],
    d: 3,
    mode: "still",
  },
  "cat-thu-9-21": {
    kind: "cutTry",
    totals: [9, 21],
  },
  "cat-goi-y-10-15": {
    kind: "cutBars",
    totals: [10, 15],
    d: 5,
    mode: "hint",
  },
  "cat-giai-15-20": {
    kind: "cutBars",
    totals: [15, 20],
    d: 5,
    mode: "steps",
  },
  "ds-12-18": {
    kind: "ucLists",
    numbers: [12, 18],
    mode: "steps",
  },
  "ds-10-14-xong": {
    kind: "ucLists",
    numbers: [10, 14],
    mode: "still",
  },
  "chon-uc-15-25": {
    kind: "chips",
    items: ["1", "3", "5", "15", "25"],
    wants: [0, 2],
    done: "Bạn đã chọn đủ các ước chung của 15 và 25.",
  },
  "ds-7-10": {
    kind: "ucLists",
    numbers: [7, 10],
    mode: "still",
  },
  "ds-tom-tat": {
    kind: "ucLists",
    numbers: [12, 18],
    mode: "still",
  },
  "ds-goi-y-6-10": {
    kind: "ucLists",
    numbers: [6, 10],
    mode: "hint",
  },
  "ds-8-20": {
    kind: "ucLists",
    numbers: [8, 20],
    mode: "steps",
  },
  "chon-uc-14-21": {
    kind: "chips",
    items: ["1", "2", "3", "7", "14", "21"],
  },
  "ds-lon-12-18": {
    kind: "ucLists",
    numbers: [12, 18],
    mode: "steps",
    greatest: true,
  },
  "cat-lon-nhat-12-18": {
    kind: "cutBars",
    totals: [12, 18],
    d: 6,
    mode: "still",
    greatest: true,
  },
  "ky-hieu-12-18": {
    kind: "notation",
    label: "Ước chung và ước chung lớn nhất của 12 và 18",
    lines: [
      {
        text: "ƯC(12, 18) = {1; 2; 3; 6}",
        color: "teal",
      },
      {
        text: "ƯCLN(12, 18) = 6",
        color: "amber",
      },
    ],
    mode: "still",
    legend: [
      {
        color: "teal",
        name: "Ước chung",
      },
      {
        color: "amber",
        name: "Ước chung lớn nhất",
      },
    ],
  },
  "chon-uclnn-20-24": {
    kind: "chips",
    items: ["1", "2", "4", "5", "6", "8"],
    wants: [2],
    done: "Bạn đã chọn đúng ước chung lớn nhất của 20 và 24.",
  },
  "ds-goi-y-4-10": {
    kind: "ucLists",
    numbers: [4, 10],
    mode: "hint",
    greatest: true,
  },
  "ds-lon-10-25": {
    kind: "ucLists",
    numbers: [10, 25],
    mode: "steps",
    greatest: true,
  },
  "cat-7-21": {
    kind: "cutBars",
    totals: [7, 21],
    d: 7,
    mode: "steps",
    greatest: true,
  },
  "cat-7-21-xong": {
    kind: "cutBars",
    totals: [7, 21],
    d: 7,
    mode: "still",
    greatest: true,
  },
  "chon-cap-chia-het": {
    kind: "chips",
    items: ["6 và 18", "5 và 12", "4 và 20", "7 và 15", "9 và 36"],
    wants: [0, 2, 4],
    done: "Bạn đã chọn đủ các cặp mà số lớn chia hết cho số nhỏ. Với mỗi cặp này, ƯCLN chính là số nhỏ.",
  },
  "cat-goi-y-5-30": {
    kind: "cutBars",
    totals: [5, 30],
    d: 5,
    mode: "hint",
  },
  "uclnn-giai-9-45": {
    kind: "notation",
    label: "Tìm ƯCLN của 9 và 45",
    lines: [
      {
        text: "45 : 9 = 5",
        color: "slate",
      },
      {
        text: "45 chia hết cho 9, nên 9 là ước chung lớn nhất",
        color: "slate",
      },
      {
        text: "ƯCLN(9, 45) = 9",
        color: "amber",
      },
    ],
    mode: "steps",
    legend: [
      {
        color: "amber",
        name: "Ước chung lớn nhất",
      },
    ],
  },
  "sn-vi-du": {
    kind: "rows",
    label: "Một số nguyên tố và một số không nguyên tố",
    rows: [
      {
        tex: "7 = 1 \\cdot 7",
        tag: {
          text: "7 chỉ có ước 1 và 7",
          color: "sky",
        },
      },
      {
        tex: "6 = 2 \\cdot 3",
        tag: {
          text: "6 còn có ước 2 và 3, nên 6 không là số nguyên tố",
          color: "slate",
        },
        gapBefore: true,
      },
    ],
  },
  "chia-dan-12": {
    kind: "ladder",
    n: 12,
    mode: "steps",
  },
  "chia-dan-36-xong": {
    kind: "ladder",
    n: 36,
    mode: "still",
  },
  "chon-sn": {
    kind: "chips",
    items: ["2", "9", "11", "15", "17", "21"],
    wants: [0, 2, 4],
    done: "Bạn đã chọn đủ các số nguyên tố.",
  },
  "chia-dan-goi-y-18": {
    kind: "ladder",
    n: 18,
    mode: "hint",
  },
  "chia-dan-24": {
    kind: "ladder",
    n: 24,
    mode: "steps",
  },
  "chia-dan-30": {
    kind: "ladder",
    n: 30,
    mode: "steps",
  },
  "bang-36-60": {
    kind: "expTable",
    numbers: [36, 60],
    mode: "steps",
  },
  "bang-36-60-xong": {
    kind: "expTable",
    numbers: [36, 60],
    mode: "still",
  },
  "chon-chung-20-30": {
    kind: "chips",
    items: ["2", "3", "5"],
    wants: [0, 2],
    done: "Bạn đã chọn đủ các thừa số nguyên tố chung.",
  },
  "bang-20-30": {
    kind: "expTable",
    numbers: [20, 30],
    mode: "steps",
  },
  "bang-goi-y-45-75": {
    kind: "expTable",
    numbers: [45, 75],
    mode: "hint",
  },
  "bang-50-70": {
    kind: "expTable",
    numbers: [50, 70],
    mode: "steps",
  },
  "bang-goi-y-28-42": {
    kind: "expTable",
    numbers: [28, 42],
    mode: "hint",
  },
  "bang-24-56": {
    kind: "expTable",
    numbers: [24, 56],
    mode: "steps",
  },
  "cat-18-24-30": {
    kind: "cutBars",
    totals: [18, 24, 30],
    d: 6,
    mode: "steps",
    greatest: true,
  },
  "bang-18-24-30": {
    kind: "expTable",
    numbers: [18, 24, 30],
    mode: "steps",
  },
  "bang-18-24-30-xong": {
    kind: "expTable",
    numbers: [18, 24, 30],
    mode: "still",
  },
  "chon-chung-12-20-28": {
    kind: "chips",
    items: ["2", "3", "5", "7"],
    wants: [0],
    done: "Bạn đã chọn đúng thừa số nguyên tố chung của ba số.",
  },
  "bang-goi-y-14-21-35": {
    kind: "expTable",
    numbers: [14, 21, 35],
    mode: "hint",
  },
  "bang-18-54-81": {
    kind: "expTable",
    numbers: [18, 54, 81],
    mode: "steps",
  },
  "bang-goi-y-14-28-70": {
    kind: "expTable",
    numbers: [14, 28, 70],
    mode: "hint",
  },
  "bang-24-60-84": {
    kind: "expTable",
    numbers: [24, 60, 84],
    mode: "steps",
  },
  "uclnn-uc-12-18": {
    kind: "notation",
    label: "Các ước chung của 12 và 18 là các ước của ƯCLN",
    lines: [
      {
        text: "ƯCLN(12, 18) = 6",
        color: "amber",
      },
      {
        text: "Các ước của 6: 1, 2, 3, 6",
        color: "slate",
      },
      {
        text: "ƯC(12, 18) = {1; 2; 3; 6}",
        color: "teal",
      },
    ],
    mode: "steps",
    legend: [
      {
        color: "teal",
        name: "Ước chung",
      },
      {
        color: "amber",
        name: "Ước chung lớn nhất",
      },
    ],
  },
  "uclnn-uc-24-36": {
    kind: "notation",
    label: "Các ước chung của 24 và 36 là các ước của ƯCLN",
    lines: [
      {
        text: "ƯCLN(24, 36) = 12",
        color: "amber",
      },
      {
        text: "Các ước của 12: 1, 2, 3, 4, 6, 12",
        color: "slate",
      },
      {
        text: "ƯC(24, 36) = {1; 2; 3; 4; 6; 12}",
        color: "teal",
      },
    ],
    mode: "still",
    legend: [
      {
        color: "teal",
        name: "Ước chung",
      },
      {
        color: "amber",
        name: "Ước chung lớn nhất",
      },
    ],
  },
  "chon-uc-30-45": {
    kind: "chips",
    items: ["1", "2", "3", "5", "9", "15", "30"],
    wants: [0, 2, 3, 5],
    done: "Bạn đã chọn đủ các ước chung của 30 và 45.",
  },
  "chon-uc-18-27": {
    kind: "chips",
    items: ["1", "2", "3", "6", "9", "18"],
  },
  "dia-18-30": {
    kind: "plates",
    items: [
      {
        label: "quả cam",
        total: 18,
        color: "lime",
      },
      {
        label: "quả quýt",
        total: 30,
        color: "slate",
      },
    ],
    plate: "đĩa",
    count: 6,
    mode: "steps",
  },
  "dia-18-30-xong": {
    kind: "plates",
    items: [
      {
        label: "quả cam",
        total: 18,
        color: "lime",
      },
      {
        label: "quả quýt",
        total: 30,
        color: "slate",
      },
    ],
    plate: "đĩa",
    count: 6,
    mode: "still",
  },
  "dia-ket-luan": {
    kind: "notation",
    label: "Số đĩa nhiều nhất là ƯCLN của 18 và 30",
    lines: [
      {
        text: "ƯCLN(18, 30) = 6",
        color: "amber",
      },
      {
        text: "Nhiều nhất 6 đĩa",
        color: "slate",
      },
    ],
    mode: "still",
    legend: [
      {
        color: "amber",
        name: "Ước chung lớn nhất",
      },
    ],
  },
  "chon-dia-8-12": {
    kind: "chips",
    items: ["2", "3", "4", "5", "6"],
    wants: [0, 2],
    done: "Bạn đã chọn đủ các số đĩa chia đều không thừa.",
  },
  "dia-goi-y-8-12": {
    kind: "plates",
    items: [
      {
        label: "viên bi",
        total: 8,
        color: "lime",
      },
      {
        label: "cái kẹo",
        total: 12,
        color: "slate",
      },
    ],
    plate: "đĩa",
    count: 4,
    mode: "hint",
  },
  "dia-14-35": {
    kind: "plates",
    items: [
      {
        label: "cái bánh quy",
        total: 14,
        color: "lime",
      },
      {
        label: "cái kẹo",
        total: 35,
        color: "slate",
      },
    ],
    plate: "đĩa",
    count: 7,
    mode: "steps",
  },
  "tui-giai-15-40": {
    kind: "notation",
    label: "Chia 15 cái bánh và 40 cái kẹo vào các túi quà",
    lines: [
      {
        text: "ƯCLN(15, 40) = 5",
        color: "amber",
      },
      {
        text: "5 túi quà",
        color: "slate",
      },
      {
        text: "15 : 5 = 3 cái bánh mỗi túi",
        color: "slate",
      },
    ],
    mode: "steps",
    legend: [
      {
        color: "amber",
        name: "Ước chung lớn nhất",
      },
    ],
  },
  "ds-22-33": {
    kind: "ucLists",
    numbers: [22, 33],
    mode: "steps",
  },
  "bai-toan-ket-luan": {
    kind: "notation",
    label: "Mỗi hộp từ 2 bút trở lên",
    lines: [
      {
        text: "ƯC(22, 33) = {1; 11}",
        color: "teal",
      },
      {
        text: "Mỗi hộp từ 2 bút trở lên: 11 bút",
        color: "slate",
      },
    ],
    mode: "still",
    legend: [
      {
        color: "teal",
        name: "Ước chung",
      },
    ],
  },
  "bai-60-90": {
    kind: "notation",
    label: "Số lớn nhất mà cả 60 và 90 đều chia hết cho nó",
    lines: [
      {
        text: "60 = 2² · 3 · 5",
        color: "slate",
      },
      {
        text: "90 = 2 · 3² · 5",
        color: "slate",
      },
      {
        text: "ƯCLN(60, 90) = 2 · 3 · 5 = 30",
        color: "amber",
      },
    ],
    mode: "steps",
    legend: [
      {
        color: "amber",
        name: "Ước chung lớn nhất",
      },
    ],
  },
  "bai-60-90-xong": {
    kind: "notation",
    label: "Số lớn nhất mà cả 60 và 90 đều chia hết cho nó",
    lines: [
      {
        text: "60 = 2² · 3 · 5",
        color: "slate",
      },
      {
        text: "90 = 2 · 3² · 5",
        color: "slate",
      },
      {
        text: "ƯCLN(60, 90) = 2 · 3 · 5 = 30",
        color: "amber",
      },
    ],
    mode: "still",
    legend: [
      {
        color: "amber",
        name: "Ước chung lớn nhất",
      },
    ],
  },
  "chon-uc-20-28": {
    kind: "chips",
    items: ["1", "2", "4", "5", "7", "14"],
    wants: [0, 1, 2],
    done: "Bạn đã chọn đủ các số mà cả 20 và 28 đều chia hết cho nó.",
  },
  "bai-goi-y-30-45": {
    kind: "notation",
    label: "Số lớn nhất mà cả 30 và 45 đều chia hết cho nó",
    lines: [
      {
        text: "30 = 2 · 3 · 5",
        color: "slate",
      },
      {
        text: "45 = 3² · 5",
        color: "slate",
      },
      {
        text: "ƯCLN(30, 45) = 3 · 5 = 15",
        color: "amber",
      },
    ],
    mode: "hint",
    legend: [
      {
        color: "amber",
        name: "Ước chung lớn nhất",
      },
    ],
  },
  "bang-40-100": {
    kind: "expTable",
    numbers: [40, 100],
    mode: "steps",
  },
  "hh-6": {
    kind: "lines",
    label: "Các ước của 6 cộng lại bằng 6",
    rows: [
      {
        tex: "6 = 1 \\cdot 6 = 2 \\cdot 3",
        tag: {
          text: "Các ước của 6: 1, 2, 3 và 6",
          color: "slate",
        },
      },
      {
        tex: "1 + 2 + 3 = 6",
        tag: {
          text: "Cộng các ước, không kể 6",
          color: "slate",
        },
      },
    ],
    mode: "steps",
  },
  "hh-6-xong": {
    kind: "lines",
    label: "Các ước của 6 cộng lại bằng 6",
    rows: [
      {
        tex: "6 = 1 \\cdot 6 = 2 \\cdot 3",
        tag: {
          text: "Các ước của 6: 1, 2, 3 và 6",
          color: "slate",
        },
      },
      {
        tex: "1 + 2 + 3 = 6",
        tag: {
          text: "Cộng các ước, không kể 6",
          color: "slate",
        },
      },
    ],
    mode: "still",
  },
  "rg-20-28": {
    kind: "lines",
    label: "Chia cả tử và mẫu của phân số cho cùng một số",
    rows: [
      {
        tex: "\\dfrac{20}{28} = \\dfrac{20 : 2}{28 : 2} = \\dfrac{10}{14}",
        tag: {
          text: "Chia cho 2",
          color: "slate",
        },
      },
      {
        tex: "\\dfrac{10}{14} = \\dfrac{10 : 2}{14 : 2} = \\dfrac{5}{7}",
        tag: {
          text: "Lại chia cho 2",
          color: "slate",
        },
      },
      {
        tex: "\\dfrac{5}{7}",
        tag: {
          text: "Chỉ còn ước chung là 1",
          color: "slate",
        },
      },
    ],
    mode: "steps",
  },
  "tg-5-7": {
    kind: "notation",
    label: "Phân số tối giản có tử và mẫu với ƯCLN bằng 1",
    lines: [
      {
        tex: "\\dfrac{5}{7}",
        color: "pink",
      },
      {
        text: "ƯC(5, 7) = {1}",
        color: "teal",
      },
      {
        text: "ƯCLN(5, 7) = 1",
        color: "amber",
      },
    ],
    mode: "still",
    legend: [
      {
        color: "pink",
        name: "Phân số tối giản",
      },
      {
        color: "teal",
        name: "Ước chung",
      },
      {
        color: "amber",
        name: "Ước chung lớn nhất",
      },
    ],
  },
  "rg-giai-18-24": {
    kind: "lines",
    label: "Rút gọn phân số về tối giản bằng ƯCLN",
    rows: [
      {
        tex: "\\dfrac{18}{24}",
        tag: {
          text: "ƯCLN(18, 24) = 6",
          color: "amber",
        },
      },
      {
        tex: "\\dfrac{18 : 6}{24 : 6} = \\dfrac{3}{4}",
        tag: {
          text: "Chia tử và mẫu cho 6",
          color: "slate",
        },
      },
    ],
    mode: "steps",
  },
  "rg-goi-y-6-15": {
    kind: "lines",
    label: "Rút gọn phân số về tối giản bằng ƯCLN",
    rows: [
      {
        tex: "\\dfrac{6}{15}",
        tag: {
          text: "ƯCLN(6, 15) = 3",
          color: "amber",
        },
      },
      {
        tex: "\\dfrac{6 : 3}{15 : 3} = \\dfrac{2}{5}",
        tag: {
          text: "Chia tử và mẫu cho 3",
          color: "slate",
        },
      },
    ],
    mode: "hint",
  },
  "tg-tom-tat": {
    kind: "lines",
    label: "Rút gọn phân số về tối giản bằng ƯCLN",
    rows: [
      {
        tex: "\\dfrac{20}{28}",
        tag: {
          text: "ƯCLN(20, 28) = 4",
          color: "amber",
        },
      },
      {
        tex: "\\dfrac{20 : 4}{28 : 4} = \\dfrac{5}{7}",
        tag: {
          text: "Phân số tối giản",
          color: "pink",
        },
      },
    ],
    mode: "still",
  },
  sticker: {
    kind: "sticker",
  },
};
