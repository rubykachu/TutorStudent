import type { ConceptColor } from "@/schema/content";
import type { LinesSpec, Row, RowsSpec } from "@/visuals/shared/formula-rows";
import type { LineLayer, NumberLineSpec } from "@/visuals/shared/number-line";
import type { HopTrySpec } from "./hop-try";
import { hopRange, labelsFor, positionsOf } from "./logic";

// Every picture of the lesson that is drawn from numbers: the registry builds
// one entry per item (id `phep-cong-phep-tru-so-nguyen.visual.<key>`), so a
// new example is one item here and its id in lesson.json. Pure data, no
// React, so `content:check` reads it.

export { LESSON_SLUG } from "./logic";

export type VisualSpec =
  // The number line, layer by layer: a walk of hops (see `NumberLineSpec`).
  | ({ kind: "line" } & NumberLineSpec)
  // Hands-on: the child walks one point along the line, state { p0 } (see
  // `HopTrySpec`).
  | ({ kind: "hopTry" } & HopTrySpec)
  // Formulas stacked, each with an optional tag (see `RowsSpec`).
  | ({ kind: "rows" } & RowsSpec)
  // Lines of a worked example, one more on every step (see `LinesSpec`).
  | ({ kind: "lines" } & LinesSpec)
  | { kind: "sticker" };

export type SpecKind = VisualSpec["kind"];

// Kinds the child acts on (counted as interactive by `--stats`).
export const INTERACTIVE_KINDS: ReadonlySet<SpecKind> = new Set(["hopTry"]);

// Validator id of the `manipulate` exercises each interactive kind serves:
// the point-placing validator of the lesson on the integers.
export const VALIDATOR_IDS = { hopTry: "dat-diem" } as const;

// Colours of the concepts of the lesson, as the layers of a picture use them.
const POSITIVE = "lime";
const NEGATIVE = "pink";
const ZERO = "slate";
const OPPOSITE = "sky";
const FIRST = "blue";
const SUM = "amber";
const DIFFERENCE = "teal";

type Mode = "steps" | "hint" | "still";

const word = (hop: number) =>
  hop > 0 ? `sang phải ${hop}` : `sang trái ${-hop}`;

const signOf = (hop: number): ConceptColor => (hop > 0 ? POSITIVE : NEGATIVE);

const MINUS = "−";
const written = (value: number) =>
  value < 0 ? `${MINUS}${-value}` : `${value}`;

// A walk along the line: the start, then each hop as an arrow (green right,
// pink left, tagged with the way and the length) followed by the point it
// reaches. The last point is the result (`result` colour); a hint stops
// before it. Arrows that would overlap sit on different rows.
function walk(
  start: number,
  hops: readonly number[],
  result: ConceptColor,
  mode: Mode = "steps",
): VisualSpec {
  const positions = positionsOf(start, hops);
  const range = hopRange(positions);
  const layers: LineLayer[] = [];
  if (start !== 0) layers.push({ type: "origin", step: 0 });
  layers.push({ type: "point", at: start, color: FIRST, step: 0 });
  const spans: { low: number; high: number; row: number }[] = [];
  hops.forEach((hop, i) => {
    const from = positions[i] ?? start;
    const to = positions[i + 1] ?? from;
    const low = Math.min(from, to);
    const high = Math.max(from, to);
    let row = 0;
    while (spans.some((s) => s.row === row && s.low < high && low < s.high)) {
      row++;
    }
    spans.push({ low, high, row });
    const last = i === hops.length - 1;
    layers.push({
      type: "arrow",
      from,
      to,
      tag: word(hop),
      color: signOf(hop),
      row,
      step: 2 * i + 1,
    });
    layers.push({
      type: "point",
      at: to,
      color: last ? result : FIRST,
      step: 2 * i + 2,
    });
  });
  const marked = positions;
  const labelAt = labelsFor(range, marked);
  return {
    kind: "line",
    ...range,
    ...(labelAt ? { labelAt } : {}),
    label: `Trục số: bắt đầu ở ${written(start)}, ${hops
      .map((hop) => word(hop))
      .join(", rồi ")}${
      mode === "hint"
        ? ""
        : `, tới ${written(positions[positions.length - 1] ?? start)}`
    }`,
    layers,
    mode,
  };
}

