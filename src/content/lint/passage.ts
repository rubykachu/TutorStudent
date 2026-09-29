import type { PassageBlock, SectionBlock } from "@/schema/content";
import type { IssuePath } from "../check";
import { flattenExercises } from "../index";
import { VERBATIM_PASSAGE_SUBJECTS } from "./config";
import { nfc } from "./text";
import { type Finding, findingCollector, type LintInput } from "./types";

// Reading passages must be the source text word for word. Each passage block,
// including excerpts repeated in exercise prompts, has to appear in
// `source-passage.txt` (checked once by an admin against the page photos).

export const SOURCE_PASSAGE_FILE = "source-passage.txt";

// Removes differences that are typography, not wording.
export function normalizePassage(text: string): string {
  return nfc(text)
    .replace(/[“”„«»″]/g, '"')
    .replace(/[‘’‚′]/g, "'")
    .replace(/[‐‑‒–—―]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function passageText(block: PassageBlock): string {
  return block.paragraphs
    .flatMap((paragraph) => paragraph.sentences.map((s) => s.text))
    .join(" ");
}

function passageBlocks(
  input: LintInput,
): { block: PassageBlock; path: IssuePath }[] {
  const found: { block: PassageBlock; path: IssuePath }[] = [];
  // A group never holds a passage, so only top-level blocks are looked at.
  const collect = (blocks: readonly SectionBlock[], base: IssuePath) => {
    blocks.forEach((block, i) => {
      if (block.type === "passage") found.push({ block, path: [...base, i] });
    });
  };
  input.lesson.sections.forEach((section, i) => {
    collect(section.blocks, ["sections", i, "blocks"]);
  });
  for (const { exercise, path } of flattenExercises(input.lesson)) {
    collect(exercise.prompt, [...path, "prompt"]);
  }
  return found;
}

export function lintPassage(input: LintInput): Finding[] {
  const { findings, report } = findingCollector(input.file, "passage");
  const required = (VERBATIM_PASSAGE_SUBJECTS as readonly string[]).includes(
    input.lesson.subject,
  );
  const passages = passageBlocks(input);
  if (passages.length === 0) return findings;
  if (input.sourcePassage === undefined) {
    if (required) {
      report(
        passages[0]?.path ?? [],
        `Passages need ${SOURCE_PASSAGE_FILE} next to lesson.json`,
      );
    }
    return findings;
  }
  const source = normalizePassage(input.sourcePassage);
  for (const { block, path } of passages) {
    if (!source.includes(normalizePassage(passageText(block)))) {
      report(path, `Passage differs from ${SOURCE_PASSAGE_FILE}`);
    }
  }
  return findings;
}
