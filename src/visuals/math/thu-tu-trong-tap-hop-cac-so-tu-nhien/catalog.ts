import type { LinesSpec, RowsSpec } from "@/visuals/shared/formula-rows";
import type { ChipsSpec } from "@/visuals/shared/pick-chips";
import type {
  BarsSpec,
  DigitsSpec,
  LineSpec,
  LineTapSpec,
  LineTrySpec,
  SignsSpec,
} from "./types";

// Every picture of the lesson that is drawn from numbers: the registry builds
// one entry per item (id `thu-tu-trong-tap-hop-cac-so-tu-nhien.visual.<key>`), so a new example is one
// item here and its id in lesson.json. Pure data, no React, so
// `content:check` reads it.

export { LESSON_SLUG } from "./types";

export type VisualSpec =
  // A number line, drawn layer by layer (see `LineSpec`).
  | ({ kind: "line" } & LineSpec)
  // Hands-on: the child moves named points along a line, state { p0, p1, … }
  // (see `LineTrySpec`).
  | ({ kind: "lineTry" } & LineTrySpec)
  // A line whose named points are tappable regions (see `LineTapSpec`).
  | ({ kind: "lineTap" } & LineTapSpec)
  // A bar chart (see `BarsSpec`).
  | ({ kind: "bars" } & BarsSpec)
  // Two numbers with the sign between them (see `SignsSpec`).
  | ({ kind: "signs" } & SignsSpec)
  // Two numbers compared digit by digit (see `DigitsSpec`).
  | ({ kind: "digits" } & DigitsSpec)
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
  "lineTry",
]);

// Validator id of the `manipulate` exercises each interactive kind serves;
// "chon-dung" is the validator shared with the set lesson's pick screens.
export const VALIDATOR_IDS = {
  chips: "chon-dung",
  lineTry: "dat-diem",
} as const;

