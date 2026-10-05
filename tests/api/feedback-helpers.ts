import { NextRequest } from "next/server";
import type { AccessConfig } from "@/access/env";
import { syncKey } from "@/sync/store/keys";
import { createMemoryStore } from "@/sync/store/memory";
import type { BlobStore } from "@/sync/store/types";
import type { FeedbackRecord, FeedbackRequest } from "@/user-feedback/schema";
import {
  createFeedbackService,
  type FeedbackLogEntry,
  type FeedbackServiceDeps,
} from "@/user-feedback/server";
import { parentReport } from "../user-feedback/fixtures";
import { ACCESS, cookieFor, FAMILY, HOST, PREFIX } from "./sync-helpers";

export { ACCESS, cookieFor, FAMILY, HOST, PREFIX };

// The server clock of the tests: a few hours after the fixture's `createdAt`.
export const START = "2026-10-05T14:00:00.000Z";

export function feedbackHarness(
  options: {
    access?: AccessConfig;
    store?: BlobStore | null;
    onStored?: FeedbackServiceDeps["onStored"];
  } = {},
) {
  const store =
    options.store === undefined ? createMemoryStore() : options.store;
  let clock = new Date(START);
  const logs: FeedbackLogEntry[] = [];
  const service = createFeedbackService({
    store,
    prefix: PREFIX,
    app: "5fc3656",
    readAccess: () => options.access ?? ACCESS,
    now: () => clock,
    log: (entry) => logs.push(entry),
    ...(options.onStored ? { onStored: options.onStored } : {}),
  });
  return {
    store: store as BlobStore,
    service,
    logs,
    setNow(iso: string) {
      clock = new Date(iso);
    },
    async record(
      id: string,
      month = "2026-10",
    ): Promise<FeedbackRecord | null> {
      const found = await (store as BlobStore).get(
        syncKey(PREFIX, { kind: "feedback", month, reportId: id }),
      );
      return found && "body" in found ? JSON.parse(found.body) : null;
    },
    async pending(): Promise<string[]> {
      const found = await (store as BlobStore).get(
        syncKey(PREFIX, { kind: "feedback-pending" }),
      );
      return found && "body" in found
        ? JSON.parse(found.body).items.map((item: { id: string }) => item.id)
        : [];
    },
  };
}

type RequestOptions = {
  cookie?: string | null;
  headers?: Record<string, string>;
  body?: string;
};

export async function feedbackRequest(
  report: Partial<FeedbackRequest> | Record<string, unknown> = parentReport(),
  { cookie, headers = {}, body }: RequestOptions = {},
): Promise<NextRequest> {
  return new NextRequest(`https://${HOST}/api/feedback`, {
    method: "POST",
    headers: {
      host: HOST,
      origin: `https://${HOST}`,
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.7",
      ...(cookie === null
        ? {}
        : { cookie: cookie ?? (await cookieFor(FAMILY)) }),
      ...headers,
    },
    body: body ?? JSON.stringify(report),
  });
}

// A report id from a number, so tests can make many distinct reports.
export const reportId = (n: number) => n.toString(16).padStart(32, "0");
