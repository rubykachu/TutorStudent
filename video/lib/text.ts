// Text normalisation for checking narration against its script. Whisper
// writes numbers as digits or words, confuses tones and spells lone letters
// as syllables, so both sides are reduced to the same plain form first:
// lower case, no tone marks or punctuation, numbers read out in words.

const DIGITS = [
  "khong",
  "mot",
  "hai",
  "ba",
  "bon",
  "nam",
  "sau",
  "bay",
  "tam",
  "chin",
];

// Reading of 0–99 without tones, in the canonical form this module compares
// (24 "hai muoi bon", never the spoken variant "tu"; see SPOKEN_VARIANTS).
function readTens(n: number): string[] {
  if (n < 10) return [DIGITS[n] as string];
  const tens = Math.floor(n / 10);
  const unit = n % 10;
  const head = tens === 1 ? ["muoi"] : [DIGITS[tens] as string, "muoi"];
  return unit === 0 ? head : [...head, DIGITS[unit] as string];
}

function readHundreds(n: number, full: boolean): string[] {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  if (!full && hundreds === 0) return readTens(rest);
  const head = [DIGITS[hundreds] as string, "tram"];
  if (rest === 0) return head;
  if (rest < 10) return [...head, "linh", DIGITS[rest] as string];
  return [...head, ...readTens(rest)];
}

export function readNumber(n: number): string[] {
  if (!Number.isInteger(n) || n < 0 || n >= 1_000_000_000) {
    throw new Error(`Cannot read ${n} as a whole number below one billion`);
  }
  const millions = Math.floor(n / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1000);
  const rest = n % 1000;
  const words: string[] = [];
  if (millions) words.push(...readHundreds(millions, false), "trieu");
  if (thousands) words.push(...readHundreds(thousands, millions > 0), "nghin");
  if (rest || words.length === 0) {
    words.push(...readHundreds(rest, words.length > 0));
  }
  return words;
}

// Spoken forms that mean the same as a canonical word, by the word before
// them ("hai mươi tư" = "hai mươi bốn", "thứ tư" = "thứ 4"), and names of
// lone letters.
const SPOKEN_VARIANTS: Record<string, Record<string, string>> = {
  muoi: { tu: "bon", lam: "nam" },
  thu: { tu: "bon" },
};
const WORD_VARIANTS: Record<string, string> = {
  ngan: "nghin",
  le: "linh",
  x: "nhan",
  // Whisper spells the letter n as the syllable it hears ("nờ", "en").
  no: "n",
  en: "n",
};

function stripTones(text: string): string {
  return text
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// One written word (as in the script or a Whisper word) as plain tokens.
export function wordTokens(word: string): string[] {
  const plain = stripTones(word)
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  if (!plain) return [];
  return plain.split(" ").flatMap((part) => {
    if (/^\d+$/.test(part)) return readNumber(Number(part));
    const letters = part.match(/^(\d+)([a-z]+)$/);
    if (letters)
      return [...readNumber(Number(letters[1])), letters[2] as string];
    // Northern voices say "tr" and "ch" alike, so Whisper cannot tell
    // "trừ" from "chữ"; both sides compare them as one sound.
    return [WORD_VARIANTS[part] ?? part.replace(/^tr/, "ch")];
  });
}

// Plain tokens of a sequence of words, each with the index of the word it
// came from (a number is several tokens).
export function ownedTokens(
  words: readonly string[],
): { token: string; owner: number }[] {
  const tokens = words.flatMap((word, owner) =>
    wordTokens(word).map((token) => ({ token, owner })),
  );
  return tokens.map((t, i) => {
    const before = tokens[i - 1]?.token;
    return {
      ...t,
      token: (before && SPOKEN_VARIANTS[before]?.[t.token]) || t.token,
    };
  });
}

export function textTokens(text: string): string[] {
  return ownedTokens(text.split(/\s+/)).map((t) => t.token);
}

export function levenshtein<T>(a: readonly T[], b: readonly T[]): number {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row.push(
        Math.min(
          (prev[j] as number) + 1,
          (row[j - 1] as number) + 1,
          (prev[j - 1] as number) + cost,
        ),
      );
    }
    prev = row;
  }
  return prev[b.length] as number;
}

// How closely a transcript matches the script, from 0 to 1: character
// similarity of the two normalised token strings.
export function matchRate(script: string, transcript: string): number {
  const a = [...textTokens(script).join(" ")];
  const b = [...textTokens(transcript).join(" ")];
  const longest = Math.max(a.length, b.length);
  return longest === 0 ? 1 : 1 - levenshtein(a, b) / longest;
}

// Lookup key of a spoken word in a composition: lower case, tone marks kept,
// punctuation dropped ("Thóc." -> "thóc").
export function anchorKey(word: string): string {
  return word
    .normalize("NFC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");
}
