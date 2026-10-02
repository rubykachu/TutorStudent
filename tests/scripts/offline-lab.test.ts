// @vitest-environment node
import { describe, expect, it } from "vitest";
import { OFFLINE_PORT, OFFLINE_SERVER_ENV, TEST_PORT } from "../../e2e/targets";
import {
  filesNamingOrigin,
  labEnv,
  mainTreeRoot,
  parseLabArgs,
} from "../../scripts/lib/offline-lab";

describe("parseLabArgs", () => {
  it("defaults to HEAD on the offline port, serving until interrupted", () => {
    expect(parseLabArgs([])).toEqual({
      ref: "HEAD",
      port: OFFLINE_PORT,
      overlay: null,
      setup: [],
      command: [],
    });
  });

  it("takes the options and the command after --", () => {
    expect(
      parseLabArgs([
        "--ref",
        "abc123",
        "--port",
        "3610",
        "--overlay",
        "/tmp/o",
        "--setup",
        "pnpm add x",
        "--",
        "playwright",
        "test",
      ]),
    ).toEqual({
      ref: "abc123",
      port: 3610,
      overlay: "/tmp/o",
      setup: ["pnpm add x"],
      command: ["playwright", "test"],
    });
  });

  it("rejects a port that is not a number", () => {
    expect(() => parseLabArgs(["--port", "web"])).toThrow("--port");
  });
});

describe("the lab environment", () => {
  it("serves on its own port, apart from the dev servers", () => {
    expect(OFFLINE_PORT).toBe(TEST_PORT + 500);
  });

  it("overrides every setting that could reach a real service", () => {
    const env = labEnv({
      NEXT_PUBLIC_MEDIA_BASE_URL: "https://media.real.example",
      FAMILY_CODES: "real:realrealreal",
      SESSION_SECRET: "real-secret-real-secret-real-secret-xx",
      R2_ACCOUNT_ID: "0123456789abcdef0123456789abcdef",
      R2_ACCESS_KEY_ID: "key",
      R2_SECRET_ACCESS_KEY: "secret",
      R2_PRIVATE_BUCKET: "tutor-progress",
      SYNC_STORE: "fs:/somewhere",
      NEXT_PUBLIC_OFFLINE_ENABLED: "",
      NEXT_PUBLIC_OFFLINE_KILL_SWITCH: "1",
    });
    expect(env.NODE_ENV).toBe("production");
    expect(env.NEXT_PUBLIC_MEDIA_BASE_URL).toBe("");
    expect(env.FAMILY_CODES).toBe(OFFLINE_SERVER_ENV.FAMILY_CODES);
    expect(env.SESSION_SECRET).toBe(OFFLINE_SERVER_ENV.SESSION_SECRET);
    for (const name of [
      "R2_ACCOUNT_ID",
      "R2_ACCESS_KEY_ID",
      "R2_SECRET_ACCESS_KEY",
      "R2_PRIVATE_BUCKET",
      "SYNC_STORE",
    ]) {
      expect(env[name]).toBe("");
    }
    expect(env.CONTENT_INCLUDE_FIXTURE).toBe("1");
    // The lab builds with offline support on, whatever the shell says.
    expect(env.NEXT_PUBLIC_OFFLINE_ENABLED).toBe("1");
    expect(env.NEXT_PUBLIC_OFFLINE_KILL_SWITCH).toBe("");
  });
});

describe("filesNamingOrigin", () => {
  const files = [
    { path: "chunks/a.js", text: 'fetch("https://media.real.example/v.mp4")' },
    { path: "chunks/b.js", text: "nothing here" },
  ];

  it("lists the files that name the origin", () => {
    expect(filesNamingOrigin(files, "https://media.real.example")).toEqual([
      "chunks/a.js",
    ]);
  });

  it("finds nothing when no origin is configured", () => {
    expect(filesNamingOrigin(files, "")).toEqual([]);
  });
});

describe("mainTreeRoot", () => {
  it("is the first worktree of the list, whichever one runs the lab", () => {
    const exec = () => ({
      status: 0,
      stderr: "",
      stdout:
        "worktree /work/main\nHEAD abc\nbranch refs/heads/main\n\nworktree /tmp/other\nHEAD def\ndetached\n",
    });
    expect(mainTreeRoot(exec, "/tmp/other")).toBe("/work/main");
  });

  it("falls back to the given root when git says nothing", () => {
    const exec = () => ({ status: 1, stdout: "", stderr: "no" });
    expect(mainTreeRoot(exec, "/tmp/here")).toBe("/tmp/here");
  });
});
