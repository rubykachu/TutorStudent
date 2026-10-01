import type { BagsSpec } from "@/visuals/shared/bag-groups";
import type { LinesSpec, Mode, RowsSpec } from "@/visuals/shared/formula-rows";
import type { ChipsSpec } from "@/visuals/shared/pick-chips";

// Every picture of the lesson that is drawn from numbers: the registry builds
// one entry per item (id `dau-hieu-chia-het.visual.<key>`), so a new example
// is one item here and its id in lesson.json. Pure data, no React, so
// `content:check` reads it.

export { LESSON_SLUG } from "./logic";

export type VisualSpec =
  // Items packed into bags, one bag per step (see `BagsSpec`).
  | ({ kind: "bags" } & BagsSpec)
  // Formulas stacked, each with an optional tag (see `RowsSpec`).
  | ({ kind: "rows" } & RowsSpec)
  // Lines of a worked example, one more on every step (see `LinesSpec`).
  | ({ kind: "lines" } & LinesSpec)
  // Numbers the child taps to pick, state { i0, i1, … } (see `ChipsSpec`).
  | ({ kind: "chips" } & ChipsSpec)
  // The digits of `n` as tiles; the last one is picked out, then the verdict
  // "n divisible by divisor" with the digit that decided it. `divisor` 0
  // means no verdict: the picture ends on the picked digit. In "hint" the
  // last step stays a "?".
  | { kind: "digits"; n: number; divisor: number; mode: Mode }
  // Still picture: for every divisor a row of the tiles 0..9, filled where a
  // number ending in that digit is divisible; with several divisors a last
  // row marks the digits that fit all of them.
  | { kind: "endDigits"; divisors: readonly number[] }
  // The digits of `n` as tiles, their sum, whether the sum is divisible by
  // `divisor`, then the verdict for `n`; `divisor` 0 means the sum only. In
  // "hint" the last line stays a "?".
  | { kind: "digitSum"; n: number; divisor: number; mode: Mode }
  // Hands-on: `before` digits, one box, `after` digits; the child picks the
  // box's digit 0..9, state { d }. `divisors` are the ones the number must
  // be divisible by. `goal` (lesson screen) adds a live verdict, progress and
  // a closing line; in an exercise the params override before, after,
  // afterLen, divisor and divisor2, and nothing is revealed.
  | {
      kind: "digitBox";
      before: string;
      after: string;
      divisors: readonly number[];
      goal: boolean;
    }
  | { kind: "sticker" };

export type SpecKind = VisualSpec["kind"];
export type SpecOf<K extends SpecKind> = Extract<VisualSpec, { kind: K }>;

// Kinds the child acts on (counted as interactive by `--stats`).
export const INTERACTIVE_KINDS: ReadonlySet<SpecKind> = new Set([
  "chips",
  "digitBox",
]);

// Validator id of the `manipulate` exercises each interactive kind serves;
// "chon-dung" is the validator shared with the set lesson's pick screens.
export const VALIDATOR_IDS = {
  chips: "chon-dung",
  digitBox: "chia-het",
} as const;

export const VISUAL_SPECS: Readonly<Record<string, VisualSpec>> = {
  bags: {
    kind: "bags",
    total: 12,
    size: 4,
    thing: "kẹo",
    unit: "cái",
    bag: "túi",
    mode: "steps",
  },
  rows: {
    kind: "rows",
    label: "Ba số chia hết cho 2",
    rows: [
      { tex: "\\concept{blue}{14} \\chiahet 2" },
      { tex: "\\concept{blue}{30} \\chiahet 2" },
      { tex: "\\concept{pink}{25} \\khongchiahet 2" },
    ],
  },
  lines: {
    kind: "lines",
    label: "Ví dụ: 36 chia hết cho 2",
    mode: "steps",
    rows: [
      { tex: "36 = 30 + 6" },
      { tex: "30 \\chiahet 2 \\quad 6 \\chiahet 2" },
      { tex: "36 \\chiahet 2" },
    ],
  },
  chips: {
    kind: "chips",
    items: ["14", "25", "30", "41"],
    wants: [0, 2],
    done: "Bạn đã chọn đủ các số chia hết cho 2.",
  },
  digits: { kind: "digits", n: 4326, divisor: 2, mode: "steps" },
  "end-digits": { kind: "endDigits", divisors: [2, 5] },
  "digit-sum": { kind: "digitSum", n: 4326, divisor: 3, mode: "steps" },
  "digit-box": {
    kind: "digitBox",
    before: "43",
    after: "",
    divisors: [2],
    goal: true,
  },
  sticker: { kind: "sticker" },
};
