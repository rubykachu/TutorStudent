import { type NextRequest, NextResponse } from "next/server";
import { type AccessConfig, readAccessConfig } from "@/access/env";
import { sameOrigin } from "@/access/origin";
import { RequestLimiter } from "@/access/rate-limit";
import { resolveFamily, verifySessionToken } from "@/access/session";
import {
  ACCESS_COOKIE_NAME,
  SYNC_BODY_SLACK_BYTES,
  SYNC_DOC_MAX_BYTES,
  SYNC_FUTURE_SKEW_MINUTES,
  SYNC_GET_LIMIT_PER_MINUTE,
  SYNC_HISTORY_MAX_BYTES,
  SYNC_PROFILE_CACHE_SECONDS,
  SYNC_PUT_LIMIT_PER_MINUTE,
} from "@/lib/config";
import { vnDayKey } from "@/lib/time";
import { clampFutureTimes } from "@/sync/clamp";
import {
  CHILD_ID_PATTERN,
  canonicalText,
  type DocKind,
  type DocOf,
  type HistoryDoc,
  MONTH_PATTERN,
  migrateDoc,
  type ProfileDoc,
} from "@/sync/schema";
import { type SyncPrefix, syncKey } from "@/sync/store/keys";
import { R2Error } from "@/sync/store/r2";
import type { BlobStore, StoredBlob } from "@/sync/store/types";

// The server side of `/api/sync`: it checks who is asking and what, and
// stores or returns one doc. It never merges (the clients do) and never logs
// a doc's content.

export type SyncTarget =
  | { kind: "profile" }
  | { kind: "child"; childId: string }
  | { kind: "history"; childId: string; month: string };

// What one failed request leaves in the server log: never any doc content.
export type SyncLogEntry = {
  route: "GET" | "PUT";
  familyId: string | null;
  doc: DocKind | null;
  status: number;
  // Size of the request body in bytes, when one was read.
  bytes: number | null;
  // Set when the line reports something other than a refused request:
  // `snapshot-failed` (the write went on), `exception` (the store or the code
  // threw; the answer is 500 `server`).
  event: "snapshot-failed" | "exception" | null;
  // With `exception` only: the bucket's status and error code, or the error's
  // name. Never its message, which can hold a URL, a path or a body.
  detail?: string;
};

type RequestContext = Omit<
  SyncLogEntry,
  "route" | "status" | "event" | "detail"
>;
const newContext = (): RequestContext => ({
  familyId: null,
  doc: null,
  bytes: null,
});

export type SyncServiceDeps = {
  store: BlobStore | null;
  prefix: SyncPrefix;
  readAccess?: () => AccessConfig;
  now?: () => Date;
  log?: (entry: SyncLogEntry) => void;
};

const MINUTE_MS = 60_000;
// An etag the client sends back (`known`).
const ETAG_PATTERN = /^[\w.-]{1,128}$/;

function reply(
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: { "cache-control": "no-store", ...headers },
  });
}

const fail = (status: number, error: string, extra: object = {}) =>
  reply({ error, ...extra }, status);

// Reads `?doc=profile`, `?child=<id>` or `?child=<id>&month=<yyyy-mm>`, plus
// `known` on a read. Anything else, a repeated or an unknown parameter is
// refused. A month after `currentMonth` is refused too.
export function parseTarget(
  params: URLSearchParams,
  allowed: readonly string[],
  currentMonth: string,
): { target: SyncTarget; known: string | null } | null {
  const names = [...params.keys()];
  if (names.some((name) => !allowed.includes(name))) return null;
  if (new Set(names).size !== names.length) return null;
  const doc = params.get("doc");
  const child = params.get("child");
  const month = params.get("month");
  const known = params.get("known");
  if (known !== null && !ETAG_PATTERN.test(known)) return null;

  if (doc !== null) {
    if (doc !== "profile" || child !== null || month !== null) return null;
    return { target: { kind: "profile" }, known };
  }
  if (child === null || !CHILD_ID_PATTERN.test(child)) return null;
  if (month === null)
    return { target: { kind: "child", childId: child }, known };
  if (!MONTH_PATTERN.test(month) || month > currentMonth) return null;
  return { target: { kind: "history", childId: child, month }, known };
}

