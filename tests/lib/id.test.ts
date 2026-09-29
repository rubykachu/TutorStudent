import { describe, expect, it } from "vitest";
import { newId } from "@/lib/id";

describe("newId", () => {
  it("returns 32 lowercase hex characters", () => {
    expect(newId()).toMatch(/^[0-9a-f]{32}$/);
  });

  it("does not repeat across many calls", () => {
    const ids = new Set(Array.from({ length: 1000 }, () => newId()));
    expect(ids.size).toBe(1000);
  });

  it("works without crypto.randomUUID (non-secure http context)", () => {
    const original = crypto.randomUUID;
    Object.defineProperty(crypto, "randomUUID", {
      value: undefined,
      configurable: true,
    });
    try {
      expect(newId()).toMatch(/^[0-9a-f]{32}$/);
    } finally {
      Object.defineProperty(crypto, "randomUUID", {
        value: original,
        configurable: true,
      });
    }
  });
});
