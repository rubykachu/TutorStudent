import { CONCEPT_COLORS, type ConceptColor } from "@/schema/content";

// TeX extensions content may use, shared by the formula renderer and the
// content lint so both read formulas the same way.

// `\concept{<colour>}{…}` paints its argument in a concept colour, so a base
// inside a formula is blue like the "● Cơ số" legend next to it. The colour
// is a design-system token name, never a hex value.
export const CONCEPT_MACRO = "\\concept";

// Divisibility relations as Vietnamese textbooks print them: "a ⋮ b" reads "a
// chia hết cho b", and the same sign struck through reads "không chia hết".
// The strike is a slash laid over the dots (`\mathrlap`), not `\not`, whose
// slash is as wide as an equals sign and would reach the next number. The
// content lint recognises both names (`comparisonValue`).
export const DIVIDES_MACRO = "\\chiahet";
export const NOT_DIVIDES_MACRO = "\\khongchiahet";

export const TEX_MACROS: Readonly<Record<string, string>> = {
  [CONCEPT_MACRO]: "\\htmlData{concept=#1}{#2}",
  [DIVIDES_MACRO]: "\\mathrel{\\vdots}",
  [NOT_DIVIDES_MACRO]: "\\mathrel{\\mathrlap{/}\\vdots}",
};

// The data attribute KaTeX writes for the macro above.
export const CONCEPT_DATA_ATTR = "data-concept";

// Innermost `\concept{colour}{body}` with a brace-free body; callers repeat
// the replacement to unwrap nested groups.
export const CONCEPT_TEX_PATTERN = /\\concept\{([^{}]*)\}\{([^{}]*)\}/g;

// Every colour named by `\concept` in a TeX source.
export function conceptColorsInTex(tex: string): string[] {
  return [...tex.matchAll(/\\concept\{([^{}]*)\}/g)].map((m) => m[1] ?? "");
}

export function isConceptColor(value: string): value is ConceptColor {
  return (CONCEPT_COLORS as readonly string[]).includes(value);
}
