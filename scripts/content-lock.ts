import { writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { checkContent, declaredIds, formatIssue } from "@/content/check";
import {
  DEFAULT_CONTENT_ROOT,
  IDS_LOCK_FILE,
  readContentRoot,
} from "@/content/load";
import { IdsLockSchema } from "@/schema/content";
import { visualRegistry } from "@/visuals/registry";

// Usage: content-lock [--root <dir>]
// Adds every id of the real (non-fixture) lessons to ids.lock.json. Ids are
// never removed here: dropping one requires an explicit `retired` entry.
const { values } = parseArgs({ options: { root: { type: "string" } } });
const root = values.root ? path.resolve(values.root) : DEFAULT_CONTENT_ROOT;

const raw = readContentRoot(root);
const { issues, lessons } = checkContent(raw, visualRegistry);
const errors = issues.filter((issue) => issue.severity === "error");
if (errors.length > 0) {
  for (const issue of errors) console.error(formatIssue(issue));
  console.error("content:lock: fix the errors above before locking ids");
  process.exit(1);
}

const lock = IdsLockSchema.parse(raw.lock.data);
const before = new Set(lock.ids);
const ids = new Set(before);
for (const { lesson } of lessons.filter((l) => !l.fixture)) {
  for (const { id } of declaredIds(lesson)) ids.add(id);
}

const next = { ids: [...ids].sort(), retired: lock.retired };
writeFileSync(
  path.join(root, IDS_LOCK_FILE),
  `${JSON.stringify(next, null, 2)}\n`,
);
console.log(
  `content:lock: added ${ids.size - before.size} ids (${ids.size} locked)`,
);
