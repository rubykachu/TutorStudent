import { TEST_PREFIX_PATTERN } from "./keys";
import type { AdapterOptions, BlobStore } from "./types";

// `delete` is confined to the `test/<run-id>/` prefix a store was created
// with; a store created without one cannot delete at all.
export function assertDeletable(
  testPrefix: string | undefined,
  key: string,
): void {
  if (
    testPrefix === undefined ||
    !TEST_PREFIX_PATTERN.test(testPrefix) ||
    !key.startsWith(testPrefix) ||
    key.includes("..")
  ) {
    throw new Error("delete is limited to keys under the store's test prefix");
  }
}

// The store of the optional real-bucket smoke test: every read, write and
// delete stays under `prefix`, which must be `test/<run-id>/` (never `prod/`,
// `dev/`, empty or a path with `..`). `make` builds the underlying adapter,
// given the prefix its `delete` is confined to.
export function createTestStore(
  prefix: string,
  make: (options: Required<AdapterOptions>) => BlobStore,
): BlobStore {
  if (!TEST_PREFIX_PATTERN.test(prefix)) {
    throw new Error("a test store needs a test/<run-id>/ prefix");
  }
  const inner = make({ testPrefix: prefix });
  const inside = (key: string): string => {
    assertDeletable(prefix, key);
    return key;
  };
  return {
    get: async (key, options) => inner.get(inside(key), options),
    put: async (key, body, options) => inner.put(inside(key), body, options),
    delete: async (key) => inner.delete(inside(key)),
  };
}
