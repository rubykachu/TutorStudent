import type { ConceptColor } from "@/schema/content";
import type { LinesSpec, Row, RowsSpec } from "@/visuals/shared/formula-rows";
import type { NumberLineSpec } from "@/visuals/shared/number-line";
import type { ChipsSpec } from "@/visuals/shared/pick-chips";

// Every picture of the lesson that is drawn from numbers: the registry builds
// one entry per item (id `phep-chia-het-uoc-va-boi-cua-mot-so-nguyen.visual.<key>`),
// so a new example is one item here and its id in lesson.json. Pure data, no
// React, so `content:check` reads it.

export { LESSON_SLUG } from "./logic";

export type VisualSpec =
  // Formulas stacked, each with an optional tag (see `RowsSpec`).
  | ({ kind: "rows" } & RowsSpec)
  // Lines of a worked example, one more on every step (see `LinesSpec`).
  | ({ kind: "lines" } & LinesSpec)
  // The number line with points on it (see `NumberLineSpec`).
  | ({ kind: "line" } & NumberLineSpec)
  // Numbers or short sums the child taps to pick, state { i0, i1, … } (see
  // `ChipsSpec`).
  | ({ kind: "chips" } & ChipsSpec)
  | { kind: "sticker" };

export type SpecKind = VisualSpec["kind"];

// Kinds the child acts on (counted as interactive by `--stats`).
export const INTERACTIVE_KINDS: ReadonlySet<SpecKind> = new Set(["chips"]);

// Validator id of the `manipulate` exercises each interactive kind serves:
// the shared pick validator (one key per chip, 1 = picked).
export const VALIDATOR_IDS = { chips: "chon-dung" } as const;

// Colours of the concepts of the lesson, as the pictures use them.
const POSITIVE = "lime";
const NEGATIVE = "pink";
const DIVISOR = "violet";
const MULTIPLE = "blue";
const COMMON = "teal";
const SUM = "amber";
const DIFFERENCE = "teal";
// The colour of a label that names a step ("đổi dấu cả hai thừa số") rather
// than a concept of the lesson. Its marker (a pentagon) cannot be read as a
// sign, unlike the cross of sky or the bar of slate; the common divisor
// (also teal) never shares a picture with such a label.
const NOTE = "teal";

const tag = (text: string, color: ConceptColor) => ({ text, color });

// A result written in the colour of its sign.
const neg = (n: number | string) => `\\concept{pink}{${n}}`;
const pos = (n: number | string) => `\\concept{lime}{${n}}`;

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

const chips = (
  items: readonly string[],
  wants?: readonly number[],
  done?: string,
): VisualSpec => ({
  kind: "chips",
  items,
  ...(wants ? { wants } : {}),
  ...(done ? { done } : {}),
});

// A worked step on two lines, so a long chain of equalities never breaks in
// the middle of a bracket on a narrow screen.
const steps = (first: string, second: string) =>
  `\\begin{gathered} ${first} \\\\ ${second} \\end{gathered}`;

// Worked example of a product split into two positive factors, then the
// same product with both factors negated.
const SPLIT_ROWS = [
  {
    tex: "10 = 1 \\cdot 10 = 2 \\cdot 5",
    tag: tag("tích hai số dương", POSITIVE),
  },
  {
    tex: steps("10 = (-1) \\cdot (-10)", "= (-2) \\cdot (-5)"),
    tag: tag("đổi dấu cả hai thừa số", NOTE),
  },
] as const satisfies readonly Row[];

