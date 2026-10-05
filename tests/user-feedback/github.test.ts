// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createGithubIssues } from "@/user-feedback/github";
import { fakeGithub, json } from "./fake-github";

const TOKEN = "github_pat_test_value_never_shown";
const REPO = "rubykachu/owlyeah-feedback";
const ISSUE = { title: "t", body: "b", labels: ["feedback", "bai:luy-thua"] };

function client(gh = fakeGithub(), token: string | undefined | null = TOKEN) {
  const waits: number[] = [];
  let clock = 0;
  const issues = createGithubIssues({
    token: token ?? undefined,
    repo: REPO,
    fetch: gh.fetch,
    now: () => clock,
    sleep: async (ms) => {
      waits.push(ms);
      clock += ms;
    },
    timeoutMs: 20,
  });
  return { gh, issues, waits };
}

describe("createIssue", () => {
  it("sends the exact request and returns number and url", async () => {
    const { gh, issues } = client();
    const result = await issues.createIssue(ISSUE);
    expect(result).toEqual({
      ok: true,
      number: 1,
      url: "https://github.com/rubykachu/owlyeah-feedback/issues/1",
    });
    expect(gh.seen).toEqual([
      {
        url: `https://api.github.com/repos/${REPO}/issues`,
        method: "POST",
        headers: {
          authorization: `Bearer ${TOKEN}`,
          accept: "application/vnd.github+json",
          "x-github-api-version": "2022-11-28",
          "user-agent": "owlyeah-feedback",
          "content-type": "application/json",
        },
        body: ISSUE,
      },
    ]);
  });

  it("maps each failure to its code", async () => {
    const cases: [Response | "network" | "hang", string][] = [
      [json(401, {}), "github-401"],
      [json(403, {}), "github-403"],
      [json(403, {}, { "retry-after": "60" }), "github-rate"],
      [json(403, {}, { "x-ratelimit-remaining": "0" }), "github-rate"],
      [json(429, {}), "github-rate"],
      [json(422, { message: "Validation Failed" }), "github-422"],
      [json(502, {}), "github-5xx"],
      [json(404, {}), "github-other"],
      ["network", "github-other"],
      ["hang", "timeout"],
    ];
    for (const [answer, code] of cases) {
      const { gh, issues } = client();
      gh.answer(answer);
      const result = await issues.createIssue(ISSUE);
      expect(result).toEqual({ ok: false, code });
      expect(JSON.stringify(result)).not.toContain(TOKEN);
    }
  });

  it("sends nothing without a token", async () => {
    for (const token of [null, "", "  "]) {
      const { gh, issues } = client(fakeGithub(), token);
      expect(await issues.createIssue(ISSUE)).toEqual({
        ok: false,
        code: "no-token",
      });
      expect(await issues.ensureLabels(["bai:x"])).toEqual({
        ok: false,
        code: "no-token",
      });
      expect(gh.seen).toHaveLength(0);
    }
  });

  it("spaces writes by the gap", async () => {
    const { issues, waits } = client();
    await issues.createIssue(ISSUE);
    await issues.createIssue(ISSUE);
    expect(waits).toEqual([1000]);
  });
});

describe("ensureLabels", () => {
  it("creates only the server's labels, once each, with their colours", async () => {
    const { gh, issues } = client();
    const names = [
      "feedback",
      "bai:luy-thua",
      "mon:math",
      "lop:6",
      "trang-thai:moi",
    ];
    expect(await issues.ensureLabels(names)).toEqual({ ok: true, dropped: [] });
    expect(await issues.ensureLabels(names)).toEqual({ ok: true, dropped: [] });
    expect(gh.seen.map((r) => r.body)).toEqual([
      { name: "bai:luy-thua", color: "F9D0C4" },
      { name: "mon:math", color: "BFDADC" },
      { name: "lop:6", color: "D4C5F9" },
    ]);
  });

  it("counts already_exists as done and drops a label GitHub refuses", async () => {
    const { gh, issues } = client();
    gh.answer(
      json(422, { errors: [{ code: "already_exists" }] }),
      json(422, { errors: [{ code: "invalid" }] }),
    );
    expect(await issues.ensureLabels(["bai:a", "mon:b"])).toEqual({
      ok: true,
      dropped: ["mon:b"],
    });
    const issue = await issues.createIssue({ ...ISSUE, labels: ["bai:a"] });
    expect(issue.ok).toBe(true);
  });

  it("stops on an error that also stops the issue", async () => {
    const { gh, issues } = client();
    gh.answer(json(403, {}, { "retry-after": "5" }));
    expect(await issues.ensureLabels(["bai:a", "mon:b"])).toEqual({
      ok: false,
      code: "github-rate",
    });
    expect(gh.seen).toHaveLength(1);
  });
});
