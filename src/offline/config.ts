// Shared by the service worker, the page that registers it, the build step
// that writes it and the gate: one place for where the worker lives and how
// the page and the worker talk.

// The worker script sits at the site root, so its scope is the whole app
// without a `Service-Worker-Allowed` header. `scripts/offline-worker.ts`
// writes it to `public/<WORKER_FILE>` after `next build`.
export const WORKER_FILE = "sw.js";
export const WORKER_PATH = `/${WORKER_FILE}`;
export const WORKER_SCOPE = "/";

// One cache per build, named after the build id, written all or nothing.
export const CACHE_PREFIX = "offline-";

// A revisioned entry is stored under its URL plus this query parameter, so a
// changed file is a new key and an unchanged one can be copied from the
// previous build's cache.
export const REVISION_PARAM = "__rev";

// The query parameter Next adds to every build file URL when the build has a
// deployment id (`NEXT_DEPLOYMENT_ID`, set by Vercel when Skew Protection is
// on): `/_next/static/chunks/x.js?dpl=<id>`. The worker stores the file under
// its bare URL, so a lookup ignores this parameter.
export const DEPLOYMENT_ID_PARAM = "dpl";

// The query parameter Next's client router puts on an RSC request
// (`?_rsc=<hash of the router headers>`). A page's flight is precached under
// the page path with a bare `?_rsc` (`flightEntryPath`).
export const FLIGHT_PARAM = "_rsc";

// The page a navigation gets offline when its own page is not precached
// (a lesson added after this build, a mistyped address). It is precached
// like every other page.
export const OFFLINE_PAGE_PATH = "/offline";

// Entries fetched at the same time during install.
export const INSTALL_CONCURRENCY = 6;

// A page asks the worker for a new build: when it starts, when it becomes
// visible again and this often while it stays visible.
export const UPDATE_CHECK_MINUTES = 60;

// After a worker failed to install, the page asks for a new one only after
// this many hours: the first, second, third and every later failure in a row.
// A failure can cost the whole precache (about 21 MB) again, so a persistent
// one (a page answering 404, a full disk) must not repeat on every check.
// One success clears it.
export const INSTALL_BACKOFF_HOURS = [1, 6, 24] as const;

// `localStorage` key of the failure count and the time of the next attempt.
export const INSTALL_BACKOFF_KEY = "offline-install-backoff";

// A page that comes back after being hidden this long counts as a fresh
// open: a waiting worker is activated then, outside a lesson player.
export const UPDATE_IDLE_MINUTES = 15;

// Messages from a page to a worker.
export const SKIP_WAITING_MESSAGE = "SKIP_WAITING";
export const PRECACHE_STATUS_MESSAGE = "PRECACHE_STATUS";

// The answer to `PRECACHE_STATUS`: `installing` while the entries are being
// stored, `ready` when the worker's cache holds every entry, `incomplete`
// when it holds fewer (never for a worker that finished installing, since the
// cache is written all or nothing).
export type PrecacheStatus = {
  state: "installing" | "ready" | "incomplete" | "failed";
  cached: number;
  total: number;
};

// What the build step injects into the worker bundle.
export type WorkerBuildData = {
  buildId: string;
  entries: { url: string; revision: string | null }[];
  mediaBaseUrl: string;
};
