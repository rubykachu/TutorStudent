import type { IssuePath } from "../check";

// Finds the strings of a lesson by field name. Every string field must be
// classified here: an unknown one is reported, so a field added to the schema
// cannot silently escape the text rules.

// Child-facing words: every text rule applies.
const TEXT_KEYS = new Set([
  "text",
  "caption",
  "alt",
  "title",
  "name",
  "starter",
  "rubric",
  "bank",
  "accept",
  "sourceRef",
  "summary",
  "goals",
  "whyItMatters",
]);

// Machine values: ids, references, enums, URLs, TeX and expressions.
const NON_TEXT_KEYS = new Set([
  "id",
  "subject",
  "series",
  "status",
  "reviewedHash",
  "type",
  "kind",
  "target",
  "color",
  "visualId",
  "hintVisualId",
  "solutionVisualId",
  "conceptId",
  "conceptIds",
  "cardIds",
  "checkIds",
  "practiceIds",
  "answer",
  "left",
  "right",
  "sentenceId",
  "videoId",
  "clipId",
  "lessonId",
  "url",
  "vttUrl",
  "posterUrl",
  "audioUrl",
  "validatorId",
  "src",
  "tex",
  "expr",
  "relation",
  "guide",
  "engine",
  "voiceName",
  "model",
]);

export type StringEntry = { path: IssuePath; value: string };

export type LessonStrings = {
  texts: StringEntry[];
  formulas: StringEntry[];
  exprs: StringEntry[];
  notes: StringEntry[];
  // Strings whose field is neither text nor a known machine value.
  unclassified: StringEntry[];
  // Every string outside passages, for encoding checks.
  all: StringEntry[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// Passages are verbatim source texts, exempt from every wording rule; they are
// compared against `source-passage.txt` instead.
export function collectStrings(lesson: unknown): LessonStrings {
  const out: LessonStrings = {
    texts: [],
    formulas: [],
    exprs: [],
    notes: [],
    unclassified: [],
    all: [],
  };

  const visitString = (key: string, value: string, path: IssuePath) => {
    const entry = { path, value };
    out.all.push(entry);
    if (TEXT_KEYS.has(key)) out.texts.push(entry);
    else if (key === "tex") out.formulas.push(entry);
    else if (key === "expr") out.exprs.push(entry);
    else if (!NON_TEXT_KEYS.has(key)) out.unclassified.push(entry);
  };

  const visit = (value: unknown, key: string, path: IssuePath): void => {
    if (typeof value === "string") {
      visitString(key, value, path);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        visit(item, key, [...path, i]);
      });
      return;
    }
    if (!isRecord(value) || value.type === "passage") return;
    if (value.type === "note" && typeof value.text === "string") {
      out.notes.push({ path: [...path, "text"], value: value.text });
    }
    for (const [childKey, child] of Object.entries(value)) {
      visit(child, childKey, [...path, childKey]);
    }
  };

  visit(lesson, "", []);
  return out;
}
