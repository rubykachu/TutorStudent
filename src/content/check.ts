import type { z } from "zod";
import {
  MAX_SECTION_EXERCISES,
  MAX_SECTION_SCREENS,
  MAX_SECTION_VIDEOS,
} from "@/lib/config";
import {
  type Block,
  type GlossaryFile,
  GlossaryFileSchema,
  type GuidedInteraction,
  type IdsLock,
  IdsLockSchema,
  LegacyLessonsSchema,
  type Lesson,
  LessonSchema,
  type SectionBlock,
  type Subject,
  type SubjectsFile,
  SubjectsFileSchema,
  type TipsFile,
  TipsFileSchema,
} from "@/schema/content";
import type { VisualCatalog } from "@/visuals/registry";
import {
  type AnyExercise,
  flattenExercises,
  indexLesson,
  practiceExerciseIds,
} from "./index";
import { lintLesson } from "./lint";
import { checkGlossaryFile } from "./lint/glossary";
import { guidesBySection } from "./lint/guides";
import { lintTipsFile } from "./lint/tips";

// Pure content validation: everything `content:check` enforces beyond the zod
// schema. Reading files is the loader's job, so tests can feed mutated content.

export type IssuePath = (string | number)[];

export type Issue = {
  severity: "error" | "warning";
  file: string;
  path: IssuePath;
  message: string;
  // Content-lint rule family that raised the issue, when it came from one.
  rule?: string;
};

export type RawFile = {
  file: string;
  data?: unknown;
  // Set when the file could not be read or is not valid JSON.
  readError?: string;
};

export type RawLessonFile = RawFile & {
  fixture: boolean;
  // Directory of lesson.json relative to the content root, split by segment.
  dir: string[];
  // Verbatim source text of the lesson's reading passages, when provided.
  sourcePassage?: string;
  // Text layers of the lesson's textbook pages (sources/<subject>/<lesson>/
  // p*.txt), joined; absent when none were imported.
  sourceText?: string;
  // The lesson's tips.json, when it has one.
  tips?: RawFile;
};

export type RawGlossaryFile = RawFile & { subject: string };

export type RawContent = {
  subjects: RawFile;
  lock: RawFile;
  // `legacy-lessons.json`; absent when the content root has none.
  legacy?: RawFile;
  glossaries: RawGlossaryFile[];
  lessons: RawLessonFile[];
};

export type CheckedLesson = {
  file: string;
  fixture: boolean;
  lesson: Lesson;
  // The lesson's entry in subjects.json; absent for an unknown subject.
  subject?: Subject;
  // The lesson's parsed tips.json, with the file it came from; absent when
  // the lesson has none or the file did not parse.
  tips?: TipsFile;
  tipsFile?: string;
};

export type CheckResult = {
  issues: Issue[];
  lessons: CheckedLesson[];
};

export const FIXTURE_DIR = "_fixture";

export function formatPath(path: IssuePath): string {
  return path.reduce<string>((out, key) => {
    if (typeof key === "number") return `${out}[${key}]`;
    return /^[A-Za-z_][A-Za-z0-9_]*$/.test(key)
      ? `${out}.${key}`
      : `${out}[${JSON.stringify(key)}]`;
  }, "$");
}

export function formatIssue(issue: Issue): string {
  const rule = issue.rule === undefined ? "" : ` [${issue.rule}]`;
  return `${issue.severity} ${issue.file} ${formatPath(issue.path)}: ${issue.message}${rule}`;
}

export function zodPath(issue: z.core.$ZodIssue): IssuePath {
  return issue.path.map((key) => (typeof key === "number" ? key : String(key)));
}

type Reporter = (path: IssuePath, message: string) => void;

function parseFile<T>(
  raw: RawFile,
  schema: z.ZodType<T>,
  issues: Issue[],
): T | undefined {
  if (raw.readError !== undefined) {
    issues.push({
      severity: "error",
      file: raw.file,
      path: [],
      message: raw.readError,
    });
    return undefined;
  }
  const result = schema.safeParse(raw.data);
  if (result.success) return result.data;
  for (const zodIssue of result.error.issues) {
    issues.push({
      severity: "error",
      file: raw.file,
      path: zodPath(zodIssue),
      message: zodIssue.message,
    });
  }
  return undefined;
}

