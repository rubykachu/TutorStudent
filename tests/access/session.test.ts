import { describe, expect, it } from "vitest";
import { codeSignature } from "@/access/code";
import {
  issueSessionToken,
  resolveFamily,
  sessionMaxAgeSeconds,
} from "@/access/session";
import {
  CODE_SECRET,
  FAMILY,
  gateConfig,
  OTHER_FAMILY,
  SESSION_SECRET,
} from "./helpers";

const NOW = Date.UTC(2026, 9, 1);
const gate = gateConfig();

describe("session token", () => {
  it("resolves to the family it was issued to", async () => {
    const token = await issueSessionToken(gate, FAMILY, NOW);
    expect(await resolveFamily(gate, token, NOW + 1000)).toBe(FAMILY);
  });

  it("holds the family id but neither the code nor its signature", async () => {
    const token = await issueSessionToken(gate, FAMILY, NOW);
    expect(token.split(".")[2]).toBe(FAMILY);
    expect(token).not.toContain(await codeSignature(CODE_SECRET, FAMILY));
  });

  it("expires after the session length", async () => {
    const token = await issueSessionToken(gate, FAMILY, NOW);
    const late = NOW + sessionMaxAgeSeconds() * 1000;
    expect(await resolveFamily(gate, token, late - 1000)).toBe(FAMILY);
    expect(await resolveFamily(gate, token, late)).toBeNull();
  });

  it("stops when its family is revoked, while another family's token stays", async () => {
    const mine = await issueSessionToken(gate, FAMILY, NOW);
    const other = await issueSessionToken(gate, OTHER_FAMILY, NOW);
    const revoked = gateConfig({ revoked: [FAMILY] });
    expect(await resolveFamily(revoked, mine, NOW)).toBeNull();
    expect(await resolveFamily(revoked, other, NOW)).toBe(OTHER_FAMILY);
  });

  it("stops when the family-code secret changes, since every code changes", async () => {
    const token = await issueSessionToken(gate, FAMILY, NOW);
    const rotated = gateConfig({ codeSecret: `${CODE_SECRET}-new` });
    expect(await resolveFamily(rotated, token, NOW)).toBeNull();
  });

  it("stops when the session secret changes", async () => {
    const token = await issueSessionToken(gate, FAMILY, NOW);
    const rotated = gateConfig({ sessionSecret: `${SESSION_SECRET}-new` });
    expect(await resolveFamily(rotated, token, NOW)).toBeNull();
  });

  it("rejects a forged, edited or malformed token", async () => {
    const token = await issueSessionToken(gate, FAMILY, NOW);
    const other = await issueSessionToken(gate, OTHER_FAMILY, NOW);
    const [version, expires, family, fingerprint, signature] = token.split(
      ".",
    ) as [string, string, string, string, string];
    const otherFingerprint = other.split(".")[3];
    const later = Number(expires) + 10_000;
    for (const bad of [
      undefined,
      "",
      "garbage",
      `${version}.${later}.${family}.${fingerprint}.${signature}`,
      `${version}.${expires}.${OTHER_FAMILY}.${fingerprint}.${signature}`,
      `${version}.${expires}.${family}.${otherFingerprint}.${signature}`,
      `${version}.${expires}.${family}.${fingerprint}.${signature.slice(0, -2)}AA`,
      `v1.${expires}.${family}.${fingerprint}.${signature}`,
      `v1.${expires}.${fingerprint}.${signature}`,
      `${version}.${expires}.${family}.${fingerprint}.!!!`,
    ]) {
      expect(await resolveFamily(gate, bad, NOW)).toBeNull();
    }
  });

  it("resolves nothing without the gate", async () => {
    const token = await issueSessionToken(gate, FAMILY, NOW);
    expect(await resolveFamily({ mode: "open" }, token, NOW)).toBeNull();
    expect(
      await resolveFamily({ mode: "closed", reason: "x" }, token, NOW),
    ).toBeNull();
  });
});
