// @vitest-environment node
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  findBundleLeaks,
  readClientFiles,
  SERVER_ONLY_ENV_NAMES,
} from "../../scripts/lib/bundle-check";

const ENV = {
  R2_ACCOUNT_ID: "0123456789abcdef0123456789abcdef",
  R2_ACCESS_KEY_ID: "access-key-id-0001",
  R2_SECRET_ACCESS_KEY: "secret-access-key-0001",
  R2_PRIVATE_BUCKET: "tutor-progress",
  SESSION_SECRET: "a-secret-of-at-least-thirty-two-characters",
  FAMILY_CODE_SECRET: "a-code-secret-of-at-least-thirty-two-chars",
  GITHUB_FEEDBACK_TOKEN: "github_pat_test_feedback_token_0001",
};

const file = (text: string) => ({ path: "chunks/app.js", text });

describe("findBundleLeaks", () => {
  it("passes a bundle that holds no server variable", () => {
    // The export format string equals the bucket name and must not count.
    expect(
      findBundleLeaks([file('const format="tutor-progress";')], ENV),
    ).toEqual([]);
  });

  it("reports each server-only variable named in browser code", () => {
    for (const name of SERVER_ONLY_ENV_NAMES) {
      expect(findBundleLeaks([file(`process.env.${name}`)], {})).toContainEqual(
        { file: "chunks/app.js", what: `name ${name}` },
      );
    }
  });

  it("reports a secret's value without printing it", () => {
    const leaks = findBundleLeaks(
      [file(`"${ENV.R2_SECRET_ACCESS_KEY}";"${ENV.FAMILY_CODE_SECRET}"`)],
      ENV,
    );
    expect(leaks).toEqual([
      { file: "chunks/app.js", what: "value of R2_SECRET_ACCESS_KEY" },
      { file: "chunks/app.js", what: "value of FAMILY_CODE_SECRET" },
    ]);
    expect(JSON.stringify(leaks)).not.toContain(ENV.R2_SECRET_ACCESS_KEY);
    expect(JSON.stringify(leaks)).not.toContain(ENV.FAMILY_CODE_SECRET);
  });

  it("reports the feedback token by name and by value", () => {
    expect(
      findBundleLeaks(
        [
          file(
            `process.env.GITHUB_FEEDBACK_TOKEN;"${ENV.GITHUB_FEEDBACK_TOKEN}"`,
          ),
        ],
        ENV,
      ),
    ).toEqual([
      { file: "chunks/app.js", what: "name GITHUB_FEEDBACK_TOKEN" },
      { file: "chunks/app.js", what: "value of GITHUB_FEEDBACK_TOKEN" },
    ]);
  });

  it("skips values too short to tell apart from ordinary text", () => {
    expect(
      findBundleLeaks([file('"short"')], { SESSION_SECRET: "short" }),
    ).toEqual([]);
  });
});

describe("readClientFiles", () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(path.join(os.tmpdir(), "client-files-"));
    mkdirSync(path.join(root, "dist/static/chunks"), { recursive: true });
    mkdirSync(path.join(root, "public"), { recursive: true });
    writeFileSync(path.join(root, "dist/static/chunks/a.js"), "ok");
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("holds the static files and the worker script", () => {
    writeFileSync(path.join(root, "public/sw.js"), "worker");
    const files = readClientFiles(
      path.join(root, "dist"),
      path.join(root, "public"),
    );
    expect(files.map((f) => f.path).sort()).toEqual(["chunks/a.js", "sw.js"]);
  });

  it("works before a worker has been built", () => {
    const files = readClientFiles(
      path.join(root, "dist"),
      path.join(root, "public"),
    );
    expect(files.map((f) => f.path)).toEqual(["chunks/a.js"]);
  });

  it("fails a secret that ends up in the worker script", () => {
    writeFileSync(
      path.join(root, "public/sw.js"),
      `const k="${ENV.SESSION_SECRET}";`,
    );
    const leaks = findBundleLeaks(
      readClientFiles(path.join(root, "dist"), path.join(root, "public")),
      ENV,
    );
    expect(leaks).toEqual([{ file: "sw.js", what: "value of SESSION_SECRET" }]);
  });
});
