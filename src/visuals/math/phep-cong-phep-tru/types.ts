// Shared by every picture of the addition and subtraction lesson.

export type Op = "add" | "sub";

// How a worked picture plays:
// - "full": steps through to the answer;
// - "hint": steps up to the answer and leaves it as "?";
// - "still": every step at once, for rule screens and recaps.
export type StepsMode = "full" | "hint" | "still";

// Thousands separator of the content lint: a no-break thin space (U+202F)
// between groups of three digits from four digits up.
export function formatNumber(value: number): string {
  const digits = String(Math.abs(value));
  const grouped =
    digits.length >= 4 ? digits.replace(/\B(?=(\d{3})+$)/g, " ") : digits;
  return value < 0 ? `−${grouped}` : grouped;
}
