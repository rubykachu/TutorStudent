// Pure helpers of the pictures of bracket removal: which terms inside a
// bracket must change sign, and what the sum looks like without brackets. No
// React, so `content:check` and tests read it.

export const LESSON_SLUG = "quy-tac-dau-ngoac";

// What stands before a bracket: "+", "-", or nothing (a bracket that opens the
// sum is read like a "+" bracket).
export type Lead = "+" | "-" | "";

// A sum written with brackets: loose terms (the number carries its sign) and
// bracketed groups.
export type Piece =
  | { kind: "term"; value: number }
  | { kind: "group"; lead: Lead; terms: readonly number[] };

export type BracketTerm = { value: number; lead: Lead };

// The terms inside brackets, in reading order. The child's state has one key
// per such term ("f0", "f1", …), 1 = its sign was changed.
export function bracketTerms(pieces: readonly Piece[]): BracketTerm[] {
  return pieces.flatMap((piece) =>
    piece.kind === "group"
      ? piece.terms.map((value) => ({ value, lead: piece.lead }))
      : [],
  );
}

export const flipKey = (index: number) => `f${index}`;

// Every term of a bracket with a minus before it must change sign, and no
// other. Bit i of the mask is term i.
export function goalMask(pieces: readonly Piece[]): number {
  return bracketTerms(pieces).reduce(
    (mask, term, i) => (term.lead === "-" ? mask | (1 << i) : mask),
    0,
  );
}

export function maskState(mask: number, size: number): Record<string, number> {
  return Object.fromEntries(
    Array.from({ length: size }, (_, i) => [flipKey(i), (mask >> i) & 1]),
  );
}

export function stateMask(
  state: Readonly<Record<string, number>>,
  size: number,
): number {
  let mask = 0;
  for (let i = 0; i < size; i++) {
    if ((state[flipKey(i)] ?? 0) === 1) mask |= 1 << i;
  }
  return mask;
}

// The sum without brackets for a given set of changed signs: loose terms keep
// their number, a bracketed term is negated when its sign was changed.
export function bracketFree(pieces: readonly Piece[], mask: number): number[] {
  const result: number[] = [];
  let next = 0;
  for (const piece of pieces) {
    if (piece.kind === "term") {
      result.push(piece.value);
      continue;
    }
    for (const value of piece.terms) {
      result.push((mask >> next) & 1 ? -value : value);
      next++;
    }
  }
  return result;
}

// The value of the sum as written, with its brackets.
export function sumValue(pieces: readonly Piece[]): number {
  return pieces.reduce((sum, piece) => {
    if (piece.kind === "term") return sum + piece.value;
    const inside = piece.terms.reduce((a, b) => a + b, 0);
    return sum + (piece.lead === "-" ? -inside : inside);
  }, 0);
}
