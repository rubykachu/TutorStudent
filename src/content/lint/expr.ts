import { MINUS_SIGN } from "@/lib/number-format";
import {
  CONCEPT_TEX_PATTERN,
  DIVIDES_MACRO,
  NOT_DIVIDES_MACRO,
} from "@/lib/tex";
import type { Item } from "@/schema/content";

// Evaluator for `check.expr`: numbers (decimal comma), + - · : ^ and
// parentheses, with the usual precedence and right-associative powers.

export type ExprResult =
  | { ok: true; value: number }
  | { ok: false; error: string };

type Token = { kind: "num"; value: number } | { kind: "op"; op: string };

// Whitespace, including the thousands separator, is not significant.
const SPACES = /[\s ]/g;

function tokenize(source: string): Token[] | string {
  const tokens: Token[] = [];
  const text = source.replace(SPACES, "");
  let i = 0;
  while (i < text.length) {
    const number = /^\d+(?:,\d+)?/.exec(text.slice(i));
    if (number) {
      tokens.push({
        kind: "num",
        value: Number(number[0].replace(",", ".")),
      });
      i += number[0].length;
      continue;
    }
    // The minus sign of printed text (U+2212) reads as the hyphen.
    const char = text.charAt(i) === MINUS_SIGN ? "-" : text.charAt(i);
    if (!"+-·:^()".includes(char)) {
      return `Unexpected "${char}"; use digits, "," for decimals and + - · : ^ ( )`;
    }
    tokens.push({ kind: "op", op: char });
    i++;
  }
  return tokens;
}

class ParseError extends Error {}

export function evaluateExpr(source: string): ExprResult {
  const tokens = tokenize(source);
  if (typeof tokens === "string") return { ok: false, error: tokens };
  let pos = 0;
  const peek = (): Token | undefined => tokens[pos];
  const isOp = (op: string): boolean => {
    const token = peek();
    return token?.kind === "op" && token.op === op;
  };
  const primary = (): number => {
    const token = peek();
    if (token?.kind === "num") {
      pos++;
      return token.value;
    }
    if (isOp("(")) {
      pos++;
      const value = sum();
      if (!isOp(")")) throw new ParseError('Missing ")"');
      pos++;
      return value;
    }
    throw new ParseError(token ? `Unexpected "${token.op}"` : "Unexpected end");
  };
  const power = (): number => {
    if (isOp("-")) {
      pos++;
      return -power();
    }
    const base = primary();
    if (!isOp("^")) return base;
    pos++;
    return base ** power();
  };
  const product = (): number => {
    let value = power();
    while (isOp("·") || isOp(":")) {
      const divide = isOp(":");
      pos++;
      const right = power();
      if (divide && right === 0) throw new ParseError("Division by zero");
      value = divide ? value / right : value * right;
    }
    return value;
  };
  const sum = (): number => {
    let value = product();
    while (isOp("+") || isOp("-")) {
      const minus = isOp("-");
      pos++;
      const right = product();
      value = minus ? value - right : value + right;
    }
    return value;
  };

  try {
    const value = sum();
    if (pos < tokens.length) throw new ParseError("Unexpected trailing input");
    return { ok: true, value };
  } catch (error) {
    if (error instanceof ParseError) return { ok: false, error: error.message };
    throw error;
  }
}

// Answers and computed values agree when they differ only by float rounding.
export function sameNumber(a: number, b: number): boolean {
  return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
}

// Value shown by a TeX formula made only of numbers and supported operators,
// e.g. "2^{3} \cdot 2", "\htmlId{co-so}{2}^{3}" or "\concept{blue}{2}^{3}";
// undefined otherwise.
export function texValue(tex: string): number | undefined {
  let source = tex;
  let previous = "";
  while (previous !== source) {
    previous = source;
    source = source
      .replace(/\\htmlId\{[^}]*\}\{([^{}]*)\}/g, "($1)")
      .replace(CONCEPT_TEX_PATTERN, "($2)");
  }
  source = source
    .replace(/\\cdot/g, "·")
    .replace(/\\,/g, "")
    .replace(/\{,\}/g, ",")
    .replace(/\\left|\\right/g, "")
    .replace(/\{/g, "(")
    .replace(/\}/g, ")");
  if (source.includes("\\")) return undefined;
  const result = evaluateExpr(source);
  return result.ok ? result.value : undefined;
}

