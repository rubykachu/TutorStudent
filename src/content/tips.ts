import type { Lesson, Tip, TipsFile } from "@/schema/content";

// Tips of a lesson come from two places that read the same to the child: `tip`
// blocks inside its sections, and the separate `tips.json` that lets a
// published lesson gain tips without changing lesson.json. Pure lookups, safe
// to import from browser code.

// The lesson's `tip` blocks as plain tips, in section order.
export function sectionTips(lesson: Lesson): Tip[] {
  return lesson.sections.flatMap((section) =>
    section.blocks.flatMap((block): Tip[] => {
      if (block.type !== "tip") return [];
      const { type: _type, ...tip } = block;
      return [tip];
    }),
  );
}

// Everything the lesson's "Mẹo hay" page lists: the tips of its sections, then
// those of its tips file.
export function lessonTips(lesson: Lesson, file?: TipsFile): Tip[] {
  return [...sectionTips(lesson), ...(file?.tips ?? [])];
}

// A tips file reaches the app once reviewed; a draft file only on an author's
// machine (`CONTENT_INCLUDE_DRAFT`).
export function isTipsFileServed(
  file: Pick<TipsFile, "status">,
  includeDraft: boolean,
): boolean {
  return file.status === "published" || includeDraft;
}
