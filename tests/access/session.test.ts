import { describe, expect, it } from "vitest";
import { matchCode, normalizeCode } from "@/access/code";
import type { AccessConfig } from "@/access/env";
import {
  issueSessionToken,
  resolveFamily,
  sessionMaxAgeSeconds,
  verifySessionToken,
} from "@/access/session";

const SECRET = "a-secret-of-at-least-thirty-two-characters";
const CODE = "saobien4k7m";
const NOW = Date.UTC(2026, 9, 1);

describe("normalizeCode", () => {
  it("ignores case, spaces and dashes", () => {
    expect(normalizeCode(" Sao-Bien 4K7M ")).toBe(CODE);
  });
});

describe("matchCode", () => {
  it("returns the matching code among several", () => {
    expect(matchCode("mattroi9x2z", [CODE, "mattroi9x2z"])).toBe("mattroi9x2z");
  });

  it("returns null for a wrong or empty input", () => {
    expect(matchCode("saobien4k7", [CODE])).toBeNull();
    expect(matchCode("", [CODE])).toBeNull();
  });
});

describe("session token", () => {
  it("is accepted for its code, secret and time", async () => {
    const token = await issueSessionToken(SECRET, CODE, NOW);
    expect(await verifySessionToken(SECRET, [CODE], token, NOW + 1000)).toBe(
      true,
    );
  });

  it("holds neither the code nor anything readable about it", async () => {
    const token = await issueSessionToken(SECRET, CODE, NOW);
    expect(token).not.toContain(CODE);
  });

  it("expires after the session length", async () => {
    const token = await issueSessionToken(SECRET, CODE, NOW);
    const late = NOW + sessionMaxAgeSeconds() * 1000;
    expect(await verifySessionToken(SECRET, [CODE], token, late - 1000)).toBe(
      true,
    );
    expect(await verifySessionToken(SECRET, [CODE], token, late)).toBe(false);
  });

  it("stops when its code is removed, while another family's token stays", async () => {
    const mine = await issueSessionToken(SECRET, CODE, NOW);
    const other = await issueSessionToken(SECRET, "mattroi9x2z", NOW);
    const remaining = ["mattroi9x2z"];
    expect(await verifySessionToken(SECRET, remaining, mine, NOW)).toBe(false);
    expect(await verifySessionToken(SECRET, remaining, other, NOW)).toBe(true);
  });

  it("stops when the secret changes", async () => {
    const token = await issueSessionToken(SECRET, CODE, NOW);
    expect(await verifySessionToken(`${SECRET}-new`, [CODE], token, NOW)).toBe(
      false,
    );
  });

  it("rejects a forged, edited or malformed token", async () => {
    const token = await issueSessionToken(SECRET, CODE, NOW);
    const [version, expires, fingerprint, signature] = token.split(".");
    const later = Number(expires) + 10_000;
    for (const bad of [
      undefined,
      "",
      "garbage",
      `${version}.${later}.${fingerprint}.${signature}`,
      `${version}.${expires}.${fingerprint}.${signature.slice(0, -2)}AA`,
      `v2.${expires}.${fingerprint}.${signature}`,
      `${version}.${expires}.${fingerprint}.!!!`,
    ]) {
      expect(await verifySessionToken(SECRET, [CODE], bad, NOW)).toBe(false);
    }
  });
});

describe("resolveFamily", () => {
  const config = (families: [string, string][]): AccessConfig => ({
    mode: "gate",
    secret: SECRET,
    codes: [CODE, "mattroi9x2z"],
    families: new Map(families),
  });

  it("returns the family of the entry the cookie came from", async () => {
    const token = await issueSessionToken(SECRET, CODE, NOW);
    const named = config([
      [CODE, "nha-minh"],
      ["mattroi9x2z", "nha-an"],
    ]);
    expect(await resolveFamily(named, token, NOW)).toBe("nha-minh");
  });

  it("resolves a cookie issued for a bare code once the entry gains a name", async () => {
    const token = await issueSessionToken(SECRET, CODE, NOW);
    expect(await resolveFamily(config([]), token, NOW)).toBeNull();
    expect(await resolveFamily(config([[CODE, "nha-minh"]]), token, NOW)).toBe(
      "nha-minh",
    );
  });

  it("gives two codes of one family the same id", async () => {
    const both = config([
      [CODE, "nha-minh"],
      ["mattroi9x2z", "nha-minh"],
    ]);
    const a = await issueSessionToken(SECRET, CODE, NOW);
    const b = await issueSessionToken(SECRET, "mattroi9x2z", NOW);
    expect(await resolveFamily(both, a, NOW)).toBe("nha-minh");
    expect(await resolveFamily(both, b, NOW)).toBe("nha-minh");
  });

  it("returns null for a removed code, no cookie, or an open gate", async () => {
    const token = await issueSessionToken(SECRET, CODE, NOW);
    const removed: AccessConfig = {
      ...config([["mattroi9x2z", "nha-an"]]),
      codes: ["mattroi9x2z"],
    } as AccessConfig;
    expect(await resolveFamily(removed, token, NOW)).toBeNull();
    expect(
      await resolveFamily(config([[CODE, "nha-minh"]]), undefined),
    ).toBeNull();
    expect(await resolveFamily({ mode: "open" }, token, NOW)).toBeNull();
  });
});
