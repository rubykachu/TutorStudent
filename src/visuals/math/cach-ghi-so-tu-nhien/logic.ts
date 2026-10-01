import type { ManipulateSolver, ManipulateValidator } from "@/visuals/registry";

// Pure helpers of the pictures of the lesson on writing natural numbers:
// digits and places, the Roman numerals up to 30, the numbers a gap-picking
// exercise builds, and the validator of the "write the number" exercise. No
// React, so `content:check` and tests read it.

export const LESSON_SLUG = "cach-ghi-so-tu-nhien";

// Thousands are grouped by U+202F (narrow no-break space), as in lesson text.
const GROUP_SEPARATOR = " ";

// Names of the places from the right: units first.
export const PLACE_NAMES = [
  "đơn vị",
  "chục",
  "trăm",
  "nghìn",
  "chục nghìn",
  "trăm nghìn",
  "triệu",
] as const;

// Most digits any picture of the lesson draws.
export const MAX_DIGITS = PLACE_NAMES.length;

// The digits of n, most significant first.
export function digitsOf(n: number): number[] {
  return [...String(n)].map(Number);
}

// Number of the place (0 = units) of the digit at `index` in a number of
// `length` digits.
export function placePower(index: number, length: number): number {
  return length - 1 - index;
}

export function placeName(power: number): string {
  return PLACE_NAMES[power] ?? "";
}

// "hàng trăm", "hàng đơn vị".
export function placeLabel(power: number): string {
  return `hàng ${placeName(power)}`;
}

// Value of one unit of a place: 1, 10, 100, ...
export function placeUnit(power: number): number {
  return 10 ** power;
}

// n written with thousands grouped: "4 273".
export function groupedText(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, GROUP_SEPARATOR);
}

// A whole number in TeX with thousands grouped by thin spaces.
export function texInt(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\\,");
}

// The value of a digit sitting at `power`, as TeX: "6 \cdot 100" (a units
// digit is just the digit; a zero digit is "0").
export function valueTex(digit: number, power: number): string {
  if (digit === 0) return "0";
  return power === 0 ? String(digit) : `${digit} \\cdot ${texInt(10 ** power)}`;
}

// n as the sum of the values of its digits, zeros left out: "6 · 100 + 2 · 10
// + 1". A number with no non-zero digit is "0".
export function sumTex(n: number): string {
  const digits = digitsOf(n);
  const terms = digits.flatMap((digit, i) =>
    digit === 0 ? [] : [valueTex(digit, placePower(i, digits.length))],
  );
  return terms.length === 0 ? "0" : terms.join(" + ");
}

// The number written by digits listed from the left.
export function numberOfDigits(digits: readonly number[]): number {
  return digits.reduce((total, digit) => total * 10 + digit, 0);
}

// Positions 0 … length of the gaps of a number of `length` digits: gap k lies
// before the digit at index k, the last one after the last digit.
export function insertAt(
  digits: readonly number[],
  gap: number,
  digit: number,
) {
  return [...digits.slice(0, gap), digit, ...digits.slice(gap)];
}

// The gap that gives the largest (`best` = "max") or smallest ("min") number
// when `digit` is written into `digits`: before the first digit smaller (for
// the largest) or larger (for the smallest) than it, else at the end. The
// digit must not be 0 when the smallest number is asked, since a number
// never starts with 0.
export function bestGap(
  digits: readonly number[],
  digit: number,
  best: "max" | "min",
): number {
  const found = digits.findIndex((d) =>
    best === "max" ? d < digit : d > digit,
  );
  return found === -1 ? digits.length : found;
}

// ---------------------------------------------------------------------------
// Roman numerals up to 30

const ROMAN_PARTS: readonly (readonly [string, number])[] = [
  ["X", 10],
  ["IX", 9],
  ["V", 5],
  ["IV", 4],
  ["I", 1],
];

export const ROMAN_MAX = 30;

// The Roman numeral of n, 1 … 30.
export function toRoman(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > ROMAN_MAX) {
    throw new RangeError(`No Roman numeral for ${n}`);
  }
  let rest = n;
  let out = "";
  for (const [text, value] of ROMAN_PARTS) {
    while (rest >= value) {
      out += text;
      rest -= value;
    }
  }
  return out;
}

// The parts a Roman numeral is written from, left to right ("XXIV" gives X,
// X, IV): the clusters IV and IX stay whole.
export function romanParts(roman: string): string[] {
  const parts: string[] = [];
  let i = 0;
  while (i < roman.length) {
    const pair = roman.slice(i, i + 2);
    if (pair === "IV" || pair === "IX") {
      parts.push(pair);
      i += 2;
    } else {
      parts.push(roman.charAt(i));
      i += 1;
    }
  }
  return parts;
}

export function romanValue(roman: string): number {
  return romanParts(roman).reduce(
    (total, part) => total + (ROMAN_PARTS.find(([t]) => t === part)?.[1] ?? 0),
    0,
  );
}

// "XXIV = X + X + IV" in TeX.
export function romanSplitTex(roman: string): string {
  return `\\mathrm{${roman}} = ${romanParts(roman)
    .map((part) => `\\mathrm{${part}}`)
    .join(" + ")}`;
}

// "10 + 10 + 4 = 24" in TeX.
export function romanSumTex(roman: string): string {
  const values = romanParts(roman).map(
    (part) => ROMAN_PARTS.find(([t]) => t === part)?.[1] ?? 0,
  );
  return `${values.join(" + ")} = ${romanValue(roman)}`;
}

// ---------------------------------------------------------------------------
// "Write the number" exercise

// Digits the child may put in a slot.
export const DIGIT_RANGE = { min: 0, max: 9 } as const;

// Slot keys: d0 is the leftmost digit.
export function slotKey(index: number): string {
  return `d${index}`;
}

// The number the slots of `state` spell, or undefined while any of the `len`
// slots is still empty.
export function slotsNumber(
  state: Readonly<Record<string, number>>,
  len: number,
): number | undefined {
  const digits: number[] = [];
  for (let i = 0; i < len; i++) {
    const digit = state[slotKey(i)];
    if (digit === undefined) return undefined;
    digits.push(digit);
  }
  return numberOfDigits(digits);
}

// The slots spell exactly params.n written on params.len digits. The picture
// reports { d0, d1, … }; a slot never touched is no answer.
const vietSo: ManipulateValidator = (state, params) => {
  const { n, len } = params;
  if (n === undefined || len === undefined) return false;
  return slotsNumber(state, len) === n && String(n).length === len;
};

const solveVietSo: ManipulateSolver = (params) =>
  Object.fromEntries(
    digitsOf(params.n ?? 0).map((digit, i) => [slotKey(i), digit]),
  );

export const validators = { "viet-so": vietSo } as const;
export const solutions = { "viet-so": solveVietSo } as const;
