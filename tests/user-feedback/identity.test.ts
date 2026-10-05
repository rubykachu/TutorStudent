import { describe, expect, it } from "vitest";
import { appVersion, familyPseudonym } from "@/user-feedback/identity";
import { FAMILY, OTHER_FAMILY, SESSION_SECRET } from "../access/helpers";

describe("familyPseudonym", () => {
  it("is 12 hex, stable, and differs per family and per secret", async () => {
    const a = await familyPseudonym(SESSION_SECRET, FAMILY);
    expect(a).toMatch(/^[0-9a-f]{12}$/);
    expect(await familyPseudonym(SESSION_SECRET, FAMILY)).toBe(a);
    expect(await familyPseudonym(SESSION_SECRET, OTHER_FAMILY)).not.toBe(a);
    expect(await familyPseudonym(`${SESSION_SECRET}x`, FAMILY)).not.toBe(a);
    expect(a).not.toContain(FAMILY.toLowerCase());
  });
});

describe("appVersion", () => {
  it("is the short SHA or dev", () => {
    expect(
      appVersion({
        APP_COMMIT_SHA: "5fc3656aa1b2c3d4e5f60718293a4b5c6d7e8f90",
      }),
    ).toBe("5fc3656");
    expect(appVersion({})).toBe("dev");
    expect(appVersion({ APP_COMMIT_SHA: "not a sha" })).toBe("dev");
  });
});
