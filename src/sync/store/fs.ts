import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
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

const SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

// A store in a folder, for running several local devices against one server.
// It writes under `root` only: a key is split into plain segments and any
// other shape is refused. Writes of one process are serialised, so a
// conditional write is atomic there.
export function createFsStore(
  root: string,
  options: AdapterOptions = {},
): BlobStore {
  const base = path.resolve(root);
  let queue: Promise<unknown> = Promise.resolve();
  const exclusive = <T>(work: () => Promise<T>): Promise<T> => {
    const run = queue.then(work, work);
    queue = run.catch(() => undefined);
    return run;
  };

  const fileOf = (key: string): string => {
    const segments = key.split("/");
    if (segments.some((segment) => !SEGMENT.test(segment))) {
      throw new Error("invalid key for the folder store");
    }
    const file = path.join(base, ...segments);
    if (!file.startsWith(base + path.sep)) {
      throw new Error("invalid key for the folder store");
    }
    return file;
  };

  const read = async (file: string): Promise<string | null> => {
    try {
      return await readFile(file, "utf8");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  };

  return {
    async get(
      key: string,
      { ifNoneMatch }: GetOptions = {},
    ): Promise<GetResult> {
      const body = await read(fileOf(key));
      if (body === null) return null;
      const etag = stableHash(body);
      return ifNoneMatch === etag ? { unchanged: true, etag } : { body, etag };
    },
    async put(
      key: string,
      body: string,
      condition: PutOptions = {},
    ): Promise<PutResult> {
      const file = fileOf(key);
      return exclusive(async () => {
        const current = await read(file);
        if (condition.ifNoneMatch === "*" && current !== null) {
          return { conflict: true };
        }
        if (
          condition.ifMatch !== undefined &&
          (current === null || stableHash(current) !== condition.ifMatch)
        ) {
          return { conflict: true };
        }
        await mkdir(path.dirname(file), { recursive: true });
        const temp = `${file}.${process.pid}.tmp`;
        await writeFile(temp, body, "utf8");
        await rename(temp, file);
        return { etag: stableHash(body) };
      });
    },
    async delete(key: string): Promise<void> {
      assertDeletable(options.testPrefix, key);
      const file = fileOf(key);
      return exclusive(() => rm(file, { force: true }));
    },
  };
}
