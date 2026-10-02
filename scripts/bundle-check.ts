import { existsSync } from "node:fs";
import path from "node:path";
import { findBundleLeaks, readBundle } from "./lib/bundle-check";

// Runs after `next build` (see the `build` script): fails the build when the
// browser bundle names a server-only variable or holds a secret's value. It
// prints the file and the variable, never a value.
const distDir = process.env.NEXT_DIST_DIR || ".next";
const staticDir = path.join(distDir, "static");

if (!existsSync(staticDir)) {
  console.error(`bundle check: ${staticDir} not found; run next build first`);
  process.exitCode = 1;
} else {
  const files = readBundle(staticDir);
  const leaks = findBundleLeaks(files, process.env);
  if (leaks.length === 0) {
    console.log(`bundle check: ${files.length} files, no server secret`);
  } else {
    for (const leak of leaks) {
      console.error(`bundle check: ${leak.file} holds the ${leak.what}`);
    }
    console.error(
      "bundle check FAILED: browser code must not read server-only variables",
    );
    process.exitCode = 1;
  }
}
