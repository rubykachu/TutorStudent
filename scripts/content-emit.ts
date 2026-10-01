import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { lessonContentFile, lessonTipsFile } from "@/content";
import { buildContentIndex, loadContent } from "@/content/load";
import type { LessonTips } from "@/schema/content";

// Writes the static content the app fetches: /content/index.json and
// /content/<lessonId>.json (plus <lessonId>.tips.json for a lesson with tips). Only published lessons are written, plus the
// fixture when CONTENT_INCLUDE_FIXTURE=1 and real drafts when
// CONTENT_INCLUDE_DRAFT=1 outside a production build.
const OUT_DIR = path.join(process.cwd(), "public", "content");

const content = loadContent();

// Start clean so a lesson that was unpublished or removed disappears too.
rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

writeFileSync(
  path.join(OUT_DIR, "index.json"),
  JSON.stringify(buildContentIndex(content)),
);
for (const { lesson, tips } of content.lessons) {
  writeFileSync(
    path.join(OUT_DIR, lessonContentFile(lesson.id)),
    JSON.stringify(lesson),
  );
  if (tips.length > 0) {
    const page: LessonTips = { lessonId: lesson.id, tips };
    writeFileSync(
      path.join(OUT_DIR, lessonTipsFile(lesson.id)),
      JSON.stringify(page),
    );
  }
}

console.log(
  `content:emit: ${content.lessons.length} lessons -> ${path.relative(process.cwd(), OUT_DIR)}`,
);
