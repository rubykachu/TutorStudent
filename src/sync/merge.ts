import { SECTION_START } from "@/progress/db";
import {
  type ChildDoc,
  canonicalDoc,
  type HistoryDoc,
  type ProfileDoc,
  type SyncCard,
  type SyncProfile,
  type SyncSection,
  type SyncSticker,
  stableStringify,
} from "@/sync/schema";

// Pure merges of two copies of a synced doc. Each is commutative, associative
// and idempotent (on a doc that holds no record a reset of its own already
// dropped), so devices converge whatever order their copies meet in, and
// merging a doc with itself or with an older copy of itself changes nothing.
// The result is in canonical form, so two merges are equal when their
// canonical texts are. Times are fixed-format ISO strings (see `schema.ts`):
// comparing them as text compares them in time. The server never merges.

function later(a: string, b: string): string {
  return a >= b ? a : b;
}

// A tie between two records of equal rank is settled by their canonical text,
// so both argument orders pick the same one.
function byText(a: unknown, b: unknown): number {
  const x = stableStringify(a);
  const y = stableStringify(b);
  return x < y ? -1 : x > y ? 1 : 0;
}

// Keeps one record per key; `wins(candidate, kept)` is true when the
// candidate replaces the kept one. The result does not depend on input order
// as long as `wins` is a strict total order on the records of one key.
function pickPerKey<T>(
  records: readonly T[],
  key: (record: T) => string,
  wins: (candidate: T, kept: T) => boolean,
): T[] {
  const kept = new Map<string, T>();
  for (const record of records) {
    const current = kept.get(key(record));
    if (current === undefined || wins(record, current)) {
      kept.set(key(record), record);
    }
  }
  return [...kept.values()];
}

function unionSorted(...lists: readonly (readonly string[])[]): string[] {
  return [...new Set(lists.flat())].sort();
}

// ---------------------------------------------------------------------------
// Main child doc

// A record is dropped when its lesson was reset at or after its time.
function survivesReset(
  resets: Readonly<Record<string, string>>,
  lessonId: string,
  time: string,
): boolean {
  const resetAt = resets[lessonId];
  return resetAt === undefined || time > resetAt;
}

// A completion rewinds the section, so a section can never be "done" later
// than its position was saved. Docs written by this app keep that; a doc that
// does not is lifted to it, which keeps the two fields of a section ordered
// by time alone.
function normalizeSection(section: SyncSection): SyncSection {
  if (section.doneAt !== null && section.updatedAt < section.doneAt) {
    return { ...section, position: SECTION_START, updatedAt: section.doneAt };
  }
  return section;
}

// A section keeps its two facts separately: `doneAt` and `position` each
// survive or fall on their own time, so a completion before a reset is
// dropped while a position saved after it stays.
function settleSections(
  sections: readonly SyncSection[],
  resets: Readonly<Record<string, string>>,
): SyncSection[] {
  const settled: SyncSection[] = [];
  for (const raw of sections) {
    const section = normalizeSection(raw);
    const doneAt =
      section.doneAt !== null &&
      survivesReset(resets, section.lessonId, section.doneAt)
        ? section.doneAt
        : null;
    // `updatedAt >= doneAt`, so a surviving completion keeps its position.
    if (!survivesReset(resets, section.lessonId, section.updatedAt)) continue;
    settled.push({ ...section, doneAt });
  }
  return settled;
}

function mergeSections(sections: readonly SyncSection[]): SyncSection[] {
  const doneAt = new Map<string, string>();
  for (const section of sections) {
    if (section.doneAt !== null) {
      const known = doneAt.get(section.sectionId);
      doneAt.set(
        section.sectionId,
        known === undefined ? section.doneAt : later(known, section.doneAt),
      );
    }
  }
  return pickPerKey(
    sections,
    (s) => s.sectionId,
    (candidate, kept) =>
      candidate.updatedAt !== kept.updatedAt
        ? candidate.updatedAt > kept.updatedAt
        : byText(candidate.position, kept.position) > 0,
  ).map((section) => ({
    ...section,
    doneAt: doneAt.get(section.sectionId) ?? null,
  }));
}

