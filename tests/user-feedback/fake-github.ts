// A fake GitHub API over an injected `fetch`: records every request and
// answers from a queue of scripted responses (default: created). No request
// ever leaves the process.

export type SeenRequest = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
};

type Answer = Response | "network" | "hang";

export function fakeGithub() {
  const seen: SeenRequest[] = [];
  const queue: Answer[] = [];
  let issueNumber = 0;
  const fetch = async (
    input: RequestInfo | URL,
    init: RequestInit = {},
  ): Promise<Response> => {
    const url = String(input);
    seen.push({
      url,
      method: init.method ?? "GET",
      headers: Object.fromEntries(new Headers(init.headers).entries()),
      body: init.body ? JSON.parse(String(init.body)) : null,
    });
    const next = queue.shift();
    if (next === "network") throw new TypeError("fetch failed");
    if (next === "hang") {
      return new Promise((_, reject) => {
        init.signal?.addEventListener("abort", () =>
          reject(new DOMException("aborted", "AbortError")),
        );
      });
    }
    if (next) return next;
    if (url.endsWith("/labels")) return json(201, {});
    issueNumber += 1;
    return json(201, {
      number: issueNumber,
      html_url: `https://github.com/rubykachu/owlyeah-feedback/issues/${issueNumber}`,
    });
  };
  return {
    fetch: fetch as typeof globalThis.fetch,
    seen,
    issues: () => seen.filter((r) => r.url.endsWith("/issues")),
    answer(...answers: Answer[]) {
      queue.push(...answers);
    },
  };
}

export function json(
  status: number,
  body: unknown,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}
