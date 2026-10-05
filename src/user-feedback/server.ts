import { type NextRequest, NextResponse } from "next/server";
import { clientKey } from "@/access/client-key";
import { type AccessConfig, readAccessConfig } from "@/access/env";
import { sameOrigin } from "@/access/origin";
import { RequestLimiter } from "@/access/rate-limit";
import { resolveFamily } from "@/access/session";
import {
  ACCESS_COOKIE_NAME,
  FEEDBACK_BODY_MAX_BYTES,
  FEEDBACK_FAMILY_DAY_LIMIT,
  FEEDBACK_FAMILY_LIMIT,
  FEEDBACK_FAMILY_WINDOW_MINUTES,
  FEEDBACK_IP_LIMIT,
  FEEDBACK_IP_WINDOW_MINUTES,
} from "@/lib/config";
import { readCapped } from "@/lib/read-capped";
import { vnIsoTime } from "@/lib/time";
import { errorDetail } from "@/sync/server";
import { type SyncPrefix, syncKey } from "@/sync/store/keys";
import type { BlobStore } from "@/sync/store/types";
import { familyPseudonym } from "./identity";
import { addPending } from "./pending";
import { noteText } from "./sanitize";
import {
  createdAtInWindow,
  type FeedbackRecord,
  FeedbackRecordSchema,
  type FeedbackRequest,
  FeedbackRequestSchema,
  feedbackMonth,
} from "./schema";

// The server side of `POST /api/feedback`: checks who is asking, stores the
// report in the progress bucket and lists it as pending before answering,
// then hands forwarding to `onStored` (run after the answer). The family id
// comes only from the cookie and is never stored or logged; the record holds
// the household pseudonym instead.

export type FeedbackLogEvent =
  | "forward-failed"
  | "forward-given-up"
  | "record-update-failed"
  | "pending-full"
  | "pending-busy"
  | "forward-off"
  | "labels"
  | "exception";

// One log line: never the family id or pseudonym, the note, the titles, the
// issue body or the token. `id` is the report's random id.
export type FeedbackLogEntry = {
  route: "POST";
  status: number;
  event: FeedbackLogEvent | null;
  id: string | null;
  detail?: string;
};

export type FeedbackServiceDeps = {
  store: BlobStore | null;
  prefix: SyncPrefix;
  // The deployed commit (`appVersion()`).
  app: string;
  readAccess?: () => AccessConfig;
  now?: () => Date;
  log?: (entry: FeedbackLogEntry) => void;
  // Runs after a new report is stored and listed, once the answer is sent
  // (`after()` in the route). Never awaited by the request.
  onStored?: (stored: { store: BlobStore; id: string; month: string }) => void;
};

// The report id once known, and whether the answer was already logged with
// its own event.
type RequestContext = { id: string | null; logged: boolean };

const MINUTE_MS = 60_000;
const DAY_MS = 86_400_000;

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

const fail = (status: number, error: string) => reply({ error }, status);

