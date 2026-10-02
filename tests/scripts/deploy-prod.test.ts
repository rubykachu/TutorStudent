// @vitest-environment node
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  firstFamilyCode,
  parseDeployArgs,
  pickMediaKey,
  runDeploy,
  runSmokeChecks,
} from "../../scripts/lib/deploy-prod";
import { PROD_URL } from "../../scripts/lib/release-config";
import { type Exec, parseEnvFile } from "../../scripts/lib/run";
import { ACCESS_COOKIE_NAME } from "../../src/lib/config";

describe("parseDeployArgs", () => {
  it("reads --dry-run and --ref, and rejects anything else", () => {
    expect(parseDeployArgs([])).toEqual({ dryRun: false, ref: "HEAD" });
    expect(parseDeployArgs(["--dry-run"])).toEqual({
      dryRun: true,
      ref: "HEAD",
    });
    expect(parseDeployArgs(["--ref", "1e10fc2"])).toEqual({
      dryRun: false,
      ref: "1e10fc2",
    });
    expect(() => parseDeployArgs(["--ref"])).toThrow();
    expect(() => parseDeployArgs(["--force"])).toThrow();
  });
});

describe("parseEnvFile", () => {
  it("reads quoted and plain values and skips comments", () => {
    expect(parseEnvFile("# c\nA=1\nB=\"two words\"\n\nC='x'\nD=a=b")).toEqual({
      A: "1",
      B: "two words",
      C: "x",
      D: "a=b",
    });
  });
});

function fakeSite(
  overrides: Partial<Record<string, () => Response>> = {},
): typeof fetch {
  const routes: Record<string, () => Response> = {
    "GET /": () =>
      new Response(null, {
        status: 307,
        headers: { location: "/unlock?next=%2F" },
      }),
    "GET /content/index.json": () => new Response(null, { status: 401 }),
    "POST /api/session": () =>
      new Response("{}", {
        status: 200,
        headers: {
          "set-cookie": `${ACCESS_COOKIE_NAME}=tok; Path=/; HttpOnly`,
        },
      }),
    "GET media": () => new Response("x", { status: 206 }),
    "GET /api/sync": () => new Response(null, { status: 401 }),
    "GET /sw.js": () =>
      new Response("worker", {
        status: 200,
        headers: { "cache-control": "no-cache" },
      }),
    ...overrides,
  };
  return (async (url: string, init?: RequestInit) => {
    const u = new URL(url);
    const method = init?.method ?? "GET";
    const headers = (init?.headers ?? {}) as Record<string, string>;
    if (u.host === "media.test") return routes["GET media"]?.() as Response;
    if (u.pathname === "/content/index.json" && headers.cookie) {
      return new Response("{}", { status: 200 });
    }
    return routes[`${method} ${u.pathname}`]?.() as Response;
  }) as unknown as typeof fetch;
}

const input = {
  appUrl: "https://app.test",
  code: "code-1",
  mediaUrl: "https://media.test/video/a/one.mp4",
};

describe("runSmokeChecks", () => {
  it("passes all seven checks on a healthy site", async () => {
    const checks = await runSmokeChecks({ ...input, fetch: fakeSite() });
    expect(checks.map((c) => c.ok)).toEqual([
      true,
      true,
      true,
      true,
      true,
      true,
      true,
    ]);
  });

  it("fails when the worker script is cached, missing or behind the gate", async () => {
    for (const worker of [
      () =>
        new Response("worker", {
          status: 200,
          headers: { "cache-control": "public, max-age=31536000" },
        }),
      () => new Response("worker", { status: 200 }),
      () => new Response(null, { status: 401 }),
      () =>
        new Response(null, {
          status: 307,
          headers: { location: "/unlock?next=%2Fsw.js" },
        }),
    ]) {
      const checks = await runSmokeChecks({
        ...input,
        fetch: fakeSite({ "GET /sw.js": worker }),
      });
      expect(checks.filter((c) => !c.ok).map((c) => c.name)).toEqual([
        "worker script no-cache",
      ]);
    }
  });

  it("fails the login check without a code and skips the content check", async () => {
    const checks = await runSmokeChecks({
      ...input,
      code: null,
      fetch: fakeSite(),
    });
    expect(checks[2]?.ok).toBe(false);
    expect(checks[3]).toMatchObject({ ok: false });
  });

  it("fails when the sync API answers without a cookie", async () => {
    for (const status of [200, 404, 503]) {
      const checks = await runSmokeChecks({
        ...input,
        fetch: fakeSite({
          "GET /api/sync": () => new Response("{}", { status }),
        }),
      });
      expect(checks.filter((c) => !c.ok)).toEqual([
        {
          name: "sync 401 without cookie",
          ok: false,
          detail: String(status),
        },
      ]);
    }
  });

  it("fails when the gate is open and when media ignores Range", async () => {
    const checks = await runSmokeChecks({
      ...input,
      fetch: fakeSite({
        "GET /": () => new Response("page", { status: 200 }),
        "GET /content/index.json": () => new Response("{}", { status: 200 }),
        "GET media": () => new Response("x", { status: 200 }),
      }),
    });
    expect(checks.filter((c) => !c.ok).map((c) => c.name)).toEqual([
      "unlock redirect",
      "401 without cookie",
      "media 206",
    ]);
  });
});

