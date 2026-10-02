import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseFamilyCodes } from "../../src/access/env";
import { WORKER_FILE } from "../../src/offline/config";
import { R2_ENV_NAMES } from "../../src/sync/store/config";

// The browser bundle (`<distDir>/static`) must hold no server secret: not the
// name of a server-only variable (a name there means browser code reads it,
// which Next would inline at build time) and not the value of a secret set
// while building. Checked after every `next build`, on the laptop and on
// Vercel alike.

// Variables only the server may read.
export const SERVER_ONLY_ENV_NAMES = [
  ...R2_ENV_NAMES,
  "SESSION_SECRET",
  "FAMILY_CODES",
  "SYNC_STORE",
] as const;

// Variables whose values are secrets. `R2_ACCOUNT_ID` and `R2_PRIVATE_BUCKET`
// are left out: a bucket name such as `tutor-progress` can be an ordinary
// string of the app.
const SECRET_VALUE_NAMES = [
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "SESSION_SECRET",
] as const;

// Shorter values are skipped: they would match by chance.
const MIN_SECRET_LENGTH = 10;

export type BundleFile = { path: string; text: string };

// What one file gives away: the variable named, never the value itself.
export type BundleLeak = { file: string; what: string };

type Env = Record<string, string | undefined>;

// The secret values to look for, each labelled by where it comes from.
function secretValues(env: Env): { label: string; value: string }[] {
  const values = SECRET_VALUE_NAMES.map((name) => ({
    label: `value of ${name}`,
    value: (env[name] ?? "").trim(),
  }));
  const codes = parseFamilyCodes(env.FAMILY_CODES);
  if ("entries" in codes) {
    for (const entry of codes.entries) {
      values.push({ label: "a code of FAMILY_CODES", value: entry.code });
    }
  }
  return values.filter(({ value }) => value.length >= MIN_SECRET_LENGTH);
}

export function findBundleLeaks(
  files: readonly BundleFile[],
  env: Env,
): BundleLeak[] {
  const values = secretValues(env);
  const leaks: BundleLeak[] = [];
  for (const file of files) {
    for (const name of SERVER_ONLY_ENV_NAMES) {
      if (file.text.includes(name)) {
        leaks.push({ file: file.path, what: `name ${name}` });
      }
    }
    for (const { label, value } of values) {
      if (file.text.includes(value)) {
        leaks.push({ file: file.path, what: label });
      }
    }
  }
  return leaks;
}

// Every file under `dir`, with its path relative to `dir`.
export function readBundle(dir: string): BundleFile[] {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const full = path.join(entry.parentPath, entry.name);
      return {
        path: path.relative(dir, full),
        text: readFileSync(full, "utf8"),
      };
    });
}

// What the browser downloads and runs: the build's static folder and the
// service worker script (`public/sw.js`, written after `next build`), which
// is as public as any chunk.
export function readClientFiles(
  distDir: string,
  publicDir: string,
): BundleFile[] {
  const files = readBundle(path.join(distDir, "static"));
  const worker = path.join(publicDir, WORKER_FILE);
  if (existsSync(worker)) {
    files.push({ path: WORKER_FILE, text: readFileSync(worker, "utf8") });
  }
  return files;
}
