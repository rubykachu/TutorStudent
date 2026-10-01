import { MINUS_SIGN } from "@/lib/number-format";

// Typed and stored text can differ only in Unicode form (Vietnamese letters
// have composed and decomposed spellings), spacing or case; none of those make
// an answer wrong. Diacritics are kept: "ma" and "má" are different words.
export function normalizeText(text: string): string {
  return text
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("vi");
}

// Vietnamese writes decimals with a comma and a negative number with the minus
// sign "−" (the pad types it; a keyboard types the hyphen "-"): both read the
// same. Empty input is "no number", never 0.
export function parseNumber(raw: string): number | undefined {
  const text = raw.trim().replace(",", ".").replace(MINUS_SIGN, "-");
  if (text === "") return undefined;
  const value = Number(text);
  return Number.isFinite(value) ? value : undefined;
}