function cardWins(candidate: SyncCard, kept: SyncCard): boolean {
  if (candidate.lastReviewAt !== kept.lastReviewAt) {
    return candidate.lastReviewAt > kept.lastReviewAt;
  }
  if (candidate.reps !== kept.reps) return candidate.reps > kept.reps;
  return byText(candidate, kept) > 0;
}

function earliestSticker(candidate: SyncSticker, kept: SyncSticker): boolean {
  return candidate.at !== kept.at
    ? candidate.at < kept.at
    : byText(candidate, kept) > 0;
}

function laterPerKey(
  ...maps: readonly Readonly<Record<string, string>>[]
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const map of maps) {
    for (const [key, time] of Object.entries(map)) {
      const known = result[key];
      result[key] = known === undefined ? time : later(known, time);
    }
  }
  return result;
}

// The rule table of the sync spec. Resets are applied to each side first
// (`resets` of the result is the later time per lesson), then every field is
// merged by "the later time wins", never by "keep the furthest state": that
// is what makes the result independent of merge order.
export function mergeChildDocs(a: ChildDoc, b: ChildDoc): ChildDoc {
  if (a.familyId !== b.familyId || a.childId !== b.childId) {
    throw new Error("Cannot merge docs of different children");
  }
  const resets = laterPerKey(a.resets, b.resets);
  const sides = [a, b];
  const overviewSeen = laterPerKey(
    ...sides.map((side) =>
      Object.fromEntries(
        Object.entries(side.overviewSeen).filter(([lessonId, time]) =>
          survivesReset(resets, lessonId, time),
        ),
      ),
    ),
  );
  return canonicalDoc("child", {
    ...a,
    cards: pickPerKey(
      sides
        .flatMap((side) => side.cards)
        .filter((card) =>
          survivesReset(resets, card.lessonId, card.lastReviewAt),
        ),
      (card) => card.cardId,
      cardWins,
    ),
    sections: mergeSections(
      sides.flatMap((side) => settleSections(side.sections, resets)),
    ),
    stickers: pickPerKey(
      sides.flatMap((side) => side.stickers),
      (sticker) => sticker.lessonId,
      earliestSticker,
    ),
    activityDays: unionSorted(a.activityDays, b.activityDays),
    historyMonths: unionSorted(a.historyMonths, b.historyMonths),
    overviewSeen,
    resets,
  });
}

// ---------------------------------------------------------------------------
// Family profile doc

function profileWins(candidate: SyncProfile, kept: SyncProfile): boolean {
  return candidate.updatedAt !== kept.updatedAt
    ? candidate.updatedAt > kept.updatedAt
    : byText(candidate, kept) > 0;
}

// Union by profile id; for the same id the later `updatedAt` wins.
export function mergeProfileDocs(a: ProfileDoc, b: ProfileDoc): ProfileDoc {
  if (a.familyId !== b.familyId) {
    throw new Error("Cannot merge docs of different families");
  }
  return canonicalDoc("profile", {
    ...a,
    profiles: pickPerKey(
      [...a.profiles, ...b.profiles],
      (profile) => profile.id,
      profileWins,
    ),
  });
}

// ---------------------------------------------------------------------------
// History doc of one month

// A plain union by record id. A reset never removes anything here: its
// tombstone hides records when history is read (`visibleHistory`), so an old
// month is never rewritten and nothing is lost to a merge order.
export function mergeHistoryDocs(a: HistoryDoc, b: HistoryDoc): HistoryDoc {
  if (
    a.familyId !== b.familyId ||
    a.childId !== b.childId ||
    a.month !== b.month
  ) {
    throw new Error("Cannot merge history of different children or months");
  }
  const newer = <T>(candidate: T, kept: T) => byText(candidate, kept) > 0;
  return canonicalDoc("history", {
    ...a,
    attempts: pickPerKey(
      [...a.attempts, ...b.attempts],
      (attempt) => attempt.id,
      newer,
    ),
    writings: pickPerKey(
      [...a.writings, ...b.writings],
      (writing) => writing.id,
      newer,
    ),
  });
}
