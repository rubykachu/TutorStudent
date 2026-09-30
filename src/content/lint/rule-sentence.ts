import type { Lesson, NoteBlock } from "@/schema/content";
import type { IssuePath } from "../check";
import { indexLesson } from "../index";
import { RULE_REWORD_MIN_SIMILARITY } from "./config";
import { findWordRun, nfc, sentences, wordKeys } from "./text";
import {
  type Finding,
  findingCollector,
  type LintInput,
  learned,
} from "./types";

// A rule is learnt in one wording. Notes marked `rule: true` hold a section's
// rule; the section recap must repeat one of its sentences word for word, and
// any recap sentence of the section or its cards that restates a rule
// sentence (most words shared) must be that sentence, or one clause of it,
// word for word.

const SEE = learned("LL-05");

function normalise(sentence: string): string {
  return nfc(sentence).replace(/\s+/g, " ").trim();
}

// Dice coefficient of the distinct lower-case words of two sentences.
export function wordSimilarity(a: string, b: string): number {
  const left = new Set(wordKeys(a));
  const right = new Set(wordKeys(b));
  if (left.size + right.size === 0) return 0;
  const shared = [...left].filter((w) => right.has(w)).length;
  return (2 * shared) / (left.size + right.size);
}

function ruleNotes(lesson: Lesson, section: number): NoteBlock[] {
  return (lesson.sections[section]?.blocks ?? []).flatMap((block) => {
    if (block.type === "note") return block.rule ? [block] : [];
    if (block.type === "group") {
      return block.children.filter(
        (c): c is NoteBlock => c.type === "note" && c.rule === true,
      );
    }
    return [];
  });
}

type Recap = { path: IssuePath; caption: string };

// The section's recap, then the recaps of the cards its exercises train.
function recapsOf(lesson: Lesson, section: number): Recap[] {
  const s = lesson.sections[section];
  if (!s) return [];
  const index = indexLesson(lesson);
  const cards = new Set(
    [...s.checkIds, ...s.practiceIds].flatMap(
      (id) => index.exerciseById.get(id)?.exercise.cardIds ?? [],
    ),
  );
  const recaps: Recap[] = [];
  if (s.recap.type === "visual" && s.recap.caption) {
    recaps.push({
      path: ["sections", section, "recap", "caption"],
      caption: s.recap.caption,
    });
  }
  lesson.cards.forEach((card, i) => {
    if (
      !cards.has(card.id) ||
      card.recap.type !== "visual" ||
      !card.recap.caption
    )
      return;
    recaps.push({
      path: ["cards", i, "recap", "caption"],
      caption: card.recap.caption,
    });
  });
  return recaps;
}

export function lintRuleSentence(input: LintInput): Finding[] {
  const { findings, report } = findingCollector(input.file, "rule-sentence");
  const { lesson } = input;
  const reported = new Set<string>();
  lesson.sections.forEach((section, i) => {
    const rules = ruleNotes(lesson, i).map((note) =>
      sentences(note.text).map(normalise),
    );
    if (rules.length === 0) return;
    const all = rules.flat();
    const recaps = recapsOf(lesson, i);

    const sectionRecap = recaps.find((r) => r.path[0] === "sections");
    const recapSentences = new Set(
      sectionRecap ? sentences(sectionRecap.caption).map(normalise) : [],
    );
    for (const rule of rules) {
      if (rule.some((s) => recapSentences.has(s))) continue;
      report(
        ["sections", i, "recap"],
        `Section recap does not repeat the rule "${rule.join(" ")}" word for word${SEE}`,
      );
    }

    for (const recap of recaps) {
      for (const sentence of sentences(recap.caption).map(normalise)) {
        if (all.includes(sentence)) continue;
        // A card may take one clause of a rule word for word ("a² đọc là
        // “a bình phương”" from a rule about a² and a³).
        const words = wordKeys(sentence);
        if (all.some((rule) => findWordRun(wordKeys(rule), words) >= 0))
          continue;
        let best = { rule: "", score: 0 };
        for (const rule of all) {
          const score = wordSimilarity(sentence, rule);
          if (score > best.score) best = { rule, score };
        }
        if (best.score < RULE_REWORD_MIN_SIMILARITY) continue;
        const key = `${recap.path.join(".")} ${sentence}`;
        if (reported.has(key)) continue;
        reported.add(key);
        report(
          recap.path,
          `"${sentence}" restates the rule of ${section.id} in other words; use the rule sentence "${best.rule}"${SEE}`,
        );
      }
    }
  });
  return findings;
}
