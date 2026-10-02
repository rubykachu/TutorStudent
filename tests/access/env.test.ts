import { describe, expect, it } from "vitest";
import { parseFamilyCodes, readAccessConfig } from "@/access/env";

const SECRET = "s".repeat(32);

describe("readAccessConfig", () => {
  it("has no gate outside production when nothing is set", () => {
    expect(readAccessConfig({}, "development")).toEqual({ mode: "open" });
    expect(readAccessConfig({}, "test")).toEqual({ mode: "open" });
  });

  it("serves nothing in production when nothing is set", () => {
    expect(readAccessConfig({}, "production").mode).toBe("closed");
  });

  it("normalises, de-duplicates and keeps several codes", () => {
    const config = readAccessConfig(
      {
        FAMILY_CODES: "Sao-Bien 4k7m, saobien4k7m ,  mat-troi-9x2z",
        SESSION_SECRET: SECRET,
      },
      "production",
    );
    expect(config).toEqual({
      mode: "gate",
      secret: SECRET,
      codes: ["saobien4k7m", "mattroi9x2z"],
      families: new Map(),
    });
  });

  it("is closed, even in dev, when only half is set", () => {
    expect(
      readAccessConfig({ FAMILY_CODES: "abcdefghijk" }, "development").mode,
    ).toBe("closed");
    expect(
      readAccessConfig({ SESSION_SECRET: SECRET }, "development").mode,
    ).toBe("closed");
  });

  it("refuses a short secret and a short code", () => {
    expect(
      readAccessConfig(
        { FAMILY_CODES: "abcdefghijk", SESSION_SECRET: "short" },
        "production",
      ).mode,
    ).toBe("closed");
    // 9 letters once dashes are dropped.
    expect(
      readAccessConfig(
        { FAMILY_CODES: "abc-def-ghi", SESSION_SECRET: SECRET },
        "production",
      ).mode,
    ).toBe("closed");
    expect(
      readAccessConfig(
        { FAMILY_CODES: "abcdefghijk,short", SESSION_SECRET: SECRET },
        "production",
      ).mode,
    ).toBe("closed");
  });
});

describe("named family codes", () => {
  const env = (codes: string) => ({
    FAMILY_CODES: codes,
    SESSION_SECRET: SECRET,
  });

  it("splits at the first colon and keeps the code as a bare one would be", () => {
    const named = readAccessConfig(
      env("nha-minh: Sao-Bien 4k7m"),
      "production",
    );
    const bare = readAccessConfig(env("Sao-Bien 4k7m"), "production");
    expect(named).toMatchObject({ mode: "gate", codes: ["saobien4k7m"] });
    expect(bare).toMatchObject({ mode: "gate", codes: ["saobien4k7m"] });
    expect(named.mode === "gate" && named.families.get("saobien4k7m")).toBe(
      "nha-minh",
    );
    expect(bare.mode === "gate" && bare.families.size).toBe(0);
  });

  it("lets a family have several codes, and a bare code beside named ones", () => {
    const config = readAccessConfig(
      env("nha-minh:saobien4k7m, nha-minh:mattroi9x2z, baresaobien77"),
      "production",
    );
    expect(config).toMatchObject({
      mode: "gate",
      codes: ["saobien4k7m", "mattroi9x2z", "baresaobien77"],
    });
    expect(config.mode === "gate" && [...config.families]).toEqual([
      ["saobien4k7m", "nha-minh"],
      ["mattroi9x2z", "nha-minh"],
    ]);
  });

  it("accepts the same code listed twice under one family", () => {
    const config = readAccessConfig(
      env("nha-minh:saobien4k7m, nha-minh:Sao-Bien-4k7m"),
      "production",
    );
    expect(config).toMatchObject({ mode: "gate", codes: ["saobien4k7m"] });
  });

  it("names the family when the same code is also listed bare", () => {
    for (const list of [
      "saobien4k7m,nha-minh:saobien4k7m",
      "nha-minh:saobien4k7m,saobien4k7m",
    ]) {
      const config = readAccessConfig(env(list), "production");
      expect(config.mode === "gate" && config.families.get("saobien4k7m")).toBe(
        "nha-minh",
      );
    }
  });

  it("closes the gate when one code sits under two family names", () => {
    const config = readAccessConfig(
      env("nha-minh:saobien4k7m, nha-an:Sao-Bien-4k7m"),
      "production",
    );
    expect(config).toEqual({
      mode: "closed",
      reason: "one family code is listed under two family names",
    });
  });

  it("closes the gate on a bad family name, without echoing the entry", () => {
    for (const name of ["NhaMinh", "ab", "nha_minh", "a".repeat(33), ""]) {
      const config = readAccessConfig(env(`${name}:saobien4k7m`), "production");
      expect(config.mode).toBe("closed");
      expect(JSON.stringify(config)).not.toContain("saobien4k7m");
    }
  });

  it("parses entries for other readers of the variable", () => {
    expect(parseFamilyCodes("nha-minh:Sao-Bien 4k7m, other-code ,, ")).toEqual({
      entries: [
        { familyId: "nha-minh", code: "saobien4k7m" },
        { familyId: null, code: "othercode" },
      ],
    });
    expect(parseFamilyCodes(undefined)).toEqual({ entries: [] });
  });
});
