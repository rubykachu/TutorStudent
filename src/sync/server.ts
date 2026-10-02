import { type NextRequest, NextResponse } from "next/server";
import { type AccessConfig, readAccessConfig } from "@/access/env";
import { RequestLimiter } from "@/access/rate-limit";
import { resolveFamily, verifySessionToken } from "@/access/session";
import {
  ACCESS_COOKIE_NAME,
  SYNC_GET_LIMIT_PER_MINUTE,
  SYNC_PROFILE_CACHE_SECONDS,
} from "@/lib/config";
import { vnDayKey } from "@/lib/time";
import {
  CHILD_ID_PATTERN,
  type DocKind,
  MONTH_PATTERN,
  migrateDoc,
  type ProfileDoc,
} from "@/sync/schema";
import { type SyncPrefix, syncKey } from "@/sync/store/keys";
import type { BlobStore } from "@/sync/store/types";

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
};

type RequestContext = Omit<SyncLogEntry, "route" | "status">;
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
  | { state: "invalid" }
  | { state: "ok"; doc: unknown; etag: string; body: string };

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
    known?: string,
  ): Promise<Stored | { state: "unchanged"; etag: string }> {
    const found = await store.get(key, known ? { ifNoneMatch: known } : {});
    if (found === null) return { state: "missing" };
    if ("unchanged" in found) return { state: "unchanged", etag: found.etag };
    let raw: unknown;
    try {
      raw = JSON.parse(found.body);
    } catch {
      return { state: "invalid" };
    }
    const migrated = migrateDoc(kind, raw);
    if (!migrated.ok) return { state: "invalid" };
    return {
      state: "ok",
      doc: migrated.doc,
      etag: found.etag,
      body: found.body,
    };
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
    const response = await handle(ctx);
    if (response.status >= 400) log({ route, ...ctx, status: response.status });
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
    const stored = await readStored(
      store,
      targetKey(deps.prefix, familyId, target),
      target.kind,
      known ?? undefined,
    );
    const serverTime = now().toISOString();
    switch (stored.state) {
      case "missing":
        return reply({ familyId, doc: null, etag: null, serverTime });
      case "unchanged":
        return reply({ unchanged: true, etag: stored.etag, serverTime });
      case "invalid":
        return fail(500, "stored-invalid");
      case "ok":
        return reply({
          familyId,
          doc: stored.doc,
          etag: stored.etag,
          serverTime,
        });
    }
  }

  return { get };
}
