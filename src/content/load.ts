import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { z } from "zod";
import { CONTENT_INCLUDE_FIXTURE } from "@/lib/config";
import {
  type Lesson,
  LessonSchema,
  type Subject,
  SubjectsFileSchema,
} from "@/schema/content";
import {
  FIXTURE_DIR,
  formatPath,
  type RawContent,
  type RawFile,
  type RawLessonFile,
  zodPath,
} from "./check";
import { isServed } from "./index";

// Node-only: reads content/ from disk at build time. Browser code imports the
// pure modules (`./index`, `./check`) instead.

export const DEFAULT_CONTENT_ROOT = path.join(process.cwd(), "content");
export const SUBJECTS_FILE = "subjects.json";
export const IDS_LOCK_FILE = "ids.lock.json";
const LESSON_FILE = "lesson.json";

function displayPath(absolute: string): string {
  return path.relative(process.cwd(), absolute) || absolute;
}

function readJson(absolute: string): RawFile {
  const file = displayPath(absolute);
  let text: string;
  try {
    text = readFileSync(absolute, "utf8");
  } catch (error) {
    return { file, readError: `Cannot read file: ${(error as Error).message}` };
  }
  try {
    return { file, data: JSON.parse(text) };
  } catch (error) {
    return { file, readError: `Invalid JSON: ${(error as Error).message}` };
  }
}

export function readContentRoot(
  root: string = DEFAULT_CONTENT_ROOT,
): RawContent {
  const lessonFiles = readdirSync(root, { recursive: true, encoding: "utf8" })
    .filter((relative) => path.basename(relative) === LESSON_FILE)
    .sort();
  const lessons: RawLessonFile[] = lessonFiles.map((relative) => {
    const dir = path.dirname(relative).split(path.sep);
    return {
      ...readJson(path.join(root, relative)),
      fixture: dir[0] === FIXTURE_DIR,
      dir,
    };
  });
  return {
    subjects: readJson(path.join(root, SUBJECTS_FILE)),
    lock: readJson(path.join(root, IDS_LOCK_FILE)),
    lessons,
  };
}

export type LoadedLesson = { lesson: Lesson; fixture: boolean };

export type LoadedContent = {
  subjects: Subject[];
  // Only lessons the app may show: published ones, plus the fixture on opt-in.
  lessons: LoadedLesson[];
};

function parseOrThrow<T>(raw: RawFile, schema: z.ZodType<T>): T {
  if (raw.readError !== undefined) {
    throw new Error(`${raw.file}: ${raw.readError}`);
  }
  const result = schema.safeParse(raw.data);
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  ${formatPath(zodPath(issue))}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `${raw.file} is invalid; run pnpm content:check\n${details}`,
    );
  }
  return result.data;
}

export function loadContent({
  root = DEFAULT_CONTENT_ROOT,
  includeFixture = CONTENT_INCLUDE_FIXTURE,
}: {
  root?: string;
  includeFixture?: boolean;
} = {}): LoadedContent {
  const raw = readContentRoot(root);
  const { subjects } = parseOrThrow(raw.subjects, SubjectsFileSchema);
  const lessons = raw.lessons
    // Skipping the fixture before parsing keeps it from affecting real builds.
    .filter((file) => includeFixture || !file.fixture)
    .map((file) => ({
      lesson: parseOrThrow(file, LessonSchema),
      fixture: file.fixture,
    }))
    .filter(({ lesson, fixture }) => isServed(lesson, fixture, includeFixture))
    .sort((a, b) => a.lesson.order - b.lesson.order);
  return { subjects, lessons };
}
