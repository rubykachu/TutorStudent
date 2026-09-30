import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { DEFAULT_CONTENT_ROOT, readContentRoot } from "@/content/load";
import { overviewParts, overviewWordCount } from "@/content/overview";
import { parseKaraokeVtt } from "@/lib/karaoke-vtt";
import { LessonSchema } from "@/schema/content";
import { MATCH_THRESHOLD, MEDIA_DIR, RENDER, VIDEO_DIR } from "./config";
import { alignWords } from "./lib/align";
import { ffmpeg, layNarration } from "./lib/audio";
import { writeNarration } from "./lib/manifest";
import { narrate } from "./lib/narrate";
import { narrationPaths, narrationScript } from "./lib/narration";
import { buildVtt, schedule } from "./lib/timeline";
import { ttsEngine } from "./tts";

// Usage: pnpm narration:build <lessonId>
// Reads the lesson's overview aloud with the video pipeline's voice (each
// sentence synthesized, slowed, and checked against the text by Whisper),
// writes public/media/narration/<lessonId>/overview.{m4a,vtt} with one
// caption timestamp per word, and records both on `overview.narration`.
// Unchanged sentences are not synthesized again (cache in video/.cache/).

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

  const script = narrationScript(lesson.title, lesson.overview);
  const engine = ttsEngine(script.engine);
  const workDir = path.join(VIDEO_DIR, ".cache", "narration", lessonId);
  const takes = await narrate(script, engine, path.join(workDir, "audio"));
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
  const lessonFile = writeNarration(lessonId, paths);

  console.log(
    `narration: ${path.relative(process.cwd(), audioFile)} ${timeline.duration}s; ${lessonFile} updated`,
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
