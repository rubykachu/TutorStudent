import { type NextRequest, NextResponse } from "next/server";
import { familyCode, verifyFamilyCode } from "@/access/code";
import { readAccessConfig } from "@/access/env";
import { sameOrigin } from "@/access/origin";
import { FailureLimiter } from "@/access/rate-limit";
import {
  issueSessionToken,
  resolveFamily,
  sessionMaxAgeSeconds,
} from "@/access/session";
import {
  ACCESS_COOKIE_NAME,
  ACCESS_LOCK_MINUTES,
  ACCESS_MAX_FAILS,
} from "@/lib/config";

// Longest text accepted as a code, so a huge body is never hashed.
const MAX_INPUT_LENGTH = 100;

const limiter = new FailureLimiter(
  ACCESS_MAX_FAILS,
  ACCESS_LOCK_MINUTES * 60 * 1000,
);

// The visitor's address as the host (Vercel) reports it.
function clientKey(request: NextRequest): string {
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

function locked(retryAfterSeconds: number) {
  return NextResponse.json(
    { error: "locked", retryAfterSeconds },
    { status: 429, headers: { "retry-after": String(retryAfterSeconds) } },
  );
}

// `{ code }` in, the family cookie out when the code's signature is right and
// its family is not revoked.
export async function POST(request: NextRequest) {
  const config = readAccessConfig();
  if (config.mode === "closed") {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
  if (config.mode === "open") {
    return NextResponse.json({ error: "no-gate" }, { status: 404 });
  }
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "origin" }, { status: 403 });
  }

  const body: unknown = await request.json().catch(() => null);
  const input =
    typeof body === "object" && body !== null && "code" in body
      ? (body as { code: unknown }).code
      : null;
  if (typeof input !== "string" || input.length > MAX_INPUT_LENGTH) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const key = clientKey(request);
  const before = limiter.state(key);
  if (before.locked) return locked(before.retryAfterSeconds);

  const found = await verifyFamilyCode(config.codeSecret, input);
  const familyId = found !== null && !config.revoked.has(found) ? found : null;
  if (familyId === null) {
    const after = limiter.fail(key);
    return after.locked
      ? locked(after.retryAfterSeconds)
      : NextResponse.json({ error: "wrong" }, { status: 401 });
  }

  limiter.clear(key);
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: await issueSessionToken(config, familyId),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionMaxAgeSeconds(),
  });
  return response;
}

// The family of this device's cookie and its code, for the parent page to show
// so a parent can unlock another device. The code is made again from the
// family id and `FAMILY_CODE_SECRET`; the cookie never holds it. The proxy lets
// this path through without a cookie (the unlock page posts to it), so the
// cookie is checked here.
export async function GET(request: NextRequest) {
  const config = readAccessConfig();
  if (config.mode === "closed") {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
  if (config.mode === "open") {
    return NextResponse.json({ error: "no-gate" }, { status: 404 });
  }
  const familyId = await resolveFamily(
    config,
    request.cookies.get(ACCESS_COOKIE_NAME)?.value,
  );
  if (familyId === null) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json(
    { familyId, code: await familyCode(config.codeSecret, familyId) },
    { headers: { "cache-control": "no-store" } },
  );
}
