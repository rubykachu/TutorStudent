import { DEPLOYMENT_ID_PARAM } from "./config";

// How the service worker answers each request, as pure functions the worker
// calls and Vitest tests. No Node or DOM imports: the worker bundle includes
// this file.

export type Route =
  // Ask the network first (never from the HTTP cache), fall back to the
  // precached copy; the network's answer is returned untouched, never stored.
  | "network-first"
  // Answer from the precache; a miss goes to the network and is not stored.
  | "precache-first"
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

// How long a page waits for the network before the precached copy answers
// (navigations only; lesson files wait for a network error, never a timer).
export const PAGE_TIMEOUT_SECONDS = 3;

function isUnder(pathname: string, folder: string): boolean {
  return pathname === folder || pathname.startsWith(`${folder}/`);
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
  // A full cached 200 can break media playback in Safari.
  if (request.headers.get("range") !== null) return "passthrough";
  if (isUnder(pathname, "/api")) return "passthrough";
  if (isUnder(pathname, "/media") || pathname.endsWith(".vtt")) {
    return "passthrough";
  }
  // Needs the network to set the cookie.
  if (isUnder(pathname, "/unlock")) return "passthrough";
  // Offline the router's fetch fails and falls back to a browser navigation,
  // which is answered below.
  if (
    request.headers.get("rsc") !== null ||
    request.headers.get("next-router-prefetch") !== null ||
    url.searchParams.has("_rsc")
  ) {
    return "passthrough";
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
