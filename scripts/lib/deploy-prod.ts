import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";
import { parseFamilyCodes } from "../../src/access/env";
import { ACCESS_COOKIE_NAME } from "../../src/lib/config";
import { listMediaLessons, selectLessonFiles } from "./media-upload";
import { ENV_FILE, PROD_URL, VERCEL, VERCEL_PROJECT } from "./release-config";
import { type Exec, parseEnvFile } from "./run";

export const DEFAULT_DEPLOY_REF = "HEAD";

export function parseDeployArgs(argv: readonly string[]): {
  dryRun: boolean;
  ref: string;
} {
  const { values } = parseArgs({
    args: [...argv],
    options: {
      "dry-run": { type: "boolean", default: false },
      ref: { type: "string", default: DEFAULT_DEPLOY_REF },
    },
  });
  return {
    dryRun: values["dry-run"] ?? false,
    ref: values.ref || DEFAULT_DEPLOY_REF,
  };
}

// The shell steps of a deploy, run in the clean worktree.
export function deploySteps(worktree: string) {
  return [
    {
      label: "install dependencies",
      command: ["pnpm", "install", "--frozen-lockfile"],
      cwd: worktree,
    },
    {
      label: "link the Vercel project",
      command: [...VERCEL, "link", "--yes", "--project", VERCEL_PROJECT],
      cwd: worktree,
    },
    {
      label: "deploy to production",
      command: [...VERCEL, "deploy", "--prod"],
      cwd: worktree,
    },
  ] as const;
}

export type SmokeCheck = { name: string; ok: boolean; detail: string };
export type SmokeInput = {
  fetch: typeof fetch;
  appUrl: string;
  // First family code, or null when the env file has none.
  code: string | null;
  // Full URL of one media file, or null when none can be chosen.
  mediaUrl: string | null;
};

export const SMOKE_CHECK_NAMES = [
  "unlock redirect",
  "401 without cookie",
  "login with the family code",
  "content index 200",
  "media 206",
] as const;

