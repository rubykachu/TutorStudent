import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { ENV_FILE } from "./release-config";

export type ExecResult = { status: number; stdout: string; stderr: string };

// Runs a command and waits for it. `inherit` streams its output to the
// terminal (long builds); otherwise output is captured.
export type Exec = (
  command: readonly string[],
  options?: { cwd?: string; inherit?: boolean; env?: NodeJS.ProcessEnv },
) => ExecResult;

export const exec: Exec = (command, options = {}) => {
  const [file, ...args] = command;
  const result = spawnSync(file as string, args, {
    cwd: options.cwd,
    env: options.env,
    encoding: "utf8",
    stdio: options.inherit ? "inherit" : "pipe",
  });
  return {
    status: result.status ?? 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? result.error?.message ?? "",
  };
};

// Reads KEY=value lines of an env file (optional quotes, `#` comments).
export function parseEnvFile(text: string): Record<string, string> {
  const env: Record<string, string> = {};
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 1) continue;
    const value = line.slice(eq + 1).trim();
    const quoted = /^(["'])(.*)\1$/.exec(value);
    env[line.slice(0, eq).trim()] = quoted ? (quoted[2] as string) : value;
  }
  return env;
}

// The release settings of the checkout at `root` (ENV_FILE), or none when the
// file is missing.
export function readReleaseEnv(root: string): Record<string, string> {
  const file = path.join(root, ENV_FILE);
  return existsSync(file) ? parseEnvFile(readFileSync(file, "utf8")) : {};
}
