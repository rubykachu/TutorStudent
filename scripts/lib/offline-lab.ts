import { type ChildProcess, spawn } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  symlinkSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";
import { OFFLINE_PORT, OFFLINE_SERVER_ENV } from "../../e2e/targets";
import { type BundleFile, readClientFiles } from "./bundle-check";
import { ENV_FILE } from "./release-config";
import { type Exec, parseEnvFile } from "./run";

// The lab: a production build of a committed ref, built and served from a
// temporary git worktree, so the owner's tree never changes: `content:emit`
// deletes and rewrites `public/content/` (the dev server on port 3001 would
// lose its drafts) and `next build` edits `tsconfig.json`. Everything runs
// with `OFFLINE_SERVER_ENV`. The worktree and the server it started are
// removed in a `finally`; nothing else is touched.

export type LabArgs = {
  ref: string;
  port: number;
  // A folder copied over the worktree before the install (files a check adds
  // without committing them).
  overlay: string | null;
  // Shell commands run in the worktree after the install and the overlay.
  setup: string[];
  // Run after the server is up, with OFFLINE_LAB_URL set; the lab stops when
  // it ends and exits with its code. Empty: serve until interrupted.
  command: string[];
};

export function parseLabArgs(argv: readonly string[]): LabArgs {
  const split = argv.indexOf("--");
  const own = split < 0 ? argv : argv.slice(0, split);
  const command = split < 0 ? [] : argv.slice(split + 1);
  const { values } = parseArgs({
    args: [...own],
    options: {
      ref: { type: "string", default: "HEAD" },
      port: { type: "string", default: String(OFFLINE_PORT) },
      overlay: { type: "string" },
      setup: { type: "string", multiple: true, default: [] },
    },
  });
  const port = Number(values.port);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) {
    throw new Error(`--port must be a port number, got ${values.port}`);
  }
  return {
    ref: values.ref || "HEAD",
    port,
    overlay: values.overlay ?? null,
    setup: values.setup ?? [],
    command,
  };
}

// The caller's environment with every lab variable set explicitly (an explicit
// value beats any `.env*` file).
export function labEnv(
  base: Record<string, string | undefined> = process.env,
): NodeJS.ProcessEnv {
  return { ...base, ...OFFLINE_SERVER_ENV } as NodeJS.ProcessEnv;
}

// Files of the client bundle that name the media origin of the owner's real
// settings; a lab build must hold none, so it can never call the bucket.
export function filesNamingOrigin(
  files: readonly BundleFile[],
  origin: string,
): string[] {
  if (!origin) return [];
  return files.filter((f) => f.text.includes(origin)).map((f) => f.path);
}

// The main working tree: the first entry of `git worktree list`. The lab may
// run from another worktree, but media files and the owner's settings live in
// the main tree.
export function mainTreeRoot(exec: Exec, root: string): string {
  const listed = exec(["git", "worktree", "list", "--porcelain"], {
    cwd: root,
  });
  const first = listed.stdout
    .split("\n")
    .find((line) => line.startsWith("worktree "));
  return first ? first.slice("worktree ".length).trim() : root;
}

function realMediaOrigin(root: string): string {
  const file = path.join(root, ENV_FILE);
  if (!existsSync(file)) return "";
  return (
    parseEnvFile(readFileSync(file, "utf8")).NEXT_PUBLIC_MEDIA_BASE_URL ?? ""
  );
}

