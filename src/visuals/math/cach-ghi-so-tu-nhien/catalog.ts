import type { LinesSpec, Mode, RowsSpec } from "@/visuals/shared/formula-rows";
import type { ChipsSpec } from "@/visuals/shared/pick-chips";
import { digitsOf } from "./logic";

// Every picture of the lesson that is drawn from numbers: the registry builds
// one entry per item (id `cach-ghi-so-tu-nhien.visual.<key>`), so a new
// example is one item here and its id in lesson.json. Pure data, no React, so
// `content:check` reads it.

export { LESSON_SLUG } from "./logic";

// A number's digits, and what the picture adds to the tiles:
// - none: the tiles only;
// - names: the place (hàng) of each digit, revealed from the right;
// - values: a row per digit with its place and value;
// - sum: the same rows, then the number as the sum of the values.
// `focus` is the index (from the left) of the digit picked out.
export type PlacesSpec = {
  n: number;
  show: "none" | "names" | "values" | "sum";
  mode: Mode;
  focus?: number;
};

// Rows that hide the place (ask "name") or the value (ask "value") of each
// digit until the child taps it.
export type PlacesExploreSpec = { n: number; ask: "name" | "value" };

// The digits as tappable tiles, regions d0, d1, … from the left.
export type PlacesPickSpec = { n: number };

// A − / + stepper for each of `len` places; `goal` is the number to write on
// a lesson screen (an exercise brings its own params).
export type SlotsSpec = { len: number; goal?: number };

// A number whose digits have gaps before, between and after them, regions g0,
// g1, … from the left, and the digit to write into one of them.
export type GapsSpec = { digits: string; add: number };

// A wall clock with Roman numerals, the hour hand on `hour`.
export type ClockSpec = { hour: number };

// A sum of matchsticks: glyphs I, V, X, + and =; `accent` lists the glyph
// indexes drawn in the accent colour (the stick that moved).
export type SticksSpec = { expr: string; accent?: readonly number[] };

// Cards of Roman numerals, each with its value.
export type RomanCardsSpec = {
  label: string;
  items: readonly (readonly [string, number])[];
};

export type VisualSpec =
  // Formulas stacked, each with an optional tag (see `RowsSpec`).
  | ({ kind: "rows" } & RowsSpec)
  // Lines of a worked example, one more on every step (see `LinesSpec`).
  | ({ kind: "lines" } & LinesSpec)
  // Numbers the child taps to pick, state { i0, i1, … } (see `ChipsSpec`).
  | ({ kind: "chips" } & ChipsSpec)
  | ({ kind: "places" } & PlacesSpec)
  | ({ kind: "placesExplore" } & PlacesExploreSpec)
  | ({ kind: "placesPick" } & PlacesPickSpec)
  | ({ kind: "slots" } & SlotsSpec)
  | ({ kind: "gaps" } & GapsSpec)
  | ({ kind: "clock" } & ClockSpec)
  // The clock face without hands, every numeral a region h1 … h12.
  | { kind: "clockPick" }
  | ({ kind: "sticks" } & SticksSpec)
  | ({ kind: "romanCards" } & RomanCardsSpec)
  | { kind: "sticker" };

export type SpecKind = VisualSpec["kind"];
export type SpecOf<K extends SpecKind> = Extract<VisualSpec, { kind: K }>;

// Kinds the child acts on (counted as interactive by `--stats`).
export const INTERACTIVE_KINDS: ReadonlySet<SpecKind> = new Set([
  "chips",
  "placesExplore",
  "slots",
]);

// Validator id of the `manipulate` exercises each interactive kind serves;
// "chon-dung" is the validator shared with the set lesson's pick screens.
export const VALIDATOR_IDS = {
  chips: "chon-dung",
  slots: "viet-so",
} as const;

// Region ids of a picture the child taps in a `tapRegion` exercise, in
// drawing order; undefined for a picture without regions.
export function regionsOf(spec: VisualSpec): readonly string[] | undefined {
  switch (spec.kind) {
    case "placesPick":
      return digitsOf(spec.n).map((_, i) => `d${i}`);
    case "gaps":
      return Array.from({ length: spec.digits.length + 1 }, (_, k) => `g${k}`);
    case "clockPick":
      return Array.from({ length: 12 }, (_, i) => `h${i + 1}`);
    default:
      return undefined;
  }
}

