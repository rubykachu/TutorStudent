import { LOCAL_FAMILY_ID } from "@/lib/config";
import {
  listOverviewSeenAt,
  listProfiles,
  localScope,
  type TutorDb,
} from "@/progress/db";
import { readParentData } from "@/progress/parent-data";
import { localMonths } from "@/sync/local-history";
import {
  type ChildDoc,
  emptyChildDoc,
  emptyProfileDoc,
  type ProfileDoc,
} from "@/sync/schema";

// Conversion between the local Dexie records of a child (or of the family's
// profiles) and the synced docs. Local records stay under the "local" family
// id; the doc carries the real one in its header.

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
  const [data, seenAt, resets, months, state] = await Promise.all([
    readParentData(db, scope),
    listOverviewSeenAt(db, scope),
    db.lessonResets
      .where("[familyId+childId+lessonId]")
      .between(
        [scope.familyId, scope.childId, ""],
        [scope.familyId, scope.childId, "￿"],
      )
      .toArray(),
    localMonths(db, childId),
    db.syncState.get([scope.familyId, scope.childId]),
  ]);
  const doc = emptyChildDoc(familyId, childId);
  doc.cards = data.cardStates.map((c) => ({
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
  doc.sections = data.sections.map((s) => ({
    sectionId: s.sectionId,
    lessonId: s.lessonId,
    doneAt: s.doneAt,
    position: { phase: s.position.phase, index: s.position.index },
    updatedAt: s.updatedAt,
  }));
  doc.stickers = data.stickers.map((s) => ({ lessonId: s.lessonId, at: s.at }));
  doc.activityDays = [...data.activityDays];
  doc.historyMonths = [
    ...new Set([...months, ...Object.keys(state?.months ?? {})]),
  ].sort();
  doc.overviewSeen = seenAt;
  doc.resets = Object.fromEntries(resets.map((r) => [r.lessonId, r.at]));
  return doc;
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
