import { afterEach, describe, expect, it, vi } from "vitest";

async function includeDraft(): Promise<boolean> {
  vi.resetModules();
  return (await import("@/lib/config")).CONTENT_INCLUDE_DRAFT;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("CONTENT_INCLUDE_DRAFT", () => {
  it("serves drafts on opt-in outside a production build only", async () => {
    vi.stubEnv("CONTENT_INCLUDE_DRAFT", "1");
    vi.stubEnv("NODE_ENV", "development");
    expect(await includeDraft()).toBe(true);

    vi.stubEnv("NODE_ENV", "production");
    expect(await includeDraft()).toBe(false);
  });

  it("is off without the opt-in", async () => {
    vi.stubEnv("CONTENT_INCLUDE_DRAFT", "");
    vi.stubEnv("NODE_ENV", "development");
    expect(await includeDraft()).toBe(false);
  });
});
