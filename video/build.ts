import { mkdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { LocalIdSchema } from "@/schema/content";
import {
  MATCH_THRESHOLD,
  MAX_MB_PER_MINUTE,
  MEDIA_DIR,
  PROJECTS_DIR,
} from "./config";
import { alignWords } from "./lib/align";
import { layNarration, probeDuration } from "./lib/audio";
import { buildSite } from "./lib/compose";
import { writeManifest } from "./lib/manifest";
import { narrate } from "./lib/narrate";
import { encodeVideo, extractPoster, renderSite } from "./lib/render";
import { readScript } from "./lib/script";
import {
  buildClips,
  buildVtt,
  compositionTiming,
  schedule,
} from "./lib/timeline";
import { checkVerbatim } from "./lib/verbatim";
import { ttsEngine } from "./tts";

// Usage: pnpm video:build <lessonId> <name>
// Builds video/projects/<lessonId>/<name>/ into
// public/media/video/<lessonId>/<name>.{mp4,vtt,jpg} and records it in the
// lesson's `videos` as "<lessonId>.video.<name>". Intermediate audio and the
// render folder stay in the project's audio/ and renders/ (gitignored);
// unchanged sentences are not synthesized again.

async function main() {
  const [lessonId, name] = process.argv.slice(2);
  if (!lessonId || !name || !LocalIdSchema.safeParse(name).success) {
    console.error("Usage: pnpm video:build <lessonId> <name>");
    process.exit(2);
  }
  const projectDir = path.join(PROJECTS_DIR, lessonId, name);
  const script = readScript(path.join(projectDir, "script.json"));
  const verbatim = checkVerbatim(script, lessonId);
  if (verbatim.length > 0) {
    throw new Error(
      `script.json must quote the lesson word for word:\n${verbatim.join("\n")}`,
    );
  }
  const engine = ttsEngine(script.engine);
  const renders = path.join(projectDir, "renders");
  mkdirSync(renders, { recursive: true });

  const takes = await narrate(script, engine, path.join(projectDir, "audio"));
  const words = takes.map((t) =>
    alignWords(t.text, t.spoken, t.words, t.duration),
  );
  const timeline = schedule(takes, words);

  const narration = path.join(renders, "narration.wav");
  layNarration(narration, timeline.sentences, timeline.duration);
  const site = await buildSite(
    projectDir,
    path.join(renders, "site"),
    compositionTiming(timeline),
  );
  const master = path.join(renders, "master.mp4");
  renderSite(site, master);

  const outDir = path.join(MEDIA_DIR, "video", lessonId);
  mkdirSync(outDir, { recursive: true });
  const mp4 = path.join(outDir, `${name}.mp4`);
  encodeVideo(master, narration, mp4, timeline.duration);
  const posterScene = timeline.scenes.get(script.poster.scene);
  if (!posterScene) throw new Error(`No scene ${script.poster.scene}`);
  extractPoster(
    mp4,
    posterScene.start +
      (posterScene.end - posterScene.start) * script.poster.at,
    path.join(outDir, `${name}.jpg`),
  );
  writeFileSync(path.join(outDir, `${name}.vtt`), buildVtt(timeline));

  const duration = Math.round(probeDuration(mp4) * 100) / 100;
  const megabytes = statSync(mp4).size / 1_000_000;
  const perMinute = megabytes / (duration / 60);
  if (perMinute > MAX_MB_PER_MINUTE) {
    throw new Error(
      `${mp4} is ${perMinute.toFixed(1)} MB/min (max ${MAX_MB_PER_MINUTE})`,
    );
  }

  const media = `video/${lessonId}/${name}`;
  const file = writeManifest(lessonId, {
    id: `${lessonId}.video.${name}`,
    lessonId,
    url: `${media}.mp4`,
    vttUrl: `${media}.vtt`,
    posterUrl: `${media}.jpg`,
    durationSec: duration,
    clips: buildClips(script, timeline),
    voice: engine.voice(script.voice),
  });

  const report = {
    video: `${lessonId}.video.${name}`,
    durationSec: duration,
    megabytes: Math.round(megabytes * 100) / 100,
    sentences: takes.map((t) => ({
      text: t.text,
      heard: t.transcript,
      match: Math.round(t.matchRate * 1000) / 1000,
      attempts: t.attempts,
    })),
  };
  writeFileSync(
    path.join(renders, "report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  const low = takes.filter((t) => t.matchRate < MATCH_THRESHOLD);
  console.log(
    `video: ${path.relative(process.cwd(), mp4)} ${duration}s ${report.megabytes} MB; ${file} updated`,
  );
  for (const t of low) {
    console.warn(
      `video: listen to this sentence (match ${(t.matchRate * 100).toFixed(1)}%): "${t.text}" heard "${t.transcript}"`,
    );
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
