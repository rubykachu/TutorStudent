// @vitest-environment node
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  MAX_CODES_PER_RUN,
  newFamilyIds,
  parseFamilyCodeArgs,
  runFamilyCode,
} from "../../scripts/lib/family-code";
import { SMOKE_FAMILY_ID } from "../../scripts/lib/release-config";
import { verifyFamilyCode } from "../../src/access/code";
import { ACCESS_COOKIE_NAME, FAMILY_ID_PATTERN } from "../../src/lib/config";

const CODE_SECRET = "a-code-secret-of-at-least-thirty-two-chars";
const SESSION_SECRET = "a-secret-of-at-least-thirty-two-characters";

async function run(argv: string[], env: Record<string, string> = {}) {
  const out: string[] = [];
  const err: string[] = [];
  const status = await runFamilyCode(argv, {
    env: { FAMILY_CODE_SECRET: CODE_SECRET, ...env },
    out: (line) => out.push(line),
    err: (line) => err.push(line),
  });
  const rows = out.map((line) => line.split("\t") as [string, string]);
  return { status, rows, out, err };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("parseFamilyCodeArgs", () => {
  it("reads --count and --id, and refuses anything else", () => {
    expect(parseFamilyCodeArgs([])).toEqual({ kind: "new", count: 1 });
    expect(parseFamilyCodeArgs(["--count", "3"])).toEqual({
      kind: "new",
      count: 3,
    });
    expect(parseFamilyCodeArgs(["--id", "owl4k7mq"])).toEqual({
      kind: "existing",
      familyId: "OWL4K7MQ",
    });
    for (const bad of [
      ["--count", "0"],
      ["--count", "1.5"],
      ["--count", String(MAX_CODES_PER_RUN + 1)],
      ["--id", "nha-minh"],
      ["--id", "OWL4K7MQ", "--count", "2"],
      ["--secret", "x"],
    ]) {
      expect(() => parseFamilyCodeArgs(bad)).toThrow();
    }
  });
});

describe("newFamilyIds", () => {
  it("never repeats an id and never hands out the smoke family's", () => {
    const draws = [SMOKE_FAMILY_ID, "OWL4K7MQ", "OWL4K7MQ", "OWL9X2ZB"];
    const ids = newFamilyIds(2, () => draws.shift() as string);
    expect(ids).toEqual(["OWL4K7MQ", "OWL9X2ZB"]);
  });
});

describe("runFamilyCode", () => {
  it("prints N new families whose codes the server verifier accepts", async () => {
    const { status, rows, err } = await run(["--count", "5"]);
    expect(status).toBe(0);
    expect(err).toEqual([]);
    expect(rows).toHaveLength(5);
    expect(new Set(rows.map(([id]) => id)).size).toBe(5);
    for (const [id, code] of rows) {
      expect(id).toMatch(FAMILY_ID_PATTERN);
      expect(await verifyFamilyCode(CODE_SECRET, code)).toBe(id);
    }
  });

  it("re-prints the same code for an existing family", async () => {
    const first = await run([]);
    const [id, code] = first.rows[0] as [string, string];
    const again = await run(["--id", id.toLowerCase()]);
    expect(again.rows).toEqual([[id, code]]);
  });

  it("warns when the family is revoked, and still prints its code", async () => {
    const { status, rows, err } = await run(["--id", "OWL4K7MQ"], {
      FAMILY_CODES_REVOKED: "OWL4K7MQ",
    });
    expect(status).toBe(0);
    expect(rows).toHaveLength(1);
    expect(err.join("\n")).toContain("FAMILY_CODES_REVOKED");
  });

  it("stops without a usable secret and never prints the secret", async () => {
    const missing = await run([], { FAMILY_CODE_SECRET: "" });
    expect(missing.status).toBe(1);
    expect(missing.out).toEqual([]);
    const short = await run([], { FAMILY_CODE_SECRET: "too-short-secret" });
    expect(short.status).toBe(1);
    expect(short.err.join("\n")).not.toContain("too-short-secret");
    const ok = await run(["--count", "3"]);
    expect([...ok.out, ...ok.err].join("\n")).not.toContain(CODE_SECRET);
  });

  it("makes codes the session route accepts", async () => {
    const { rows } = await run([]);
    const [id, code] = rows[0] as [string, string];
    vi.stubEnv("FAMILY_CODE_SECRET", CODE_SECRET);
    vi.stubEnv("SESSION_SECRET", SESSION_SECRET);
    vi.stubEnv("NODE_ENV", "production");
    vi.resetModules();
    const { POST } = await import("../../src/app/api/session/route");
    const host = "tutor.example";
    const response = await POST(
      new NextRequest(`https://${host}/api/session`, {
        method: "POST",
        headers: {
          host,
          origin: `https://${host}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ code }),
      }),
    );
    expect(response.status).toBe(200);
    expect(response.cookies.get(ACCESS_COOKIE_NAME)?.value.split(".")[2]).toBe(
      id,
    );
  });
});
