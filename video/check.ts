import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { PROJECTS_DIR } from "./config";
import { checkLessonVoice, checkProject } from "./lib/consistency";

// Usage: pnpm video:check [<lessonId> [<name>]]
// Runs the consistency checks of `pnpm video:build` (script sentences in the
// captions, on-screen rule text, opening line, one voice per lesson) on videos already built, without voice or
// render work. Exits 1 when a video fails.

const dirs = (dir: string) =>
  readdirSync(dir).filter((f) => statSync(path.join(dir, f)).isDirectory());

function main() {
  const [lesson, name] = process.argv.slice(2);
  const targets = (lesson ? [lesson] : dirs(PROJECTS_DIR)).flatMap((l) =>
    (name ? [name] : dirs(path.join(PROJECTS_DIR, l))).map(
      (n) => [l, n] as const,
    ),
  );
  let failed = 0;
  for (const l of new Set(targets.map(([l]) => l))) {
    const issues = checkLessonVoice(l);
    console.log(`${issues.length > 0 ? "FAIL" : "ok"} ${l} (voice)`);
    for (const issue of issues) console.log(`  - ${issue}`);
    if (issues.length > 0) failed++;
  }
  for (const [l, n] of targets) {
    const r = checkProject(l, n, { captions: true });
    const status = r.issues.length > 0 ? "FAIL" : r.skipped ? "SKIP" : "ok";
    console.log(
      `${status} ${l}/${n} (rule text on screen: ${r.ruleTextCount}${r.skipped ? `; ${r.skipped}` : ""})`,
    );
    for (const issue of r.issues) console.log(`  - ${issue}`);
    if (r.issues.length > 0) failed++;
  }
  if (targets.length === 0) console.log("video: no projects to check");
  if (failed > 0) {
    console.error(`video: ${failed} check(s) failed`);
    process.exit(1);
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
