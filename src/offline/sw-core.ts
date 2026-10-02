import {
  CACHE_PREFIX,
  INSTALL_CONCURRENCY,
  type PrecacheStatus,
  REVISION_PARAM,
  type WorkerBuildData,
} from "./config";
import {
  fetchInit,
  navigationFallbackPath,
  PAGE_TIMEOUT_SECONDS,
  precacheLookupPath,
  routeFor,
  storable,
} from "./strategy";

// The service worker's behaviour with every browser dependency injected, so
// Vitest runs it on a fake cache and a fake network. `sw.ts` wires it to the
// worker's events. The only cache is the precache of the current build:
// nothing is ever stored while answering a request.

export type CoreDeps = WorkerBuildData & {
  origin: string;
  caches: CacheStorage;
  fetch: typeof fetch;
  // Resolves after `ms` milliseconds.
  wait: (ms: number) => Promise<void>;
};

export type Core = {
  cacheName: string;
  install: () => Promise<void>;
  activate: () => Promise<void>;
  // The response for a request, or null when the browser should handle it.
  respond: (request: Request) => Promise<Response> | null;
  status: () => Promise<PrecacheStatus>;
};

// Runs `task` over `items`, `limit` at a time. The first failure stops new
// work and rejects once the running tasks end.
export async function runPool<T>(
  limit: number,
  items: readonly T[],
  task: (item: T) => Promise<void>,
): Promise<void> {
  let next = 0;
  let failure: { error: unknown } | null = null;
  const worker = async () => {
    while (failure === null && next < items.length) {
      const item = items[next++] as T;
      try {
        await task(item);
      } catch (error) {
        failure ??= { error };
      }
    }
  };
  await Promise.all(Array.from({ length: limit }, worker));
  if (failure !== null) throw (failure as { error: unknown }).error;
}

// Whether `request` may be fetched with `init`. The Fetch standard turns a
// navigation request copied with an init into a same-origin one; an engine
// that refuses the copy instead (WebKit is not covered by the offline E2E)
// would fail every network-first page fetch, and the worker would then answer
// every navigation from the precache. Such an engine gets the request as it
// came, which loses only the cache hint.
function acceptsInit(request: Request, init: RequestInit): boolean {
  try {
    new Request(request, init);
    return true;
  } catch {
    return false;
  }
}

export function createCore(deps: CoreDeps): Core {
  const cacheName = `${CACHE_PREFIX}${deps.buildId}`;
  const absolute = (path: string) => new URL(path, deps.origin).href;

  // Path (with query) of each entry to the request that keys it in the cache.
  const keys = new Map<string, string>();
  for (const { url, revision } of deps.entries) {
    const key =
      revision === null
        ? url
        : `${url}${url.includes("?") ? "&" : "?"}${REVISION_PARAM}=${revision}`;
    keys.set(url, absolute(key));
  }

  let progress: { cached: number; failed: boolean } | null = null;

  const lookup = async (path: string): Promise<Response | undefined> => {
    const key = keys.get(path);
    if (!key) return undefined;
    const cache = await deps.caches.open(cacheName);
    return cache.match(key, { ignoreVary: true });
  };

  const install = async () => {
    progress = { cached: 0, failed: false };
    const state = progress;
    const previousNames = (await deps.caches.keys()).filter(
      (name) => name.startsWith(CACHE_PREFIX) && name !== cacheName,
    );
    const previous = await Promise.all(
      previousNames.map((name) => deps.caches.open(name)),
    );
    const cache = await deps.caches.open(cacheName);
    try {
      await runPool(INSTALL_CONCURRENCY, deps.entries, async ({ url }) => {
        const key = keys.get(url) as string;
        // An unchanged entry of an older build is copied, not downloaded.
        for (const old of previous) {
          const hit = await old.match(key, { ignoreVary: true });
          if (hit) {
            await cache.put(key, hit);
            state.cached++;
            return;
          }
        }
        const target = absolute(url);
        const response = await deps.fetch(target, {
          ...fetchInit("install"),
          credentials: "same-origin",
        });
        if (!storable(response, target)) {
          throw new Error(
            `${url} answered ${response.status}${response.redirected ? " after a redirect" : ""}; not stored`,
          );
        }
        await cache.put(key, response);
        state.cached++;
      });
      // A newer build that took over meanwhile deletes every other build's
      // cache, this one included: the entries above then went into a cache
      // no lookup can reach, and this worker would run with nothing stored.
      if (!(await deps.caches.has(cacheName))) {
        throw new Error(`${cacheName} was deleted during the install`);
      }
    } catch (error) {
      // All or nothing: a partial cache is never left behind.
      state.failed = true;
      await deps.caches.delete(cacheName);
      throw error;
    }
  };

  const activate = async () => {
    const names = await deps.caches.keys();
    await Promise.all(
      names
        .filter((name) => name.startsWith(CACHE_PREFIX) && name !== cacheName)
        .map((name) => deps.caches.delete(name)),
    );
  };

  const fromPrecache = async (path: string): Promise<Response> =>
    (await lookup(path)) ?? Response.error();

  const respondNetworkFirst = async (request: Request): Promise<Response> => {
    const fallbackPath = navigationFallbackPath(request.url);
    const init = fetchInit("network-first");
    const network = acceptsInit(request, init)
      ? deps.fetch(request, init)
      : deps.fetch(request);
    // The timer may win and the network answer then be dropped; its failure
    // must not surface as an unhandled rejection.
    network.catch(() => {});
    if (request.mode !== "navigate") {
      // Lesson files fall back only on a network error: a slow answer never
      // mixes an old lesson file into a new page.
      try {
        return await network;
      } catch {
        return fromPrecache(fallbackPath);
      }
    }
    try {
      const first = await Promise.race([
        network,
        deps.wait(PAGE_TIMEOUT_SECONDS * 1000).then(() => null),
      ]);
      if (first) return first;
      return (await lookup(fallbackPath)) ?? (await network);
    } catch {
      return fromPrecache(fallbackPath);
    }
  };

  const respond = (request: Request): Promise<Response> | null => {
    const route = routeFor({
      url: request.url,
      method: request.method,
      mode: request.mode,
      headers: request.headers,
      origin: deps.origin,
      mediaBaseUrl: deps.mediaBaseUrl,
      isPrecached: (url) => keys.has(precacheLookupPath(url)),
    });
    if (route === "passthrough") return null;
    if (route === "network-first") return respondNetworkFirst(request);
    return lookup(precacheLookupPath(new URL(request.url))).then(
      (hit) => hit ?? deps.fetch(request),
    );
  };

  // `progress` is only known to the worker instance that ran the install and
  // is lost when the browser stops and restarts a worker, so a finished
  // install is read back from the cache, which is written all or nothing.
  const status = async (): Promise<PrecacheStatus> => {
    const total = deps.entries.length;
    if (progress?.failed) {
      return { state: "failed", cached: progress.cached, total };
    }
    if (progress && progress.cached < total) {
      return { state: "installing", cached: progress.cached, total };
    }
    const cache = await deps.caches.open(cacheName);
    const cached = (await cache.keys()).length;
    return { state: cached === total ? "ready" : "incomplete", cached, total };
  };

  return { cacheName, install, activate, respond, status };
}
