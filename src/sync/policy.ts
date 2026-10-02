import type { TableName } from "@/progress/reset";
import type { DocKind } from "@/sync/schema";

// What sync does with each Dexie table. A table missing here fails the type
// check, so a new table cannot be left out of sync by accident (decide: is it
// part of a doc, or does it stay on this device?).
export type SyncPolicy =
  // Part of a synced doc.
  | { kind: "synced"; doc: DocKind; note?: string }
  // Stays on this device.
  | { kind: "local-only"; reason: string };

export const SYNC_POLICY: Record<TableName, SyncPolicy> = {
  profiles: { kind: "synced", doc: "profile" },
  cardStates: { kind: "synced", doc: "child" },
  sectionProgress: { kind: "synced", doc: "child" },
  stickers: { kind: "synced", doc: "child" },
  activityDays: { kind: "synced", doc: "child" },
  lessonResets: { kind: "synced", doc: "child", note: "the `resets` map" },
  settings: {
    kind: "synced",
    doc: "child",
    note: "only the `overviewSeen:*` keys; every other setting is per device",
  },
  attempts: { kind: "synced", doc: "history" },
  writings: { kind: "synced", doc: "history" },
  syncState: {
    kind: "local-only",
    reason: "What this device last sent; meaningless on another device.",
  },
};
