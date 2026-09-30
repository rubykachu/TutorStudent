import { normalizePassage } from "@/content/lint/passage";
import { sentences } from "@/content/lint/text";
import { DEFAULT_CONTENT_ROOT, readContentRoot } from "@/content/load";
import type { VideoScript } from "./script";

// Sentences a video must say word for word. A sentence marked `rule` states a
// rule or definition, so it must equal a note or caption of the lesson (or
// one sentence of one); a sentence marked `quote` cites the reading passage,
// so its quoted part (or the whole sentence, with no quotation marks) must be
// in the lesson's source-passage.txt. `pnpm video:build` stops otherwise.

const SUPERSCRIPT: Record<string, string> = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
  ⁿ: "n",
  ᵐ: "m",
};
const SUPERSCRIPT_RUN = new RegExp(
  `[${Object.keys(SUPERSCRIPT).join("")}]+`,
  "g",
);

// A rule as it is read aloud and captioned, the only differences a script
// may have from the lesson: "aⁿ" is "a mũ n", a bracket becomes a comma, and
// a lone letter may be said "số a" (TTS and Whisper drop a bare letter).
export function spokenForm(text: string): string {
  return normalizePassage(text)
    .replace(
      SUPERSCRIPT_RUN,
      (run) => ` mũ ${[...run].map((c) => SUPERSCRIPT[c]).join("")}`,
    )
    .replace(/\s*\(([^)]*)\)/g, ", $1")
    .replace(/(^|\s)số ([a-z])(?=$|[\s.,:;!?])/g, "$1$2")
    .replace(/\s+/g, " ")
    .trim();
}

function collectRuleTexts(value: unknown, out: string[]): void {
  if (Array.isArray(value)) {
    for (const child of value) collectRuleTexts(child, out);
    return;
  }
  if (value === null || typeof value !== "object") return;
  const block = value as Record<string, unknown>;
  if (block.type === "note" && typeof block.text === "string") {
    out.push(block.text);
  }
  if (typeof block.caption === "string") out.push(block.caption);
  for (const child of Object.values(block)) collectRuleTexts(child, out);
}

// Every note and caption of the lesson's sections and cards, whole and split
// into sentences, as written.
export function ruleTexts(lesson: unknown): string[] {
  const { sections, cards } = (lesson ?? {}) as Record<string, unknown>;
  const texts: string[] = [];
  collectRuleTexts([sections, cards], texts);
  return texts.flatMap((t) => [t, ...sentences(t)]);
}

// The same, in spoken form.
export function ruleSentences(lesson: unknown): Set<string> {
  return new Set(ruleTexts(lesson).map((t) => spokenForm(t)));
}

const QUOTED = /“([^”]+)”|"([^"]+)"/g;

export function verbatimIssues(
  script: VideoScript,
  lesson: unknown,
  sourcePassage: string | undefined,
): string[] {
  const rules = ruleSentences(lesson);
  const passage = sourcePassage ? normalizePassage(sourcePassage) : undefined;
  const issues: string[] = [];
  for (const scene of script.scenes) {
    for (const { text, rule, quote } of scene.sentences) {
      if (rule && !rules.has(spokenForm(text))) {
        issues.push(
          `${scene.id}: rule "${text}" is not a note or caption of the lesson, word for word`,
        );
      }
      if (quote) {
        const parts = [...text.matchAll(QUOTED)].map((m) => m[1] ?? m[2]);
        for (const part of parts.length > 0 ? parts : [text]) {
          if (passage === undefined) {
            issues.push(
              `${scene.id}: quote "${part}" but the lesson has no source-passage.txt`,
            );
          } else if (!passage.includes(normalizePassage(part))) {
            issues.push(
              `${scene.id}: quote "${part}" is not in source-passage.txt, word for word`,
            );
          }
        }
      }
    }
  }
  return issues;
}

export function findLesson(lessonId: string) {
  const file = readContentRoot(DEFAULT_CONTENT_ROOT).lessons.find(
    (l) => (l.data as { id?: unknown } | undefined)?.id === lessonId,
  );
  return file?.data ? file : undefined;
}

// Checks a script against the lesson under content/.
export function checkVerbatim(script: VideoScript, lessonId: string): string[] {
  const file = findLesson(lessonId);
  if (!file) return [`No lesson "${lessonId}" under content/`];
  return verbatimIssues(script, file.data, file.sourcePassage);
}