// Every id a lesson declares, with where it is declared. `tips` is the
// lesson's tips file: its ids belong to the lesson and are locked with it.
export function declaredIds(
  lesson: Lesson,
  tips?: TipsFile,
): { id: string; path: IssuePath }[] {
  const ids: { id: string; path: IssuePath }[] = [
    { id: lesson.id, path: ["id"] },
  ];
  const push = (items: readonly { id: string }[], key: string) => {
    items.forEach((item, i) => {
      ids.push({ id: item.id, path: [key, i, "id"] });
    });
  };
  push(lesson.concepts, "concepts");
  push(lesson.sections, "sections");
  push(lesson.cards, "cards");
  push(lesson.videos ?? [], "videos");
  for (const entry of flattenExercises(lesson)) {
    ids.push({ id: entry.exercise.id, path: [...entry.path, "id"] });
  }
  lesson.sections.forEach((section, i) => {
    section.blocks.forEach((block, j) => {
      if (block.type === "tip") {
        ids.push({ id: block.id, path: ["sections", i, "blocks", j, "id"] });
      }
    });
  });
  tips?.tips.forEach((tip, i) => {
    ids.push({ id: tip.id, path: ["tips", i, "id"] });
  });
  return ids;
}

const VISUAL_REF_KEYS = new Set([
  "visualId",
  "hintVisualId",
  "solutionVisualId",
]);

// Walks the whole lesson instead of listing fields, so a visual reference in
// any block, hint, exercise or sticker (including ones added later) is checked.
export function collectVisualRefs(
  value: unknown,
  path: IssuePath = [],
): { visualId: string; path: IssuePath }[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => collectVisualRefs(item, [...path, i]));
  }
  if (value === null || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) =>
    VISUAL_REF_KEYS.has(key) && typeof child === "string"
      ? [{ visualId: child, path: [...path, key] }]
      : collectVisualRefs(child, [...path, key]),
  );
}

const HTML_ID_PATTERN = /\\htmlId\{([^}]*)\}/g;

// Highlightable parts of a prompt: `\htmlId` marks in formulas and passage
// sentences, keyed by id with the path where each is declared.
function promptParts(
  prompt: readonly Block[],
): { id: string; path: IssuePath }[] {
  const parts: { id: string; path: IssuePath }[] = [];
  prompt.forEach((block, b) => {
    if (block.type === "formula") {
      for (const match of block.tex.matchAll(HTML_ID_PATTERN)) {
        parts.push({ id: match[1] ?? "", path: ["prompt", b, "tex"] });
      }
    }
    if (block.type === "passage") {
      block.paragraphs.forEach((paragraph, p) => {
        paragraph.sentences.forEach((sentence, s) => {
          parts.push({
            id: sentence.id,
            path: ["prompt", b, "paragraphs", p, "sentences", s, "id"],
          });
        });
      });
    }
  });
  return parts;
}

function checkUnique(
  ids: readonly { id: string; path: IssuePath }[],
  what: string,
  report: Reporter,
): void {
  const seen = new Set<string>();
  for (const { id, path } of ids) {
    if (seen.has(id)) report(path, `Duplicate ${what} "${id}"`);
    seen.add(id);
  }
}

function withPaths(
  items: readonly { id: string }[],
  base: IssuePath,
): { id: string; path: IssuePath }[] {
  return items.map((item, i) => ({ id: item.id, path: [...base, i, "id"] }));
}

