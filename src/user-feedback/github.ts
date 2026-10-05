import {
  FEEDBACK_GITHUB_TIMEOUT_MS,
  FEEDBACK_GITHUB_WRITE_GAP_MS,
} from "@/lib/config";
import { CREATED_LABEL_COLORS } from "./issue";
import type { ForwardError } from "./schema";

// The two GitHub calls a report needs: create the labels that may not exist
// yet, then the issue. Never throws on an HTTP or network error, never puts
// the token in a result, an error or a log. No retry inside a call: the
// pending list is the retry.

export type GithubFailure = { ok: false; code: ForwardError };
export type IssueResult =
  | { ok: true; number: number; url: string }
  | GithubFailure;
// `dropped`: labels GitHub would not create; the issue goes without them.
export type LabelsResult = { ok: true; dropped: string[] } | GithubFailure;

export type GithubIssues = {
  ensureLabels(names: readonly string[]): Promise<LabelsResult>;
  createIssue(issue: {
    title: string;
    body: string;
    labels: readonly string[];
  }): Promise<IssueResult>;
};

export type GithubDeps = {
  token: string | undefined;
  repo: string;
  fetch?: typeof fetch;
  now?: () => number;
  sleep?: (ms: number) => Promise<void>;
  timeoutMs?: number;
  writeGapMs?: number;
};

const API = "https://api.github.com";

// What a failed answer means for the report.
export function failureCode(response: Response): ForwardError {
  const { status, headers } = response;
  const limited =
    headers.get("retry-after") !== null ||
    headers.get("x-ratelimit-remaining") === "0";
  if (status === 429 || (status === 403 && limited)) return "github-rate";
  if (status === 401) return "github-401";
  if (status === 403) return "github-403";
  if (status === 422) return "github-422";
  if (status >= 500) return "github-5xx";
  return "github-other";
}

async function alreadyExists(response: Response): Promise<boolean> {
  try {
    const body = (await response.json()) as { errors?: { code?: unknown }[] };
    return (body.errors ?? []).some((e) => e?.code === "already_exists");
  } catch {
    return false;
  }
}

function labelColor(name: string): string | null {
  for (const [prefix, color] of Object.entries(CREATED_LABEL_COLORS)) {
    if (name.startsWith(prefix)) return color;
  }
  return null;
}

export function createGithubIssues(deps: GithubDeps): GithubIssues {
  const token = (deps.token ?? "").trim();
  const doFetch = deps.fetch ?? fetch;
  const now = deps.now ?? Date.now;
  const sleep =
    deps.sleep ??
    ((ms: number) => new Promise<void>((done) => setTimeout(done, ms)));
  const timeoutMs = deps.timeoutMs ?? FEEDBACK_GITHUB_TIMEOUT_MS;
  const gapMs = deps.writeGapMs ?? FEEDBACK_GITHUB_WRITE_GAP_MS;
  // Labels this instance has created or found, so each is asked for once.
  const ensured = new Set<string>();
  let lastWrite: number | null = null;

  // One write: spaced from the previous one, given up after the timeout.
  async function write(
    path: string,
    body: unknown,
  ): Promise<Response | GithubFailure> {
    if (lastWrite !== null) {
      const wait = lastWrite + gapMs - now();
      if (wait > 0) await sleep(wait);
    }
    lastWrite = now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await doFetch(`${API}/repos/${deps.repo}${path}`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          accept: "application/vnd.github+json",
          "x-github-api-version": "2022-11-28",
          "user-agent": "owlyeah-feedback",
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch {
      return {
        ok: false,
        code: controller.signal.aborted ? "timeout" : "github-other",
      };
    } finally {
      clearTimeout(timer);
      lastWrite = now();
    }
  }

  return {
    async ensureLabels(names) {
      if (token === "") return { ok: false, code: "no-token" };
      const dropped: string[] = [];
      for (const name of names) {
        const color = labelColor(name);
        if (color === null || ensured.has(name)) continue;
        const response = await write("/labels", { name, color });
        if (!(response instanceof Response)) return response;
        if (
          response.status === 201 ||
          (response.status === 422 && (await alreadyExists(response)))
        ) {
          ensured.add(name);
        } else if (response.status === 422) {
          dropped.push(name);
        } else {
          return { ok: false, code: failureCode(response) };
        }
      }
      return { ok: true, dropped };
    },

    async createIssue({ title, body, labels }) {
      if (token === "") return { ok: false, code: "no-token" };
      const response = await write("/issues", { title, body, labels });
      if (!(response instanceof Response)) return response;
      if (response.status !== 201) {
        return { ok: false, code: failureCode(response) };
      }
      try {
        const created = (await response.json()) as {
          number?: unknown;
          html_url?: unknown;
        };
        if (
          typeof created.number === "number" &&
          Number.isInteger(created.number) &&
          created.number > 0 &&
          typeof created.html_url === "string" &&
          created.html_url.startsWith("https://github.com/")
        ) {
          return { ok: true, number: created.number, url: created.html_url };
        }
      } catch {
        // An unreadable answer to a created issue.
      }
      return { ok: false, code: "github-other" };
    },
  };
}