async function waitFor(url: string, child: ChildProcess): Promise<void> {
  for (let attempt = 0; attempt < 120; attempt++) {
    if (child.exitCode !== null) throw new Error("the server exited early");
    try {
      const response = await fetch(url, { redirect: "manual" });
      if (response.status > 0) return;
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`${url} did not answer in 60 s`);
}

export type LabDeps = {
  root: string;
  exec: Exec;
  log: (line: string) => void;
};

export type Lab = {
  url: string;
  worktree: string;
  stop: () => Promise<void>;
};

// Builds and serves `args.ref`. The caller stops it with `stop()`.
export async function startLab(args: LabArgs, deps: LabDeps): Promise<Lab> {
  const { root, exec, log } = deps;
  const resolved = exec(
    ["git", "rev-parse", "--verify", `${args.ref}^{commit}`],
    {
      cwd: root,
    },
  );
  const sha = resolved.stdout.trim();
  if (resolved.status !== 0 || !sha) {
    throw new Error(
      `cannot resolve --ref ${args.ref}: ${resolved.stderr.trim()}`,
    );
  }
  const base = process.env.OFFLINE_LAB_DIR ?? os.tmpdir();
  mkdirSync(base, { recursive: true });
  const worktree = path.join(
    mkdtempSync(path.join(base, "tutor-offline-lab-")),
    "tree",
  );
  log(`lab: ${args.ref} = ${sha} in ${worktree}`);
  const added = exec(["git", "worktree", "add", "--detach", worktree, sha], {
    cwd: root,
  });
  if (added.status !== 0) {
    throw new Error(`git worktree add failed: ${added.stderr.trim()}`);
  }

  let server: ChildProcess | null = null;
  const stop = async () => {
    if (server && server.exitCode === null) {
      const exited = new Promise((resolve) => server?.once("exit", resolve));
      server.kill("SIGTERM");
      await exited;
    }
    server = null;
    const removed = exec(["git", "worktree", "remove", "--force", worktree], {
      cwd: root,
    });
    if (removed.status !== 0) {
      log(`could not remove worktree ${worktree}: ${removed.stderr.trim()}`);
    }
  };

  try {
    const env = labEnv();
    // The install runs without the lab environment: `NODE_ENV=production`
    // would make pnpm skip the dev dependencies the build needs.
    const run = (
      label: string,
      command: readonly string[],
      withLabEnv: boolean,
    ) => {
      log(`lab> ${label}`);
      const result = exec(command, {
        cwd: worktree,
        inherit: true,
        env: withLabEnv ? env : process.env,
      });
      if (result.status !== 0) throw new Error(`${label} failed`);
    };
    run(
      "install",
      ["pnpm", "install", "--frozen-lockfile", "--prefer-offline"],
      false,
    );
    const mainRoot = mainTreeRoot(exec, root);
    const media = path.join(mainRoot, "public/media");
    if (existsSync(media)) {
      symlinkSync(media, path.join(worktree, "public/media"));
    }
    if (args.overlay) {
      cpSync(args.overlay, worktree, { recursive: true });
    }
    for (const command of args.setup) {
      run(command, ["sh", "-c", command], false);
    }
    run("build", ["pnpm", "build"], true);

    const origin = realMediaOrigin(mainRoot);
    const naming = filesNamingOrigin(
      readClientFiles(
        path.join(worktree, ".next"),
        path.join(worktree, "public"),
      ),
      origin,
    );
    if (naming.length > 0) {
      throw new Error(
        `the client bundle names the real media origin (${naming.length} files): ${naming.slice(0, 3).join(", ")}`,
      );
    }

    server = spawn(
      process.execPath,
      [
        path.join(worktree, "node_modules/next/dist/bin/next"),
        "start",
        "--port",
        String(args.port),
      ],
      { cwd: worktree, env, stdio: "inherit" },
    );
    log(`lab> server pid ${server.pid} on port ${args.port}`);
    const url = `http://localhost:${args.port}`;
    await waitFor(`${url}/unlock`, server);
    return { url, worktree, stop };
  } catch (error) {
    await stop();
    throw error;
  }
}

// Returns the exit code.
export async function runLab(
  argv: readonly string[],
  deps: LabDeps,
): Promise<number> {
  let args: LabArgs;
  try {
    args = parseLabArgs(argv);
  } catch (error) {
    deps.log(error instanceof Error ? error.message : String(error));
    return 2;
  }
  let lab: Lab;
  try {
    lab = await startLab(args, deps);
  } catch (error) {
    deps.log(`lab FAILED: ${error instanceof Error ? error.message : error}`);
    return 1;
  }
  try {
    deps.log(`lab ready: ${lab.url}`);
    if (args.command.length === 0) {
      await new Promise<void>((resolve) => {
        process.once("SIGINT", () => resolve());
        process.once("SIGTERM", () => resolve());
      });
      return 0;
    }
    const [file, ...rest] = args.command;
    const child = spawn(file as string, rest, {
      cwd: deps.root,
      env: { ...process.env, OFFLINE_LAB_URL: lab.url },
      stdio: "inherit",
    });
    return await new Promise<number>((resolve) => {
      child.once("exit", (code) => resolve(code ?? 1));
    });
  } finally {
    await lab.stop();
  }
}
