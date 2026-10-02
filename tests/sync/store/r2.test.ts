// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { SYNC_STORE_TIMEOUT_MS } from "@/lib/config";
import { bareEtag, createR2Store, R2Error } from "@/sync/store/r2";
import { createTestStore } from "@/sync/store/test-store";
import { runStoreContract } from "./contract";
import { createFakeS3 } from "./fake-s3";

const config = {
  accountId: "0123456789abcdef0123456789abcdef",
  accessKeyId: "AKIDEXAMPLE",
  secretAccessKey: "secret-key-for-tests-only",
  bucket: "tutor-progress",
};

function fakeStore(options = {}) {
  const bucket = createFakeS3(config.bucket);
  return {
    bucket,
    store: createR2Store(config, { ...options, fetch: bucket.fetch }),
  };
}

runStoreContract("r2 (fake bucket)", (options) => fakeStore(options).store);

describe("r2 adapter requests", () => {
  it("signs every request and addresses the bucket path-style on the account endpoint", async () => {
    const { bucket, store } = fakeStore();
    await store.put("dev/progress/fam/profile.json", "{}");
    const [sent] = bucket.seen;
    expect(sent?.url).toBe(
      `https://${config.accountId}.r2.cloudflarestorage.com/${config.bucket}/dev/progress/fam/profile.json`,
    );
    expect(sent?.headers.get("authorization")).toMatch(
      /^AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE\/\d{8}\/auto\/s3\/aws4_request/,
    );
    expect(sent?.headers.get("content-type")).toBe("application/json");
  });

  it("never puts the secret into a request", async () => {
    const { bucket, store } = fakeStore();
    await store.put("dev/a.json", "{}");
    await store.get("dev/a.json");
    for (const request of bucket.seen) {
      expect(request.url).not.toContain(config.secretAccessKey);
      expect(JSON.stringify([...request.headers])).not.toContain(
        config.secretAccessKey,
      );
    }
  });

  it("sends the etag quoted in If-Match and If-None-Match and reads it bare", async () => {
    const { bucket, store } = fakeStore();
    const { etag } = (await store.put("dev/a.json", "1")) as { etag: string };
    expect(etag).toMatch(/^[0-9a-f]{32}$/);
    await store.put("dev/a.json", "2", { ifMatch: etag });
    await store.get("dev/a.json", { ifNoneMatch: etag });
    expect(bucket.seen[1]?.headers.get("if-match")).toBe(`"${etag}"`);
    expect(bucket.seen[2]?.headers.get("if-none-match")).toBe(`"${etag}"`);
    await store.put("dev/new.json", "1", { ifNoneMatch: "*" });
    expect(bucket.seen[3]?.headers.get("if-none-match")).toBe("*");
  });

  it("encodes each key segment", async () => {
    const { bucket, store } = fakeStore();
    await store.put("dev/a b/ü.json", "1");
    expect(bucket.seen[0]?.url.endsWith("/dev/a%20b/%C3%BC.json")).toBe(true);
    expect(await store.get("dev/a b/ü.json")).toMatchObject({ body: "1" });
  });

  it("gives every request a time limit and surfaces its abort", async () => {
    const timeout = vi.spyOn(AbortSignal, "timeout");
    try {
      const aborting = (async (request: Request) => {
        expect(request.signal.aborted).toBe(false);
        throw new DOMException("timed out", "TimeoutError");
      }) as unknown as typeof fetch;
      const store = createR2Store(config, { fetch: aborting });
      await expect(store.get("dev/a.json")).rejects.toThrow("timed out");
      expect(timeout).toHaveBeenCalledWith(SYNC_STORE_TIMEOUT_MS);
    } finally {
      timeout.mockRestore();
    }
  });
});

describe("r2 adapter answers", () => {
  const answering = (
    status: number,
    headers: Record<string, string> = {},
    body = "",
  ) =>
    createR2Store(config, {
      fetch: (async () =>
        new Response(body || null, {
          status,
          headers,
        })) as unknown as typeof fetch,
    });

  it("reads a weak or quoted etag bare", () => {
    expect(bareEtag('"abc"')).toBe("abc");
    expect(bareEtag('W/"abc"')).toBe("abc");
    expect(bareEtag("abc")).toBe("abc");
  });

  it("maps 409 on a conditional write to conflict, like 412", async () => {
    expect(
      await answering(409).put("dev/a.json", "1", { ifNoneMatch: "*" }),
    ).toEqual({ conflict: true });
    expect(
      await answering(412).put("dev/a.json", "1", { ifMatch: "x" }),
    ).toEqual({ conflict: true });
  });

  it("maps a missing key under If-Match to conflict but not an unconditional 404", async () => {
    expect(
      await answering(404).put("dev/a.json", "1", { ifMatch: "x" }),
    ).toEqual({ conflict: true });
    await expect(answering(404).put("dev/a.json", "1")).rejects.toBeInstanceOf(
      R2Error,
    );
  });

  it("throws R2Error with the status and S3 code on anything else, without the body", async () => {
    const store = answering(
      403,
      {},
      "<Error><Code>AccessDenied</Code><Message>nope</Message></Error>",
    );
    const error = await store.get("dev/a.json").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(R2Error);
    expect(error).toMatchObject({ status: 403, code: "AccessDenied" });
    expect((error as Error).message).toBe("R2 answered 403 AccessDenied");
    await expect(answering(500).put("dev/a.json", "1")).rejects.toMatchObject({
      status: 500,
      code: "unknown",
    });
  });

  it("treats a 200 without an etag as an error", async () => {
    await expect(
      answering(200, {}, "{}").get("dev/a.json"),
    ).rejects.toMatchObject({ code: "MissingETag" });
    await expect(answering(200).put("dev/a.json", "1")).rejects.toMatchObject({
      code: "MissingETag",
    });
  });

  it("answers unchanged with the caller's etag when a 304 carries none", async () => {
    expect(
      await answering(304).get("dev/a.json", { ifNoneMatch: "e1" }),
    ).toEqual({ unchanged: true, etag: "e1" });
  });
});

describe("r2 test store", () => {
  it("refuses a prefix outside test/<run-id>/ before any request is made", () => {
    const bucket = createFakeS3(config.bucket);
    const make = (options: { testPrefix: string }) =>
      createR2Store(config, { ...options, fetch: bucket.fetch });
    for (const prefix of [
      "prod/",
      "dev/",
      "",
      "../",
      "test/",
      "test/../prod/",
    ]) {
      expect(() => createTestStore(prefix, make)).toThrow();
    }
    expect(bucket.seen).toHaveLength(0);
  });

  it("keeps every request under its prefix and sends none for a key outside it", async () => {
    const bucket = createFakeS3(config.bucket);
    const prefix = "test/smoke-abc123/";
    const store = createTestStore(prefix, (options) =>
      createR2Store(config, { ...options, fetch: bucket.fetch }),
    );
    await store.put(`${prefix}a.json`, "1");
    await store.delete(`${prefix}a.json`);
    for (const key of [
      "prod/a.json",
      "dev/a.json",
      "test/smoke-other1/a.json",
    ]) {
      await expect(store.get(key)).rejects.toThrow();
      await expect(store.put(key, "1")).rejects.toThrow();
      await expect(store.delete(key)).rejects.toThrow();
    }
    expect(bucket.seen.every((r) => r.url.includes(`/${prefix}`))).toBe(true);
    expect(bucket.seen).toHaveLength(2);
  });
});