export const VISUAL_SPECS: Readonly<Record<string, VisualSpec>> = {
  "n-tom-tat": {
    kind: "rows",
    label: "Tập ℕ có số 0, tập ℕ* bỏ số 0",
    rows: [
      {
        tex: "\\mathbb{N} = \\{0; 1; 2; 3; \\ldots\\}",
        tag: {
          text: "có số 0",
          color: "teal",
        },
      },
      {
        tex: "\\mathbb{N}^{\\ast} = \\{1; 2; 3; \\ldots\\}",
        tag: {
          text: "bỏ số 0",
          color: "teal",
        },
      },
    ],
  },
  "chon-n-sao": {
    kind: "chips",
    items: ["0", "1", "25", "100"],
    wants: [1, 2, 3],
    done: "Số 0 thuộc ℕ nhưng không thuộc ℕ*.",
  },
  "chu-so-tom-tat": {
    kind: "places",
    n: 9560,
    show: "none",
    mode: "still",
  },
  "chu-so-vi-du": {
    kind: "places",
    n: 4073,
    show: "none",
    mode: "still",
  },
  "so-nha-128": {
    kind: "places",
    n: 128,
    show: "none",
    mode: "still",
  },
  "chon-ba-chu-so": {
    kind: "chips",
    items: ["7", "128", "45", "905", "2 310"],
    wants: [1, 3],
    done: "Số có ba chữ số thì viết bằng ba chữ số, như 128 và 905.",
  },
  "hang-tom-tat": {
    kind: "places",
    n: 9360,
    show: "names",
    mode: "still",
  },
  "goi-y-hang": {
    kind: "places",
    n: 8146,
    show: "names",
    mode: "still",
  },
  "cham-hang-5618": {
    kind: "placesPick",
    n: 5618,
  },
  "cham-hang-7305": {
    kind: "placesPick",
    n: 7305,
  },
  "hang-vi-du": {
    kind: "places",
    n: 4273,
    show: "names",
    mode: "steps",
  },
  "hang-kham-pha": {
    kind: "placesExplore",
    n: 6084,
    ask: "name",
  },
  "giai-hang-5618": {
    kind: "places",
    n: 5618,
    show: "names",
    mode: "still",
    focus: 1,
  },
  "giai-hang-7305": {
    kind: "places",
    n: 7305,
    show: "names",
    mode: "still",
    focus: 2,
  },
  "doi-hang-tom-tat": {
    kind: "rows",
    label: "Mười đơn vị đổi thành một đơn vị hàng bên trái",
    rows: [
      {
        tex: "10 \\cdot 1 = 10",
        tag: {
          text: "10 đơn vị = 1 chục",
          color: "violet",
        },
      },
      {
        tex: "10 \\cdot 10 = 100",
        tag: {
          text: "10 chục = 1 trăm",
          color: "violet",
        },
      },
    ],
  },
  "doi-hang": {
    kind: "rows",
    label: "Đổi hàng",
    rows: [
      {
        tex: "10 \\cdot 1 = 10",
        tag: {
          text: "10 đơn vị = 1 chục",
          color: "violet",
        },
      },
      {
        tex: "10 \\cdot 10 = 100",
        tag: {
          text: "10 chục = 1 trăm",
          color: "violet",
        },
      },
      {
        tex: "10 \\cdot 100 = 1\\,000",
        tag: {
          text: "10 trăm = 1 nghìn",
          color: "violet",
        },
      },
    ],
  },
  "doi-tien": {
    kind: "rows",
    label: "Đổi tiền",
    rows: [
      {
        tex: "10 \\cdot 10\\,000 = 100\\,000",
        tag: {
          text: "10 tờ = 1 tờ",
          color: "violet",
        },
      },
    ],
  },
  "chon-bang-1-tram": {
    kind: "chips",
    items: ["10 chục", "100 đơn vị", "10 trăm", "1 chục"],
    wants: [0, 1],
    done: "1 trăm bằng 10 chục, cũng bằng 100 đơn vị.",
  },
  "gia-tri-tom-tat": {
    kind: "places",
    n: 2940,
    show: "values",
    mode: "still",
  },
  "goi-y-gia-tri": {
    kind: "places",
    n: 8125,
    show: "names",
    mode: "still",
  },
  "gia-tri-mau": {
    kind: "places",
    n: 3507,
    show: "values",
    mode: "steps",
  },
  "gia-tri-kham-pha": {
    kind: "placesExplore",
    n: 40618,
    ask: "value",
  },
  "chon-gia-tri-6": {
    kind: "chips",
    items: ["6", "60", "600", "6 000"],
    wants: [2],
    done: "Chữ số 6 ở hàng trăm nên có giá trị 600.",
  },
  "giai-gia-tri-3482": {
    kind: "places",
    n: 3482,
    show: "values",
    mode: "solution",
    focus: 1,
  },
  "goi-y-gia-tri-5": {
    kind: "places",
    n: 70431,
    show: "names",
    mode: "still",
  },
  "tong-tom-tat": {
    kind: "places",
    n: 7208,
    show: "sum",
    mode: "still",
  },
  "tong-mau": {
    kind: "places",
    n: 534,
    show: "sum",
    mode: "steps",
  },
  "tong-tien": {
    kind: "lines",
    label: "Cộng tiền theo hàng",
    rows: [
      {
        tex: "2 \\cdot 1\\,000 + 5 \\cdot 100 + 4 \\cdot 10",
        tag: {
          text: "mỗi loại tờ một hàng",
          color: "pink",
        },
      },
      {
        tex: "= 2\\,000 + 500 + 40",
      },
      {
        tex: "= 2\\,540",
        tag: {
          text: "số tiền của bạn",
          color: "pink",
        },
      },
    ],
    mode: "steps",
  },
  "viet-so-4": {
    kind: "slots",
    len: 4,
    goal: 2054,
  },
  "la-ma-tom-tat": {
    kind: "romanCards",
    label: "Các thành phần của số La Mã",
    items: [
      ["I", 1],
      ["V", 5],
      ["X", 10],
      ["IV", 4],
      ["IX", 9],
    ],
  },
  "la-ma-thanh-phan": {
    kind: "romanCards",
    label: "Các thành phần của số La Mã",
    items: [
      ["I", 1],
      ["V", 5],
      ["X", 10],
      ["IV", 4],
      ["IX", 9],
    ],
  },
  "dong-ho-4": {
    kind: "clock",
    hour: 4,
  },
  "chon-la-ma-9": {
    kind: "chips",
    items: ["IV", "V", "IX", "X"],
    wants: [2],
    done: "IX có giá trị 9, còn IV có giá trị 4.",
  },
  "cham-dong-ho-ix": {
    kind: "clockPick",
  },
  "goi-y-la-ma": {
    kind: "romanCards",
    label: "Ba chữ cái La Mã",
    items: [
      ["I", 1],
      ["V", 5],
      ["X", 10],
    ],
  },
  "giai-dong-ho-9": {
    kind: "clock",
    hour: 9,
  },
  "doc-la-ma-tom-tat": {
    kind: "lines",
    label: "Đọc số XXI",
    rows: [
      {
        tex: "\\concept{sky}{\\mathrm{XXV}} = \\mathrm{X} + \\mathrm{X} + \\mathrm{V}",
        tag: {
          text: "tách thành phần",
          color: "sky",
        },
      },
      {
        tex: "= 10 + 10 + 5 = 25",
        tag: {
          text: "cộng lại",
          color: "sky",
        },
      },
    ],
    mode: "still",
  },
  "doc-xvii": {
    kind: "lines",
    label: "Đọc số XVII",
    rows: [
      {
        tex: "\\concept{sky}{\\mathrm{XVII}} = \\mathrm{X} + \\mathrm{V} + \\mathrm{I} + \\mathrm{I}",
        tag: {
          text: "tách thành phần",
          color: "sky",
        },
      },
      {
        tex: "= 10 + 5 + 1 + 1",
      },
      {
        tex: "= 17",
        tag: {
          text: "cộng lại",
          color: "sky",
        },
      },
    ],
    mode: "steps",
  },
  "chon-xxviii": {
    kind: "chips",
    items: ["18", "28", "23", "38"],
    wants: [1],
    done: "XXVIII = 10 + 10 + 5 + 1 + 1 + 1 = 28.",
  },
  "viet-la-ma-tom-tat": {
    kind: "lines",
    label: "Viết số 27 bằng số La Mã",
    rows: [
      {
        tex: "27 = 20 + 7",
        tag: {
          text: "chục và đơn vị",
          color: "sky",
        },
      },
      {
        tex: "= \\mathrm{XX} + \\mathrm{VII} = \\concept{sky}{\\mathrm{XXVII}}",
        tag: {
          text: "chục trước, đơn vị sau",
          color: "sky",
        },
      },
    ],
    mode: "still",
  },
  "la-ma-chuc-don-vi": {
    kind: "romanCards",
    label: "Số La Mã của các chục và các đơn vị",
    items: [
      ["X", 10],
      ["XX", 20],
      ["XXX", 30],
      ["I", 1],
      ["II", 2],
      ["III", 3],
      ["IV", 4],
      ["V", 5],
      ["VI", 6],
      ["VII", 7],
      ["VIII", 8],
      ["IX", 9],
    ],
  },
  "viet-xv": {
    kind: "lines",
    label: "Viết số 15 bằng số La Mã",
    rows: [
      {
        tex: "15 = 10 + 5",
        tag: {
          text: "chục và đơn vị",
          color: "sky",
        },
      },
      {
        tex: "= \\mathrm{X} + \\mathrm{V}",
      },
      {
        tex: "= \\concept{sky}{\\mathrm{XV}}",
        tag: {
          text: "chục trước, đơn vị sau",
          color: "sky",
        },
      },
    ],
    mode: "steps",
  },
  "chon-viet-21": {
    kind: "chips",
    items: ["XXI", "XIXX", "IXX", "XXII"],
    wants: [0],
    done: "21 gồm 20 và 1, viết là XX rồi I: XXI.",
  },
  "que-tom-tat": {
    kind: "sticks",
    expr: "VI+V=XI",
  },
  "que-goc": {
    kind: "sticks",
    expr: "IV+V=XI",
  },
  "que-cach-1": {
    kind: "sticks",
    expr: "VI+V=XI",
    accent: [1],
  },
  "que-cach-2": {
    kind: "sticks",
    expr: "IV+V=IX",
    accent: [5],
  },
  "chon-phep-dung": {
    kind: "chips",
    items: ["VI + V = XI", "IV + V = XI", "IV + V = IX", "VI + V = IX"],
    wants: [0, 2],
    done: "6 + 5 = 11 và 4 + 5 = 9, nên hai phép này đúng.",
  },
  "lon-be-tom-tat": {
    kind: "rows",
    label: "Số lớn nhất và số bé nhất có ba chữ số",
    rows: [
      {
        tex: "999",
        tag: {
          text: "lớn nhất, toàn chữ số 9",
          color: "blue",
        },
      },
      {
        tex: "100",
        tag: {
          text: "bé nhất, chữ số 1 rồi toàn chữ số 0",
          color: "blue",
        },
      },
    ],
  },
  "lon-nhat-vd": {
    kind: "rows",
    label: "Số lớn nhất có hai, ba và năm chữ số",
    rows: [
      {
        tex: "99",
        tag: {
          text: "hai chữ số",
          color: "blue",
        },
      },
      {
        tex: "999",
        tag: {
          text: "ba chữ số",
          color: "blue",
        },
      },
      {
        tex: "99\\,999",
        tag: {
          text: "năm chữ số",
          color: "blue",
        },
      },
    ],
  },
  "be-nhat-vd": {
    kind: "rows",
    label: "Số bé nhất có hai, ba và năm chữ số",
    rows: [
      {
        tex: "10",
        tag: {
          text: "hai chữ số",
          color: "blue",
        },
      },
      {
        tex: "100",
        tag: {
          text: "ba chữ số",
          color: "blue",
        },
      },
      {
        tex: "10\\,000",
        tag: {
          text: "năm chữ số",
          color: "blue",
        },
      },
    ],
  },
  "chon-be-nhat-3": {
    kind: "chips",
    items: ["100", "101", "110", "999"],
    wants: [0],
    done: "Số bé nhất có ba chữ số là 100.",
  },
  "khac-nhau-tom-tat": {
    kind: "rows",
    label: "Số có năm chữ số khác nhau",
    rows: [
      {
        tex: "98\\,765",
        tag: {
          text: "lớn nhất",
          color: "blue",
        },
      },
      {
        tex: "10\\,234",
        tag: {
          text: "bé nhất",
          color: "blue",
        },
      },
    ],
  },
  "khac-nhau-lon": {
    kind: "rows",
    label: "Số lớn nhất có bốn chữ số khác nhau",
    rows: [
      {
        tex: "9 > 8 > 7 > 6",
        tag: {
          text: "chữ số từ lớn đến bé",
          color: "blue",
        },
      },
      {
        tex: "9\\,876",
        tag: {
          text: "số lớn nhất",
          color: "blue",
        },
      },
    ],
  },
  "khac-nhau-be": {
    kind: "rows",
    label: "Số bé nhất có bốn chữ số khác nhau",
    rows: [
      {
        tex: "1, 0, 2, 3",
        tag: {
          text: "1, rồi 0, rồi tăng dần",
          color: "blue",
        },
      },
      {
        tex: "1\\,023",
        tag: {
          text: "số bé nhất",
          color: "blue",
        },
      },
    ],
  },
  "chon-khac-nhau-3": {
    kind: "chips",
    items: ["100", "102", "120", "987"],
    wants: [1],
    done: "Số bé nhất có ba chữ số khác nhau là 102.",
  },
  "them-dau-cuoi-tom-tat": {
    kind: "rows",
    label: "Viết thêm chữ số vào số 614",
    rows: [
      {
        tex: "614 \\to 6\\,140",
        tag: {
          text: "thêm 0 vào cuối: gấp 10 lần",
          color: "lime",
        },
      },
      {
        tex: "614 \\to 1\\,614",
        tag: {
          text: "thêm 1 vào đầu: tăng 1 000",
          color: "lime",
        },
      },
    ],
  },
  "them-0-vd": {
    kind: "rows",
    label: "Thêm chữ số 0 vào cuối số 253",
    rows: [
      {
        tex: "253 \\to \\concept{lime}{2\\,530}",
        tag: {
          text: "thêm 0 vào cuối",
          color: "lime",
        },
      },
      {
        tex: "2\\,530 = 253 \\cdot 10",
        tag: {
          text: "gấp 10 lần",
          color: "lime",
        },
      },
    ],
  },
  "them-1-vd": {
    kind: "rows",
    label: "Thêm chữ số 1 vào đầu số 253",
    rows: [
      {
        tex: "253 \\to \\concept{lime}{1\\,253}",
        tag: {
          text: "thêm 1 vào đầu",
          color: "lime",
        },
      },
      {
        tex: "1\\,253 = 1\\,000 + 253",
        tag: {
          text: "tăng 1 000",
          color: "lime",
        },
      },
    ],
  },
  "chon-them-0-47": {
    kind: "chips",
    items: ["407", "470", "4 700", "1 047"],
    wants: [1],
    done: "47 viết thêm chữ số 0 vào cuối là 470, gấp 10 lần 47.",
  },
  "them-lon-nho-tom-tat": {
    kind: "lines",
    label: "Viết thêm chữ số 5 vào số 2 713",
    rows: [
      {
        tex: "\\concept{lime}{5}\\,2\\,713 = 52\\,713",
        tag: {
          text: "số lớn nhất",
          color: "lime",
        },
      },
      {
        tex: "2\\,\\concept{lime}{5}\\,713 = 25\\,713",
        tag: {
          text: "số bé nhất",
          color: "lime",
        },
      },
    ],
    mode: "still",
  },
  "them-lon-vd": {
    kind: "lines",
    label: "Viết thêm chữ số 5 vào số 2 713 để được số lớn nhất",
    rows: [
      {
        tex: "\\concept{lime}{5} > 2",
        tag: {
          text: "chữ số đầu tiên bé hơn 5 là 2",
          color: "lime",
        },
      },
      {
        tex: "\\concept{lime}{5}\\,2\\,713 = 52\\,713",
        tag: {
          text: "viết 5 trước chữ số 2",
          color: "lime",
        },
      },
    ],
    mode: "steps",
  },
  "them-be-vd": {
    kind: "lines",
    label: "Viết thêm chữ số 5 vào số 2 713 để được số bé nhất",
    rows: [
      {
        tex: "\\concept{lime}{5} < 7",
        tag: {
          text: "chữ số đầu tiên lớn hơn 5 là 7",
          color: "lime",
        },
      },
      {
        tex: "2\\,\\concept{lime}{5}\\,713 = 25\\,713",
        tag: {
          text: "viết 5 trước chữ số 7",
          color: "lime",
        },
      },
    ],
    mode: "steps",
  },
  "chen-8152": {
    kind: "gaps",
    digits: "8152",
    add: 4,
  },
  "goi-y-them-lon": {
    kind: "lines",
    label: "Viết thêm chữ số 6 vào số 935 để được số lớn nhất",
    rows: [
      {
        tex: "\\concept{lime}{6} < 9",
        tag: {
          text: "9 lớn hơn 6: đi tiếp",
          color: "lime",
        },
      },
      {
        tex: "\\concept{lime}{6} > 3",
        tag: {
          text: "3 bé hơn 6: dừng",
          color: "lime",
        },
      },
      {
        tex: "9\\,\\concept{lime}{6}\\,35 = 9\\,635",
        tag: {
          text: "viết 6 trước chữ số 3",
          color: "lime",
        },
      },
    ],
    mode: "hint",
  },
  "giai-them-8152": {
    kind: "lines",
    label: "Viết thêm chữ số 4 vào số 8 152 để được số lớn nhất",
    rows: [
      {
        tex: "\\concept{lime}{4} < 8",
        tag: {
          text: "8 lớn hơn 4: đi tiếp",
          color: "lime",
        },
      },
      {
        tex: "\\concept{lime}{4} > 1",
        tag: {
          text: "1 bé hơn 4: dừng",
          color: "lime",
        },
      },
      {
        tex: "8\\,\\concept{lime}{4}\\,152 = 84\\,152",
        tag: {
          text: "viết 4 trước chữ số 1",
          color: "lime",
        },
      },
    ],
    mode: "steps",
  },
  "chen-7308": {
    kind: "gaps",
    digits: "7308",
    add: 5,
  },
  "giai-them-7308": {
    kind: "lines",
    label: "Viết thêm chữ số 5 vào số 7 308 để được số lớn nhất",
    rows: [
      {
        tex: "\\concept{lime}{5} < 7",
        tag: {
          text: "7 lớn hơn 5: đi tiếp",
          color: "lime",
        },
      },
      {
        tex: "\\concept{lime}{5} > 3",
        tag: {
          text: "3 bé hơn 5: dừng",
          color: "lime",
        },
      },
      {
        tex: "7\\,\\concept{lime}{5}\\,308 = 75\\,308",
        tag: {
          text: "viết 5 trước chữ số 3",
          color: "lime",
        },
      },
    ],
    mode: "steps",
  },
  "chen-2915": {
    kind: "gaps",
    digits: "2915",
    add: 4,
  },
  "goi-y-them-be": {
    kind: "lines",
    label: "Viết thêm chữ số 6 vào số 358 để được số bé nhất",
    rows: [
      {
        tex: "\\concept{lime}{6} > 3",
        tag: {
          text: "3 bé hơn 6: đi tiếp",
          color: "lime",
        },
      },
      {
        tex: "\\concept{lime}{6} > 5",
        tag: {
          text: "5 bé hơn 6: đi tiếp",
          color: "lime",
        },
      },
      {
        tex: "\\concept{lime}{6} < 8",
        tag: {
          text: "8 lớn hơn 6: dừng",
          color: "lime",
        },
      },
      {
        tex: "35\\,\\concept{lime}{6}\\,8 = 3\\,568",
        tag: {
          text: "viết 6 trước chữ số 8",
          color: "lime",
        },
      },
    ],
    mode: "hint",
  },
  "chen-9863": {
    kind: "gaps",
    digits: "9863",
    add: 1,
  },
  "hai-chu-so-tom-tat": {
    kind: "lines",
    label: "Hàng đơn vị hơn hàng chục là 4",
    rows: [
      {
        tex: "15, 26, 37, 48, 59",
        tag: {
          text: "hàng chục từ 1 đến 5",
          color: "violet",
        },
      },
    ],
    mode: "still",
  },
  "hai-chu-so-vd": {
    kind: "lines",
    label: "Số có hai chữ số, hàng đơn vị hơn hàng chục là 4",
    rows: [
      {
        tex: "15",
        tag: {
          text: "chục 1, đơn vị 1 + 4",
          color: "violet",
        },
      },
      {
        tex: "26",
        tag: {
          text: "chục 2, đơn vị 2 + 4",
          color: "violet",
        },
      },
      {
        tex: "37",
        tag: {
          text: "chục 3, đơn vị 3 + 4",
          color: "violet",
        },
      },
      {
        tex: "48",
        tag: {
          text: "chục 4, đơn vị 4 + 4",
          color: "violet",
        },
      },
      {
        tex: "59",
        tag: {
          text: "chục 5, đơn vị 5 + 4",
          color: "violet",
        },
      },
      {
        tex: "\\concept{teal}{A} = \\{15; 26; 37; 48; 59\\}",
        tag: {
          text: "tập hợp A",
          color: "teal",
        },
      },
    ],
    mode: "steps",
  },
  "chon-chuc-gap-2": {
    kind: "chips",
    items: ["21", "12", "42", "36", "63"],
    wants: [0, 2, 4],
    done: "Hàng chục gấp 2 lần hàng đơn vị: 21, 42 và 63.",
  },
  "tap-chu-so-tom-tat": {
    kind: "rows",
    label: "Tập các chữ số của một số",
    rows: [
      {
        tex: "9\\,090 \\to \\{0; 9\\}",
        tag: {
          text: "tập hợp hai chữ số",
          color: "teal",
        },
      },
      {
        tex: "\\{205; 250; 502; 520\\}",
        tag: {
          text: "ba chữ số 0, 2, 5",
          color: "teal",
        },
      },
    ],
  },
  "tap-chu-so-vd": {
    kind: "rows",
    label: "Tập các chữ số",
    rows: [
      {
        tex: "7\\,337 \\to \\{3; 7\\}",
        tag: {
          text: "hai chữ số khác nhau",
          color: "teal",
        },
      },
      {
        tex: "4\\,080 \\to \\{0; 4; 8\\}",
        tag: {
          text: "ba chữ số khác nhau",
          color: "teal",
        },
      },
    ],
  },
  "lap-so-025": {
    kind: "lines",
    label: "Số có ba chữ số, tập các chữ số là {0; 2; 5}",
    rows: [
      {
        tex: "2 \\to 205, \\; 250",
        tag: {
          text: "hàng trăm là 2",
          color: "blue",
        },
      },
      {
        tex: "5 \\to 502, \\; 520",
        tag: {
          text: "hàng trăm là 5",
          color: "blue",
        },
      },
      {
        tex: "\\{205; 250; 502; 520\\}",
        tag: {
          text: "hàng trăm không là 0",
          color: "teal",
        },
      },
    ],
    mode: "steps",
  },
  "chon-tap-14": {
    kind: "chips",
    items: ["141", "114", "144", "145"],
    wants: [0, 1, 2],
    done: "Ba số 141, 114 và 144 đều có tập các chữ số là {1; 4}.",
  },
  "tong-chu-so-tom-tat": {
    kind: "lines",
    label: "Tổng các chữ số bằng 3",
    rows: [
      {
        tex: "\\{102; 111; 120; 201; 210; 300\\}",
        tag: {
          text: "6 số",
          color: "teal",
        },
      },
    ],
    mode: "still",
  },
  "tong-chu-so-vd": {
    kind: "lines",
    label: "Số có ba chữ số, tổng các chữ số bằng 3",
    rows: [
      {
        tex: "102; 111; 120",
        tag: {
          text: "hàng trăm 1, còn thiếu 2",
          color: "blue",
        },
      },
      {
        tex: "201; 210",
        tag: {
          text: "hàng trăm 2, còn thiếu 1",
          color: "blue",
        },
      },
      {
        tex: "300",
        tag: {
          text: "hàng trăm 3, còn thiếu 0",
          color: "blue",
        },
      },
      {
        tex: "\\concept{teal}{B} = \\{102; 111; 120; 201; 210; 300\\}",
        tag: {
          text: "tập hợp B có 6 số",
          color: "teal",
        },
      },
    ],
    mode: "steps",
  },
  "chon-tong-5": {
    kind: "chips",
    items: ["104", "115", "232", "122", "400"],
    wants: [0, 3],
    done: "104 và 122 có tổng các chữ số bằng 5.",
  },
  "hook-gia-tien": {
    kind: "places",
    n: 25000,
    show: "names",
    mode: "still",
  },
  sticker: {
    kind: "sticker",
  },
};
