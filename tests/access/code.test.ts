import { describe, expect, it } from "vitest";
import {
  codeSignature,
  familyCode,
  normalizeCode,
  normalizeFamilyId,
  randomFamilyId,
  verifyFamilyCode,
} from "@/access/code";
import {
  FAMILY_CODE_ALPHABET,
  FAMILY_CODE_SIGNATURE_LENGTH,
  FAMILY_ID_PATTERN,
} from "@/lib/config";
import { CODE_SECRET, FAMILY, OTHER_FAMILY } from "./helpers";

const CODE_FORMAT = new RegExp(
  `^OWL[${FAMILY_CODE_ALPHABET}]{5}-[${FAMILY_CODE_ALPHABET}]{${FAMILY_CODE_SIGNATURE_LENGTH}}$`,
);

describe("family code format", () => {
  it("is OWL, the family part, a dash and the signature, all uppercase", async () => {
    const code = await familyCode(CODE_SECRET, FAMILY);
    expect(code).toMatch(CODE_FORMAT);
    expect(code.startsWith(`${FAMILY}-`)).toBe(true);
    expect(code.replace("-", "")).toHaveLength(16);
    expect(code).toBe(code.toUpperCase());
  });

  it("never uses I, L, O or U after the prefix", () => {
    expect(FAMILY_CODE_ALPHABET).toHaveLength(32);
    expect(FAMILY_CODE_ALPHABET).not.toMatch(/[ILOU]/);
  });

  it("is the same for the same id and secret, different for another", async () => {
    const a = await familyCode(CODE_SECRET, FAMILY);
    expect(await familyCode(CODE_SECRET, FAMILY)).toBe(a);
    expect(await familyCode(`${CODE_SECRET}-new`, FAMILY)).not.toBe(a);
    expect(await familyCode(CODE_SECRET, OTHER_FAMILY)).not.toBe(a);
  });

  it("refuses to sign something that is not a family id", async () => {
    await expect(codeSignature(CODE_SECRET, "nha-minh")).rejects.toThrow();
  });
});

describe("randomFamilyId", () => {
  it("draws ids that match the family id pattern", () => {
    const ids = Array.from({ length: 200 }, () => randomFamilyId());
    for (const id of ids) expect(id).toMatch(FAMILY_ID_PATTERN);
    expect(new Set(ids).size).toBeGreaterThan(190);
  });
});

describe("normalizeCode", () => {
  it("ignores case, spaces and dashes of any kind", () => {
    expect(normalizeCode(" owl4k7mq - 9qx2 p8rt ")).toBe("OWL4K7MQ9QX2P8RT");
    expect(normalizeCode("OWL4K7MQ–9QX2P8RT")).toBe("OWL4K7MQ9QX2P8RT");
  });

  it("reads O as 0 and I, L as 1 after the prefix only", () => {
    expect(normalizeCode("owl4k7mq-oil0")).toBe("OWL4K7MQ0110");
  });
});

describe("normalizeFamilyId", () => {
  it("accepts an id in any case and refuses anything else", () => {
    expect(normalizeFamilyId(" owl4k7mq ")).toBe(FAMILY);
    for (const bad of ["nha-minh", "OWL4K7M", "OWL4K7MQQ", "OWL4K7MO", ""]) {
      expect(normalizeFamilyId(bad)).toBeNull();
    }
  });
});

describe("verifyFamilyCode", () => {
  it("returns the family of a right code typed loosely", async () => {
    const code = await familyCode(CODE_SECRET, FAMILY);
    for (const typed of [
      code,
      code.replace("-", ""),
      code.toLowerCase(),
      ` ${code.toLowerCase().replace("-", " ")} `,
    ]) {
      expect(await verifyFamilyCode(CODE_SECRET, typed)).toBe(FAMILY);
    }
  });

  it("refuses a wrong signature, a swapped family part and another secret", async () => {
    const code = await familyCode(CODE_SECRET, FAMILY);
    const other = await familyCode(CODE_SECRET, OTHER_FAMILY);
    const signature = code.split("-")[1] as string;
    const last = signature.at(-1) === "0" ? "1" : "0";
    for (const bad of [
      `${FAMILY}-${signature.slice(0, -1)}${last}`,
      `${FAMILY}-${other.split("-")[1]}`,
      `${OTHER_FAMILY}-${signature}`,
      `${FAMILY}-${signature.slice(0, -1)}`,
      `${FAMILY}-${signature}0`,
      "",
      "OWL",
      "saobien4k7m",
    ]) {
      expect(await verifyFamilyCode(CODE_SECRET, bad)).toBeNull();
    }
    expect(await verifyFamilyCode(`${CODE_SECRET}-new`, code)).toBeNull();
  });
});
