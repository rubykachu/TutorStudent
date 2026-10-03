import { DEPLOYMENT_ID_PARAM, FLIGHT_PARAM } from "./config";

// How the service worker answers each request, as pure functions the worker
// calls and Vitest tests. No Node or DOM imports: the worker bundle includes
// this file.

export type Route =
  // Ask the network first (never from the HTTP cache), fall back to the
  // precached copy; the network's answer is returned untouched, never stored.
  | "network-first"
  // Answer from the precache; a miss goes to the network and is not stored.
  | "precache-first"
  // A page's RSC payload (the "flight" Next's client router fetches on an
  // in-app navigation): the network first, then the page's precached flight.
  // Without it the router falls back to a full page load, which offline
  // unloads the page (cutting a sound short) and, on a miss, strands it.
  | "flight-network-first"
  // A `Range` request for a precached file: the asked-for slice of the
  // precached copy as a 206.
  | "precache-range"
  // Not handled: the browser's default.
  | "passthrough";

export type RouteRequest = {
  // Absolute URL.
  url: string;
  method?: string;
  mode: string;
  headers: { get(name: string): string | null };
  // The origin the worker runs on.
  origin: string;
  // `NEXT_PUBLIC_MEDIA_BASE_URL` as built: empty, a path or a full URL.
  mediaBaseUrl?: string;
  // Whether the precache holds this URL (path plus query).
  isPrecached: (url: URL) => boolean;
};

// How long a page waits for the network before the precached copy answers.
export const PAGE_TIMEOUT_SECONDS = 3;

// The same for a lesson file (`/content/*.json`). Longer than a page, because
// a slow answer that comes after the page's own fallback mixes an old page
// with a new lesson file; the timer only bounds wifi without internet, where
// the browser would wait about 60 s.
export const CONTENT_TIMEOUT_SECONDS = 10;

// Seconds the network gets before the precached copy answers.
export function networkTimeoutSeconds(mode: string): number {
  return mode === "navigate" ? PAGE_TIMEOUT_SECONDS : CONTENT_TIMEOUT_SECONDS;
}

function isUnder(pathname: string, folder: string): boolean {
  return pathname === folder || pathname.startsWith(`${folder}/`);
}

// Headers Next's client router sends with an RSC request
// (`next/dist/client/components/app-router-headers`).
const RSC_HEADER = "rsc";
const PREFETCH_HEADERS = [
  "next-router-prefetch",
  "next-router-segment-prefetch",
] as const;

function isFlightRequest(headers: RouteRequest["headers"], url: URL): boolean {
  return headers.get(RSC_HEADER) !== null || url.searchParams.has(FLIGHT_PARAM);
}

function isPrefetch(headers: RouteRequest["headers"]): boolean {
  return PREFETCH_HEADERS.some((name) => headers.get(name) !== null);
}

// The request headers the worker sends to fetch a page's full flight at
// install: no router state, so the server answers the whole page tree, the
// same payload `next build` wrote to `<page>.rsc`.
export const FLIGHT_FETCH_HEADERS: Readonly<Record<string, string>> = {
  [RSC_HEADER]: "1",
};

// The content type Next's router requires of a flight; any other answer
// makes it load the page as a full navigation.
export const FLIGHT_CONTENT_TYPE = "text/x-component";

// The precache entry of a page's flight: the page path with a bare
// `?_rsc`. Next checks that `_rsc` matches a hash of the router headers; a
// request with only `RSC: 1` hashes to the empty value, so this URL is the
// one the server accepts without a redirect.
export function flightEntryPath(pagePath: string): string {
  return `${pagePath}?${FLIGHT_PARAM}`;
}

export function isFlightEntry(entryUrl: string): boolean {
  return entryUrl.endsWith(`?${FLIGHT_PARAM}`);
}

// The flight entry an RSC request is answered from: its path only. The
// `_rsc` hash, the deployment id and any page query are dropped, as for a
// page (`navigationFallbackPath`): every page is static, its flight does
// not depend on them.
export function flightLookupPath(url: URL): string {
  return flightEntryPath(url.pathname);
}