// Answer-area element ids an `option` TargetRef may point at.
function answerElementIds(
  exercise: AnyExercise,
  catalog: VisualCatalog,
): { id: string; path: IssuePath }[] {
  switch (exercise.type) {
    case "choice":
      return withPaths(exercise.options, ["options"]);
    case "numeric":
      return (
        exercise.answer.kind === "power" ? ["base", "exponent"] : ["value"]
      ).map((id) => ({ id, path: ["answer"] }));
    case "match":
      return [
        ...withPaths(exercise.left, ["left"]),
        ...withPaths(exercise.right, ["right"]),
      ];
    case "order":
      return withPaths(exercise.items, ["items"]);
    case "fillBlank":
      return exercise.segments.flatMap((segment, i) =>
        segment.type === "blank"
          ? [{ id: segment.id, path: ["segments", i, "id"] }]
          : [],
      );
    case "tapRegion":
      return (catalog[exercise.visualId]?.regions ?? []).map((id) => ({
        id,
        path: ["visualId"],
      }));
    case "tapText":
    case "manipulate":
    case "openEnded":
      return [];
  }
}

function checkSubset(
  ids: readonly string[],
  allowed: ReadonlySet<string>,
  what: string,
  base: IssuePath,
  report: Reporter,
): void {
  const seen = new Set<string>();
  ids.forEach((id, i) => {
    if (!allowed.has(id)) report([...base, i], `Unknown ${what} "${id}"`);
    if (seen.has(id)) report([...base, i], `Duplicate ${what} "${id}"`);
    seen.add(id);
  });
}

function checkExercise(
  exercise: AnyExercise,
  lesson: Lesson,
  catalog: VisualCatalog,
  report: Reporter,
): void {
  const cardIds = new Set(lesson.cards.map((c) => c.id));
  const conceptIds = new Set(lesson.concepts.map((c) => c.id));
  checkSubset(exercise.cardIds, cardIds, "card", ["cardIds"], report);

  const parts = promptParts(exercise.prompt);
  checkUnique(parts, "prompt part", report);
  const elements = answerElementIds(exercise, catalog);
  checkUnique(elements, "answer element", report);
  const partIds = new Set(parts.map((p) => p.id));
  const elementIds = new Set(elements.map((e) => e.id));

  exercise.hints.highlight.forEach((ref, i) => {
    const path: IssuePath = ["hints", "highlight", i];
    if (ref.conceptId !== undefined && !conceptIds.has(ref.conceptId)) {
      report([...path, "conceptId"], `Unknown concept "${ref.conceptId}"`);
    }
    if (ref.target === "block" && ref.index >= exercise.prompt.length) {
      report([...path, "index"], `Prompt has no block ${ref.index}`);
    }
    if (ref.target === "part" && !partIds.has(ref.id)) {
      report([...path, "id"], `Prompt has no part "${ref.id}"`);
    }
    if (ref.target === "option" && !elementIds.has(ref.id)) {
      report([...path, "id"], `Answer area has no element "${ref.id}"`);
    }
  });

  switch (exercise.type) {
    case "choice": {
      const optionIds = new Set(exercise.options.map((o) => o.id));
      checkSubset(exercise.answer, optionIds, "option", ["answer"], report);
      if (!exercise.multiple && exercise.answer.length !== 1) {
        report(["answer"], "A single-answer choice needs exactly one answer");
      }
      break;
    }
    case "match": {
      const leftIds = new Set(exercise.left.map((item) => item.id));
      const rightIds = new Set(exercise.right.map((item) => item.id));
      checkSubset(
        exercise.pairs.map((pair) => pair.left),
        leftIds,
        "left item",
        ["pairs"],
        report,
      );
      checkSubset(
        exercise.pairs.map((pair) => pair.right),
        rightIds,
        "right item",
        ["pairs"],
        report,
      );
      const paired = new Set(exercise.pairs.map((pair) => pair.left));
      exercise.left.forEach((item, i) => {
        if (!paired.has(item.id)) {
          report(["left", i, "id"], `Left item "${item.id}" has no pair`);
        }
      });
      break;
    }
    case "fillBlank": {
      const blanks = exercise.segments.flatMap((segment, i) =>
        segment.type === "blank" ? [{ segment, i }] : [],
      );
      if (blanks.length === 0) report(["segments"], "Needs at least one blank");
      if (exercise.bank !== undefined) {
        const bank = new Set(exercise.bank);
        for (const { segment, i } of blanks) {
          if (!segment.accept.some((word) => bank.has(word))) {
            report(
              ["segments", i, "accept"],
              "No accepted answer is in the word bank",
            );
          }
        }
      }
      break;
    }
    case "tapText": {
      const sentenceIds = new Set(
        exercise.prompt.flatMap((block) =>
          block.type === "passage"
            ? block.paragraphs.flatMap((p) => p.sentences.map((s) => s.id))
            : [],
        ),
      );
      if (sentenceIds.size === 0) {
        report(["prompt"], "tapText needs a passage block in the prompt");
      }
      checkSubset(exercise.answer, sentenceIds, "sentence", ["answer"], report);
      break;
    }
    case "tapRegion": {
      const regions = catalog[exercise.visualId]?.regions;
      if (catalog[exercise.visualId] && !regions?.length) {
        report(
          ["visualId"],
          `Visual "${exercise.visualId}" declares no regions`,
        );
      }
      checkSubset(
        exercise.answer,
        new Set(regions),
        "region",
        ["answer"],
        report,
      );
      break;
    }
    case "manipulate": {
      const meta = catalog[exercise.visualId];
      if (meta && !meta.interactive) {
        report(
          ["visualId"],
          `Visual "${exercise.visualId}" is not interactive`,
        );
      }
      if (meta && !meta.validators?.[exercise.validatorId]) {
        report(
          ["validatorId"],
          `Visual "${exercise.visualId}" has no validator "${exercise.validatorId}"`,
        );
      }
      // The third wrong check must show the answer somewhere: in a solution
      // visual, or as a solved state inside the manipulated visual itself.
      if (
        meta?.validators?.[exercise.validatorId] &&
        !meta.solutions?.[exercise.validatorId] &&
        exercise.hints.solutionVisualId === undefined
      ) {
        report(
          ["validatorId"],
          `Visual "${exercise.visualId}" cannot show a solution for "${exercise.validatorId}"; add hints.solutionVisualId`,
        );
      }
      break;
    }
    case "numeric":
    case "order":
    case "openEnded":
      break;
  }
}

