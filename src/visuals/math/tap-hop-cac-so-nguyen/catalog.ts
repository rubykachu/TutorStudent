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

// The line of the workbook exercise on reading points (Hình 3.1).
const SBT_FIGURE_RANGE = { from: -8, to: 3 } as const;

const THERMOMETER = {
  theme: "thermometer",
  from: -5,
  to: 5,
  zero: "0 °C",
} as const;

// The ant (or any point) that walks from the origin: the point and the arrow
// of its walk come on the same step.
// A coloured arrow is written with a plain tag, so the concept's marker (a
// cross for opposite numbers) is not drawn in front of the words.
const WALK = (
  at: number,
  name: string,
  tag: string,
  step: number,
  color: ConceptColor = POINT,
  arrowColor?: ConceptColor,
): LineLayer[] => [
  { type: "point", at, name, color, step },
  {
    type: "arrow",
    from: 0,
    to: at,
    tag,
    step,
    ...(arrowColor ? { color: arrowColor, plainTag: true } : {}),
  },
];

// Three temperatures, one from each group of the integers.
const TEMPERATURE_GROUPS = [
  {
    tex: "\\concept{lime}{4}",
    tag: { text: "Trên 0: số nguyên dương", color: POSITIVE },
  },
  {
    tex: "\\concept{slate}{0}",
    tag: { text: "Đúng 0: số 0", color: "slate" },
  },
  {
    tex: "\\concept{pink}{-2}",
    tag: { text: "Dưới 0: số nguyên âm", color: NEGATIVE },
  },
] as const;

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
  // The column moves: it stands at 3, then goes down to −3, and each reading
  // is written beside the top of the column.
  "nhiet-ke-buoc": {
    kind: "scale",
    ...THERMOMETER,
    label:
      "Nhiệt kế: cột nhiệt độ dừng ở 3 thì nhiệt kế chỉ 3 độ C, hạ xuống dưới số 0 ba đơn vị thì chỉ âm 3 độ C",
    levelSteps: [
      { level: 3, step: 1 },
      { level: -3, step: 2 },
    ],
    marks: [
      { at: 3, text: "3 °C", color: POSITIVE, step: 1, until: 1 },
      { at: -3, text: "−3 °C", color: NEGATIVE, step: 2 },
    ],
    zones: [
      { side: "up", tag: "Trên 0", color: POSITIVE, step: 1, until: 1 },
      { side: "down", tag: "Dưới 0", color: NEGATIVE, step: 2 },
    ],
    mode: "steps",
  },
  "nhiet-ke-tom-tat": {
    kind: "scale",
    ...THERMOMETER,
    level: -3,
    label: "Nhiệt kế: cột nhiệt độ dừng ở dưới số 0 ba đơn vị, chỉ âm 3 độ C",
    marks: [{ at: -3, text: "−3 °C", color: NEGATIVE }],
    zones: [{ side: "down", tag: "Dưới 0", color: NEGATIVE }],
    mode: "still",
  },
  "chon-6-duoi-0": {
    kind: "chips",
    items: ["6", "−6", "−60", "0"],
    wants: [1],
    done: "6 độ dưới 0 viết là −6.",
  },
  "nhiet-ke-doc": {
    kind: "scale",
    ...THERMOMETER,
    level: -4,
    label: "Nhiệt kế, cột nhiệt độ dừng ở dưới số 0 bốn đơn vị",
    marks: [],
    mode: "still",
  },
  "nhiet-ke-goi-y": {
    kind: "scale",
    theme: "thermometer",
    from: -3,
    to: 2,
    zero: "0 °C",
    level: -2,
    label: "Nhiệt kế khác: cột nhiệt độ dừng ở dưới số 0 hai đơn vị",
    // The hint stops before its last step: the "?" is the question the
    // child sees, and the reading on the last step is the answer it hides.
    marks: [
      { at: -2, text: "?", color: NEGATIVE, step: 1 },
      { at: -2, text: "−2 °C", color: NEGATIVE, step: 2 },
    ],
    zones: [
      { side: "up", tag: "Trên 0", color: POSITIVE, step: 1 },
      { side: "down", tag: "Dưới 0", color: NEGATIVE, step: 1 },
    ],
    mode: "hint",
  },
  "nhiet-ke-doc-giai": {
    kind: "scale",
    ...THERMOMETER,
    level: -4,
    label: "Nhiệt kế: cột nhiệt độ dừng ở dưới số 0 bốn đơn vị, là âm 4 độ C",
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
      { at: 2, text: "Tầng 2", color: POSITIVE, step: 1 },
      { at: -2, text: "Tầng −2", color: NEGATIVE, step: 2 },
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
    kind: "lines",
    label:
      "Ba nhiệt độ ở ba nhóm số: 4 độ C là số nguyên dương, 0 độ C là số 0, âm 2 độ C là số nguyên âm",
    rows: TEMPERATURE_GROUPS,
    mode: "steps",
  },
  "duong-am-khong-xong": {
    kind: "lines",
    label:
      "Ba nhiệt độ ở ba nhóm số: 4 độ C là số nguyên dương, 0 độ C là số 0, âm 2 độ C là số nguyên âm",
    rows: TEMPERATURE_GROUPS,
    mode: "still",
  },
  "chon-am-trong-day": {
    kind: "chips",
    items: ["−7", "0", "4", "−1", "12"],
    wants: [0, 3],
    done: "−7 và −1 là các số nguyên âm.",
  },

  // 4. The set of the integers.
  "chon-nguyen-khong-tu-nhien": {
    kind: "chips",
    items: ["9", "−2", "0", "14"],
    wants: [1],
    done: "−2 là số nguyên nhưng không phải số tự nhiên.",
  },
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
    done: "Điểm A ở −3, cách gốc O 3 đơn vị về bên trái.",
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
      "Điểm Q biểu diễn 3, cách gốc O 3 đơn vị về bên phải; điểm P biểu diễn âm 3, cách gốc O 3 đơn vị về bên trái",
    layers: [
      { type: "origin" },
      ...WALK(3, "Q", "3 đơn vị", 1),
      ...WALK(-3, "P", "3 đơn vị", 2),
    ],
    mode: "steps",
  },
  "diem-q-p-xong": {
    kind: "line",
    ...R5,
    label:
      "Điểm Q biểu diễn 3, cách gốc O 3 đơn vị về bên phải; điểm P biểu diễn âm 3, cách gốc O 3 đơn vị về bên trái",
    layers: [
      { type: "origin" },
      ...WALK(3, "Q", "3 đơn vị", 0),
      ...WALK(-3, "P", "3 đơn vị", 0),
    ],
    mode: "still",
  },
  "dat-hai-diem-c-d": {
    kind: "lineTry",
    ...R5,
    label: "Trục số, điểm C cần đặt ở số âm 4 và điểm D ở số 2",
    names: ["C", "D"],
    goal: [-4, 2],
    done: "C ở −4, trước gốc O. D ở 2, sau gốc O.",
  },
  "doc-diem-mnp": {
    kind: "line",
    ...R5,
    labelAt: [0, 1],
    label:
      "Trục số từ âm 5 đến 5 với ba điểm M, N, P; chỉ số 0 và số 1 có ghi số",
    layers: [
      { type: "point", at: 4, name: "M", color: POINT, hideNumber: true },
      { type: "point", at: -2, name: "N", color: POINT, hideNumber: true },
      { type: "point", at: -5, name: "P", color: POINT, hideNumber: true },
    ],
    mode: "still",
  },
  "doc-diem-ef": {
    kind: "line",
    ...R5,
    labelAt: [0],
    label: "Trục số từ âm 5 đến 5 với hai điểm E, F; chỉ số 0 có ghi số",
    layers: [
      { type: "point", at: 2, name: "E", color: POINT, hideNumber: true },
      { type: "point", at: -4, name: "F", color: POINT, hideNumber: true },
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
  // Reading a point of a line that carries no numbers: one arrow per unit
  // counted from O, then the number the count gives.
  "dem-buoc": {
    kind: "line",
    ...R5,
    labelAt: [0],
    label:
      "Đếm từng đơn vị từ gốc O sang trái tới điểm R: năm đơn vị, nên R biểu diễn số âm 5",
    layers: [
      { type: "origin" },
      { type: "point", at: -5, name: "R", color: POINT, hideNumber: true },
      { type: "arrow", from: 0, to: -1, tag: "1", step: 1 },
      { type: "arrow", from: -1, to: -2, tag: "2", step: 2 },
      { type: "arrow", from: -2, to: -3, tag: "3", step: 3 },
      { type: "arrow", from: -3, to: -4, tag: "4", step: 4 },
      { type: "arrow", from: -4, to: -5, tag: "5", step: 5 },
      { type: "point", at: -5, color: POINT, step: 6 },
    ],
    mode: "steps",
  },
  "doc-diem-giai": {
    kind: "line",
    ...R5,
    label: "Điểm N cách gốc O hai đơn vị về bên trái, nên N biểu diễn số âm 2",
    layers: [
      { type: "origin" },
      { type: "point", at: -2, name: "N", color: POINT, step: 1 },
      { type: "arrow", from: 0, to: -2, tag: "2 đơn vị", step: 1 },
    ],
    mode: "steps",
  },

  "muc-nuoc-tau-ngam": {
    kind: "scale",
    theme: "sea",
    from: -4,
    to: 3,
    zero: "mực nước biển",
    label:
      "Thước đo độ cao so với mực nước biển, có một tàu ngầm ở dưới mực nước biển hai đơn vị",
    marks: [{ at: -2, text: "Tàu ngầm", color: POINT }],
    mode: "still",
  },

  // 7. Opposite numbers.
  "kien-4": {
    kind: "line",
    ...R5,
    label:
      "Con kiến đi 4 đơn vị sang phải từ gốc O dừng ở 4; đi 4 đơn vị sang trái dừng ở âm 4",
    layers: [
      { type: "origin" },
      ...WALK(4, "Kiến", "4 đơn vị", 1),
      ...WALK(-4, "Kiến", "4 đơn vị", 2),
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
      ...WALK(5, "A", "5 đơn vị", 0, POINT, OPPOSITE),
      ...WALK(-5, "B", "5 đơn vị", 0, POINT, OPPOSITE),
    ],
    mode: "still",
  },
  "chon-doi-3-truc": {
    kind: "line",
    ...R5,
    label: "Trục số có điểm biểu diễn số 3",
    layers: [{ type: "origin" }, { type: "point", at: 3, color: POINT }],
    mode: "still",
  },
  "chon-doi-3": {
    kind: "chips",
    items: ["3", "−3", "0", "−2"],
    wants: [1],
    done: "Số đối của 3 là −3.",
  },

  // 8. Comparing on the number line.
  "so-sanh-buoc": {
    kind: "line",
    ...R5,
    label:
      "Điểm A ở âm 3 nằm trước điểm B ở 2, nên âm 3 nhỏ hơn 2; đi sang phải thì số lớn dần",
    layers: [
      { type: "origin" },
      { type: "point", at: -3, name: "A", color: SMALLER, step: 0 },
      { type: "point", at: 2, name: "B", color: GREATER, step: 1 },
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
      { type: "origin" },
      { type: "point", at: -3, name: "A", color: SMALLER },
      { type: "point", at: 2, name: "B", color: GREATER },
      { type: "arrow", from: -3, to: 2, tag: "sang phải: lớn dần" },
    ],
    mode: "still",
  },
  "chon-lon-hon-am-2-truc": {
    kind: "line",
    ...R5,
    label: "Trục số có điểm biểu diễn số âm 2",
    layers: [{ type: "origin" }, { type: "point", at: -2, color: POINT }],
    mode: "still",
  },
  "chon-lon-hon-am-2": {
    kind: "chips",
    items: ["−5", "−1", "−4", "−3"],
    wants: [1],
    done: "−1 nằm sau −2 trên trục số nên −1 lớn hơn −2.",
  },
  // The bare line of the pick screens that ask the child to compare on it.
  "truc-so-tron": {
    kind: "line",
    ...R5,
    label: "Trục số từ âm 5 đến 5",
    layers: [{ type: "origin" }],
    mode: "still",
  },
  "so-sanh-ab": {
    kind: "line",
    ...R5,
    labelAt: [0],
    label: "Trục số có điểm A ở âm 4 và điểm B ở âm 1; chỉ số 0 có ghi số",
    layers: [
      { type: "origin" },
      { type: "point", at: -4, name: "A", color: POINT, hideNumber: true },
      { type: "point", at: -1, name: "B", color: POINT, hideNumber: true },
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
    to: 0,
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

  // 12. Workbook exercises (the book-practice section).
  // The figure of the exercise on reading four points: a line from −8 to 3
  // with only 0 and 1 numbered and an arrow at the positive end.
  "sbt-hinh-diem": {
    kind: "line",
    ...SBT_FIGURE_RANGE,
    arrows: "positive",
    labelAt: [0, 1],
    label:
      "Trục số từ âm 8 đến 3 với bốn điểm M, N, P, Q; chỉ số 0 và số 1 có ghi số",
    layers: [
      { type: "origin" },
      { type: "point", at: 2, name: "M", color: POINT, hideNumber: true },
      { type: "point", at: -5, name: "N", color: POINT, hideNumber: true },
      { type: "point", at: -8, name: "P", color: POINT, hideNumber: true },
      { type: "point", at: -3, name: "Q", color: POINT, hideNumber: true },
    ],
    mode: "still",
  },
  // Solution: the distance of each point from O, then its number.
  "sbt-hinh-diem-giai": {
    kind: "line",
    ...SBT_FIGURE_RANGE,
    arrows: "positive",
    labelAt: [0, 1],
    label:
      "M cách gốc O 2 đơn vị về bên phải nên biểu diễn 2; Q, N, P cách gốc O 3, 5, 8 đơn vị về bên trái nên biểu diễn âm 3, âm 5, âm 8",
    layers: [
      { type: "origin" },
      { type: "point", at: 2, name: "M", color: POINT, step: 1 },
      { type: "arrow", from: 0, to: 2, tag: "2 đơn vị", step: 1 },
      { type: "point", at: -3, name: "Q", color: POINT, step: 2 },
      { type: "arrow", from: 0, to: -3, tag: "3 đơn vị", row: 1, step: 2 },
      { type: "point", at: -5, name: "N", color: POINT, step: 3 },
      { type: "arrow", from: 0, to: -5, tag: "5 đơn vị", step: 3 },
      { type: "point", at: -8, name: "P", color: POINT, step: 4 },
      { type: "arrow", from: 0, to: -8, tag: "8 đơn vị", row: 2, step: 4 },
    ],
    mode: "steps",
  },
  // Lead-in screens of the reading-points exercise: one point on the same
  // kind of line, with other numbers.
  "sbt-dan-diem-k": {
    kind: "line",
    ...SBT_FIGURE_RANGE,
    arrows: "positive",
    labelAt: [0, 1],
    label: "Trục số từ âm 8 đến 3 với điểm K; chỉ số 0 và số 1 có ghi số",
    layers: [
      { type: "origin" },
      { type: "point", at: -4, name: "K", color: POINT, hideNumber: true },
    ],
    mode: "still",
  },
  "sbt-dan-diem-s": {
    kind: "line",
    ...SBT_FIGURE_RANGE,
    arrows: "positive",
    labelAt: [0, 1],
    label: "Trục số từ âm 8 đến 3 với điểm S; chỉ số 0 và số 1 có ghi số",
    layers: [
      { type: "origin" },
      { type: "point", at: -7, name: "S", color: POINT, hideNumber: true },
    ],
    mode: "still",
  },
  // The exercise on marking six numbers on one line: every point carries the
  // number it must reach.
  "sbt-dat-sau-diem": {
    kind: "lineTry",
    from: -6,
    to: 6,
    label: "Trục số từ âm 6 đến 6, sáu điểm để đặt, mỗi điểm mang số cần đặt",
    names: ["4", "−4", "−6", "6", "−1", "1"],
  },
  // Hint of that exercise: from O, n units to the right reach n; stop before
  // the point on the left.
  "sbt-dat-sau-diem-goi-y": {
    kind: "line",
    from: -6,
    to: 6,
    label:
      "Từ gốc O đi sang phải 5 đơn vị thì tới số 5; đi sang trái 5 đơn vị thì tới số âm 5",
    layers: [
      { type: "origin" },
      ...WALK(5, "C", "5 đơn vị", 1),
      ...WALK(-5, "D", "5 đơn vị", 2),
    ],
    mode: "hint",
  },
  // The recall block and the recap of the section: 3 and −3 reached from O,
  // on points named so they never share a letter with Hình 3.1.
  "sbt-nhac-lai-diem": {
    kind: "line",
    ...R5,
    label:
      "Điểm U biểu diễn 3, cách gốc O 3 đơn vị về bên phải; điểm V biểu diễn âm 3, cách gốc O 3 đơn vị về bên trái",
    layers: [
      { type: "origin" },
      ...WALK(3, "U", "3 đơn vị", 1),
      ...WALK(-3, "V", "3 đơn vị", 2),
    ],
    mode: "steps",
  },
  "sbt-nhac-lai-diem-xong": {
    kind: "line",
    ...R5,
    label:
      "Điểm U biểu diễn 3, cách gốc O 3 đơn vị về bên phải; điểm V biểu diễn âm 3, cách gốc O 3 đơn vị về bên trái",
    layers: [
      { type: "origin" },
      ...WALK(3, "U", "3 đơn vị", 0),
      ...WALK(-3, "V", "3 đơn vị", 0),
    ],
    mode: "still",
  },
  // The ant of the exercise on a walk of 16 units: the solution says the two
  // facts in words.
  "sbt-kien-phai-giai": {
    kind: "lines",
    label:
      "Chiều dương là sang phải nên đi 16 đơn vị tới số dương; con kiến dừng ở điểm 16",
    rows: [
      {
        tex: "",
        tag: {
          text: "Chiều dương: đi sang phải, tới số dương",
          color: POSITIVE,
        },
      },
      {
        tex: "16",
        tag: { text: "Con kiến dừng ở điểm 16", color: POSITIVE },
      },
    ],
    mode: "steps",
  },
  "sbt-kien-trai-giai": {
    kind: "lines",
    label:
      "Chiều âm là sang trái nên đi 16 đơn vị tới số âm; con kiến dừng ở điểm âm 16",
    rows: [
      {
        tex: "",
        tag: { text: "Chiều âm: đi sang trái, tới số âm", color: NEGATIVE },
      },
      {
        tex: "-16",
        tag: { text: "Con kiến dừng ở điểm −16", color: NEGATIVE },
      },
    ],
    mode: "steps",
  },
  // Rewording exercises: a negative number said without the minus sign. The
  // hint does the same with other numbers and stops before the result.
  "sbt-do-cao-goi-y": {
    kind: "lines",
    label: "Âm 20 mét là 20 mét dưới mực nước biển",
    rows: [
      {
        tex: "-20",
        tag: { text: "Số âm: dưới mực nước biển", color: NEGATIVE },
      },
      {
        tex: "20",
        tag: { text: "20 m dưới mực nước biển", color: NEGATIVE },
      },
    ],
    mode: "hint",
  },
  "sbt-do-cao-giai": {
    kind: "lines",
    label: "Âm 65 mét là 65 mét dưới mực nước biển",
    rows: [
      {
        tex: "-65",
        tag: { text: "Số âm: dưới mực nước biển", color: NEGATIVE },
      },
      {
        tex: "65",
        tag: { text: "65 m dưới mực nước biển", color: NEGATIVE },
      },
    ],
    mode: "steps",
  },
  "sbt-so-du-goi-y": {
    kind: "lines",
    label:
      "Âm 40 nghìn đồng là số dư giảm 40 nghìn đồng, tức rút 40 nghìn đồng",
    rows: [
      {
        tex: "-40\\,000",
        tag: { text: "Số âm: số dư giảm", color: NEGATIVE },
      },
      {
        tex: "40\\,000",
        tag: { text: "Rút 40 000 đồng", color: NEGATIVE },
      },
    ],
    mode: "hint",
  },
  "sbt-so-du-giai": {
    kind: "lines",
    label:
      "Âm 210 800 đồng là số dư giảm 210 800 đồng, tức ông Tám đã rút 210 800 đồng",
    rows: [
      {
        tex: "-210\\,800",
        tag: { text: "Số âm: số dư giảm", color: NEGATIVE },
      },
      {
        tex: "210\\,800",
        tag: { text: "Rút 210 800 đồng", color: NEGATIVE },
      },
    ],
    mode: "steps",
  },
  // Listing exercise: first the numbers of the range, then the ones that end
  // in the wanted digit.
  "sbt-liet-ke-goi-y": {
    kind: "lines",
    label:
      "Trong khoảng lớn hơn âm 8 và nhỏ hơn hoặc bằng 13, các số tận cùng là 3 là âm 3, 3 và 13",
    rows: [
      {
        tex: "-8 < x \\le 13",
        tag: { text: "Bước 1: x chạy từ −7 tới 13", color: "teal" },
      },
      {
        tex: "-3;\\ 3;\\ 13",
        tag: { text: "Bước 2: giữ các số tận cùng là 3", color: "teal" },
      },
    ],
    mode: "hint",
  },
  "sbt-liet-ke-giai": {
    kind: "lines",
    label:
      "Trong khoảng lớn hơn âm 15 và nhỏ hơn hoặc bằng 32, các số tận cùng là 2 là âm 12, âm 2, 2, 12, 22 và 32",
    rows: [
      {
        tex: "-15 < x \\le 32",
        tag: { text: "Bước 1: x chạy từ −14 tới 32", color: "teal" },
      },
      {
        tex: "-12;\\ -2;\\ 2;\\ 12;\\ 22;\\ 32",
        tag: { text: "Bước 2: giữ các số tận cùng là 2", color: "teal" },
      },
    ],
    mode: "steps",
  },
  // Comparing two negative numbers of five digits: drop the minus signs,
  // compare, then turn the sign around.
  "sbt-so-sanh-goi-y": {
    kind: "lines",
    label: "Bỏ dấu trừ để so 8 215 với 8 125 rồi đổi chiều dấu cho hai số âm",
    rows: [
      {
        tex: "\\concept{violet}{8\\,215} > \\concept{blue}{8\\,125}",
        tag: { text: "Bỏ dấu −: 8 215 lớn hơn 8 125", color: GREATER },
      },
      {
        tex: "\\concept{blue}{-8\\,215} < \\concept{violet}{-8\\,125}",
        tag: { text: "−8 215 nhỏ hơn −8 125", color: SMALLER },
      },
    ],
    mode: "hint",
  },
  "sbt-so-sanh-giai": {
    kind: "lines",
    label: "Bỏ dấu trừ: 46 789 lớn hơn 45 999, nên âm 46 789 nhỏ hơn âm 45 999",
    rows: [
      {
        tex: "\\concept{violet}{46\\,789} > \\concept{blue}{45\\,999}",
        tag: { text: "Bỏ dấu −: 46 789 lớn hơn 45 999", color: GREATER },
      },
      {
        tex: "\\concept{blue}{-46\\,789} < \\concept{violet}{-45\\,999}",
        tag: { text: "−46 789 nhỏ hơn −45 999", color: SMALLER },
      },
    ],
    mode: "steps",
  },

  sticker: { kind: "sticker" },
};
