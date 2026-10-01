import type { ConceptColor } from "@/schema/content";
import type { LinesSpec, RowsSpec } from "@/visuals/shared/formula-rows";
import type { LineLayer, NumberLineSpec } from "@/visuals/shared/number-line";
import type { ChipsSpec } from "@/visuals/shared/pick-chips";
import type { LineTapSpec } from "./line-tap";
import type { LineTrySpec } from "./line-try";
import { lineTapRegions } from "./logic";
import type { ScaleSpec } from "./scale";

// Every picture of the lesson that is drawn from numbers: the registry builds
// one entry per item (id `tap-hop-cac-so-nguyen.visual.<key>`), so a new
// example is one item here and its id in lesson.json. Pure data, no React, so
// `content:check` reads it.

export { LESSON_SLUG } from "./logic";

export type VisualSpec =
  // The integer number line, layer by layer (see `NumberLineSpec`).
  | ({ kind: "line" } & NumberLineSpec)
  // Hands-on: the child moves named points along the line, state
  // { p0, p1, … } (see `LineTrySpec`).
  | ({ kind: "lineTry" } & LineTrySpec)
  // The child taps a named point of the line (see `LineTapSpec`).
  | ({ kind: "lineTap" } & LineTapSpec)
  // A vertical scale: thermometer, floors, height above the sea (see
  // `ScaleSpec`).
  | ({ kind: "scale" } & ScaleSpec)
  // Formulas stacked, each with an optional tag (see `RowsSpec`).
  | ({ kind: "rows" } & RowsSpec)
  // Lines of a worked example, one more on every step (see `LinesSpec`).
  | ({ kind: "lines" } & LinesSpec)
  // Numbers the child taps to pick, state { i0, i1, … } (see `ChipsSpec`).
  | ({ kind: "chips" } & ChipsSpec)
  | { kind: "sticker" };

export type SpecKind = VisualSpec["kind"];

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

// Region ids of the pictures a `tapRegion` exercise taps.
export function regionsOf(spec: VisualSpec): string[] | undefined {
  return spec.kind === "lineTap" ? lineTapRegions(spec.points) : undefined;
}

// Colours of the concepts of the lesson, as the layers of a picture use them.
const NEGATIVE = "pink";
const POSITIVE = "lime";
const POINT = "amber";
const OPPOSITE = "sky";
const SMALLER = "blue";
const GREATER = "violet";

const R5 = { from: -5, to: 5 } as const;

const THERMOMETER = {
  theme: "thermometer",
  from: -5,
  to: 5,
  zero: "0 °C",
} as const;

// The ant (or any point) that walks from the origin: the point and the arrow
// of its walk come on the same step.
const WALK = (
  at: number,
  name: string,
  tag: string,
  step: number,
  color: ConceptColor = POINT,
): LineLayer[] => [
  { type: "point", at, name, color, step },
  { type: "arrow", from: 0, to: at, tag, step },
];

const ZONE_NEGATIVE = (tag: string, step: number, to = -1): LineLayer => ({
  type: "zone",
  from: -5,
  to,
  tag,
  color: NEGATIVE,
  step,
});

const ZONE_POSITIVE = (tag: string, step: number): LineLayer => ({
  type: "zone",
  from: 1,
  to: 5,
  tag,
  color: POSITIVE,
  step,
});