export async function runSmokeChecks(input: SmokeInput): Promise<SmokeCheck[]> {
  const { fetch: get, appUrl, code, mediaUrl } = input;
  const checks: SmokeCheck[] = [];
  const record = (name: string, ok: boolean, detail: string) => {
    checks.push({ name, ok, detail });
  };
  const attempt = async (
    name: string,
    body: () => Promise<[boolean, string]>,
  ) => {
    try {
      const [ok, detail] = await body();
      record(name, ok, detail);
    } catch (error) {
      record(
        name,
        false,
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  await attempt("unlock redirect", async () => {
    const response = await get(`${appUrl}/`, { redirect: "manual" });
    const location = response.headers.get("location") ?? "";
    return [
      response.status >= 300 &&
        response.status < 400 &&
        location.includes("/unlock"),
      `${response.status} -> ${location || "(no location)"}`,
    ];
  });

  await attempt("401 without cookie", async () => {
    const response = await get(`${appUrl}/content/index.json`, {
      redirect: "manual",
    });
    return [response.status === 401, String(response.status)];
  });

  let cookie: string | null = null;
  await attempt("login with the family code", async () => {
    if (!code) return [false, `no FAMILY_CODES in ${ENV_FILE}`];
    const response = await get(`${appUrl}/api/session`, {
      method: "POST",
      headers: { "content-type": "application/json", origin: appUrl },
      body: JSON.stringify({ code }),
    });
    const setCookie = response.headers
      .getSetCookie()
      .find((line) => line.startsWith(`${ACCESS_COOKIE_NAME}=`));
    cookie = setCookie ? (setCookie.split(";")[0] as string) : null;
    return [
      response.status === 200 && cookie !== null,
      String(response.status),
    ];
  });

  await attempt("content index 200", async () => {
    if (!cookie) return [false, "skipped: no session cookie"];
    const response = await get(`${appUrl}/content/index.json`, {
      headers: { cookie },
    });
    return [response.status === 200, String(response.status)];
  });

  await attempt("media 206", async () => {
    if (!mediaUrl) return [false, "no media URL to test"];
    const response = await get(mediaUrl, { headers: { range: "bytes=0-99" } });
    return [response.status === 206, `${response.status} ${mediaUrl}`];
  });

  return checks;
}

// One media file to probe: the first mp4 of the first lesson with media.
export function pickMediaKey(root: string): string | null {
  for (const lesson of listMediaLessons(root)) {
    const mp4 = selectLessonFiles(root, lesson).find((f) =>
      f.key.endsWith(".mp4"),
    );
    if (mp4) return mp4.key;
  }
  return null;
}

// The code part of the first `FAMILY_CODES` entry (the entry may be written
// `<familyId>:<code>`), or null when there is none or the list is invalid.
export function firstFamilyCode(raw: string | undefined): string | null {
  const parsed = parseFamilyCodes(raw);
  return "entries" in parsed ? (parsed.entries[0]?.code ?? null) : null;
}

export type DeployDeps = {
  root: string;
  exec: Exec;
  fetch: typeof fetch;
  log: (line: string) => void;
};

function readEnv(root: string): Record<string, string> {
  const file = path.join(root, ENV_FILE);
  return existsSync(file) ? parseEnvFile(readFileSync(file, "utf8")) : {};
}

// Returns the process exit code.
export async function runDeploy(
  argv: readonly string[],
  deps: DeployDeps,
): Promise<number> {
  const { root, exec, log } = deps;
  let dryRun: boolean;
  let ref: string;
  try {
    ({ dryRun, ref } = parseDeployArgs(argv));
  } catch (error) {
    log(error instanceof Error ? error.message : String(error));
    return 2;
  }

  // Read-only: resolves the ref to the full commit SHA that will ship.
  const resolved = exec(["git", "rev-parse", "--verify", `${ref}^{commit}`], {
    cwd: root,
  });
  const sha = resolved.stdout.trim();
  if (resolved.status !== 0 || !sha) {
    log(`cannot resolve --ref ${ref} to a commit: ${resolved.stderr.trim()}`);
    return 2;
  }

  const worktreePath = dryRun
    ? path.join(os.tmpdir(), "tutor-deploy-<random>")
    : path.join(mkdtempSync(path.join(os.tmpdir(), "tutor-deploy-")), "tree");
  const steps = deploySteps(worktreePath);

  if (dryRun) {
    log("deploy:prod dry run, nothing is executed. Steps:");
    log(`deploying ${ref} = ${sha}`);
    log(`1. git worktree add --detach ${worktreePath} ${sha}`);
    steps.forEach((step, i) => {
      log(`${i + 2}. (in the worktree) ${step.command.join(" ")}`);
    });
    log(`${steps.length + 2}. git worktree remove --force ${worktreePath}`);
    log(`${steps.length + 3}. smoke checks against ${PROD_URL}:`);
    for (const name of SMOKE_CHECK_NAMES) log(`   - ${name}`);
    return 0;
  }

  const dirty = exec(["git", "status", "--porcelain", "--untracked-files=no"], {
    cwd: root,
  });
  log(`deploying ${ref} = ${sha} (clean worktree ${worktreePath})`);
  if (dirty.stdout.trim()) {
    log("note: uncommitted changes in this tree are not part of the deploy");
  }

  const added = exec(
    ["git", "worktree", "add", "--detach", worktreePath, sha],
    {
      cwd: root,
    },
  );
  if (added.status !== 0) {
    log(`git worktree add failed: ${added.stderr.trim()}`);
    return 1;
  }

  let failedStep: string | null = null;
  try {
    for (const step of steps) {
      log(`> ${step.label}: ${step.command.join(" ")}`);
      const result = exec(step.command, { cwd: step.cwd, inherit: true });
      if (result.status !== 0) {
        failedStep = step.label;
        break;
      }
    }
  } finally {
    const removed = exec(
      ["git", "worktree", "remove", "--force", worktreePath],
      {
        cwd: root,
      },
    );
    if (removed.status !== 0) {
      log(
        `could not remove worktree ${worktreePath}: ${removed.stderr.trim()}`,
      );
    }
  }
  if (failedStep) {
    log(`deploy:prod FAILED at "${failedStep}"; smoke checks not run`);
    return 1;
  }

  const env = readEnv(root);
  const base = env.NEXT_PUBLIC_MEDIA_BASE_URL;
  const mediaKey = pickMediaKey(root);
  const checks = await runSmokeChecks({
    fetch: deps.fetch,
    appUrl: PROD_URL,
    code: firstFamilyCode(env.FAMILY_CODES),
    mediaUrl: base && mediaKey ? `${base}/${mediaKey}` : null,
  });
  log(`smoke checks against ${PROD_URL}:`);
  for (const check of checks) {
    log(`  ${check.ok ? "PASS" : "FAIL"}  ${check.name}: ${check.detail}`);
  }
  const failed = checks.filter((check) => !check.ok).length;
  log(
    failed === 0
      ? `deploy:prod OK: ${PROD_URL}`
      : `deploy:prod deployed, but ${failed} smoke check(s) FAILED`,
  );
  return failed === 0 ? 0 : 1;
}