export function createFeedbackService(deps: FeedbackServiceDeps) {
  const readAccess = deps.readAccess ?? (() => readAccessConfig());
  const now = deps.now ?? (() => new Date());
  const log =
    deps.log ??
    ((entry: FeedbackLogEntry) => console.warn(JSON.stringify(entry)));
  const clock = () => now().getTime();
  const familyLimiter = new RequestLimiter(
    FEEDBACK_FAMILY_LIMIT,
    FEEDBACK_FAMILY_WINDOW_MINUTES * MINUTE_MS,
    clock,
  );
  const familyDayLimiter = new RequestLimiter(
    FEEDBACK_FAMILY_DAY_LIMIT,
    DAY_MS,
    clock,
  );
  const ipLimiter = new RequestLimiter(
    FEEDBACK_IP_LIMIT,
    FEEDBACK_IP_WINDOW_MINUTES * MINUTE_MS,
    clock,
  );

  function limited(familyId: string, ip: string): NextResponse | null {
    for (const [limiter, key] of [
      [familyLimiter, familyId],
      [familyDayLimiter, familyId],
      [ipLimiter, ip],
    ] as const) {
      const decision = limiter.hit(key);
      if (!decision.allowed) {
        return reply({ error: "rate" }, 429, {
          "retry-after": String(decision.retryAfterSeconds),
        });
      }
    }
    return null;
  }

  // The request as it is stored: the note sanitized, or gone when empty.
  function storedReport(report: FeedbackRequest): FeedbackRequest {
    const { note, ...rest } = report;
    const clean = note === undefined ? "" : noteText(note);
    return clean === "" ? rest : { ...rest, note: clean };
  }

  async function handle(
    request: NextRequest,
    ctx: RequestContext,
  ): Promise<NextResponse> {
    if (!sameOrigin(request)) return fail(403, "origin");
    const mediaType = (request.headers.get("content-type") ?? "")
      .split(";")[0]
      ?.trim()
      .toLowerCase();
    if (mediaType !== "application/json") return fail(400, "invalid");
    const config = readAccess();
    if (config.mode === "closed") return fail(503, "unavailable");
    if (config.mode === "open") return fail(404, "no-gate");
    const familyId = await resolveFamily(
      config,
      request.cookies.get(ACCESS_COOKIE_NAME)?.value,
      clock(),
    );
    if (familyId === null) return fail(401, "unauthorized");
    const store = deps.store;
    if (store === null) return fail(503, "feedback-unavailable");
    const refused = limited(familyId, clientKey(request));
    if (refused !== null) return refused;

    const text = await readCapped(request, FEEDBACK_BODY_MAX_BYTES);
    if (text === null) return fail(413, "too-large");
    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch {
      return fail(400, "invalid");
    }
    const parsed = FeedbackRequestSchema.safeParse(raw);
    if (!parsed.success) return fail(400, "invalid");
    const report = parsed.data;
    ctx.id = report.id;
    const at = now();
    if (!createdAtInWindow(report.createdAt, at)) return fail(400, "invalid");

    const month = feedbackMonth(report.createdAt);
    const key = syncKey(deps.prefix, {
      kind: "feedback",
      month,
      reportId: report.id,
    });
    const record: FeedbackRecord = FeedbackRecordSchema.parse({
      schema: "feedback",
      version: 1,
      id: report.id,
      receivedAt: vnIsoTime(at),
      family: await familyPseudonym(config.sessionSecret, familyId),
      app: deps.app,
      report: storedReport(report),
      forward: {
        state: "pending",
        attempts: 0,
        claimedAt: null,
        lastError: null,
        issue: null,
        url: null,
      },
    });
    const written = await store.put(key, JSON.stringify(record), {
      ifNoneMatch: "*",
    });
    const duplicate = "conflict" in written;
    if (duplicate && !(await stillPending(store, key))) {
      return reply({ ok: true, duplicate: true });
    }
    // A duplicate still pending is listed again: a retry repairs an add
    // that failed after the record was stored.
    const added = await addPending(store, deps.prefix, {
      id: report.id,
      month,
    });
    if (added === "busy") {
      log({ route: "POST", status: 503, event: "pending-busy", id: report.id });
      ctx.logged = true;
      return fail(503, "busy");
    }
    if (added === "full") {
      log({ route: "POST", status: 202, event: "pending-full", id: report.id });
    }
    if (duplicate) return reply({ ok: true, duplicate: true });
    deps.onStored?.({ store, id: report.id, month });
    return reply({ ok: true }, 202);
  }

  async function stillPending(store: BlobStore, key: string): Promise<boolean> {
    const found = await store.get(key);
    if (found === null || !("body" in found)) return false;
    try {
      const parsed = FeedbackRecordSchema.safeParse(JSON.parse(found.body));
      return parsed.success && parsed.data.forward.state === "pending";
    } catch {
      return false;
    }
  }

  async function post(request: NextRequest): Promise<NextResponse> {
    const ctx: RequestContext = { id: null, logged: false };
    let response: NextResponse;
    try {
      response = await handle(request, ctx);
    } catch (error) {
      log({
        route: "POST",
        status: 500,
        event: "exception",
        id: ctx.id,
        detail: errorDetail(error),
      });
      return fail(500, "server");
    }
    if (response.status >= 400 && !ctx.logged) {
      log({ route: "POST", status: response.status, event: null, id: ctx.id });
    }
    return response;
  }

  return { post };
}
