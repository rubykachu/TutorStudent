// Tunables of the content lint. Rules read them from here so a policy change
// never means hunting for literals inside rule code.

// Integers with at least this many digits need a thousands separator.
export const THOUSANDS_MIN_DIGITS = 4;

// A number right after one of these words is a year, page or exercise number,
// written without thousands separator or decimal comma ("năm 2024", "tr.22",
// "bài 1.25"). Matched case-insensitively.
export const NUMBER_EXEMPT_PREFIXES = ["năm", "tr.", "trang", "bài"] as const;

export const MAX_SENTENCE_SYLLABLES = 25;
export const MAX_NOTE_SENTENCES = 2;

// Abbreviations: a dot after them does not end a sentence, and they may appear
// in text although they are not Vietnamese syllables.
export const ABBREVIATIONS = ["tr", "SGK", "NXB", "TP", "THCS"] as const;

// Measurement units allowed in text next to numbers ("60 km/h").
export const UNITS = [
  "km",
  "hm",
  "dam",
  "dm",
  "cm",
  "mm",
  "kg",
  "hg",
  "dag",
  "mg",
  "ml",
] as const;

// Subjects whose `numeric` exercises must carry a `check.expr`.
export const CHECK_EXPR_SUBJECTS = ["math"] as const;

// Subjects whose passages are verbatim source texts: each lesson needs a
// `source-passage.txt` next to lesson.json to compare them against.
export const VERBATIM_PASSAGE_SUBJECTS = ["literature"] as const;
