import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ACCESS_COOKIE_NAME, ACCESS_MAX_FAILS } from "@/lib/config";

const CODE = "Sao-Bien-4k7m";
const HOST = "tutor.example";

function post(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest(`https://${HOST}/api/session`, {
    method: "POST",
    headers: {
      host: HOST,
      origin: `https://${HOST}`,
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.7",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

// A fresh route module per test, so each starts with an empty limiter.
async function route() {
  vi.resetModules();
  return (await import("@/app/api/session/route")).POST;
}

beforeEach(() => {
  vi.stubEnv("FAMILY_CODES", CODE);
  vi.stubEnv("SESSION_SECRET", "a-secret-of-at-least-thirty-two-characters");
  vi.stubEnv("NODE_ENV", "production");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("POST /api/session", () => {
  it("sets an httpOnly family cookie for a right code typed loosely", async () => {
    const response = await (await route())(post({ code: " sao bien 4K7M " }));
    expect(response.status).toBe(200);
    const cookie = response.cookies.get(ACCESS_COOKIE_NAME);
    expect(cookie?.httpOnly).toBe(true);
    expect(cookie?.secure).toBe(true);
    expect(cookie?.sameSite).toBe("lax");
    expect(cookie?.path).toBe("/");
    expect(cookie?.maxAge).toBe(365 * 24 * 60 * 60);
    expect(cookie?.value).not.toContain("saobien4k7m");
  });

  it("answers a wrong code with 401 and no cookie", async () => {
    const response = await (await route())(
      post({ code: "not-the-code-at-all" }),
    );
    expect(response.status).toBe(401);
    expect(response.cookies.get(ACCESS_COOKIE_NAME)).toBeUndefined();
  });

  it("locks an address after too many wrong codes, even for the right one", async () => {
    const handler = await route();
    for (let i = 1; i < ACCESS_MAX_FAILS; i++) {
      expect((await handler(post({ code: "wrong-code-here" }))).status).toBe(
        401,
      );
    }
    const locked = await handler(post({ code: "wrong-code-here" }));
    expect(locked.status).toBe(429);
    expect(Number(locked.headers.get("retry-after"))).toBeGreaterThan(0);
    expect((await handler(post({ code: CODE }))).status).toBe(429);
    // Another address is not affected.
    const other = await handler(
      post({ code: CODE }, { "x-forwarded-for": "198.51.100.9" }),
    );
    expect(other.status).toBe(200);
  });

  it("resets the count after a right code", async () => {
    const handler = await route();
    for (let i = 1; i < ACCESS_MAX_FAILS; i++) {
      await handler(post({ code: "wrong-code-here" }));
    }
    expect((await handler(post({ code: CODE }))).status).toBe(200);
    expect((await handler(post({ code: "wrong-code-here" }))).status).toBe(401);
  });

  it("refuses a request from another origin or without one", async () => {
    const handler = await route();
    expect(
      (await handler(post({ code: CODE }, { origin: "https://evil.example" })))
        .status,
    ).toBe(403);
    const noOrigin = new NextRequest(`https://${HOST}/api/session`, {
      method: "POST",
      headers: { host: HOST },
      body: JSON.stringify({ code: CODE }),
    });
    expect((await handler(noOrigin)).status).toBe(403);
  });

  it("refuses a malformed or oversized body", async () => {
    const handler = await route();
    expect((await handler(post("not json"))).status).toBe(400);
    expect((await handler(post({ code: 42 }))).status).toBe(400);
    expect((await handler(post({ code: "x".repeat(101) }))).status).toBe(400);
  });

  it("answers 503 when production has no valid setup, and 404 without a gate", async () => {
    vi.stubEnv("SESSION_SECRET", "");
    expect((await (await route())(post({ code: CODE }))).status).toBe(503);
    vi.stubEnv("FAMILY_CODES", "");
    vi.stubEnv("NODE_ENV", "development");
    expect((await (await route())(post({ code: CODE }))).status).toBe(404);
  });
});
