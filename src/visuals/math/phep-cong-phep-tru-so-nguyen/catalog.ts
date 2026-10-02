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
const OPPOSITE = "sky";
const FIRST = "blue";
// The colour of a label that names a step ("đổi chỗ các số") or a case
// ("đứng yên") rather than a concept of the lesson. It is the one concept
// colour the lesson leaves unused, and its marker (a triangle) cannot be
// read as a sign, unlike the cross of sky or the bar of slate.
const NOTE = "violet";
const SUM = "amber";
const DIFFERENCE = "teal";

type Mode = "steps" | "hint" | "still";

// The name written over the first point of a walk; the last point carries
// the name of the result ("tổng" or "hiệu").
const START_NAME = "đầu";

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
  if (!positions.includes(0)) layers.push({ type: "origin", step: 0 });
  layers.push({
    type: "point",
    at: start,
    name: START_NAME,
    color: FIRST,
    step: 0,
  });
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
      ...(last ? { name: result === SUM ? "tổng" : "hiệu" } : {}),
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
  { tex: "= 8 + (-8) + (-3) + 5", tag: tag("đổi chỗ các số", NOTE) },
  {
    tex: "\\begin{gathered} = [8 + (-8)] \\\\ + [(-3) + 5] \\end{gathered}",
    tag: tag("nhóm cặp số đối nhau", NOTE),
  },
  { tex: "= \\concept{slate}{0} + \\concept{lime}{2}" },
  { tex: "= \\concept{lime}{2}", tag: tag("An còn 2 nghìn đồng", SUM) },
] as const satisfies readonly Row[];

// A = x + (-4) - 6 for x = 12.
const VALUE_ROWS = [
  { tex: "A = x + (-4) - 6" },
  { tex: "A = 12 + (-4) - 6", tag: tag("thay x bằng 12", NOTE) },
  { tex: "= 8 - 6" },
  { tex: "= \\concept{lime}{2}", tag: tag("giá trị của A", SUM) },
] as const satisfies readonly Row[];

