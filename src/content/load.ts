import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { z } from "zod";
import { CONTENT_INCLUDE_DRAFT, CONTENT_INCLUDE_FIXTURE } from "@/lib/config";
import {
  type ContentIndex,
  type Lesson,
  LessonSchema,
  type Subject,
  SubjectsFileSchema,
  type Tip,
  type TipsFile,
  TipsFileSchema,
} from "@/schema/content";
import {
  FIXTURE_DIR,
  formatPath,
  type RawContent,
  type RawFile,
  type RawGlossaryFile,
  type RawLessonFile,
  zodPath,
} from "./check";
import { isServed, summarizeLesson } from "./index";
import { SOURCE_PASSAGE_FILE } from "./lint/passage";
import { isTipsFileServed, lessonTips } from "./tips";

// Node-only: reads content/ from disk at build time. Browser code imports the
// pure modules (`./index`, `./check`) instead.

export const DEFAULT_CONTENT_ROOT = path.join(process.cwd(), "content");
export const SUBJECTS_FILE = "subjects.json";
export const IDS_LOCK_FILE = "ids.lock.json";
export const GLOSSARY_DIR = "glossary";
export const LEGACY_LESSONS_FILE = "legacy-lessons.json";
const LESSON_FILE = "lesson.json";
export const TIPS_FILE = "tips.json";
// Textbook scans and their text layers sit beside the content root, in
// sources/<subject>/<lesson>/ (gitignored).
const SOURCES_DIR = "sources";
const TEXT_LAYER = /^(?:sbt-)?p[\d-]+\.txt$/;

// The text layers of a lesson's textbook pages, joined; undefined when none.
function readSourceText(root: string, dir: string[]): string | undefined {
  const [subject, , slug] = dir;
  if (!subject || !slug) return undefined;
  const folder = path.resolve(root, "..", SOURCES_DIR, subject, slug);
  if (!existsSync(folder)) return undefined;
  const pages = readdirSync(folder)
    .filter((name) => TEXT_LAYER.test(name))
    .sort();
  if (pages.length === 0) return undefined;
  return pages
    .map((name) => readFileSync(path.join(folder, name), "utf8"))
    .join("\n");
}

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
    const passageFile = path.join(
      root,
      path.dirname(relative),
      SOURCE_PASSAGE_FILE,
    );
    const fixture = dir[0] === FIXTURE_DIR;
    const sourceText = fixture ? undefined : readSourceText(root, dir);
    const tipsPath = path.join(root, path.dirname(relative), TIPS_FILE);
    return {
      ...readJson(path.join(root, relative)),
      fixture,
      dir,
      ...(existsSync(tipsPath) ? { tips: readJson(tipsPath) } : {}),
      ...(sourceText === undefined ? {} : { sourceText }),
      ...(existsSync(passageFile)
        ? { sourcePassage: readFileSync(passageFile, "utf8") }
        : {}),
    };
  });
  const glossaryDir = path.join(root, GLOSSARY_DIR);
  const glossaries: RawGlossaryFile[] = existsSync(glossaryDir)
    ? readdirSync(glossaryDir)
        .filter((name) => name.endsWith(".json"))
        .sort()
        .map((name) => ({
          ...readJson(path.join(glossaryDir, name)),
          subject: path.basename(name, ".json"),
        }))
    : [];
  const legacyPath = path.join(root, LEGACY_LESSONS_FILE);
  return {
    subjects: readJson(path.join(root, SUBJECTS_FILE)),
    lock: readJson(path.join(root, IDS_LOCK_FILE)),
    ...(existsSync(legacyPath) ? { legacy: readJson(legacyPath) } : {}),
    glossaries,
    lessons,
  };
}

export type LoadedLesson = {
  lesson: Lesson;
  fixture: boolean;
  // What the lesson's "Mẹo hay" page lists (see `lessonTips`): the tips of
  // its sections plus those of a tips file the app may serve.
  tips: Tip[];
};

export type LoadedContent = {
  subjects: Subject[];
  // Only lessons the app may show: published ones, plus the fixture and the
  // drafts on opt-in.
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
  includeDraft = CONTENT_INCLUDE_DRAFT,
}: {
  root?: string;
  includeFixture?: boolean;
  // Real draft lessons too, for previewing on an author's machine.
  includeDraft?: boolean;
} = {}): LoadedContent {
  const raw = readContentRoot(root);
  const { subjects } = parseOrThrow(raw.subjects, SubjectsFileSchema);
  const lessons = raw.lessons
    // Skipping the fixture before parsing keeps it from affecting real builds.
    .filter((file) => includeFixture || !file.fixture)
    .map((file) => {
      const lesson = parseOrThrow(file, LessonSchema);
      const tipsFile: TipsFile | undefined = file.tips
        ? parseOrThrow(file.tips, TipsFileSchema)
        : undefined;
      return {
        lesson,
        fixture: file.fixture,
        tips: lessonTips(
          lesson,
          tipsFile && isTipsFileServed(tipsFile, includeDraft || file.fixture)
            ? tipsFile
            : undefined,
        ),
      };
    })
    .filter(
      ({ lesson, fixture }) =>
        isServed(lesson, fixture, includeFixture) || (includeDraft && !fixture),
    )
    .sort((a, b) => a.lesson.order - b.lesson.order);
  return { subjects, lessons };
}

// Lessons the app serves, for build-time route params of lesson pages.
export function servedLessons(root: string = DEFAULT_CONTENT_ROOT): Lesson[] {
  return loadContent({ root }).lessons.map(({ lesson }) => lesson);
}

// Subjects alone, for build-time route params that do not need the lessons.
export function loadSubjects(root: string = DEFAULT_CONTENT_ROOT): Subject[] {
  return parseOrThrow(
    readJson(path.join(root, SUBJECTS_FILE)),
    SubjectsFileSchema,
  ).subjects;
}

// What the browser receives as /content/index.json: only lessons that
// `loadContent` serves, so a draft can never reach the lesson lists.
export function buildContentIndex(content: LoadedContent): ContentIndex {
  return {
    subjects: content.subjects,
    lessons: content.lessons.map(({ lesson, tips }) =>
      summarizeLesson(lesson, tips),
    ),
  };
}
