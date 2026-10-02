import { SYNC_MAX_RETRIES } from "@/lib/config";
import type { FailReason, PutCondition, SyncApi } from "@/sync/client";
import type { DocAdapter, FamilyRef } from "@/sync/docs";
import {
  canonicalText,
  type DocKind,
  type DocOf,
  migrateDoc,
} from "@/sync/schema";

// One doc's sync cycle, the same for the profile doc, a child's main doc and a
// month doc: read the cloud copy (a conditional GET when an etag is known),
// merge it with Dexie's, send the merge when it differs from the cloud copy,
// and write the result back to Dexie. A write that loses to another device
// (412) merges with the doc that answer carries and tries again.

export type CycleFailure =
  | FailReason
  // The write lost to another device in every round.
  | "conflict"
  // A month doc would have dropped a stored record, twice.
  | "shrink"
  // The cloud copy was written by a newer app: it is neither merged nor
  // written until this app is reloaded.
  | "too-new"
  // The cookie's family is not the one this device syncs.
  | "family-mismatch";

export type CycleResult =
  | {
      status: "synced";
      // The cloud copy carried something this device did not have.
      pulled: boolean;
    }
  | { status: "failed"; reason: CycleFailure };

export type CycleDeps = {
  api: SyncApi;
  family: FamilyRef;
  // Called with `serverTime` of every answer.
  onServerTime: (serverTime: string) => void;
  sleep: (ms: number) => Promise<void>;
  random: () => number;
};

const MIN_WAIT_MS = 100;
const MAX_WAIT_MS = 500;

const failed = (reason: CycleFailure): CycleResult => ({
  status: "failed",
  reason,
});

// The cloud copy: `etag` null means nothing is stored; a doc of null with an
// etag means "unchanged since this device last saw it" (it is already inside
// Dexie, so the merge has no use for it).
type Remote<K extends DocKind> = { doc: DocOf[K] | null; etag: string | null };

function read<K extends DocKind>(
  kind: K,
  raw: unknown,
): { ok: true; doc: DocOf[K] | null } | { ok: false; reason: CycleFailure } {
  if (raw === null || raw === undefined) return { ok: true, doc: null };
  const migrated = migrateDoc(kind, raw);
  if (migrated.ok) return { ok: true, doc: migrated.doc };
  return {
    ok: false,
    reason: migrated.reason === "too-new" ? "too-new" : "stored-invalid",
  };
}

export async function syncDoc<K extends DocKind>(
  deps: CycleDeps,
  adapter: DocAdapter<K>,
): Promise<CycleResult> {
  const { api, family } = deps;
  const kind = adapter.kind;
  const first = await api.get(adapter.target, await adapter.knownEtag());
  if (first.status === "fail") return failed(first.reason);
  deps.onServerTime(first.serverTime);

  let remote: Remote<K>;
  let pulled = false;
  if (first.status === "unchanged") {
    if (family.id === null) return failed("server");
    remote = { doc: null, etag: first.etag };
  } else {
    if (family.id !== null && family.id !== first.familyId) {
      return failed("family-mismatch");
    }
    family.id = first.familyId;
    const parsed = read(kind, first.doc);
    if (!parsed.ok) return failed(parsed.reason);
    remote = { doc: parsed.doc, etag: first.etag };
    pulled = parsed.doc !== null;
  }

  let shrunk = false;
  for (let round = 1; ; round++) {
    const local = await adapter.build();
    const merged =
      remote.doc === null ? local : adapter.merge(local, remote.doc);

    let condition: PutCondition;
    if (remote.etag === null) {
      if (adapter.isEmpty(merged)) {
        await adapter.settle(local, null, null);
        return { status: "synced", pulled };
      }
      condition = { ifNoneMatch: "*" };
    } else if (remote.doc === null) {
      if (!(await adapter.isDirty(local))) return { status: "synced", pulled };
      condition = { ifMatch: remote.etag };
    } else {
      const text = canonicalText(kind, merged);
      if (text === canonicalText(kind, remote.doc)) {
        // The cloud copy already holds everything: nothing to send.
        if (text !== canonicalText(kind, local)) await adapter.apply(merged);
        await adapter.settle(local, remote.doc, remote.etag);
        return { status: "synced", pulled };
      }
      condition = { ifMatch: remote.etag };
    }

    const answer = await api.put(adapter.target, merged, condition);
    if (answer.status === "fail") return failed(answer.reason);
    if (answer.status === "stored") {
      deps.onServerTime(answer.serverTime);
      let stored = merged;
      if (answer.doc !== undefined) {
        // The server changed a time: Dexie takes what was stored.
        const parsed = read(kind, answer.doc);
        if (!parsed.ok || parsed.doc === null) return failed("stored-invalid");
        stored = parsed.doc;
        await adapter.overwrite(merged, stored);
      }
      await adapter.apply(stored);
      await adapter.settle(local, stored, answer.etag);
      return { status: "synced", pulled };
    }

    // Someone else wrote first (or a month would shrink): merge with what is
    // stored now and go again.
    if (answer.status === "shrink") {
      if (shrunk) return failed("shrink");
      shrunk = true;
    } else if (round >= SYNC_MAX_RETRIES) {
      return failed("conflict");
    }
    const parsed = read(kind, answer.doc);
    if (!parsed.ok) return failed(parsed.reason);
    remote = { doc: parsed.doc, etag: answer.etag };
    pulled = pulled || parsed.doc !== null;
    if (answer.status === "conflict") {
      await deps.sleep(
        MIN_WAIT_MS + Math.floor(deps.random() * (MAX_WAIT_MS - MIN_WAIT_MS)),
      );
    }
  }
}
