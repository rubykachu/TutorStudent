import path from "node:path";
import type { RawContent, RawLessonFile } from "@/content/check";
import { readContentRoot } from "@/content/load";

export const CONTENT_ROOT = path.join(process.cwd(), "content");

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
