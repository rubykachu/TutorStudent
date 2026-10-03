import { describe, expect, it } from "vitest";
import {
  parseRevokedFamilies,
  readAccessConfig,
  readFamilyCodeSecret,
} from "@/access/env";
import { CODE_SECRET, FAMILY, OTHER_FAMILY, SESSION_SECRET } from "./helpers";

const BOTH = { SESSION_SECRET, FAMILY_CODE_SECRET: CODE_SECRET };

describe("readAccessConfig", () => {
  it("has no gate outside production when nothing is set", () => {
    expect(readAccessConfig({}, "development")).toEqual({ mode: "open" });
    expect(readAccessConfig({}, "test")).toEqual({ mode: "open" });
  });

  it("serves nothing in production when nothing is set", () => {
    expect(readAccessConfig({}, "production")).toEqual({
      mode: "closed",
      reason: "FAMILY_CODE_SECRET and SESSION_SECRET are not set",
    });
  });

  it("opens the gate with both secrets and no revoked family", () => {
    expect(readAccessConfig(BOTH, "production")).toEqual({
      mode: "gate",
      sessionSecret: SESSION_SECRET,
      codeSecret: CODE_SECRET,
      revoked: new Set(),
    });
  });

  it("is closed, even in dev, when only one secret is set", () => {
    expect(
      readAccessConfig({ FAMILY_CODE_SECRET: CODE_SECRET }, "development"),
    ).toEqual({ mode: "closed", reason: "SESSION_SECRET is not set" });
    expect(readAccessConfig({ SESSION_SECRET }, "development")).toEqual({
      mode: "closed",
      reason: "FAMILY_CODE_SECRET is not set",
    });
  });

  it("refuses a short secret, naming the variable but not the value", () => {
    for (const env of [
      { ...BOTH, SESSION_SECRET: "short-session" },
      { ...BOTH, FAMILY_CODE_SECRET: "short-code" },
    ]) {
      const config = readAccessConfig(env, "production");
      expect(config.mode).toBe("closed");
      expect(JSON.stringify(config)).not.toContain("short-");
    }
  });

  it("refuses the same text for both secrets", () => {
    expect(
      readAccessConfig(
        { SESSION_SECRET, FAMILY_CODE_SECRET: SESSION_SECRET },
        "production",
      ),
    ).toEqual({
      mode: "closed",
      reason: "FAMILY_CODE_SECRET must differ from SESSION_SECRET",
    });
  });

  it("reads revoked family ids in any case", () => {
    const config = readAccessConfig(
      {
        ...BOTH,
        FAMILY_CODES_REVOKED: ` ${FAMILY.toLowerCase()} , ${OTHER_FAMILY},, `,
      },
      "production",
    );
    expect(config.mode === "gate" && [...config.revoked]).toEqual([
      FAMILY,
      OTHER_FAMILY,
    ]);
  });

  it("closes the gate on a revoked entry that is not a family id", () => {
    const config = readAccessConfig(
      { ...BOTH, FAMILY_CODES_REVOKED: `${FAMILY},nha-minh` },
      "production",
    );
    expect(config).toEqual({
      mode: "closed",
      reason: "every entry of FAMILY_CODES_REVOKED must be a family id",
    });
  });

  it("no longer reads FAMILY_CODES", () => {
    expect(
      readAccessConfig({ FAMILY_CODES: "nha-minh:abcdefghijk" }, "production")
        .mode,
    ).toBe("closed");
    expect(
      readAccessConfig({ ...BOTH, FAMILY_CODES: "BAD_NAME:x" }, "production")
        .mode,
    ).toBe("gate");
  });
});

describe("readFamilyCodeSecret", () => {
  it("returns the secret or why it cannot be used", () => {
    expect(readFamilyCodeSecret({ FAMILY_CODE_SECRET: CODE_SECRET })).toEqual({
      secret: CODE_SECRET,
    });
    expect(readFamilyCodeSecret({})).toEqual({
      error: "FAMILY_CODE_SECRET is not set",
    });
    expect(readFamilyCodeSecret({ FAMILY_CODE_SECRET: "short" })).toEqual({
      error: "FAMILY_CODE_SECRET needs at least 32 characters",
    });
  });
});

describe("parseRevokedFamilies", () => {
  it("de-duplicates and accepts an empty list", () => {
    expect(parseRevokedFamilies(`${FAMILY},${FAMILY.toLowerCase()}`)).toEqual({
      ids: [FAMILY],
    });
    expect(parseRevokedFamilies(undefined)).toEqual({ ids: [] });
    expect(parseRevokedFamilies(" , ")).toEqual({ ids: [] });
  });
});
