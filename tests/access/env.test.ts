import { describe, expect, it } from "vitest";
import { readAccessConfig } from "@/access/env";

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
