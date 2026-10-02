import type { ContentIndex, Subject } from "@/schema/content";

// The one switch for which subjects a child or parent can see: a subject with
// `"visible": false` in content/subjects.json is left out of every list (home
// tiles, "Học tiếp", stickers, parent report). Its routes and content stay, so
// showing it again is deleting that line. Never lists a hidden subject's
// lessons either, so nothing of it leaks through progress, cards or stickers.

export function isSubjectVisible(subject: Pick<Subject, "visible">): boolean {
  return subject.visible !== false;
}

// The index as listings should read it; screens reached by a direct link
// (a lesson, a subject) keep the full index.
export function visibleIndex(index: ContentIndex): ContentIndex {
  const subjects = index.subjects.filter(isSubjectVisible);
  if (subjects.length === index.subjects.length) return index;
  const ids = new Set(subjects.map((s) => s.id));
  return {
    subjects,
    lessons: index.lessons.filter((l) => ids.has(l.subject)),
  };
}
