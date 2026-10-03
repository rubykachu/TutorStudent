import type { SyncTarget } from "@/sync/server";

// The browser side of `/api/sync`: one GET or PUT per doc, with every answer
// reduced to what the engine decides on. Nothing here throws: a network error
// is the failure "offline".

export const SYNC_ENDPOINT = "/api/sync";

// Why a request did not give a doc.
export type FailReason =
  // Sync is off on the server (no store, no gate).
  | "unavailable"
  // No or rejected family cookie.
  | "unauthorized"
  // The network is down or the request was lost.
  | "offline"
  // Per-family rate limit hit.
  | "rate"
  | "origin"
  // The child is not in the stored profile doc yet.
  | "child"
  | "invalid"
  | "too-large"
  // The stored doc is of a newer version than this app.
  | "upgrade-required"
  | "stored-invalid"
  | "server";

export type Failure = { status: "fail"; reason: FailReason };

export type GetResult =
  | {
      status: "doc";
      familyId: string;
      // null: nothing stored yet.
      doc: unknown;
      etag: string | null;
      serverTime: string;
    }
  | { status: "unchanged"; etag: string; serverTime: string }
  | Failure;

export type PutCondition = { ifMatch: string } | { ifNoneMatch: "*" };

export type PutResult =
  // `doc` is the stored doc, present only when the server changed a time.
  | { status: "stored"; etag: string; serverTime: string; doc?: unknown }
  // Another writer got there first: what is stored now (null: nothing).
  | { status: "conflict"; doc: unknown; etag: string | null }
  // A month doc would have dropped a stored record.
  | { status: "shrink"; doc: unknown; etag: string }
  | Failure;

export interface SyncApi {
  get(target: SyncTarget, known: string | null): Promise<GetResult>;
  put(
    target: SyncTarget,
    doc: unknown,
    condition: PutCondition,
  ): Promise<PutResult>;
}

type FetchFn = (input: string, init?: RequestInit) => Promise<Response>;

export function targetQuery(target: SyncTarget): URLSearchParams {
  const params = new URLSearchParams();
  if (target.kind === "profile") params.set("doc", "profile");
  else {
    params.set("child", target.childId);
    if (target.kind === "history") params.set("month", target.month);
  }
  return params;
}

type Body = Record<string, unknown>;

function failureOf(status: number, body: Body): Failure {
  const fail = (reason: FailReason): Failure => ({ status: "fail", reason });
  const code = typeof body.error === "string" ? body.error : "";
  switch (status) {
    case 401:
      return fail("unauthorized");
    case 404:
    case 503:
      return fail("unavailable");
    case 403:
      return fail(code === "child" ? "child" : "origin");
    case 400:
      return fail("invalid");
    case 413:
      return fail("too-large");
    case 409:
      return fail("upgrade-required");
    case 429:
      return fail("rate");
    case 500:
      return fail(code === "stored-invalid" ? "stored-invalid" : "server");
    default:
      return fail("server");
  }
}

async function readBody(response: Response): Promise<Body> {
  try {
    const body: unknown = await response.json();
    return typeof body === "object" && body !== null ? (body as Body) : {};
  } catch {
    return {};
  }
}

const string = (value: unknown): string | null =>
  typeof value === "string" ? value : null;

export function createSyncApi(
  fetchImpl: FetchFn = (input, init) => globalThis.fetch(input, init),
): SyncApi {
  async function send(
    target: SyncTarget,
    extra: URLSearchParams,
    init: RequestInit,
  ): Promise<{ status: number; body: Body } | null> {
    const params = targetQuery(target);
    for (const [key, value] of extra) params.set(key, value);
    try {
      const response = await fetchImpl(`${SYNC_ENDPOINT}?${params}`, {
        ...init,
        cache: "no-store",
      });
      return { status: response.status, body: await readBody(response) };
    } catch {
      return null;
    }
  }

  return {
    async get(target, known) {
      const extra = new URLSearchParams();
      if (known !== null) extra.set("known", known);
      const answer = await send(target, extra, { method: "GET" });
      if (answer === null) return { status: "fail", reason: "offline" };
      const { status, body } = answer;
      const serverTime = string(body.serverTime);
      if (status !== 200 || serverTime === null) {
        return failureOf(status, body);
      }
      if (body.unchanged === true && string(body.etag) !== null) {
        return {
          status: "unchanged",
          etag: body.etag as string,
          serverTime,
        };
      }
      const familyId = string(body.familyId);
      if (familyId === null) return { status: "fail", reason: "server" };
      return {
        status: "doc",
        familyId,
        doc: body.doc ?? null,
        etag: string(body.etag),
        serverTime,
      };
    },

    async put(target, doc, condition) {
      const answer = await send(target, new URLSearchParams(), {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ doc, ...condition }),
      });
      if (answer === null) return { status: "fail", reason: "offline" };
      const { status, body } = answer;
      if (status === 412) {
        return {
          status: "conflict",
          doc: body.doc ?? null,
          etag: string(body.etag),
        };
      }
      if (status === 409 && body.error === "shrink") {
        const etag = string(body.etag);
        if (etag === null || body.doc === undefined) {
          return { status: "fail", reason: "server" };
        }
        return { status: "shrink", doc: body.doc, etag };
      }
      const etag = string(body.etag);
      const serverTime = string(body.serverTime);
      if (status !== 200 || etag === null || serverTime === null) {
        return failureOf(status, body);
      }
      return {
        status: "stored",
        etag,
        serverTime,
        ...(body.doc === undefined ? {} : { doc: body.doc }),
      };
    },
  };
}
