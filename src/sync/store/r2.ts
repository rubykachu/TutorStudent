import { AwsClient } from "aws4fetch";
import { SYNC_STORE_TIMEOUT_MS } from "@/lib/config";
import { assertDeletable } from "./test-store";
import type {
  AdapterOptions,
  BlobStore,
  GetOptions,
  GetResult,
  PutOptions,
  PutResult,
} from "./types";

// The private Cloudflare R2 bucket, over its S3-compatible API with signed
// (SigV4) requests, path style: `https://<account>.r2.cloudflarestorage.com/
// <bucket>/<key>`. Conditional requests are the store contract's:
//   - `get` with `ifNoneMatch` sends `If-None-Match`; 304 is `unchanged`;
//   - `put` sends `If-Match` or `If-None-Match: *`; a failed condition is
//     `conflict`.
// Requests are signed with aws4fetch's `sign` and sent with `fetch` here, not
// with `AwsClient.fetch`, which retries on its own: a retried write could land
// twice, and the sync client already retries a failed doc.

export type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
};

export type R2Options = AdapterOptions & {
  // Replaces the global `fetch` (tests answer from a fake bucket).
  fetch?: typeof fetch;
};

// An unexpected answer from the bucket (not a missing key and not a failed
// condition). It carries the HTTP status and the S3 error code, never the
// request or the credentials.
export class R2Error extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
  ) {
    super(`R2 answered ${status} ${code}`);
    this.name = "R2Error";
  }
}

// The one place an ETag changes shape: R2 sends it quoted (and an S3 proxy may
// add `W/`), the contract holds it bare.
export function bareEtag(header: string): string {
  return header.replace(/^W\//, "").replace(/^"(.*)"$/, "$1");
}

const quoted = (etag: string): string => `"${etag}"`;

async function errorCode(response: Response): Promise<string> {
  try {
    const text = await response.text();
    return /<Code>([A-Za-z0-9]+)<\/Code>/.exec(text)?.[1] ?? "unknown";
  } catch {
    return "unknown";
  }
}

export function createR2Store(
  config: R2Config,
  options: R2Options = {},
): BlobStore {
  const client = new AwsClient({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    service: "s3",
    region: "auto",
  });
  const send = options.fetch ?? fetch;
  const base = `https://${config.accountId}.r2.cloudflarestorage.com/${config.bucket}/`;

  const request = async (
    key: string,
    init: { method: string; headers?: Record<string, string>; body?: string },
  ): Promise<Response> => {
    const url = base + key.split("/").map(encodeURIComponent).join("/");
    const signed = await client.sign(url, {
      ...init,
      signal: AbortSignal.timeout(SYNC_STORE_TIMEOUT_MS),
    });
    return send(signed);
  };

  return {
    async get(
      key: string,
      { ifNoneMatch }: GetOptions = {},
    ): Promise<GetResult> {
      const response = await request(key, {
        method: "GET",
        headers:
          ifNoneMatch === undefined
            ? undefined
            : { "if-none-match": quoted(ifNoneMatch) },
      });
      if (response.status === 304) {
        const header = response.headers.get("etag");
        return {
          unchanged: true,
          etag: header === null ? (ifNoneMatch ?? "") : bareEtag(header),
        };
      }
      if (response.status === 404) return null;
      if (response.status !== 200) {
        throw new R2Error(response.status, await errorCode(response));
      }
      const header = response.headers.get("etag");
      if (header === null) throw new R2Error(200, "MissingETag");
      return { body: await response.text(), etag: bareEtag(header) };
    },

    async put(
      key: string,
      body: string,
      condition: PutOptions = {},
    ): Promise<PutResult> {
      const headers: Record<string, string> = {
        "content-type": "application/json",
      };
      if (condition.ifMatch !== undefined) {
        headers["if-match"] = quoted(condition.ifMatch);
      }
      if (condition.ifNoneMatch === "*") headers["if-none-match"] = "*";
      const response = await request(key, { method: "PUT", headers, body });
      if (response.status === 200) {
        const header = response.headers.get("etag");
        if (header === null) throw new R2Error(200, "MissingETag");
        return { etag: bareEtag(header) };
      }
      // 412: the condition failed. 409: another conditional write of the same
      // key was in flight (S3's `ConditionalRequestConflict`); the caller's
      // answer is the same, read the current doc and try again. 404 with
      // `If-Match`: the key is missing, which never matches.
      if (
        response.status === 412 ||
        response.status === 409 ||
        (response.status === 404 && condition.ifMatch !== undefined)
      ) {
        return { conflict: true };
      }
      throw new R2Error(response.status, await errorCode(response));
    },

    async delete(key: string): Promise<void> {
      assertDeletable(options.testPrefix, key);
      const response = await request(key, { method: "DELETE" });
      if (response.status === 204 || response.status === 404) return;
      if (response.status !== 200) {
        throw new R2Error(response.status, await errorCode(response));
      }
    },
  };
}
