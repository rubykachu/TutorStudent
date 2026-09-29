import { ABBREVIATIONS, UNITS } from "./config";
import { nfc, words } from "./text";
import { type Finding, findingCollector, type LintInput } from "./types";
import type { LessonStrings } from "./walk";

// Blocks English (and typos) by requiring every word to be a well-formed
// Vietnamese syllable: onset + rime + tone, with the spelling rules of the
// Vietnamese alphabet. Words outside that shape must be listed explicitly.

const ONSETS = [
  "ngh",
  "ng",
  "gh",
  "gi",
  "kh",
  "nh",
  "ph",
  "qu",
  "th",
  "tr",
  "ch",
  "b",
  "c",
  "d",
  "đ",
  "g",
  "h",
  "k",
  "l",
  "m",
  "n",
  "p",
  "r",
  "s",
  "t",
  "v",
  "x",
  "",
];

// Rimes without a final consonant or with a glide ending.
const OPEN_RIMES = [
  "a",
  "e",
  "ê",
  "i",
  "o",
  "ô",
  "ơ",
  "u",
  "ư",
  "y",
  "ia",
  "ua",
  "ưa",
  "oa",
  "oe",
  "uê",
  "uy",
  "uơ",
  "uya",
  "ai",
  "ao",
  "au",
  "ay",
  "âu",
  "ây",
  "eo",
  "êu",
  "iu",
  "oi",
  "ôi",
  "ơi",
  "ui",
  "ưi",
  "ưu",
  "iêu",
  "yêu",
  "uôi",
  "ươi",
  "ươu",
  "oai",
  "oay",
  "oeo",
  "uây",
  "uyu",
];

// Vowel nuclei and the final consonants each one takes.
const CLOSED_RIMES: Record<string, readonly string[]> = {
  a: ["m", "n", "ng", "nh", "p", "t", "c", "ch"],
  ă: ["m", "n", "ng", "p", "t", "c"],
  â: ["m", "n", "ng", "p", "t", "c"],
  e: ["m", "n", "ng", "p", "t", "c"],
  ê: ["m", "n", "nh", "p", "t", "ch"],
  i: ["m", "n", "nh", "p", "t", "ch"],
  o: ["m", "n", "ng", "p", "t", "c"],
  oo: ["ng", "c"],
  ô: ["m", "n", "ng", "p", "t", "c"],
  ơ: ["m", "n", "p", "t"],
  u: ["m", "n", "ng", "p", "t", "c"],
  ư: ["m", "n", "ng", "p", "t", "c"],
  iê: ["m", "n", "ng", "p", "t", "c"],
  yê: ["m", "n", "ng", "p", "t", "c"],
  uô: ["m", "n", "ng", "p", "t", "c"],
  ươ: ["m", "n", "ng", "p", "t", "c"],
  oa: ["m", "n", "ng", "nh", "p", "t", "c", "ch"],
  oă: ["m", "n", "ng", "p", "t", "c"],
  oe: ["n", "t"],
  uâ: ["n", "ng", "t"],
  uê: ["nh", "ch"],
  uy: ["n", "nh", "t", "ch"],
  // After "qu" the u belongs to the onset: "quýt", "quỳnh".
  y: ["n", "nh", "t", "ch"],
  uyê: ["n", "t"],
};

const RIMES = new Set([
  ...OPEN_RIMES,
  ...Object.entries(CLOSED_RIMES).flatMap(([nucleus, codas]) =>
    codas.map((coda) => nucleus + coda),
  ),
]);

const TONE_MARKS = /[̣̀́̃̉]/g;
// Syllables closed by p, t, c or ch only take the sắc or nặng tone.
const STOP_TONES = new Set(["́", "̣"]);
const STOP_CODA = /(?:p|t|c|ch)$/;
// Vowels that select "k/gh/ngh" instead of "c/g/ng".
const FRONT_VOWEL = /^[ieêy]/;

function onsetFits(onset: string, rime: string): boolean {
  const front = FRONT_VOWEL.test(rime);
  switch (onset) {
    case "c":
    case "ng":
      return !front;
    case "k":
      return front;
    case "gh":
    case "ngh":
      return /^[ieê]/.test(rime);
    case "g":
      return !/^[eê]/.test(rime);
    case "qu":
      return !/^[uo]/.test(rime);
    default:
      return true;
  }
}

export function isVietnameseSyllable(word: string): boolean {
  const decomposed = nfc(word).toLocaleLowerCase("vi").normalize("NFD");
  const tones = decomposed.match(TONE_MARKS) ?? [];
  if (tones.length > 1) return false;
  const bare = decomposed.replace(TONE_MARKS, "").normalize("NFC");
  return ONSETS.some((onset) => {
    if (!bare.startsWith(onset)) return false;
    const rime = bare.slice(onset.length);
    if (!RIMES.has(rime) || !onsetFits(onset, rime)) return false;
    return !STOP_CODA.test(rime) || STOP_TONES.has(tones[0] ?? "");
  });
}

// A single Latin letter is a math variable ("n", "x"), not a word.
const VARIABLE = /^[a-z]$/i;

function allowedWords(input: LintInput): Set<string> {
  const listed = [
    ...ABBREVIATIONS,
    ...UNITS,
    ...(input.glossary?.names ?? []),
    ...(input.glossary?.terms.map((t) => t.term) ?? []),
  ];
  return new Set(
    listed.flatMap((entry) =>
      words(entry).map((w) => w.toLocaleLowerCase("vi")),
    ),
  );
}

export function lintVietnamese(
  input: LintInput,
  strings: LessonStrings,
): Finding[] {
  const { findings, report } = findingCollector(input.file, "vietnamese");
  const allowed = allowedWords(input);
  for (const { path, value } of strings.texts) {
    const foreign = words(value).filter(
      (word) =>
        !VARIABLE.test(word) &&
        !allowed.has(word.toLocaleLowerCase("vi")) &&
        !isVietnameseSyllable(word),
    );
    if (foreign.length > 0) {
      report(
        path,
        `Not Vietnamese: ${[...new Set(foreign)].map((w) => `"${w}"`).join(", ")}; reword, or list proper names in the subject glossary`,
      );
    }
  }
  return findings;
}