// The child's own walk: the point starts on `start` and must reach `goal` on
// a lesson screen.
const TRY_REACH = 6;
function tryWalk(start: number, goal?: number, done?: string): VisualSpec {
  return {
    kind: "hopTry",
    from: -TRY_REACH,
    to: TRY_REACH,
    label: "Trục số, bấm mũi tên để đưa điểm đi",
    start,
    ...(goal === undefined ? {} : { goal }),
    ...(done === undefined ? {} : { done }),
  };
}

const rows = (
  label: string,
  items: readonly Row[],
  legend?: RowsSpec["legend"],
): VisualSpec => ({
  kind: "rows",
  label,
  rows: items,
  ...(legend ? { legend } : {}),
});

const lines = (
  label: string,
  items: readonly Row[],
  mode: LinesSpec["mode"],
): VisualSpec => ({ kind: "lines", label, rows: items, mode });

const tag = (text: string, color: ConceptColor) => ({ text, color });

// A worked step on two lines, so a long chain of equalities never breaks in
// the middle of a bracket on a narrow screen.
const steps = (first: string, second: string) =>
  `\\begin{gathered} ${first} \\\\ ${second} \\end{gathered}`;

const LEGEND_SIGNS = [
  { color: NEGATIVE, name: "Số nguyên âm" },
  { color: POSITIVE, name: "Số nguyên dương" },
] as const;

// Worked example: pair the opposite numbers first, then add the rest.
const PAIR_ROWS = [
  { tex: "8 + (-3) + (-8) + 5" },
  { tex: "= 8 + (-8) + (-3) + 5", tag: tag("đổi chỗ các số", FIRST) },
  {
    tex: "= [8 + (-8)] + [(-3) + 5]",
    tag: tag("nhóm cặp số đối nhau", OPPOSITE),
  },
  { tex: "= \\concept{slate}{0} + \\concept{lime}{2}" },
  { tex: "= \\concept{lime}{2}", tag: tag("kết quả", SUM) },
] as const satisfies readonly Row[];

// A = x + (-4) - 6 for x = 12.
const VALUE_ROWS = [
  { tex: "A = 12 + (-4) - 6", tag: tag("thay x bằng 12", FIRST) },
  { tex: "= 8 - 6" },
  { tex: "= \\concept{lime}{2}", tag: tag("giá trị của A", SUM) },
] as const satisfies readonly Row[];