export const VISUAL_SPECS: Readonly<Record<string, VisualSpec>> = {
  // 1. Phép chia hết
  "chia-het-vi-du": rows(
    "Ba phép chia hết, mỗi phép có số bị chia bằng số chia nhân với thương",
    [
      { tex: "12 : 3 = 4", tag: tag("vì 12 = 3 · 4", NOTE) },
      { tex: "(-12) : 3 = -4", tag: tag("vì −12 = 3 · (−4)", NOTE) },
      { tex: "(-12) : (-3) = 4", tag: tag("vì −12 = (−3) · 4", NOTE) },
    ],
  ),
  "chon-chia-het-cung-lam": chips(
    ["(−20) : 5", "(−20) : 3", "18 : (−6)", "7 : (−2)"],
    [0, 2],
    "(−20) = 5 · (−4) và 18 = (−6) · (−3), nên hai phép này chia hết.",
  ),
  "chia-0-vi-du": rows("Số 0 chia cho một số khác 0 thì bằng 0", [
    { tex: "0 : 5 = 0", tag: tag("vì 0 = 5 · 0", NOTE) },
    { tex: "0 : (-7) = 0", tag: tag("vì 0 = (−7) · 0", NOTE) },
  ]),
  "chon-chia-het-24": chips([
    "(−24) : 8",
    "(−24) : 5",
    "15 : (−3)",
    "(−9) : 4",
  ]),
  "goi-y-chia-het": lines(
    "Tìm thương: số nhân với số chia để được số bị chia",
    [
      { tex: "(-18) : 3" },
      { tex: "3 \\cdot q = -18", tag: tag("tìm số q", NOTE) },
      { tex: "q = -6" },
    ],
    "hint",
  ),

  // 2. Chia hai số cùng dấu
  "cung-dau-nhiet-do": rows(
    "Mỗi giờ nhiệt độ thay đổi −3 độ, sau 4 giờ thay đổi −12 độ",
    [
      {
        tex: "(-3) \\cdot 4 = -12",
        tag: tag("4 giờ, mỗi giờ −3 độ", NEGATIVE),
      },
      {
        tex: "(-12) : (-3) = \\concept{lime}{4}",
        tag: tag("số giờ là số dương", POSITIVE),
      },
    ],
  ),
  "cung-dau-vi-du": rows("Chia hai số cùng dấu thì thương là số dương", [
    {
      tex: "(-15) : (-5) = \\concept{lime}{3}",
      tag: tag("cùng dấu −", POSITIVE),
    },
    { tex: "18 : 6 = \\concept{lime}{3}", tag: tag("cùng dấu +", POSITIVE) },
    {
      tex: "(-24) : (-4) = \\concept{lime}{6}",
      tag: tag("cùng dấu −", POSITIVE),
    },
  ]),
  "chon-cung-dau-cung-lam": chips(
    ["(−8) : (−2)", "8 : (−2)", "(−9) : 3", "9 : 3"],
    [0, 3],
    "(−8) : (−2) = 4 và 9 : 3 = 3, mỗi phép có hai số cùng dấu.",
  ),
  "goi-y-cung-dau": lines(
    "Chia hai số cùng dấu: chia hai phần số tự nhiên, thương là số dương",
    [
      { tex: "(-40) : (-5)" },
      { tex: "= 40 : 5", tag: tag("cùng dấu: thương dương", NOTE) },
      { tex: "= 8" },
    ],
    "hint",
  ),

  // 3. Chia hai số khác dấu
  "khac-dau-chia-no": rows(
    "Bốn bạn cùng nợ 20 nghìn đồng, chia đều thì mỗi bạn nợ 5 nghìn đồng",
    [
      {
        tex: "(-20) : 4 = \\concept{pink}{-5}",
        tag: tag("mỗi bạn nợ 5 nghìn", NEGATIVE),
      },
      { tex: "4 \\cdot (-5) = -20", tag: tag("4 bạn nợ 20 nghìn", NEGATIVE) },
    ],
  ),
  "khac-dau-vi-du": rows("Chia hai số khác dấu thì thương là số âm", [
    {
      tex: "(-18) : 6 = \\concept{pink}{-3}",
      tag: tag("khác dấu", NEGATIVE),
    },
    {
      tex: "18 : (-6) = \\concept{pink}{-3}",
      tag: tag("khác dấu", NEGATIVE),
    },
    {
      tex: "(-35) : 7 = \\concept{pink}{-5}",
      tag: tag("khác dấu", NEGATIVE),
    },
  ]),
  "chon-khac-dau-cung-lam": chips(
    ["(−10) : 5", "10 : 5", "10 : (−5)", "(−10) : (−5)"],
    [0, 2],
    "(−10) : 5 = −2 và 10 : (−5) = −2, mỗi phép có hai số khác dấu.",
  ),
  "goi-y-khac-dau": lines(
    "Chia hai số khác dấu: chia hai phần số tự nhiên, thương là số âm",
    [
      { tex: "(-36) : 4" },
      { tex: "= -(36 : 4)", tag: tag("khác dấu: thương âm", NOTE) },
      { tex: "= -9" },
    ],
    "hint",
  ),

  // 4. Bốn phép chia từ một phép chia
  "bon-phep-chia": rows(
    "Từ 72 : 8 = 9 suy ra thương của ba phép chia còn lại bằng cách đổi dấu",
    [
      {
        tex: "72 : 8 = \\concept{lime}{9}",
        tag: tag("phép chia đã biết", POSITIVE),
      },
      {
        tex: "(-72) : (-8) = \\concept{lime}{9}",
        tag: tag("đổi dấu cả hai số: giữ nguyên", POSITIVE),
      },
      {
        tex: "(-72) : 8 = \\concept{pink}{-9}",
        tag: tag("đổi dấu số bị chia: đổi dấu", NEGATIVE),
      },
      {
        tex: "72 : (-8) = \\concept{pink}{-9}",
        tag: tag("đổi dấu số chia: đổi dấu", NEGATIVE),
      },
    ],
  ),
  "chon-thuong-am5-cung-lam": chips(
    ["(−45) : 9", "45 : (−9)", "(−45) : (−9)", "45 : 9"],
    [0, 1],
    "Biết 45 : 9 = 5, đổi dấu một số thì thương là −5.",
  ),

  "goi-y-doi-dau": lines(
    "Biết thương của hai phần số tự nhiên, đổi dấu một số thì thương đổi dấu",
    [
      { tex: "24 : 6 = 4" },
      {
        tex: "24 : (-6)",
        tag: tag("đổi dấu số chia: thương đổi dấu", NOTE),
      },
      { tex: "= -4" },
    ],
    "hint",
  ),

  // 5. Ước và bội
  "uoc-boi-12-3": rows(
    "12 chia hết cho −3, nên −3 là ước của 12 và 12 là bội của −3",
    [
      { tex: "12 \\chiahet (-3)", tag: tag("12 : (−3) = −4", NOTE) },
      { tex: "\\concept{violet}{-3}", tag: tag("ước của 12", DIVISOR) },
      { tex: "\\concept{blue}{12}", tag: tag("bội của −3", MULTIPLE) },
    ],
  ),
  "uoc-am-vi-du": rows(
    "Số 6 viết thành tích hai số dương và thành tích hai số âm",
    [
      { tex: "6 = 2 \\cdot 3", tag: tag("2 và 3 là ước của 6", DIVISOR) },
      {
        tex: "6 = (-2) \\cdot (-3)",
        tag: tag("−2 và −3 cũng là ước của 6", DIVISOR),
      },
    ],
  ),
  "chon-uoc-10-cung-lam": chips(
    ["5", "−2", "3", "−10", "4", "−1"],
    [0, 1, 3, 5],
    "10 chia hết cho 5, −2, −10 và −1, nên chúng là ước của 10. Còn 10 không chia hết cho 3 và 4.",
  ),
  "chon-uoc-12": chips(["6", "−4", "5", "−12", "7", "−1"]),

  // 6. Tìm các ước
  "uoc-6": lines(
    "Tìm các ước của 6: các ước dương, rồi thêm số đối của chúng",
    [
      {
        tex: "6 = 1 \\cdot 6 = 2 \\cdot 3",
        tag: tag("tìm các ước dương", NOTE),
      },
      { tex: "\\concept{violet}{1,\\ 2,\\ 3,\\ 6}" },
      {
        tex: "\\concept{violet}{-1,\\ -2,\\ -3,\\ -6}",
        tag: tag("viết thêm số đối", NOTE),
      },
    ],
    "steps",
  ),
  "uoc-vi-du": rows("Các ước của 9 và các ước của −14, viết gọn bằng dấu ±", [
    { tex: "\\pm3", tag: tag("±3 là hai số 3 và −3", NOTE) },
    {
      tex: "\\pm1,\\ \\pm3,\\ \\pm9",
      tag: tag("các ước của 9", DIVISOR),
    },
    {
      tex: "\\pm1,\\ \\pm2,\\ \\pm7,\\ \\pm14",
      tag: tag("các ước của −14", DIVISOR),
    },
  ]),
  "chon-uoc-8-cung-lam": chips(
    ["−2", "4", "−8", "3", "1", "−5"],
    [0, 1, 2, 4],
    "−2, 4, −8 và 1 đều là ước của 8, còn 3 và −5 thì không.",
  ),
  "chon-uoc-15": chips(["−3", "5", "−15", "2", "−1", "4"]),

  // 7. Tìm các bội
  "boi-nhiet-do": rows(
    "Mỗi giờ nhiệt độ thay đổi −3 độ, các mức thay đổi là bội của −3",
    [
      { tex: "(-3) \\cdot 1 = -3", tag: tag("sau 1 giờ", MULTIPLE) },
      { tex: "(-3) \\cdot 2 = -6", tag: tag("sau 2 giờ", MULTIPLE) },
      { tex: "(-3) \\cdot 3 = -9", tag: tag("sau 3 giờ", MULTIPLE) },
    ],
  ),
  "boi-4-vi-du": rows(
    "Các bội của 4: nhân 4 lần lượt với 1, 2, 3 và cứ thế tiếp, rồi viết thêm số đối và số 0",
    [
      {
        tex: "4 \\cdot 1 = \\concept{blue}{4}",
        tag: tag("bội dương", POSITIVE),
      },
      {
        tex: "4 \\cdot 2 = \\concept{blue}{8}",
        tag: tag("bội dương", POSITIVE),
      },
      {
        tex: "4 \\cdot 3 = \\concept{blue}{12},\\ \\ldots",
        tag: tag("bội dương", POSITIVE),
      },
      {
        tex: "\\concept{blue}{-4},\\ \\concept{blue}{-8},\\ \\concept{blue}{-12},\\ \\ldots",
        tag: tag("số đối là bội âm", NEGATIVE),
      },
      {
        tex: "4 \\cdot 0 = \\concept{blue}{0}",
        tag: tag("0 cũng là bội của 4", MULTIPLE),
      },
    ],
  ),
  "chon-boi-5-cung-lam": chips(
    ["−10", "15", "−12", "0", "20", "7"],
    [0, 1, 3, 4],
    "−10, 15, 0 và 20 đều là bội của 5, còn −12 và 7 thì không.",
  ),
  "chon-boi-6": chips(["−12", "18", "−9", "0", "24", "10"]),

  // 8. Bội trong một khoảng
  "thang-may-boi-4": {
    kind: "line",
    from: -5,
    to: 10,
    labelAt: [10],
    label: "Trục số từ −5 đến 10: thang máy dừng ở các tầng −4, 0, 4 và 8",
    layers: [
      { type: "point", at: -4, color: MULTIPLE },
      { type: "point", at: 0, color: MULTIPLE },
      { type: "point", at: 4, color: MULTIPLE },
      { type: "point", at: 8, color: MULTIPLE },
    ],
    mode: "still",
  },
  "boi-khoang-vi-du": rows("Các bội của 3 lớn hơn −10 và nhỏ hơn 10", [
    { tex: "-10 < x < 10", tag: tag("khoảng cần tìm", NOTE) },
    { tex: "3,\\ 6,\\ 9", tag: tag("bội dương trong khoảng", POSITIVE) },
    { tex: "-3,\\ -6,\\ -9", tag: tag("bội âm trong khoảng", NEGATIVE) },
    {
      tex: "-9,\\ -6,\\ -3,\\ 0,\\ 3,\\ 6,\\ 9",
      tag: tag("có thêm số 0", MULTIPLE),
    },
  ]),
  "chon-boi-5-khoang-cung-lam": chips(
    ["−15", "−10", "−5", "0", "5", "10", "15"],
    [1, 2, 3, 4, 5],
    "Các bội của 5 lớn hơn −12 và nhỏ hơn 12 là −10, −5, 0, 5 và 10.",
  ),

  // 9. Ước chung
  "uoc-chung-6-9": rows(
    "Các ước dương của 6 và của 9, và những ước dương chung",
    [
      { tex: "1,\\ 2,\\ 3,\\ 6", tag: tag("ước dương của 6", DIVISOR) },
      { tex: "1,\\ 3,\\ 9", tag: tag("ước dương của 9", DIVISOR) },
      { tex: "1,\\ 3", tag: tag("ước chung dương", COMMON) },
    ],
  ),
  "uoc-chung-vi-du": rows(
    "Các ước của 6 và của −9, và các ước chung của hai số",
    [
      {
        tex: "\\pm1,\\ \\pm2,\\ \\pm3,\\ \\pm6",
        tag: tag("các ước của 6", DIVISOR),
      },
      { tex: "\\pm1,\\ \\pm3,\\ \\pm9", tag: tag("các ước của −9", DIVISOR) },
      { tex: "\\pm1,\\ \\pm3", tag: tag("ước chung của 6 và −9", COMMON) },
    ],
  ),
  "chon-uc-8-12-cung-lam": chips(
    ["4", "−4", "3", "−3", "8", "−2"],
    [0, 1, 5],
    "4, −4 và −2 đều là ước của cả 8 và −12.",
  ),
  "chon-uc-12-18": chips(["6", "−3", "4", "−9", "−6", "12"]),

  // 10. Phân tích một số thành tích
  "ghe-10": rows("10 cái ghế xếp thành các hàng bằng nhau", [
    { tex: "10 = 1 \\cdot 10", tag: tag("1 hàng, mỗi hàng 10 ghế", POSITIVE) },
    { tex: "10 = 2 \\cdot 5", tag: tag("2 hàng, mỗi hàng 5 ghế", POSITIVE) },
  ]),
  "phan-tich-10": lines(
    "Phân tích 10 thành tích hai số nguyên",
    SPLIT_ROWS,
    "steps",
  ),
  "phan-tich-10-xong": lines(
    "Phân tích 10 thành tích hai số nguyên",
    SPLIT_ROWS,
    "still",
  ),
  "chon-tich-35-cung-lam": chips(
    ["5 · 7", "(−5) · (−7)", "(−5) · 7", "(−35) · (−1)", "5 · 5"],
    [0, 1, 3],
    "35 = 5 · 7 = (−5) · (−7) = (−35) · (−1), còn (−5) · 7 = −35.",
  ),
  "chon-tich-14": chips(["(−1) · (−14)", "2 · (−7)", "(−7) · (−2)", "7 · 7"]),

  // 11. Tổng và hiệu cùng chia hết
  "tong-no": rows(
    "Hai khoản nợ đều chia đều được cho 6 bạn, tổng nợ cũng vậy",
    [
      { tex: "(-12) \\chiahet 6", tag: tag("nợ 12 nghìn", NEGATIVE) },
      { tex: "(-18) \\chiahet 6", tag: tag("nợ 18 nghìn", NEGATIVE) },
      {
        tex: "(-12) + (-18) = -30 \\chiahet 6",
        tag: tag("tổng nợ 30 nghìn", NEGATIVE),
      },
    ],
  ),
  "tong-hieu-vi-du": rows("Tổng và hiệu của hai số cùng chia hết cho 6", [
    { tex: "(-12) + 18 = 6 \\chiahet 6", tag: tag("tổng", SUM) },
    { tex: "(-12) - 18 = -30 \\chiahet 6", tag: tag("hiệu", DIFFERENCE) },
  ]),
  "chon-tong-4-cung-lam": chips(
    ["(−8) + 12", "(−8) + 6", "20 − (−8)", "7 − (−8)"],
    [0, 2],
    "(−8) + 12 = 4 và 20 − (−8) = 28, cả hai đều chia hết cho 4.",
  ),
  "chon-tong-6": chips(["(−24) + 18", "(−24) − 18", "(−24) + 15", "(−24) − 5"]),

  // 12. Tìm x để x + m chia hết cho x
  "tim-x-thu": rows("Thử x bằng 1, 2, 3, −1 và −3 với x + 3", [
    { tex: "1 + 3 = 4 \\chiahet 1", tag: tag("x = 1 được", NOTE) },
    {
      tex: "2 + 3 = 5 \\khongchiahet 2",
      tag: tag("x = 2 không được", NOTE),
    },
    { tex: "3 + 3 = 6 \\chiahet 3", tag: tag("x = 3 được", NOTE) },
    {
      tex: "(-1) + 3 = 2 \\chiahet (-1)",
      tag: tag("x = −1 được", NOTE),
    },
    {
      tex: "(-3) + 3 = 0 \\chiahet (-3)",
      tag: tag("x = −3 được, vì 0 chia hết cho −3", NOTE),
    },
  ]),
  "tim-x-3": lines(
    "Tìm x để x + 3 chia hết cho x",
    [
      { tex: "x + 3 \\chiahet x", tag: tag("điều cần có", NOTE) },
      {
        tex: "3 = (x + 3) - x \\chiahet x",
        tag: tag("x khác 0 chia hết cho x", NOTE),
      },
      {
        tex: "x = \\pm1,\\ \\pm3",
        tag: tag("x là ước của 3", DIVISOR),
      },
    ],
    "steps",
  ),
  "tim-x-vi-du": rows("Với x + 6 chia hết cho x, x là một ước của 6", [
    { tex: "x + 6 \\chiahet x", tag: tag("điều cần có", NOTE) },
    {
      tex: "x = \\pm1,\\ \\pm2,\\ \\pm3,\\ \\pm6",
      tag: tag("x là ước của 6", DIVISOR),
    },
  ]),
  "chon-x-8-cung-lam": chips(
    ["−4", "3", "8", "−8", "5", "2"],
    [0, 2, 3, 5],
    "−4, 8, −8 và 2 đều là ước của 8, nên x + 8 chia hết cho x. Với x = −8 thì x + 8 = 0, mà 0 chia hết cho −8.",
  ),
  "chon-x-10": chips(["−5", "4", "10", "−2", "3", "−10"]),

  // 13. Bài tập sách bài tập: the reminder of the section, the hint (other
  // numbers, stops before the result) and the solution (the exercise's own
  // numbers) of each workbook exercise.
  "sbt-nhac-lai-dau-thuong": rows(
    "Chia hai số nguyên: chia hai phần số tự nhiên rồi viết dấu cho thương",
    [
      {
        tex: `(-96) : (-8) = ${pos(12)}`,
        tag: tag("cùng dấu: thương dương", POSITIVE),
      },
      {
        tex: `96 : (-8) = ${neg(-12)}`,
        tag: tag("khác dấu: thương âm", NEGATIVE),
      },
      {
        tex: `(-96) : 8 = ${neg(-12)}`,
        tag: tag("khác dấu: thương âm", NEGATIVE),
      },
    ],
  ),
  "sbt-nhac-lai-uoc-tich": rows(
    "Các ước của −38 và các cách viết 38 thành tích hai số nguyên",
    [
      { tex: "\\pm2", tag: tag("±2 là hai số 2 và −2", NOTE) },
      {
        tex: "38 = 1 \\cdot 38 = 2 \\cdot 19",
        tag: tag("tích hai số dương", POSITIVE),
      },
      {
        tex: "\\concept{violet}{\\pm1,\\ \\pm2,\\ \\pm19,\\ \\pm38}",
        tag: tag("các ước của −38", DIVISOR),
      },
      {
        tex: steps("38 = (-1) \\cdot (-38)", "= (-2) \\cdot (-19)"),
        tag: tag("đổi dấu cả hai thừa số", NOTE),
      },
    ],
  ),
  "sbt-nhac-lai-boi-khoang": rows(
    "Các số nguyên chia hết cho 4, lớn hơn −8 và nhỏ hơn hoặc bằng 12",
    [
      { tex: "x \\chiahet 4", tag: tag("x chia hết cho 4", NOTE) },
      {
        tex: "-8 < x \\le 12",
        tag: tag("x lớn hơn −8, nhỏ hơn hoặc bằng 12", NOTE),
      },
      {
        tex: "4,\\ 8,\\ 12",
        tag: tag("bội dương, lấy cả 12", POSITIVE),
      },
      { tex: "-4", tag: tag("bội âm, bỏ −8", NEGATIVE) },
      {
        tex: "\\concept{blue}{-4,\\ 0,\\ 4,\\ 8,\\ 12}",
        tag: tag("có thêm số 0", MULTIPLE),
      },
    ],
  ),
  "sbt-tom-tat": rows("Tìm các ước và tìm bội trong một khoảng", [
    {
      tex: "\\concept{violet}{\\pm1,\\ \\pm3,\\ \\pm19,\\ \\pm57}",
      tag: tag("các ước của −57", DIVISOR),
    },
    {
      tex: "-25 < x \\le 40",
      tag: tag("khoảng cần tìm", NOTE),
      gapBefore: true,
    },
    {
      tex: "\\concept{blue}{-24,\\ -12,\\ 0,\\ 12,\\ 24,\\ 36}",
      tag: tag("bội của 12 trong khoảng", MULTIPLE),
    },
  ]),

  // Bài 3.35
  "sbt-goi-y-chia-am-5": lines(
    "Số dương chia cho số âm: chia hai phần số tự nhiên rồi viết dấu − ở trước",
    [
      { tex: "460 : (-5)" },
      {
        tex: "= -(460 : 5)",
        tag: tag("khác dấu: thương âm", NOTE),
      },
      { tex: `= ${neg(-92)}` },
    ],
    "hint",
  ),
  "sbt-3-35a-giai": lines(
    "735 : (−5): hai số khác dấu nên thương là số âm",
    [
      { tex: "735 : (-5)" },
      {
        tex: "= -(735 : 5)",
        tag: tag("khác dấu: thương âm", NOTE),
      },
      {
        tex: steps("700 : 5 = 140", "35 : 5 = 7"),
        tag: tag("chia từng phần", NOTE),
      },
      {
        tex: `= ${neg(-147)}`,
        tag: tag("140 + 7 = 147, thêm dấu −", NEGATIVE),
      },
    ],
    "steps",
  ),
  "sbt-goi-y-chia-cung-dau-12": lines(
    "Hai số cùng dấu: chia hai phần số tự nhiên, thương là số dương",
    [
      { tex: "(-372) : (-12)" },
      {
        tex: "= 372 : 12",
        tag: tag("cùng dấu: thương dương", NOTE),
      },
      {
        tex: `\\begin{gathered} 12 \\cdot 30 = 360 \\\\ 372 - 360 = 12 \\\\ 12 \\cdot 1 = 12 \\end{gathered}`,
        tag: tag("tìm thương từng phần", NOTE),
      },
      { tex: `= ${pos(31)}` },
    ],
    "hint",
  ),
  "sbt-3-35b-giai": lines(
    "(−528) : (−12): hai số cùng dấu nên thương là số dương",
    [
      { tex: "(-528) : (-12)" },
      {
        tex: "= 528 : 12",
        tag: tag("cùng dấu: thương dương", NOTE),
      },
      {
        tex: `\\begin{gathered} 12 \\cdot 40 = 480 \\\\ 528 - 480 = 48 \\\\ 12 \\cdot 4 = 48 \\end{gathered}`,
        tag: tag("tìm thương từng phần", NOTE),
      },
      {
        tex: `= ${pos(44)}`,
        tag: tag("40 + 4 = 44", POSITIVE),
      },
    ],
    "steps",
  ),
  "sbt-goi-y-chia-101": lines(
    "Hai số khác dấu: chia hai phần số tự nhiên rồi viết dấu − ở trước",
    [
      { tex: "(-6\\,060) : 101" },
      {
        tex: "= -(6\\,060 : 101)",
        tag: tag("khác dấu: thương âm", NOTE),
      },
      {
        tex: "101 \\cdot 6 = 606",
        tag: tag("tìm số nhân với 101", NOTE),
      },
      { tex: `= ${neg(-60)}` },
    ],
    "hint",
  ),
  "sbt-3-35c-giai": lines(
    "(−2 020) : 101: hai số khác dấu nên thương là số âm",
    [
      { tex: "(-2\\,020) : 101" },
      {
        tex: "= -(2\\,020 : 101)",
        tag: tag("khác dấu: thương âm", NOTE),
      },
      {
        tex: steps("101 \\cdot 2 = 202", "101 \\cdot 20 = 2\\,020"),
        tag: tag("nhân 101 với 20", NOTE),
      },
      {
        tex: `= ${neg(-20)}`,
        tag: tag("thương âm", NEGATIVE),
      },
    ],
    "steps",
  ),

  // Bài 3.36
  "sbt-goi-y-uoc-34": lines(
    "Tìm các ước của 34: các ước dương, rồi thêm số đối của chúng",
    [
      {
        tex: "34 = 1 \\cdot 34 = 2 \\cdot 17",
        tag: tag("tích hai số dương", POSITIVE),
      },
      {
        tex: "\\concept{violet}{1,\\ 2,\\ 17,\\ 34}",
        tag: tag("các ước dương", DIVISOR),
      },
      {
        tex: "\\concept{violet}{\\pm1,\\ \\pm2,\\ \\pm17,\\ \\pm34}",
        tag: tag("thêm số đối", NOTE),
      },
    ],
    "hint",
  ),
  "sbt-3-36a-giai": lines(
    "Các ước của 21: các ước dương, rồi thêm số đối của chúng",
    [
      {
        tex: "21 = 1 \\cdot 21 = 3 \\cdot 7",
        tag: tag("tích hai số dương", POSITIVE),
      },
      {
        tex: "\\concept{violet}{1,\\ 3,\\ 7,\\ 21}",
        tag: tag("các ước dương", DIVISOR),
      },
      {
        tex: "\\concept{violet}{\\pm1,\\ \\pm3,\\ \\pm7,\\ \\pm21}",
        tag: tag("thêm số đối", NOTE),
      },
    ],
    "steps",
  ),
  "sbt-goi-y-uoc-am70": lines(
    "Số −70 có cùng các ước dương với 70, rồi thêm số đối",
    [
      { tex: "-70", tag: tag("cùng ước dương với 70", NOTE) },
      {
        tex: steps(
          "70 = 1 \\cdot 70 = 2 \\cdot 35",
          "= 5 \\cdot 14 = 7 \\cdot 10",
        ),
        tag: tag("tích hai số dương", POSITIVE),
      },
      {
        tex: steps(
          "\\concept{violet}{\\pm1,\\ \\pm2,\\ \\pm5,\\ \\pm7,}",
          "\\concept{violet}{\\pm10,\\ \\pm14,\\ \\pm35,\\ \\pm70}",
        ),
      },
    ],
    "hint",
  ),
  "sbt-3-36b-giai": lines(
    "Số −66 có cùng các ước dương với 66, rồi thêm số đối",
    [
      { tex: "-66", tag: tag("cùng ước dương với 66", NOTE) },
      {
        tex: steps(
          "66 = 1 \\cdot 66 = 2 \\cdot 33",
          "= 3 \\cdot 22 = 6 \\cdot 11",
        ),
        tag: tag("tích hai số dương", POSITIVE),
      },
      {
        tex: steps(
          "\\concept{violet}{\\pm1,\\ \\pm2,\\ \\pm3,\\ \\pm6,}",
          "\\concept{violet}{\\pm11,\\ \\pm22,\\ \\pm33,\\ \\pm66}",
        ),
        tag: tag("thêm số đối", NOTE),
      },
    ],
    "steps",
  ),

  // Bài 3.37
  "sbt-chon-boi-11": chips([
    "33",
    "−16",
    "−11",
    "110",
    "66",
    "22",
    "−55",
    "44",
    "0",
    "−33",
    "38",
    "99",
    "−44",
    "55",
    "11",
    "−27",
    "88",
    "61",
    "−22",
    "77",
  ]),
  "sbt-goi-y-boi-25": lines(
    "Các bội khác 0 của 25, lớn hơn −60 và nhỏ hơn 120",
    [
      { tex: "-60 < x < 120", tag: tag("khoảng cần tìm", NOTE) },
      {
        tex: "25,\\ 50,\\ 75,\\ 100",
        tag: tag("bội dương nhỏ hơn 120", POSITIVE),
      },
      {
        tex: "-25,\\ -50",
        tag: tag("bội âm lớn hơn −60", NEGATIVE),
      },
      {
        tex: "\\concept{blue}{-50,\\ -25,\\ 25,\\ 50,\\ 75,\\ 100}",
        tag: tag("bỏ số 0", MULTIPLE),
      },
    ],
    "hint",
  ),
  "sbt-3-37-giai": lines(
    "Các bội khác 0 của 11, lớn hơn −50 và nhỏ hơn 100",
    [
      { tex: "-50 < x < 100", tag: tag("khoảng cần tìm", NOTE) },
      {
        tex: steps("11,\\ 22,\\ 33,\\ 44,\\ 55,", "66,\\ 77,\\ 88,\\ 99"),
        tag: tag("bội dương nhỏ hơn 100", POSITIVE),
      },
      {
        tex: "-11,\\ -22,\\ -33,\\ -44",
        tag: tag("bội âm lớn hơn −50", NEGATIVE),
      },
      {
        tex: "",
        tag: tag("13 số: 4 bội âm và 9 bội dương, bỏ số 0", MULTIPLE),
      },
    ],
    "steps",
  ),

  // Bài 3.38
  "sbt-goi-y-tap-hop-7": lines(
    "Các số nguyên chia hết cho 7, lớn hơn −21 và nhỏ hơn hoặc bằng 21",
    [
      {
        tex: "-21 < x \\le 21",
        tag: tag("không lấy −21, có lấy 21", NOTE),
      },
      {
        tex: "7,\\ 14,\\ 21",
        tag: tag("bội dương, lấy cả 21", POSITIVE),
      },
      { tex: "-7,\\ -14", tag: tag("bội âm, bỏ −21", NEGATIVE) },
      {
        tex: "\\concept{blue}{-14,\\ -7,\\ 0,\\ 7,\\ 14,\\ 21}",
        tag: tag("có thêm số 0", MULTIPLE),
      },
    ],
    "hint",
  ),
  "sbt-3-38-giai": lines(
    "Các số nguyên chia hết cho 3, lớn hơn −18 và nhỏ hơn hoặc bằng 18",
    [
      {
        tex: "-18 < x \\le 18",
        tag: tag("không lấy −18, có lấy 18", NOTE),
      },
      {
        tex: "3,\\ 6,\\ 9,\\ 12,\\ 15,\\ 18",
        tag: tag("bội dương, lấy cả 18", POSITIVE),
      },
      {
        tex: "-3,\\ -6,\\ -9,\\ -12,\\ -15",
        tag: tag("bội âm, bỏ −18", NEGATIVE),
      },
      {
        tex: steps(
          "\\concept{blue}{-15,\\ -12,\\ -9,\\ -6,\\ -3,\\ 0,}",
          "\\concept{blue}{3,\\ 6,\\ 9,\\ 12,\\ 15,\\ 18}",
        ),
        tag: tag("có thêm số 0", MULTIPLE),
      },
    ],
    "steps",
  ),

  // Bài 3.39
  "sbt-goi-y-tich-39": lines(
    "Viết 39 thành tích hai số dương, rồi đổi dấu cả hai thừa số",
    [
      {
        tex: "39 = 1 \\cdot 39 = 3 \\cdot 13",
        tag: tag("tích hai số dương", POSITIVE),
      },
      { tex: "", tag: tag("đổi dấu cả hai thừa số của mỗi tích", NOTE) },
      {
        tex: steps("39 = (-1) \\cdot (-39)", "= (-3) \\cdot (-13)"),
      },
    ],
    "hint",
  ),
  "sbt-3-39-giai": lines(
    "Phân tích 21 thành tích hai số nguyên",
    [
      {
        tex: "21 = 1 \\cdot 21 = 3 \\cdot 7",
        tag: tag("tích hai số dương", POSITIVE),
      },
      {
        tex: steps("21 = (-1) \\cdot (-21)", "= (-3) \\cdot (-7)"),
        tag: tag("đổi dấu cả hai thừa số", NOTE),
      },
    ],
    "steps",
  ),

  // Bài 3.40
  "sbt-goi-y-x-13": lines(
    "Tìm x để x + 13 chia hết cho x",
    [
      { tex: "x + 13 \\chiahet x", tag: tag("điều cần có", NOTE) },
      {
        tex: "(x + 13) - x = 13",
        tag: tag("hiệu của x + 13 và x", NOTE),
      },
      {
        tex: "13 \\chiahet x",
        tag: tag("x chia hết cho x, nên hiệu cũng chia hết cho x", NOTE),
      },
      {
        tex: "x = \\pm1,\\ \\pm13",
        tag: tag("x là ước của 13", DIVISOR),
      },
    ],
    "hint",
  ),
  "sbt-3-40-giai": lines(
    "Tìm x để x + 5 chia hết cho x",
    [
      { tex: "x + 5 \\chiahet x", tag: tag("điều cần có", NOTE) },
      {
        tex: "(x + 5) - x = 5",
        tag: tag("hiệu của x + 5 và x", NOTE),
      },
      {
        tex: "5 \\chiahet x",
        tag: tag("x chia hết cho x, nên hiệu cũng chia hết cho x", NOTE),
      },
      {
        tex: "x = \\pm1,\\ \\pm5",
        tag: tag("x là ước của 5", DIVISOR),
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