export function targetKey(
  prefix: SyncPrefix,
  familyId: string,
  target: SyncTarget,
): string {
  return target.kind === "profile"
    ? syncKey(prefix, { kind: "profile", familyId })
    : syncKey(prefix, { familyId, ...target });
}

type Stored =
  | { state: "missing" }
  // The stored text is not a valid doc of this code's version; `version` is
  // its own version when it has one.
  | { state: "invalid"; version: number | null }
  | { state: "ok"; doc: unknown; etag: string; body: string; version: number };

function interpret(found: StoredBlob, kind: DocKind): Stored {
  let raw: unknown;
  try {
    raw = JSON.parse(found.body);
  } catch {
    return { state: "invalid", version: null };
  }
  const version =
    typeof raw === "object" && raw !== null && "version" in raw
      ? Number((raw as { version: unknown }).version)
      : Number.NaN;
  const known = Number.isInteger(version) ? version : null;
  const migrated = migrateDoc(kind, raw);
  if (!migrated.ok || known === null) {
    return { state: "invalid", version: known };
  }
  return {
    state: "ok",
    doc: migrated.doc,
    etag: found.etag,
    body: found.body,
    version: known,
  };
}

// The body of a request, or null when it is longer than `max` bytes. Reading
// stops at the cap, so an oversized body is never held whole or parsed.
async function readCapped(
  request: NextRequest,
  max: number,
): Promise<string | null> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > max) return null;
  const reader = request.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > max) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// `{ doc, ifMatch }` to replace or `{ doc, ifNoneMatch: "*" }` to create.
type PutBody = {
  doc: unknown;
  condition: { ifMatch: string } | { ifNoneMatch: "*" };
};

function parsePutBody(raw: unknown): PutBody | null {
  if (!isRecord(raw) || !("doc" in raw)) return null;
  if (
    Object.keys(raw).some((k) => !["doc", "ifMatch", "ifNoneMatch"].includes(k))
  ) {
    return null;
  }
  const { ifMatch, ifNoneMatch } = raw;
  if (ifNoneMatch === "*" && ifMatch === undefined) {
    return { doc: raw.doc, condition: { ifNoneMatch: "*" } };
  }
  if (
    typeof ifMatch === "string" &&
    ETAG_PATTERN.test(ifMatch) &&
    ifNoneMatch === undefined
  ) {
    return { doc: raw.doc, condition: { ifMatch } };
  }
  return null;
}

const maxBytes = (kind: DocKind) =>
  kind === "history" ? SYNC_HISTORY_MAX_BYTES : SYNC_DOC_MAX_BYTES;

const byteLength = (text: string) => new TextEncoder().encode(text).length;

