import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseKaraokeVtt } from "@/lib/karaoke-vtt";
import { MEDIA_DIR, PROJECTS_DIR } from "../config";
import type { VideoScript } from "./script";
import { readScript } from "./script";
import { findLesson, ruleTexts, spokenForm } from "./verbatim";

// Zero-token consistency checks of a video, run after `pnpm video:build` and
// on their own by `pnpm video:check`; they only read files.
//
// 1. Captions: every sentence of script.json is in the video's WebVTT, in
//    order, and the WebVTT has no other text.
// 2. On-screen rules: every element of index.html marked `data-rule-text`
//    shows text that equals a note or caption sentence of the lesson, or a
//    reading the lesson gives for a notation ("2 ∈ A" for "Kí hiệu 2 ∈ A đọc
//    là 2 thuộc A", or both joined as "2 ∈ A đọc: 2 thuộc A").

// Words of a text as compared: NFC, typography and known symbol readings
// unified (spokenForm), lower case, no punctuation.
export function captionTokens(text: string): string[] {
  return spokenForm(text)
    .toLocaleLowerCase("vi")
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

function findSequence(
  haystack: readonly string[],
  needle: readonly string[],
  from: number,
): number {
  for (let i = from; i + needle.length <= haystack.length; i++) {
    if (needle.every((token, k) => haystack[i + k] === token)) return i;
  }
  return -1;
}

// Sentences of the script that are not in the captions, and caption text that
// is not in the script. Sentences are numbered from 1 across the whole script.
export function captionIssues(script: VideoScript, vtt: string): string[] {
  const captions = captionTokens(
    parseKaraokeVtt(vtt)
      .map((w) => w.text)
      .join(" "),
  );
  const issues: string[] = [];
  let at = 0;
  let index = 0;
  for (const scene of script.scenes) {
    for (const { text } of scene.sentences) {
      index++;
      const tokens = captionTokens(text);
      const found = findSequence(captions, tokens, at);
      if (found === -1) {
        issues.push(
          `sentence ${index} (${scene.id}) is missing from the captions: "${text}"`,
        );
        continue;
      }
      if (found > at) {
        issues.push(
          `extra caption text before sentence ${index} (${scene.id}): "${captions.slice(at, found).join(" ")}"`,
        );
      }
      at = found + tokens.length;
    }
  }
  if (at < captions.length) {
    issues.push(
      `extra caption text after the last sentence: "${captions.slice(at).join(" ")}"`,
    );
  }
  return issues;
}

const DONE_PUNCTUATION = /[\s.,;:!?]+$/u;
const PREFIX = /^[\s,;]*(?:(?:kí hiệu|dấu)\s+)?/iu;
const READING = /(.+?)\s+đọc là\s+([^,.;]+)/giu;
const SPOKEN_LABEL = /^(.+?)\s*[(—-]?\s*đọc:\s*(.+?)\)?$/iu;

function plain(text: string): string {
  return spokenForm(text).replace(DONE_PUNCTUATION, "");
}

// What a rule scene may show: a rule sentence, the notation of "X đọc là Y"
// or its reading Y.
function allowedOnScreen(lesson: unknown): Set<string> {
  const allowed = new Set<string>();
  for (const text of ruleTexts(lesson)) {
    allowed.add(plain(text));
    for (const [, notation, reading] of text.matchAll(READING)) {
      allowed.add(plain((notation ?? "").replace(PREFIX, "")));
      allowed.add(plain(reading ?? ""));
    }
  }
  return allowed;
}

const OPEN_TAG = /<([a-z][a-z0-9-]*)\b[^>]*\sdata-rule-text(?=[\s=>/])[^>]*>/gi;
const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

// Texts of the elements marked `data-rule-text` in a composition: everything
// between the element's tags, markup removed.
export function ruleTextsOnScreen(html: string): string[] {
  const texts: string[] = [];
  for (const open of html.matchAll(OPEN_TAG)) {
    const tag = (open[1] ?? "").toLowerCase();
    const tags = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
    tags.lastIndex = open.index + open[0].length;
    let depth = 1;
    let end = html.length;
    for (let m = tags.exec(html); m; m = tags.exec(html)) {
      depth += m[1] ? -1 : 1;
      if (depth === 0) {
        end = m.index;
        break;
      }
    }
    texts.push(
      html
        .slice(open.index + open[0].length, end)
        .replace(/<[^>]*>/g, "")
        .replace(/&(?:amp|lt|gt|quot|nbsp|#39);/g, (e) => ENTITIES[e] ?? e)
        .replace(/\s+/g, " ")
        .trim(),
    );
  }
  return texts;
}

export function onScreenIssues(html: string, lesson: unknown): string[] {
  const allowed = allowedOnScreen(lesson);
  const issues: string[] = [];
  for (const shown of ruleTextsOnScreen(html)) {
    const whole = plain(shown);
    if (allowed.has(whole)) continue;
    const labelled = whole.match(SPOKEN_LABEL);
    if (
      labelled &&
      [labelled[1], labelled[2]].every((p) => allowed.has(p ?? ""))
    ) {
      continue;
    }
    issues.push(
      `on-screen rule "${shown}" is not a note or caption sentence of the lesson, or a reading it gives`,
    );
  }
  return issues;
}

export type ProjectCheck = {
  lessonId: string;
  name: string;
  // Not checked (no build yet); never a failure.
  skipped?: string;
  ruleTextCount: number;
  issues: string[];
};

export function projectDir(lessonId: string, name: string): string {
  return path.join(PROJECTS_DIR, lessonId, name);
}

export function vttFile(lessonId: string, name: string): string {
  return path.join(MEDIA_DIR, "video", lessonId, `${name}.vtt`);
}

// Checks the composition of a project against its lesson (before any voice
// or render work), and the captions when the build has written them.
export function checkProject(
  lessonId: string,
  name: string,
  { captions }: { captions: boolean },
): ProjectCheck {
  const dir = projectDir(lessonId, name);
  const result: ProjectCheck = { lessonId, name, ruleTextCount: 0, issues: [] };
  const lesson = findLesson(lessonId);
  if (!lesson) {
    result.issues.push(`No lesson "${lessonId}" under content/`);
    return result;
  }
  const html = readFileSync(path.join(dir, "index.html"), "utf8");
  result.ruleTextCount = ruleTextsOnScreen(html).length;
  result.issues.push(...onScreenIssues(html, lesson.data));
  if (captions) {
    const vtt = vttFile(lessonId, name);
    if (existsSync(vtt)) {
      result.issues.push(
        ...captionIssues(
          readScript(path.join(dir, "script.json")),
          readFileSync(vtt, "utf8"),
        ),
      );
    } else {
      result.skipped = "no built captions";
    }
  }
  return result;
}
