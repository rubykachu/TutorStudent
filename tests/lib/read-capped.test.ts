// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readCapped } from "@/lib/read-capped";

function streamed(text: string): Request {
  const bytes = new TextEncoder().encode(text);
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(bytes.slice(0, 3));
      controller.enqueue(bytes.slice(3));
      controller.close();
    },
  });
  return new Request("https://tutor.example/", {
    method: "POST",
    body,
    duplex: "half",
  } as RequestInit);
}

describe("readCapped", () => {
  it("reads a body within the cap", async () => {
    expect(await readCapped(streamed("héllo"), 10)).toBe("héllo");
  });

  it("refuses a body over the cap with and without content-length", async () => {
    expect(await readCapped(streamed("x".repeat(11)), 10)).toBeNull();
    const declared = new Request("https://tutor.example/", {
      method: "POST",
      body: "x".repeat(11),
      headers: { "content-length": "11" },
    });
    expect(await readCapped(declared, 10)).toBeNull();
  });
});
