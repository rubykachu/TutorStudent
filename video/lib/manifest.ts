import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { DEFAULT_CONTENT_ROOT, readContentRoot } from "@/content/load";
import { type Video, VideoSchema } from "@/schema/content";

// Adds or replaces the video's entry in the lesson's `videos`. The lesson's
// review hash covers it, so the lesson needs a new review afterwards.
export function writeManifest(lessonId: string, video: Video): string {
  const raw = readContentRoot(DEFAULT_CONTENT_ROOT);
  const file = raw.lessons.find(
    (l) => (l.data as { id?: unknown } | undefined)?.id === lessonId,
  );
  if (!file?.data) throw new Error(`No lesson "${lessonId}" under content/`);
  const data = file.data as { videos?: Video[] };
  const entry = VideoSchema.parse(video);
  const videos = data.videos ?? [];
  const at = videos.findIndex((v) => v.id === entry.id);
  data.videos =
    at === -1
      ? [...videos, entry]
      : videos.map((v, i) => (i === at ? entry : v));
  const absolute = path.resolve(file.file);
  writeFileSync(absolute, `${JSON.stringify(data, null, 2)}\n`);
  spawnSync(path.join(process.cwd(), "node_modules", ".bin", "biome"), [
    "format",
    "--write",
    absolute,
  ]);
  return file.file;
}
