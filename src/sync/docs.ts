import type { TutorDb } from "@/progress/db";
import { monthParts } from "@/sync/dirty";
import { docHash } from "@/sync/hash";
import { visibleHistory } from "@/sync/history";
import {
  applyChildDoc,
  applyProfileDoc,
  listResets,
  readChildDoc,
  readProfileDoc,
} from "@/sync/local";
import { applyHistoryDoc, readHistoryDoc } from "@/sync/local-history";
import {
  mergeChildDocs,
  mergeHistoryDocs,
  mergeProfileDocs,
} from "@/sync/merge";
import { overwriteClamped } from "@/sync/overwrite";
import {
  type ChildDoc,
  canonicalText,
  type DocKind,
  type DocOf,
  type HistoryDoc,
  type ProfileDoc,
} from "@/sync/schema";
import type { SyncTarget } from "@/sync/server";
import {
  childStateScope,
  PENDING_MONTH,
  profileStateScope,
  readSyncState,
  updateSyncState,
} from "@/sync/state";

// What the sync cycle needs to know about each kind of doc: how to build it
// from Dexie, merge two copies, write a result back, tell whether it holds
// unsent changes and remember what was sent. One adapter per doc, so the cycle
// itself is the same for the profile doc, a main doc and a month doc.

export type DocAdapter<K extends DocKind> = {
  kind: K;
  target: SyncTarget;
  // The etag of the cloud copy this device last sent or applied.
  knownEtag(): Promise<string | null>;
  // The doc as Dexie holds it now.
  build(): Promise<DocOf[K]>;
  merge(local: DocOf[K], remote: DocOf[K]): DocOf[K];
  // A doc with nothing in it is never created in the cloud.
  isEmpty(doc: DocOf[K]): boolean;
  // Whether `local` holds changes not sent yet.
  isDirty(local: DocOf[K]): Promise<boolean>;
  // Writes a merge result back to Dexie.
  apply(doc: DocOf[K]): Promise<void>;
  // Writes the server's clamped version of what was sent over the local
  // records it changed.
  overwrite(sent: DocOf[K], stored: DocOf[K]): Promise<void>;
  // Remembers that the cloud holds `stored` under `etag` and Dexie has it.
  // `stored` is null for an empty doc that was not created (nothing in the
  // cloud); `local` is then what was found empty.
  settle(
    local: DocOf[K],
    stored: DocOf[K] | null,
    etag: string | null,
  ): Promise<void>;
};

// The family a doc is built for: unknown until the first answer names it.
export type FamilyRef = { id: string | null };

function familyOf(family: FamilyRef): string {
  if (family.id === null) throw new Error("Sync family is not known yet");
  return family.id;
}

const byteLength = (text: string) => new TextEncoder().encode(text).length;

export function profileAdapter(
  db: TutorDb,
  family: FamilyRef,
): DocAdapter<"profile"> {
  return {
    kind: "profile",
    target: { kind: "profile" },
    knownEtag: async () => (await readSyncState(db, profileStateScope)).etag,
    build: () => readProfileDoc(db, familyOf(family)),
    merge: mergeProfileDocs,
    isEmpty: (doc: ProfileDoc) => doc.profiles.length === 0,
    isDirty: async (local) =>
      (await readSyncState(db, profileStateScope)).syncedHash !==
      docHash("profile", local),
    apply: (doc) => applyProfileDoc(db, doc),
    overwrite: (sent, stored) => overwriteClamped(db, "profile", sent, stored),
    settle: (local, stored, etag) =>
      updateSyncState(db, profileStateScope, (state) => ({
        ...state,
        syncedHash: docHash("profile", stored ?? local),
        etag,
        docBytes:
          stored === null ? null : byteLength(canonicalText("profile", stored)),
      })),
  };
}

export function childAdapter(
  db: TutorDb,
  family: FamilyRef,
  childId: string,
): DocAdapter<"child"> {
  const scope = childStateScope(childId);
  return {
    kind: "child",
    target: { kind: "child", childId },
    knownEtag: async () => (await readSyncState(db, scope)).etag,
    build: () => readChildDoc(db, childId, familyOf(family)),
    merge: mergeChildDocs,
    isEmpty: (doc: ChildDoc) =>
      doc.cards.length === 0 &&
      doc.sections.length === 0 &&
      doc.stickers.length === 0 &&
      doc.activityDays.length === 0 &&
      Object.keys(doc.overviewSeen).length === 0 &&
      Object.keys(doc.resets).length === 0,
    isDirty: async (local) =>
      (await readSyncState(db, scope)).syncedHash !== docHash("child", local),
    apply: (doc) => applyChildDoc(db, doc),
    overwrite: (sent, stored) => overwriteClamped(db, "child", sent, stored),
    // The months the cloud lists become months to pull; listing them in the
    // state also keeps them in the doc this device builds next time, so the
    // hash of what was sent stays equal to the hash of what Dexie yields.
    settle: (local, stored, etag) =>
      updateSyncState(db, scope, (state) => {
        const months = { ...state.months };
        for (const month of stored?.historyMonths ?? []) {
          months[month] ??= PENDING_MONTH;
        }
        return {
          ...state,
          months,
          syncedHash: docHash("child", stored ?? local),
          etag,
          docBytes:
            stored === null ? null : byteLength(canonicalText("child", stored)),
        };
      }),
  };
}

export function monthAdapter(
  db: TutorDb,
  family: FamilyRef,
  childId: string,
  month: string,
): DocAdapter<"history"> {
  const scope = childStateScope(childId);
  const resets = async () =>
    Object.fromEntries(
      (await listResets(db, childId)).map((r) => [r.lessonId, r.at]),
    );
  return {
    kind: "history",
    target: { kind: "history", childId, month },
    knownEtag: async () =>
      (await readSyncState(db, scope)).months[month]?.etag ?? null,
    build: () => readHistoryDoc(db, childId, familyOf(family), month),
    merge: mergeHistoryDocs,
    isEmpty: (doc: HistoryDoc) =>
      doc.attempts.length === 0 && doc.writings.length === 0,
    // A month is compared lesson by lesson, so a lesson erased by a reset
    // (its part is missing) is nothing to send.
    isDirty: async (local) => {
      const sent = (await readSyncState(db, scope)).months[month]?.parts ?? {};
      return Object.entries(monthParts(local)).some(
        ([lessonId, part]) => sent[lessonId] !== part,
      );
    },
    apply: async (doc) => applyHistoryDoc(db, doc, await resets()),
    overwrite: (sent, stored) => overwriteClamped(db, "history", sent, stored),
    // Nothing is recorded for a month that is empty on both sides: it is not
    // a month that exists.
    settle: async (_local, stored, etag) => {
      if (stored === null) return;
      // The parts of what Dexie keeps of this month: the records no reset
      // hides, so a later write shows as a part that differs.
      const parts = monthParts(visibleHistory(stored, await resets()));
      await updateSyncState(db, scope, (state) => ({
        ...state,
        months: {
          ...state.months,
          [month]: {
            hash: docHash("history", stored),
            parts,
            etag,
            applied: true,
          },
        },
      }));
    },
  };
}
