import { describe, expect, it } from "vitest";
import { clientKey } from "@/access/client-key";

const req = (headers: Record<string, string>) =>
  new Request("https://tutor.example/", { headers });

describe("clientKey", () => {
  it("takes the first forwarded address, then x-real-ip, then unknown", () => {
    expect(clientKey(req({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" }))).toBe(
      "1.2.3.4",
    );
    expect(clientKey(req({ "x-real-ip": "9.9.9.9" }))).toBe("9.9.9.9");
    expect(clientKey(req({}))).toBe("unknown");
  });
});
