import {
  CACHE_PREFIX,
  INSTALL_CONCURRENCY,
  OFFLINE_PAGE_PATH,
  type PrecacheStatus,
  REVISION_PARAM,
  type WorkerBuildData,
} from "./config";
import {
  FLIGHT_CONTENT_TYPE,
  FLIGHT_FETCH_HEADERS,
  fetchInit,
  flightLookupPath,
  isFlightEntry,
  navigationFallbackPath,
  networkTimeoutSeconds,
  PAGE_TIMEOUT_SECONDS,
  parseRange,
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
          ...(isFlightEntry(url) ? { headers: FLIGHT_FETCH_HEADERS } : {}),
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

  type NetworkFirstOptions = {
    timeoutSeconds: number;
    // The precached copy answered after the timeout or on a network error.
    fallback: string;
    // Answered on a network error when `fallback` is not stored. Not after a
    // timeout: a slow network may still bring the real answer.
    offlineFallback?: string;
    // Applied to a stored answer.
    adapt?: (stored: Response) => Response;
  };

  // Network first, the precache after the timeout or on a network error.
  const networkFirst = async (
    request: Request,
    { timeoutSeconds, fallback, offlineFallback, adapt }: NetworkFirstOptions,
  ): Promise<Response> => {
    const init = fetchInit("network-first");
    const network = acceptsInit(request, init)
      ? deps.fetch(request, init)
      : deps.fetch(request);
    // The timer may win and the network answer then be dropped; its failure
    // must not surface as an unhandled rejection.
    network.catch(() => {});
    const stored = async (path: string | undefined) => {
      const hit = path === undefined ? undefined : await lookup(path);
      return hit && adapt ? adapt(hit) : hit;
    };
    try {
      const first = await Promise.race([
        network,
        deps.wait(timeoutSeconds * 1000).then(() => null),
      ]);
      if (first) return first;
      return (await stored(fallback)) ?? (await network);
    } catch {
      return (
        (await stored(fallback)) ??
        (await stored(offlineFallback)) ??
        Response.error()
      );
    }
  };

  // A page, or a lesson file. A navigation whose page is not precached gets
  // the offline page rather than the browser's error screen: on iOS a failed
  // navigation can leave the app on a frozen screen.
  const respondNetworkFirst = (request: Request): Promise<Response> =>
    networkFirst(request, {
      timeoutSeconds: networkTimeoutSeconds(request.mode),
      fallback: navigationFallbackPath(request.url),
      offlineFallback:
        request.mode === "navigate" ? OFFLINE_PAGE_PATH : undefined,
    });

  // A stored flight is answered with the RSC content type the router checks
  // for, whatever the server sent at install.
  const asFlight = (stored: Response): Response => {
    const headers = new Headers(stored.headers);
    headers.set("content-type", FLIGHT_CONTENT_TYPE);
    return new Response(stored.body, {
      status: stored.status,
      statusText: stored.statusText,
      headers,
    });
  };

  // An in-app navigation waits no longer than a page load would. A flight
  // that is not precached is a network error, and the router then loads the
  // page as a navigation, which gets the offline page.
  const respondFlight = (request: Request): Promise<Response> =>
    networkFirst(request, {
      timeoutSeconds: PAGE_TIMEOUT_SECONDS,
      fallback: flightLookupPath(new URL(request.url)),
      adapt: asFlight,
    });

  // The asked-for slice of a precached file. A file not stored (an install
  // still running) goes to the network as it came.
  const respondRange = async (request: Request): Promise<Response> => {
    const hit = await lookup(precacheLookupPath(new URL(request.url)));
    if (!hit) return deps.fetch(request);
    const bytes = await hit.arrayBuffer();
    const size = bytes.byteLength;
    const range = parseRange(request.headers.get("range") ?? "", size);
    const headers = new Headers(hit.headers);
    headers.set("accept-ranges", "bytes");
    if (range === null) {
      headers.set("content-length", String(size));
      return new Response(bytes, { status: 200, headers });
    }
    if (range === "unsatisfiable") {
      return new Response(null, {
        status: 416,
        headers: { "content-range": `bytes */${size}` },
      });
    }
    const { start, end } = range;
    headers.set("content-range", `bytes ${start}-${end}/${size}`);
    headers.set("content-length", String(end - start + 1));
    return new Response(bytes.slice(start, end + 1), { status: 206, headers });
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
    switch (route) {
      case "passthrough":
        return null;
      case "network-first":
        return respondNetworkFirst(request);
      case "flight-network-first":
        return respondFlight(request);
      case "precache-range":
        return respondRange(request);
      case "precache-first":
        return lookup(precacheLookupPath(new URL(request.url))).then(
          (hit) => hit ?? deps.fetch(request),
        );
    }
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
