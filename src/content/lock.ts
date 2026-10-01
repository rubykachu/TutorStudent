import {
  type CheckedLesson,
  declaredIds,
  formatIssue,
  type Issue,
} from "./check";

// What `pnpm content:lock` decides, kept apart from reading and writing files
// so tests can feed it mutated content.

export type LockPlan = {
  // The ids to write: the lock's current ids plus those of locked lessons.
  ids: string[];
  // Ids of lessons that were locked.
  locked: string[];
  // Lessons left out because they changed after their review (stale
  // reviewedHash); only possible when no lesson ids were named.
  skipped: string[];
  // Reasons to refuse; empty when the plan can be written.
  errors: string[];
};

function lockable(lessons: readonly CheckedLesson[]): CheckedLesson[] {
  return lessons.filter((l) => !l.fixture);
}

// Locks the ids of `only` (lesson ids), or of every real lesson when `only`
// is empty. A lesson whose review is stale is skipped when locking all and
// refused when named, since a named lesson is one the caller believes is
// reviewed. Any other error in a lesson being locked, and any error that
// belongs to no lesson (subjects, the lock file), refuses; errors in lessons
// that are not being locked do not.
export function planLock(input: {
  lock: { ids: readonly string[] };
  lessons: readonly CheckedLesson[];
  issues: readonly Issue[];
  only: readonly string[];
}): LockPlan {
  const { lock, lessons, issues, only } = input;
  const real = lockable(lessons);
  const errors: string[] = [];

  const unknown = only.filter((id) => !real.some((l) => l.lesson.id === id));
  for (const id of unknown) errors.push(`no valid lesson "${id}"`);

  const targets =
    only.length === 0 ? real : real.filter((l) => only.includes(l.lesson.id));
  const targetFiles = new Set(targets.map((l) => l.file));
  const knownFiles = new Set(lessons.map((l) => l.file));
  const stale = new Set<string>();
  for (const issue of issues.filter((i) => i.severity === "error")) {
    const inTarget = targetFiles.has(issue.file);
    const belongsToNoLesson = !knownFiles.has(issue.file);
    if (inTarget && issue.rule === "review-hash" && only.length === 0) {
      stale.add(issue.file);
    } else if (inTarget || belongsToNoLesson) {
      errors.push(formatIssue(issue));
    }
  }

  const locking = targets.filter((l) => !stale.has(l.file));
  const ids = new Set(lock.ids);
  for (const { lesson } of locking) {
    for (const { id } of declaredIds(lesson)) ids.add(id);
  }
  return {
    ids: [...ids].sort(),
    locked: locking.map((l) => l.lesson.id),
    skipped: targets.filter((l) => stale.has(l.file)).map((l) => l.lesson.id),
    errors,
  };
}
