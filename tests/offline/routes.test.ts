import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadSubjects, servedLessons } from "@/content/load";
import { appPagePaths, NOT_PRECACHED_ROUTES } from "@/offline/routes";
import { generateStaticParams as lessonParams } from "../../src/app/(child)/lessons/[lessonId]/page";
import { generateStaticParams as reviewParams } from "../../src/app/(child)/lessons/[lessonId]/review/page";
import { generateStaticParams as sectionParams } from "../../src/app/(child)/lessons/[lessonId]/sections/[sectionId]/page";
import { generateStaticParams as tipsParams } from "../../src/app/(child)/lessons/[lessonId]/tips/page";
import { generateStaticParams as subjectParams } from "../../src/app/(child)/subjects/[subject]/page";

const APP_DIR = path.join(process.cwd(), "src/app");

function pageFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return pageFiles(full);
    return name === "page.tsx" ? [full] : [];
  });
}

// `src/app/(child)/lessons/[lessonId]/page.tsx` -> `/lessons/[lessonId]`
function routeOf(file: string): string {
  const segments = path
    .relative(APP_DIR, path.dirname(file))
    .split(path.sep)
    .filter((s) => s !== "" && !/^\(.*\)$/.test(s));
  return `/${segments.join("/")}`;
}

function patternToRegExp(pattern: string): RegExp {
  const source = pattern
    .split("/")
    .map((segment) => {
      if (segment === "**") return ".*";
      if (/^\[.+\]$/.test(segment)) return "[^/]+";
      return segment.replace(/[.*+?^${}()|\\]/g, "\\$&");
    })
    .join("/");
  return new RegExp(`^${source}$`);
}

describe("static params of the pages", () => {
  const lessons = servedLessons();

  it("keep returning the served lessons, sections and subjects", () => {
    expect(lessons.length).toBeGreaterThan(0);
    expect(subjectParams()).toEqual(
      loadSubjects().map((s) => ({ subject: s.id })),
    );
    expect(lessonParams()).toEqual(lessons.map((l) => ({ lessonId: l.id })));
    expect(reviewParams()).toEqual(lessons.map((l) => ({ lessonId: l.id })));
    expect(sectionParams()).toEqual(
      lessons.flatMap((l) =>
        l.sections.map((s) => ({ lessonId: l.id, sectionId: s.id })),
      ),
    );
    const tipIds = tipsParams().map((p) => p.lessonId);
    expect(tipIds.every((id) => lessons.some((l) => l.id === id))).toBe(true);
  });
});

describe("appPagePaths", () => {
  const paths = appPagePaths();

  it("holds the fixed routes, every lesson and its sections", () => {
    for (const fixed of ["/", "/profiles", "/grades", "/parent"]) {
      expect(paths).toContain(fixed);
    }
    for (const lesson of servedLessons()) {
      expect(paths).toContain(`/lessons/${lesson.id}`);
      expect(paths).toContain(`/lessons/${lesson.id}/review`);
      for (const section of lesson.sections) {
        expect(paths).toContain(`/lessons/${lesson.id}/sections/${section.id}`);
      }
    }
    for (const subject of loadSubjects()) {
      expect(paths).toContain(`/subjects/${subject.id}`);
    }
  });

  it("has no duplicate and no route that is not precached", () => {
    expect(new Set(paths).size).toBe(paths.length);
    const excluded = NOT_PRECACHED_ROUTES.map((r) =>
      patternToRegExp(r.pattern),
    );
    expect(paths.filter((p) => excluded.some((re) => re.test(p)))).toEqual([]);
  });

  it("covers every page under src/app or lists it with a reason", () => {
    const excluded = NOT_PRECACHED_ROUTES.map((r) =>
      patternToRegExp(r.pattern),
    );
    const uncovered = pageFiles(APP_DIR)
      .map(routeOf)
      .filter((route) => {
        // A dynamic route is covered when some generated path matches it.
        const covered = paths.some((p) => patternToRegExp(route).test(p));
        const listed = excluded.some((re) =>
          re.test(route.replace(/\[[^/]+\]/g, "x")),
        );
        return !covered && !listed;
      });
    expect(uncovered).toEqual([]);
  });

  it("gives every excluded route a reason", () => {
    for (const { reason } of NOT_PRECACHED_ROUTES) {
      expect(reason.length).toBeGreaterThan(5);
    }
  });
});
