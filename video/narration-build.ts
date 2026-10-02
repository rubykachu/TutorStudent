import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { DEFAULT_CONTENT_ROOT, readContentRoot } from "@/content/load";
import { overviewParts, overviewWordCount } from "@/content/overview";
import { parseKaraokeVtt } from "@/lib/karaoke-vtt";
import { type LessonOverview, LessonSchema } from "@/schema/content";
import { MATCH_THRESHOLD, MEDIA_DIR, RENDER, VIDEO_DIR } from "./config";
import { alignWords } from "./lib/align";
import { ffmpeg, layNarration } from "./lib/audio";
import { checkLessonSpelling, narrationOpeningIssues } from "./lib/consistency";
import { lessonVoice, readLessonMedia } from "./lib/lesson-media";
import { writeNarration } from "./lib/manifest";
import { narrate } from "./lib/narrate";
import {
  narrationPaths,
  narrationScript,
  readWithFallback,
} from "./lib/narration";
import { buildVtt, schedule } from "./lib/timeline";
import { ttsEngine } from "./tts";
import type { EngineVoice } from "./voices";

// Usage: pnpm narration:build <lessonId>
// Reads the lesson's overview aloud with the lesson's narration voice
// (video/voices.ts, picked by video/projects/<lessonId>/media.json): Gemini,
// the whole text in one request cut into sentences, each sentence checked
// against the text by Whisper. Writes
// public/media/narration/<lessonId>/overview.{m4a,vtt} with one caption
// timestamp per word and records both, with the voice that read them, on
// `overview.narration`. Unchanged sentences are not synthesized again (cache
// in video/.cache/).
// The first sentence of the overview is the opening line and must greet the
// child as "bạn"; the build stops before synthesis otherwise (lessons narrated
// before the rule are exempt in media.json). The captions start after the
// lead-in silence (PAUSE.leadIn), like a video's.
// A narration is read by one voice from start to end: when every Gemini key
// is out of quota the whole narration is read again by the lesson's video
// voice (local VieNeu), and a warning says so; the sentences Gemini had
// finished are not used in it.

const AUDIO_BITRATE = "64k";

async function main() {
  const [lessonId] = process.argv.slice(2);
  if (!lessonId) {
    console.error("Usage: pnpm narration:build <lessonId>");
    process.exit(2);
  }
  const file = readContentRoot(DEFAULT_CONTENT_ROOT).lessons.find(
    (l) => (l.data as { id?: unknown } | undefined)?.id === lessonId,
  );
  if (!file) throw new Error(`No lesson "${lessonId}" under content/`);
  const lesson = LessonSchema.parse(file.data);
  if (!lesson.overview) throw new Error(`Lesson "${lessonId}" has no overview`);

  const opening = narrationOpeningIssues(
    lesson.title,
    lesson.overview,
    readLessonMedia(lessonId).narrationOpeningExempt,
  );
  if (opening.length > 0) {
    throw new Error(
      `the overview must open with a greeting to the child (first sentence of overview.hook); nothing synthesized:\n${opening.join("\n")}`,
    );
  }
  for (const warning of checkLessonSpelling(lessonId)) {
    console.warn(`narration: ${warning}`);
  }
  const spec = lessonVoice(lessonId).spec;
  const workDir = path.join(VIDEO_DIR, ".cache", "narration", lessonId);
  const readWith = (voice: EngineVoice) =>
    narrate(
      narrationScript(
        lesson.title,
        lesson.overview as LessonOverview,
        voice.engine,
      ),
      ttsEngine(voice.engine),
      voice.preset,
      path.join(workDir, "audio"),
    );
  const { voice, result: takes } = await readWithFallback(spec, readWith);
  const words = takes.map((t) =>
    alignWords(t.text, t.spoken, t.words, t.duration),
  );
  const timeline = schedule(takes, words);

  const wav = path.join(workDir, "narration.wav");
  layNarration(wav, timeline.sentences, timeline.duration);
  const paths = narrationPaths(lessonId);
  const audioFile = path.join(MEDIA_DIR, paths.audioUrl);
  mkdirSync(path.dirname(audioFile), { recursive: true });
  ffmpeg([
    "-i",
    wav,
    "-af",
    RENDER.loudness,
    "-ac",
    "1",
    "-c:a",
    "aac",
    "-b:a",
    AUDIO_BITRATE,
    "-movflags",
    "+faststart",
    audioFile,
  ]);
  const vtt = buildVtt(timeline);
  // The screen highlights word n of the overview when caption word n is
  // said, so both must count the same words.
  const expected = overviewWordCount(overviewParts(lesson.overview));
  const captioned = parseKaraokeVtt(vtt).length;
  if (captioned !== expected) {
    throw new Error(
      `Captions have ${captioned} words, the overview ${expected}; nothing written`,
    );
  }
  writeFileSync(path.join(MEDIA_DIR, paths.vttUrl), vtt);
  const lessonFile = writeNarration(lessonId, {
    ...paths,
    voice: ttsEngine(voice.engine).voice(voice.preset),
  });

  console.log(
    `narration: ${path.relative(process.cwd(), audioFile)} ${timeline.duration}s read by ${voice.preset} (${voice.engine}); ${lessonFile} updated`,
  );
  for (const t of takes) {
    const rate = `${(t.matchRate * 100).toFixed(1)}%`;
    const line = `narration: ${rate} "${t.text}"`;
    if (t.matchRate < MATCH_THRESHOLD) {
      console.warn(`${line} heard "${t.transcript}" — listen to it`);
    } else {
      console.log(line);
    }
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
