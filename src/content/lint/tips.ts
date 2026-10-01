import type { Lesson, Subject, Tip, TipsFile } from "@/schema/content";
import type { IssuePath } from "../check";
import { sectionTips } from "../tips";
import { MAX_TIP_SENTENCES, MAX_TIP_TITLE_WORDS } from "./config";
import { lintGlossaryText } from "./glossary";
import { lintLength } from "./length";
import { lintNfc } from "./nfc";
import { lintNumbers } from "./numbers";
import { computeTipsHash } from "./review-hash";
import { lintSymbols } from "./symbols";
import { sentences, words } from "./text";
import {
  type Finding,
  findingCollector,
  isVietnamese,
  type LintInput,
  type LintReporter,
} from "./types";
import { lintVietnamese } from "./vietnamese";
import { collectStrings } from "./walk";

// A tip is a short trick for one kind of problem: a label (`title`) and a few
// sentences. Whether the trick is right for every input is the reviewer's to
// test (lesson-review checklist); the lint holds the shape and the wording.

function lintTipShape(tip: Tip, path: IssuePath, report: LintReporter): void {
  const count = sentences(tip.text).length;
  if (count > MAX_TIP_SENTENCES) {
    report(
      [...path, "text"],
      `Tip has ${count} sentences (max ${MAX_TIP_SENTENCES}); keep the trick short and put the worked example in tex`,
    );
  }
  const titleWords = words(tip.title).length;
  if (titleWords > MAX_TIP_TITLE_WORDS) {
    report(
      [...path, "title"],
      `Tip title has ${titleWords} words (max ${MAX_TIP_TITLE_WORDS}); name the problem type, not the trick`,
    );
  }
}

// Shape of the `tip` blocks inside a lesson's sections. Their wording is
// already covered by the lesson's own text rules.
export function lintTipBlocks(input: LintInput): Finding[] {
  const { findings, report } = findingCollector(input.file, "tips");
  input.lesson.sections.forEach((section, i) => {
    section.blocks.forEach((block, j) => {
      if (block.type === "tip") {
        lintTipShape(block, ["sections", i, "blocks", j], report);
      }
    });
  });
  return findings;
}

export type TipsLintInput = {
  // Path of tips.json, where the findings are reported.
  file: string;
  // The lesson the tips belong to: its concepts colour the formulas.
  lesson: Lesson;
  tips: TipsFile;
  fixture: boolean;
  subject?: Subject;
  glossary?: LintInput["glossary"];
};

// Everything the content lint checks in a tips file: the review gate (a
// published file carries the hash of the content that passed its review),
// the tip shape, and the wording rules every child-facing text meets.
export function lintTipsFile(input: TipsLintInput): Finding[] {
  const { findings, report } = findingCollector(input.file, "tips");
  const { tips } = input;
  const current = computeTipsHash(tips);
  if (tips.status === "published" && tips.reviewedHash === undefined) {
    report(
      ["status"],
      "Published tips file has no reviewedHash; run lesson-review on the tips",
    );
  } else if (tips.reviewedHash !== undefined && tips.reviewedHash !== current) {
    report(
      ["reviewedHash"],
      "Tips changed after their review; run lesson-review on the tips again",
      tips.status === "published" ? "error" : "warning",
    );
  }
  tips.tips.forEach((tip, i) => {
    lintTipShape(tip, ["tips", i], report);
  });

  const inline = new Set(sectionTips(input.lesson).map((t) => t.id));
  tips.tips.forEach((tip, i) => {
    if (inline.has(tip.id)) {
      report(
        ["tips", i, "id"],
        `Tip "${tip.id}" is also a tip block of the lesson`,
      );
    }
  });

  const lessonInput: LintInput = {
    file: input.file,
    lesson: input.lesson,
    fixture: input.fixture,
    subject: input.subject,
    glossary: input.glossary,
  };
  const strings = collectStrings(tips);
  const fields = findingCollector(input.file, "fields");
  for (const { path } of strings.unclassified) {
    fields.report(
      path,
      "String field unknown to the content lint; classify it in src/content/lint/walk.ts",
    );
  }
  return [
    ...findings,
    ...fields.findings,
    ...lintNfc(lessonInput, strings),
    ...lintSymbols(lessonInput, strings),
    ...lintGlossaryText(lessonInput, strings),
    ...(isVietnamese(lessonInput)
      ? [
          ...lintNumbers(lessonInput, strings),
          ...lintVietnamese(lessonInput, strings),
          ...lintLength(lessonInput, strings),
        ]
      : []),
  ];
}
