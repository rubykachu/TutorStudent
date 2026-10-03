import { NextRequest } from "next/server";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { familyCode } from "@/access/code";
import { issueSessionToken } from "@/access/session";
import { ACCESS_COOKIE_NAME, ACCESS_MAX_FAILS } from "@/lib/config";
import {
  CODE_SECRET,
  FAMILY,
  gateConfig,
  OTHER_FAMILY,
  SESSION_SECRET,
} from "./helpers";

const HOST = "tutor.example";
let CODE = "";

beforeAll(async () => {
  CODE = await familyCode(CODE_SECRET, FAMILY);
});

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

async function getRoute() {
  vi.resetModules();
  return (await import("@/app/api/session/route")).GET;
}

function get(cookie?: string) {
  return new NextRequest(`https://${HOST}/api/session`, {
    headers: cookie
      ? { host: HOST, cookie: `${ACCESS_COOKIE_NAME}=${cookie}` }
      : { host: HOST },
  });
}

beforeEach(() => {
  vi.stubEnv("FAMILY_CODE_SECRET", CODE_SECRET);
  vi.stubEnv("SESSION_SECRET", SESSION_SECRET);
  vi.stubEnv("FAMILY_CODES_REVOKED", "");
  vi.stubEnv("NODE_ENV", "production");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("POST /api/session", () => {
  it("sets an httpOnly family cookie for a right code typed loosely", async () => {
    const typed = ` ${CODE.toLowerCase().replace("-", " ")} `;
    const response = await (await route())(post({ code: typed }));
    expect(response.status).toBe(200);
    const cookie = response.cookies.get(ACCESS_COOKIE_NAME);
    expect(cookie?.httpOnly).toBe(true);
    expect(cookie?.secure).toBe(true);
    expect(cookie?.sameSite).toBe("lax");
    expect(cookie?.path).toBe("/");
    expect(cookie?.maxAge).toBe(365 * 24 * 60 * 60);
    expect(cookie?.value.split(".")[2]).toBe(FAMILY);
    expect(cookie?.value).not.toContain(CODE.split("-")[1]);
  });

  it("answers a revoked family's right code like a wrong one", async () => {
    vi.stubEnv("FAMILY_CODES_REVOKED", FAMILY);
    const response = await (await route())(post({ code: CODE }));
    expect(response.status).toBe(401);
    expect(response.cookies.get(ACCESS_COOKIE_NAME)).toBeUndefined();
  });

  it("refuses a code whose signature belongs to another family", async () => {
    const other = await familyCode(CODE_SECRET, OTHER_FAMILY);
    const forged = `${FAMILY}-${other.split("-")[1]}`;
    expect((await (await route())(post({ code: forged }))).status).toBe(401);
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
    vi.stubEnv("FAMILY_CODE_SECRET", "");
    expect((await (await route())(post({ code: CODE }))).status).toBe(503);
    vi.stubEnv("SESSION_SECRET", "");
    vi.stubEnv("NODE_ENV", "development");
    expect((await (await route())(post({ code: CODE }))).status).toBe(404);
  });
});

describe("GET /api/session", () => {
  it("gives the family id and code of the device's cookie, never cached", async () => {
    const cookie = await issueSessionToken(gateConfig(), FAMILY);
    const response = await (await getRoute())(get(cookie));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({ familyId: FAMILY, code: CODE });
  });

  it("answers 401 without a valid cookie", async () => {
    const handler = await getRoute();
    expect((await handler(get())).status).toBe(401);
    expect((await handler(get("v2.1.OWL4K7MQ.00.AA"))).status).toBe(401);
    const stale = await issueSessionToken(
      gateConfig({ codeSecret: `${CODE_SECRET}-old` }),
      FAMILY,
    );
    expect((await handler(get(stale))).status).toBe(401);
  });

  it("answers 401 for a revoked family's cookie", async () => {
    const cookie = await issueSessionToken(gateConfig(), FAMILY);
    vi.stubEnv("FAMILY_CODES_REVOKED", FAMILY);
    expect((await (await getRoute())(get(cookie))).status).toBe(401);
  });

  it("answers 503 when production has no valid setup, and 404 without a gate", async () => {
    vi.stubEnv("FAMILY_CODE_SECRET", "");
    expect((await (await getRoute())(get())).status).toBe(503);
    vi.stubEnv("SESSION_SECRET", "");
    vi.stubEnv("NODE_ENV", "development");
    expect((await (await getRoute())(get())).status).toBe(404);
  });
});
