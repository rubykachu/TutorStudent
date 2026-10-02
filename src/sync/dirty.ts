import {
  FAMILY_DOC_STATE_SCOPE,
  localScope,
  type TutorDb,
} from "@/progress/db";
import { lessonIdOfContentId } from "@/progress/parent-report";
import { docHash, hashText } from "@/sync/hash";
import { readChildDoc, readProfileDoc } from "@/sync/local";
import { readHistoryDoc } from "@/sync/local-history";
import {
  type ChildDoc,
  type HistoryDoc,
  type ProfileDoc,
  stableStringify,
} from "@/sync/schema";

// Finding out what changed since the last sync without any write hook: build
// the doc from Dexie, hash its canonical form and compare with the hash kept
// in `syncState` when the doc was last sent or applied. Reading one child's
// records takes milliseconds, so this runs on every trigger.

// A month doc is compared lesson by lesson: its records of each lesson are
// hashed apart. A lesson erased by a reset leaves its part missing from the
// local doc, which is nothing to send; a lesson with new or changed records
// has a part that differs.
export function monthParts(doc: HistoryDoc): Record<string, string> {
  const groups = new Map<
    string,
    { attempts: unknown[]; writings: unknown[] }
  >();
  const group = (lessonId: string) => {
    let entry = groups.get(lessonId);
    if (!entry) {
      entry = { attempts: [], writings: [] };
      groups.set(lessonId, entry);
    }
    return entry;
  };
  for (const attempt of doc.attempts)
    group(attempt.lessonId).attempts.push(attempt);
  for (const writing of doc.writings) {
    group(lessonIdOfContentId(writing.exerciseId)).writings.push(writing);
  }
  const parts: Record<string, string> = {};
  for (const [lessonId, entry] of groups) {
    const byId = (a: unknown, b: unknown) =>
      (a as { id: string }).id < (b as { id: string }).id ? -1 : 1;
    parts[lessonId] = hashText(
      stableStringify({
        attempts: entry.attempts.sort(byId),
        writings: entry.writings.sort(byId),
      }),
    );
  }
  return parts;
}

export type MainDocState = { doc: ChildDoc; hash: string; dirty: boolean };
export type MonthDocState = {
  month: string;
  doc: HistoryDoc;
  hash: string;
  parts: Record<string, string>;
  dirty: boolean;
};

export type DirtyReport = { main: MainDocState; months: MonthDocState[] };

// Builds the child's main doc and the month docs asked for (oldest first) and
// says which of them hold changes not sent yet. `months` is `recentMonths` for
// a routine check, or `localMonths` at app start and after an import.
export async function dirtyDocs(
  db: TutorDb,
  familyId: string,
  childId: string,
  months: readonly string[],
): Promise<DirtyReport> {
  const scope = localScope(childId);
  const state = await db.syncState.get([scope.familyId, scope.childId]);
  const doc = await readChildDoc(db, childId, familyId);
  const hash = docHash("child", doc);
  const report: DirtyReport = {
    main: { doc, hash, dirty: state?.syncedHash !== hash },
    months: [],
  };
  for (const month of [...new Set(months)].sort()) {
    const monthDoc = await readHistoryDoc(db, childId, familyId, month);
    const parts = monthParts(monthDoc);
    const sent = state?.months[month]?.parts ?? {};
    report.months.push({
      month,
      doc: monthDoc,
      hash: docHash("history", monthDoc),
      parts,
      dirty: Object.entries(parts).some(
        ([lessonId, part]) => sent[lessonId] !== part,
      ),
    });
  }
  return report;
}

export type ProfileDocState = { doc: ProfileDoc; hash: string; dirty: boolean };

// The family's profile doc, built from Dexie, and whether it differs from
// what was last sent.
export async function dirtyProfileDoc(
  db: TutorDb,
  familyId: string,
): Promise<ProfileDocState> {
  const state = await db.syncState.get([
    FAMILY_DOC_STATE_SCOPE.familyId,
    FAMILY_DOC_STATE_SCOPE.childId,
  ]);
  const doc = await readProfileDoc(db, familyId);
  const hash = docHash("profile", doc);
  return { doc, hash, dirty: state?.syncedHash !== hash };
}
