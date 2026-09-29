import { type ChildProcess, spawn } from "node:child_process";
import {
  TEST_BASE_URL,
  TEST_SERVER_COMMAND,
  TEST_SERVER_ENV,
} from "../../e2e/targets";

// The dev server the screenshot scripts drive: reused when one already
// answers on the test port (e.g. from an E2E run), otherwise started and
// stopped by the script.

const SERVER_START_TIMEOUT_MS = 120_000;

export async function isServing(url: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

// Returns the started server so it can be stopped afterwards, or undefined
// when a server was already running. `env` adds to TEST_SERVER_ENV.
export async function ensureServer(
  probePath: string,
  env: Record<string, string> = {},
): Promise<ChildProcess | undefined> {
  const probe = `${TEST_BASE_URL}${probePath}`;
  if (await isServing(probe)) return undefined;
  const server = spawn(TEST_SERVER_COMMAND, {
    shell: true,
    // Own process group, so stopping it also stops the processes Next forks.
    detached: true,
    stdio: "ignore",
    env: { ...process.env, ...TEST_SERVER_ENV, ...env },
  });
  const deadline = Date.now() + SERVER_START_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (await isServing(probe)) return server;
    if (server.exitCode !== null) break;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  stopServer(server);
  throw new Error(`Dev server did not start: ${TEST_SERVER_COMMAND}`);
}

export function stopServer(server: ChildProcess | undefined) {
  if (server?.pid === undefined || server.exitCode !== null) return;
  process.kill(-server.pid, "SIGTERM");
}