// Checks of a lesson's tips file that need the lesson: it belongs to this
// lesson, its ids follow the lesson's, and its pictures exist. Wording and
// the review gate are the content lint's (`lintTipsFile`).
function checkTips(
  lesson: Lesson,
  tips: TipsFile,
  catalog: VisualCatalog,
  report: Reporter,
): void {
  if (tips.lessonId !== lesson.id) {
    report(["lessonId"], `Expected lessonId "${lesson.id}"`);
  }
  tips.tips.forEach((tip, i) => {
    if (!tip.id.startsWith(`${lesson.id}.`)) {
      report(["tips", i, "id"], `Id must start with "${lesson.id}."`);
    }
  });
  checkUnique(declaredIds(lesson, tips), "id", (path, message) => {
    if (path[0] === "tips") report(path, message);
  });
  for (const ref of collectVisualRefs(tips)) {
    if (!catalog[ref.visualId]) {
      report(
        ref.path,
        `Visual "${ref.visualId}" is not in the visual registry`,
      );
    }
  }
}

function checkLesson(
  raw: RawLessonFile,
  lesson: Lesson,
  subjects: SubjectsFile | undefined,
  catalog: VisualCatalog,
  report: Reporter,
): void {
  const expectedDir = [
    ...(raw.fixture ? [FIXTURE_DIR] : []),
    lesson.subject,
    lesson.series,
    lesson.id,
  ];
  if (raw.dir.join("/") !== expectedDir.join("/")) {
    report(["id"], `Lesson must live in <root>/${expectedDir.join("/")}/`);
  }

  if (subjects) {
    const subject = subjects.subjects.find((s) => s.id === lesson.subject);
    if (!subject) report(["subject"], `Unknown subject "${lesson.subject}"`);
    else {
      const series = subject.series.find((s) => s.id === lesson.series);
      if (!series) {
        report(
          ["series"],
          `Subject "${subject.id}" has no series "${lesson.series}"`,
        );
      } else if (series.grade !== lesson.grade) {
        report(
          ["grade"],
          `Lesson grade ${lesson.grade} differs from grade ${series.grade} of series "${series.id}"`,
        );
      }
    }
  }

  for (const { id, path } of declaredIds(lesson)) {
    if (id !== lesson.id && !id.startsWith(`${lesson.id}.`)) {
      report(path, `Id must start with "${lesson.id}."`);
    }
  }
  checkUnique(declaredIds(lesson), "id", report);

  for (const ref of collectVisualRefs(lesson)) {
    if (!catalog[ref.visualId]) {
      report(
        ref.path,
        `Visual "${ref.visualId}" is not in the visual registry`,
      );
    }
  }

  const conceptIds = new Set(lesson.concepts.map((c) => c.id));
  lesson.cards.forEach((card, i) => {
    checkSubset(
      card.conceptIds,
      conceptIds,
      "concept",
      ["cards", i, "conceptIds"],
      report,
    );
  });

  const topLevelIds = new Set(lesson.exercises.map((e) => e.id));
  const placed = new Map<string, IssuePath>();
  lesson.sections.forEach((section, i) => {
    const videoCount = section.blocks.filter((b) => b.type === "video").length;
    const screenCount = section.blocks.length - videoCount;
    if (screenCount > MAX_SECTION_SCREENS) {
      report(
        ["sections", i, "blocks"],
        `Section has ${screenCount} screens (max ${MAX_SECTION_SCREENS}); split it into shorter sections`,
      );
    }
    if (videoCount > MAX_SECTION_VIDEOS) {
      report(
        ["sections", i, "blocks"],
        `Section has ${videoCount} video blocks (max ${MAX_SECTION_VIDEOS})`,
      );
    }
    // A bookPractice section holds every workbook exercise of the lesson, so
    // its count follows the book.
    const exerciseCount = section.checkIds.length + section.practiceIds.length;
    if (!section.bookPractice && exerciseCount > MAX_SECTION_EXERCISES) {
      report(
        ["sections", i],
        `Section has ${exerciseCount} exercises in checkIds and practiceIds (max ${MAX_SECTION_EXERCISES}); split it or move practice beyond one per card to the review bank`,
      );
    }
    for (const key of ["checkIds", "practiceIds"] as const) {
      section[key].forEach((id, j) => {
        const path: IssuePath = ["sections", i, key, j];
        if (!topLevelIds.has(id)) {
          report(path, `Unknown top-level exercise "${id}"`);
        } else if (placed.has(id)) {
          report(
            path,
            `Exercise "${id}" is already placed at ${formatPath(placed.get(id) ?? [])}`,
          );
        } else {
          placed.set(id, path);
        }
      });
    }
  });

  for (const entry of flattenExercises(lesson)) {
    checkExercise(entry.exercise, lesson, catalog, (path, message) =>
      report([...entry.path, ...path], message),
    );
  }

  const videos = new Map((lesson.videos ?? []).map((v) => [v.id, v]));
  const cardIds = new Set(lesson.cards.map((c) => c.id));
  (lesson.videos ?? []).forEach((video, i) => {
    if (video.lessonId !== lesson.id) {
      report(["videos", i, "lessonId"], `Expected lessonId "${lesson.id}"`);
    }
    checkUnique(withPaths(video.clips, ["videos", i, "clips"]), "clip", report);
    video.clips.forEach((clip, j) => {
      const path: IssuePath = ["videos", i, "clips", j];
      if (clip.end <= clip.start || clip.end > video.durationSec) {
        report(path, "Clip must end after it starts and within the video");
      }
      checkSubset(clip.cardIds, cardIds, "card", [...path, "cardIds"], report);
    });
  });
  walkBlocks(lesson, (block, path) => {
    if (block.type !== "video") return;
    const video = videos.get(block.videoId);
    if (!video)
      report([...path, "videoId"], `Unknown video "${block.videoId}"`);
    else if (
      block.clipId !== undefined &&
      !video.clips.some((c) => c.id === block.clipId)
    ) {
      report(
        [...path, "clipId"],
        `Video "${video.id}" has no clip "${block.clipId}"`,
      );
    }
  });

  const index = indexLesson(lesson);
  const practiced = practiceExerciseIds(lesson);
  lesson.cards.forEach((card, i) => {
    // How many exercises a card needs is the content lint's card-exercises
    // rule; here only whether any of them opens the card.
    const exerciseIds = index.exerciseIdsByCard.get(card.id) ?? [];
    if (!exerciseIds.some((id) => practiced.has(id))) {
      report(
        ["cards", i],
        `Card "${card.id}" has no exercise in any section's practiceIds, so it is never opened`,
      );
    }
  });
}

