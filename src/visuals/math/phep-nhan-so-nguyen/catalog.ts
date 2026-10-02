import type { ConceptColor } from "@/schema/content";
import type { LinesSpec, Row, RowsSpec } from "@/visuals/shared/formula-rows";
import type { LineLayer, NumberLineSpec } from "@/visuals/shared/number-line";
import type { FactorTrySpec } from "./factor-try";
import type { JumpTrySpec } from "./jump-try";
import { hopRange, labelsFor, positionsOf } from "./logic";

// Every picture of the lesson that is drawn from numbers: the registry builds
// one entry per item (id `phep-nhan-so-nguyen.visual.<key>`), so a new
// example is one item here and its id in lesson.json. Pure data, no React, so
// `content:check` reads it.

export { LESSON_SLUG } from "./logic";

export type VisualSpec =
  // The number line, layer by layer: a walk of equal jumps (see
  // `NumberLineSpec`).
  | ({ kind: "line" } & NumberLineSpec)
  // Hands-on: the child walks one point along the line in equal jumps, state
  // { p0 } (see `JumpTrySpec`).
  | ({ kind: "jumpTry" } & JumpTrySpec)
  // Hands-on: the child lowers the second factor of a product row by row,
  // state { n } (see `FactorTrySpec`).
  | ({ kind: "factorTry" } & FactorTrySpec)
  // Formulas stacked, each with an optional tag (see `RowsSpec`).
  | ({ kind: "rows" } & RowsSpec)
  // Lines of a worked example, one more on every step (see `LinesSpec`).
  | ({ kind: "lines" } & LinesSpec)
  | { kind: "sticker" };

export type SpecKind = VisualSpec["kind"];

// Kinds the child acts on (counted as interactive by `--stats`).
export const INTERACTIVE_KINDS: ReadonlySet<SpecKind> = new Set([
  "jumpTry",
  "factorTry",
]);

// Validator id of the `manipulate` exercises each interactive kind serves: the
// point-placing validator of the lesson on the integers (state { p0 }) and the
// factor validator of this lesson (state { n }).
export const VALIDATOR_IDS = {
  jumpTry: "dat-diem",
  factorTry: "dat-thua-so",
} as const;

// Colours of the concepts of the lesson, as the layers of a picture use them.
const POSITIVE = "lime";
const NEGATIVE = "pink";
const FACTOR = "blue";
const PRODUCT = "amber";
// The colour of a label that names a step ("nhóm hai thừa số đầu") or a
// pattern ("tích giảm 3") rather than a concept of the lesson. It is the one
// concept colour the lesson leaves unused, and its marker (a triangle) cannot
// be read as a sign, unlike the cross of sky or the bar of slate.
const NOTE = "violet";

type Mode = "steps" | "hint" | "still";

// The name written over the first point of a walk; the last point carries
// the name of the product.
const START_NAME = "đầu";
const RESULT_NAME = "tích";

const word = (hop: number) =>
  hop > 0 ? `sang phải ${hop}` : `sang trái ${-hop}`;

const signOf = (hop: number): ConceptColor => (hop > 0 ? POSITIVE : NEGATIVE);

const MINUS = "−";
const written = (value: number) =>
  value < 0 ? `${MINUS}${-value}` : `${value}`;

// A walk along the line: the start, then each jump as an arrow (green right,
// pink left, tagged with the way and the length) followed by the point it
// reaches. The last point is the product; a hint stops before it. Arrows that
// would overlap sit on different rows.
function walk(
  start: number,
  hops: readonly number[],
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
    color: FACTOR,
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
      ...(last ? { name: RESULT_NAME } : {}),
      color: last ? PRODUCT : FACTOR,
      step: 2 * i + 2,
    });
  });
  const labelAt = labelsFor(range, positions);
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

// `times` equal jumps of `hop`.
const repeat = (hop: number, times: number): number[] =>
  Array.from({ length: times }, () => hop);

// The child's own walk in equal jumps: the point starts on `start`, each
// press moves it `step` ticks, and on a lesson screen it must reach `goal`.
const TRY_REACH = 8;
function tryJump(
  start: number,
  step: number,
  goal?: number,
  done?: string,
): VisualSpec {
  return {
    kind: "jumpTry",
    from: -TRY_REACH,
    to: TRY_REACH,
    label: "Trục số, bấm mũi tên để đưa điểm đi từng bước",
    start,
    step,
    ...(goal === undefined ? {} : { goal }),
    ...(done === undefined ? {} : { done }),
  };
}

