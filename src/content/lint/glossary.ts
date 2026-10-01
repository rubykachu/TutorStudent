import { conceptColorsInTex, isConceptColor } from "@/lib/tex";
import {
  type GlossaryFile,
  type GlossaryTerm,
  PREREQUISITE_LEVELS,
} from "@/schema/content";
import type { IssuePath } from "../check";
import { trainedCards } from "./practice";
import { findWordRun, wordKeys } from "./text";
import {
  type Finding,
  findingCollector,
  type LintInput,
  type LintReporter,
} from "./types";
import type { LessonStrings } from "./walk";

// One concept, one word, one colour: rejects non-standard synonyms listed in
// the subject glossary, keeps concept colours identical across lessons, lets
// a formula paint a symbol only in the colour of one of the lesson's
// concepts, and limits earlier-stage knowledge to prerequisite terms.

// The word and formula-colour rules, which hold for any child-facing text
// of a lesson: its own strings and those of its tips file.
export function lintGlossaryText(
  input: LintInput,
  strings: LessonStrings,
): Finding[] {
  const { findings, report } = findingCollector(input.file, "glossary");
  const terms = input.glossary?.terms ?? [];

  const forbidden = terms.flatMap((entry) =>
    entry.forbidden.map((word) => ({
      term: entry.term,
      word,
      keys: wordKeys(word),
    })),
  );
  for (const { path, value } of strings.texts) {
    const keys = wordKeys(value);
    for (const entry of forbidden) {
      if (findWordRun(keys, entry.keys) >= 0) {
        report(path, `Use "${entry.term}" instead of "${entry.word}"`);
      }
    }
  }

  const lessonColors = new Set(input.lesson.concepts.map((c) => c.color));
  for (const { path, value } of strings.formulas) {
    for (const color of conceptColorsInTex(value)) {
      if (!isConceptColor(color)) {
        report(path, `"\\concept{${color}}" is not a concept colour`);
      } else if (!lessonColors.has(color)) {
        report(path, `No concept of this lesson is ${color}`);
      }
    }
  }
  return findings;
}

export function lintGlossary(
  input: LintInput,
  strings: LessonStrings,
): Finding[] {
  const { findings, report } = findingCollector(input.file, "glossary");
  const terms = input.glossary?.terms ?? [];
  const byTerm = new Map(terms.map((t) => [wordKeys(t.term).join(" "), t]));
  input.lesson.concepts.forEach((concept, i) => {
    const entry = byTerm.get(wordKeys(concept.name).join(" "));
    if (entry?.color !== undefined && entry.color !== concept.color) {
      report(
        ["concepts", i, "color"],
        `Concept "${concept.name}" must be ${entry.color}, as in the glossary`,
      );
    }
  });

  lintPrerequisites(input, byTerm, report);
  return [...findings, ...lintGlossaryText(input, strings)];
}

// Marker in a section or card `sourceRef` for knowledge taught from an earlier
// school stage instead of an SGK page: "Kiến thức nền (tiểu học); câu 5 tr.26".
export const PREREQUISITE_MARKER = "Kiến thức nền";
const PREREQUISITE_REF = new RegExp(`${PREREQUISITE_MARKER}\\s*\\(([^)]*)\\)`);

// A `sourceRef` may claim earlier-stage knowledge only for a section or card
// covering a glossary term marked `prerequisite` with that stage, so the
// exception stays limited to terms the glossary vouches for.
function lintPrerequisites(
  input: LintInput,
  byTerm: Map<string, GlossaryTerm>,
  report: LintReporter,
): void {
  const { lesson } = input;
  const conceptLevel = new Map(
    lesson.concepts.map((c) => [
      c.id,
      byTerm.get(wordKeys(c.name).join(" "))?.prerequisite,
    ]),
  );
  const cardLevels = (cardIds: Iterable<string>) =>
    new Set(
      lesson.cards
        .filter((card) => [...cardIds].includes(card.id))
        .flatMap((card) => card.conceptIds.map((id) => conceptLevel.get(id))),
    );
  const check = (
    path: IssuePath,
    sourceRef: string,
    levels: Set<string | undefined>,
  ) => {
    if (!sourceRef.normalize("NFC").includes(PREREQUISITE_MARKER)) return;
    const level = PREREQUISITE_REF.exec(sourceRef.normalize("NFC"))?.[1];
    if (level === undefined) {
      report(
        path,
        `Write "${PREREQUISITE_MARKER} (<stage>)" with one of: ${PREREQUISITE_LEVELS.join(", ")}`,
      );
    } else if (!levels.has(level)) {
      report(
        path,
        `"${PREREQUISITE_MARKER} (${level})" needs a concept whose glossary term has prerequisite "${level}"`,
      );
    }
  };
  lesson.sections.forEach((section, i) => {
    const cardIds = [...section.checkIds, ...section.practiceIds].flatMap(
      (id) => [...trainedCards(lesson, id)],
    );
    check(["sections", i, "sourceRef"], section.sourceRef, cardLevels(cardIds));
  });
  lesson.cards.forEach((card, i) => {
    check(["cards", i, "sourceRef"], card.sourceRef, cardLevels([card.id]));
  });
}

// Consistency of a glossary file itself: a word cannot be both a term and a
// forbidden synonym, or no lesson could use it.
export function checkGlossaryFile(
  glossary: GlossaryFile,
): { path: IssuePath; message: string }[] {
  const problems: { path: IssuePath; message: string }[] = [];
  const termKeys = new Map<string, number>();
  glossary.terms.forEach((entry, i) => {
    const key = wordKeys(entry.term).join(" ");
    if (termKeys.has(key)) {
      problems.push({
        path: ["terms", i, "term"],
        message: `Duplicate term "${entry.term}"`,
      });
    }
    termKeys.set(key, i);
  });
  glossary.terms.forEach((entry, i) => {
    entry.forbidden.forEach((word, j) => {
      if (termKeys.has(wordKeys(word).join(" "))) {
        problems.push({
          path: ["terms", i, "forbidden", j],
          message: `"${word}" is itself a glossary term`,
        });
      }
    });
  });
  return problems;
}
