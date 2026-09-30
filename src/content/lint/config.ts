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

// A recap is read in a few seconds after a wrong answer or at a section's
// end: its caption (the sentence to remember) holds at most this many
// sentences, next to one labelled example.
export const MAX_RECAP_SENTENCES = 2;

// Exercises that train each card (openEnded steps included). Review sessions
// draw a different exercise each time a card comes back, so a card needs
// its practice exercise plus a few in the review bank.
export const MIN_EXERCISES_PER_CARD = 3;

// The overview a child sees before the first section: a literature story
// summary runs 3–5 short sentences (other subjects need fewer), and the
// lesson's value is said in one sentence.
export const MAX_OVERVIEW_SUMMARY_SENTENCES = 5;
export const MAX_OVERVIEW_WHY_SENTENCES = 1;

// A recap sentence sharing at least this share of words with a rule sentence
// (Dice coefficient over distinct lower-case words) restates that rule, and
// must then repeat it word for word.
export const RULE_REWORD_MIN_SIMILARITY = 0.6;

// Textbook copying: a lesson text of at least this many words is reported
// when this share of its word 5-grams also occurs in the textbook text layer.
export const COPY_NGRAM = 5;
export const COPY_MIN_WORDS = 8;
export const COPY_MAX_SHARE = 0.5;
