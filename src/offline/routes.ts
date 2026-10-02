import {
  loadSubjects,
  servedLessons,
  servedTipLessonIds,
} from "@/content/load";

// Build side only (it reads content/ from disk): the worker never imports it.
//
// The statically generated pages come from the param functions below. Each
// page's `generateStaticParams` calls the same function, so the list of pages
// the offline precache holds and the list Next builds cannot drift apart.

export function subjectParams(): { subject: string }[] {
  return loadSubjects().map((s) => ({ subject: s.id }));
}

export function lessonParams(): { lessonId: string }[] {
  return servedLessons().map((lesson) => ({ lessonId: lesson.id }));
}

export function tipsParams(): { lessonId: string }[] {
  return servedTipLessonIds().map((lessonId) => ({ lessonId }));
}

export function sectionParams(): { lessonId: string; sectionId: string }[] {
  return servedLessons().flatMap((lesson) =>
    lesson.sections.map((section) => ({
      lessonId: lesson.id,
      sectionId: section.id,
    })),
  );
}

// Pages without a dynamic segment.
const FIXED_PAGE_PATHS = ["/", "/profiles", "/grades", "/parent"] as const;

// Every statically generated page a child or parent can open.
export function appPagePaths(): string[] {
  return [
    ...FIXED_PAGE_PATHS,
    ...subjectParams().map(({ subject }) => `/subjects/${subject}`),
    ...lessonParams().map(({ lessonId }) => `/lessons/${lessonId}`),
    ...lessonParams().map(({ lessonId }) => `/lessons/${lessonId}/review`),
    ...tipsParams().map(({ lessonId }) => `/lessons/${lessonId}/tips`),
    ...sectionParams().map(
      ({ lessonId, sectionId }) => `/lessons/${lessonId}/sections/${sectionId}`,
    ),
  ];
}

// Route patterns left out of the precache (`**` matches any rest of the
// path), each with the reason. A page under `src/app/` that is neither
// produced by `appPagePaths()` nor listed here fails a test, so a new screen
// cannot silently miss offline.
export const NOT_PRECACHED_ROUTES: readonly {
  pattern: string;
  reason: string;
}[] = [
  {
    pattern: "/unlock",
    reason: "needs the network to set the family-code cookie; never cached",
  },
  {
    pattern: "/dev/**",
    reason: "developer galleries; a 404 in production",
  },
];
