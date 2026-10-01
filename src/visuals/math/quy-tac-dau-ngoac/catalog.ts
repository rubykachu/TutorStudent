import type { ConceptColor } from "@/schema/content";
import type { LinesSpec, Row, RowsSpec } from "@/visuals/shared/formula-rows";
import type { ChipsSpec } from "@/visuals/shared/pick-chips";
import type { FlipTrySpec } from "./flip-try";
import type { Piece } from "./logic";

// Every picture of the lesson that is drawn from numbers: the registry builds
// one entry per item (id `quy-tac-dau-ngoac.visual.<key>`), so a new example
// is one item here and its id in lesson.json. Pure data, no React, so
// `content:check` reads it.

export { LESSON_SLUG } from "./logic";

export type VisualSpec =
  // Formulas stacked, each with an optional tag (see `RowsSpec`).
  | ({ kind: "rows" } & RowsSpec)
  // Lines of a worked example, one more on every step (see `LinesSpec`).
  | ({ kind: "lines" } & LinesSpec)
  // Terms the child taps to pick, state { i0, i1, … } (see `ChipsSpec`).
  | ({ kind: "chips" } & ChipsSpec)
  // A sum with brackets whose terms the child taps to change their sign,
  // state { f0, f1, … } (see `FlipTrySpec`).
  | ({ kind: "flipTry" } & FlipTrySpec)
  | { kind: "sticker" };

export type SpecKind = VisualSpec["kind"];

// Kinds the child acts on (counted as interactive by `--stats`).
export const INTERACTIVE_KINDS: ReadonlySet<SpecKind> = new Set([
  "chips",
  "flipTry",
]);

// Validator id of the `manipulate` exercises each interactive kind serves:
// both report one key per candidate with 1 = picked or changed, which the
// shared "chon-dung" validator compares with the exercise's params.
export const VALIDATOR_IDS = {
  chips: "chon-dung",
  flipTry: "chon-dung",
} as const;

// Colours of the concepts of the lesson, as the pictures use them.
const POSITIVE = "lime";
const NEGATIVE = "pink";
const SUM = "amber";
// The colour of a label that names a step ("đổi dấu", "nhóm hai khoản")
// rather than a concept of the lesson: the one concept colour the lesson
// leaves unused.
const NOTE = "violet";

const tag = (text: string, color: ConceptColor) => ({ text, color });

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

const flipTry = (
  label: string,
  pieces: readonly Piece[],
  done?: string,
): VisualSpec => ({
  kind: "flipTry",
  label,
  pieces,
  ...(done ? { done } : {}),
});

// A signed term as the pictures write it: the sign belongs to the number, so
// both take the colour of the sign (green plus, pink minus).
const sg = (n: number) =>
  n < 0 ? `\\concept{pink}{-${-n}}` : `\\concept{lime}{+${n}}`;
const inside = (terms: readonly number[]) => `(${terms.map(sg).join("\\ ")})`;
const flipped = (terms: readonly number[]) =>
  terms.map((n) => sg(-n)).join("\\ ");

const LEGEND_SIGNS = [
  { color: NEGATIVE, name: "Số hạng âm" },
  { color: POSITIVE, name: "Số hạng dương" },
] as const;

const term = (value: number): Piece => ({ kind: "term", value });
const group = (lead: "+" | "-" | "", ...terms: number[]): Piece => ({
  kind: "group",
  lead,
  terms,
});

// Worked example of the whole method (the lesson's last method section).
const WHOLE_ROWS = [
  { tex: "(-6) + (13 - 11) - (-5 - 3 + 9)" },
  {
    tex: "= -6 + 13 - 11 + 5 + 3 - 9",
    tag: tag("bỏ ngoặc: giữ dấu +, đổi dấu −", NOTE),
  },
  {
    tex: "= (-6 - 9) + (13 + 3) + (5 - 11)",
    tag: tag("đổi chỗ, rồi nhóm số hạng", NOTE),
  },
  { tex: "= -15 + 16 + (-6)" },
  { tex: "= \\concept{pink}{-5}", tag: tag("giá trị của tổng", SUM) },
] as const satisfies readonly Row[];

// Rows shared by a worked example and its still recap.
const LEADING_ROWS = [
  { tex: "(9 - 12) - (5 - 8 + 1)" },
  {
    tex: "= 9 - 12 - 5 + 8 - 1",
    tag: tag("ngoặc đầu giữ dấu, ngoặc sau đổi dấu", NOTE),
  },
  { tex: "= \\concept{pink}{-1}", tag: tag("giá trị của tổng", SUM) },
] as const satisfies readonly Row[];

