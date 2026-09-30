import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { DEFAULT_CONTENT_ROOT, readContentRoot } from "@/content/load";
import {
  type LessonOverview,
  LessonOverviewSchema,
  type Video,
  VideoSchema,
} from "@/schema/content";

type LessonJson = { videos?: Video[]; overview?: LessonOverview };

// Rewrites one lesson.json (found by lesson id, fixture included) through
// `change`, formatted the way biome keeps it. The lesson's review hash
// covers what the pipelines write, so the lesson needs a new review after.
function updateLesson(
  lessonId: string,
  change: (data: LessonJson) => void,
): string {
  const raw = readContentRoot(DEFAULT_CONTENT_ROOT);
  const file = raw.lessons.find(
    (l) => (l.data as { id?: unknown } | undefined)?.id === lessonId,
  );
  if (!file?.data) throw new Error(`No lesson "${lessonId}" under content/`);
  const data = file.data as LessonJson;
  change(data);
  const absolute = path.resolve(file.file);
  writeFileSync(absolute, `${JSON.stringify(data, null, 2)}\n`);
  spawnSync(path.join(process.cwd(), "node_modules", ".bin", "biome"), [
    "format",
    "--write",
    absolute,
  ]);
  return file.file;
}

// Adds or replaces the video's entry in the lesson's `videos`.
export function writeManifest(lessonId: string, video: Video): string {
  const entry = VideoSchema.parse(video);
  return updateLesson(lessonId, (data) => {
    const videos = data.videos ?? [];
    const at = videos.findIndex((v) => v.id === entry.id);
    data.videos =
      at === -1
        ? [...videos, entry]
        : videos.map((v, i) => (i === at ? entry : v));
  });
}

// Records the overview narration's files on the lesson's `overview`.
export function writeNarration(
  lessonId: string,
  narration: NonNullable<LessonOverview["narration"]>,
): string {
  return updateLesson(lessonId, (data) => {
    if (!data.overview) throw new Error(`Lesson "${lessonId}" has no overview`);
    data.overview = LessonOverviewSchema.parse({
      ...data.overview,
      narration,
    });
  });
}