export const VISUAL_SPECS: Readonly<Record<string, VisualSpec>> = {
  // 1. Temperature below zero.
  "nhiet-ke-buoc": {
    kind: "scale",
    ...THERMOMETER,
    label: "Nhiệt kế: 3 độ C ở trên số 0 và âm 3 độ C ở dưới số 0",
    marks: [
      { at: 3, text: "3 °C", color: POSITIVE, step: 1 },
      { at: -3, text: "−3 °C", color: NEGATIVE, step: 2 },
    ],
    zones: [
      { side: "up", tag: "Trên 0", color: POSITIVE, step: 1 },
      { side: "down", tag: "Dưới 0", color: NEGATIVE, step: 2 },
    ],
    mode: "steps",
  },
  "nhiet-ke-tom-tat": {
    kind: "scale",
    ...THERMOMETER,
    label: "Nhiệt kế: 3 độ C ở trên số 0 và âm 3 độ C ở dưới số 0",
    marks: [
      { at: 3, text: "3 °C", color: POSITIVE },
      { at: -3, text: "−3 °C", color: NEGATIVE },
    ],
    zones: [
      { side: "up", tag: "Trên 0", color: POSITIVE },
      { side: "down", tag: "Dưới 0", color: NEGATIVE },
    ],
    mode: "still",
  },
  "chon-4-duoi-0": {
    kind: "chips",
    items: ["6", "−6", "−60", "0"],
    wants: [1],
    done: "6 độ dưới 0 viết là −6.",
  },
  "nhiet-ke-doc": {
    kind: "scale",
    ...THERMOMETER,
    level: -4,
    label: "Nhiệt kế, cột nhiệt độ dừng ở vạch thứ tư dưới số 0",
    marks: [],
    mode: "still",
  },
  "nhiet-ke-goi-y": {
    kind: "scale",
    theme: "thermometer",
    from: -3,
    to: 3,
    zero: "0 °C",
    level: -2,
    label: "Nhiệt kế khác: cột nhiệt độ dừng ở vạch thứ hai dưới số 0",
    marks: [
      { at: 2, text: "2 °C", color: POSITIVE, step: 1 },
      { at: -2, text: "?", color: NEGATIVE, step: 2 },
    ],
    zones: [
      { side: "up", tag: "Trên 0", color: POSITIVE, step: 1 },
      { side: "down", tag: "Dưới 0", color: NEGATIVE, step: 1 },
    ],
    mode: "hint",
  },
  "nhiet-ke-doc-giai": {
    kind: "scale",
    theme: "thermometer",
    from: -4,
    to: 4,
    zero: "0 °C",
    level: -4,
    label: "Nhiệt kế: cột nhiệt độ dừng ở vạch thứ tư dưới số 0, là âm 4 độ C",
    marks: [{ at: -4, text: "−4 °C", color: NEGATIVE, step: 1 }],
    zones: [{ side: "down", tag: "Dưới 0", color: NEGATIVE, step: 1 }],
    mode: "steps",
  },

  // 2. Negative numbers in daily life.
  "tang-ham": {
    kind: "scale",
    theme: "building",
    from: -3,
    to: 3,
    zero: "mặt đất",
    label: "Toà nhà: tầng 2 ở trên mặt đất, tầng hầm ở dưới mặt đất",
    marks: [
      { at: 2, text: "2 tầng", color: POSITIVE, step: 1 },
      { at: -2, text: "−2 tầng", color: NEGATIVE, step: 2 },
    ],
    zones: [
      { side: "up", tag: "Trên đất", color: POSITIVE, step: 1 },
      { side: "down", tag: "Dưới đất", color: NEGATIVE, step: 2 },
    ],
    mode: "steps",
  },
  "doi-lap": {
    kind: "rows",
    label: "Số dương và số âm cho hai điều trái ngược nhau",
    rows: [
      {
        tex: "5",
        tag: { text: "5 m trên mực nước biển", color: POSITIVE },
      },
      {
        tex: "-5",
        tag: { text: "5 m dưới mực nước biển", color: NEGATIVE },
      },
      {
        tex: "20",
        tag: { text: "Có 20 nghìn đồng", color: POSITIVE },
        gapBefore: true,
      },
      { tex: "-20", tag: { text: "Nợ 20 nghìn đồng", color: NEGATIVE } },
      {
        tex: "4",
        tag: { text: "Đi lên 4 tầng", color: POSITIVE },
        gapBefore: true,
      },
      { tex: "-4", tag: { text: "Đi xuống 4 tầng", color: NEGATIVE } },
    ],
  },
  "chon-no-50": {
    kind: "chips",
    items: ["50", "−50", "0", "−5"],
    wants: [1],
    done: "Nợ 50 nghìn đồng viết là −50.",
  },

  // 3. Positive integers, negative integers and 0.
  "duong-am-khong": {
    kind: "line",
    ...R5,
    label: "Trục số: số nguyên âm ở bên trái số 0, số nguyên dương ở bên phải",
    layers: [
      { type: "origin" },
      ZONE_NEGATIVE("Số nguyên âm", 1),
      ZONE_POSITIVE("Số nguyên dương", 2),
    ],
    mode: "steps",
  },
  "duong-am-khong-xong": {
    kind: "line",
    ...R5,
    label: "Trục số: số nguyên âm ở bên trái số 0, số nguyên dương ở bên phải",
    layers: [
      { type: "origin" },
      ZONE_NEGATIVE("Số nguyên âm", 0),
      ZONE_POSITIVE("Số nguyên dương", 0),
    ],
    mode: "still",
  },
  "chon-am-trong-day": {
    kind: "chips",
    items: ["−7", "0", "4", "−1", "12"],
    wants: [0, 3],
    done: "−7 và −1 là các số nguyên âm.",
  },

  // 4. The set of the integers.
  "z-ba-phan": {
    kind: "rows",
    label: "Tập hợp các số nguyên gồm số nguyên âm, số 0 và số nguyên dương",
    rows: [
      {
        tex: "\\concept{pink}{-3},\\ \\concept{pink}{-2},\\ \\concept{pink}{-1}",
        tag: { text: "Số nguyên âm", color: NEGATIVE },
      },
      {
        tex: "\\concept{slate}{0}",
        tag: { text: "Số 0", color: "slate" },
      },
      {
        tex: "\\concept{lime}{1},\\ \\concept{lime}{2},\\ \\concept{lime}{3}",
        tag: { text: "Số nguyên dương", color: POSITIVE },
      },
    ],
  },

  // 5. The number line.
  "truc-so-ve": {
    kind: "line",
    ...R5,
    label:
      "Trục số có gốc O ở số 0, các vạch cách đều nhau, số dương ở bên phải gốc và số âm ở bên trái",
    layers: [
      { type: "origin" },
      { type: "arrow", from: 0, to: 1, tag: "1 đơn vị", step: 1 },
      ZONE_POSITIVE("Sau gốc O", 2),
      ZONE_NEGATIVE("Trước gốc O", 3),
    ],
    mode: "steps",
  },
  "truc-so-xong": {
    kind: "line",
    ...R5,
    label:
      "Trục số có gốc O ở số 0, các vạch cách đều nhau, số dương ở bên phải gốc và số âm ở bên trái",
    layers: [
      { type: "origin" },
      { type: "arrow", from: 0, to: 1, tag: "1 đơn vị" },
      ZONE_POSITIVE("Sau gốc O", 0),
      ZONE_NEGATIVE("Trước gốc O", 0),
    ],
    mode: "still",
  },
  "dat-diem-a-am-3": {
    kind: "lineTry",
    ...R5,
    label: "Trục số, điểm A cần đặt ở số âm 3",
    names: ["A"],
    goal: [-3],
    done: "Điểm A ở −3, cách gốc O ba vạch về bên trái.",
  },
  "dat-diem-1": {
    kind: "lineTry",
    ...R5,
    label: "Trục số có một điểm A để đặt",
    names: ["A"],
  },
  "dat-diem-2": {
    kind: "lineTry",
    ...R5,
    label: "Trục số có hai điểm A và B để đặt",
    names: ["A", "B"],
  },
  "dat-diem-3": {
    kind: "lineTry",
    ...R5,
    label: "Trục số có ba điểm A, B và C để đặt",
    names: ["A", "B", "C"],
  },

  // 6. Points on the number line.
  "diem-q-p": {
    kind: "line",
    ...R5,
    label:
      "Điểm Q biểu diễn 3, cách gốc O 3 đơn vị về bên phải; điểm P biểu diễn âm 4, cách gốc O 4 đơn vị về bên trái",
    layers: [
      { type: "origin" },
      ...WALK(3, "Q", "3 đơn vị", 1),
      ...WALK(-4, "P", "4 đơn vị", 2),
    ],
    mode: "steps",
  },
  "diem-q-p-xong": {
    kind: "line",
    ...R5,
    label:
      "Điểm Q biểu diễn 3, cách gốc O 3 đơn vị về bên phải; điểm P biểu diễn âm 4, cách gốc O 4 đơn vị về bên trái",
    layers: [
      { type: "origin" },
      ...WALK(3, "Q", "3 đơn vị", 0),
      ...WALK(-4, "P", "4 đơn vị", 0),
    ],
    mode: "still",
  },
  "dat-hai-diem-p-q": {
    kind: "lineTry",
    ...R5,
    label: "Trục số, điểm P cần đặt ở số âm 3 và điểm Q ở số 2",
    names: ["P", "Q"],
    goal: [-3, 2],
    done: "P ở −3, trước gốc O. Q ở 2, sau gốc O.",
  },
  "doc-diem-mnpq": {
    kind: "line",
    from: -6,
    to: 5,
    labelAt: [0, 1],
    label:
      "Trục số từ âm 6 đến 5 với bốn điểm M, N, P, Q; chỉ số 0 và số 1 có ghi số",
    layers: [
      { type: "point", at: 4, name: "M", color: POINT, hideNumber: true },
      { type: "point", at: -2, name: "N", color: POINT, hideNumber: true },
      { type: "point", at: -6, name: "P", color: POINT, hideNumber: true },
      { type: "point", at: -5, name: "Q", color: POINT, hideNumber: true },
    ],
    mode: "still",
  },
  "doc-diem-abc": {
    kind: "line",
    ...R5,
    labelAt: [0],
    label: "Trục số từ âm 5 đến 5 với ba điểm A, B, C; chỉ số 0 có ghi số",
    layers: [
      { type: "point", at: 5, name: "A", color: POINT, hideNumber: true },
      { type: "point", at: -1, name: "B", color: POINT, hideNumber: true },
      { type: "point", at: -2, name: "C", color: POINT, hideNumber: true },
    ],
    mode: "still",
  },
  "tap-diem-abcd": {
    kind: "lineTap",
    ...R5,
    labelAt: [0],
    label: "Trục số từ âm 5 đến 5 với bốn điểm A, B, C, D; chỉ số 0 có ghi số",
    points: [
      { at: -5, name: "A" },
      { at: 5, name: "B" },
      { at: -1, name: "C" },
      { at: 4, name: "D" },
    ],
  },
  "dem-buoc": {
    kind: "line",
    ...R5,
    label: "Đếm ba bước từ gốc O sang trái tới điểm P, được số âm 3",
    layers: [{ type: "origin" }, ...WALK(-3, "P", "3 bước", 0)],
    mode: "still",
  },
  "doc-diem-giai": {
    kind: "line",
    from: -6,
    to: 5,
    label: "Điểm N cách gốc O hai đơn vị về bên trái, nên N biểu diễn số âm 2",
    layers: [
      { type: "origin" },
      { type: "point", at: -2, name: "N", color: POINT, step: 1 },
      { type: "arrow", from: 0, to: -2, tag: "2 đơn vị", step: 1 },
    ],
    mode: "steps",
  },

  // 7. Opposite numbers.
  "kien-4": {
    kind: "line",
    ...R5,
    label:
      "Con kiến đi 4 vạch sang phải từ gốc O dừng ở 4; đi 4 vạch sang trái dừng ở âm 4",
    layers: [
      { type: "origin" },
      ...WALK(4, "A", "4 vạch", 1),
      ...WALK(-4, "B", "4 vạch", 2),
    ],
    mode: "steps",
  },
  "so-doi-5": {
    kind: "line",
    ...R5,
    label:
      "Số 5 và số âm 5 cách đều gốc O 5 đơn vị, ở hai bên gốc: hai số đối nhau",
    layers: [
      { type: "origin" },
      ...WALK(5, "A", "5 đơn vị", 0, OPPOSITE),
      ...WALK(-5, "B", "5 đơn vị", 0, OPPOSITE),
    ],
    mode: "still",
  },
  "chon-doi-6": {
    kind: "chips",
    items: ["6", "−6", "0", "−16"],
    wants: [1],
    done: "Số đối của 6 là −6.",
  },

  // 8. Comparing on the number line.
  "so-sanh-buoc": {
    kind: "line",
    ...R5,
    label:
      "Điểm A ở âm 3 nằm trước điểm B ở 2, nên âm 3 nhỏ hơn 2; đi sang phải thì số lớn dần",
    layers: [
      { type: "point", at: -3, name: "A", color: POINT, step: 0 },
      { type: "point", at: 2, name: "B", color: POINT, step: 1 },
      {
        type: "arrow",
        from: -3,
        to: 2,
        tag: "sang phải: lớn dần",
        step: 2,
      },
    ],
    mode: "steps",
  },
  "so-sanh-xong": {
    kind: "line",
    ...R5,
    label:
      "Điểm A ở âm 3 nằm trước điểm B ở 2, nên âm 3 nhỏ hơn 2; đi sang phải thì số lớn dần",
    layers: [
      { type: "point", at: -3, name: "A", color: POINT },
      { type: "point", at: 2, name: "B", color: POINT },
      { type: "arrow", from: -3, to: 2, tag: "sang phải: lớn dần" },
    ],
    mode: "still",
  },
  "chon-lon-hon-am-2": {
    kind: "chips",
    items: ["−5", "−3", "1", "−4"],
    wants: [2],
    done: "1 nằm sau −2 trên trục số nên 1 lớn hơn −2.",
  },
  "so-sanh-ab": {
    kind: "line",
    ...R5,
    label: "Trục số có điểm A ở âm 4 và điểm B ở âm 1",
    layers: [
      { type: "point", at: -4, name: "A", color: POINT },
      { type: "point", at: -1, name: "B", color: POINT },
    ],
    mode: "still",
  },

  // 9. Negative numbers, 0 and positive numbers.
  "am-0-duong": {
    kind: "line",
    ...R5,
    label: "Âm 4 nằm trước số 0 nên nhỏ hơn 0; số 0 nằm trước 3 nên nhỏ hơn 3",
    layers: [
      { type: "origin" },
      { type: "point", at: -4, color: SMALLER, step: 1 },
      {
        type: "arrow",
        from: -4,
        to: 0,
        tag: "−4 < 0",
        color: SMALLER,
        step: 1,
      },
      { type: "point", at: 3, color: GREATER, step: 2 },
      { type: "arrow", from: 0, to: 3, tag: "0 < 3", color: GREATER, step: 2 },
    ],
    mode: "steps",
  },
  "am-0-duong-xong": {
    kind: "line",
    ...R5,
    label: "Âm 4 nằm trước số 0 nên nhỏ hơn 0; số 0 nằm trước 3 nên nhỏ hơn 3",
    layers: [
      { type: "origin" },
      { type: "point", at: -4, color: SMALLER },
      { type: "arrow", from: -4, to: 0, tag: "−4 < 0", color: SMALLER },
      { type: "point", at: 3, color: GREATER },
      { type: "arrow", from: 0, to: 3, tag: "0 < 3", color: GREATER },
    ],
    mode: "still",
  },
  "chon-nho-hon-0": {
    kind: "chips",
    items: ["5", "−5", "0", "12"],
    wants: [1],
    done: "−5 nhỏ hơn 0.",
  },

  // 10. Comparing two negative numbers.
  "lanh-hon": {
    kind: "scale",
    theme: "thermometer",
    from: -8,
    to: 2,
    zero: "0 °C",
    level: -7,
    label: "Nhiệt kế: âm 7 độ C ở thấp hơn âm 2 độ C, nên lạnh hơn",
    marks: [
      { at: -2, text: "−2 °C", color: GREATER, step: 1 },
      { at: -7, text: "−7 °C", color: SMALLER, step: 2 },
    ],
    zones: [{ side: "down", tag: "Lạnh hơn", color: NEGATIVE, step: 2 }],
    mode: "steps",
  },
  "lanh-hon-xong": {
    kind: "scale",
    theme: "thermometer",
    from: -8,
    to: 2,
    zero: "0 °C",
    level: -7,
    label: "Nhiệt kế: âm 7 độ C ở thấp hơn âm 2 độ C, nên lạnh hơn",
    marks: [
      { at: -2, text: "−2 °C", color: GREATER },
      { at: -7, text: "−7 °C", color: SMALLER },
    ],
    zones: [{ side: "down", tag: "Lạnh hơn", color: NEGATIVE }],
    mode: "still",
  },
  "bo-dau": {
    kind: "lines",
    label: "Bỏ dấu trừ để so sánh 7 với 2, rồi đổi chiều dấu khi so sánh số âm",
    rows: [
      {
        tex: "\\concept{violet}{7} > \\concept{blue}{2}",
        tag: { text: "7 lớn hơn 2", color: GREATER },
      },
      {
        tex: "\\concept{blue}{-7} < \\concept{violet}{-2}",
        tag: { text: "−7 nhỏ hơn −2", color: SMALLER },
      },
    ],
    mode: "steps",
  },
  "bo-dau-xong": {
    kind: "lines",
    label: "Bỏ dấu trừ để so sánh 7 với 2, rồi đổi chiều dấu khi so sánh số âm",
    rows: [
      {
        tex: "\\concept{violet}{7} > \\concept{blue}{2}",
        tag: { text: "7 lớn hơn 2", color: GREATER },
      },
      {
        tex: "\\concept{blue}{-7} < \\concept{violet}{-2}",
        tag: { text: "−7 nhỏ hơn −2", color: SMALLER },
      },
    ],
    mode: "still",
  },
  "chon-nho-hon-am-4": {
    kind: "chips",
    items: ["−1", "−6", "−3", "0"],
    wants: [1],
    done: "−6 nhỏ hơn −4, vì 6 lớn hơn 4.",
  },

  // 11. Ordering and listing.
  "xep-hang": {
    kind: "line",
    ...R5,
    labelAt: [0],
    label:
      "Bốn điểm trên trục số theo thứ tự từ trái sang phải: âm 4, âm 1, 2 và 4, các số lớn dần",
    layers: [
      { type: "point", at: -4, color: POINT, step: 0 },
      { type: "point", at: -1, color: POINT, step: 1 },
      { type: "point", at: 2, color: POINT, step: 2 },
      { type: "point", at: 4, color: POINT, step: 3 },
    ],
    mode: "steps",
  },
  "xep-hang-xong": {
    kind: "line",
    ...R5,
    labelAt: [0],
    label:
      "Bốn điểm trên trục số theo thứ tự từ trái sang phải: âm 4, âm 1, 2 và 4, các số lớn dần",
    layers: [
      { type: "point", at: -4, color: POINT },
      { type: "point", at: -1, color: POINT },
      { type: "point", at: 2, color: POINT },
      { type: "point", at: 4, color: POINT },
    ],
    mode: "still",
  },
  "nho-hon-hoac-bang": {
    kind: "rows",
    label: "Ba cách dùng dấu nhỏ hơn hoặc bằng và lớn hơn hoặc bằng",
    rows: [{ tex: "-2 \\le 4" }, { tex: "5 \\le 5" }, { tex: "3 \\ge -1" }],
  },
  "chon-khoang": {
    kind: "chips",
    items: ["−3", "−2", "−1", "0", "1", "2"],
    wants: [2, 3, 4],
    done: "Các số nguyên x là −1, 0 và 1.",
  },

  sticker: { kind: "sticker" },
};
