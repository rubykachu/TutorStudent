import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { lessonContentFile } from "@/content";
import { buildContentIndex, loadContent } from "@/content/load";

// Writes the static content the app fetches: /content/index.json and
// /content/<lessonId>.json. Only published lessons (plus the fixture when
// CONTENT_INCLUDE_FIXTURE=1) are written, so drafts never reach the browser.
const OUT_DIR = path.join(process.cwd(), "public", "content");

const content = loadContent();

// Start clean so a lesson that was unpublished or removed disappears too.
rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

writeFileSync(
  path.join(OUT_DIR, "index.json"),
  JSON.stringify(buildContentIndex(content)),
);
for (const { lesson } of content.lessons) {
  writeFileSync(
    path.join(OUT_DIR, lessonContentFile(lesson.id)),
    JSON.stringify(lesson),
  );
}

console.log(
  `content:emit: ${content.lessons.length} lessons -> ${path.relative(process.cwd(), OUT_DIR)}`,
);
