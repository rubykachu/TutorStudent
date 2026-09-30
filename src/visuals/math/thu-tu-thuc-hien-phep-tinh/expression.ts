// Step-by-step evaluation of a number expression in the order the textbook
// teaches: innermost brackets first, then inside a bracket (or the whole
// line) powers, then multiplication and division from left to right, then
// addition and subtraction from left to right. One operation per step, so a
// visual can colour the operation being done and show each result.
//
// Expressions are written with ASCII "-" and the textbook's "·" and ":";
// "^" raises the number on its left ("2^5"). Brackets ( ) [ ] { } group.
// Kept free of React so visuals, validators and tests share it.

export type Bracket = "(" | "[" | "{";
export type OperatorSign = "+" | "-" | "·" | ":";

export type Token =
  | { kind: "num"; value: number }
  | { kind: "op"; op: OperatorSign }
  | { kind: "pow"; base: number; exponent: number }
  | { kind: "open"; bracket: Bracket }
  | { kind: "close"; bracket: Bracket };

export const CLOSER: Readonly<Record<Bracket, string>> = {
  "(": ")",
  "[": "]",
  "{": "}",
};
const OPENERS = "([{";
const CLOSERS = ")]}";
const OPERATORS = "+-·:";

export function parseExpression(source: string): Token[] {
  const text = source.replace(/\s/g, "").replaceAll("−", "-");
  const tokens: Token[] = [];
  const stack: Bracket[] = [];
  let i = 0;
  while (i < text.length) {
    const char = text.charAt(i);
    const number = /^\d+/.exec(text.slice(i));
    if (number) {
      const value = Number(number[0]);
      i += number[0].length;
      if (text.charAt(i) === "^") {
        const exponent = /^\d+/.exec(text.slice(i + 1));
        if (!exponent) throw new Error(`Missing exponent in "${source}"`);
        tokens.push({
          kind: "pow",
          base: value,
          exponent: Number(exponent[0]),
        });
        i += 1 + exponent[0].length;
      } else {
        tokens.push({ kind: "num", value });
      }
      continue;
    }
    if (OPERATORS.includes(char)) {
      tokens.push({ kind: "op", op: char as OperatorSign });
    } else if (OPENERS.includes(char)) {
      stack.push(char as Bracket);
      tokens.push({ kind: "open", bracket: char as Bracket });
    } else if (CLOSERS.includes(char)) {
      const open = stack.pop();
      if (open === undefined || CLOSER[open] !== char) {
        throw new Error(`Unbalanced "${char}" in "${source}"`);
      }
      tokens.push({ kind: "close", bracket: open });
    } else {
      throw new Error(`Unexpected "${char}" in "${source}"`);
    }
    i++;
  }
  if (stack.length > 0) throw new Error(`Unclosed bracket in "${source}"`);
  return tokens;
}

export function tokenText(token: Token): string {
  switch (token.kind) {
    case "num":
      return String(token.value);
    case "op":
      return token.op;
    case "pow":
      return `${token.base}^${token.exponent}`;
    case "open":
      return token.bracket;
    case "close":
      return CLOSER[token.bracket];
  }
}

// Token indices of the operations still to do, left to right: each operator
// and each power.
export function operationIndices(tokens: readonly Token[]): number[] {
  return tokens.flatMap((token, i) =>
    token.kind === "op" || token.kind === "pow" ? [i] : [],
  );
}

export type Calculation = {
  // Operands and sign as shown in the little sum beside the line.
  left: number;
  sign: OperatorSign | "^";
  right: number;
  result: number;
};

export type Operation = {
  // Index of the operator or power token.
  index: number;
  // Tokens the operation uses: its two operands and sign, or the power.
  start: number;
  end: number;
  calculation: Calculation;
};

function numberAt(token: Token | undefined, tokens: readonly Token[]): number {
  if (token?.kind !== "num") {
    throw new Error(`Operand missing in "${tokens.map(tokenText).join(" ")}"`);
  }
  return token.value;
}

// The operation whose operator (or power) sits at `index`. Throws when the
// result would leave the natural numbers, since the lesson stays inside them.
export function operationAt(
  tokens: readonly Token[],
  index: number,
): Operation {
  const token = tokens[index];
  if (token?.kind === "pow") {
    return {
      index,
      start: index,
      end: index,
      calculation: {
        left: token.base,
        sign: "^",
        right: token.exponent,
        result: token.base ** token.exponent,
      },
    };
  }
  if (token?.kind !== "op") throw new Error("Not an operation");
  const left = numberAt(tokens[index - 1], tokens);
  const right = numberAt(tokens[index + 1], tokens);
  let result: number;
  switch (token.op) {
    case "+":
      result = left + right;
      break;
    case "-":
      if (left < right) throw new Error(`${left} - ${right} is negative`);
      result = left - right;
      break;
    case "·":
      result = left * right;
      break;
    case ":":
      if (right === 0 || left % right !== 0) {
        throw new Error(`${left} : ${right} is not a whole number`);
      }
      result = left / right;
      break;
  }
  return {
    index,
    start: index - 1,
    end: index + 1,
    calculation: { left, sign: token.op, right, result },
  };
}