// Every block position in a lesson: section blocks, the blocks inside a
// section's groups, exercise and step prompts.
function walkBlocks(
  lesson: Lesson,
  visit: (block: SectionBlock, path: IssuePath) => void,
): void {
  lesson.sections.forEach((section, i) => {
    section.blocks.forEach((block, j) => {
      const path: IssuePath = ["sections", i, "blocks", j];
      visit(block, path);
      if (block.type !== "group") return;
      block.children.forEach((child, k) => {
        visit(child, [...path, "children", k]);
      });
    });
  });
  for (const entry of flattenExercises(lesson)) {
    entry.exercise.prompt.forEach((block, j) => {
      visit(block, [...entry.path, "prompt", j]);
    });
  }
}

function checkLock(
  raw: RawFile,
  lock: IdsLock,
  lessons: readonly CheckedLesson[],
  issues: Issue[],
): void {
  const report = (
    severity: Issue["severity"],
    path: IssuePath,
    message: string,
  ) => issues.push({ severity, file: raw.file, path, message });
  // The fixture is test-only content, so its ids are never locked.
  const real = lessons.filter((l) => !l.fixture);
  const current = new Set(
    real.flatMap((l) => declaredIds(l.lesson, l.tips).map((d) => d.id)),
  );

  lock.ids.forEach((id, i) => {
    if (!current.has(id) && !(id in lock.retired)) {
      report(
        "error",
        ["ids", i],
        `Locked id "${id}" no longer exists and is not retired`,
      );
    }
  });

  for (const [oldId, firstNext] of Object.entries(lock.retired)) {
    const path: IssuePath = ["retired", oldId];
    if (current.has(oldId)) {
      report("error", path, `Retired id "${oldId}" still exists in content`);
    }
    const chain = [oldId];
    let next = firstNext;
    while (next !== null && next in lock.retired) {
      if (chain.includes(next)) break;
      chain.push(next);
      next = lock.retired[next] ?? null;
    }
    if (next !== null && chain.includes(next)) {
      report(
        "error",
        path,
        `Retired chain loops: ${[...chain, next].join(" -> ")}`,
      );
    } else if (next !== null && !current.has(next)) {
      report(
        "error",
        path,
        `Retired chain ends at "${next}", which does not exist`,
      );
    }
  }

  const locked = new Set(lock.ids);
  for (const { file, lesson, tips } of real) {
    const missing = declaredIds(lesson, tips).filter((d) => !locked.has(d.id));
    if (missing.length > 0) {
      issues.push({
        severity: "warning",
        file,
        path: [],
        message: `${missing.length} id(s) not in ids.lock.json; run pnpm content:lock`,
      });
    }
  }
}