export function routeFor(request: RouteRequest): Route {
  const url = new URL(request.url);
  const { pathname } = url;

  // Media is never stored, whatever serves it.
  if (url.origin !== request.origin) return "passthrough";
  if (request.mediaBaseUrl && request.url.startsWith(request.mediaBaseUrl)) {
    return "passthrough";
  }
  if (request.method && request.method !== "GET") return "passthrough";
  if (isUnder(pathname, "/api")) return "passthrough";
  if (isUnder(pathname, "/media") || pathname.endsWith(".vtt")) {
    return "passthrough";
  }
  // Needs the network to set the cookie.
  if (isUnder(pathname, "/unlock")) return "passthrough";
  if (isFlightRequest(request.headers, url)) {
    // A prefetch asks for a part of a page in another format than the full
    // flight; offline it fails, which only means the navigation itself asks
    // for the full flight later.
    if (isPrefetch(request.headers)) return "passthrough";
    return "flight-network-first";
  }
  // Safari's audio element asks for a byte range and needs a 206 for it, not
  // the whole file. Only precached files (short sounds) are sliced; media is
  // never stored and goes to the network.
  if (request.headers.get("range") !== null) {
    return request.isPrecached(url) ? "precache-range" : "passthrough";
  }

  if (request.mode === "navigate") return "network-first";
  if (isUnder(pathname, "/content") && pathname.endsWith(".json")) {
    return "network-first";
  }
  if (request.isPrecached(url)) return "precache-first";
  return "passthrough";
}

export type FetchKind = "network-first" | "install";

// `no-cache` makes the browser revalidate, so the 60 s HTTP cache of
// `/content/*` cannot hide a new lesson; `reload` at install never stores a
// stale HTTP-cache copy under a new revision.
export function fetchInit(kind: FetchKind): { cache: RequestCache } {
  return { cache: kind === "install" ? "reload" : "no-cache" };
}

export type StorableResponse = {
  status: number;
  redirected: boolean;
  type: string;
  url: string;
};

function sameUrl(a: string, b: string): boolean {
  try {
    return new URL(a).href === new URL(b).href;
  } catch {
    return false;
  }
}

// Only a plain 200 for the very URL asked for is stored: a redirect target
// such as `/unlock`, a 401 or an opaque answer never enters the precache.
export function storable(
  response: StorableResponse,
  requestedUrl: string,
): boolean {
  return (
    response.status === 200 &&
    !response.redirected &&
    response.type !== "opaque" &&
    response.type !== "opaqueredirect" &&
    sameUrl(response.url, requestedUrl)
  );
}

// The path (with query) a request is looked up under in the precache. The
// deployment id parameter Next adds to build file URLs is dropped: the build
// files are listed by their bare URL, and the parameter only busts caches.
export function precacheLookupPath(url: URL): string {
  if (!url.searchParams.has(DEPLOYMENT_ID_PARAM)) {
    return url.pathname + url.search;
  }
  const params = new URLSearchParams(url.search);
  params.delete(DEPLOYMENT_ID_PARAM);
  const query = params.toString();
  return query ? `${url.pathname}?${query}` : url.pathname;
}

// The precached page a navigation falls back to: same path, query ignored.
export function navigationFallbackPath(url: string): string {
  return new URL(url).pathname;
}

// A byte range of a file of `size` bytes, both ends inclusive.
export type ByteRange = { start: number; end: number };

// Reads a `Range` header against a file of `size` bytes. "unsatisfiable"
// asks for a 416; null means the header is one this worker does not slice
// (several ranges, another unit, a malformed value) and the whole file is
// answered with a 200, which a `Range` request allows.
export function parseRange(
  header: string,
  size: number,
): ByteRange | "unsatisfiable" | null {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match) return null;
  const [, first, last] = match as unknown as [string, string, string];
  if (first === "" && last === "") return null;
  if (first === "") {
    // The last `last` bytes.
    const length = Number(last);
    if (length === 0 || size === 0) return "unsatisfiable";
    return { start: Math.max(0, size - length), end: size - 1 };
  }
  const start = Number(first);
  if (start >= size) return "unsatisfiable";
  const end = last === "" ? size - 1 : Math.min(Number(last), size - 1);
  if (end < start) return null;
  return { start, end };
}