export const VISUAL_SPECS: Readonly<Record<string, VisualSpec>> = {
  "thuoc-ke": {
    kind: "line",
    from: 0,
    to: 10,
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
        tag: "Gốc",
      },
      {
        type: "point",
        at: 3,
        name: "A",
        color: "amber",
      },
      {
        type: "arrow",
        from: 0,
        to: 3,
        tag: "3 đơn vị",
      },
    ],
    mode: "steps",
    label:
      "Tia số như chiếc thước kẻ: điểm A cách gốc O 3 đơn vị nên biểu diễn số 3",
  },
  "diem-a-4": {
    kind: "line",
    from: 0,
    to: 10,
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
      },
      {
        type: "point",
        at: 4,
        name: "A",
        color: "amber",
      },
      {
        type: "arrow",
        from: 0,
        to: 4,
        tag: "4 đơn vị",
      },
    ],
    mode: "still",
    label: "Điểm A cách gốc O 4 đơn vị nên biểu diễn số 4",
  },
  "dat-diem": {
    kind: "lineTry",
    from: 0,
    to: 10,
    names: ["A"],
    goal: [6],
    done: "Điểm A cách gốc O 6 đơn vị, nên biểu diễn số 6.",
  },
  "doc-b-7": {
    kind: "line",
    from: 0,
    to: 10,
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
      },
      {
        type: "point",
        at: 7,
        name: "B",
        color: "amber",
        ask: true,
      },
    ],
    mode: "still",
    label: "Tia số có điểm B, số của B chưa biết",
  },
  "doc-c-4": {
    kind: "line",
    from: 0,
    to: 10,
    labelAt: [0],
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
      },
      {
        type: "point",
        at: 4,
        name: "C",
        color: "amber",
        ask: true,
      },
    ],
    mode: "still",
    label: "Tia số chỉ ghi số 0, có điểm C, số của C chưa biết",
  },
  "doc-a-9": {
    kind: "line",
    from: 0,
    to: 10,
    labelAt: [0, 5, 10],
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
      },
      {
        type: "point",
        at: 9,
        name: "A",
        color: "amber",
        ask: true,
      },
    ],
    mode: "still",
    label: "Tia số ghi các số 0, 5, 10, có điểm A, số của A chưa biết",
  },
  "goi-y-doc-diem": {
    kind: "line",
    from: 0,
    to: 10,
    labelAt: [0, 5, 10],
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
      },
      {
        type: "arrow",
        from: 0,
        to: 5,
        tag: "5 đơn vị",
      },
      {
        type: "point",
        at: 7,
        name: "M",
        color: "amber",
        ask: true,
      },
    ],
    mode: "hint",
    hintLayers: 2,
    label: "Tia số: từ gốc O đến vạch 5 là 5 đơn vị, còn điểm M chưa biết",
  },
  "giai-doc-diem-a-9": {
    kind: "line",
    from: 0,
    to: 10,
    labelAt: [0, 5, 10],
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
      },
      {
        type: "arrow",
        from: 0,
        to: 5,
        tag: "5 đơn vị",
      },
      {
        type: "arrow",
        from: 5,
        to: 9,
        tag: "4 đơn vị",
      },
      {
        type: "point",
        at: 9,
        name: "A",
        color: "amber",
      },
    ],
    mode: "steps",
    label: "Từ gốc O đi 5 đơn vị rồi thêm 4 đơn vị tới điểm A biểu diễn số 9",
  },
  "cham-diem-8": {
    kind: "lineTap",
    from: 0,
    to: 10,
    points: [
      {
        at: 2,
        name: "A",
      },
      {
        at: 8,
        name: "B",
      },
      {
        at: 5,
        name: "C",
      },
    ],
    label: "Tia số có ba điểm A, B, C",
  },
  "dem-buoc": {
    kind: "line",
    from: 0,
    to: 10,
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
      },
      {
        type: "arrow",
        from: 0,
        to: 1,
        tag: "1",
      },
      {
        type: "arrow",
        from: 1,
        to: 2,
        tag: "2",
      },
      {
        type: "arrow",
        from: 2,
        to: 3,
        tag: "3",
      },
      {
        type: "point",
        at: 3,
        name: "A",
        color: "amber",
      },
    ],
    mode: "still",
    label:
      "Từ gốc O đi ba bước, mỗi bước một đơn vị, tới điểm A biểu diễn số 3",
  },
  "vach-5": {
    kind: "line",
    from: 0,
    to: 50,
    step: 5,
    labelAt: [0, 10],
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
      },
      {
        type: "arrow",
        from: 0,
        to: 5,
        tag: "5 đơn vị",
      },
      {
        type: "arrow",
        from: 5,
        to: 10,
        tag: "5 đơn vị",
      },
      {
        type: "point",
        at: 35,
        name: "E",
        color: "amber",
        tag: "7 vạch",
      },
    ],
    mode: "steps",
    label:
      "Tia số có vạch cách nhau 5 đơn vị: điểm E ở vạch thứ 7 nên biểu diễn số 35",
  },
  "vach-5-xong": {
    kind: "line",
    from: 0,
    to: 50,
    step: 5,
    labelAt: [0, 10],
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
      },
      {
        type: "arrow",
        from: 0,
        to: 5,
        tag: "5 đơn vị",
      },
      {
        type: "point",
        at: 25,
        name: "A",
        color: "amber",
        tag: "5 vạch",
      },
    ],
    mode: "still",
    label:
      "Hai vạch liền nhau cách nhau 5 đơn vị: điểm A ở vạch thứ 5 nên biểu diễn số 25",
  },
  "cot-km": {
    kind: "line",
    from: 0,
    to: 70,
    step: 5,
    labelAt: [0, 10, 40, 50],
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
        tag: "Đầu đường",
      },
      {
        type: "point",
        at: 25,
        name: "H",
        color: "amber",
        tag: "Cột km 25",
      },
      {
        type: "arrow",
        from: 25,
        to: 65,
        tag: "40 km",
      },
      {
        type: "point",
        at: 65,
        name: "T",
        color: "amber",
        tag: "Thị trấn",
      },
    ],
    mode: "steps",
    label:
      "Cột cây số km 25, còn 40 km nữa tới thị trấn, thị trấn ứng với số 65",
  },
  "dat-diem-5": {
    kind: "lineTry",
    from: 0,
    to: 50,
    step: 5,
    labelAt: [0, 10, 20, 30, 40, 50],
    names: ["A"],
    goal: [30],
    done: "Điểm A đi 6 vạch, mỗi vạch 5 đơn vị, nên biểu diễn số 30.",
  },
  "doc-p-40": {
    kind: "line",
    from: 0,
    to: 50,
    step: 5,
    labelAt: [0, 10],
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
      },
      {
        type: "point",
        at: 40,
        name: "P",
        color: "amber",
        ask: true,
      },
    ],
    mode: "still",
    label: "Tia số có vạch cách nhau 5 đơn vị, điểm P chưa biết số",
  },
  "cot-40": {
    kind: "line",
    from: 0,
    to: 70,
    step: 5,
    labelAt: [0, 10, 20, 30, 40, 50, 60, 70],
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
        tag: "Đầu đường",
      },
      {
        type: "point",
        at: 40,
        name: "H",
        color: "amber",
        tag: "Cột km 40",
      },
    ],
    mode: "still",
    label: "Tia số có gốc O là điểm đầu đường và cột cây số km 40",
  },
  "doc-e-45": {
    kind: "line",
    from: 0,
    to: 50,
    step: 5,
    labelAt: [0, 10],
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
      },
      {
        type: "point",
        at: 45,
        name: "E",
        color: "amber",
        ask: true,
      },
    ],
    mode: "still",
    label: "Tia số có vạch cách nhau 5 đơn vị, điểm E chưa biết số",
  },
  "goi-y-vach-5": {
    kind: "line",
    from: 0,
    to: 50,
    step: 5,
    labelAt: [0, 10],
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
      },
      {
        type: "arrow",
        from: 0,
        to: 5,
        tag: "5 đơn vị",
      },
      {
        type: "point",
        at: 30,
        name: "M",
        color: "amber",
        ask: true,
      },
    ],
    mode: "hint",
    hintLayers: 2,
    label: "Hai vạch liền nhau cách nhau 5 đơn vị, điểm M chưa biết số",
  },
  "giai-vach-5-45": {
    kind: "line",
    from: 0,
    to: 50,
    step: 5,
    labelAt: [0, 10],
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
      },
      {
        type: "arrow",
        from: 0,
        to: 5,
        tag: "5 đơn vị",
      },
      {
        type: "arrow",
        from: 5,
        to: 10,
        tag: "5 đơn vị",
      },
      {
        type: "point",
        at: 45,
        name: "E",
        color: "amber",
        tag: "9 vạch",
      },
    ],
    mode: "steps",
    label: "Đếm cách 5 từ gốc O tới điểm E ở vạch thứ 9, được số 45",
  },
  "cham-diem-30": {
    kind: "lineTap",
    from: 0,
    to: 50,
    step: 5,
    labelAt: [0, 10, 20],
    points: [
      {
        at: 15,
        name: "A",
      },
      {
        at: 30,
        name: "B",
      },
      {
        at: 45,
        name: "C",
      },
    ],
    label: "Tia số có vạch cách nhau 5 đơn vị và ba điểm A, B, C",
  },
  "ba-diem-d-g": {
    kind: "line",
    from: 0,
    to: 50,
    step: 5,
    labelAt: [0, 10],
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
      },
      {
        type: "point",
        at: 15,
        name: "D",
        color: "amber",
        ask: true,
      },
      {
        type: "point",
        at: 25,
        name: "E",
        color: "amber",
        ask: true,
      },
      {
        type: "point",
        at: 30,
        name: "F",
        color: "amber",
        ask: true,
      },
      {
        type: "point",
        at: 45,
        name: "G",
        color: "amber",
        ask: true,
      },
    ],
    mode: "still",
    label: "Tia số có vạch cách nhau 5 đơn vị và bốn điểm D, E, F, G",
  },
  "cot-45": {
    kind: "line",
    from: 0,
    to: 80,
    step: 5,
    labelAt: [0, 10, 20, 30, 60, 70, 80],
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
        tag: "Đầu đường",
      },
      {
        type: "point",
        at: 45,
        name: "H",
        color: "amber",
        tag: "Cột km 45",
      },
    ],
    mode: "still",
    label: "Tia số có gốc O là điểm đầu đường và cột cây số km 45",
  },
  "giai-cot-45-30": {
    kind: "line",
    from: 0,
    to: 80,
    step: 5,
    labelAt: [0, 10, 20, 30, 60],
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
        tag: "Đầu đường",
      },
      {
        type: "point",
        at: 45,
        name: "H",
        color: "amber",
        tag: "Cột km 45",
      },
      {
        type: "arrow",
        from: 45,
        to: 75,
        tag: "30 km",
      },
      {
        type: "point",
        at: 75,
        name: "T",
        color: "amber",
        tag: "Thị trấn",
      },
    ],
    mode: "steps",
    label: "Từ cột km 45 đi thêm 30 km tới thị trấn ứng với số 75",
  },
  "cot-20": {
    kind: "line",
    from: 0,
    to: 50,
    step: 5,
    labelAt: [0, 10, 20, 30, 40, 50],
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
        tag: "Đầu đường",
      },
      {
        type: "point",
        at: 20,
        name: "H",
        color: "amber",
        tag: "Cột km 20",
      },
    ],
    mode: "still",
    label: "Tia số có gốc O là điểm đầu đường và cột cây số km 20",
  },
  "cot-55-70": {
    kind: "line",
    from: 0,
    to: 80,
    step: 5,
    labelAt: [0, 10, 20, 30, 40, 70, 80],
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
        tag: "Đầu đường",
      },
      {
        type: "point",
        at: 55,
        name: "H",
        color: "amber",
        tag: "Cột km 55",
      },
      {
        type: "point",
        at: 70,
        name: "T",
        color: "amber",
        tag: "Thị trấn",
      },
    ],
    mode: "still",
    label: "Tia số có cột cây số km 55 và thị trấn ứng với số 70",
  },
  "trai-3-8": {
    kind: "line",
    from: 0,
    to: 10,
    layers: [
      {
        type: "point",
        at: 3,
        name: "A",
        color: "blue",
        tag: "Số nhỏ hơn",
      },
      {
        type: "point",
        at: 8,
        name: "B",
        color: "violet",
        tag: "Số lớn hơn",
      },
      {
        type: "arrow",
        from: 3,
        to: 8,
        tag: "sang phải",
      },
    ],
    mode: "steps",
    label: "Điểm A biểu diễn số 3 nằm bên trái điểm B biểu diễn số 8",
  },
  "trai-3-8-xong": {
    kind: "line",
    from: 0,
    to: 10,
    layers: [
      {
        type: "point",
        at: 3,
        name: "A",
        color: "blue",
        tag: "Số nhỏ hơn",
      },
      {
        type: "point",
        at: 8,
        name: "B",
        color: "violet",
        tag: "Số lớn hơn",
      },
      {
        type: "arrow",
        from: 3,
        to: 8,
        tag: "sang phải",
      },
    ],
    mode: "still",
    label: "Điểm A biểu diễn số 3 nằm bên trái điểm B biểu diễn số 8",
  },
  "dat-hai-diem": {
    kind: "lineTry",
    from: 0,
    to: 12,
    labelAt: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    names: ["A", "B"],
    goal: [4, 9],
    done: "Số 4 nhỏ hơn số 9, nên điểm A nằm bên trái điểm B.",
  },
  "cham-diem-trai": {
    kind: "lineTap",
    from: 0,
    to: 10,
    labelAt: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    points: [
      {
        at: 5,
        name: "A",
      },
      {
        at: 1,
        name: "B",
      },
      {
        at: 9,
        name: "C",
      },
    ],
    label: "Tia số có ba điểm A, B, C",
  },
  "dau-15-25": {
    kind: "signs",
    left: "15",
    right: "25",
    sign: "<",
    mode: "steps",
    label: "15 nhỏ hơn 25, viết 15 < 25",
  },
  "dau-9-4": {
    kind: "signs",
    left: "9",
    right: "4",
    sign: ">",
    mode: "still",
    label: "9 lớn hơn 4, viết 9 > 4",
  },
  "dau-3-8": {
    kind: "signs",
    left: "3",
    right: "8",
    sign: "<",
    mode: "still",
    label: "3 nhỏ hơn 8, viết 3 < 8",
  },
  "chon-dau-140-135": {
    kind: "chips",
    items: ["140 < 135", "140 > 135"],
    wants: [1],
    done: "Bạn chọn đúng: 140 lớn hơn 135, nên viết 140 > 135.",
  },
  "goi-y-dau-4-9": {
    kind: "signs",
    left: "4",
    right: "9",
    sign: "<",
    mode: "hint",
    label: "So sánh 4 và 9, dấu chưa viết",
  },
  "giai-dau-6-11": {
    kind: "signs",
    left: "6",
    right: "11",
    sign: "<",
    mode: "steps",
    label: "6 nhỏ hơn 11, viết 6 < 11",
  },
  "bang-3-5": {
    kind: "lines",
    label: "Ba ví dụ dùng dấu nhỏ hơn hoặc bằng và lớn hơn hoặc bằng",
    rows: [
      {
        tex: "3 ≤ 5",
        tag: {
          text: "3 nhỏ hơn 5",
          color: "blue",
        },
      },
      {
        tex: "5 ≤ 5",
        tag: {
          text: "5 bằng 5",
          color: "slate",
        },
      },
      {
        tex: "7 ≥ 5",
        tag: {
          text: "7 lớn hơn 5",
          color: "violet",
        },
      },
    ],
    mode: "steps",
  },
  "bang-xong": {
    kind: "rows",
    label: "Ba ví dụ dùng dấu nhỏ hơn hoặc bằng và lớn hơn hoặc bằng",
    rows: [
      {
        tex: "3 ≤ 5",
        tag: {
          text: "3 nhỏ hơn 5",
          color: "blue",
        },
      },
      {
        tex: "5 ≤ 5",
        tag: {
          text: "5 bằng 5",
          color: "slate",
        },
      },
      {
        tex: "7 ≥ 5",
        tag: {
          text: "7 lớn hơn 5",
          color: "violet",
        },
      },
    ],
  },
  "thang-may": {
    kind: "line",
    from: 0,
    to: 10,
    labelAt: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    layers: [
      {
        type: "dots",
        at: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        color: "amber",
        tag: "n ≤ 8",
      },
    ],
    mode: "still",
    label: "Các số n nhỏ hơn hoặc bằng 8: từ 0 đến 8",
  },
  "chon-x-nho-bang-4": {
    kind: "chips",
    items: ["3", "4", "5", "9"],
    wants: [0, 1],
    done: "Bạn chọn đủ: 3 và 4 đều nhỏ hơn hoặc bằng 4.",
  },
  "so-9840-12305": {
    kind: "digits",
    a: "9840",
    b: "12305",
    mode: "steps",
    label: "So sánh 9 840 và 12 305 bằng cách đếm chữ số",
  },
  "so-4276-4291": {
    kind: "digits",
    a: "4276",
    b: "4291",
    mode: "still",
    label: "So sánh 4 276 và 4 291 từng cặp chữ số từ trái sang phải",
  },
  "chon-27408-27480": {
    kind: "chips",
    items: ["27 408", "27 480"],
    wants: [1],
    done: "Bạn chọn đúng: hai số giống nhau ba chữ số đầu, rồi 8 lớn hơn 0 nên 27 480 lớn hơn.",
  },
  "goi-y-so-3519-3591": {
    kind: "digits",
    a: "3519",
    b: "3591",
    mode: "hint",
    label: "So sánh 3 519 và 3 591 từng cặp chữ số, chưa có kết luận",
  },
  "giai-so-6305-6350": {
    kind: "digits",
    a: "6305",
    b: "6350",
    mode: "steps",
    label: "So sánh 6 305 và 6 350 từng cặp chữ số từ trái sang phải",
  },
  "muon-sach": {
    kind: "bars",
    items: [
      {
        label: "T2",
        value: 8,
      },
      {
        label: "T3",
        value: 12,
      },
      {
        label: "T4",
        value: 9,
      },
      {
        label: "T5",
        value: 15,
      },
      {
        label: "T6",
        value: 10,
      },
      {
        label: "T7",
        value: 4,
      },
      {
        label: "CN",
        value: 1,
      },
    ],
    max: 15,
    gridEvery: 5,
    unit: "quyển",
    values: "all",
    mode: "steps",
    label: "Số quyển sách thư viện cho mượn mỗi ngày trong tuần",
  },
  "muon-sach-nhieu-it": {
    kind: "bars",
    items: [
      {
        label: "T2",
        value: 8,
      },
      {
        label: "T3",
        value: 12,
      },
      {
        label: "T4",
        value: 9,
      },
      {
        label: "T5",
        value: 15,
      },
      {
        label: "T6",
        value: 10,
      },
      {
        label: "T7",
        value: 4,
      },
      {
        label: "CN",
        value: 1,
      },
    ],
    max: 15,
    gridEvery: 5,
    unit: "quyển",
    values: "all",
    mode: "still",
    marks: [
      {
        index: 3,
        color: "violet",
        tag: "Nhiều nhất",
      },
      {
        index: 6,
        color: "blue",
        tag: "Ít nhất",
      },
    ],
    label: "Cột thứ Năm cao nhất, cột Chủ nhật thấp nhất",
  },
  "muon-sach-xong": {
    kind: "bars",
    items: [
      {
        label: "T2",
        value: 8,
      },
      {
        label: "T3",
        value: 12,
      },
      {
        label: "T4",
        value: 9,
      },
      {
        label: "T5",
        value: 15,
      },
      {
        label: "T6",
        value: 10,
      },
      {
        label: "T7",
        value: 4,
      },
      {
        label: "CN",
        value: 1,
      },
    ],
    max: 15,
    gridEvery: 5,
    unit: "quyển",
    values: "all",
    mode: "still",
    label: "Số quyển sách thư viện cho mượn mỗi ngày trong tuần",
  },
  "muon-sach-tap": {
    kind: "bars",
    items: [
      {
        label: "T2",
        value: 8,
      },
      {
        label: "T3",
        value: 12,
      },
      {
        label: "T4",
        value: 9,
      },
      {
        label: "T5",
        value: 15,
      },
      {
        label: "T6",
        value: 10,
      },
      {
        label: "T7",
        value: 4,
      },
      {
        label: "CN",
        value: 1,
      },
    ],
    max: 15,
    gridEvery: 5,
    unit: "quyển",
    values: "all",
    mode: "still",
    tap: true,
    label: "Số quyển sách thư viện cho mượn mỗi ngày, chạm vào một cột",
  },
  "giam-dan": {
    kind: "rows",
    label: "Số quyển giảm dần từ thứ Sáu đến Chủ nhật",
    rows: [
      {
        tex: "10 > 4 > 1",
        tag: {
          text: "Giảm dần",
          color: "slate",
        },
      },
    ],
  },
  "chon-ngay-it-nhat": {
    kind: "chips",
    items: ["T2", "T3", "T7", "CN"],
    wants: [3],
    done: "Bạn chọn đúng: cột Chủ nhật thấp nhất, chỉ có 1 quyển.",
  },
  "clb-doc": {
    kind: "bars",
    items: [
      {
        label: "T2",
        value: 10,
      },
      {
        label: "T3",
        value: 20,
      },
      {
        label: "T4",
        value: 15,
      },
      {
        label: "T5",
        value: 5,
      },
      {
        label: "T6",
        value: 25,
      },
    ],
    max: 25,
    gridEvery: 5,
    unit: "bạn",
    values: "none",
    mode: "still",
    label: "Số bạn đến câu lạc bộ cờ mỗi ngày, các cột chạm đúng vạch lưới",
  },
  "clb-tap": {
    kind: "bars",
    items: [
      {
        label: "T2",
        value: 10,
      },
      {
        label: "T3",
        value: 20,
      },
      {
        label: "T4",
        value: 15,
      },
      {
        label: "T5",
        value: 5,
      },
      {
        label: "T6",
        value: 25,
      },
    ],
    max: 25,
    gridEvery: 5,
    unit: "bạn",
    values: "none",
    mode: "still",
    tap: true,
    label: "Số bạn đến câu lạc bộ cờ mỗi ngày, chạm vào một cột",
  },
  "nha-so-25": {
    kind: "line",
    from: 22,
    to: 28,
    layers: [
      {
        type: "point",
        at: 25,
        color: "amber",
        tag: "Nhà bạn",
      },
      {
        type: "point",
        at: 24,
        color: "sky",
        tag: "Liền trước",
      },
      {
        type: "point",
        at: 26,
        color: "pink",
        tag: "Liền sau",
      },
    ],
    mode: "steps",
    label: "Nhà bạn số 25: nhà số 24 liền trước, nhà số 26 liền sau",
  },
  "lien-tiep-rows": {
    kind: "rows",
    label: "Số liền trước và số liền sau của một số tự nhiên",
    rows: [
      {
        tex: "\\concept{sky}{a}",
        tag: {
          text: "Số liền trước của a + 1",
          color: "sky",
        },
      },
      {
        tex: "\\concept{pink}{a + 1}",
        tag: {
          text: "Số liền sau của a",
          color: "pink",
        },
      },
      {
        tex: "\\concept{sky}{24},\\ \\concept{pink}{25}",
        tag: {
          text: "Ví dụ: a = 24",
          color: "slate",
        },
        gapBefore: true,
      },
    ],
  },
  "so-0": {
    kind: "line",
    from: 0,
    to: 5,
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
        tag: "Nhỏ nhất",
      },
      {
        type: "point",
        at: 1,
        color: "pink",
        tag: "Liền sau của 0",
      },
    ],
    mode: "still",
    label: "Số 0 là số tự nhiên nhỏ nhất, số liền sau của 0 là 1",
  },
  "bac-cau-keo": {
    kind: "lines",
    label:
      "Nam có ít kẹo hơn Lan, Lan có ít kẹo hơn Hà, nên Nam có ít kẹo hơn Hà",
    rows: [
      {
        tex: "3 < 5",
        tag: {
          text: "Nam có ít kẹo hơn Lan",
          color: "blue",
        },
      },
      {
        tex: "5 < 8",
        tag: {
          text: "Lan có ít kẹo hơn Hà",
          color: "violet",
        },
      },
      {
        tex: "3 < 8",
        tag: {
          text: "Nên Nam có ít kẹo hơn Hà",
          color: "slate",
        },
      },
    ],
    mode: "steps",
  },
  "bac-cau-xong": {
    kind: "rows",
    label: "Tính chất bắc cầu với dấu nhỏ hơn và dấu nhỏ hơn hoặc bằng",
    rows: [
      {
        tex: "\\concept{blue}{a} < b",
        tag: {
          text: "a bên trái b",
          color: "blue",
        },
      },
      {
        tex: "b < \\concept{violet}{c}",
        tag: {
          text: "b bên trái c",
          color: "violet",
        },
      },
      {
        tex: "\\concept{blue}{a} < \\concept{violet}{c}",
        tag: {
          text: "Nên a bên trái c",
          color: "slate",
        },
      },
      {
        tex: "\\concept{blue}{a} ≤ b",
        tag: {
          text: "a ≤ b",
          color: "blue",
        },
        gapBefore: true,
      },
      {
        tex: "b ≤ \\concept{violet}{c}",
        tag: {
          text: "b ≤ c",
          color: "violet",
        },
      },
      {
        tex: "\\concept{blue}{a} ≤ \\concept{violet}{c}",
        tag: {
          text: "Nên a ≤ c",
          color: "slate",
        },
      },
    ],
  },
  "chon-thap-nhat": {
    kind: "chips",
    items: ["Nam", "Lan", "Hà"],
    wants: [0],
    done: "Nam thấp hơn Lan, Lan thấp hơn Hà, nên Nam thấp hơn Hà. Nam thấp nhất.",
  },
  "chia-ba-phan": {
    kind: "line",
    from: 0,
    to: 20,
    labelAt: [0, 5, 10, 15, 20],
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
      },
      {
        type: "point",
        at: 5,
        name: "A",
        color: "amber",
      },
      {
        type: "point",
        at: 10,
        name: "B",
        color: "amber",
      },
      {
        type: "span",
        from: 0,
        to: 5,
        color: "blue",
        tag: "đoạn OA",
      },
      {
        type: "span",
        from: 5,
        to: 10,
        color: "teal",
        tag: "đoạn AB",
      },
      {
        type: "span",
        from: 10,
        to: 20,
        color: "slate",
        tag: "phần còn lại",
      },
    ],
    mode: "steps",
    label:
      "Điểm A biểu diễn 5 và điểm B biểu diễn 10 chia tia số thành đoạn OA, đoạn AB và phần còn lại",
  },
  "doan-ab-xong": {
    kind: "line",
    from: 0,
    to: 20,
    labelAt: [0, 5, 10, 15, 20],
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
      },
      {
        type: "point",
        at: 5,
        name: "A",
        color: "amber",
      },
      {
        type: "point",
        at: 10,
        name: "B",
        color: "amber",
      },
      {
        type: "span",
        from: 5,
        to: 10,
        color: "teal",
        tag: "đoạn AB",
      },
    ],
    mode: "still",
    label:
      "Đoạn AB gồm điểm A biểu diễn 5, điểm B biểu diễn 10 và các điểm ở giữa",
  },
  "chon-doan-ab-5-10": {
    kind: "chips",
    items: ["3", "7", "10", "14"],
    wants: [1, 2],
    done: "Bạn chọn đúng: 7 ở giữa 5 và 10, còn 10 là đầu đoạn nên cũng thuộc đoạn AB.",
  },
  "phan-4-9": {
    kind: "line",
    from: 0,
    to: 12,
    labelAt: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
      },
      {
        type: "point",
        at: 4,
        name: "A",
        color: "amber",
      },
      {
        type: "point",
        at: 9,
        name: "B",
        color: "amber",
      },
    ],
    mode: "still",
    label: "Tia số có điểm A biểu diễn số 4 và điểm B biểu diễn số 9",
  },
  "n-nsao": {
    kind: "rows",
    label: "Tập hợp các số tự nhiên và tập hợp các số tự nhiên khác 0",
    rows: [
      {
        tex: "\\mathbb{N} = \\{0; 1; 2; 3; \\ldots\\}",
        tag: {
          text: "Có số 0",
          color: "teal",
        },
      },
      {
        tex: "\\mathbb{N}^{\\ast} = \\{1; 2; 3; \\ldots\\}",
        tag: {
          text: "Không có số 0",
          color: "teal",
        },
      },
    ],
  },
  "m-liet-ke": {
    kind: "rows",
    label: "Tập hợp M viết bằng dấu hiệu đặc trưng và bằng cách liệt kê",
    rows: [
      {
        tex: "\\concept{teal}{M} = \\{x \\in \\mathbb{N} \\mid \\concept{lime}{5 ≤ x ≤ 10}\\}",
        tag: {
          text: "Dấu hiệu đặc trưng",
          color: "lime",
        },
      },
      {
        tex: "\\concept{teal}{M} = \\{5; 6; 7; 8; 9; 10\\}",
        tag: {
          text: "Liệt kê",
          color: "teal",
        },
      },
    ],
  },
  "chon-phan-tu-3-6": {
    kind: "chips",
    items: ["2", "3", "6", "7"],
    wants: [1, 2],
    done: "Bạn chọn đúng: 3 và 6 là hai đầu nên cũng thuộc tập hợp.",
  },
  sticker: {
    kind: "sticker",
  },
};
