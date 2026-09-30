import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { RawContent, RawLessonFile } from "@/content/check";
import { readContentRoot } from "@/content/load";
import { type Subject, SubjectsFileSchema } from "@/schema/content";

export const CONTENT_ROOT = path.join(process.cwd(), "content");

// The lesson-author skill's starting point for a new lesson. It must pass
// content:check as copied, and follow the authoring rules.
export const SKELETON_FILE = path.join(
  process.cwd(),
  ".claude/skills/lesson-author/templates/lesson.skeleton.json",
);
export const SKELETON_ID = "bai-moi";

// An entry of the committed content/subjects.json.
export function subjectOf(id: string): Subject {
  const subject = SubjectsFileSchema.parse(
    JSON.parse(readFileSync(path.join(CONTENT_ROOT, "subjects.json"), "utf8")),
  ).subjects.find((s) => s.id === id);
  if (!subject) throw new Error(`subject ${id} missing`);
  return subject;
}

export function readSkeleton(): Record<string, unknown> {
  return JSON.parse(readFileSync(SKELETON_FILE, "utf8"));
}

// Lays out a content root the way content:check reads it: the committed
// subjects, glossaries and fixture, an empty id lock, and `lesson` (the
// skeleton by default) as the one real lesson. Returns the lesson's file.
export function writeContentRoot(
  root: string,
  lesson: Record<string, unknown> = readSkeleton(),
): string {
  for (const entry of ["subjects.json", "glossary", "_fixture"]) {
    cpSync(path.join(CONTENT_ROOT, entry), path.join(root, entry), {
      recursive: true,
    });
  }
  writeFileSync(
    path.join(root, "ids.lock.json"),
    JSON.stringify({ ids: [], retired: {} }),
  );
  const dir = path.join(
    root,
    String(lesson.subject),
    String(lesson.series),
    String(lesson.id),
  );
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "lesson.json");
  writeFileSync(file, JSON.stringify(lesson, null, 2));
  return file;
}

type Json = Record<string, unknown>;

// A fresh deep copy of the committed content restricted to the fixture lesson,
// so each test can mutate it without affecting others or depending on real lessons.
// The lock is emptied too: it lists only real lessons' ids, which would all
// count as vanished once those lessons are filtered out.
export function fixtureContent(): RawContent {
  const raw = structuredClone(readContentRoot(CONTENT_ROOT));
  return {
    ...raw,
    lock: { ...raw.lock, data: { ids: [], retired: {} } },
    lessons: raw.lessons.filter((l) => l.fixture),
  };
}

export function fixtureFile(raw: RawContent): RawLessonFile {
  const file = raw.lessons[0];
  if (!file) throw new Error("fixture lesson missing");
  return file;
}

export function lessonData(raw: RawContent): Json & {
  exercises: Json[];
  sections: Json[];
  cards: Json[];
} {
  return fixtureFile(raw).data as ReturnType<typeof lessonData>;
}

// Treats the fixture as a real lesson, which is what ids.lock applies to.
export function asRealLesson(raw: RawContent): RawContent {
  const file = fixtureFile(raw);
  return {
    ...raw,
    lessons: [{ ...file, fixture: false, dir: file.dir.slice(1) }],
  };
}

export function exerciseIndex(raw: RawContent, id: string): number {
  const index = lessonData(raw).exercises.findIndex((e) => e.id === id);
  if (index < 0) throw new Error(`no exercise ${id}`);
  return index;
}

export function exercise(raw: RawContent, id: string): Json {
  return lessonData(raw).exercises[exerciseIndex(raw, id)] as Json;
}