describe("firstFamilyCode", () => {
  it("takes the code of the first entry, named or bare", () => {
    expect(firstFamilyCode("nha-minh:Sao-Bien 4k7m,nha-an:other")).toBe(
      "saobien4k7m",
    );
    expect(firstFamilyCode(" Sao-Bien 4k7m ,x")).toBe("saobien4k7m");
  });

  it("returns null when there is no usable entry", () => {
    expect(firstFamilyCode(undefined)).toBeNull();
    expect(firstFamilyCode("")).toBeNull();
    expect(firstFamilyCode("BAD_NAME:abcdefghijk")).toBeNull();
  });
});

describe("pickMediaKey", () => {
  it("returns the first mp4 of the first lesson with media", () => {
    const root = mkdtempSync(path.join(os.tmpdir(), "deploy-media-"));
    expect(pickMediaKey(root)).toBeNull();
    mkdirSync(path.join(root, "public/media/video/a"), { recursive: true });
    writeFileSync(path.join(root, "public/media/video/a/x.mp4"), "x");
    expect(pickMediaKey(root)).toBe("video/a/x.mp4");
  });
});

describe("runDeploy", () => {
  let lines: string[];
  const log = (line: string) => lines.push(line);
  beforeEach(() => {
    lines = [];
  });

  it("dry run prints the steps and executes nothing", async () => {
    const exec = vi.fn<Exec>(() => ({
      status: 0,
      stdout: "fullsha1234\n",
      stderr: "",
    }));
    const fetchSpy = vi.fn();
    const code = await runDeploy(["--dry-run", "--ref", "1e10fc2"], {
      root: "/nowhere",
      exec,
      fetch: fetchSpy as unknown as typeof fetch,
      log,
    });
    expect(code).toBe(0);
    expect(exec.mock.calls.map(([command]) => command.join(" "))).toEqual([
      "git rev-parse --verify 1e10fc2^{commit}",
    ]);
    expect(fetchSpy).not.toHaveBeenCalled();
    const out = lines.join("\n");
    expect(out).toContain("deploying 1e10fc2 = fullsha1234");
    expect(out).toContain("git worktree add --detach");
    expect(out).toContain("pnpm install --frozen-lockfile");
    expect(out).toContain("npx vercel link --yes --project tutor");
    expect(out).toContain("npx vercel deploy --prod");
    expect(out).toContain("git worktree remove --force");
    expect(out).toContain(`smoke checks against ${PROD_URL}`);
    expect(out).toContain("media 206");
  });

  it("builds in a worktree, removes it, then smoke checks", async () => {
    const root = mkdtempSync(path.join(os.tmpdir(), "deploy-root-"));
    writeFileSync(
      path.join(root, ".env.production.local"),
      "FAMILY_CODES=nha-minh:Code-1 abc,nha-an:code-2\nNEXT_PUBLIC_MEDIA_BASE_URL=https://media.test\n",
    );
    mkdirSync(path.join(root, "public/media/video/a"), { recursive: true });
    writeFileSync(path.join(root, "public/media/video/a/x.mp4"), "x");
    const calls: string[] = [];
    const exec = vi.fn<Exec>((command) => {
      calls.push(command.join(" "));
      return { status: 0, stdout: "abc123\n", stderr: "" };
    });
    const site = fakeSite();
    const logins: unknown[] = [];
    const watching = ((url: string, init?: RequestInit) => {
      if (new URL(url).pathname === "/api/session") {
        logins.push(JSON.parse(String(init?.body)));
      }
      return site(url, init);
    }) as unknown as typeof fetch;
    const code = await runDeploy(["--ref", "1e10fc2"], {
      root,
      exec,
      fetch: watching,
      log,
    });
    expect(code).toBe(0);
    // The login sends the code part of the first entry, not `nha-minh:...`.
    expect(logins).toEqual([{ code: "code1abc" }]);
    expect(calls).toContain("git rev-parse --verify 1e10fc2^{commit}");
    expect(
      calls
        .find((c) => c.startsWith("git worktree add --detach"))
        ?.endsWith(" abc123"),
    ).toBe(true);
    const order = [
      "git worktree add --detach",
      "pnpm install --frozen-lockfile",
      "vercel link --yes --project tutor",
      "vercel deploy --prod",
      "git worktree remove --force",
    ].map((part) => calls.findIndex((c) => c.includes(part)));
    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(lines.at(-1)).toContain("deploy:prod OK");
  });

  it("stops before any worktree when the ref does not resolve", async () => {
    const exec = vi.fn<Exec>(() => ({
      status: 128,
      stdout: "",
      stderr: "bad",
    }));
    const code = await runDeploy(["--ref", "nope"], {
      root: "/nowhere",
      exec,
      fetch: vi.fn() as unknown as typeof fetch,
      log,
    });
    expect(code).toBe(2);
    expect(exec).toHaveBeenCalledTimes(1);
  });

  it("removes the worktree and skips smoke checks when a step fails", async () => {
    const calls: string[] = [];
    const exec = vi.fn<Exec>((command) => {
      calls.push(command.join(" "));
      const failing = command.includes("deploy");
      return { status: failing ? 1 : 0, stdout: "abc123\n", stderr: "" };
    });
    const fetchSpy = vi.fn();
    const code = await runDeploy([], {
      root: "/nowhere",
      exec,
      fetch: fetchSpy as unknown as typeof fetch,
      log,
    });
    expect(code).toBe(1);
    expect(calls.some((c) => c.includes("git worktree remove --force"))).toBe(
      true,
    );
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(lines.at(-1)).toContain("FAILED");
  });
});
