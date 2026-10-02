import { NextRequest } from "next/server";
import type { AccessConfig } from "@/access/env";
import { issueSessionToken } from "@/access/session";
import { ACCESS_COOKIE_NAME } from "@/lib/config";
import {
  type ChildDoc,
  canonicalText,
  emptyChildDoc,
  emptyHistoryDoc,
  emptyProfileDoc,
  type HistoryDoc,
  type ProfileDoc,
} from "@/sync/schema";
import { createSyncService, type SyncLogEntry } from "@/sync/server";
import { syncKey } from "@/sync/store/keys";
import { createMemoryStore } from "@/sync/store/memory";
import type { BlobStore } from "@/sync/store/types";

export const SECRET = "a-secret-of-at-least-thirty-two-characters";
export const HOST = "tutor.example";
export const FAMILY = "nha-minh";
export const OTHER_FAMILY = "nha-an";
export const CODE = "saobien4k7m";
export const OTHER_CODE = "mattroi9x2z";
export const BARE_CODE = "barecode00000";
export const CHILD = "3f9c2a7be1d04c58a6b7f0e2c4d91a35";
export const CHILD_2 = "aa9c2a7be1d04c58a6b7f0e2c4d91a35";
export const STRANGER = "bb9c2a7be1d04c58a6b7f0e2c4d91a35";
export const PREFIX = "dev/" as const;

export const ACCESS: AccessConfig = {
  mode: "gate",
  secret: SECRET,
  codes: [CODE, OTHER_CODE, BARE_CODE],
  families: new Map([
    [CODE, FAMILY],
    [OTHER_CODE, OTHER_FAMILY],
  ]),
};

export async function cookieFor(code: string): Promise<string> {
  return `${ACCESS_COOKIE_NAME}=${await issueSessionToken(SECRET, code, Date.now())}`;
}

export function profileDoc(
  familyId: string,
  childIds: readonly string[],
): ProfileDoc {
  return {
    ...emptyProfileDoc(familyId),
    profiles: childIds.map((id, index) => ({
      id,
      name: `Bạn ${index}`,
      avatar: "owl",
      grade: 6,
      series: {},
      createdAt: "2026-09-01T00:00:00.000Z",
      updatedAt: "2026-09-01T00:00:00.000Z",
    })),
  };
}

export function childDoc(familyId = FAMILY, childId = CHILD): ChildDoc {
  return emptyChildDoc(familyId, childId);
}

export function historyDoc(
  month = "2026-10",
  familyId = FAMILY,
  childId = CHILD,
): HistoryDoc {
  return emptyHistoryDoc(familyId, childId, month);
}

export function attempt(
  id: string,
  at: string,
): HistoryDoc["attempts"][number] {
  return {
    id,
    exerciseId: "l-one.ex.a",
    lessonId: "l-one",
    cardIds: ["l-one.card.a"],
    firstTryCorrect: true,
    wrongCount: 0,
    at,
    context: "practice",
  };
}

export type Harness = ReturnType<typeof harness>;

export function harness(
  options: {
    access?: AccessConfig;
    store?: BlobStore | null;
    start?: string;
    capture?: boolean;
  } = {},
) {
  const store =
    options.store === undefined ? createMemoryStore() : options.store;
  let clock = new Date(options.start ?? "2026-10-02T03:00:00.000Z");
  const logs: SyncLogEntry[] = [];
  const service = createSyncService({
    store,
    prefix: PREFIX,
    readAccess: () => options.access ?? ACCESS,
    now: () => clock,
    ...(options.capture === false ? {} : { log: (entry) => logs.push(entry) }),
  });
  return {
    store: store as BlobStore,
    service,
    logs,
    setNow(iso: string) {
      clock = new Date(iso);
    },
    // Stores `doc` as the family's stored copy, as another device left it.
    async seed(
      target: Parameters<typeof syncKey>[1],
      doc: unknown,
      raw?: string,
    ): Promise<string> {
      const text = raw ?? JSON.stringify(doc);
      const result = await (store as BlobStore).put(
        syncKey(PREFIX, target),
        text,
      );
      return (result as { etag: string }).etag;
    },
    async stored(target: Parameters<typeof syncKey>[1]) {
      const found = await (store as BlobStore).get(syncKey(PREFIX, target));
      return found && "body" in found
        ? { doc: JSON.parse(found.body), etag: found.etag, body: found.body }
        : null;
    },
  };
}

type RequestOptions = {
  cookie?: string | null;
  headers?: Record<string, string>;
  body?: BodyInit | object;
};

export async function request(
  method: "GET" | "PUT",
  query: string,
  { cookie, headers = {}, body }: RequestOptions = {},
): Promise<NextRequest> {
  const jsonBody =
    body !== undefined && typeof body === "object" && !(body instanceof Blob)
      ? JSON.stringify(body)
      : (body as BodyInit | undefined);
  return new NextRequest(`https://${HOST}/api/sync${query}`, {
    method,
    headers: {
      host: HOST,
      ...(method === "PUT"
        ? { origin: `https://${HOST}`, "content-type": "application/json" }
        : { "sec-fetch-site": "same-origin" }),
      ...(cookie === null ? {} : { cookie: cookie ?? (await cookieFor(CODE)) }),
      ...headers,
    },
    ...(jsonBody === undefined ? {} : { body: jsonBody }),
  });
}

export const canonical = canonicalText;
