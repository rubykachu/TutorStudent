import { createHash } from "node:crypto";

// A bucket that answers like R2's S3 API to the requests the adapter signs:
// path-style keys, `If-Match` / `If-None-Match` on GET and PUT, quoted MD5
// ETags, XML error bodies. It records every request so a test can look at
// what was sent. One request is handled at a time, as the real bucket orders
// conditional writes of one key.
export type SeenRequest = {
  method: string;
  url: string;
  headers: Headers;
  body: string;
};

export function createFakeS3(bucket: string) {
  const objects = new Map<string, { body: string; etag: string }>();
  const seen: SeenRequest[] = [];
  const pathPrefix = `/${bucket}/`;

  const xmlError = (status: number, code: string) =>
    new Response(`<?xml version="1.0"?><Error><Code>${code}</Code></Error>`, {
      status,
      headers: { "content-type": "application/xml" },
    });

  const handle = async (input: Request): Promise<Response> => {
    const request = input.clone();
    const url = new URL(request.url);
    const body = await request.text();
    seen.push({
      method: request.method,
      url: request.url,
      headers: request.headers,
      body,
    });
    if (!url.pathname.startsWith(pathPrefix))
      return xmlError(404, "NoSuchBucket");
    const key = decodeURIComponent(url.pathname.slice(pathPrefix.length));
    const current = objects.get(key);
    const ifMatch = request.headers.get("if-match");
    const ifNoneMatch = request.headers.get("if-none-match");

    if (request.method === "GET") {
      if (!current) return xmlError(404, "NoSuchKey");
      if (ifNoneMatch === `"${current.etag}"`) {
        return new Response(null, {
          status: 304,
          headers: { etag: `"${current.etag}"` },
        });
      }
      return new Response(current.body, {
        status: 200,
        headers: { etag: `"${current.etag}"` },
      });
    }
    if (request.method === "PUT") {
      if (ifNoneMatch === "*" && current) {
        return xmlError(412, "PreconditionFailed");
      }
      if (ifMatch !== null && !current) return xmlError(404, "NoSuchKey");
      if (ifMatch !== null && ifMatch !== `"${current?.etag}"`) {
        return xmlError(412, "PreconditionFailed");
      }
      const etag = createHash("md5").update(body).digest("hex");
      objects.set(key, { body, etag });
      return new Response(null, {
        status: 200,
        headers: { etag: `"${etag}"` },
      });
    }
    if (request.method === "DELETE") {
      objects.delete(key);
      return new Response(null, { status: 204 });
    }
    return xmlError(405, "MethodNotAllowed");
  };

  let queue: Promise<unknown> = Promise.resolve();
  const fetchFake = ((input: Request) => {
    const run = queue.then(() => handle(input));
    queue = run.catch(() => undefined);
    return run;
  }) as unknown as typeof fetch;

  return { fetch: fetchFake, objects, seen };
}