// Interactions taught by guide screens of the lessons that come before
// `lesson` in the app's order: subjects as listed in subjects.json, then
// lessons by `order` within a subject. Guides are taught once for the app.
function priorGuides(
  lessons: readonly CheckedLesson[],
  lesson: Lesson,
  fixture: boolean,
  subjects: SubjectsFile | undefined,
): Set<GuidedInteraction> {
  const guides = new Set<GuidedInteraction>();
  if (fixture) return guides;
  const ids = subjects?.subjects.map((s) => s.id) ?? [];
  const rank = (l: Lesson): [number, number] => {
    const i = ids.indexOf(l.subject);
    return [i < 0 ? ids.length : i, l.order];
  };
  const [subject, order] = rank(lesson);
  for (const other of lessons) {
    if (other.fixture) continue;
    const [otherSubject, otherOrder] = rank(other.lesson);
    if (
      otherSubject > subject ||
      (otherSubject === subject && otherOrder >= order)
    ) {
      continue;
    }
    for (const section of guidesBySection(other.lesson)) {
      for (const interaction of section) guides.add(interaction);
    }
  }
  return guides;
}

export function checkContent(
  raw: RawContent,
  catalog: VisualCatalog,
): CheckResult {
  const issues: Issue[] = [];
  const subjects = parseFile(raw.subjects, SubjectsFileSchema, issues);
  const lock = parseFile(raw.lock, IdsLockSchema, issues);
  const legacy = raw.legacy
    ? parseFile(raw.legacy, LegacyLessonsSchema, issues)
    : undefined;
  const legacyLevels = legacy?.lessons ?? {};
  const glossaries = new Map<string, GlossaryFile>();
  for (const file of raw.glossaries) {
    const glossary = parseFile(file, GlossaryFileSchema, issues);
    if (!glossary) continue;
    glossaries.set(file.subject, glossary);
    for (const { path, message } of checkGlossaryFile(glossary)) {
      issues.push({ severity: "error", file: file.file, path, message });
    }
  }

  const lessons: CheckedLesson[] = [];
  for (const file of raw.lessons) {
    const lesson = parseFile(file, LessonSchema, issues);
    if (!lesson) continue;
    const tips = file.tips
      ? parseFile(file.tips, TipsFileSchema, issues)
      : undefined;
    lessons.push({
      file: file.file,
      fixture: file.fixture,
      lesson,
      subject: subjects?.subjects.find((s) => s.id === lesson.subject),
      ...(tips && file.tips ? { tips, tipsFile: file.tips.file } : {}),
    });
    checkLesson(file, lesson, subjects, catalog, (path, message) =>
      issues.push({ severity: "error", file: file.file, path, message }),
    );
    if (tips && file.tips) {
      const tipsFile = file.tips.file;
      checkTips(lesson, tips, catalog, (path, message) =>
        issues.push({ severity: "error", file: tipsFile, path, message }),
      );
    }
    // Every published lesson opens with an overview, so the child starts it
    // knowing what it teaches and where it shows up in daily life. A lesson
    // from before the rule only warns; a new one fails.
    if (!file.fixture && lesson.status === "published" && !lesson.overview) {
      issues.push({
        severity: lesson.id in legacyLevels ? "warning" : "error",
        file: file.file,
        path: ["overview"],
        message:
          "Published lesson has no overview; the child starts it without knowing what it teaches",
      });
    }
  }

  // Linted once every lesson is parsed: a lesson may rely on guide screens
  // of earlier lessons of its subject.
  for (const file of raw.lessons) {
    const checked = lessons.find((l) => l.file === file.file);
    if (!checked) continue;
    const { lesson, subject } = checked;
    issues.push(
      ...lintLesson({
        file: file.file,
        lesson,
        fixture: file.fixture,
        subject,
        glossary: glossaries.get(lesson.subject),
        sourcePassage: file.sourcePassage,
        sourceText: file.sourceText,
        priorGuides: priorGuides(lessons, lesson, file.fixture, subjects),
        legacy: legacyLevels[lesson.id],
      }),
    );
    if (checked.tips && checked.tipsFile) {
      issues.push(
        ...lintTipsFile({
          file: checked.tipsFile,
          lesson,
          tips: checked.tips,
          fixture: file.fixture,
          subject,
          glossary: glossaries.get(lesson.subject),
        }),
      );
    }
  }

  // Ids are global: progress is keyed by id alone, across every lesson.
  const owners = new Map<string, string>();
  for (const { file, lesson, tips } of lessons) {
    for (const { id, path } of declaredIds(lesson, tips)) {
      const owner = owners.get(id);
      if (owner !== undefined && owner !== file) {
        issues.push({
          severity: "error",
          file,
          path,
          message: `Id "${id}" is also declared in ${owner}`,
        });
      }
      owners.set(id, file);
    }
  }

  if (lock) checkLock(raw.lock, lock, lessons, issues);
  return { issues, lessons };
}