const REASONABLE_ROWS = [
  { tex: "38 - (25 - 2) + (-15)" },
  { tex: "= 38 - 25 + 2 - 15", tag: tag("bỏ ngoặc", NOTE) },
  {
    tex: "= (38 + 2) - (25 + 15)",
    tag: tag("đổi chỗ, nhóm thành số tròn chục", NOTE),
  },
  { tex: "= 40 - 40" },
  { tex: "= \\concept{slate}{0}", tag: tag("giá trị của tổng", SUM) },
] as const satisfies readonly Row[];

const PAIR_ROWS = [
  { tex: "(-3) + (-2) + (-1) + 0 + 1 + 2 + 3" },
  {
    tex: "= [(-3) + 3] + [(-2) + 2] + [(-1) + 1] + 0",
    tag: tag("ghép các cặp số đối", NOTE),
  },
  { tex: "= 0 + 0 + 0 + 0" },
  { tex: "= \\concept{slate}{0}", tag: tag("tổng cả dãy", SUM) },
] as const satisfies readonly Row[];

export const VISUAL_SPECS: Readonly<Record<string, VisualSpec>> = {
  // 1. Tổng đại số
  "thu-chi-cho": rows(
    "Tiền mẹ đi chợ: thu vào là số dương, chi ra là số âm",
    [
      {
        tex: "\\concept{lime}{+50}",
        tag: tag("bán rau, thu 50 nghìn", POSITIVE),
      },
      {
        tex: "\\concept{pink}{-20}",
        tag: tag("mua cá, chi 20 nghìn", NEGATIVE),
      },
      {
        tex: "\\concept{pink}{-5}",
        tag: tag("mua hành, chi 5 nghìn", NEGATIVE),
      },
    ],
    LEGEND_SIGNS,
  ),
  "tong-dai-so-vi-du": rows("Một tổng và các số hạng của nó", [
    {
      tex: "8 - 3 + 2",
      tag: tag("một tổng, chỉ có phép cộng và trừ", SUM),
    },
    {
      tex: `${sg(8)}\\ ${sg(-3)}\\ ${sg(2)}`,
      tag: tag("ba số hạng, mỗi số mang dấu của nó", "blue"),
    },
  ]),
  "chon-so-hang-am": chips(
    ["+9", "−4", "+1", "−2"],
    [1, 3],
    "Bạn đã chọn đủ các số hạng âm.",
  ),
  "chon-am-5-7": chips(["+5", "−7", "+2", "−1"]),

  // 2. Ngoặc có dấu + đứng trước
  "cong-ngoac-mua": lines(
    "Có 40 nghìn, cộng thêm khoản 30 nghìn trừ 10 nghìn: bỏ ngoặc, giữ nguyên dấu",
    [
      { tex: "40 + (30 - 10)" },
      { tex: "= 40 + 30 - 10", tag: tag("bỏ ngoặc, giữ nguyên dấu", NOTE) },
      { tex: "= \\concept{amber}{60}", tag: tag("còn 60 nghìn", SUM) },
    ],
    "steps",
  ),
  "cong-ngoac-vi-du": rows("Ngoặc có dấu + đứng trước: các dấu giữ nguyên", [
    {
      tex: `5 + ${inside([3, -2])} = 5\\ ${sg(3)}\\ ${sg(-2)}`,
      tag: tag("+3 và −2 giữ nguyên", NOTE),
    },
    {
      tex: `7 + ${inside([-4, 1])} = 7\\ ${sg(-4)}\\ ${sg(1)}`,
      tag: tag("−4 và +1 giữ nguyên", NOTE),
    },
    {
      tex: `10 + ${inside([6, -9, 2])} = 10\\ ${sg(6)}\\ ${sg(-9)}\\ ${sg(2)}`,
      tag: tag("cả ba số giữ nguyên", NOTE),
    },
  ]),
  "goi-y-cong-ngoac": lines(
    "Ngoặc có dấu + đứng trước: bỏ ngoặc và giữ nguyên dấu",
    [
      { tex: "15 + (4 - 9)" },
      { tex: "= 15 + 4 - 9", tag: tag("giữ nguyên dấu", NOTE) },
      { tex: "= 10" },
    ],
    "hint",
  ),
  "chon-bo-ngoac-8": chips(
    ["8 + 5 − 3", "8 − 5 + 3", "8 + 5 + 3"],
    [0],
    "Ngoặc có dấu +, nên các dấu giữ nguyên.",
  ),

  // 3. Ngoặc có dấu − đứng trước
  "tra-tui-hang": lines(
    "Có 100 nghìn, trả cả túi hàng gồm bánh 30 nghìn và sữa 20 nghìn",
    [
      { tex: "100 - (30 + 20)" },
      { tex: "= 100 - 30 - 20", tag: tag("trả từng món", NOTE) },
      { tex: "= \\concept{amber}{50}", tag: tag("còn 50 nghìn", SUM) },
    ],
    "steps",
  ),
  "tru-ngoac-vi-du": rows("Ngoặc có dấu − đứng trước: mọi số hạng đổi dấu", [
    {
      tex: `9 - ${inside([4, 3])} = 9\\ ${flipped([4, 3])}`,
      tag: tag("+4 thành −4, +3 thành −3", NOTE),
    },
    {
      tex: `7 - ${inside([2, 1, 3])} = 7\\ ${flipped([2, 1, 3])}`,
      tag: tag("cả ba số đổi thành âm", NOTE),
    },
    {
      tex: `10 - ${inside([5, 5])} = 10\\ ${flipped([5, 5])}`,
      tag: tag("hai số đổi thành âm", NOTE),
    },
  ]),
  "doi-dau-10-3-4": flipTry(
    "Bỏ ngoặc của 10 trừ ngoặc 3 cộng 4",
    [term(10), group("-", 3, 4)],
    "Cả hai số hạng đã đổi dấu: 10 − 3 − 4.",
  ),
  "doi-dau-25-9-6": flipTry("Bỏ ngoặc của 25 trừ ngoặc 9 cộng 6", [
    term(25),
    group("-", 9, 6),
  ]),
  "goi-y-tru-ngoac": lines(
    "Bỏ ngoặc có dấu − đứng trước: đổi dấu từng số hạng trong ngoặc",
    [
      { tex: "18 - (5 + 6)" },
      { tex: "= 18 - 5 - 6", tag: tag("đổi dấu từng số hạng", NOTE) },
      { tex: "= 7" },
    ],
    "hint",
  ),

  // 4. Ngoặc có dấu − đứng trước và số âm trong ngoặc
  "giam-gia": lines(
    "Có 100 nghìn, hàng giá 30 nghìn được giảm 10 nghìn",
    [
      { tex: "100 - (30 - 10)" },
      {
        tex: "= 100 - 30 + 10",
        tag: tag("−10 đổi thành +10", NOTE),
      },
      { tex: "= \\concept{amber}{80}", tag: tag("còn 80 nghìn", SUM) },
    ],
    "steps",
  ),
  "tru-so-am-vi-du": rows("Số hạng âm trong ngoặc đổi thành số hạng dương", [
    {
      tex: `8 - ${inside([6, -2])} = 8\\ ${flipped([6, -2])}`,
      tag: tag("+6 thành −6, −2 thành +2", NOTE),
    },
    {
      tex: `9 - ${inside([-4, 1])} = 9\\ ${flipped([-4, 1])}`,
      tag: tag("−4 thành +4, +1 thành −1", NOTE),
    },
    {
      tex: `12 - ${inside([-3, -5])} = 12\\ ${flipped([-3, -5])}`,
      tag: tag("cả hai số âm thành dương", NOTE),
    },
  ]),
  "doi-dau-20-7-3-2": flipTry(
    "Bỏ ngoặc của 20 trừ ngoặc 7 trừ 3 cộng 2",
    [term(20), group("-", 7, -3, 2)],
    "Cả ba số hạng đã đổi dấu: 20 − 7 + 3 − 2.",
  ),
  "doi-dau-35-12-5-4": flipTry("Bỏ ngoặc của 35 trừ ngoặc 12 trừ 5 cộng 4", [
    term(35),
    group("-", 12, -5, 4),
  ]),
  "goi-y-tru-so-am": lines(
    "Số hạng âm trong ngoặc có dấu − đứng trước đổi thành số hạng dương",
    [
      { tex: "14 - (6 - 2)" },
      { tex: "= 14 - 6 + 2", tag: tag("−2 đổi thành +2", NOTE) },
      { tex: "= 10" },
    ],
    "hint",
  ),

  // 5. Ngoặc chỉ có một số
  "no-xoa-no": rows("Nợ 5 nghìn rồi được xoá nợ", [
    {
      tex: "50 + (-5) = 50 - 5 = 45",
      tag: tag("nợ 5 nghìn: giữ dấu −", NEGATIVE),
    },
    {
      tex: "45 - (-5) = 45 + 5 = 50",
      tag: tag("xoá nợ 5 nghìn: đổi − thành +", POSITIVE),
    },
  ]),
  "ngoac-mot-so-vi-du": rows("Bốn trường hợp của ngoặc chỉ có một số", [
    { tex: "5 + (+3) = 5 + 3", tag: tag("+ và + thành +", POSITIVE) },
    { tex: "5 + (-3) = 5 - 3", tag: tag("+ và − thành −", NEGATIVE) },
    { tex: "5 - (+3) = 5 - 3", tag: tag("− và + thành −", NEGATIVE) },
    { tex: "5 - (-3) = 5 + 3", tag: tag("− và − thành +", POSITIVE) },
  ]),
  "chon-20-tru-am6": chips(
    ["20 + 6", "20 − 6", "−20 + 6"],
    [0],
    "Trừ đi số âm thì thành cộng với số dương.",
  ),
  "goi-y-ngoac-mot-so": lines(
    "Bỏ ngoặc từng số một, rồi cộng các số hạng",
    [
      { tex: "(-3) + (-4) - 5 + (-1)" },
      { tex: "= -3 - 4 - 5 - 1", tag: tag("bỏ ngoặc, giữ dấu −", NOTE) },
      { tex: "= -13" },
    ],
    "hint",
  ),

  // 6. Nhiều ngoặc trong một tổng
  "hai-tui-giam-gia": lines(
    "Có 100 nghìn, mua túi A giá 40 nghìn giảm 5 nghìn và túi B giá 30 nghìn giảm 10 nghìn",
    [
      { tex: "100 - (40 - 5) - (30 - 10)" },
      {
        tex: "= 100 - 40 + 5 - 30 + 10",
        tag: tag("mỗi ngoặc đổi dấu riêng", NOTE),
      },
      { tex: "= \\concept{amber}{45}", tag: tag("còn 45 nghìn", SUM) },
    ],
    "steps",
  ),
  "ngoac-dau-day-vi-du": lines(
    "Ngoặc ở đầu giữ dấu, ngoặc có dấu − đứng trước đổi dấu",
    LEADING_ROWS,
    "steps",
  ),
  "ngoac-dau-day-vi-du-xong": lines(
    "Ngoặc ở đầu giữ dấu, ngoặc có dấu − đứng trước đổi dấu",
    LEADING_ROWS,
    "still",
  ),
  "doi-dau-hai-ngoac": flipTry(
    "Bỏ ngoặc của 7 trừ 10, trừ ngoặc 4 trừ 6 cộng 2",
    [group("", 7, -10), group("-", 4, -6, 2)],
    "Chỉ ngoặc có dấu − đứng trước đổi dấu.",
  ),
  "doi-dau-ba-ngoac": flipTry(
    "Bỏ ngoặc của 15 trừ 20, trừ ngoặc 7 cộng 3, cộng ngoặc 4 trừ 1",
    [group("", 15, -20), group("-", 7, 3), group("+", 4, -1)],
  ),
  "goi-y-nhieu-ngoac": lines(
    "Bỏ từng ngoặc theo dấu đứng trước nó",
    [
      { tex: "(4 - 7) - (2 - 6 + 1)" },
      { tex: "= 4 - 7 - 2 + 6 - 1", tag: tag("ngoặc sau đổi dấu", NOTE) },
      { tex: "= 0" },
    ],
    "hint",
  ),

  // 7. Đổi chỗ các số hạng
  "doi-cho-vi-du": rows("Đổi chỗ các số hạng, mỗi số mang theo dấu của nó", [
    {
      tex: "9 - 12 + 5 = 2",
      tag: tag("thứ tự ban đầu", SUM),
    },
    {
      tex: "9 + 5 - 12 = 2",
      tag: tag("−12 mang theo dấu −", NEGATIVE),
    },
    {
      tex: "9 + 12 - 5 = 16",
      tag: tag("bỏ lại dấu − thì sai", NOTE),
      muted: true,
    },
  ]),
  "doi-cho-thu-chi": rows("Ghi thu chi theo hai thứ tự, kết quả như nhau", [
    { tex: "8 - 12 + 4", tag: tag("thu 8, chi 12, thu 4", NOTE) },
    { tex: "8 + 4 - 12", tag: tag("thu 8, thu 4, chi 12", NOTE) },
    { tex: "= \\concept{amber}{0}", tag: tag("cả hai đều bằng 0", SUM) },
  ]),
  "chon-so-duong": chips(
    ["+6", "−9", "+2", "−1", "+5"],
    [0, 2, 4],
    "Bạn đã chọn đủ các số hạng dương.",
  ),
  "chon-duong-7-10": chips(["+7", "−10", "+3", "−2", "+6"]),

  // 8. Đặt ngoặc có dấu + đứng trước
  "gom-nhom-so": lines(
    "Sổ thu chi: thu 50, chi 20, thu 30, chi 10, gom thành hai nhóm",
    [
      { tex: "50 - 20 + 30 - 10" },
      {
        tex: "= (50 - 20) + (30 - 10)",
        tag: tag("gom nhóm, các dấu giữ nguyên", NOTE),
      },
      { tex: "= 30 + 20" },
      { tex: "= \\concept{amber}{50}", tag: tag("thu về 50 nghìn", SUM) },
    ],
    "steps",
  ),
  "nhom-cong-vi-du": rows("Đặt ngoặc có dấu + đứng trước: dấu giữ nguyên", [
    {
      tex: "8 - 3 + 5 - 2 = (8 - 3) + (5 - 2)",
      tag: tag("hai nhóm, dấu giữ nguyên", NOTE),
    },
    {
      tex: "6 - 9 + 4 + 1 = 6 + (-9 + 4 + 1)",
      tag: tag("nhóm ba số cuối", NOTE),
    },
  ]),
  "chon-nhom-7-4": chips(
    ["(7 − 4) + (9 − 5)", "(7 − 4) + (9 + 5)", "(7 + 4) − (9 − 5)"],
    [0],
    "Ngoặc có dấu +, nên các số hạng giữ nguyên dấu.",
  ),

  // 9. Đặt ngoặc có dấu − đứng trước
  "gom-vao-tui": lines(
    "Có 100 nghìn, trả bánh 20 nghìn và sữa 10 nghìn, gom hai khoản vào một túi",
    [
      { tex: "100 - 20 - 10" },
      {
        tex: "= 100 - (20 + 10)",
        tag: tag("gom hai khoản vào ngoặc, đổi dấu", NOTE),
      },
      { tex: "= \\concept{amber}{70}", tag: tag("còn 70 nghìn", SUM) },
    ],
    "steps",
  ),
  "nhom-tru-vi-du": rows("Đặt ngoặc có dấu − đứng trước: số hạng đổi dấu", [
    {
      tex: "9 - 4 - 2 = 9 - (4 + 2)",
      tag: tag("−4 và −2 thành +4 và +2", NOTE),
    },
    {
      tex: "9 - 4 + 2 = 9 - (4 - 2)",
      tag: tag("−4 và +2 thành +4 và −2", NOTE),
    },
    {
      tex: "5 - 8 + 3 - 1 = 5 - (8 - 3 + 1)",
      tag: tag("cả ba số hạng đổi dấu", NOTE),
    },
  ]),
  "goi-y-nhom-tru": lines(
    "Gom hai khoản trừ vào một ngoặc có dấu −",
    [
      { tex: "40 - 15 - 5" },
      { tex: "= 40 - (15 + 5)", tag: tag("gom hai khoản, đổi dấu", NOTE) },
      { tex: "= 20" },
    ],
    "hint",
  ),
  "chon-nhom-15": chips(
    ["15 − (6 + 4)", "15 − (6 − 4)", "15 + (6 − 4)"],
    [0],
    "Đặt ngoặc có dấu −, nên hai số hạng đổi dấu.",
  ),

  // 10. Tính hợp lí
  "tinh-hop-li-vi-du": lines(
    "Bỏ ngoặc, đổi chỗ rồi nhóm các số hạng để tính nhẩm",
    REASONABLE_ROWS,
    "steps",
  ),
  "tinh-hop-li-vi-du-xong": lines(
    "Bỏ ngoặc, đổi chỗ rồi nhóm các số hạng để tính nhẩm",
    REASONABLE_ROWS,
    "still",
  ),
  "so-doi-mat-nhau": lines(
    "Bỏ ngoặc rồi cho hai số đối nhau mất nhau",
    [
      { tex: "30 - (17 + 30) - (5 + 0)" },
      { tex: "= 30 - 17 - 30 - 5 - 0", tag: tag("bỏ ngoặc", NOTE) },
      {
        tex: "= (30 - 30) - 17 - 5",
        tag: tag("30 và −30 mất nhau, bỏ 0", NOTE),
      },
      { tex: "= \\concept{pink}{-22}", tag: tag("giá trị của tổng", SUM) },
    ],
    "steps",
  ),
  "chon-ghep-30": chips(
    ["+27", "−14", "+3", "−6"],
    [0, 2],
    "Hai số hạng +27 và +3 cộng lại được 30.",
  ),
  "chon-ghep-100": chips(["+64", "−37", "+36", "−20"]),
  "goi-y-hop-li": lines(
    "Nhóm từng cặp số hạng rồi tính",
    [
      { tex: "3 - 5 + 7 - 9" },
      { tex: "= (3 - 5) + (7 - 9)", tag: tag("nhóm từng cặp", NOTE) },
      { tex: "= -2 + (-2)" },
      { tex: "= -4" },
    ],
    "hint",
  ),

  // 11. Ví dụ trọn vẹn
  "vi-du-tong-hop": lines(
    "Bỏ ngoặc, đổi chỗ, nhóm số hạng rồi tính",
    WHOLE_ROWS,
    "steps",
  ),
  "vi-du-tong-hop-xong": lines(
    "Bỏ ngoặc, đổi chỗ, nhóm số hạng rồi tính",
    WHOLE_ROWS,
    "still",
  ),
  "doi-dau-tong-hop": flipTry(
    "Bỏ ngoặc của âm 4, cộng ngoặc 9 trừ 7, trừ ngoặc âm 3 trừ 2 cộng 8",
    [group("", -4), group("+", 9, -7), group("-", -3, -2, 8)],
    "Chỉ ngoặc có dấu − đứng trước đổi dấu.",
  ),
  "doi-dau-nam-ngoac": flipTry(
    "Bỏ ngoặc của 5 trừ ngoặc 3 trừ 8, cộng ngoặc 6 trừ 2, trừ ngoặc 1 cộng 4",
    [term(5), group("-", 3, -8), group("+", 6, -2), group("-", 1, 4)],
  ),
  "goi-y-tong-hop": lines(
    "Bỏ ngoặc rồi nhóm các số hạng",
    [
      { tex: "(-2) + (9 - 4) - (1 - 5 + 2)" },
      { tex: "= -2 + 9 - 4 - 1 + 5 - 2", tag: tag("bỏ ngoặc", NOTE) },
      { tex: "= 5" },
    ],
    "hint",
  ),

  // 12. Thu chi và ghép số đối
  "thu-chi-lan": lines(
    "Lan có 60 nghìn, nhận 20 nghìn trừ 5 nghìn công, rồi trả 12 nghìn và 8 nghìn",
    [
      { tex: "60 + (20 - 5) - (12 + 8)" },
      {
        tex: "= 60 + 20 - 5 - 12 - 8",
        tag: tag("ngoặc + giữ dấu, ngoặc − đổi dấu", NOTE),
      },
      { tex: "= \\concept{amber}{55}", tag: tag("Lan còn 55 nghìn", SUM) },
    ],
    "steps",
  ),
  "ghep-so-doi": lines(
    "Tổng các số nguyên từ −3 đến 3: ghép từng cặp số đối nhau",
    PAIR_ROWS,
    "steps",
  ),
  "ghep-so-doi-xong": lines(
    "Tổng các số nguyên từ −3 đến 3: ghép từng cặp số đối nhau",
    PAIR_ROWS,
    "still",
  ),
  "chon-khong-doi": chips(
    ["−2", "−1", "0", "1", "2", "3"],
    [5],
    "Số 3 không có số đối trong dãy, nên nó là số còn lại.",
  ),
  "goi-y-ghep-doi": lines(
    "Ghép các cặp số đối nhau, rồi cộng các số còn lại",
    [
      { tex: "(-2) + (-1) + 0 + 1 + 2 + 3 + 4" },
      {
        tex: "= [(-2) + 2] + [(-1) + 1] + 0 + 3 + 4",
        tag: tag("ghép cặp số đối", NOTE),
      },
      { tex: "= 0 + 0 + 0 + 3 + 4" },
      { tex: "= 7" },
    ],
    "hint",
  ),

  sticker: { kind: "sticker" },
};

// Regions of the pictures a `tapRegion` exercise taps: none in this lesson.
export function regionsOf(_spec: VisualSpec): string[] | undefined {
  return undefined;
}
