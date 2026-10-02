import { LOCAL_FAMILY_ID } from "@/lib/config";
import {
  listActivityDays,
  listCardStates,
  listOverviewSeenAt,
  listProfiles,
  listSectionProgress,
  listStickers,
  localScope,
  OVERVIEW_SEEN_PREFIX,
  type ProfileRecord,
  type TutorDb,
} from "@/progress/db";
import { eraseHistoryBeforeResets, localMonths } from "@/sync/local-history";
import { mergeChildDocs, mergeProfileDocs } from "@/sync/merge";
import {
  type ChildDoc,
  emptyChildDoc,
  emptyProfileDoc,
  type ProfileDoc,
} from "@/sync/schema";

// Conversion between the local Dexie records of a child (or of the family's
// profiles) and the synced docs. Local records stay under the "local" family
// id; a doc carries the real one in its header.

// The tables one child's main doc is built from and applied to.
function childTables(db: TutorDb) {
  return [
    db.cardStates,
    db.sectionProgress,
    db.stickers,
    db.activityDays,
    db.settings,
    db.lessonResets,
    db.attempts,
    db.writings,
    db.syncState,
  ];
}

// The child's reset markers, one per lesson.
export function listResets(db: TutorDb, childId: string) {
  const { familyId } = localScope(childId);
  return db.lessonResets
    .where("[familyId+childId+lessonId]")
    .between([familyId, childId, ""], [familyId, childId, "￿"])
    .toArray();
}

// The main doc of one child, built from Dexie. `historyMonths` lists the
// months this device holds records in plus the months it learned of from the
// cloud (kept in the sync state), so a month a reset emptied locally stays
// listed.
export async function readChildDoc(
  db: TutorDb,
  childId: string,
  familyId: string,
): Promise<ChildDoc> {
  const scope = localScope(childId);
  const [cards, sections, stickers, days, seenAt, resets, months, state] =
    await Promise.all([
      listCardStates(db, scope),
      listSectionProgress(db, scope),
      listStickers(db, scope),
      listActivityDays(db, scope),
      listOverviewSeenAt(db, scope),
      listResets(db, childId),
      localMonths(db, childId),
      db.syncState.get([scope.familyId, scope.childId]),
    ]);
  const doc = emptyChildDoc(familyId, childId);
  doc.cards = cards.map((c) => ({
    cardId: c.cardId,
    lessonId: c.lessonId,
    due: c.due,
    stability: c.stability,
    difficulty: c.difficulty,
    scheduledDays: c.scheduledDays,
    learningSteps: c.learningSteps,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state,
    lastReviewAt: c.lastReviewAt,
  }));
  doc.sections = sections.map((s) => ({
    sectionId: s.sectionId,
    lessonId: s.lessonId,
    doneAt: s.doneAt,
    position: { phase: s.position.phase, index: s.position.index },
    updatedAt: s.updatedAt,
  }));
  doc.stickers = stickers.map((s) => ({ lessonId: s.lessonId, at: s.at }));
  doc.activityDays = days;
  doc.historyMonths = [
    ...new Set([...months, ...Object.keys(state?.months ?? {})]),
  ].sort();
  doc.overviewSeen = seenAt;
  doc.resets = Object.fromEntries(resets.map((r) => [r.lessonId, r.at]));
  return doc;
}

// Applies a main doc (usually the result of a merge) to Dexie, in one
// transaction. Inside it the child's current records are read again and merged
// once more with `doc`: the child may have answered while the request was in
// flight, and writing the earlier merge would overwrite that answer's card
// state or section position. The merge is idempotent, so this is safe. Records
// a reset drops are deleted; nothing else is.
export async function applyChildDoc(db: TutorDb, doc: ChildDoc): Promise<void> {
  const scope = localScope(doc.childId);
  const key = (last: string): [string, string, string] => [
    scope.familyId,
    scope.childId,
    last,
  ];
  await db.transaction("rw", childTables(db), async () => {
    const local = await readChildDoc(db, doc.childId, doc.familyId);
    const merged = mergeChildDocs(local, doc);

    const keptCards = new Set(merged.cards.map((c) => c.cardId));
    await db.cardStates.bulkDelete(
      local.cards
        .filter((c) => !keptCards.has(c.cardId))
        .map((c) => key(c.cardId)),
    );
    await db.cardStates.bulkPut(merged.cards.map((c) => ({ ...scope, ...c })));

    const keptSections = new Set(merged.sections.map((s) => s.sectionId));
    await db.sectionProgress.bulkDelete(
      local.sections
        .filter((s) => !keptSections.has(s.sectionId))
        .map((s) => key(s.sectionId)),
    );
    await db.sectionProgress.bulkPut(
      merged.sections.map((s) => ({
        ...scope,
        ...s,
        state: s.doneAt === null ? "in_progress" : "done",
      })),
    );

    await db.stickers.bulkPut(merged.stickers.map((s) => ({ ...scope, ...s })));
    await db.activityDays.bulkPut(
      merged.activityDays.map((day) => ({ ...scope, day })),
    );

    await db.settings.bulkDelete(
      Object.keys(local.overviewSeen)
        .filter((lessonId) => !(lessonId in merged.overviewSeen))
        .map((lessonId) => key(`${OVERVIEW_SEEN_PREFIX}${lessonId}`)),
    );
    await db.settings.bulkPut(
      Object.entries(merged.overviewSeen).map(([lessonId, at]) => ({
        ...scope,
        key: `${OVERVIEW_SEEN_PREFIX}${lessonId}`,
        value: at,
      })),
    );

    await db.lessonResets.bulkPut(
      Object.entries(merged.resets).map(([lessonId, at]) => ({
        ...scope,
        lessonId,
        at,
      })),
    );
    await eraseHistoryBeforeResets(db, doc.childId, merged.resets);
  });
}

export async function readProfileDoc(
  db: TutorDb,
  familyId: string,
): Promise<ProfileDoc> {
  const doc = emptyProfileDoc(familyId);
  doc.profiles = (await listProfiles(db, LOCAL_FAMILY_ID)).map((p) => ({
    id: p.id,
    name: p.name,
    avatar: p.avatar,
    grade: p.grade,
    series: { ...p.series },
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));
  return doc;
}

// Merges the family's profile doc into the local profiles and writes the
// result; no profile is ever deleted.
export async function applyProfileDoc(
  db: TutorDb,
  doc: ProfileDoc,
): Promise<void> {
  await db.transaction("rw", db.profiles, async () => {
    const merged = mergeProfileDocs(
      await readProfileDoc(db, doc.familyId),
      doc,
    );
    await db.profiles.bulkPut(
      merged.profiles.map(
        (p): ProfileRecord => ({ ...p, familyId: LOCAL_FAMILY_ID }),
      ),
    );
  });
}
