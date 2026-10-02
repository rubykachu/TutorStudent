// Where synced docs are kept: a key-value store of text bodies with ETags and
// conditional writes (the S3 / R2 model). The adapters are `memory` (tests),
// `fs` (a folder, for local multi-device runs) and, later, the real bucket.
// Bodies are JSON text; an ETag is an opaque string that changes whenever the
// body does.

export type StoredBlob = { body: string; etag: string };

// `unchanged`: the caller's `ifNoneMatch` etag is still the current one.
export type GetResult = StoredBlob | { unchanged: true; etag: string } | null;

export type GetOptions = { ifNoneMatch?: string };

// `ifMatch`: replace only while the stored etag is this one (a missing key
// never matches). `ifNoneMatch: "*"`: create only when the key is missing.
// Neither: an unconditional write. The two are never given together.
export type PutOptions =
  | { ifMatch?: undefined; ifNoneMatch?: undefined }
  | { ifMatch: string; ifNoneMatch?: undefined }
  | { ifMatch?: undefined; ifNoneMatch: "*" };

export type PutResult = { etag: string } | { conflict: true };

export interface BlobStore {
  get(key: string, options?: GetOptions): Promise<GetResult>;
  put(key: string, body: string, options?: PutOptions): Promise<PutResult>;
  // Exists for the optional real-bucket smoke test only: it refuses every key
  // outside the `test/<run-id>/` prefix the store was created with, and every
  // key when it has none.
  delete(key: string): Promise<void>;
}

// What every adapter takes: the prefix `delete` is confined to, if any.
export type AdapterOptions = { testPrefix?: string };
