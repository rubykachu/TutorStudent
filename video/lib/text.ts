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

// Reading of each group of three digits of `n`, most significant first, with
// its unit word ("nghin", "trieu") attached; a zero group is empty. A number
// below 1000 has one group, below a million two, otherwise three.
function readGroups(n: number): string[][] {
  if (!Number.isInteger(n) || n < 0 || n >= 1_000_000_000) {
    throw new Error(`Cannot read ${n} as a whole number below one billion`);
  }
  const millions = Math.floor(n / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1000);
  const rest = n % 1000;
  const groups: string[][] = [];
  if (millions) groups.push([...readHundreds(millions, false), "trieu"]);
  if (thousands || millions) {
    groups.push(
      thousands ? [...readHundreds(thousands, millions > 0), "nghin"] : [],
    );
  }
  const before = groups.length > 0;
  if (rest) groups.push(readHundreds(rest, before));
  else groups.push(before ? [] : readHundreds(0, false));
  return groups;
}

export function readNumber(n: number): string[] {
  return readGroups(n).flat();
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
    // Whisper writes "35 nghìn" as "35.000" and "5 trừ 3" as "5-3".
    .replace(/(\d)\.(?=\d{3}(?!\d))/g, "$1")
    .replace(/(\d)-(?=\d)/g, "$1 tru ")
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

// A number written with its thousands groups apart ("4 376", "1 250 000"):
// a group of one to three digits, then groups of exactly three; only the last
// word may carry punctuation. Whisper writes the same number as "4376" or
// "4.376", so the words of a group run are read as one number.
const GROUP_HEAD = /^[1-9]\d{0,2}$/;
const GROUP_MIDDLE = /^\d{3}$/;
const GROUP_LAST = /^\d{3}[^\p{L}\p{N}]*$/u;
const MAX_GROUPS = 3;

// Number of words from `at` that form one grouped number, or 0.
function groupRunLength(words: readonly string[], at: number): number {
  if (!GROUP_HEAD.test(words[at] as string)) return 0;
  let n = 1;
  while (n < MAX_GROUPS) {
    const word = words[at + n];
    if (word === undefined) break;
    if (GROUP_MIDDLE.test(word)) {
      n++;
      continue;
    }
    if (GROUP_LAST.test(word)) n++;
    break;
  }
  return n > 1 ? n : 0;
}

// Plain tokens of a sequence of words, each with the index of the word it
// came from (a number is several tokens; a grouped number's tokens go to the
// word that holds their group).
export function ownedTokens(
  words: readonly string[],
): { token: string; owner: number }[] {
  const tokens: { token: string; owner: number }[] = [];
  for (let at = 0; at < words.length; ) {
    const run = groupRunLength(words, at);
    if (run === 0) {
      for (const token of wordTokens(words[at] as string)) {
        tokens.push({ token, owner: at });
      }
      at++;
      continue;
    }
    const digits = words
      .slice(at, at + run)
      .join("")
      .replace(/\D/g, "");
    readGroups(Number(digits)).forEach((group, i) => {
      for (const token of group) tokens.push({ token, owner: at + i });
    });
    at += run;
  }
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
