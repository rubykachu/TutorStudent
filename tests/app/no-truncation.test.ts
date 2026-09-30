import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Titles and names wrap onto as many lines as they need: a child must never
// meet a cut-off lesson title ("Nếu cậu muốn…" is a real title, so an
// ellipsis drawn by CSS would be read as part of it). Guards every screen
// against the Tailwind utilities that cut text short.
const SRC = path.join(process.cwd(), "src");
const TRUNCATING = /\b(truncate|line-clamp-\d+|text-ellipsis|text-clip)\b/;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(tsx|ts|css)$/.test(entry.name) ? [full] : [];
  });
}

describe("text truncation", () => {
  it("no screen cuts text short with an ellipsis or a line clamp", () => {
    const offenders = sourceFiles(SRC).flatMap((file) =>
      readFileSync(file, "utf8")
        .split("\n")
        .map((line, i) => ({ line, i }))
        .filter(({ line }) => TRUNCATING.test(line))
        .map(({ line, i }) => `${path.relative(SRC, file)}:${i + 1} ${line}`),
    );
    expect(offenders).toEqual([]);
  });
});
