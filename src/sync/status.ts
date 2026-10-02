import {
  LOCAL_FAMILY_ID,
  SYNC_DOC_MAX_BYTES,
  SYNC_DOC_WARN_RATIO,
} from "@/lib/config";
import {
  FAMILY_DOC_STATE_SCOPE,
  listProfiles,
  type TutorDb,
} from "@/progress/db";
import { dirtyDocs, dirtyProfileDoc } from "@/sync/dirty";
import { localMonths } from "@/sync/local-history";
import { childStateScope, readSyncFamily } from "@/sync/state";

// What the parent page tells about sync on this device: when everything was
// last in step, what is stuck and why. Read from the bookkeeping `syncState`
// keeps and from the docs Dexie would send; nothing here talks to the network.

export type ChildSyncStatus = {
  childId: string;
  name: string;
  lastSyncAt: string | null;
  lastError: string | null;
  // Size of the child's main doc as last sent or applied.
  docBytes: number | null;
  // The child has records not sent yet.
  unsent: boolean;
};

export type DeviceSyncStatus = {
  // The family this device syncs with; null before the first sync.
  familyId: string | null;
  // How the last sync of the family's profile doc ended.
  profileError: string | null;
  // The oldest of the last successful syncs of each doc group: the last time
  // everything on this device was in step with the cloud. Null if none yet.
  lastSyncAt: string | null;
  // The profile doc has changes not sent yet.
  profileUnsent: boolean;
  children: ChildSyncStatus[];
};

// A device that has never talked to a sync-enabled server has nothing to
// report (sync off, or not reached yet): null.
export async function readSyncStatus(
  db: TutorDb,
): Promise<DeviceSyncStatus | null> {
  const familyId = await readSyncFamily(db);
  const profileState = await db.syncState.get([
    FAMILY_DOC_STATE_SCOPE.familyId,
    FAMILY_DOC_STATE_SCOPE.childId,
  ]);
  if (familyId === null && !profileState?.lastError) return null;

  const profiles = await listProfiles(db, LOCAL_FAMILY_ID);
  const children: ChildSyncStatus[] = [];
  for (const profile of profiles) {
    const scope = childStateScope(profile.id);
    const state = await db.syncState.get([scope.familyId, scope.childId]);
    let unsent = false;
    if (familyId !== null) {
      const report = await dirtyDocs(
        db,
        familyId,
        profile.id,
        await localMonths(db, profile.id),
      );
      unsent = report.main.dirty || report.months.some((m) => m.dirty);
    }
    children.push({
      childId: profile.id,
      name: profile.name,
      lastSyncAt: state?.lastSyncAt ?? null,
      lastError: state?.lastError ?? null,
      docBytes: state?.docBytes ?? null,
      unsent,
    });
  }

  const times = [
    profileState?.lastSyncAt ?? null,
    ...children.map((c) => c.lastSyncAt),
  ].filter((t): t is string => t !== null);
  return {
    familyId,
    profileError: profileState?.lastError ?? null,
    lastSyncAt:
      times.length === 0 ? null : times.reduce((a, b) => (a < b ? a : b)),
    profileUnsent:
      familyId !== null && (await dirtyProfileDoc(db, familyId)).dirty,
    children,
  };
}

// The cookie belongs to another family than the one this device syncs.
export function isFamilyMismatch(status: DeviceSyncStatus): boolean {
  return status.profileError === "family-mismatch";
}

// Whether any record on this device has not been sent to the family it syncs
// with: what switching families would lose.
export function hasUnsentWork(status: DeviceSyncStatus): boolean {
  return status.profileUnsent || status.children.some((c) => c.unsent);
}

export type SyncMessage = {
  // Stable key; also the `data-sync-message` attribute.
  id: "stale" | "unauthorized" | "app-too-old" | "too-large" | "near-limit";
  text: string;
};

const DAY_MS = 86_400_000;

// The plain messages for what is stuck, in the order a parent should act.
// The family-switch case is separate (`isFamilyMismatch`).
export function syncMessages(
  status: DeviceSyncStatus,
  now: Date,
): SyncMessage[] {
  const messages: SyncMessage[] = [];
  const errors = [
    status.profileError,
    ...status.children.map((c) => c.lastError),
  ];
  if (errors.includes("unauthorized")) {
    messages.push({
      id: "unauthorized",
      text: "Mã gia đình trên máy này không còn dùng được, nên tiến độ chưa được lưu lên. Con vẫn học bình thường. Bạn nhập lại mã nhé.",
    });
  }
  if (errors.some((e) => e === "upgrade-required" || e === "too-new")) {
    messages.push({
      id: "app-too-old",
      text: "App trên máy này cũ hơn bản đang lưu tiến độ, nên một phần tiến độ chưa gửi được. Bạn đóng app rồi mở lại để cập nhật.",
    });
  }
  for (const child of status.children) {
    if (child.lastError === "too-large") {
      messages.push({
        id: "too-large",
        text: `Dữ liệu của ${child.name} đã quá lớn nên chưa gửi lên được. Bạn tải bản sao lưu để giữ lại.`,
      });
    }
  }
  for (const child of status.children) {
    if (
      child.docBytes !== null &&
      child.docBytes >= SYNC_DOC_MAX_BYTES * SYNC_DOC_WARN_RATIO
    ) {
      const percent = Math.round((child.docBytes / SYNC_DOC_MAX_BYTES) * 100);
      messages.push({
        id: "near-limit",
        text: `Dữ liệu của ${child.name} đã dùng ${percent}% chỗ cho phép khi đồng bộ. Bạn tải bản sao lưu để giữ lại.`,
      });
    }
  }
  const sentAt =
    status.lastSyncAt === null ? null : Date.parse(status.lastSyncAt);
  if (
    (status.profileUnsent || status.children.some((c) => c.unsent)) &&
    (sentAt === null || now.getTime() - sentAt > DAY_MS)
  ) {
    messages.push({
      id: "stale",
      text: "Tiến độ trên máy này chưa được gửi đi hơn 1 ngày. Bạn kiểm tra mạng nhé. Con vẫn học bình thường.",
    });
  }
  return messages;
}
