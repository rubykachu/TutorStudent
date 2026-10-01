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
      "Tia số như chiếc thước kẻ: đi từ gốc O sang phải 3 đơn vị tới điểm A biểu diễn số 3",
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
    label: "Đi từ gốc O sang phải 4 đơn vị tới điểm A biểu diễn số 4",
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
        to: 3,
        tag: "3 bước",
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
        type: "span",
        from: 0,
        to: 5,
        color: "amber",
        tag: "5 đơn vị",
      },
      {
        type: "span",
        from: 5,
        to: 10,
        color: "amber",
        tag: "5 đơn vị",
      },
      {
        type: "point",
        at: 20,
        name: "K",
        color: "amber",
        tag: "4 vạch",
      },
    ],
    mode: "steps",
    label:
      "Hai vạch liền nhau cách nhau 5 đơn vị: điểm K ở vạch thứ 4 nên biểu diễn số 20",
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
        type: "span",
        from: 0,
        to: 5,
        color: "amber",
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
  "dat-diem-5": {
    kind: "lineTry",
    from: 0,
    to: 50,
    step: 5,
    labelAt: [0, 10, 20, 30, 40, 50],
    names: ["A"],
    goal: [30],
    done: "Điểm A đi 6 bước, mỗi bước 5 đơn vị, nên biểu diễn số 30.",
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
    label:
      "Tia số có hai vạch liền nhau cách nhau 5 đơn vị, điểm P chưa biết số",
  },
  "doc-q-35": {
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
        at: 35,
        name: "Q",
        color: "amber",
        ask: true,
      },
    ],
    mode: "still",
    label:
      "Tia số có hai vạch liền nhau cách nhau 5 đơn vị, điểm Q chưa biết số",
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
        type: "span",
        from: 0,
        to: 5,
        color: "amber",
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
  "giai-vach-5-35": {
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
        type: "span",
        from: 0,
        to: 5,
        color: "amber",
        tag: "5 đơn vị",
      },
      {
        type: "span",
        from: 5,
        to: 10,
        color: "amber",
        tag: "5 đơn vị",
      },
      {
        type: "point",
        at: 35,
        name: "Q",
        color: "amber",
        tag: "7 vạch",
      },
    ],
    mode: "steps",
    label: "Đếm cách 5 từ gốc O tới điểm Q ở vạch thứ 7, được số 35",
  },
  "cham-diem-35": {
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
        at: 35,
        name: "B",
      },
      {
        at: 45,
        name: "C",
      },
    ],
    label: "Tia số có hai vạch liền nhau cách nhau 5 đơn vị và ba điểm A, B, C",
  },
  "bon-diem-k-n": {
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
        name: "K",
        color: "amber",
        ask: true,
      },
      {
        type: "point",
        at: 35,
        name: "L",
        color: "amber",
        ask: true,
      },
      {
        type: "point",
        at: 40,
        name: "M",
        color: "amber",
        ask: true,
      },
      {
        type: "point",
        at: 20,
        name: "N",
        color: "amber",
        ask: true,
      },
    ],
    mode: "still",
    label:
      "Tia số có hai vạch liền nhau cách nhau 5 đơn vị và bốn điểm K, L, M, N",
  },
  "cot-km": {
    kind: "line",
    from: 0,
    to: 70,
    step: 5,
    labelAt: [0, 10, 20],
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
        tag: "còn 40 km",
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
      "Đi qua cột km 25, còn 40 km nữa tới thị trấn, thị trấn ứng với điểm biểu diễn số 65",
  },
  "cot-km-xong": {
    kind: "line",
    from: 0,
    to: 70,
    step: 5,
    labelAt: [0, 10, 20],
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
        tag: "còn 40 km",
      },
      {
        type: "point",
        at: 65,
        name: "T",
        color: "amber",
        tag: "Thị trấn",
      },
    ],
    mode: "still",
    label:
      "Số của thị trấn bằng số của cột cộng số km còn lại: 25 cộng 40 bằng 65",
  },
  "chon-cot-30-20": {
    kind: "chips",
    items: ["10", "50", "60"],
    wants: [1],
    done: "Bạn chọn đúng: thị trấn ở phía trước nên lấy 30 cộng 20, được 50.",
  },
  "cot-40": {
    kind: "line",
    from: 0,
    to: 70,
    step: 5,
    labelAt: [0, 10, 20],
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
    label: "Tia số có gốc O là đầu đường và cột cây số km 40",
  },
  "cot-45": {
    kind: "line",
    from: 0,
    to: 80,
    step: 5,
    labelAt: [0, 10, 20],
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
    label: "Tia số có gốc O là đầu đường và cột cây số km 45",
  },
  "giai-cot-45-30": {
    kind: "line",
    from: 0,
    to: 80,
    step: 5,
    labelAt: [0, 10, 20],
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
        tag: "còn 30 km",
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
    label:
      "Từ cột km 45 còn 30 km nữa tới thị trấn ứng với điểm biểu diễn số 75",
  },
  "cot-20": {
    kind: "line",
    from: 0,
    to: 50,
    step: 5,
    labelAt: [0, 10, 40],
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
    label: "Tia số có gốc O là đầu đường và cột cây số km 20",
  },
  "cot-55-70": {
    kind: "line",
    from: 0,
    to: 80,
    step: 5,
    labelAt: [0, 10, 20],
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
    label:
      "Tia số có cột cây số km 55 và thị trấn ứng với điểm biểu diễn số 70",
  },
  "goi-y-cot-lai": {
    kind: "line",
    from: 0,
    to: 80,
    step: 5,
    labelAt: [0, 10, 20],
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
        at: 30,
        name: "H",
        color: "amber",
        tag: "Cột km 30",
      },
      {
        type: "point",
        at: 45,
        name: "T",
        color: "amber",
        tag: "Thị trấn",
      },
      {
        type: "arrow",
        from: 30,
        to: 45,
        tag: "bao nhiêu km?",
      },
    ],
    mode: "hint",
    hintLayers: 3,
    label: "Cột km 30 và thị trấn ứng với số 45: hỏi còn bao nhiêu km",
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
        tag: "sang phải thì số lớn dần",
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
        tag: "sang phải thì số lớn dần",
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
  "bang-xong": {
    kind: "rows",
    label: "Bốn ví dụ dùng dấu nhỏ hơn hoặc bằng và lớn hơn hoặc bằng",
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
        tex: "5 ≥ 5",
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
  "so-9840-12305-xong": {
    kind: "digits",
    a: "9840",
    b: "12305",
    mode: "still",
    label: "So sánh 9 840 và 12 305 bằng cách đếm chữ số",
  },
  "chon-857-1203": {
    kind: "chips",
    items: ["857", "1 203"],
    wants: [1],
    done: "Bạn chọn đúng: 1 203 có 4 chữ số, nhiều hơn 857 có 3 chữ số, nên 1 203 lớn hơn.",
  },
  "so-6218-6247": {
    kind: "digits",
    a: "6218",
    b: "6247",
    mode: "steps",
    label: "So sánh 6 218 và 6 247 từng cặp chữ số từ trái sang phải",
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
    items: ["T3", "T4", "T5", "T6"],
    wants: [1],
    done: "Bạn chọn đúng: cột T4 thấp nhất, chỉ có 9 quyển.",
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
    values: "all",
    mode: "still",
    label: "Số bạn đến câu lạc bộ cờ mỗi ngày",
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
  "trang-25": {
    kind: "line",
    from: 22,
    to: 28,
    layers: [
      {
        type: "point",
        at: 25,
        color: "amber",
        tag: "Trang bạn đọc",
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
    label: "Bạn đọc trang 25: trang 24 liền trước, trang 26 liền sau",
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
        tex: "\\concept{sky}{25},\\ \\concept{pink}{26}",
        tag: {
          text: "Ví dụ: a = 25",
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
          color: "slate",
        },
      },
      {
        tex: "5 < 8",
        tag: {
          text: "Lan có ít kẹo hơn Hà",
          color: "slate",
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
          text: "a bên trái b hoặc trùng b",
          color: "blue",
        },
        gapBefore: true,
      },
      {
        tex: "b ≤ \\concept{violet}{c}",
        tag: {
          text: "b bên trái c hoặc trùng c",
          color: "violet",
        },
      },
      {
        tex: "\\concept{blue}{a} ≤ \\concept{violet}{c}",
        tag: {
          text: "Nên a bên trái c hoặc trùng c",
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
    labelAt: [0, 10, 20],
    layers: [
      {
        type: "point",
        at: 0,
        name: "O",
        color: "slate",
      },
      {
        type: "point",
        at: 6,
        name: "A",
        color: "amber",
      },
      {
        type: "point",
        at: 12,
        name: "B",
        color: "amber",
      },
      {
        type: "span",
        from: 0,
        to: 6,
        color: "blue",
        tag: "đoạn OA",
      },
      {
        type: "span",
        from: 6,
        to: 12,
        color: "teal",
        tag: "đoạn AB",
      },
      {
        type: "span",
        from: 12,
        to: 20,
        color: "slate",
        tag: "phần còn lại",
      },
    ],
    mode: "steps",
    label:
      "Điểm A biểu diễn 6 và điểm B biểu diễn 12 cắt tia số làm đoạn OA, đoạn AB và phần còn lại",
  },
  "ba-phan-rows": {
    kind: "rows",
    label: "So x với a và b để biết điểm biểu diễn số x thuộc phần nào",
    rows: [
      {
        tex: "x ≤ a",
        tag: {
          text: "Đoạn OA",
          color: "amber",
        },
      },
      {
        tex: "a ≤ x ≤ b",
        tag: {
          text: "Đoạn AB, kể cả A và B",
          color: "amber",
        },
      },
      {
        tex: "x > b",
        tag: {
          text: "Phần còn lại",
          color: "amber",
        },
      },
    ],
  },
  "chon-doan-ab-6-12": {
    kind: "chips",
    items: ["4", "8", "12", "15"],
    wants: [1, 2],
    done: "Bạn chọn đúng: 8 ở giữa 6 và 12, còn 12 là đầu đoạn nên cũng thuộc đoạn AB.",
  },
  "phan-3-8": {
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
        at: 3,
        name: "A",
        color: "amber",
      },
      {
        type: "point",
        at: 8,
        name: "B",
        color: "amber",
      },
    ],
    mode: "still",
    label: "Tia số có điểm A biểu diễn số 3 và điểm B biểu diễn số 8",
  },
  "phan-2-7": {
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
        at: 2,
        name: "A",
        color: "amber",
      },
      {
        type: "point",
        at: 7,
        name: "B",
        color: "amber",
      },
    ],
    mode: "still",
    label: "Tia số có điểm A biểu diễn số 2 và điểm B biểu diễn số 7",
  },
  "phan-5-11": {
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
        at: 5,
        name: "A",
        color: "amber",
      },
      {
        type: "point",
        at: 11,
        name: "B",
        color: "amber",
      },
    ],
    mode: "still",
    label: "Tia số có điểm A biểu diễn số 5 và điểm B biểu diễn số 11",
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
        tex: "\\concept{teal}{M} = \\{x \\in \\mathbb{N} \\mid \\concept{lime}{6 ≤ x ≤ 12}\\}",
        tag: {
          text: "Dấu hiệu đặc trưng",
          color: "lime",
        },
      },
      {
        tex: "\\concept{teal}{M} = \\{6; 7; 8; 9; 10; 11; 12\\}",
        tag: {
          text: "Liệt kê",
          color: "teal",
        },
      },
    ],
  },
  "liet-ke-mau": {
    kind: "rows",
    label: "Các số tự nhiên nhỏ hơn 4 trong ℕ và trong ℕ*",
    rows: [
      {
        tex: "\\{x \\in \\mathbb{N} \\mid x < 4\\} = \\{0; 1; 2; 3\\}",
        tag: {
          text: "Có số 0, không có số 4",
          color: "teal",
        },
      },
      {
        tex: "\\{x \\in \\mathbb{N}^{\\ast} \\mid x < 4\\} = \\{1; 2; 3\\}",
        tag: {
          text: "Không có số 0",
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
  "thang-3-8": {
    kind: "line",
    from: 0,
    to: 10,
    labelAt: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    layers: [
      {
        type: "dots",
        at: [3, 4, 5, 6, 7, 8],
        color: "amber",
        tag: "6 số",
      },
    ],
    mode: "still",
    label: "Số người n từ 3 đến 8 có 6 số: 3, 4, 5, 6, 7 và 8",
  },
  "dem-rows": {
    kind: "rows",
    label: "Đếm các số từ 3 đến 8 bằng phép tính 8 trừ 3 cộng 1",
    rows: [
      {
        tex: "8 - 3 + 1 = 6",
        tag: {
          text: "Từ 3 đến 8 có 6 số",
          color: "amber",
        },
      },
    ],
  },
  "chon-dem-10-14": {
    kind: "chips",
    items: ["4", "5", "6"],
    wants: [1],
    done: "Bạn chọn đúng: 14 trừ 10 cộng 1 bằng 5, nên từ 10 đến 14 có 5 số.",
  },
  sticker: {
    kind: "sticker",
  },
};
