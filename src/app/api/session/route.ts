import { type NextRequest, NextResponse } from "next/server";
import { matchCode, normalizeCode } from "@/access/code";
import { readAccessConfig } from "@/access/env";
import { FailureLimiter } from "@/access/rate-limit";
import { issueSessionToken, sessionMaxAgeSeconds } from "@/access/session";
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

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

function locked(retryAfterSeconds: number) {
  return NextResponse.json(
    { error: "locked", retryAfterSeconds },
    { status: 429, headers: { "retry-after": String(retryAfterSeconds) } },
  );
}

// `{ code }` in, the family cookie out when the code is one of `FAMILY_CODES`.
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

  const code = matchCode(normalizeCode(input), config.codes);
  if (code === null) {
    const after = limiter.fail(key);
    return after.locked
      ? locked(after.retryAfterSeconds)
      : NextResponse.json({ error: "wrong" }, { status: 401 });
  }

  limiter.clear(key);
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: await issueSessionToken(config.secret, code),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionMaxAgeSeconds(),
  });
  return response;
}
