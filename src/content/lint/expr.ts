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
    const char = text.charAt(i);
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
// e.g. "2^{3} \cdot 2" or "\htmlId{co-so}{2}^{3}"; undefined otherwise.
export function texValue(tex: string): number | undefined {
  let source = tex;
  let previous = "";
  while (previous !== source) {
    previous = source;
    source = source.replace(/\\htmlId\{[^}]*\}\{([^{}]*)\}/g, "($1)");
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
