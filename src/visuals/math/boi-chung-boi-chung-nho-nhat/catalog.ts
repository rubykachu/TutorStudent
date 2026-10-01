import type { LinesSpec, RowsSpec } from "@/visuals/shared/formula-rows";
import type { ChipsSpec } from "@/visuals/shared/pick-chips";
import type { BcListsSpec, BcRow } from "./bc-lists";
import type { BcnnTableSpec } from "./bcnn-table";
import type { ContrastSpec } from "./contrast";
import type { MeetTrySpec } from "./meet-try";

// Every picture of the lesson that is drawn from numbers: the registry builds
// one entry per item (id `boi-chung-boi-chung-nho-nhat.visual.<key>`), so a
// new example is one item here and its id in lesson.json. Pure data, no
// React, so `content:check` reads it.

export { LESSON_SLUG } from "./logic";

export type VisualSpec =
  // The multiples of each number, then the ones they share (see `BcListsSpec`).
  | ({ kind: "bcLists" } & BcListsSpec)
  // The prime factors of several numbers side by side, to find the least
  // common multiple (see `BcnnTableSpec`).
  | ({ kind: "bcnnTable" } & BcnnTableSpec)
  // Hands-on: the child counts the rounds of two things that repeat, state
  // { a, b } (see `MeetTrySpec`).
  | ({ kind: "meetTry" } & MeetTrySpec)
  // Two kinds of question side by side (see `ContrastSpec`).
  | ({ kind: "contrast" } & ContrastSpec)
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
  "meetTry",
]);

// Validator id of the `manipulate` exercises each interactive kind serves;
// "chon-dung" is the validator shared with the set lesson's pick screens.
export const VALIDATOR_IDS = {
  chips: "chon-dung",
  meetTry: "gap-nhau",
} as const;

// The two buses of the opening pictures, and the same rows under a hint.
const BUS_ROWS = (a: number, b: number): readonly BcRow[] => [
  { title: `Xe A: cứ ${a} phút một chuyến`, step: a },
  { title: `Xe B: cứ ${b} phút một chuyến`, step: b },
];

const LAMP_ROWS = (a: number, b: number): readonly BcRow[] => [
  { title: `Đèn A: cứ ${a} giây nháy một lần`, step: a },
  { title: `Đèn B: cứ ${b} giây nháy một lần`, step: b },
];

// "B(a)", "B(b)": the multiples of a number, named as the textbook does.
const MULTIPLES = (...numbers: number[]): readonly BcRow[] =>
  numbers.map((n) => ({ title: `B(${n})`, step: n }));

const BUS: Omit<MeetTrySpec, "numbers"> = {
  names: ["Xe A", "Xe B"],
  round: "chuyến",
  verb: "chạy",
  unit: "phút",
};

const GEAR: Omit<MeetTrySpec, "numbers"> = {
  names: ["Bánh A", "Bánh B"],
  round: "vòng",
  verb: "quay",
  unit: "răng",
};

const BCNN = "Bội chung nhỏ nhất";
const COMMON = "Bội chung";

