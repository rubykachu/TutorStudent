import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { summarizeLesson } from "@/content/index";
import { loadContent } from "@/content/load";
import type { ContentIndex } from "@/schema/content";

// Writes the static content the app fetches: /content/index.json and
// /content/<lessonId>.json. Only published lessons (plus the fixture when
// CONTENT_INCLUDE_FIXTURE=1) are written, so drafts never reach the browser.
const OUT_DIR = path.join(process.cwd(), "public", "content");

const { subjects, lessons } = loadContent();

// Start clean so a lesson that was unpublished or removed disappears too.
rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const index: ContentIndex = {
  subjects,
  lessons: lessons.map(({ lesson }) => summarizeLesson(lesson)),
};
writeFileSync(path.join(OUT_DIR, "index.json"), JSON.stringify(index));
for (const { lesson } of lessons) {
  writeFileSync(
    path.join(OUT_DIR, `${lesson.id}.json`),
    JSON.stringify(lesson),
  );
}

console.log(
  `content:emit: ${lessons.length} lessons -> ${path.relative(process.cwd(), OUT_DIR)}`,
);