// The child's own pattern: `first · n` for n from `start` down to `min`.
function tryFactor(
  first: number,
  start: number,
  min: number,
  goal?: number,
  done?: string,
): VisualSpec {
  return {
    kind: "factorTry",
    label: "Bảng tích, bấm mũi tên để giảm thừa số thứ hai từng bước",
    first,
    start,
    min,
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

// A result written in the colour of its sign.
const neg = (n: number) => `\\concept{pink}{${n}}`;
const pos = (n: number) => `\\concept{lime}{${n}}`;
const zero = `\\concept{slate}{0}`;

// One row of a sign-rule picture: both signs and the sign of the product.
const signRow = (first: "+" | "-", second: "+" | "-"): string => {
  const colour = (sign: "+" | "-") => (sign === "+" ? "lime" : "pink");
  const product = first === second ? "+" : "-";
  return `(\\concept{${colour(first)}}{${first}}) \\cdot (\\concept{${colour(second)}}{${second}}) = \\concept{${colour(product)}}{${product}}`;
};

export const VISUAL_SPECS: Readonly<Record<string, VisualSpec>> = {
  // 1. Số âm nhân số dương: cộng lặp lại
  "am2-nhan3": walk(0, repeat(-2, 3)),
  "nhan-am-duong-vi-du": rows(
    "Số âm nhân với số dương là cộng lặp lại số âm đó",
    [
      {
        tex: steps("(-2) \\cdot 3", `= (-2) + (-2) + (-2) = ${neg(-6)}`),
        tag: tag("−2 lấy 3 lần", NEGATIVE),
      },
      {
        tex: steps("(-4) \\cdot 2", `= (-4) + (-4) = ${neg(-8)}`),
        tag: tag("−4 lấy 2 lần", NEGATIVE),
      },
      {
        tex: steps(
          "(-1) \\cdot 5",
          `= (-1) + (-1) + (-1) + (-1) + (-1) = ${neg(-5)}`,
        ),
        tag: tag("−1 lấy 5 lần", NEGATIVE),
      },
      {
        tex: steps("(-5) \\cdot 2", `= (-5) + (-5) = ${neg(-10)}`),
        tag: tag("−5 lấy 2 lần", NEGATIVE),
      },
    ],
  ),
  "cung-am2-nhan4": tryJump(
    0,
    2,
    -8,
    "Điểm đã đi sang trái 4 lần, mỗi lần 2 đơn vị, tới −8.",
  ),
  "thu-am3-nhan2": tryJump(0, 3),
  "goi-y-am4-nhan2": lines(
    "Nhân với 2 là cộng lặp lại hai lần số −4",
    [
      { tex: "(-4) \\cdot 2" },
      {
        tex: "= (-4) + (-4)",
        tag: tag("cộng lặp lại 2 lần", NOTE),
      },
    ],
    "hint",
  ),

  // 2. Nhân với 0
  "tui-ke-0": rows("Bốn túi, mỗi túi không có viên kẹo nào", [
    {
      tex: steps("4 \\cdot 0", `= 0 + 0 + 0 + 0 = ${zero}`),
      tag: tag("4 túi, mỗi túi 0 viên", NOTE),
    },
  ]),
  "nhan-voi-0-vi-du": rows(
    "Một số nhân với 0, hay 0 nhân với một số, thì bằng 0",
    [
      {
        tex: `(-7) \\cdot 0 = ${zero}`,
        tag: tag("số âm nhân với 0", NEGATIVE),
      },
      {
        tex: `5 \\cdot 0 = ${zero}`,
        tag: tag("số dương nhân với 0", POSITIVE),
      },
      {
        tex: `0 \\cdot (-3) = ${zero}`,
        tag: tag("0 nhân với số âm", NEGATIVE),
      },
      { tex: `0 \\cdot 0 = ${zero}`, tag: tag("0 nhân với 0", NOTE) },
    ],
  ),

  // 3. Số dương nhân số âm: tìm quy luật
  "nhiet-do-cach-day": rows("Nhiệt độ tăng đều 3 độ mỗi giờ", [
    {
      tex: `3 \\cdot 2 = ${pos(6)}`,
      tag: tag("sau 2 giờ: cao hơn 6 độ", POSITIVE),
    },
    {
      tex: `3 \\cdot (-2) = ${neg(-6)}`,
      tag: tag("cách đây 2 giờ: thấp hơn 6 độ", NEGATIVE),
    },
  ]),
  "quy-luat-3-nhan": lines(
    "Thừa số thứ hai giảm 1 thì tích giảm 3",
    [
      { tex: "3 \\cdot 3 = 9" },
      { tex: "3 \\cdot 2 = 6", tag: tag("tích giảm 3", NOTE) },
      { tex: "3 \\cdot 1 = 3", tag: tag("tích giảm 3", NOTE) },
      { tex: `3 \\cdot 0 = ${zero}`, tag: tag("tích giảm 3", NOTE) },
      { tex: `3 \\cdot (-1) = ${neg(-3)}`, tag: tag("tích giảm 3", NOTE) },
      { tex: `3 \\cdot (-2) = ${neg(-6)}`, tag: tag("tích giảm 3", NOTE) },
    ],
    "steps",
  ),
  "duong-nhan-am-vi-du": rows("Số dương nhân với số âm cho tích là số âm", [
    {
      tex: steps("2 \\cdot (-5)", `= -(2 \\cdot 5) = ${neg(-10)}`),
      tag: tag("tích âm", NEGATIVE),
    },
    {
      tex: steps("6 \\cdot (-2)", `= -(6 \\cdot 2) = ${neg(-12)}`),
      tag: tag("tích âm", NEGATIVE),
    },
    {
      tex: steps("8 \\cdot (-1)", `= -(8 \\cdot 1) = ${neg(-8)}`),
      tag: tag("tích âm", NEGATIVE),
    },
  ]),
  "cung-2-nhan-am2": tryFactor(
    2,
    3,
    -3,
    -2,
    "Thừa số thứ hai đã xuống −2: tích 2 · (−2) bằng −4.",
  ),
  "thu-4-nhan-am2": tryFactor(4, 2, -3),
  "goi-y-5-nhan-am": lines(
    "Thừa số thứ hai giảm 1 thì tích giảm 5",
    [
      { tex: "5 \\cdot 2 = 10" },
      { tex: "5 \\cdot 1 = 5", tag: tag("tích giảm 5", NOTE) },
      { tex: "5 \\cdot 0 = 0", tag: tag("tích giảm 5", NOTE) },
      { tex: "5 \\cdot (-1) = ?", tag: tag("tích giảm 5", NOTE) },
    ],
    "hint",
  ),

  // 4. Nhân hai số khác dấu
  "no-moi-ngay": rows("Mỗi ngày nợ thêm 2 nghìn đồng, trong 4 ngày", [
    {
      tex: `(-2) \\cdot 4 = ${neg(-8)}`,
      tag: tag("nợ thêm 2 nghìn mỗi ngày, 4 ngày", NEGATIVE),
    },
    {
      tex: `4 \\cdot (-2) = ${neg(-8)}`,
      tag: tag("khác dấu nên tích âm", NEGATIVE),
    },
  ]),
  "khac-dau-vi-du": rows("Hai số khác dấu cho tích là số âm", [
    {
      tex: steps("(-7) \\cdot 2", `= -(7 \\cdot 2) = ${neg(-14)}`),
      tag: tag("khác dấu", NEGATIVE),
    },
    {
      tex: steps("4 \\cdot (-7)", `= -(4 \\cdot 7) = ${neg(-28)}`),
      tag: tag("khác dấu", NEGATIVE),
    },
    {
      tex: steps("9 \\cdot (-2)", `= -(9 \\cdot 2) = ${neg(-18)}`),
      tag: tag("khác dấu", NEGATIVE),
    },
  ]),
  "khac-dau-mau": lines(
    "Tính 6 · (−3): hai số khác dấu nên tích là số âm",
    [
      { tex: "6 \\cdot (-3)" },
      {
        tex: "= -(6 \\cdot 3)",
        tag: tag("khác dấu: viết dấu − ở trước", NOTE),
      },
      { tex: `= ${neg(-18)}`, tag: tag("tích", PRODUCT) },
    ],
    "steps",
  ),
  "goi-y-khac-dau-9-nhan-am2": lines(
    "Hai số khác dấu: viết dấu − ở trước rồi nhân hai phần số tự nhiên",
    [
      { tex: "9 \\cdot (-2)" },
      {
        tex: "= -(9 \\cdot 2)",
        tag: tag("khác dấu: viết dấu − ở trước", NOTE),
      },
    ],
    "hint",
  ),

  // 5. Nhân hai số âm
  "nhiet-do-giam-cach-day": rows("Nhiệt độ giảm đều 2 độ mỗi giờ", [
    {
      tex: `(-2) \\cdot 3 = ${neg(-6)}`,
      tag: tag("sau 3 giờ: thấp hơn 6 độ", NEGATIVE),
    },
    {
      tex: `(-2) \\cdot (-3) = ${pos(6)}`,
      tag: tag("cách đây 3 giờ: cao hơn 6 độ", POSITIVE),
    },
  ]),
  "quy-luat-am3-nhan": lines(
    "Thừa số thứ hai giảm 1 thì tích tăng 3",
    [
      { tex: `(-3) \\cdot 3 = ${neg(-9)}` },
      { tex: `(-3) \\cdot 2 = ${neg(-6)}`, tag: tag("tích tăng 3", NOTE) },
      { tex: `(-3) \\cdot 1 = ${neg(-3)}`, tag: tag("tích tăng 3", NOTE) },
      { tex: `(-3) \\cdot 0 = ${zero}`, tag: tag("tích tăng 3", NOTE) },
      { tex: `(-3) \\cdot (-1) = ${pos(3)}`, tag: tag("tích tăng 3", NOTE) },
      { tex: `(-3) \\cdot (-2) = ${pos(6)}`, tag: tag("tích tăng 3", NOTE) },
    ],
    "steps",
  ),
  "am-nhan-am-vi-du": rows("Hai số âm nhân với nhau cho tích là số dương", [
    {
      tex: steps("(-5) \\cdot (-4)", `= 5 \\cdot 4 = ${pos(20)}`),
      tag: tag("hai số âm: tích dương", POSITIVE),
    },
    {
      tex: steps("(-1) \\cdot (-8)", `= 1 \\cdot 8 = ${pos(8)}`),
      tag: tag("hai số âm: tích dương", POSITIVE),
    },
    {
      tex: steps("(-6) \\cdot (-2)", `= 6 \\cdot 2 = ${pos(12)}`),
      tag: tag("hai số âm: tích dương", POSITIVE),
    },
  ]),
  "cung-am2-nhan-am3": tryFactor(
    -2,
    1,
    -3,
    -3,
    "Thừa số thứ hai đã xuống −3: tích (−2) · (−3) bằng 6.",
  ),
  "thu-am4-nhan-am2": tryFactor(-4, 1, -3),
  "goi-y-am5-nhan-am": lines(
    "Thừa số thứ hai giảm 1 thì tích tăng 5",
    [
      { tex: "(-5) \\cdot 2 = -10" },
      { tex: "(-5) \\cdot 1 = -5", tag: tag("tích tăng 5", NOTE) },
      { tex: "(-5) \\cdot 0 = 0", tag: tag("tích tăng 5", NOTE) },
      { tex: "(-5) \\cdot (-1) = ?", tag: tag("tích tăng 5", NOTE) },
    ],
    "hint",
  ),

  // 6. Dấu của tích
  "bon-truong-hop": rows(
    "Nhiệt độ tăng hay giảm 3 độ mỗi giờ, sau hay cách đây 2 giờ",
    [
      { tex: `3 \\cdot 2 = ${pos(6)}`, tag: tag("tăng, sau 2 giờ", POSITIVE) },
      {
        tex: `(-3) \\cdot 2 = ${neg(-6)}`,
        tag: tag("giảm, sau 2 giờ", NEGATIVE),
      },
      {
        tex: `3 \\cdot (-2) = ${neg(-6)}`,
        tag: tag("tăng, cách đây 2 giờ", NEGATIVE),
      },
      {
        tex: `(-3) \\cdot (-2) = ${pos(6)}`,
        tag: tag("giảm, cách đây 2 giờ", POSITIVE),
      },
    ],
  ),
  "dau-cua-tich-vi-du": rows("Dấu của tích hai số khác 0", [
    { tex: signRow("+", "+"), tag: tag("cùng dấu: tích dương", POSITIVE) },
    { tex: signRow("-", "-"), tag: tag("cùng dấu: tích dương", POSITIVE) },
    { tex: signRow("+", "-"), tag: tag("khác dấu: tích âm", NEGATIVE) },
    { tex: signRow("-", "+"), tag: tag("khác dấu: tích âm", NEGATIVE) },
  ]),

  // 7. Đổi chỗ và nhóm các thừa số
  "mua-but": rows("Hai cách nhóm cho cùng một tích", [
    {
      tex: steps("(2 \\cdot 5) \\cdot 3", "= 10 \\cdot 3 = 30"),
      tag: tag("nhóm hai số đầu", NOTE),
    },
    {
      tex: steps("2 \\cdot (5 \\cdot 3)", "= 2 \\cdot 15 = 30"),
      tag: tag("nhóm hai số sau", NOTE),
    },
  ]),
  "giao-hoan-ket-hop-vi-du": rows(
    "Đổi chỗ và nhóm các thừa số, tích không đổi",
    [
      {
        tex: steps("(-3) \\cdot 4", `= 4 \\cdot (-3) = ${neg(-12)}`),
        tag: tag("đổi chỗ", NOTE),
      },
      {
        tex: steps(
          "[(-2) \\cdot 5] \\cdot 3",
          `= (-2) \\cdot [5 \\cdot 3] = ${neg(-30)}`,
        ),
        tag: tag("nhóm", NOTE),
      },
      {
        tex: steps(
          "(-6) \\cdot 7 \\cdot (-1)",
          `= (-6) \\cdot (-1) \\cdot 7 = ${pos(42)}`,
        ),
        tag: tag("đổi chỗ rồi nhóm", NOTE),
      },
    ],
  ),
  "ghep-nhanh": lines(
    "Tính (−5) · 7 · (−2) bằng cách ghép hai số âm",
    [
      { tex: "(-5) \\cdot 7 \\cdot (-2)" },
      { tex: "= (-5) \\cdot (-2) \\cdot 7", tag: tag("đổi chỗ", NOTE) },
      { tex: "= 10 \\cdot 7", tag: tag("ghép hai số âm trước", NOTE) },
      { tex: `= ${pos(70)}`, tag: tag("tích", PRODUCT) },
    ],
    "steps",
  ),
  "goi-y-ghep-nhanh": lines(
    "Đổi chỗ để ghép hai số âm trước",
    [
      { tex: "(-2) \\cdot 6 \\cdot (-5)" },
      {
        tex: "= (-2) \\cdot (-5) \\cdot 6",
        tag: tag("đổi chỗ để ghép hai số âm", NOTE),
      },
    ],
    "hint",
  ),

  // 8. Tích nhiều thừa số
  "nhan-tung-cap": lines(
    "Tính (−2) · 3 · (−4): nhân hai số đầu trước, rồi nhân với số còn lại",
    [
      { tex: "(-2) \\cdot 3 \\cdot (-4)" },
      { tex: "= (-6) \\cdot (-4)", tag: tag("nhân hai số đầu trước", NOTE) },
      { tex: `= ${pos(24)}`, tag: tag("tích", PRODUCT) },
    ],
    "steps",
  ),
  "nhieu-thua-so-vi-du": rows("Nhân từ trái sang phải", [
    {
      tex: steps(
        "(-1) \\cdot (-2) \\cdot (-3)",
        `= 2 \\cdot (-3) = ${neg(-6)}`,
      ),
      tag: tag("nhân từ trái sang phải", NOTE),
    },
    {
      tex: steps("2 \\cdot (-3) \\cdot 4", `= (-6) \\cdot 4 = ${neg(-24)}`),
      tag: tag("nhân từ trái sang phải", NOTE),
    },
    {
      tex: steps(
        "5 \\cdot (-2) \\cdot (-1)",
        `= (-10) \\cdot (-1) = ${pos(10)}`,
      ),
      tag: tag("nhân từ trái sang phải", NOTE),
    },
  ]),
  "goi-y-nhan-tung-cap": lines(
    "Nhân hai số đầu trước, rồi nhân với số còn lại",
    [
      { tex: "(-4) \\cdot 2 \\cdot (-3)" },
      { tex: "= (-8) \\cdot (-3)", tag: tag("nhân hai số đầu trước", NOTE) },
    ],
    "hint",
  ),

  // 9. Nhân một số với một tổng
  "mua-ba-phan": rows("Hai cách tính tiền 3 phần ăn", [
    {
      tex: steps("3 \\cdot (5 + 4)", "= 3 \\cdot 9 = 27"),
      tag: tag("tính tiền một phần trước", NOTE),
    },
    {
      tex: steps("3 \\cdot 5 + 3 \\cdot 4", "= 15 + 12 = 27"),
      tag: tag("tính bánh và nước riêng", NOTE),
    },
  ]),
  "phan-phoi-vi-du": rows("Nhân một số với từng số hạng của tổng", [
    {
      tex: steps("3 \\cdot (5 + 4)", "= 3 \\cdot 5 + 3 \\cdot 4"),
      tag: tag("nhân với từng số hạng", NOTE),
    },
    {
      tex: steps("(-2) \\cdot (4 + 1)", "= (-2) \\cdot 4 + (-2) \\cdot 1"),
      tag: tag("nhân với từng số hạng", NOTE),
    },
    {
      tex: steps("5 \\cdot [(-3) + 2]", "= 5 \\cdot (-3) + 5 \\cdot 2"),
      tag: tag("nhân với từng số hạng", NOTE),
    },
  ]),
  "phan-phoi-am-mau": lines(
    "Tính (−2) · [3 + (−5)] theo hai cách",
    [
      { tex: "(-2) \\cdot [3 + (-5)]" },
      {
        tex: `= (-2) \\cdot (-2) = ${pos(4)}`,
        tag: tag("tính trong ngoặc trước", NOTE),
      },
      {
        tex: steps("(-2) \\cdot 3 + (-2) \\cdot (-5)", `= -6 + 10 = ${pos(4)}`),
        tag: tag("nhân với từng số hạng", NOTE),
      },
    ],
    "steps",
  ),
  "goi-y-phan-phoi": lines(
    "Nhân số ngoài ngoặc với từng số hạng",
    [
      { tex: "(-2) \\cdot (5 + 1)" },
      {
        tex: "= (-2) \\cdot 5 + (-2) \\cdot 1",
        tag: tag("nhân với từng số hạng", NOTE),
      },
    ],
    "hint",
  ),

  // 10. Đưa thừa số chung ra ngoài
  "gop-hop-keo": lines(
    "Cả 7 hộp, mỗi hộp 6 viên kẹo xanh và 4 viên kẹo đỏ",
    [
      { tex: "7 \\cdot 6 + 7 \\cdot 4" },
      {
        tex: "= 7 \\cdot (6 + 4)",
        tag: tag("đưa thừa số chung 7 ra ngoài", NOTE),
      },
      { tex: "= 7 \\cdot 10 = 70", tag: tag("cả 7 hộp", PRODUCT) },
    ],
    "steps",
  ),
  "gop-thua-so-vi-du": rows("Đưa thừa số chung ra ngoài", [
    {
      tex: steps(
        "7 \\cdot (-6) + 7 \\cdot (-4)",
        `= 7 \\cdot [(-6) + (-4)] = ${neg(-70)}`,
      ),
      tag: tag("chung thừa số 7", NOTE),
    },
    {
      tex: steps(
        "3 \\cdot 8 + 3 \\cdot (-2)",
        `= 3 \\cdot [8 + (-2)] = ${pos(18)}`,
      ),
      tag: tag("chung thừa số 3", NOTE),
    },
    {
      tex: steps(
        "(-2) \\cdot 5 + (-2) \\cdot 6",
        `= (-2) \\cdot 11 = ${neg(-22)}`,
      ),
      tag: tag("chung thừa số −2", NOTE),
    },
  ]),
  "gop-mau": lines(
    "Tính (−5) · (−8) + 3 · (−5) bằng cách đưa thừa số chung ra ngoài",
    [
      { tex: "(-5) \\cdot (-8) + 3 \\cdot (-5)" },
      {
        tex: "= (-5) \\cdot (-8) + (-5) \\cdot 3",
        tag: tag("đổi chỗ để thấy thừa số chung", NOTE),
      },
      { tex: "= (-5) \\cdot [(-8) + 3]", tag: tag("đưa −5 ra ngoài", NOTE) },
      { tex: `= (-5) \\cdot (-5) = ${pos(25)}`, tag: tag("tích", PRODUCT) },
    ],
    "steps",
  ),
  "goi-y-gop-thua-so": lines(
    "Đưa thừa số chung ra ngoài rồi cộng hai số còn lại",
    [
      { tex: "4 \\cdot (-2) + 4 \\cdot (-5)" },
      {
        tex: "= 4 \\cdot [(-2) + (-5)]",
        tag: tag("đưa thừa số chung 4 ra ngoài", NOTE),
      },
    ],
    "hint",
  ),

  // 11. Tích bằng 0
  "tich-bang-0-truong-hop": rows("Ba trường hợp tích bằng 0", [
    { tex: `0 \\cdot 5 = ${zero}`, tag: tag("thừa số đầu bằng 0", NOTE) },
    { tex: `(-4) \\cdot 0 = ${zero}`, tag: tag("thừa số sau bằng 0", NOTE) },
    { tex: `0 \\cdot 0 = ${zero}`, tag: tag("cả hai bằng 0", NOTE) },
  ]),
  "tich-bang-0-vi-du": rows(
    "Tích bằng 0 mà một thừa số khác 0 thì thừa số kia bằng 0",
    [
      {
        tex: `a \\cdot 7 = 0 \\to a = ${zero}`,
        tag: tag("7 khác 0 nên a bằng 0", NOTE),
      },
      {
        tex: `(-4) \\cdot b = 0 \\to b = ${zero}`,
        tag: tag("−4 khác 0 nên b bằng 0", NOTE),
      },
    ],
  ),
  "tim-x-mau": lines(
    "Tìm x biết (x − 3) · (x + 2) = 0",
    [
      { tex: "(x - 3) \\cdot (x + 2) = 0" },
      {
        tex: `x - 3 = 0 \\to x = ${pos(3)}`,
        tag: tag("thừa số đầu bằng 0", NOTE),
      },
      {
        tex: `x + 2 = 0 \\to x = ${neg(-2)}`,
        tag: tag("thừa số sau bằng 0", NOTE),
      },
      {
        tex: "x = 3 \\quad ; \\quad x = -2",
        tag: tag("hai giá trị cần tìm", PRODUCT),
      },
    ],
    "steps",
  ),

  // 12. Bài toán đời sống
  "thay-doi-vai": rows("Số vải cả 20 bộ khi mỗi bộ thay đổi x dm", [
    {
      tex: `20 \\cdot 3 = ${pos(60)}`,
      tag: tag("mỗi bộ thêm 3 dm: tăng 60 dm", POSITIVE),
    },
    {
      tex: `20 \\cdot (-2) = ${neg(-40)}`,
      tag: tag("mỗi bộ bớt 2 dm: giảm 40 dm", NEGATIVE),
    },
  ]),
  "tang-giam-vi-du": rows("Tăng ghi số dương, giảm ghi số âm", [
    { tex: `${pos(3)}`, tag: tag("nhiệt độ tăng 3 độ mỗi giờ", POSITIVE) },
    { tex: `${neg(-3)}`, tag: tag("nhiệt độ giảm 3 độ mỗi giờ", NEGATIVE) },
    { tex: `${neg(-2)}`, tag: tag("nợ thêm 2 nghìn mỗi ngày", NEGATIVE) },
    { tex: `${pos(5)}`, tag: tag("tiết kiệm thêm 5 nghìn mỗi ngày", POSITIVE) },
  ]),
  "cung-giam3-3-gio": tryJump(
    0,
    3,
    -9,
    "Điểm đã đi sang trái 3 lần, mỗi lần 3 đơn vị, tới −9.",
  ),

  sticker: { kind: "sticker" },
};

// Regions of the pictures a `tapRegion` exercise taps: none in this lesson.
export function regionsOf(_spec: VisualSpec): string[] | undefined {
  return undefined;
}
