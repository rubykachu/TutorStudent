import { writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { checkContent } from "@/content/check";
import {
  DEFAULT_CONTENT_ROOT,
  IDS_LOCK_FILE,
  readContentRoot,
} from "@/content/load";
import { planLock } from "@/content/lock";
import { IdsLockSchema } from "@/schema/content";
import { visualRegistry } from "@/visuals/registry";

// Usage: content-lock [<lessonId>...] [--root <dir>]
// Adds the ids of the named real lessons to ids.lock.json, or of every real
// lesson when none is named; a lesson that changed after its review is then
// skipped (and listed), not a reason to lock nothing. Ids are never removed
// here: dropping one requires an explicit `retired` entry.
const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { root: { type: "string" } },
});
const root = values.root ? path.resolve(values.root) : DEFAULT_CONTENT_ROOT;

const raw = readContentRoot(root);
const { issues, lessons } = checkContent(raw, visualRegistry);
const lock = IdsLockSchema.parse(raw.lock.data);
const plan = planLock({ lock, lessons, issues, only: positionals });
if (plan.errors.length > 0) {
  for (const error of plan.errors) console.error(error);
  console.error("content:lock: fix the errors above before locking ids");
  process.exit(1);
}

writeFileSync(
  path.join(root, IDS_LOCK_FILE),
  `${JSON.stringify({ ids: plan.ids, retired: lock.retired }, null, 2)}\n`,
);
for (const id of plan.skipped) {
  console.warn(
    `content:lock: skipped ${id} (changed after its review; review it, then lock it by id)`,
  );
}
console.log(
  `content:lock: added ${plan.ids.length - lock.ids.length} ids (${plan.ids.length} locked)`,
);
