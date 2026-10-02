// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createMemoryStore } from "@/sync/store/memory";
import { R2Error } from "@/sync/store/r2";
import type { BlobStore } from "@/sync/store/types";
import { CHILD, childDoc, FAMILY, harness, request } from "./sync-helpers";

// A store that throws on every call, as the bucket does when it is down, a
// credential is refused or a request times out. The error message carries
// text that must never reach the log or the answer.
const LEAKY_MESSAGE = "https://acct.r2.cloudflarestorage.com/bucket/key body";

function throwing(error: Error): BlobStore {
  const inner = createMemoryStore();
  return {
    ...inner,
    get: async () => {
      throw error;
    },
    put: async () => {
      throw error;
    },
  };
}

describe("/api/sync when the store throws", () => {
  it("answers a read with JSON 500 server and no-store, and logs the bucket's status without the message", async () => {
    const h = harness({ store: throwing(new R2Error(403, "AccessDenied")) });
    const response = await h.service.get(await request("GET", "?doc=profile"));
    expect(response.status).toBe(500);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({ error: "server" });
    expect(h.logs).toEqual([
      {
        route: "GET",
        familyId: FAMILY,
        doc: "profile",
        status: 500,
        bytes: null,
        event: "exception",
        detail: "R2 403 AccessDenied",
      },
    ]);
  });

  it("logs only the error's name for any other failure, such as a timeout", async () => {
    const timeout = new Error(LEAKY_MESSAGE);
    timeout.name = "TimeoutError";
    const h = harness({ store: throwing(timeout) });
    const response = await h.service.put(
      await request("PUT", `?child=${CHILD}`, {
        body: { doc: childDoc(), ifNoneMatch: "*" },
      }),
    );
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "server" });
    expect(h.logs).toHaveLength(1);
    expect(h.logs[0]).toMatchObject({
      route: "PUT",
      familyId: FAMILY,
      doc: "child",
      status: 500,
      event: "exception",
      detail: "TimeoutError",
    });
    expect(JSON.stringify(h.logs)).not.toContain("cloudflarestorage");
  });
});