export const VISUAL_SPECS: Readonly<Record<string, VisualSpec>> = {
  // 1. Phần dấu và phần số tự nhiên
  "dau-va-so": rows(
    "Số −2 có dấu − và phần số tự nhiên 2, số 9 có dấu + và phần số tự nhiên 9",
    [
      {
        tex: "\\concept{pink}{-2}",
        tag: tag("dấu −, phần số tự nhiên 2", NEGATIVE),
      },
      {
        tex: "\\concept{lime}{9}",
        tag: tag("dấu +, phần số tự nhiên 9", POSITIVE),
      },
    ],
    LEGEND_SIGNS,
  ),
  "dau-va-so-vi-du": rows(
    "Ba số nguyên, mỗi số gồm phần dấu và phần số tự nhiên",
    [
      {
        tex: "\\concept{pink}{-7}",
        tag: tag("dấu −, phần số tự nhiên 7", NEGATIVE),
      },
      {
        tex: "\\concept{lime}{12}",
        tag: tag("dấu +, phần số tự nhiên 12", POSITIVE),
      },
      {
        tex: "\\concept{pink}{-20}",
        tag: tag("dấu −, phần số tự nhiên 20", NEGATIVE),
      },
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
      tag: tag("số đối của 5", NOTE),
    },
    {
      tex: "\\concept{pink}{-5} \\to \\concept{lime}{5}",
      tag: tag("số đối của −5", NOTE),
    },
    {
      tex: "\\concept{lime}{12} \\to \\concept{pink}{-12}",
      tag: tag("số đối của 12", NOTE),
    },
    {
      tex: "\\concept{pink}{-16} \\to \\concept{lime}{16}",
      tag: tag("số đối của −16", NOTE),
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
  "goi-y-am4-cong2": walk(-4, [2], SUM, "hint"),

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
      tag: tag("5 và −5 đối nhau", NOTE),
    },
    {
      tex: "(-7) + 7 = \\concept{slate}{0}",
      tag: tag("−7 và 7 đối nhau", NOTE),
    },
    {
      tex: "12 + (-12) = \\concept{slate}{0}",
      tag: tag("12 và −12 đối nhau", NOTE),
    },
  ]),
  "cong-voi-0-vi-du": rows(
    "Cộng một số với 0, hay cộng 0 với một số, thì được chính số đó",
    [
      { tex: "(-4) + \\concept{slate}{0} = -4", tag: tag("đứng yên", NOTE) },
      {
        tex: "\\concept{slate}{0} + 9 = 9",
        tag: tag("từ 0 sang phải 9", POSITIVE),
      },
    ],
  ),
  "dung-yen-tai-4": {
    kind: "line",
    from: -5,
    to: 5,
    label: "Trục số: điểm ở 4, cộng 0 thì điểm vẫn ở 4",
    layers: [
      { type: "origin" },
      { type: "point", at: 4, name: "đầu và tổng", color: FIRST },
    ],
    mode: "still",
  },
  "cung-am2-cong2": tryWalk(-2, 0, "Điểm đã về gốc O, tổng bằng 0."),
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
      tag: tag("hai số dương, cộng như thường", POSITIVE),
    },
  ]),
  "cung-am2-am4": tryWalk(-2, -6, "Điểm đã đi sang trái 4 đơn vị, tới −6."),
  "goi-y-am8-am5": lines(
    "Cộng hai số âm: cộng hai phần số tự nhiên rồi viết dấu − ở trước",
    [
      { tex: "(-8) + (-5)" },
      { tex: "= -(8 + 5)", tag: tag("cộng 8 với 5, viết dấu − ở trước", NOTE) },
      { tex: "= -13" },
    ],
    "hint",
  ),

  // 7. Cộng hai số khác dấu
  "thu-7-chi-4": walk(7, [-4], SUM),
  "khac-dau-vi-du": rows("Cộng hai số khác dấu", [
    {
      tex: steps("7 + (-4)", "= +(7 - 4) = \\concept{lime}{3}"),
      tag: tag("mang dấu của 7", POSITIVE),
    },
    {
      tex: steps("3 + (-8)", "= -(8 - 3) = \\concept{pink}{-5}"),
      tag: tag("mang dấu của −8", NEGATIVE),
    },
    {
      tex: steps("(-5) + 2", "= -(5 - 2) = \\concept{pink}{-3}"),
      tag: tag("mang dấu của −5", NEGATIVE),
    },
  ]),
  "cung-2-cong-am3": tryWalk(2, -1, "Điểm đã đi sang trái 3 đơn vị, tới −1."),
  "goi-y-am9-cong4": lines(
    "Cộng hai số khác dấu: lấy phần số tự nhiên lớn trừ phần nhỏ, tổng mang dấu của số có phần số tự nhiên lớn hơn",
    [
      { tex: "(-9) + 4" },
      { tex: "= -(9 - 4)", tag: tag("mang dấu của −9", NEGATIVE) },
      { tex: "= -5" },
    ],
    "hint",
  ),

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
  "goi-y-2-tru-7": lines(
    "Trừ đi một số là cộng với số đối của nó",
    [
      { tex: "2 - 7" },
      { tex: "= 2 + (-7)", tag: tag("trừ 7 là cộng với −7", NOTE) },
      { tex: "= -5" },
    ],
    "hint",
  ),

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
  "goi-y-tru-am6": lines(
    "Trừ đi một số âm là cộng với số dương",
    [
      { tex: "2 - (-6)" },
      { tex: "= 2 + 6", tag: tag("trừ −6 là cộng với 6", NOTE) },
      { tex: "= 8" },
    ],
    "hint",
  ),

  // 10. Giao hoán, kết hợp
  "ghep-so-doi": lines("Ghép các số đối nhau trước", PAIR_ROWS, "steps"),
  "ghep-so-doi-xong": lines("Ghép các số đối nhau trước", PAIR_ROWS, "still"),
  "cung-0-cong-am2": tryWalk(0, -2, "Điểm đã tới −2, tổng bằng −2."),
  "goi-y-ghep": lines(
    "Ghép các số đối nhau trước, với số khác",
    [
      { tex: "6 + (-2) + (-6) + 1" },
      { tex: "= 6 + (-6) + (-2) + 1", tag: tag("ghép cặp số đối", NOTE) },
      { tex: "= 0 + (-1)" },
    ],
    "hint",
  ),

  // 11. Giá trị của biểu thức
  "gia-tri-x-am3": lines(
    "Tính A = x + (−4) − 6 khi x = −3",
    [
      { tex: "A = (-3) + (-4) - 6", tag: tag("thay x bằng −3", NOTE) },
      { tex: "= -7 - 6" },
      {
        tex: "= -7 + (-6)",
        tag: tag("trừ là cộng với số đối", NOTE),
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
    "Tính C = x + 2 − 5 khi x = 3",
    [
      { tex: "C = 3 + 2 - 5", tag: tag("thay x bằng 3", NOTE) },
      { tex: "= 5 - 5" },
      { tex: "= 0" },
    ],
    "hint",
  ),

  // 12. Bài toán đời sống
  "sapa-dem": walk(-4, [-3], DIFFERENCE),
  "tai-khoan": lines(
    "Ví có 50 nghìn đồng, chi ra 20 nghìn, thu vào 35 nghìn, chi ra 45 nghìn",
    [
      {
        tex: "50 + (-20) + 35 + (-45)",
        tag: tag("chi ra là số âm, thu vào là số dương", NOTE),
      },
      { tex: "= 30 + 35 + (-45)", tag: tag("tính từ trái sang phải", NOTE) },
      { tex: "= 65 + (-45)" },
      { tex: "= \\concept{lime}{20}", tag: tag("Lan còn 20 nghìn đồng", SUM) },
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

  // 13. Workbook exercises (the book-practice section): the worked solution of
  // each exercise with its own numbers, and hints with other numbers.
  "sbt-dau-va-so-giai": rows(
    "Bốn số nguyên, mỗi số tách thành phần dấu và phần số tự nhiên",
    [
      {
        tex: "\\concept{pink}{-58}",
        tag: tag("dấu −, phần số tự nhiên 58", NEGATIVE),
      },
      {
        tex: "\\concept{lime}{+207}",
        tag: tag("dấu +, phần số tự nhiên 207", POSITIVE),
      },
      {
        tex: "\\concept{pink}{-986}",
        tag: tag("dấu −, phần số tự nhiên 986", NEGATIVE),
      },
      {
        tex: "\\concept{lime}{2\\,023}",
        tag: tag("dấu +, phần số tự nhiên 2 023", POSITIVE),
      },
    ],
    LEGEND_SIGNS,
  ),
  "sbt-so-doi-giai": rows("Số đối của bốn số: giữ phần số tự nhiên, đổi dấu", [
    {
      tex: "\\concept{lime}{25} \\to \\concept{pink}{-25}",
      tag: tag("số đối của +25", NOTE),
    },
    {
      tex: "\\concept{pink}{-18} \\to \\concept{lime}{18}",
      tag: tag("số đối của −18", NOTE),
    },
    {
      tex: "\\concept{lime}{472} \\to \\concept{pink}{-472}",
      tag: tag("số đối của 472", NOTE),
    },
    {
      tex: "\\concept{pink}{-9\\,853} \\to \\concept{lime}{9\\,853}",
      tag: tag("số đối của −9 853", NOTE),
    },
    {
      tex: "",
      tag: tag("hai số đối nhau có phần số tự nhiên giống nhau", SUM),
    },
  ]),

  // Adding two integers of different signs or of the same sign, then the
  // difference of two positive numbers and of a number and a negative one.
  "sbt-3-11a-giai": lines(
    "Tính (−107) + (+92): bỏ dấu + của số trong ngoặc, lấy 107 trừ 92, viết dấu −",
    [
      { tex: "(-107) + (+92)" },
      { tex: "= (-107) + 92", tag: tag("(+92) là số 92", NOTE) },
      { tex: "= -(107 - 92)", tag: tag("mang dấu của −107", NEGATIVE) },
      { tex: "= \\concept{pink}{-15}" },
    ],
    "steps",
  ),
  "sbt-3-11b-giai": lines(
    "Tính 329 + (−315): lấy 329 trừ 315, viết dấu +",
    [
      { tex: "329 + (-315)" },
      { tex: "= +(329 - 315)", tag: tag("mang dấu của 329", POSITIVE) },
      { tex: "= \\concept{lime}{14}" },
    ],
    "steps",
  ),
  "sbt-3-12a-giai": lines(
    "Tính 1 238 + (−1 328): lấy 1 328 trừ 1 238, viết dấu −",
    [
      { tex: "1\\,238 + (-1\\,328)" },
      {
        tex: "= -(1\\,328 - 1\\,238)",
        tag: tag("mang dấu của −1 328", NEGATIVE),
      },
      { tex: "= \\concept{pink}{-90}" },
    ],
    "steps",
  ),
  "sbt-3-12b-giai": lines(
    "Tính (−3 782) + (−1 031): cộng hai phần số tự nhiên rồi viết dấu −",
    [
      { tex: "(-3\\,782) + (-1\\,031)" },
      {
        tex: "= -(3\\,782 + 1\\,031)",
        tag: tag("hai số âm", NEGATIVE),
      },
      { tex: "= \\concept{pink}{-4\\,813}" },
    ],
    "steps",
  ),
  "sbt-3-13a-giai": lines(
    "Tính 8 294 + (−56 946): lấy 56 946 trừ 8 294, viết dấu −",
    [
      { tex: "8\\,294 + (-56\\,946)" },
      {
        tex: steps("= -(56\\,946", "- 8\\,294)"),
        tag: tag("mang dấu của −56 946", NEGATIVE),
      },
      { tex: "= \\concept{pink}{-48\\,652}" },
    ],
    "steps",
  ),
  "sbt-3-13b-giai": lines(
    "Tính (−15 778) + 335 925: lấy 335 925 trừ 15 778, viết dấu +",
    [
      { tex: "(-15\\,778) + 335\\,925" },
      {
        tex: steps("= +(335\\,925", "- 15\\,778)"),
        tag: tag("mang dấu của 335 925", POSITIVE),
      },
      { tex: "= \\concept{lime}{320\\,147}" },
    ],
    "steps",
  ),
  "sbt-3-14a-giai": lines(
    "Tính 27 538 − 12 473: hai số dương, lấy số lớn trừ số nhỏ",
    [
      { tex: "27\\,538 - 12\\,473" },
      {
        tex: "= \\concept{lime}{15\\,065}",
        tag: tag("số lớn trừ số nhỏ", DIFFERENCE),
      },
    ],
    "steps",
  ),
  "sbt-3-14b-giai": lines(
    "Tính 6 591 − (−386): trừ đi −386 là cộng với 386",
    [
      { tex: "6\\,591 - (-386)" },
      { tex: "= 6\\,591 + 386", tag: tag("trừ −386 là cộng với 386", NOTE) },
      { tex: "= \\concept{lime}{6\\,977}" },
    ],
    "steps",
  ),

  // The table of x, y, x + y and x − y: the same dealing with one column
  // (hint, other numbers) and the two columns that miss x or y (solution).
  "sbt-bang-goi-y": lines(
    "Với x = 4 và y = −9: tính x + y rồi x − y",
    [
      { tex: "x = 4, \\; y = -9", tag: tag("thay vào từng ô", NOTE) },
      {
        tex: "x + y = 4 + (-9) = -5",
        tag: tag("cộng hai số khác dấu", NEGATIVE),
      },
      { tex: "x - y = 4 + 9", tag: tag("trừ −9 là cộng với 9", NOTE) },
      { tex: "= 13" },
    ],
    "hint",
  ),
  "sbt-bang-giai": lines(
    "Cột 8 thiếu x, cột 7 thiếu y: tìm chúng từ x − y và x + y",
    [
      { tex: "x - 53 = -39", tag: tag("cột 8: biết x − y và y", NOTE) },
      { tex: "x = -39 + 53 = \\concept{lime}{14}" },
      { tex: "6 + y = -24", tag: tag("cột 7: biết x + y và x", NOTE) },
      { tex: "y = -24 - 6 = \\concept{pink}{-30}" },
      { tex: "", tag: tag("các ô còn lại: thay x, y rồi cộng hoặc trừ", NOTE) },
    ],
    "steps",
  ),

  // Real-life exercises: the temperature at night and the bank account.
  "sbt-3-16-giai": lines(
    "Nhiệt độ ban ngày −7°C, giảm 2°C thì nhiệt độ đêm là −9°C",
    [
      { tex: "-7 - 2", tag: tag("giảm 2 độ là trừ 2", NOTE) },
      { tex: "= (-7) + (-2)", tag: tag("trừ là cộng với số đối", NOTE) },
      {
        tex: "= \\concept{pink}{-9}",
        tag: tag("nhiệt độ ban đêm", DIFFERENCE),
      },
    ],
    "steps",
  ),
  "sbt-goi-y-nhiet-do": lines(
    "Nhiệt độ −6 độ, giảm 4 độ: trừ đi 4 là cộng với −4",
    [
      { tex: "-6 - 4", tag: tag("giảm 4 độ là trừ 4", NOTE) },
      { tex: "= (-6) + (-4)", tag: tag("trừ là cộng với số đối", NOTE) },
      { tex: "= -10" },
    ],
    "hint",
  ),
  "sbt-goi-y-tai-khoan": lines(
    "Tài khoản có 60 nghìn đồng, giao dịch −25 nghìn rồi 30 nghìn",
    [
      {
        tex: "60 + (-25) + 30",
        tag: tag("giao dịch âm là trừ, dương là cộng", NOTE),
      },
      { tex: "= 35 + 30" },
      { tex: "= 65" },
    ],
    "hint",
  ),
  "sbt-3-17-giai": lines(
    "Ba giao dịch lần lượt: trừ 1 765 000, cộng 5 772 000, trừ 3 478 000",
    [
      {
        tex: steps("25\\,784\\,209 - 1\\,765\\,000", "= 24\\,019\\,209"),
        tag: tag("tin nhắn thứ nhất: trừ", NEGATIVE),
      },
      {
        tex: steps("24\\,019\\,209 + 5\\,772\\,000", "= 29\\,791\\,209"),
        tag: tag("tin nhắn thứ hai: cộng", POSITIVE),
      },
      {
        tex: steps(
          "29\\,791\\,209 - 3\\,478\\,000",
          "= \\concept{lime}{26\\,313\\,209}",
        ),
        tag: tag("tin nhắn thứ ba: trừ", NEGATIVE),
      },
    ],
    "steps",
  ),

  // Reasonable calculation: join the numbers that make a round number, or
  // the positives and the negatives, before the last addition.
  "sbt-goi-y-ghep-tron": lines(
    "Ghép 47 với −7 cho tròn chục rồi cộng với −29",
    [
      { tex: "47 + (-29) + (-7)" },
      {
        tex: "= 47 + (-7) + (-29)",
        tag: tag("ghép 47 với −7 cho tròn chục", NOTE),
      },
      { tex: "= 40 + (-29)" },
      { tex: "= 11" },
    ],
    "hint",
  ),
  "sbt-goi-y-ghep-cung-dau": lines(
    "Cộng các số dương, cộng các số âm, rồi cộng hai kết quả",
    [
      { tex: "8 + (-3) + 5 + (-6)" },
      {
        tex: steps("= 8 + 5", "+ (-3) + (-6)"),
        tag: tag("số dương trước", NOTE),
      },
      { tex: "= 13 + (-9)" },
      { tex: "= 4" },
    ],
    "hint",
  ),
  "sbt-3-18a-giai": lines(
    "Tính 387 + (−224) + (−87): ghép 387 với −87 được 300",
    [
      { tex: "387 + (-224) + (-87)" },
      {
        tex: steps("= 387 + (-87)", "+ (-224)"),
        tag: tag("ghép 387 với −87", NOTE),
      },
      { tex: "= 300 + (-224)" },
      { tex: "= \\concept{lime}{76}" },
    ],
    "steps",
  ),
  "sbt-3-18b-giai": lines(
    "Tính (−75) + 329 + (−25): ghép −75 với −25 được −100",
    [
      { tex: "(-75) + 329 + (-25)" },
      {
        tex: steps("= (-75) + (-25)", "+ 329"),
        tag: tag("ghép −75 với −25", NOTE),
      },
      { tex: "= (-100) + 329" },
      { tex: "= \\concept{lime}{229}" },
    ],
    "steps",
  ),
  "sbt-3-19a-giai": lines(
    "Tính 11 + (−13) + 15 + (−17): cộng các số dương, cộng các số âm",
    [
      { tex: "11 + (-13) + 15 + (-17)" },
      {
        tex: steps("= 11 + 15", "+ (-13) + (-17)"),
        tag: tag("số dương trước", NOTE),
      },
      { tex: "= 26 + (-30)" },
      { tex: "= \\concept{pink}{-4}" },
    ],
    "steps",
  ),
  "sbt-3-19b-giai": lines(
    "Tính (−21) + 24 + (−27) + 31: cộng các số dương, cộng các số âm",
    [
      { tex: "(-21) + 24 + (-27) + 31" },
      {
        tex: steps("= 24 + 31", "+ (-21) + (-27)"),
        tag: tag("số dương trước", NOTE),
      },
      { tex: "= 55 + (-48)" },
      { tex: "= \\concept{lime}{7}" },
    ],
    "steps",
  ),

  sticker: { kind: "sticker" },
};

// Regions of the pictures a `tapRegion` exercise taps: none in this lesson.
export function regionsOf(_spec: VisualSpec): string[] | undefined {
  return undefined;
}
