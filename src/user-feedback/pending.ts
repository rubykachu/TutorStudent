import { FEEDBACK_PENDING_MAX, SYNC_MAX_RETRIES } from "@/lib/config";
import { type SyncPrefix, syncKey } from "@/sync/store/keys";
import type { BlobStore } from "@/sync/store/types";
import {
  type PendingItem,
  type PendingList,
  PendingListSchema,
} from "./schema";

// `feedback/pending.json`: the ids of stored reports not yet on GitHub, oldest
// first. Changed only with conditional writes, retried a few rounds on a
// conflict like a sync cycle. Adding a listed id or removing an unlisted one
// changes nothing. A store error is thrown to the caller.

const pendingKey = (prefix: SyncPrefix) =>
  syncKey(prefix, { kind: "feedback-pending" });

type Read = { list: PendingList; etag: string | null };

const emptyList = (): PendingList => ({
  schema: "feedback-pending",
  version: 1,
  items: [],
});

export async function readPending(
  store: BlobStore,
  prefix: SyncPrefix,
): Promise<Read> {
  const found = await store.get(pendingKey(prefix));
  if (found === null || !("body" in found)) {
    return { list: emptyList(), etag: null };
  }
  let parsed: ReturnType<typeof PendingListSchema.safeParse>;
  try {
    parsed = PendingListSchema.safeParse(JSON.parse(found.body));
  } catch {
    parsed = PendingListSchema.safeParse(null);
  }
  // A damaged list is replaced; the reports it named are still stored.
  return {
    list: parsed.success ? parsed.data : emptyList(),
    etag: found.etag,
  };
}

// Writes `list` over what `etag` names; false on a conflict.
async function writeList(
  store: BlobStore,
  prefix: SyncPrefix,
  list: PendingList,
  etag: string | null,
): Promise<boolean> {
  const written = await store.put(
    pendingKey(prefix),
    JSON.stringify(list),
    etag === null ? { ifNoneMatch: "*" } : { ifMatch: etag },
  );
  return !("conflict" in written);
}

export type AddResult = "added" | "listed" | "full" | "busy";

export async function addPending(
  store: BlobStore,
  prefix: SyncPrefix,
  item: PendingItem,
): Promise<AddResult> {
  for (let round = 0; round < SYNC_MAX_RETRIES; round++) {
    const { list, etag } = await readPending(store, prefix);
    if (list.items.some((listed) => listed.id === item.id)) return "listed";
    if (list.items.length >= FEEDBACK_PENDING_MAX) return "full";
    const next = { ...list, items: [...list.items, item] };
    if (await writeList(store, prefix, next, etag)) return "added";
  }
  return "busy";
}

export type RemoveResult = "removed" | "absent" | "busy";

export async function removePending(
  store: BlobStore,
  prefix: SyncPrefix,
  id: string,
): Promise<RemoveResult> {
  for (let round = 0; round < SYNC_MAX_RETRIES; round++) {
    const { list, etag } = await readPending(store, prefix);
    if (etag === null || !list.items.some((item) => item.id === id)) {
      return "absent";
    }
    const next = {
      ...list,
      items: list.items.filter((item) => item.id !== id),
    };
    if (await writeList(store, prefix, next, etag)) return "removed";
  }
  return "busy";
}