// Value of a plain-text option such as "8" or "1 024" or "2,5".
export function textValue(text: string): number | undefined {
  const source = text.replace(SPACES, "");
  if (!/^-?\d+(?:,\d+)?$/.test(source)) return undefined;
  return Number(source.replace(",", "."));
}

const SUPERSCRIPT_DIGITS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const SUPERSCRIPT_RUN = new RegExp(`[${SUPERSCRIPT_DIGITS}]+`, "g");

// Value of a plain-text expression such as "2³ · 4" or "12 : 3"; undefined
// when the text holds anything but numbers and supported operators.
export function textExprValue(text: string): number | undefined {
  const source = text.replace(
    SUPERSCRIPT_RUN,
    (run) => `^${[...run].map((c) => SUPERSCRIPT_DIGITS.indexOf(c)).join("")}`,
  );
  const result = evaluateExpr(source);
  return result.ok ? result.value : undefined;
}

// Value shown by a choice option, match or order item.
export function itemValue(item: Item): number | undefined {
  if (item.content.type === "text") return textExprValue(item.content.text);
  if (item.content.type === "formula") return texValue(item.content.tex);
  return undefined;
}

// Comparison operators in text and TeX, longest spelling first.
const COMPARISONS: [string, (a: number, b: number) => boolean][] = [
  ["\\neq", (a, b) => !sameNumber(a, b)],
  ["\\ne", (a, b) => !sameNumber(a, b)],
  ["\\leq", (a, b) => a < b || sameNumber(a, b)],
  ["\\geq", (a, b) => a > b || sameNumber(a, b)],
  ["\\le", (a, b) => a < b || sameNumber(a, b)],
  ["\\ge", (a, b) => a > b || sameNumber(a, b)],
  ["\\lt", (a, b) => a < b && !sameNumber(a, b)],
  ["\\gt", (a, b) => a > b && !sameNumber(a, b)],
  ["≠", (a, b) => !sameNumber(a, b)],
  ["≤", (a, b) => a < b || sameNumber(a, b)],
  ["≥", (a, b) => a > b || sameNumber(a, b)],
  ["=", sameNumber],
  ["<", (a, b) => a < b && !sameNumber(a, b)],
  [">", (a, b) => a > b && !sameNumber(a, b)],
];

// A spelling as a pattern that matches only itself: the macro `\le` is not a
// regex escape. The negative lookahead keeps `\le` from matching the start of
// `\leq`.
function spellingPattern(spelling: string): RegExp {
  return new RegExp(
    `${spelling.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")}(?![a-z])`,
  );
}

// Divisibility relations of formulas, the longer name first: "a \chiahet b"
// holds when a is a multiple of b. The relation is defined on natural numbers
// only, so a side that is not an integer (or a zero divisor) has no truth
// value.
const DIVISIBILITY: [string, (a: number, b: number) => boolean][] = [
  [NOT_DIVIDES_MACRO, (a, b) => a % b !== 0],
  [DIVIDES_MACRO, (a, b) => a % b === 0],
];

function divisibilityValue(
  holds: (a: number, b: number) => boolean,
  a: number,
  b: number,
): boolean | undefined {
  // Divisibility here is on natural numbers: a negative side (a difference
  // such as 3 - 5) has no verdict.
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b <= 0) {
    return undefined;
  }
  return holds(a, b);
}

// Truth of an option that states one comparison between two computable
// sides, e.g. "2^{3} \cdot 2^{2} = 2^{5}", "3² < 10" or "56 \chiahet 7";
// undefined otherwise.
export function comparisonValue(item: Item): boolean | undefined {
  const content = item.content;
  if (content.type !== "text" && content.type !== "formula") return undefined;
  const source = content.type === "text" ? content.text : content.tex;
  const side = content.type === "text" ? textExprValue : texValue;
  if (content.type === "formula") {
    for (const [name, holds] of DIVISIBILITY) {
      const parts = source.split(spellingPattern(name));
      if (parts.length === 1) continue;
      if (parts.length !== 2) return undefined;
      const [left, right] = parts.map((part) => side(part ?? ""));
      if (left === undefined || right === undefined) return undefined;
      return divisibilityValue(holds, left, right);
    }
  }
  for (const [spelling, holds] of COMPARISONS) {
    const parts = source.split(spellingPattern(spelling));
    if (parts.length === 1) continue;
    if (parts.length !== 2) return undefined;
    const [left, right] = parts.map((part) => side(part ?? ""));
    if (left === undefined || right === undefined) return undefined;
    return holds(left, right);
  }
  return undefined;
}
