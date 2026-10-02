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
      tag: written(hop),
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
const TRY_REACH = 6;
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
    label: "Trục số, bấm nút mũi tên để đưa chấm đi từng bước",
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
    label: "Bảng tích, bấm nút mũi tên để giảm số đứng sau dấu nhân từng bước",
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
const neg = (n: number | string) => `\\concept{pink}{${n}}`;
const pos = (n: number | string) => `\\concept{lime}{${n}}`;
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
        tex: steps("(-4) \\cdot 2", `= (-4) + (-4) = ${neg(-8)}`),
        tag: tag("−4 lấy 2 lần", NEGATIVE),
      },
      {
        tex: steps("(-1) \\cdot 3", `= (-1) + (-1) + (-1) = ${neg(-3)}`),
        tag: tag("−1 lấy 3 lần", NEGATIVE),
      },
      {
        tex: steps("(-5) \\cdot 2", `= (-5) + (-5) = ${neg(-10)}`),
        tag: tag("−5 lấy 2 lần", NEGATIVE),
      },
    ],
  ),
  "cung-am3-nhan2": tryJump(
    0,
    3,
    -6,
    "Chấm đã đi sang trái 2 lần, mỗi lần 3 vạch, tới −6.",
  ),
  "thu-am2-nhan2": tryJump(0, 2),
  "goi-y-am4-nhan2": lines(
    "Nhân với 2 là cộng lặp lại hai lần số −4",
    [
      { tex: "(-4) \\cdot 2" },
      { tex: "= (-4) + (-4)", tag: tag("cộng lặp lại 2 lần", NOTE) },
      { tex: "= -8" },
    ],
    "hint",
  ),

  // 2. Nhân với 0
  "tui-ke-0": rows("Bốn túi rỗng, mỗi túi không có viên kẹo nào", [
    {
      tex: steps("0 \\cdot 4", `= 0 + 0 + 0 + 0 = ${zero}`),
      tag: tag("mỗi túi 0 viên, 4 túi", NOTE),
    },
    { tex: `4 \\cdot 0 = ${zero}`, tag: tag("mỗi túi 4 viên, 0 túi", NOTE) },
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
        tex: `0 \\cdot 6 = ${zero}`,
        tag: tag("0 nhân với số dương", POSITIVE),
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
      tag: tag("2 giờ trước: thấp hơn 6 độ", NEGATIVE),
    },
  ]),
  "quy-luat-3-nhan": lines(
    "Số đứng sau dấu nhân giảm 1 thì tích giảm 3",
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
    { tex: `2 \\cdot (-8) = ${neg(-16)}`, tag: tag("tích âm", NEGATIVE) },
    { tex: `6 \\cdot (-2) = ${neg(-12)}`, tag: tag("tích âm", NEGATIVE) },
    { tex: `8 \\cdot (-1) = ${neg(-8)}`, tag: tag("tích âm", NEGATIVE) },
  ]),
  "cung-2-nhan-am2": tryFactor(
    2,
    3,
    -3,
    -2,
    "Số đứng sau dấu nhân đã xuống −2: tích 2 · (−2) bằng −4.",
  ),
  "goi-y-6-nhan-am": lines(
    "Số đứng sau dấu nhân giảm 1 thì tích giảm 6",
    [
      { tex: "6 \\cdot 2 = 12" },
      { tex: "6 \\cdot 1 = 6", tag: tag("tích giảm 6", NOTE) },
      { tex: "6 \\cdot 0 = 0", tag: tag("tích giảm 6", NOTE) },
      { tex: "6 \\cdot (-1) = ?", tag: tag("tích giảm 6", NOTE) },
    ],
    "hint",
  ),
  "goi-y-5-nhan-am": lines(
    "Số đứng sau dấu nhân giảm 1 thì tích giảm 5",
    [
      { tex: "5 \\cdot 2 = 10" },
      { tex: "5 \\cdot 1 = 5", tag: tag("tích giảm 5", NOTE) },
      { tex: "5 \\cdot 0 = 0", tag: tag("tích giảm 5", NOTE) },
      { tex: "5 \\cdot (-1) = ?", tag: tag("tích giảm 5", NOTE) },
    ],
    "hint",
  ),

  // 4. Nhân hai số khác dấu
  "no-moi-ngay": rows("Mỗi ngày nợ thêm 2 nghìn đồng", [
    {
      tex: `(-2) \\cdot 1 = ${neg(-2)}`,
      tag: tag("1 ngày: giảm 2 nghìn đồng", NEGATIVE),
    },
    {
      tex: `(-2) \\cdot 5 = ${neg(-10)}`,
      tag: tag("5 ngày: giảm 10 nghìn đồng", NEGATIVE),
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
    "Tính 6 · (−3): nhân hai phần số tự nhiên rồi viết dấu − ở trước",
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
    "Hai số khác dấu: nhân hai phần số tự nhiên rồi viết dấu − ở trước",
    [
      { tex: "9 \\cdot (-2)" },
      {
        tex: "= -(9 \\cdot 2)",
        tag: tag("khác dấu: viết dấu − ở trước", NOTE),
      },
      { tex: "= -18" },
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
      tag: tag("3 giờ trước: cao hơn 6 độ", POSITIVE),
    },
  ]),
  "quy-luat-am3-nhan": lines(
    "Số đứng sau dấu nhân giảm 1 thì tích tăng 3",
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
    "Số đứng sau dấu nhân đã xuống −3: tích (−2) · (−3) bằng 6.",
  ),
  "goi-y-am5-nhan-am": lines(
    "Số đứng sau dấu nhân giảm 1 thì tích tăng 5",
    [
      { tex: "(-5) \\cdot 2 = -10" },
      { tex: "(-5) \\cdot 1 = -5", tag: tag("tích tăng 5", NOTE) },
      { tex: "(-5) \\cdot 0 = 0", tag: tag("tích tăng 5", NOTE) },
      { tex: "(-5) \\cdot (-1) = 5", tag: tag("tích tăng 5", NOTE) },
      { tex: "(-5) \\cdot (-2) = ?", tag: tag("tích tăng 5", NOTE) },
    ],
    "hint",
  ),
  "goi-y-am8-nhan-am": lines(
    "Số đứng sau dấu nhân giảm 1 thì tích tăng 8",
    [
      { tex: "(-8) \\cdot 2 = -16" },
      { tex: "(-8) \\cdot 1 = -8", tag: tag("tích tăng 8", NOTE) },
      { tex: "(-8) \\cdot 0 = 0", tag: tag("tích tăng 8", NOTE) },
      { tex: "(-8) \\cdot (-1) = ?", tag: tag("tích tăng 8", NOTE) },
    ],
    "hint",
  ),

  // 6. Dấu của tích
  "bon-truong-hop": rows(
    "Nhiệt độ tăng hay giảm 3 độ mỗi giờ, xét 2 giờ sau hoặc 2 giờ trước",
    [
      {
        tex: `3 \\cdot 2 = ${pos(6)}`,
        tag: tag("tăng, sau 2 giờ: cao hơn", POSITIVE),
      },
      {
        tex: `(-3) \\cdot 2 = ${neg(-6)}`,
        tag: tag("giảm, sau 2 giờ: thấp hơn", NEGATIVE),
      },
      {
        tex: `3 \\cdot (-2) = ${neg(-6)}`,
        tag: tag("tăng, 2 giờ trước: thấp hơn", NEGATIVE),
      },
      {
        tex: `(-3) \\cdot (-2) = ${pos(6)}`,
        tag: tag("giảm, 2 giờ trước: cao hơn", POSITIVE),
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
      tex: steps("(3 \\cdot 5) \\cdot 2", "= 15 \\cdot 2 = 30"),
      tag: tag("nhóm hai số đầu", NOTE),
    },
    {
      tex: steps("3 \\cdot (5 \\cdot 2)", "= 3 \\cdot 10 = 30"),
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
    "Tính (−5) · 7 · (−2) bằng cách ghép hai số nhân ra 10",
    [
      { tex: "(-5) \\cdot 7 \\cdot (-2)" },
      { tex: "= (-5) \\cdot (-2) \\cdot 7", tag: tag("đổi chỗ", NOTE) },
      {
        tex: "= 10 \\cdot 7",
        tag: tag("(−5) · (−2) = 10", NOTE),
      },
      { tex: `= ${pos(70)}`, tag: tag("tích", PRODUCT) },
    ],
    "steps",
  ),
  "goi-y-ghep-nhanh": lines(
    "Đổi chỗ để ghép hai số nhân ra 10, 20 hoặc 100",
    [
      { tex: "(-2) \\cdot 6 \\cdot (-5)" },
      {
        tex: "= (-2) \\cdot (-5) \\cdot 6",
        tag: tag("ghép hai số nhân ra 10", NOTE),
      },
      { tex: "= 10 \\cdot 6" },
    ],
    "hint",
  ),

  // 8. Tích nhiều thừa số
  "nhan-tung-cap": lines(
    "Tính (−2) · 3 · 2: nhân hai số đầu trước, rồi nhân với số còn lại",
    [
      { tex: "(-2) \\cdot 3 \\cdot 2" },
      { tex: "= (-6) \\cdot 2", tag: tag("nhân hai số đầu trước", NOTE) },
      {
        tex: `= ${neg(-12)}`,
        tag: tag("hai bạn: tiền giảm 12 nghìn đồng", PRODUCT),
      },
    ],
    "steps",
  ),
  "nhieu-thua-so-vi-du": rows("Đếm thừa số âm để biết dấu của tích", [
    {
      tex: steps(
        "(-1) \\cdot (-2) \\cdot (-3)",
        `= 2 \\cdot (-3) = ${neg(-6)}`,
      ),
      tag: tag("3 thừa số âm: tích âm", NEGATIVE),
    },
    {
      tex: steps("2 \\cdot (-3) \\cdot 4", `= (-6) \\cdot 4 = ${neg(-24)}`),
      tag: tag("1 thừa số âm: tích âm", NEGATIVE),
    },
    {
      tex: steps(
        "5 \\cdot (-2) \\cdot (-1)",
        `= (-10) \\cdot (-1) = ${pos(10)}`,
      ),
      tag: tag("2 thừa số âm: tích dương", POSITIVE),
    },
  ]),
  "goi-y-nhan-tung-cap": lines(
    "Nhân hai số đầu trước, rồi nhân với số còn lại",
    [
      { tex: "(-4) \\cdot 2 \\cdot (-3)" },
      { tex: "= (-8) \\cdot (-3)", tag: tag("nhân hai số đầu trước", NOTE) },
      { tex: "= 24" },
    ],
    "hint",
  ),

  // 9. Nhân một số với một tổng
  "ve-xe-buyt": rows("Hai cách tính tiền vé xe buýt cả ngày", [
    {
      tex: steps("3 \\cdot (5 + 4)", "= 3 \\cdot 9 = 27"),
      tag: tag("tính cả ngày một lần", NOTE),
    },
    {
      tex: steps("3 \\cdot 5 + 3 \\cdot 4", "= 15 + 12 = 27"),
      tag: tag("tính sáng và chiều riêng", NOTE),
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
      { tex: "= -10 + (-2)" },
    ],
    "hint",
  ),

  // 10. Đưa thừa số chung ra ngoài
  "gop-hop-keo": lines(
    "Mỗi hộp 7 viên kẹo, Lan có 6 hộp và Minh có 4 hộp",
    [
      { tex: "7 \\cdot 6 + 7 \\cdot 4" },
      {
        tex: "= 7 \\cdot (6 + 4)",
        tag: tag("đưa thừa số chung 7 ra ngoài", NOTE),
      },
      {
        tex: "= 7 \\cdot 10 = 70",
        tag: tag("70 viên kẹo của cả hai bạn", PRODUCT),
      },
    ],
    "steps",
  ),
  "gop-thua-so-vi-du": rows("Đưa thừa số chung ra ngoài", [
    {
      tex: steps(
        "8 \\cdot (-6) + 8 \\cdot (-4)",
        `= 8 \\cdot [(-6) + (-4)] = ${neg(-80)}`,
      ),
      tag: tag("chung thừa số 8", NOTE),
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
        `= (-2) \\cdot (5 + 6) = ${neg(-22)}`,
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
      { tex: "= 4 \\cdot (-7)" },
    ],
    "hint",
  ),

  // 11. Tích bằng 0
  "tich-bang-0-truong-hop": rows("Ba trường hợp tích bằng 0", [
    { tex: `0 \\cdot 5 = ${zero}`, tag: tag("mỗi túi 0 viên, 5 túi", NOTE) },
    { tex: `3 \\cdot 0 = ${zero}`, tag: tag("mỗi túi 3 viên, 0 túi", NOTE) },
    { tex: `0 \\cdot 0 = ${zero}`, tag: tag("0 viên, 0 túi", NOTE) },
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
  "thay-doi-vai": rows("Số vải mỗi bộ thay đổi, nhân với 20 bộ", [
    {
      tex: `5 \\cdot 20 = ${pos(100)}`,
      tag: tag("mỗi bộ thêm 5 dm: tăng 100 dm", POSITIVE),
    },
    {
      tex: `(-2) \\cdot 20 = ${neg(-40)}`,
      tag: tag("mỗi bộ ít hơn 2 dm: giảm 40 dm", NEGATIVE),
    },
  ]),
  "tang-giam-vi-du": rows("Thay đổi mỗi lần nhân với số lần", [
    {
      tex: `4 \\cdot 3 = ${pos(12)}`,
      tag: tag("tiết kiệm 4 nghìn mỗi ngày, 3 ngày", POSITIVE),
    },
    {
      tex: `(-3) \\cdot 4 = ${neg(-12)}`,
      tag: tag("nhiệt độ giảm 3 độ mỗi giờ, 4 giờ", NEGATIVE),
    },
    {
      tex: `(-5) \\cdot 2 = ${neg(-10)}`,
      tag: tag("nợ thêm 5 nghìn mỗi ngày, 2 ngày: số tiền giảm", NEGATIVE),
    },
  ]),
  "cung-giam1-5-gio": tryJump(
    0,
    1,
    -5,
    "Chấm đã tới −5: sau 5 giờ nhiệt độ thay đổi (−1) · 5 = −5 độ, tức là giảm 5 độ.",
  ),

  // 13. Bài tập sách bài tập: the reminder of the section, the hint (other
  // numbers, stops before the result) and the solution (the exercise's own
  // numbers) of each workbook exercise, and the hints of its lead-in steps.
  "sbt-nhac-lai-dau-tich": rows(
    "Nhân hai số nguyên: nhân hai phần số tự nhiên rồi viết dấu cho tích",
    [
      {
        tex: `(-4) \\cdot 5 = ${neg(-20)}`,
        tag: tag("khác dấu: tích âm", NEGATIVE),
      },
      {
        tex: `4 \\cdot (-5) = ${neg(-20)}`,
        tag: tag("khác dấu: tích âm", NEGATIVE),
      },
      {
        tex: `(-4) \\cdot (-5) = ${pos(20)}`,
        tag: tag("cùng dấu: tích dương", POSITIVE),
      },
      {
        tex: `4 \\cdot 5 = ${pos(20)}`,
        tag: tag("cùng dấu: tích dương", POSITIVE),
      },
    ],
  ),
  "sbt-nhac-lai-tich-0": rows("Tích bằng 0 thì ít nhất một thừa số bằng 0", [
    {
      tex: "3 \\cdot (x + 2) = 0",
      tag: tag("3 khác 0 nên thừa số x + 2 bằng 0", NOTE),
    },
    { tex: `x + 2 = 0 \\to x = ${neg(-2)}` },
    {
      tex: "(x - 7) \\cdot (x + 1) = 0",
      tag: tag("ít nhất một thừa số bằng 0", NOTE),
      gapBefore: true,
    },
    {
      tex: `x = ${pos(7)} \\quad ; \\quad x = ${neg(-1)}`,
      tag: tag("hai giá trị cần tìm", PRODUCT),
    },
  ]),
  "sbt-tom-tat": rows("Dấu của tích và tích bằng 0", [
    { tex: signRow("-", "-"), tag: tag("cùng dấu: tích dương", POSITIVE) },
    { tex: signRow("+", "-"), tag: tag("khác dấu: tích âm", NEGATIVE) },
    {
      tex: "a \\cdot b = 0",
      tag: tag("ít nhất một thừa số bằng 0", NOTE),
      gapBefore: true,
    },
  ]),

  // Bài 3.26
  "sbt-goi-y-nhan-tach": lines(
    "Tách 135 thành 100 + 35 rồi nhân từng phần với 4",
    [
      { tex: "135 \\cdot 4" },
      {
        tex: "= 100 \\cdot 4 + 35 \\cdot 4",
        tag: tag("tách 135 = 100 + 35", NOTE),
      },
      { tex: "= 400 + 140", tag: tag("nhân từng phần", NOTE) },
      { tex: "= 540" },
    ],
    "hint",
  ),
  "sbt-3-26-giai": lines(
    "Tách 115 thành 100 + 15 rồi nhân từng phần với 8",
    [
      { tex: "115 \\cdot 8" },
      {
        tex: "= 100 \\cdot 8 + 15 \\cdot 8",
        tag: tag("tách 115 = 100 + 15", NOTE),
      },
      { tex: "= 800 + 120", tag: tag("nhân từng phần", NOTE) },
      { tex: `= ${pos(920)}`, tag: tag("tích", PRODUCT) },
    ],
    "steps",
  ),
  "sbt-goi-y-am-nhan-duong": lines(
    "Số âm nhân số dương: nhân hai phần số tự nhiên rồi viết dấu − ở trước",
    [
      { tex: "(-8) \\cdot 6" },
      {
        tex: "= -(8 \\cdot 6)",
        tag: tag("khác dấu: viết dấu − ở trước", NOTE),
      },
      { tex: "= -48" },
    ],
    "hint",
  ),
  "sbt-3-26a-giai": lines(
    "(−115) · 8: hai số khác dấu nên tích là số âm",
    [
      { tex: "(-115) \\cdot 8" },
      {
        tex: "= -(115 \\cdot 8)",
        tag: tag("khác dấu: viết dấu − ở trước", NOTE),
      },
      {
        tex: `= ${neg(-920)}`,
        tag: tag("115 · 8 = 920, thêm dấu −", NEGATIVE),
      },
    ],
    "steps",
  ),
  "sbt-3-26b-giai": lines(
    "115 · (−8): hai số khác dấu nên tích là số âm",
    [
      { tex: "115 \\cdot (-8)" },
      {
        tex: "= -(115 \\cdot 8)",
        tag: tag("khác dấu: viết dấu − ở trước", NOTE),
      },
      {
        tex: `= ${neg(-920)}`,
        tag: tag("115 · 8 = 920, thêm dấu −", NEGATIVE),
      },
    ],
    "steps",
  ),
  "sbt-3-26c-giai": lines(
    "(−115) · (−8): hai số âm nên tích là số dương",
    [
      { tex: "(-115) \\cdot (-8)" },
      {
        tex: "= 115 \\cdot 8",
        tag: tag("cùng dấu: tích dương", POSITIVE),
      },
      { tex: `= ${pos(920)}`, tag: tag("115 · 8 = 920", POSITIVE) },
    ],
    "steps",
  ),

  // Bài 3.27
  "sbt-goi-y-dau-duong-duong": lines(
    "Xét dấu từng thừa số, không cần nhân",
    [
      { tex: "63 \\cdot 48" },
      {
        tex: "63 > 0 \\quad ; \\quad 48 > 0",
        tag: tag("hai số dương: cùng dấu", POSITIVE),
      },
      { tex: "63 \\cdot 48 > 0" },
    ],
    "hint",
  ),
  "sbt-goi-y-dau-am-duong": lines(
    "Xét dấu từng thừa số, không cần nhân",
    [
      { tex: "(-52) \\cdot 36" },
      {
        tex: "-52 < 0 \\quad ; \\quad 36 > 0",
        tag: tag("một số âm, một số dương: khác dấu", NEGATIVE),
      },
      { tex: "(-52) \\cdot 36 < 0" },
    ],
    "hint",
  ),
  "sbt-goi-y-dau-am-am": lines(
    "Xét dấu từng thừa số, không cần nhân",
    [
      { tex: "(-73) \\cdot (-29)" },
      {
        tex: "-73 < 0 \\quad ; \\quad -29 < 0",
        tag: tag("hai số âm: cùng dấu", POSITIVE),
      },
      { tex: "(-73) \\cdot (-29) > 0" },
    ],
    "hint",
  ),
  "sbt-3-27a-giai": lines(
    "287 và 522 đều là số dương nên tích dương",
    [
      { tex: "287 \\cdot 522" },
      {
        tex: "287 > 0 \\quad ; \\quad 522 > 0",
        tag: tag("hai số dương: cùng dấu", POSITIVE),
      },
      { tex: "287 \\cdot 522 > 0", tag: tag("tích dương", POSITIVE) },
    ],
    "steps",
  ),
  "sbt-3-27b-giai": lines(
    "−375 là số âm, 959 là số dương nên tích âm",
    [
      { tex: "(-375) \\cdot 959" },
      {
        tex: "-375 < 0 \\quad ; \\quad 959 > 0",
        tag: tag("một số âm, một số dương: khác dấu", NEGATIVE),
      },
      { tex: "(-375) \\cdot 959 < 0", tag: tag("tích âm", NEGATIVE) },
    ],
    "steps",
  ),
  "sbt-3-27c-giai": lines(
    "−278 và −864 đều là số âm nên tích dương",
    [
      { tex: "(-278) \\cdot (-864)" },
      {
        tex: "-278 < 0 \\quad ; \\quad -864 < 0",
        tag: tag("hai số âm: cùng dấu", POSITIVE),
      },
      {
        tex: "(-278) \\cdot (-864) > 0",
        tag: tag("tích dương", POSITIVE),
      },
    ],
    "steps",
  ),

  // Bài 3.28
  "sbt-goi-y-so-sanh-dau": lines(
    "Xét dấu của mỗi tích rồi so sánh",
    [
      {
        tex: "(-3) \\cdot 8 < 0",
        tag: tag("khác dấu: tích âm", NEGATIVE),
      },
      {
        tex: "2 \\cdot 5 > 0",
        tag: tag("cùng dấu: tích dương", POSITIVE),
      },
      {
        tex: "(-3) \\cdot 8 < 2 \\cdot 5",
        tag: tag("số âm bé hơn số dương", NOTE),
      },
    ],
    "hint",
  ),
  "sbt-goi-y-so-sanh-cung-dau": lines(
    "Hai tích cùng dấu: tính ra rồi so sánh",
    [
      {
        tex: "(-3) \\cdot (-8) = 24",
        tag: tag("cùng dấu: tích dương", POSITIVE),
      },
      {
        tex: "(-4) \\cdot (-5) = 20",
        tag: tag("cùng dấu: tích dương", POSITIVE),
      },
      { tex: "24 > 20" },
    ],
    "hint",
  ),
  "sbt-nhac-lai-so-sanh": rows(
    "So sánh số âm với số dương và hai số âm với nhau",
    [
      {
        tex: "-3 < 5",
        tag: tag("số âm nhỏ hơn mọi số dương", NEGATIVE),
      },
      {
        tex: "-12 < -8",
        tag: tag("bỏ dấu −: 12 lớn hơn 8 nên −12 nhỏ hơn −8", NOTE),
      },
    ],
  ),
  "sbt-goi-y-so-sanh-am": lines(
    "Hai số âm: bỏ dấu − rồi so sánh",
    [
      {
        tex: "-40 \\quad ; \\quad -52",
        tag: tag("bỏ dấu −: 40 và 52", NOTE),
      },
      { tex: "52 > 40", tag: tag("52 lớn hơn 40", NOTE) },
      { tex: "-52 < -40" },
    ],
    "hint",
  ),
  "sbt-3-28a-giai": lines(
    "So sánh (+32) · (−25) với (−7) · (−8)",
    [
      {
        tex: "32 \\cdot (-25) = -800",
        tag: tag("khác dấu: tích âm", NEGATIVE),
      },
      {
        tex: "(-7) \\cdot (-8) = 56",
        tag: tag("cùng dấu: tích dương", POSITIVE),
      },
      { tex: "-800 < 56", tag: tag("số âm bé hơn số dương", NOTE) },
    ],
    "steps",
  ),
  "sbt-3-28b-giai": lines(
    "So sánh (−44) · (−5) với (−11) · (−20)",
    [
      {
        tex: "(-44) \\cdot (-5) = 220",
        tag: tag("cùng dấu: tích dương", POSITIVE),
      },
      {
        tex: "(-11) \\cdot (-20) = 220",
        tag: tag("cùng dấu: tích dương", POSITIVE),
      },
      { tex: "220 = 220", tag: tag("hai tích bằng nhau", NOTE) },
    ],
    "steps",
  ),
  "sbt-3-28c-giai": lines(
    "So sánh (−24) · (+25) với (+30) · (−21)",
    [
      {
        tex: "(-24) \\cdot 25 = -600",
        tag: tag("khác dấu: tích âm", NEGATIVE),
      },
      {
        tex: "30 \\cdot (-21) = -630",
        tag: tag("khác dấu: tích âm", NEGATIVE),
      },
      {
        tex: "-630 < -600",
        tag: tag("bỏ dấu −: 630 lớn hơn 600 nên −630 nhỏ hơn −600", NOTE),
      },
    ],
    "steps",
  ),

  // Bài 3.29
  "sbt-goi-y-b-duong": lines(
    "Cho a = −7: thử với b là số dương",
    [
      { tex: "a = -7" },
      { tex: "b = 3", tag: tag("b là số dương", POSITIVE) },
      { tex: "(-7) \\cdot 3 = -21", tag: tag("khác dấu: tích âm", NEGATIVE) },
      { tex: "(-7) \\cdot (-3) = 21" },
    ],
    "hint",
  ),
  "sbt-goi-y-b-am": lines(
    "Cho a = −7: thử với b là số âm",
    [
      { tex: "a = -7" },
      { tex: "b = -3", tag: tag("b là số âm", NEGATIVE) },
      {
        tex: "(-7) \\cdot (-3) = 21",
        tag: tag("cùng dấu: tích dương", POSITIVE),
      },
      { tex: "(-7) \\cdot 3 = -21" },
    ],
    "hint",
  ),
  "sbt-3-29a-giai": lines(
    "a là số âm và tích a · b dương thì b là số âm",
    [
      { tex: "a < 0", tag: tag("a là số âm", NEGATIVE) },
      {
        tex: "a \\cdot b > 0",
        tag: tag("tích dương: hai thừa số cùng dấu", POSITIVE),
      },
      { tex: "b < 0", tag: tag("b cùng dấu với a: số âm", NEGATIVE) },
    ],
    "steps",
  ),
  "sbt-3-29b-giai": lines(
    "a là số âm và tích a · b âm thì b là số dương",
    [
      { tex: "a < 0", tag: tag("a là số âm", NEGATIVE) },
      {
        tex: "a \\cdot b < 0",
        tag: tag("tích âm: hai thừa số khác dấu", NEGATIVE),
      },
      { tex: "b > 0", tag: tag("b khác dấu với a: số dương", POSITIVE) },
    ],
    "steps",
  ),

  // Bài 3.30
  "sbt-goi-y-bang-cot": lines(
    "Một cột của bảng có x = −3 và y = −9",
    [
      {
        tex: "x = -3 \\quad ; \\quad y = -9",
        tag: tag("thay vào ô x · y", NOTE),
      },
      {
        tex: "x \\cdot y = (-3) \\cdot (-9)",
        tag: tag("cùng dấu: tích dương", POSITIVE),
      },
      { tex: "= 27" },
    ],
    "hint",
  ),
  "sbt-goi-y-bang": lines(
    "Mỗi cột: xét dấu của x và y rồi nhân hai phần số tự nhiên",
    [
      {
        tex: "(-6) \\cdot 12 = -72",
        tag: tag("khác dấu: tích âm", NEGATIVE),
      },
      {
        tex: "(-6) \\cdot (-12) = 72",
        tag: tag("cùng dấu: tích dương", POSITIVE),
      },
      {
        tex: "(-1) \\cdot 12 = -12",
        tag: tag("nhân với −1: chỉ đổi dấu", NOTE),
      },
      { tex: "0 \\cdot (-14) = 0" },
    ],
    "hint",
  ),
  "sbt-3-30-giai": rows("Tích x · y của từng cột", [
    {
      tex: `(-28) \\cdot 15 = ${neg(-420)}`,
      tag: tag("cột 1: khác dấu", NEGATIVE),
    },
    {
      tex: `55 \\cdot (-8) = ${neg(-440)}`,
      tag: tag("cột 2: khác dấu", NEGATIVE),
    },
    {
      tex: `(-27) \\cdot (-35) = ${pos(945)}`,
      tag: tag("cột 3: cùng dấu", POSITIVE),
    },
    {
      tex: `(-25) \\cdot (-280) = ${pos("7\\,000")}`,
      tag: tag("cột 4: cùng dấu", POSITIVE),
    },
    {
      tex: `0 \\cdot (-653) = ${zero}`,
      tag: tag("cột 5: có thừa số 0", NOTE),
    },
    {
      tex: `(-364) \\cdot 1 = ${neg(-364)}`,
      tag: tag("cột 6: nhân với 1", NOTE),
    },
    {
      tex: `(-1) \\cdot 293 = ${neg(-293)}`,
      tag: tag("cột 7: nhân với −1", NOTE),
    },
    {
      tex: `(-532) \\cdot (-1) = ${pos(532)}`,
      tag: tag("cột 8: nhân với −1", NOTE),
    },
  ]),

  // Bài 3.31
  "sbt-goi-y-tim-x-mot": lines(
    "Tìm x biết 6 · (x + 3) = 0",
    [
      { tex: "6 \\cdot (x + 3) = 0" },
      {
        tex: "x + 3 = 0",
        tag: tag("6 khác 0 nên thừa số kia bằng 0", NOTE),
      },
      { tex: "x = -3" },
    ],
    "hint",
  ),
  "sbt-goi-y-tim-x-hai": lines(
    "Tìm x biết (x − 2) · (x + 7) = 0",
    [
      { tex: "(x - 2) \\cdot (x + 7) = 0" },
      {
        tex: "x - 2 = 0 \\to x = 2",
        tag: tag("thừa số đầu bằng 0", NOTE),
      },
      {
        tex: "x + 7 = 0 \\to x = -7",
        tag: tag("thừa số sau bằng 0", NOTE),
      },
    ],
    "hint",
  ),
  "sbt-goi-y-am-x-hai": lines(
    "Tìm x biết (−x) · (x − 5) = 0",
    [
      { tex: "(-x) \\cdot (x - 5) = 0" },
      {
        tex: "x - 5 = 0 \\to x = 5",
        tag: tag("thừa số sau bằng 0", NOTE),
      },
      {
        tex: "-x = 0 \\to x = 0",
        tag: tag("thừa số đầu bằng 0", NOTE),
      },
    ],
    "hint",
  ),
  "sbt-3-31a-giai": lines(
    "9 · (x + 28) = 0 thì thừa số x + 28 bằng 0",
    [
      { tex: "9 \\cdot (x + 28) = 0" },
      {
        tex: "x + 28 = 0",
        tag: tag("9 khác 0 nên thừa số kia bằng 0", NOTE),
      },
      { tex: `x = ${neg(-28)}`, tag: tag("giá trị cần tìm", PRODUCT) },
    ],
    "steps",
  ),
  "sbt-3-31b-giai": lines(
    "Tích bằng 0 thì có một thừa số bằng 0",
    [
      { tex: "(27 - x) \\cdot (x + 9) = 0" },
      {
        tex: `27 - x = 0 \\to x = ${pos(27)}`,
        tag: tag("thừa số đầu bằng 0", NOTE),
      },
      {
        tex: `x + 9 = 0 \\to x = ${neg(-9)}`,
        tag: tag("thừa số sau bằng 0", NOTE),
      },
      {
        tex: "x = 27 \\quad ; \\quad x = -9",
        tag: tag("hai giá trị cần tìm", PRODUCT),
      },
    ],
    "steps",
  ),
  "sbt-3-31c-giai": lines(
    "Tích bằng 0 thì có một thừa số bằng 0",
    [
      { tex: "(-x) \\cdot (x - 43) = 0" },
      {
        tex: `-x = 0 \\to x = ${zero}`,
        tag: tag("thừa số đầu bằng 0", NOTE),
      },
      {
        tex: `x - 43 = 0 \\to x = ${pos(43)}`,
        tag: tag("thừa số sau bằng 0", NOTE),
      },
      {
        tex: "x = 0 \\quad ; \\quad x = 43",
        tag: tag("hai giá trị cần tìm", PRODUCT),
      },
    ],
    "steps",
  ),

  // Bài 3.32
  "sbt-goi-y-trong-ngoac": lines(
    "Tính trong ngoặc trước",
    [
      { tex: "(8 - 3) \\cdot (-4)" },
      {
        tex: "= 5 \\cdot (-4)",
        tag: tag("tính trong ngoặc trước", NOTE),
      },
      { tex: "= -20" },
    ],
    "hint",
  ),
  "sbt-goi-y-hai-tich": lines(
    "Tính trong hai ngoặc trước, rồi đổi tích thứ hai để có thừa số chung",
    [
      { tex: steps("(6 - 2) \\cdot (-3)", "+ (-3 - 1) \\cdot 5") },
      {
        tex: "= 4 \\cdot (-3) + (-4) \\cdot 5",
        tag: tag("tính trong ngoặc trước", NOTE),
      },
      {
        tex: "= 4 \\cdot (-3) + 4 \\cdot (-5)",
        tag: tag("(−4) · 5 = 4 · (−5)", NOTE),
      },
      { tex: "= -32" },
    ],
    "hint",
  ),
  "sbt-goi-y-3-32a": lines(
    "Tính trong ngoặc, rồi đưa thừa số chung 10 ra ngoài",
    [
      { tex: steps("(16 - 6) \\cdot (-4)", "+ (-9 - 1) \\cdot 7") },
      {
        tex: "= 10 \\cdot (-4) + (-10) \\cdot 7",
        tag: tag("tính trong ngoặc trước", NOTE),
      },
      {
        tex: "= 10 \\cdot (-4) + 10 \\cdot (-7)",
        tag: tag("(−10) · 7 = 10 · (−7)", NOTE),
      },
      {
        tex: "= 10 \\cdot [(-4) + (-7)]",
        tag: tag("đưa 10 ra ngoài", NOTE),
      },
      { tex: "= -110" },
    ],
    "hint",
  ),
  "sbt-3-32a-giai": lines(
    "Tính trong ngoặc, rồi đưa thừa số chung 20 ra ngoài",
    [
      { tex: steps("(29 - 9) \\cdot (-9)", "+ (-13 - 7) \\cdot 21") },
      {
        tex: "= 20 \\cdot (-9) + (-20) \\cdot 21",
        tag: tag("tính trong ngoặc trước", NOTE),
      },
      {
        tex: "= 20 \\cdot (-9) + 20 \\cdot (-21)",
        tag: tag("(−20) · 21 = 20 · (−21)", NOTE),
      },
      {
        tex: "= 20 \\cdot [(-9) + (-21)]",
        tag: tag("đưa 20 ra ngoài", NOTE),
      },
      { tex: `= 20 \\cdot (-30) = ${neg(-600)}`, tag: tag("tích", PRODUCT) },
    ],
    "steps",
  ),
  "sbt-goi-y-nhan-hieu": lines(
    "Đổi phép trừ thành cộng với số đối, rồi nhân từng số hạng",
    [
      { tex: "(-2) \\cdot (5 - 9)" },
      {
        tex: "= (-2) \\cdot [5 + (-9)]",
        tag: tag("trừ là cộng với số đối", NOTE),
      },
      {
        tex: "= (-2) \\cdot 5 + (-2) \\cdot (-9)",
        tag: tag("nhân với từng số hạng", NOTE),
      },
      { tex: "= -10 + 18 = 8" },
    ],
    "hint",
  ),
  "sbt-goi-y-doi-nhau": lines(
    "Hai số đối nhau cộng lại thì được 0",
    [
      { tex: "(-4) \\cdot 7 + 7 \\cdot 4 + 3 \\cdot 5" },
      {
        tex: steps("= -(4 \\cdot 7) + 4 \\cdot 7", "+ 3 \\cdot 5"),
        tag: tag("7 · 4 = 4 · 7: đổi chỗ", NOTE),
      },
      {
        tex: "= 0 + 3 \\cdot 5",
        tag: tag("hai số đối nhau cộng lại thì được 0", NOTE),
      },
      { tex: "= 15" },
    ],
    "hint",
  ),
  "sbt-goi-y-3-32b": lines(
    "Đổi phép trừ thành cộng với số đối, nhân từng số hạng, bỏ hai số đối nhau",
    [
      { tex: steps("(-2) \\cdot (4 - 7)", "- 4 \\cdot (7 - 2)") },
      {
        tex: steps("= (-2) \\cdot (4 - 7)", "+ (-4) \\cdot (7 - 2)"),
        tag: tag("số đối của 4 · (7 − 2) là (−4) · (7 − 2)", NOTE),
      },
      {
        tex: steps("= (-2) \\cdot [4 + (-7)]", "+ (-4) \\cdot [7 + (-2)]"),
        tag: tag("trừ là cộng với số đối", NOTE),
      },
      {
        tex: steps(
          "= (-2) \\cdot 4 + 2 \\cdot 7",
          "+ (-4) \\cdot 7 + 4 \\cdot 2",
        ),
        tag: tag("nhân với từng số hạng", NOTE),
      },
      {
        tex: "= 2 \\cdot 7 + (-4) \\cdot 7",
        tag: tag("(−2) · 4 và 4 · 2 là hai số đối nhau, cộng lại bằng 0", NOTE),
      },
      { tex: "= [2 + (-4)] \\cdot 7", tag: tag("đưa 7 ra ngoài", NOTE) },
      { tex: "= -14" },
    ],
    "hint",
  ),
  "sbt-3-32b-giai": lines(
    "Bỏ hai số đối nhau, rồi đưa thừa số chung 316 ra ngoài",
    [
      { tex: steps("(-157) \\cdot (127 - 316)", "- 127 \\cdot (316 - 157)") },
      {
        tex: steps(
          "= (-157) \\cdot (127 - 316)",
          "+ (-127) \\cdot (316 - 157)",
        ),
        tag: tag("số đối của 127 · (316 − 157) là (−127) · (316 − 157)", NOTE),
      },
      {
        tex: steps(
          "= (-157) \\cdot [127 + (-316)]",
          "+ (-127) \\cdot [316 + (-157)]",
        ),
        tag: tag("trừ là cộng với số đối", NOTE),
      },
      {
        tex: steps(
          "= (-157) \\cdot 127 + 157 \\cdot 316",
          "+ (-127) \\cdot 316 + 127 \\cdot 157",
        ),
        tag: tag("nhân với từng số hạng", NOTE),
      },
      {
        tex: steps("= 157 \\cdot 316", "+ (-127) \\cdot 316"),
        tag: tag(
          "(−157) · 127 và 127 · 157 là hai số đối nhau, cộng lại bằng 0",
          NOTE,
        ),
      },
      {
        tex: "= [157 + (-127)] \\cdot 316",
        tag: tag("đưa 316 ra ngoài", NOTE),
      },
      {
        tex: `= 30 \\cdot 316 = ${pos("9\\,480")}`,
        tag: tag("tích", PRODUCT),
      },
    ],
    "steps",
  ),

  // Bài 3.33
  "sbt-goi-y-vai-tang": lines(
    "Mỗi cái áo thêm 3 dm vải, may 20 cái áo",
    [
      { tex: "x = 3", tag: tag("mỗi cái áo thêm 3 dm", NOTE) },
      { tex: "3 \\cdot 20", tag: tag("nhân với 20 cái áo", NOTE) },
      { tex: "= 60" },
    ],
    "hint",
  ),
  "sbt-goi-y-vai-420": lines(
    "Mỗi bộ thêm 15 dm vải, may 320 bộ",
    [
      { tex: "x = 15", tag: tag("mỗi bộ thêm 15 dm", NOTE) },
      { tex: "15 \\cdot 320", tag: tag("nhân với 320 bộ", NOTE) },
      {
        tex: "= 15 \\cdot 300 + 15 \\cdot 20",
        tag: tag("tách 320 = 300 + 20", NOTE),
      },
      { tex: "= 4\\,500 + 300 = 4\\,800" },
    ],
    "hint",
  ),
  "sbt-goi-y-vai-giam": lines(
    "Mỗi cái áo thay đổi −2 dm vải, may 30 cái áo",
    [
      { tex: "x = -2", tag: tag("mỗi cái áo thay đổi −2 dm", NEGATIVE) },
      { tex: "(-2) \\cdot 30", tag: tag("nhân với 30 cái áo", NOTE) },
      { tex: "= -60" },
    ],
    "hint",
  ),
  "sbt-goi-y-vai-420-am": lines(
    "Mỗi bộ thay đổi −6 dm vải, may 150 bộ",
    [
      { tex: "x = -6", tag: tag("mỗi bộ thay đổi −6 dm", NEGATIVE) },
      { tex: "(-6) \\cdot 150", tag: tag("nhân với 150 bộ", NOTE) },
      {
        tex: "= -(6 \\cdot 150)",
        tag: tag("khác dấu: viết dấu − ở trước", NOTE),
      },
      { tex: "= -900" },
    ],
    "hint",
  ),
  "sbt-3-33a-giai": lines(
    "Mỗi bộ thêm 18 dm vải, may 420 bộ",
    [
      { tex: "x = 18", tag: tag("mỗi bộ thêm 18 dm", POSITIVE) },
      {
        tex: "18 \\cdot 420",
        tag: tag("số vải tăng thêm của 420 bộ", NOTE),
      },
      {
        tex: "= 18 \\cdot 400 + 18 \\cdot 20",
        tag: tag("tách 420 = 400 + 20", NOTE),
      },
      {
        tex: `= 7\\,200 + 360 = ${pos("7\\,560")}`,
        tag: tag("tăng thêm 7 560 dm", POSITIVE),
      },
    ],
    "steps",
  ),
  "sbt-3-33b-giai": lines(
    "Mỗi bộ thay đổi −7 dm vải, may 420 bộ",
    [
      { tex: "x = -7", tag: tag("mỗi bộ thay đổi −7 dm", NEGATIVE) },
      {
        tex: "(-7) \\cdot 420",
        tag: tag("số vải thay đổi của 420 bộ", NOTE),
      },
      {
        tex: "= -(7 \\cdot 420)",
        tag: tag("khác dấu: viết dấu − ở trước", NOTE),
      },
      {
        tex: `= ${neg("-2\\,940")}`,
        tag: tag("số âm: vải giảm 2 940 dm", NEGATIVE),
      },
    ],
    "steps",
  ),

  // Bài 3.34
  "sbt-goi-y-ba-so-tich-am": lines(
    "Ba số có tích là số âm: thử vài bộ ba số",
    [
      {
        tex: "(-2) \\cdot 3 \\cdot 1 = -6",
        tag: tag("tích là số âm", NEGATIVE),
      },
      {
        tex: "(-1) \\cdot (-4) \\cdot (-2) = -8",
        tag: tag("tích là số âm", NEGATIVE),
      },
      { tex: "4 \\cdot (-3) \\cdot 1 = -12" },
    ],
    "hint",
  ),
  "sbt-goi-y-nam-so": lines(
    "Tích của cả năm số là số a nhân với tích của bốn số còn lại",
    [
      { tex: "a = -4", tag: tag("số a là số âm", NEGATIVE) },
      {
        tex: "(-4) \\cdot 3",
        tag: tag("tích của bốn số còn lại là 3", POSITIVE),
      },
      { tex: "= -12" },
    ],
    "hint",
  ),
  "sbt-goi-y-3-34": lines(
    "Năm số −1, −2, −3, −1, −2: tích của ba số bất kì đều âm",
    [
      {
        tex: "(-1) \\cdot (-2) \\cdot (-3) = -6",
        tag: tag("ba số này có tích âm, trong đó có số âm", NEGATIVE),
      },
      {
        tex: "(-2) \\cdot (-3) \\cdot (-1) = -6",
        tag: tag("ba số khác cũng có tích âm, trong đó có số âm", NEGATIVE),
      },
      {
        tex: steps(
          "(-1) \\cdot (-2) \\cdot (-3)",
          "\\cdot (-1) \\cdot (-2) = -12",
        ),
      },
    ],
    "hint",
  ),
  "sbt-3-34-giai": lines(
    "Ba số bất kì có tích âm, nên lần lượt tìm được a và b đều âm",
    [
      {
        tex: "a < 0",
        tag: tag(
          "chọn ba số bất kì: tích âm, nên có ít nhất một số âm tên a",
          NEGATIVE,
        ),
      },
      {
        tex: "b < 0",
        tag: tag(
          "bỏ a ra, chọn ba trong bốn số còn lại: vẫn có số âm tên b",
          NEGATIVE,
        ),
      },
      {
        tex: "q < 0",
        tag: tag("bỏ a và b ra, ba số còn lại có tích q âm theo đề", NEGATIVE),
      },
      {
        tex: "b \\cdot q > 0",
        tag: tag("âm nhân âm: tích của bốn số còn lại dương", POSITIVE),
      },
      {
        tex: "a \\cdot (b \\cdot q) < 0",
        tag: tag("âm nhân dương: tích của năm số là số âm", NEGATIVE),
      },
    ],
    "steps",
  ),

  sticker: { kind: "sticker" },
};

// Regions of the pictures a `tapRegion` exercise taps: none in this lesson.
export function regionsOf(_spec: VisualSpec): string[] | undefined {
  return undefined;
}