export const VISUAL_SPECS: Readonly<Record<string, VisualSpec>> = {
  // 1. Phần dấu và phần số tự nhiên
  "dau-va-so": rows(
    "Số −3 có dấu − và số 3, số 5 có dấu + và số 5",
    [
      {
        tex: "\\concept{pink}{-3}",
        tag: tag("dấu −, số 3", NEGATIVE),
      },
      { tex: "\\concept{lime}{5}", tag: tag("dấu +, số 5", POSITIVE) },
    ],
    LEGEND_SIGNS,
  ),
  "dau-va-so-vi-du": rows(
    "Ba số nguyên, mỗi số gồm phần dấu và phần số tự nhiên",
    [
      { tex: "\\concept{pink}{-7}", tag: tag("dấu −, số 7", NEGATIVE) },
      { tex: "\\concept{lime}{12}", tag: tag("dấu +, số 12", POSITIVE) },
      { tex: "\\concept{pink}{-20}", tag: tag("dấu −, số 20", NEGATIVE) },
    ],
    LEGEND_SIGNS,
  ),
  "dau-va-so-no": rows(
    "Nợ 5 nghìn đồng ghi −5, có 5 nghìn đồng ghi 5",
    [
      { tex: "\\concept{pink}{-5}", tag: tag("nợ 5 nghìn đồng", NEGATIVE) },
      { tex: "\\concept{lime}{5}", tag: tag("có 5 nghìn đồng", POSITIVE) },
    ],
    LEGEND_SIGNS,
  ),

  // 2. Số đối
  "so-doi-truc": {
    kind: "line",
    from: -5,
    to: 5,
    label:
      "Trục số: 5 và −5 cách gốc O cùng 5 đơn vị, một bên phải, một bên trái",
    layers: [
      { type: "origin" },
      { type: "point", at: 5, color: POSITIVE },
      { type: "point", at: -5, color: NEGATIVE },
      {
        type: "arrow",
        from: 0,
        to: 5,
        tag: "5 đơn vị",
        color: OPPOSITE,
        plainTag: true,
      },
      {
        type: "arrow",
        from: 0,
        to: -5,
        tag: "5 đơn vị",
        color: OPPOSITE,
        plainTag: true,
      },
    ],
    mode: "still",
  },
  "so-doi-vi-du": rows("Mỗi số và số đối của nó", [
    {
      tex: "\\concept{lime}{5} \\to \\concept{pink}{-5}",
      tag: tag("số đối của 5", OPPOSITE),
    },
    {
      tex: "\\concept{pink}{-5} \\to \\concept{lime}{5}",
      tag: tag("số đối của −5", OPPOSITE),
    },
    {
      tex: "\\concept{lime}{12} \\to \\concept{pink}{-12}",
      tag: tag("số đối của 12", OPPOSITE),
    },
    {
      tex: "\\concept{pink}{-18} \\to \\concept{lime}{18}",
      tag: tag("số đối của −18", OPPOSITE),
    },
  ]),

  // 3. Cộng với số dương
  "phai-am3-cong5": walk(-3, [5], SUM),
  "cong-duong-vi-du": rows("Cộng với số dương là đi sang phải", [
    {
      tex: "(-3) + 5 = 2",
      tag: tag("sang phải 5", POSITIVE),
    },
    { tex: "(-5) + 2 = -3", tag: tag("sang phải 2", POSITIVE) },
    { tex: "(-4) + 4 = 0", tag: tag("sang phải 4", POSITIVE) },
    { tex: "1 + 3 = 4", tag: tag("sang phải 3", POSITIVE) },
  ]),
  "cung-am5-cong3": tryWalk(-5, -2, "Điểm đã đi sang phải 3 đơn vị, tới −2."),
  "thu-am4": tryWalk(-4),
  "goi-y-am2-cong6": walk(-2, [6], SUM, "hint"),

  // 4. Cộng với số âm
  "trai-2-cong-am5": walk(2, [-5], SUM),
  "cong-am-vi-du": rows("Cộng với số âm là đi sang trái", [
    { tex: "2 + (-5) = -3", tag: tag("sang trái 5", NEGATIVE) },
    { tex: "(-1) + (-3) = -4", tag: tag("sang trái 3", NEGATIVE) },
    { tex: "4 + (-4) = 0", tag: tag("sang trái 4", NEGATIVE) },
    { tex: "(-2) + (-2) = -4", tag: tag("sang trái 2", NEGATIVE) },
  ]),
  "cung-1-cong-am4": tryWalk(1, -3, "Điểm đã đi sang trái 4 đơn vị, tới −3."),
  "thu-am2": tryWalk(-2),
  "goi-y-3-am6": walk(3, [-6], SUM, "hint"),

  // 5. Tổng của hai số đối, cộng với 0
  "quay-ve-goc": walk(4, [-4], SUM),
  "tong-doi-vi-du": rows("Tổng của hai số đối nhau bằng 0", [
    {
      tex: "5 + (-5) = \\concept{slate}{0}",
      tag: tag("5 và −5 đối nhau", OPPOSITE),
    },
    {
      tex: "(-7) + 7 = \\concept{slate}{0}",
      tag: tag("−7 và 7 đối nhau", OPPOSITE),
    },
    {
      tex: "12 + (-12) = \\concept{slate}{0}",
      tag: tag("12 và −12 đối nhau", OPPOSITE),
    },
  ]),
  "cong-voi-0-vi-du": rows("Cộng với 0 thì số không đổi", [
    { tex: "(-4) + \\concept{slate}{0} = -4", tag: tag("đứng yên", ZERO) },
    { tex: "\\concept{slate}{0} + 9 = 9", tag: tag("đứng yên", ZERO) },
  ]),
  "tong-doi-va-0": rows("Tổng hai số đối bằng 0, cộng với 0 thì số không đổi", [
    {
      tex: "5 + (-5) = \\concept{slate}{0}",
      tag: tag("hai số đối nhau", OPPOSITE),
    },
    {
      tex: "(-4) + \\concept{slate}{0} = -4",
      tag: tag("cộng với 0", ZERO),
    },
  ]),
  "cung-5-cong-am5": tryWalk(5, 0, "Điểm đã về gốc O, tổng bằng 0."),
  "thu-am3": tryWalk(-3),

  // 6. Cộng hai số cùng dấu
  "no-3-no-4": walk(-3, [-4], SUM),
  "cung-dau-vi-du": rows("Cộng hai số cùng dấu", [
    {
      tex: steps("(-3) + (-4)", "= -(3 + 4) = \\concept{pink}{-7}"),
      tag: tag("hai số âm", NEGATIVE),
    },
    {
      tex: steps("(-1) + (-2)", "= -(1 + 2) = \\concept{pink}{-3}"),
      tag: tag("hai số âm", NEGATIVE),
    },
    {
      tex: "3 + 4 = \\concept{lime}{7}",
      tag: tag("hai số dương", POSITIVE),
    },
  ]),
  "cung-am2-am4": tryWalk(-2, -6, "Điểm đã đi sang trái 4 đơn vị, tới −6."),
  "goi-y-am1-am3": walk(-1, [-3], SUM, "hint"),

  // 7. Cộng hai số khác dấu
  "thu-7-chi-4": walk(7, [-4], SUM),
  "khac-dau-vi-du": rows("Cộng hai số khác dấu", [
    {
      tex: steps("7 + (-4)", "= +(7 - 4) = \\concept{lime}{3}"),
      tag: tag("phần 7 lớn hơn: dấu +", POSITIVE),
    },
    {
      tex: steps("3 + (-8)", "= -(8 - 3) = \\concept{pink}{-5}"),
      tag: tag("phần 8 lớn hơn: dấu −", NEGATIVE),
    },
    {
      tex: steps("(-5) + 2", "= -(5 - 2) = \\concept{pink}{-3}"),
      tag: tag("phần 5 lớn hơn: dấu −", NEGATIVE),
    },
  ]),
  "cung-3-cong-am5": tryWalk(3, -2, "Điểm đã đi sang trái 5 đơn vị, tới −2."),
  "goi-y-4-am7": walk(4, [-7], SUM, "hint"),

  // 8. Trừ đi một số dương
  "nhiet-4-giam-6": walk(4, [-6], DIFFERENCE),
  "tru-vi-du": rows("Trừ đi một số là cộng với số đối của nó", [
    {
      tex: steps("4 - 6", "= 4 + (-6) = \\concept{pink}{-2}"),
      tag: tag("sang trái 6", NEGATIVE),
    },
    {
      tex: steps("(-3) - 4", "= (-3) + (-4) = \\concept{pink}{-7}"),
      tag: tag("sang trái 4", NEGATIVE),
    },
    {
      tex: steps("6 - 6", "= 6 + (-6) = \\concept{slate}{0}"),
      tag: tag("sang trái 6", NEGATIVE),
    },
  ]),
  "cung-1-tru-4": tryWalk(1, -3, "Điểm đã đi sang trái 4 đơn vị, tới −3."),
  "goi-y-2-tru-6": walk(2, [-6], DIFFERENCE, "hint"),

  // 9. Trừ đi một số âm
  "xoa-no-5": walk(-5, [5], DIFFERENCE),
  "tru-am-vi-du": rows("Trừ đi một số âm là cộng với số dương", [
    {
      tex: steps("2 - (-5)", "= 2 + 5 = \\concept{lime}{7}"),
      tag: tag("sang phải 5", POSITIVE),
    },
    {
      tex: steps("(-3) - (-4)", "= (-3) + 4 = \\concept{lime}{1}"),
      tag: tag("sang phải 4", POSITIVE),
    },
    {
      tex: steps("(-6) - (-6)", "= (-6) + 6 = \\concept{slate}{0}"),
      tag: tag("sang phải 6", POSITIVE),
    },
  ]),
  "cung-1-tru-am3": tryWalk(1, 4, "Điểm đã đi sang phải 3 đơn vị, tới 4."),
  "goi-y-3-tru-am2": walk(3, [2], DIFFERENCE, "hint"),

  // 10. Giao hoán, kết hợp
  "ghep-so-doi": lines("Ghép các số đối nhau trước", PAIR_ROWS, "steps"),
  "ghep-so-doi-xong": lines("Ghép các số đối nhau trước", PAIR_ROWS, "still"),
  "cung-5-tru-3-tru-4": tryWalk(5, -2, "Điểm đã tới −2, tổng bằng −2."),
  "goi-y-ghep": lines(
    "Ghép các số đối nhau trước, với số khác",
    [
      { tex: "6 + (-2) + (-6) + 1" },
      { tex: "= 6 + (-6) + (-2) + 1", tag: tag("ghép cặp số đối", OPPOSITE) },
      { tex: "= 0 + (-1)" },
    ],
    "hint",
  ),

  // 11. Giá trị của biểu thức
  "gia-tri-x-am3": lines(
    "Tính A = x + (−4) − 6 khi x = −3",
    [
      { tex: "A = (-3) + (-4) - 6", tag: tag("thay x bằng −3", FIRST) },
      { tex: "= -7 - 6" },
      {
        tex: "= -7 + (-6)",
        tag: tag("trừ là cộng với số đối", OPPOSITE),
      },
      { tex: "= \\concept{pink}{-13}", tag: tag("giá trị của A", SUM) },
    ],
    "steps",
  ),
  "gia-tri-x-12": lines(
    "Tính A = x + (−4) − 6 khi x = 12",
    VALUE_ROWS,
    "still",
  ),
  "cung-5-bieu-thuc": tryWalk(5, -5, "Điểm đã tới −5, giá trị của A là −5."),
  "goi-y-bieu-thuc": lines(
    "Tính B = x + 2 − 5 khi x = 1",
    [
      { tex: "B = 1 + 2 - 5", tag: tag("thay x bằng 1", FIRST) },
      { tex: "= 3 - 5" },
      { tex: "= -2" },
    ],
    "hint",
  ),

  // 12. Bài toán đời sống
  "sapa-dem": walk(-4, [-3], DIFFERENCE),
  "tai-khoan": lines(
    "Tài khoản có 50 nghìn đồng, thu và chi lần lượt 20, 35, 45 nghìn",
    [
      { tex: "50 + (-20) + 35 + (-45)" },
      { tex: "= 30 + 35 + (-45)", tag: tag("tính từ trái sang phải", FIRST) },
      { tex: "= 65 + (-45)" },
      { tex: "= \\concept{lime}{20}", tag: tag("còn 20 nghìn đồng", SUM) },
    ],
    "steps",
  ),
  "dau-doi-song": rows("Thu vào ghi số dương, chi ra ghi số âm", [
    {
      tex: "\\concept{lime}{+35}",
      tag: tag("thu vào 35 nghìn đồng", POSITIVE),
    },
    { tex: "\\concept{pink}{-20}", tag: tag("chi ra 20 nghìn đồng", NEGATIVE) },
    { tex: "\\concept{lime}{+4}", tag: tag("nhiệt độ tăng 4 độ", POSITIVE) },
    { tex: "\\concept{pink}{-3}", tag: tag("nhiệt độ giảm 3 độ", NEGATIVE) },
  ]),
  "cung-3-thang-may": tryWalk(3, -3, "Thang máy đã xuống 6 tầng, tới tầng −3."),

  sticker: { kind: "sticker" },
};

// Regions of the pictures a `tapRegion` exercise taps: none in this lesson.
export function regionsOf(_spec: VisualSpec): string[] | undefined {
  return undefined;
}
