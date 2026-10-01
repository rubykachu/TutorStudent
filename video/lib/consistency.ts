import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseKaraokeVtt } from "@/lib/karaoke-vtt";
import type { LessonOverview } from "@/schema/content";
import { MEDIA_DIR, PAUSE, PROJECTS_DIR } from "../config";
import { voiceSpec } from "../voices";
import { type LessonMedia, readLessonMedia } from "./lesson-media";
import { narrationPaths, narrationScript } from "./narration";
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
// 3. Opening line: the first sentence of a video greets the child and says
//    what the video is about, and the captions start after the lead-in.
// 4. Voice: the lesson declares one voice (media.json); the videos recorded
//    in lesson.json used that voice and the script names the same engine.
// 5. Narration opening: the overview narration starts with a greeting to the
//    child and its captions start after the lead-in (lessons narrated before
//    the rule are exempt in media.json).

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

// The opening line is flagged `opening` (not recognised by its wording, so
// the script says what it is) on the first sentence of the first scene and
// nowhere else; it is a greeting to the child, so it says "bạn", and it is
// not a rule or a quote. A video listed in `openingExempt` of the lesson's
// media.json predates the rule and must not carry the flag.
export function openingIssues(
  script: VideoScript,
  exempt = false,
  subject: "video" | "narration" = "video",
): string[] {
  const issues: string[] = [];
  const first = script.scenes[0]?.sentences[0];
  script.scenes.forEach((scene, i) => {
    scene.sentences.forEach((sentence, j) => {
      if (sentence.opening && (i > 0 || j > 0)) {
        issues.push(
          `${scene.id}: only the first sentence of the ${subject} may be flagged "opening"`,
        );
      }
    });
  });
  if (exempt) {
    if (first?.opening) {
      issues.push(
        `the ${subject} has an opening sentence: remove it from "openingExempt" in media.json`,
      );
    }
    return issues;
  }
  if (!first?.opening) {
    issues.push(
      `the first sentence must be the opening line: a greeting that says what the ${subject} is about, flagged "opening": true`,
    );
  } else {
    if (!captionTokens(first.text).includes("bạn")) {
      issues.push(
        `the opening line must address the child as "bạn": "${first.text}"`,
      );
    }
    if (first.rule || first.quote) {
      issues.push("the opening line must not be a rule or a quote");
    }
  }
  return issues;
}

// The overview narration reads the overview text as written, so its opening
// line is the overview's first sentence: it must greet the child as "bạn"
// (`narrationScript` flags it `opening`). A lesson whose media.json sets
// `narrationOpeningExempt` was narrated before the rule and is left as it is.
export function narrationOpeningIssues(
  lessonTitle: string,
  overview: LessonOverview,
  exempt = false,
): string[] {
  if (exempt) return [];
  return openingIssues(
    narrationScript(lessonTitle, overview, "local"),
    false,
    "narration",
  );
}

// The first caption starts after the lead-in silence, so the child does not
// miss the first words.
export function leadInIssues(vtt: string): string[] {
  const first = parseKaraokeVtt(vtt)[0];
  if (first && first.start < PAUSE.leadIn - 0.01) {
    return [
      `the first caption starts at ${first.start.toFixed(2)} s, before the ${PAUSE.leadIn} s lead-in`,
    ];
  }
  return [];
}

// One voice per lesson: media.json names a known voice, every video built
// for the lesson recorded that voice, and every listed exemption is a video
// of the lesson.
export function voiceIssues(
  media: LessonMedia,
  videos: readonly {
    id: string;
    voice: { engine: string; voiceName: string };
  }[],
  projects: readonly string[],
): string[] {
  const spec = voiceSpec(media.voice).video;
  const issues: string[] = [];
  for (const video of videos) {
    if (
      video.voice.voiceName !== spec.preset ||
      video.voice.engine !== spec.engine
    ) {
      issues.push(
        `video ${video.id} was read by "${video.voice.voiceName}", the lesson's voice is "${spec.preset}"`,
      );
    }
  }
  for (const name of media.openingExempt ?? []) {
    if (!projects.includes(name)) {
      issues.push(
        `openingExempt lists "${name}", which is not a video project`,
      );
    }
  }
  return issues;
}

