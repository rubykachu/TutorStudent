import { DEFAULT_GRADE, VISIBLE_GRADES } from "@/lib/config";
import type { ContentIndex, Subject } from "@/schema/content";

// Pure lookups that tie subjects, series and lessons to a grade; safe to
// import from browser code. A series belongs to one grade (`Series.grade`),
// a lesson to the grade of its series, and a grade is open exactly when at
// least one published lesson belongs to it: nothing here lists grades or
// locked subjects by hand.

// What a child's profile says about what to study.
export type Learner = {
  grade: number;
  // Subject id -> series id the child picked; used only where that series is
  // of the child's grade.
  series: Readonly<Record<string, string>>;
};

type Series = Subject["series"][number];

export function seriesOfGrade(subject: Subject, grade: number): Series[] {
  return subject.series.filter((s) => s.grade === grade);
}

// The series a child studies for a subject in a grade: their pick when it is
// of that grade, else the subject's default when that is, else the first
// series of the grade. Undefined when the subject has nothing for the grade.
export function seriesForGrade(
  subject: Subject,
  grade: number,
  chosen?: string,
): string | undefined {
  const ofGrade = seriesOfGrade(subject, grade);
  return [chosen, subject.defaultSeries, ofGrade[0]?.id].find(
    (id) => id !== undefined && ofGrade.some((s) => s.id === id),
  );
}

// Subjects that teach the grade, in the order of content/subjects.json,
// whether or not they have a published lesson yet (the home screen shows the
// ones without as locked).
export function subjectsOfGrade(
  subjects: readonly Subject[],
  grade: number,
): Subject[] {
  return subjects.filter((s) => seriesOfGrade(s, grade).length > 0);
}

// Grades with at least one published lesson, ascending. The index lists only
// served lessons, so a draft never opens a grade.
export function openGrades(index: ContentIndex): number[] {
  const open = new Set<number>();
  for (const lesson of index.lessons) {
    const subject = index.subjects.find((s) => s.id === lesson.subject);
    const series = subject?.series.find((s) => s.id === lesson.series);
    if (series) open.add(series.grade);
  }
  return [...open].sort((a, b) => a - b);
}

// Which grades a screen may list: `VISIBLE_GRADES`, see `lib/config.ts`.
export function visibleGrades<T extends number>(
  grades: readonly T[],
  visible: readonly number[] = VISIBLE_GRADES,
): T[] {
  return grades.filter((g) => visible.includes(g));
}

// More than one visible grade is the only case where a child picks one.
export function hasGradeChoice(
  visible: readonly number[] = VISIBLE_GRADES,
): boolean {
  return visible.length > 1;
}

// The grade a child studies: their own when it is visible, else the default
// (also for a profile saved without a grade).
export function learnerGrade(
  grade: number | undefined,
  visible: readonly number[] = VISIBLE_GRADES,
): number {
  return grade !== undefined && visible.includes(grade) ? grade : DEFAULT_GRADE;
}

// A profile as screens read it: its grade replaced by the one it studies. The
// stored record is not rewritten.
export function withLearnerGrade<T extends { grade?: number }>(
  profile: T,
): T & { grade: number } {
  return { ...profile, grade: learnerGrade(profile.grade) };
}
