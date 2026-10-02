import {
  type ChildScope,
  DEVICE_SCOPE,
  FAMILY_DOC_STATE_SCOPE,
  getSetting,
  localScope,
  type SyncMonthState,
  type SyncStateRecord,
  setSetting,
  type TutorDb,
} from "@/progress/db";

// Reading and writing what sync last did on this device (`syncState`) and
// which family this device's local records belong to. Bookkeeping of this
// device only; never synced.

// Device setting: the family whose docs this device syncs, set at the first
// successful sync.
export const SYNC_FAMILY_KEY = "syncFamilyId";

export function childStateScope(childId: string): ChildScope {
  return localScope(childId);
}

export const profileStateScope: ChildScope = FAMILY_DOC_STATE_SCOPE;

export function emptySyncState(scope: ChildScope): SyncStateRecord {
  return {
    ...scope,
    syncedHash: null,
    etag: null,
    lastSyncAt: null,
    lastError: null,
    docBytes: null,
    months: {},
  };
}

export async function readSyncState(
  db: TutorDb,
  scope: ChildScope,
): Promise<SyncStateRecord> {
  return (
    (await db.syncState.get([scope.familyId, scope.childId])) ??
    emptySyncState(scope)
  );
}

// Reads the state, lets `change` return the new one and writes it, all in one
// transaction so two updates never overwrite each other's fields.
export async function updateSyncState(
  db: TutorDb,
  scope: ChildScope,
  change: (state: SyncStateRecord) => SyncStateRecord,
): Promise<void> {
  await db.transaction("rw", db.syncState, async () => {
    await db.syncState.put(change(await readSyncState(db, scope)));
  });
}

// A month this device knows exists in the cloud but has not pulled yet.
export const PENDING_MONTH: SyncMonthState = {
  hash: null,
  parts: {},
  etag: null,
  applied: false,
};

export async function readSyncFamily(db: TutorDb): Promise<string | null> {
  const stored = await getSetting(db, DEVICE_SCOPE, SYNC_FAMILY_KEY);
  return typeof stored === "string" && stored !== "" ? stored : null;
}

export async function writeSyncFamily(
  db: TutorDb,
  familyId: string,
): Promise<void> {
  await setSetting(db, DEVICE_SCOPE, SYNC_FAMILY_KEY, familyId);
}
