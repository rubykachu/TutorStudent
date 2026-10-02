import { describe, expect, it } from "vitest";
import type { AccessConfig } from "@/access/env";
import { decideAccess, PUBLIC_FILE_PATHS, safeNextPath } from "@/access/gate";
import { issueSessionToken } from "@/access/session";
import { BRAND_PUBLIC_PATHS } from "@/lib/brand";
import { WORKER_PATH } from "@/offline/config";

const SECRET = "a-secret-of-at-least-thirty-two-characters";
const CODE = "saobien4k7m";
const gate: AccessConfig = {
  mode: "gate",
  secret: SECRET,
  codes: [CODE],
  families: new Map(),
};

async function request(
  pathname: string,
  options: { search?: string; unlocked?: boolean } = {},
) {
  const token = options.unlocked
    ? await issueSessionToken(SECRET, CODE)
    : undefined;
  return { pathname, search: options.search ?? "", token };
}

describe("decideAccess", () => {
  it("sends a visitor without the cookie to /unlock and remembers the page", async () => {
    expect(
      await decideAccess(
        await request("/lessons/luy-thua", { search: "?intro=1" }),
        gate,
      ),
    ).toEqual({
      kind: "redirect",
      to: "/unlock?next=%2Flessons%2Fluy-thua%3Fintro%3D1",
    });
  });

  it("lets a device with the cookie through everywhere", async () => {
    for (const path of [
      "/",
      "/parent",
      "/content/index.json",
      "/sounds/button.m4a",
    ]) {
      expect(
        await decideAccess(await request(path, { unlocked: true }), gate),
      ).toEqual({ kind: "allow" });
    }
  });

  it("answers files and API calls with a status, not a page", async () => {
    for (const path of [
      "/content/index.json",
      "/sounds/button.m4a",
      "/api/other",
    ]) {
      expect(await decideAccess(await request(path), gate)).toEqual({
        kind: "deny",
      });
    }
  });

  it("serves the unlock page and the session API without the cookie", async () => {
    expect(await decideAccess(await request("/unlock"), gate)).toEqual({
      kind: "allow",
    });
    expect(await decideAccess(await request("/api/session"), gate)).toEqual({
      kind: "allow",
    });
  });

  it("serves the manifest, the icons and the share image without the cookie, and nothing else near them", async () => {
    for (const path of BRAND_PUBLIC_PATHS) {
      expect(await decideAccess(await request(path), gate)).toEqual({
        kind: "allow",
      });
    }
    // A look-alike path, another file in the same folder and a query on a
    // page stay behind the gate.
    for (const path of [
      "/manifest.webmanifest/x",
      "/brand/other.png",
      "/brand/",
      "/brand/share.png.map",
      "/brand/../content/index.json",
      "/opengraph-image",
    ]) {
      expect((await decideAccess(await request(path), gate)).kind).not.toBe(
        "allow",
      );
    }
    expect(
      (await decideAccess(await request("/", { search: "?icons" }), gate)).kind,
    ).toBe("redirect");
  });

  it("lets exactly the brand files and the worker script through without the cookie", async () => {
    expect(PUBLIC_FILE_PATHS).toEqual([...BRAND_PUBLIC_PATHS, WORKER_PATH]);
    expect(await decideAccess(await request(WORKER_PATH), gate)).toEqual({
      kind: "allow",
    });
    for (const path of [
      `${WORKER_PATH}.map`,
      `${WORKER_PATH}/x`,
      "/sw.jsx",
      "/serwist/sw.js",
      "/worker.js",
    ]) {
      expect((await decideAccess(await request(path), gate)).kind).not.toBe(
        "allow",
      );
    }
  });

  it("sends an unlocked device away from /unlock to where it was going", async () => {
    expect(
      await decideAccess(
        await request("/unlock", { search: "?next=%2Fparent", unlocked: true }),
        gate,
      ),
    ).toEqual({ kind: "redirect", to: "/parent" });
    expect(
      await decideAccess(await request("/unlock", { unlocked: true }), gate),
    ).toEqual({ kind: "redirect", to: "/" });
  });

  it("treats a cookie for a removed code as no cookie", async () => {
    const stale: AccessConfig = { ...gate, codes: ["mattroi9x2z"] };
    expect(
      (await decideAccess(await request("/", { unlocked: true }), stale)).kind,
    ).toBe("redirect");
  });

  it("has no gate when open, and serves nothing when closed", async () => {
    expect(await decideAccess(await request("/"), { mode: "open" })).toEqual({
      kind: "allow",
    });
    expect(
      await decideAccess(await request("/"), { mode: "closed", reason: "x" }),
    ).toEqual({ kind: "unavailable", reason: "x" });
    expect(
      (
        await decideAccess(await request("/api/session"), {
          mode: "closed",
          reason: "x",
        })
      ).kind,
    ).toBe("unavailable");
  });
});

describe("safeNextPath", () => {
  it("keeps paths inside the app", () => {
    expect(safeNextPath("/lessons/luy-thua?intro=1")).toBe(
      "/lessons/luy-thua?intro=1",
    );
  });

  it("falls back to home for anything else", () => {
    for (const bad of [
      null,
      undefined,
      "",
      "https://evil.example",
      "//evil.example",
      "/\\evil.example",
      "javascript:alert(1)",
      "/unlock",
      "/unlock?next=/",
      "/api/session",
    ]) {
      expect(safeNextPath(bad)).toBe("/");
    }
  });
});