// One voice per narration: the voice recorded on a lesson's overview narration
// is the lesson's narration voice, or its video voice when the narration was
// read whole by that voice because Gemini's quota ran out. A narration with no
// recorded voice predates the record.
export function narrationVoiceIssues(
  media: LessonMedia,
  narration: { voice?: { engine: string; voiceName: string } } | undefined,
): string[] {
  const recorded = narration?.voice;
  if (!recorded) return [];
  const spec = voiceSpec(media.voice);
  const allowed = [spec.narration, spec.video];
  if (
    allowed.some(
      (v) => v.engine === recorded.engine && v.preset === recorded.voiceName,
    )
  ) {
    return [];
  }
  return [
    `the overview narration was read by "${recorded.voiceName}" (${recorded.engine}); the lesson's voices are ${allowed.map((v) => `"${v.preset}" (${v.engine})`).join(" and ")}`,
  ];
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
  const script = readScript(path.join(dir, "script.json"));
  const media = readMedia(lessonId, result.issues);
  if (media) {
    result.issues.push(
      ...openingIssues(script, media.openingExempt?.includes(name)),
    );
    const spec = voiceSpec(media.voice).video;
    if (script.engine !== spec.engine) {
      result.issues.push(
        `script.json engine "${script.engine}" is not the lesson's voice engine "${spec.engine}"`,
      );
    }
  }
  result.ruleTextCount = ruleTextsOnScreen(html).length;
  result.issues.push(...onScreenIssues(html, lesson.data));
  if (captions) {
    const vtt = vttFile(lessonId, name);
    if (existsSync(vtt)) {
      const text = readFileSync(vtt, "utf8");
      result.issues.push(...captionIssues(script, text), ...leadInIssues(text));
    } else {
      result.skipped = "no built captions";
    }
  }
  return result;
}

function readMedia(
  lessonId: string,
  issues: string[],
): LessonMedia | undefined {
  try {
    return readLessonMedia(lessonId);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!issues.includes(message)) issues.push(message);
    return undefined;
  }
}

// Checks of a lesson as a whole, not of one video: its voice declaration
// against the videos recorded in lesson.json.
export function checkLessonVoice(lessonId: string): string[] {
  const lesson = findLesson(lessonId);
  const issues: string[] = [];
  const media = readMedia(lessonId, issues);
  if (!media) return issues;
  const projects = existsSync(path.join(PROJECTS_DIR, lessonId))
    ? readdirSync(path.join(PROJECTS_DIR, lessonId)).filter((f) =>
        existsSync(path.join(PROJECTS_DIR, lessonId, f, "script.json")),
      )
    : [];
  const videos = ((lesson?.data as { videos?: unknown } | undefined)?.videos ??
    []) as Parameters<typeof voiceIssues>[1];
  const narration = (
    lesson?.data as
      | {
          overview?: { narration?: Parameters<typeof narrationVoiceIssues>[1] };
        }
      | undefined
  )?.overview?.narration;
  return [
    ...issues,
    ...voiceIssues(media, videos, projects),
    ...narrationVoiceIssues(media, narration),
  ];
}

// Checks of a lesson's overview narration, only once the lesson has one: the
// overview opens with a greeting to the child, and the built captions start
// after the lead-in. Lessons not yet narrated pass; the rule applies when the
// narration is written.
export function checkLessonNarration(lessonId: string): string[] {
  const data = findLesson(lessonId)?.data as
    | { title: string; overview?: LessonOverview }
    | undefined;
  const overview = data?.overview;
  if (!data || !overview?.narration) return [];
  const issues: string[] = [];
  const media = readMedia(lessonId, issues);
  if (!media) return issues;
  if (media.narrationOpeningExempt) return [];
  issues.push(...narrationOpeningIssues(data.title, overview));
  const vtt = path.join(MEDIA_DIR, narrationPaths(lessonId).vttUrl);
  if (existsSync(vtt)) issues.push(...leadInIssues(readFileSync(vtt, "utf8")));
  return issues;
}
