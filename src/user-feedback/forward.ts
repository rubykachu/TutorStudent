import {
  FEEDBACK_CLAIM_SECONDS,
  FEEDBACK_FORWARD_BUDGET_MS,
  FEEDBACK_ISSUES_PER_HOUR,
  FEEDBACK_MAX_ATTEMPTS,
  FEEDBACK_RETRY_PER_REQUEST,
} from "@/lib/config";
import { type SyncPrefix, syncKey } from "@/sync/store/keys";
import type { BlobStore } from "@/sync/store/types";
import type { GithubIssues } from "./github";
import { issueBody, issueLabels, issueTitle } from "./issue";
import { readPending, removePending } from "./pending";
import {
  type FeedbackRecord,
  FeedbackRecordSchema,
  type Forward,
  type ForwardError,
} from "./schema";
import type { FeedbackLogEntry } from "./server";

// Forwarding stored reports to GitHub, run after a new report is answered.
// One pass walks the oldest pending ids; each report is claimed with a
// conditional write first, so two instances never send the same one. A
// report GitHub refuses for good ends `failed` and leaves the list; any other
// failure stops the pass (GitHub or the token is likely still down) and the
// next report's pass tries again.

export type ForwarderDeps = {
  prefix: SyncPrefix;
  // null: no `GITHUB_FEEDBACK_TOKEN`, forwarding is off.
  github: GithubIssues | null;
  now: () => Date;
  log: (entry: FeedbackLogEntry) => void;
};

type Outcome = "next" | "stop";

const HOUR_MS = 3_600_000;

export function createForwarder(deps: ForwarderDeps) {
  const { prefix, github, now, log } = deps;
  let offLogged = false;
  // Times this instance created an issue, for the hourly cap.
  let created: number[] = [];

  const line = (
    event: FeedbackLogEntry["event"],
    id: string,
    detail?: string,
  ): FeedbackLogEntry => ({
    route: "POST",
    status: 202,
    event,
    id,
    ...(detail ? { detail } : {}),
  });

  async function readRecord(
    store: BlobStore,
    key: string,
  ): Promise<{ record: FeedbackRecord; etag: string } | "missing" | "invalid"> {
    const found = await store.get(key);
    if (found === null || !("body" in found)) return "missing";
    try {
      const parsed = FeedbackRecordSchema.safeParse(JSON.parse(found.body));
      return parsed.success
        ? { record: parsed.data, etag: found.etag }
        : "invalid";
    } catch {
      return "invalid";
    }
  }

  async function writeForward(
    store: BlobStore,
    key: string,
    record: FeedbackRecord,
    etag: string,
    forward: Forward,
  ): Promise<string | null> {
    const written = await store.put(
      key,
      JSON.stringify({ ...record, forward }),
      { ifMatch: etag },
    );
    return "conflict" in written ? null : written.etag;
  }

  // One report: read, claim, send, record the result.
  async function forwardReport(
    store: BlobStore,
    id: string,
    month: string,
  ): Promise<Outcome> {
    const key = syncKey(prefix, { kind: "feedback", month, reportId: id });
    const found = await readRecord(store, key);
    if (found === "missing") {
      await removePending(store, prefix, id);
      return "next";
    }
    if (found === "invalid") {
      log(line("forward-given-up", id, "record-invalid"));
      await removePending(store, prefix, id);
      return "next";
    }
    const { record, etag } = found;
    const { forward } = record;
    if (forward.state === "sent" || forward.state === "failed") {
      await removePending(store, prefix, id);
      return "next";
    }
    const at = now();
    if (
      forward.state === "sending" &&
      forward.claimedAt !== null &&
      at.getTime() - Date.parse(forward.claimedAt) <
        FEEDBACK_CLAIM_SECONDS * 1000
    ) {
      return "next";
    }
    const claim: Forward = {
      ...forward,
      state: "sending",
      claimedAt: at.toISOString(),
      attempts: forward.attempts + 1,
    };
    const claimEtag = await writeForward(store, key, record, etag, claim);
    if (claimEtag === null) return "next";
    const claimed = { ...record, forward: claim };

    const result = await send(claimed);
    if (result.ok) {
      const done = await writeForward(store, key, claimed, claimEtag, {
        ...claim,
        state: "sent",
        lastError: null,
        issue: result.number,
        url: result.url,
      });
      if (done === null) {
        log(line("record-update-failed", id));
        return "next";
      }
      await removePending(store, prefix, id);
      return "next";
    }
    const givenUp =
      result.code === "github-422" || claim.attempts >= FEEDBACK_MAX_ATTEMPTS;
    await writeForward(store, key, claimed, claimEtag, {
      ...claim,
      state: givenUp ? "failed" : "pending",
      claimedAt: null,
      lastError: result.code,
    });
    if (givenUp) {
      log(line("forward-given-up", id, result.code));
      await removePending(store, prefix, id);
      return "next";
    }
    log(line("forward-failed", id, result.code));
    return "stop";
  }

  async function send(
    record: FeedbackRecord,
  ): Promise<
    | { ok: true; number: number; url: string }
    | { ok: false; code: ForwardError }
  > {
    if (github === null) return { ok: false, code: "no-token" };
    let labels = issueLabels(record);
    const ensured = await github.ensureLabels(labels);
    if (!ensured.ok) return ensured;
    if (ensured.dropped.length > 0) {
      log(line("labels", record.id));
      labels = labels.filter((name) => !ensured.dropped.includes(name));
    }
    const result = await github.createIssue({
      title: issueTitle(record),
      body: issueBody(record),
      labels,
    });
    if (result.ok) created.push(now().getTime());
    return result;
  }

  // Without a token: the new report keeps `no-token` as its reason and stays
  // pending; the instance says once that forwarding is off.
  async function markNoToken(store: BlobStore, id: string, month: string) {
    if (!offLogged) {
      offLogged = true;
      log(line("forward-off", id, "GITHUB_FEEDBACK_TOKEN not set"));
    }
    const key = syncKey(prefix, { kind: "feedback", month, reportId: id });
    const found = await readRecord(store, key);
    if (typeof found === "string" || found.record.forward.state !== "pending") {
      return;
    }
    await writeForward(store, key, found.record, found.etag, {
      ...found.record.forward,
      lastError: "no-token",
    });
  }

  // One pass after a new report (`id`, `month`) was stored and listed.
  async function pass(
    store: BlobStore,
    fresh: { id: string; month: string },
  ): Promise<void> {
    if (github === null) {
      await markNoToken(store, fresh.id, fresh.month);
      return;
    }
    const start = now().getTime();
    const { list } = await readPending(store, prefix);
    for (const item of list.items.slice(0, FEEDBACK_RETRY_PER_REQUEST)) {
      const at = now().getTime();
      if (at - start >= FEEDBACK_FORWARD_BUDGET_MS) return;
      created = created.filter((time) => at - time < HOUR_MS);
      if (created.length >= FEEDBACK_ISSUES_PER_HOUR) return;
      if ((await forwardReport(store, item.id, item.month)) === "stop") return;
    }
  }

  return { pass };
}