// Bounds (token indices, brackets excluded) of the part to work on now: the
// first bracket pair with nothing inside it, or the whole line.
function activeSegment(tokens: readonly Token[]): { lo: number; hi: number } {
  const close = tokens.findIndex((t) => t.kind === "close");
  if (close < 0) return { lo: 0, hi: tokens.length - 1 };
  let open = close - 1;
  while (tokens[open]?.kind !== "open") open--;
  return { lo: open + 1, hi: close - 1 };
}

// The operation the rules say comes next, or undefined once a single number
// is left.
export function nextOperation(tokens: readonly Token[]): Operation | undefined {
  const { lo, hi } = activeSegment(tokens);
  const inside = tokens.slice(lo, hi + 1);
  const firstIndex = (match: (t: Token) => boolean) => {
    const at = inside.findIndex(match);
    return at < 0 ? -1 : lo + at;
  };
  const index = [
    firstIndex((t) => t.kind === "pow"),
    firstIndex((t) => t.kind === "op" && (t.op === "·" || t.op === ":")),
    firstIndex((t) => t.kind === "op" && (t.op === "+" || t.op === "-")),
  ].find((at) => at >= 0);
  return index === undefined ? undefined : operationAt(tokens, index);
}

// Replaces an operation by its result. A bracket pair left holding a single
// number disappears with it, as the textbook writes the next line.
export function applyOperation(
  tokens: readonly Token[],
  operation: Operation,
): { tokens: Token[]; resultIndex: number } {
  const result: Token = { kind: "num", value: operation.calculation.result };
  const next = [
    ...tokens.slice(0, operation.start),
    result,
    ...tokens.slice(operation.end + 1),
  ];
  let resultIndex = operation.start;
  const before = next[resultIndex - 1];
  const after = next[resultIndex + 1];
  if (before?.kind === "open" && after?.kind === "close") {
    next.splice(resultIndex + 1, 1);
    next.splice(resultIndex - 1, 1);
    resultIndex -= 1;
  }
  return { tokens: next, resultIndex };
}

export type Line = {
  tokens: Token[];
  // Index in `tokens` of the result of the previous step, if any.
  resultIndex?: number;
  // The operation done next, absent on the last line.
  operation?: Operation;
};

// Every line from the expression to its value, one operation per step. The
// optional `first` picks the first operation itself (to show a wrong order).
export function expressionLines(
  source: string,
  first?: (tokens: readonly Token[]) => Operation,
): Line[] {
  let tokens = parseExpression(source);
  const lines: Line[] = [];
  let resultIndex: number | undefined;
  let pick = first;
  for (;;) {
    const operation = pick ? pick(tokens) : nextOperation(tokens);
    pick = undefined;
    lines.push({ tokens, resultIndex, operation });
    if (!operation) return lines;
    const applied = applyOperation(tokens, operation);
    tokens = applied.tokens;
    resultIndex = applied.resultIndex;
  }
}

export function expressionValue(source: string): number {
  const last = expressionLines(source).at(-1)?.tokens[0];
  if (last?.kind !== "num") throw new Error(`No value for "${source}"`);
  return last.value;
}

// Operations done, in the order the rules give.
export function calculations(source: string): Calculation[] {
  return expressionLines(source).flatMap((line) =>
    line.operation ? [line.operation.calculation] : [],
  );
}

const SUPERSCRIPTS = "⁰¹²³⁴⁵⁶⁷⁸⁹";

function tokenDisplay(token: Token): string {
  switch (token.kind) {
    case "num":
      return String(token.value);
    case "op":
      return ` ${{ "+": "+", "-": "−", "·": "·", ":": ":" }[token.op]} `;
    case "pow":
      return `${token.base}${[...String(token.exponent)].map((c) => SUPERSCRIPTS[Number(c)]).join("")}`;
    case "open":
      return token.bracket;
    case "close":
      return CLOSER[token.bracket];
  }
}

// An expression as plain text the way the textbook prints it: "2 · 3² + 10".
export function displayText(tokens: readonly Token[]): string {
  return tokens.map(tokenDisplay).join("").replace(/\s+/g, " ").trim();
}
