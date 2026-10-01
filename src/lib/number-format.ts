import { THOUSANDS_MIN_DIGITS } from "@/content/lint/config";

// Thousands separator as Vietnamese textbooks print it: a narrow no-break
// space, so "1 024" never wraps between its groups.
export const THOUSANDS_SEPARATOR = " ";

// The minus sign as Vietnamese textbooks print negative numbers (U+2212): the
// hyphen is shorter than the digits and reads as a dash.
export const MINUS_SIGN = "−";

// "-5" as "−5": how a negative number is shown to the child.
export function withMinusSign(text: string): string {
  return text.startsWith("-") ? `${MINUS_SIGN}${text.slice(1)}` : text;
}

// Whole numbers as the content lint expects them in text: grouped by three
// from four digits on. Accepts bigint for values past 2^53, e.g. 2^63.
export function formatInteger(value: number | bigint): string {
  const digits = BigInt(value).toString();
  if (digits.replace("-", "").length < THOUSANDS_MIN_DIGITS) return digits;
  return digits.replace(/\B(?=(\d{3})+$)/g, THOUSANDS_SEPARATOR);
}