export function createSyncService(deps: SyncServiceDeps) {
  const readAccess = deps.readAccess ?? (() => readAccessConfig());
  const now = deps.now ?? (() => new Date());
  const log =
    deps.log ?? ((entry: SyncLogEntry) => console.warn(JSON.stringify(entry)));
  const getLimiter = new RequestLimiter(
    SYNC_GET_LIMIT_PER_MINUTE,
    MINUTE_MS,
    () => now().getTime(),
  );
  const putLimiter = new RequestLimiter(
    SYNC_PUT_LIMIT_PER_MINUTE,
    MINUTE_MS,
    () => now().getTime(),
  );
  // The Vietnam day each child's snapshot was last taken or found on this
  // instance, so later writes that day skip the check.
  const snapshotDays = new Map<string, string>();
  // Children listed in each family's profile doc, as last read by this
  // instance.
  const profileCache = new Map<string, { ids: Set<string>; at: number }>();

  // The checks every request passes before any doc is touched: the gate, the
  // cookie, the family and the store. Returns the family id, or the answer.
  async function admit(
    request: NextRequest,
    limiter: RequestLimiter,
  ): Promise<{ familyId: string; store: BlobStore } | NextResponse> {
    const config = readAccess();
    if (config.mode === "closed") return fail(503, "unavailable");
    if (config.mode === "open") return fail(404, "no-gate");
    const token = request.cookies.get(ACCESS_COOKIE_NAME)?.value;
    const nowMs = now().getTime();
    const familyId = await resolveFamily(config, token, nowMs);
    if (familyId === null) {
      const valid = await verifySessionToken(
        config.secret,
        config.codes,
        token,
        nowMs,
      );
      // A valid cookie whose code has no family name cannot sync.
      return valid ? fail(503, "sync-unavailable") : fail(401, "unauthorized");
    }
    if (deps.store === null) return fail(503, "sync-unavailable");
    const decision = limiter.hit(familyId);
    if (!decision.allowed) {
      return reply({ error: "rate" }, 429, {
        "retry-after": String(decision.retryAfterSeconds),
      });
    }
    return { familyId, store: deps.store };
  }

  async function readStored(
    store: BlobStore,
    key: string,
    kind: DocKind,
  ): Promise<Stored> {
    const found = await store.get(key);
    return found !== null && "body" in found
      ? interpret(found, kind)
      : { state: "missing" };
  }

  // Whether the profile doc lists the child. A copy older than a minute, or
  // one that does not list the child, is read again first: the profile may
  // have been written a moment ago through another server instance.
  async function childListed(
    store: BlobStore,
    prefix: SyncPrefix,
    familyId: string,
    childId: string,
  ): Promise<"listed" | "unknown" | "invalid"> {
    const nowMs = now().getTime();
    const cached = profileCache.get(familyId);
    if (
      cached &&
      nowMs - cached.at < SYNC_PROFILE_CACHE_SECONDS * 1000 &&
      cached.ids.has(childId)
    ) {
      return "listed";
    }
    const stored = await readStored(
      store,
      syncKey(prefix, { kind: "profile", familyId }),
      "profile",
    );
    if (stored.state === "invalid") return "invalid";
    const ids = new Set(
      stored.state === "ok"
        ? (stored.doc as ProfileDoc).profiles.map((profile) => profile.id)
        : [],
    );
    profileCache.set(familyId, { ids, at: nowMs });
    return ids.has(childId) ? "listed" : "unknown";
  }

  function currentMonth(): string {
    return vnDayKey(now()).slice(0, 7);
  }

  async function get(request: NextRequest): Promise<NextResponse> {
    return logged("GET", (ctx) => handleGet(request, ctx));
  }

  async function logged(
    route: "GET" | "PUT",
    handle: (ctx: RequestContext) => Promise<NextResponse>,
  ): Promise<NextResponse> {
    const ctx = newContext();
    let response: NextResponse;
    try {
      response = await handle(ctx);
    } catch (error) {
      // An unreadable bucket, a timeout or a bug: a JSON answer with
      // `no-store` like every other, and one log line without the error's
      // message.
      log({
        route,
        ...ctx,
        status: 500,
        event: "exception",
        detail: errorDetail(error),
      });
      return fail(500, "server");
    }
    if (response.status >= 400) {
      log({ route, ...ctx, status: response.status, event: null });
    }
    return response;
  }

  async function handleGet(
    request: NextRequest,
    ctx: RequestContext,
  ): Promise<NextResponse> {
    const site = request.headers.get("sec-fetch-site");
    if (site !== null && site !== "same-origin") return fail(403, "origin");
    const admitted = await admit(request, getLimiter);
    if (admitted instanceof NextResponse) return admitted;
    const { familyId, store } = admitted;
    ctx.familyId = familyId;

    const parsed = parseTarget(
      new URL(request.url).searchParams,
      ["doc", "child", "month", "known"],
      currentMonth(),
    );
    if (parsed === null) return fail(400, "invalid");
    const { target, known } = parsed;
    ctx.doc = target.kind;

    if (target.kind !== "profile") {
      const listed = await childListed(
        store,
        deps.prefix,
        familyId,
        target.childId,
      );
      if (listed === "invalid") return fail(500, "stored-invalid");
      if (listed === "unknown") return fail(403, "child");
    }
    const found = await store.get(
      targetKey(deps.prefix, familyId, target),
      known ? { ifNoneMatch: known } : {},
    );
    const serverTime = now().toISOString();
    if (found === null) {
      return reply({ familyId, doc: null, etag: null, serverTime });
    }
    if ("unchanged" in found) {
      return reply({ unchanged: true, etag: found.etag, serverTime });
    }
    const stored = interpret(found, target.kind);
    if (stored.state !== "ok") return fail(500, "stored-invalid");
    return reply({ familyId, doc: stored.doc, etag: stored.etag, serverTime });
  }

  // The answer to a write that lost to another writer: 412 with what is
  // stored now, so the client can merge and retry.
  async function conflict(
    store: BlobStore,
    key: string,
    kind: DocKind,
  ): Promise<NextResponse> {
    const current = await readStored(store, key, kind);
    if (current.state === "invalid") return fail(500, "stored-invalid");
    return current.state === "missing"
      ? fail(412, "conflict", { doc: null, etag: null })
      : fail(412, "conflict", { doc: current.doc, etag: current.etag });
  }

  // Before the first write of a Vietnam day, keeps the stored main doc as it
  // was: `snapshots/<familyId>/<childId>/<day>.json` is the state before that
  // day's first write. `before` is the stored text. A failure is logged and
  // never blocks the write.
  async function snapshotBeforeWrite(
    store: BlobStore,
    familyId: string,
    childId: string,
    before: string,
    at: Date,
  ): Promise<void> {
    const day = vnDayKey(at);
    if (snapshotDays.get(`${familyId}/${childId}`) === day) return;
    try {
      await store.put(
        syncKey(deps.prefix, { kind: "snapshot", familyId, childId, day }),
        before,
        { ifNoneMatch: "*" },
      );
    } catch {
      log({
        route: "PUT",
        familyId,
        doc: "child",
        status: 200,
        bytes: null,
        event: "snapshot-failed",
      });
      return;
    }
    // A conflict means the day's snapshot already exists, which is as good.
    snapshotDays.set(`${familyId}/${childId}`, day);
  }

  async function put(request: NextRequest): Promise<NextResponse> {
    return logged("PUT", (ctx) => handlePut(request, ctx));
  }

  async function handlePut(
    request: NextRequest,
    ctx: RequestContext,
  ): Promise<NextResponse> {
    if (!sameOrigin(request)) return fail(403, "origin");
    const mediaType = (request.headers.get("content-type") ?? "")
      .split(";")[0]
      ?.trim()
      .toLowerCase();
    if (mediaType !== "application/json") return fail(400, "invalid");
    const admitted = await admit(request, putLimiter);
    if (admitted instanceof NextResponse) return admitted;
    const { familyId, store } = admitted;
    ctx.familyId = familyId;

    const parsed = parseTarget(
      new URL(request.url).searchParams,
      ["doc", "child", "month"],
      currentMonth(),
    );
    if (parsed === null) return fail(400, "invalid");
    const { target } = parsed;
    const kind = target.kind;
    ctx.doc = kind;
    const cap = maxBytes(kind);

    const text = await readCapped(request, cap + SYNC_BODY_SLACK_BYTES);
    if (text === null) return fail(413, "too-large");
    ctx.bytes = byteLength(text);
    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch {
      return fail(400, "invalid");
    }
    const body = parsePutBody(raw);
    if (body === null) return fail(400, "invalid");
    const sentVersion = isRecord(body.doc)
      ? Number(body.doc.version)
      : Number.NaN;
    const migrated = migrateDoc(kind, body.doc);
    if (!migrated.ok) return fail(400, "invalid");
    const doc = migrated.doc;
    if (doc.familyId !== familyId) return fail(400, "invalid");
    if (kind !== "profile") {
      const { childId } = doc as DocOf["child" | "history"];
      if (childId !== (target as { childId: string }).childId) {
        return fail(400, "invalid");
      }
      if (
        kind === "history" &&
        (doc as HistoryDoc).month !== (target as { month: string }).month
      ) {
        return fail(400, "invalid");
      }
      const listed = await childListed(store, deps.prefix, familyId, childId);
      if (listed === "invalid") return fail(500, "stored-invalid");
      if (listed === "unknown") return fail(403, "child");
    }

    // Times in the server's future become the server's time, and the stored
    // doc goes back to the client so it applies exactly what was stored.
    const serverNow = now();
    const limit = new Date(
      serverNow.getTime() + SYNC_FUTURE_SKEW_MINUTES * MINUTE_MS,
    ).toISOString();
    const clamped = clampFutureTimes(kind, doc, limit, serverNow.toISOString());
    let stored: DocOf[DocKind] = doc;
    if (clamped.changed) {
      // A record moved out of its month by the clamp fails the schema here.
      const again = migrateDoc(kind, clamped.doc);
      if (!again.ok) return fail(400, "invalid");
      stored = again.doc;
    }
    const storedText = canonicalText(kind, stored as never);
    if (byteLength(storedText) > cap) return fail(413, "too-large");

    const key = targetKey(deps.prefix, familyId, target);
    let before: string | null = null;
    if ("ifMatch" in body.condition) {
      const current = await readStored(store, key, kind);
      if (current.state === "missing") {
        return fail(412, "conflict", { doc: null, etag: null });
      }
      if (current.version !== null && current.version > sentVersion) {
        return fail(409, "upgrade-required");
      }
      if (current.state === "invalid") return fail(500, "stored-invalid");
      before = current.body;
      if (current.etag !== body.condition.ifMatch) {
        return fail(412, "conflict", { doc: current.doc, etag: current.etag });
      }
      if (
        kind === "history" &&
        dropsRecords(current.doc as HistoryDoc, stored as HistoryDoc)
      ) {
        return fail(409, "shrink", { doc: current.doc, etag: current.etag });
      }
    }

    if (target.kind === "child" && before !== null) {
      await snapshotBeforeWrite(
        store,
        familyId,
        target.childId,
        before,
        serverNow,
      );
    }
    const written = await store.put(key, storedText, body.condition);
    if ("conflict" in written) return conflict(store, key, kind);
    if (target.kind === "child" && before === null) {
      // A new doc had no earlier state, so the day has nothing to keep.
      snapshotDays.set(`${familyId}/${target.childId}`, vnDayKey(serverNow));
    }
    if (kind === "profile") {
      profileCache.set(familyId, {
        ids: new Set((stored as ProfileDoc).profiles.map((p) => p.id)),
        at: serverNow.getTime(),
      });
    }
    return reply({
      etag: written.etag,
      serverTime: serverNow.toISOString(),
      ...(clamped.changed ? { doc: stored } : {}),
    });
  }

  return { get, put };
}

function errorDetail(error: unknown): string {
  if (error instanceof R2Error) return `R2 ${error.status} ${error.code}`;
  return error instanceof Error ? error.name : "unknown";
}

// True when `next` lacks an attempt or writing the stored month doc has.
function dropsRecords(stored: HistoryDoc, next: HistoryDoc): boolean {
  const kept = (ids: readonly { id: string }[]) =>
    new Set(ids.map((record) => record.id));
  const attempts = kept(next.attempts);
  const writings = kept(next.writings);
  return (
    stored.attempts.some((record) => !attempts.has(record.id)) ||
    stored.writings.some((record) => !writings.has(record.id))
  );
}
