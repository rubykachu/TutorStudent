import { stableHash } from "./etag";
import { assertDeletable } from "./test-store";
import type {
  AdapterOptions,
  BlobStore,
  GetOptions,
  GetResult,
  PutOptions,
  PutResult,
} from "./types";

// A store that lives in the process: for unit and API tests.
export function createMemoryStore(options: AdapterOptions = {}): BlobStore {
  const blobs = new Map<string, { body: string; etag: string }>();
  return {
    async get(
      key: string,
      { ifNoneMatch }: GetOptions = {},
    ): Promise<GetResult> {
      const blob = blobs.get(key);
      if (!blob) return null;
      if (ifNoneMatch === blob.etag)
        return { unchanged: true, etag: blob.etag };
      return { ...blob };
    },
    async put(
      key: string,
      body: string,
      condition: PutOptions = {},
    ): Promise<PutResult> {
      const current = blobs.get(key);
      if (condition.ifNoneMatch === "*" && current) return { conflict: true };
      if (
        condition.ifMatch !== undefined &&
        current?.etag !== condition.ifMatch
      ) {
        return { conflict: true };
      }
      const etag = stableHash(body);
      blobs.set(key, { body, etag });
      return { etag };
    },
    async delete(key: string): Promise<void> {
      assertDeletable(options.testPrefix, key);
      blobs.delete(key);
    },
  };
}
