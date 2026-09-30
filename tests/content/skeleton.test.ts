// @vitest-environment node
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, expect, it } from "vitest";
import { SKELETON_ID, writeContentRoot } from "./helpers";

let root: string;

beforeEach(() => {
  root = mkdtempSync(path.join(tmpdir(), "tutor-skeleton-"));
});

afterEach(() => rmSync(root, { recursive: true, force: true }));

it("the lesson-author skeleton passes content:check as copied", () => {
  writeContentRoot(root);
  const tsx = path.join(process.cwd(), "node_modules", ".bin", "tsx");
  const result = spawnSync(
    tsx,
    [path.join("scripts", "content-check.ts"), "--root", root, "--stats"],
    { encoding: "utf8" },
  );
  expect(result.stdout).toContain(`${SKELETON_ID} (`);
  expect(result.stdout).toContain("0 errors");
  expect(result.status).toBe(0);
  // Only what a fresh lesson cannot avoid: ids not locked yet, and the
  // fixture visuals that stand in until the lesson's own are drawn.
  const unexpected = result.stderr
    .split("\n")
    .filter(Boolean)
    .filter(
      (line) =>
        !line.endsWith("[placeholder]") &&
        !line.includes("not in ids.lock.json"),
    );
  expect(unexpected).toEqual([]);
});
