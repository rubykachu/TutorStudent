import { parseArgs } from "node:util";
import { clean } from "./lib/clean";

// Usage: clean [--deep]
// Removes regenerable output: screenshots and logs (.shots/), coverage, test
// results, and the video pipeline's renders/ trees. --deep also removes
// .next/, but only when no dev server of this tree is running.
const { values } = parseArgs({
  options: { deep: { type: "boolean", default: false } },
});

const { removed, skipped } = clean({ root: process.cwd(), deep: values.deep });
for (const target of removed) console.log(`removed ${target}`);
for (const { path, reason } of skipped) console.log(`kept ${path} (${reason})`);
console.log(`clean: ${removed.length} removed, ${skipped.length} kept`);