export const VISUAL_SPECS: Readonly<Record<string, VisualSpec>> = {
  // Common multiples: two buses.
  "xe-6-8": {
    kind: "bcLists",
    rows: BUS_ROWS(6, 8),
    upTo: 48,
    mode: "steps",
    commonTitle: "Cùng rời bến",
  },
  "xe-6-8-tom-tat": {
    kind: "bcLists",
    rows: BUS_ROWS(6, 8),
    upTo: 48,
    mode: "still",
    commonTitle: "Cùng rời bến",
  },
  "chon-bc-4-6": {
    kind: "chips",
    items: ["6", "8", "12", "18", "24"],
    wants: [2, 4],
    done: "Bạn đã chọn đủ các bội chung của 4 và 6.",
  },
  "xe-goi-y-3-6": {
    kind: "bcLists",
    rows: BUS_ROWS(3, 6),
    upTo: 18,
    mode: "hint",
    commonTitle: "Cùng rời bến",
  },
  "xe-giai-5-10": {
    kind: "bcLists",
    rows: BUS_ROWS(5, 10),
    upTo: 30,
    mode: "steps",
    commonTitle: "Cùng rời bến",
  },

  // Least common multiple.
  "bc-6-8": {
    kind: "bcLists",
    rows: MULTIPLES(6, 8),
    upTo: 48,
    mode: "steps",
    least: true,
  },
  "ky-hieu-6-8": {
    kind: "rows",
    label: "Bội chung và bội chung nhỏ nhất của 6 và 8",
    rows: [
      {
        tex: "\\mathrm{BC}(6, 8): \\concept{lime}{24},\\ \\concept{lime}{48},\\ \\concept{lime}{72}",
        tag: { text: COMMON, color: "lime" },
      },
      {
        tex: "\\mathrm{BCNN}(6, 8) = \\concept{pink}{24}",
        tag: { text: BCNN, color: "pink" },
      },
    ],
  },
  "chon-bcnn-6-9": {
    kind: "chips",
    items: ["9", "18", "27", "36"],
    wants: [1],
    done: "Bạn đã chọn đúng bội chung nhỏ nhất của 6 và 9.",
  },
  "gap-3-4": { kind: "meetTry", numbers: [3, 4], ...BUS, goal: true },
  "gap-xe": { kind: "meetTry", numbers: [4, 5], ...BUS },
  "den-goi-y-2-3": {
    kind: "bcLists",
    rows: LAMP_ROWS(2, 3),
    upTo: 12,
    mode: "hint",
    commonTitle: "Cùng nháy",
  },
  "den-giai-2-7": {
    kind: "bcLists",
    rows: LAMP_ROWS(2, 7),
    upTo: 14,
    mode: "steps",
    least: true,
    commonTitle: "Cùng nháy",
  },

  // Least common multiple by listing.
  "ds-4-10": {
    kind: "bcLists",
    rows: MULTIPLES(4, 10),
    upTo: 40,
    mode: "steps",
    least: true,
  },
  "ds-9-12-xong": {
    kind: "bcLists",
    rows: MULTIPLES(9, 12),
    upTo: 36,
    mode: "still",
    least: true,
  },
  "chon-bcnn-10-15": {
    kind: "chips",
    items: ["15", "20", "30", "60"],
    wants: [2],
    done: "Bạn đã chọn đúng bội chung nhỏ nhất của 10 và 15.",
  },
  "ds-goi-y-4-6": {
    kind: "bcLists",
    rows: MULTIPLES(4, 6),
    upTo: 12,
    mode: "hint",
  },
  "ds-giai-12-16": {
    kind: "bcLists",
    rows: MULTIPLES(12, 16),
    upTo: 48,
    mode: "steps",
    least: true,
  },

  // The bigger number is a multiple of the smaller one.
  "ds-5-15": {
    kind: "bcLists",
    rows: MULTIPLES(5, 15),
    upTo: 45,
    mode: "steps",
    least: true,
  },
  "so-lon-12-4": {
    kind: "rows",
    label: "BCNN của 4 và 12 là số lớn 12",
    rows: [
      { tex: "12 \\chiahet 4" },
      {
        tex: "\\mathrm{BCNN}(4, 12) = \\concept{pink}{12}",
        tag: { text: "BCNN là số lớn", color: "pink" },
      },
    ],
    legend: [{ color: "pink", name: BCNN }],
  },
  "chon-cap-so-lon": {
    kind: "chips",
    items: ["3 và 12", "4 và 6", "5 và 20", "6 và 8"],
    wants: [0, 2],
    done: "Bạn đã chọn đủ các cặp có số lớn chia hết cho số bé.",
  },
  "ds-goi-y-3-9": {
    kind: "bcLists",
    rows: MULTIPLES(3, 9),
    upTo: 18,
    mode: "hint",
  },
  "ds-giai-12-36": {
    kind: "bcLists",
    rows: MULTIPLES(12, 36),
    upTo: 36,
    mode: "steps",
    least: true,
  },

  // Product of the greatest common divisor and the least common multiple.
  "lines-12-18": {
    kind: "lines",
    label: "ƯCLN nhân BCNN của 12 và 18 bằng tích hai số",
    mode: "steps",
    rows: [
      { tex: "", tag: { text: "ƯCLN(12, 18) = 6", color: "amber" } },
      {
        tex: "\\mathrm{BCNN}(12, 18) = \\concept{pink}{36}",
        tag: { text: BCNN, color: "pink" },
      },
      { tex: "\\concept{amber}{6} \\cdot \\concept{pink}{36} = 216" },
      { tex: "12 \\cdot 18 = 216" },
    ],
  },
  "lines-12-18-xong": {
    kind: "lines",
    label: "ƯCLN nhân BCNN của 12 và 18 bằng tích hai số",
    mode: "still",
    rows: [
      { tex: "", tag: { text: "ƯCLN(12, 18) = 6", color: "amber" } },
      {
        tex: "\\mathrm{BCNN}(12, 18) = \\concept{pink}{36}",
        tag: { text: BCNN, color: "pink" },
      },
      { tex: "\\concept{amber}{6} \\cdot \\concept{pink}{36} = 216" },
      { tex: "12 \\cdot 18 = 216" },
    ],
  },
  "lines-9-15": {
    kind: "lines",
    label: "Tìm BCNN của 9 và 15 từ ƯCLN",
    mode: "steps",
    rows: [
      {
        tex: "9 \\cdot 15 = 135",
        tag: { text: "Nhân hai số", color: "slate" },
      },
      {
        tex: "135 : \\concept{amber}{3} = \\concept{pink}{45}",
        tag: { text: "Chia cho ƯCLN", color: "amber" },
      },
    ],
  },
  "uclnn-goi-y-b": {
    kind: "lines",
    label: "Tìm số còn lại khi biết ƯCLN, BCNN và một số",
    mode: "hint",
    rows: [
      { tex: "a \\cdot b = 3 \\cdot 30 = 90" },
      { tex: "6 \\cdot b = 90" },
      { tex: "b = 90 : 6 = 15" },
    ],
  },
  "uclnn-giai-b": {
    kind: "lines",
    label: "Tìm số còn lại khi biết ƯCLN, BCNN và một số",
    mode: "steps",
    rows: [
      { tex: "a \\cdot b = 4 \\cdot 24 = 96" },
      { tex: "8 \\cdot b = 96" },
      { tex: "b = 96 : 8 = 12" },
    ],
  },

  // Least common multiple by prime factors.
  "bang-12-18": { kind: "bcnnTable", numbers: [12, 18], mode: "steps" },
  "bang-12-18-xong": { kind: "bcnnTable", numbers: [12, 18], mode: "still" },
  "bang-20-30": { kind: "bcnnTable", numbers: [20, 30], mode: "steps" },
  "bang-goi-y-6-15": { kind: "bcnnTable", numbers: [6, 15], mode: "hint" },
  "bang-14-35": { kind: "bcnnTable", numbers: [14, 35], mode: "steps" },

  // Three numbers.
  "bang-4-6-10": { kind: "bcnnTable", numbers: [4, 6, 10], mode: "steps" },
  "bang-4-6-10-xong": {
    kind: "bcnnTable",
    numbers: [4, 6, 10],
    mode: "still",
  },
  "bang-6-8-9": { kind: "bcnnTable", numbers: [6, 8, 9], mode: "steps" },
  "bang-goi-y-3-4-6": {
    kind: "bcnnTable",
    numbers: [3, 4, 6],
    mode: "hint",
  },
  "bang-5-6-10": { kind: "bcnnTable", numbers: [5, 6, 10], mode: "steps" },

  // Common multiples from the least one.
  "nhan-6-8": {
    kind: "lines",
    label: "Các bội chung của 6 và 8 là 24 nhân với 1, 2, 3",
    mode: "steps",
    rows: [
      {
        tex: "\\mathrm{BCNN}(6, 8) = \\concept{pink}{24}",
        tag: { text: BCNN, color: "pink" },
      },
      {
        tex: "\\concept{pink}{24} \\cdot 1 = \\concept{lime}{24}",
        tag: { text: COMMON, color: "lime" },
      },
      {
        tex: "\\concept{pink}{24} \\cdot 2 = \\concept{lime}{48}",
        tag: { text: COMMON, color: "lime" },
      },
      {
        tex: "\\concept{pink}{24} \\cdot 3 = \\concept{lime}{72}",
        tag: { text: COMMON, color: "lime" },
      },
    ],
  },
  "nhan-4-10-xong": {
    kind: "lines",
    label: "Các bội chung của 4 và 10 là 20 nhân với 1, 2, 3",
    mode: "still",
    rows: [
      {
        tex: "\\mathrm{BCNN}(4, 10) = \\concept{pink}{20}",
        tag: { text: BCNN, color: "pink" },
      },
      {
        tex: "\\concept{pink}{20} \\cdot 1 = \\concept{lime}{20}",
        tag: { text: COMMON, color: "lime" },
      },
      {
        tex: "\\concept{pink}{20} \\cdot 2 = \\concept{lime}{40}",
        tag: { text: COMMON, color: "lime" },
      },
      {
        tex: "\\concept{pink}{20} \\cdot 3 = \\concept{lime}{60}",
        tag: { text: COMMON, color: "lime" },
      },
    ],
  },
  "chon-bc-6-9": {
    kind: "chips",
    items: ["18", "30", "36", "54", "60", "72"],
    wants: [0, 2, 3, 5],
    done: "Bạn đã chọn đủ các bội chung của 6 và 9.",
  },

  // Two things that repeat.
  "den-6-10": {
    kind: "bcLists",
    rows: LAMP_ROWS(6, 10),
    upTo: 30,
    mode: "steps",
    least: true,
    commonTitle: "Cùng nháy",
  },
  "bus-15-20": {
    kind: "lines",
    label: "Hai xe cùng rời bến lúc 6 giờ, cứ 15 phút và 20 phút một chuyến",
    mode: "still",
    rows: [
      {
        tex: "\\mathrm{BCNN}(15, 20) = \\concept{pink}{60}",
        tag: { text: "Sau 60 phút", color: "pink" },
      },
      { tex: "", tag: { text: "60 phút bằng 1 giờ", color: "slate" } },
      { tex: "6 + 1 = 7", tag: { text: "Lúc 7 giờ", color: "amber" } },
    ],
  },
  "tin-nhan-10-15-20": {
    kind: "lines",
    label: "Ba bạn nhắn tin cứ 10, 15 và 20 phút, cùng nhắn lúc 9 giờ",
    mode: "steps",
    rows: [
      {
        tex: "\\mathrm{BCNN}(10, 15, 20) = \\concept{pink}{60}",
        tag: { text: "Sau 60 phút", color: "pink" },
      },
      { tex: "", tag: { text: "60 phút bằng 1 giờ", color: "slate" } },
      { tex: "9 + 1 = 10", tag: { text: "Lúc 10 giờ", color: "amber" } },
    ],
  },
  "bao-thuc-goi-y": {
    kind: "lines",
    label: "Hai đồng hồ cùng reo lúc 5 giờ, cứ 12 phút và 15 phút một lần",
    mode: "hint",
    rows: [
      {
        tex: "\\mathrm{BCNN}(12, 15) = \\concept{pink}{60}",
        tag: { text: "Sau 60 phút", color: "pink" },
      },
      { tex: "", tag: { text: "60 phút bằng 1 giờ", color: "slate" } },
      { tex: "5 + 1 = 6", tag: { text: "Lúc 6 giờ", color: "amber" } },
    ],
  },
  "bao-thuc-giai": {
    kind: "lines",
    label: "Hai đồng hồ cùng reo lúc 7 giờ, cứ 20 phút và 30 phút một lần",
    mode: "steps",
    rows: [
      {
        tex: "\\mathrm{BCNN}(20, 30) = \\concept{pink}{60}",
        tag: { text: "Sau 60 phút", color: "pink" },
      },
      { tex: "", tag: { text: "60 phút bằng 1 giờ", color: "slate" } },
      { tex: "7 + 1 = 8", tag: { text: "Lúc 8 giờ", color: "amber" } },
    ],
  },

  // Meshing gears.
  "rang-12-8": {
    kind: "bcLists",
    rows: [
      { title: "Bánh A: mỗi vòng qua 12 răng", step: 12 },
      { title: "Bánh B: mỗi vòng qua 8 răng", step: 8 },
    ],
    upTo: 24,
    mode: "steps",
    least: true,
    commonTitle: "Hai dấu gặp nhau",
  },
  "rang-12-8-vong": {
    kind: "lines",
    label: "Hai bánh răng 12 răng và 8 răng khớp nhau",
    mode: "still",
    rows: [
      {
        tex: "\\mathrm{BCNN}(12, 8) = \\concept{pink}{24}",
        tag: { text: "Sau 24 răng", color: "pink" },
      },
      {
        tex: "24 : 12 = 2",
        tag: { text: "Bánh A quay 2 vòng", color: "slate" },
      },
      {
        tex: "24 : 8 = 3",
        tag: { text: "Bánh B quay 3 vòng", color: "slate" },
      },
    ],
  },
  "gap-rang-6-4": { kind: "meetTry", numbers: [6, 4], ...GEAR, goal: true },
  "rang-goi-y-4-6": {
    kind: "lines",
    label: "Hai bánh răng 4 răng và 6 răng khớp nhau",
    mode: "hint",
    rows: [
      {
        tex: "\\mathrm{BCNN}(4, 6) = \\concept{pink}{12}",
        tag: { text: "Sau 12 răng", color: "pink" },
      },
      {
        tex: "12 : 4 = 3",
        tag: { text: "Bánh 4 răng quay 3 vòng", color: "slate" },
      },
      {
        tex: "12 : 6 = 2",
        tag: { text: "Bánh 6 răng quay 2 vòng", color: "slate" },
      },
    ],
  },
  "rang-giai-9-6": {
    kind: "lines",
    label: "Hai bánh răng 9 răng và 6 răng khớp nhau",
    mode: "steps",
    rows: [
      {
        tex: "\\mathrm{BCNN}(9, 6) = \\concept{pink}{18}",
        tag: { text: "Sau 18 răng", color: "pink" },
      },
      {
        tex: "18 : 9 = 2",
        tag: { text: "Bánh A quay 2 vòng", color: "slate" },
      },
      {
        tex: "18 : 6 = 3",
        tag: { text: "Bánh B quay 3 vòng", color: "slate" },
      },
    ],
  },

  // Numbers inside a range.
  "so-6-9": {
    kind: "lines",
    label: "Số có ba chữ số nhỏ nhất chia hết cho cả 6 và 9",
    mode: "steps",
    rows: [
      {
        tex: "\\mathrm{BCNN}(6, 9) = \\concept{pink}{18}",
        tag: { text: "Số cần tìm là bội của 18", color: "pink" },
      },
      {
        tex: "18;\\ 36;\\ 54;\\ 72;\\ 90;\\ \\concept{lime}{108}",
        tag: { text: "Cộng thêm 18 mỗi lần", color: "slate" },
      },
      {
        tex: "",
        tag: { text: "108 là số có ba chữ số đầu tiên", color: "lime" },
      },
    ],
  },
  "so-4-6-xong": {
    kind: "lines",
    label: "Số có hai chữ số lớn nhất chia hết cho cả 4 và 6",
    mode: "still",
    rows: [
      {
        tex: "\\mathrm{BCNN}(4, 6) = \\concept{pink}{12}",
        tag: { text: "Số cần tìm là bội của 12", color: "pink" },
      },
      {
        tex: "72;\\ 84;\\ \\concept{lime}{96};\\ 108",
        tag: { text: "96 là số có hai chữ số lớn nhất", color: "lime" },
      },
    ],
  },
  "hang-3-4": {
    kind: "lines",
    label: "Xếp hàng 3 và hàng 4 đều dư 1 bạn, lớp có từ 40 đến 55 bạn",
    mode: "steps",
    rows: [
      {
        tex: "\\mathrm{BCNN}(3, 4) = \\concept{pink}{12}",
        tag: { text: "Bớt 1 bạn thì chia hết cho 3 và 4", color: "pink" },
      },
      {
        tex: "12;\\ 24;\\ 36;\\ \\concept{lime}{48}",
        tag: { text: "Cần số từ 39 đến 54", color: "slate" },
      },
      { tex: "48 + 1 = 49", tag: { text: "Lớp có 49 bạn", color: "amber" } },
    ],
  },
  "hang-goi-y-4-5": {
    kind: "lines",
    label: "Xếp hàng 4 và hàng 5 đều dư 1 người, đội có từ 30 đến 50 người",
    mode: "hint",
    rows: [
      {
        tex: "\\mathrm{BCNN}(4, 5) = \\concept{pink}{20}",
        tag: { text: "Bớt 1 người thì chia hết cho 4 và 5", color: "pink" },
      },
      {
        tex: "20;\\ \\concept{lime}{40};\\ 60",
        tag: { text: "Cần số từ 29 đến 49", color: "slate" },
      },
      { tex: "40 + 1 = 41", tag: { text: "Đội có 41 người", color: "amber" } },
    ],
  },
  "hang-giai-5-6": {
    kind: "lines",
    label: "Xếp hàng 5 và hàng 6 đều dư 2 người, đội có từ 50 đến 70 người",
    mode: "steps",
    rows: [
      {
        tex: "\\mathrm{BCNN}(5, 6) = \\concept{pink}{30}",
        tag: { text: "Bớt 2 người thì chia hết cho 5 và 6", color: "pink" },
      },
      {
        tex: "30;\\ \\concept{lime}{60};\\ 90",
        tag: { text: "Cần số từ 48 đến 68", color: "slate" },
      },
      { tex: "60 + 2 = 62", tag: { text: "Đội có 62 người", color: "amber" } },
    ],
  },

  // Common denominator of fractions.
  "quy-dong-4-6": {
    kind: "lines",
    label: "Quy đồng mẫu số hai phân số có mẫu 4 và 6",
    mode: "steps",
    rows: [
      {
        tex: "\\dfrac{1}{4},\\ \\dfrac{1}{6}",
        tag: { text: "Hai phân số", color: "slate" },
      },
      {
        tex: "\\mathrm{BCNN}(4, 6) = \\concept{pink}{12}",
        tag: { text: "Mẫu số chung", color: "pink" },
      },
      {
        tex: "\\dfrac{1}{4} = \\dfrac{1 \\cdot 3}{4 \\cdot 3} = \\dfrac{3}{\\concept{pink}{12}}",
      },
      {
        tex: "\\dfrac{1}{6} = \\dfrac{1 \\cdot 2}{6 \\cdot 2} = \\dfrac{2}{\\concept{pink}{12}}",
      },
    ],
  },
  "quy-dong-2-5-xong": {
    kind: "lines",
    label: "Quy đồng mẫu số hai phân số có mẫu 2 và 5",
    mode: "still",
    rows: [
      {
        tex: "\\dfrac{1}{2},\\ \\dfrac{2}{5}",
        tag: { text: "Hai phân số", color: "slate" },
      },
      {
        tex: "\\mathrm{BCNN}(2, 5) = \\concept{pink}{10}",
        tag: { text: "Mẫu số chung", color: "pink" },
      },
      {
        tex: "\\dfrac{1}{2} = \\dfrac{1 \\cdot 5}{2 \\cdot 5} = \\dfrac{5}{\\concept{pink}{10}}",
      },
      {
        tex: "\\dfrac{2}{5} = \\dfrac{2 \\cdot 2}{5 \\cdot 2} = \\dfrac{4}{\\concept{pink}{10}}",
      },
    ],
  },
  "quy-dong-6-8": {
    kind: "lines",
    label: "Quy đồng mẫu số hai phân số có mẫu 6 và 8",
    mode: "steps",
    rows: [
      {
        tex: "\\dfrac{5}{6},\\ \\dfrac{3}{8}",
        tag: { text: "Hai phân số", color: "slate" },
      },
      {
        tex: "\\mathrm{BCNN}(6, 8) = \\concept{pink}{24}",
        tag: { text: "Mẫu số chung", color: "pink" },
      },
      {
        tex: "\\dfrac{5}{6} = \\dfrac{5 \\cdot 4}{6 \\cdot 4} = \\dfrac{20}{\\concept{pink}{24}}",
      },
      {
        tex: "\\dfrac{3}{8} = \\dfrac{3 \\cdot 3}{8 \\cdot 3} = \\dfrac{9}{\\concept{pink}{24}}",
      },
    ],
  },
  "quy-dong-goi-y": {
    kind: "lines",
    label: "Quy đồng mẫu số hai phân số có mẫu 6 và 4",
    mode: "hint",
    rows: [
      {
        tex: "\\dfrac{1}{6},\\ \\dfrac{3}{4}",
        tag: { text: "Hai phân số", color: "slate" },
      },
      {
        tex: "\\mathrm{BCNN}(6, 4) = \\concept{pink}{12}",
        tag: { text: "Mẫu số chung", color: "pink" },
      },
      {
        tex: "\\dfrac{3}{4} = \\dfrac{3 \\cdot 3}{4 \\cdot 3} = \\dfrac{9}{\\concept{pink}{12}}",
      },
    ],
  },
  "quy-dong-giai": {
    kind: "lines",
    label: "Quy đồng mẫu số hai phân số có mẫu 12 và 18",
    mode: "steps",
    rows: [
      {
        tex: "\\dfrac{5}{12},\\ \\dfrac{7}{18}",
        tag: { text: "Hai phân số", color: "slate" },
      },
      {
        tex: "\\mathrm{BCNN}(12, 18) = \\concept{pink}{36}",
        tag: { text: "Mẫu số chung", color: "pink" },
      },
      {
        tex: "\\dfrac{5}{12} = \\dfrac{5 \\cdot 3}{12 \\cdot 3} = \\dfrac{15}{\\concept{pink}{36}}",
      },
      {
        tex: "\\dfrac{7}{18} = \\dfrac{7 \\cdot 2}{18 \\cdot 2} = \\dfrac{14}{\\concept{pink}{36}}",
      },
    ],
  },

  // Which tool: greatest common divisor or least common multiple.
  "doi-chieu-12-18": {
    kind: "contrast",
    label: "Cùng hai số 12 và 18: chia đều dùng ƯCLN, lặp lại dùng BCNN",
    mode: "steps",
    cards: [
      {
        color: "amber",
        heading: "Chia đều: tìm ƯCLN",
        story:
          "Chia 12 quả cam và 18 quả quýt vào nhiều đĩa nhất, mỗi đĩa như nhau.",
        result: "ƯCLN(12, 18) = 6",
      },
      {
        color: "pink",
        heading: "Lặp lại: tìm BCNN",
        story:
          "Xe A cứ 12 phút, xe B cứ 18 phút rời bến một lần. Hỏi lúc hai xe cùng rời bến lần nữa.",
        result: "BCNN(12, 18) = 36",
      },
    ],
  },
  "doi-chieu-12-18-xong": {
    kind: "contrast",
    label: "Cùng hai số 12 và 18: chia đều dùng ƯCLN, lặp lại dùng BCNN",
    mode: "still",
    cards: [
      {
        color: "amber",
        heading: "Chia đều: tìm ƯCLN",
        story:
          "Chia 12 quả cam và 18 quả quýt vào nhiều đĩa nhất, mỗi đĩa như nhau.",
        result: "ƯCLN(12, 18) = 6",
      },
      {
        color: "pink",
        heading: "Lặp lại: tìm BCNN",
        story:
          "Xe A cứ 12 phút, xe B cứ 18 phút rời bến một lần. Hỏi lúc hai xe cùng rời bến lần nữa.",
        result: "BCNN(12, 18) = 36",
      },
    ],
  },

  sticker: { kind: "sticker" },
};
