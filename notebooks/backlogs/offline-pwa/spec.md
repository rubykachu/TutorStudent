# Spec: offline support (service worker precache)

Plan: `plan.md`. Tasks: `task.md`. Product rules this builds on: `docs/spec.md` section 5.9 "Offline và PWA", 5.7 (sync), "Truy cập và bảo mật", and the Go-live criteria ("E2E mở khoá và offline cold start xanh trên bản build production"). Where this spec differs from `docs/spec.md` 5.9, this spec is the newer decision and the docs task updates `docs/spec.md` to match.

The owner approved this overnight: "plan, then build without waiting for my review; decisions per your recommendation". Every open question is answered in section 10, each marked "theo đề xuất".

## 1. Objective

The child studies at home on wifi. Offline is a safety net, not the main mode: when the wifi drops, or the iPad opens the app from the Home Screen with no network, every published lesson still opens, every exercise and review works, progress is kept (Dexie, as today) and reaches the cloud when the network returns.

Success means:

1. On a device that has opened the app once online after unlocking (and whose service worker finished installing), a cold start with no network shows home, any subject, any published lesson (also one never opened before), its sections, review and tips, with its visuals, formulas, fonts and short sounds.
2. Online, nothing gets staler than today: pages and lesson JSON come from the network first, so a published lesson or fix reaches the device on the next load, and the offline copy follows within one launch.
3. Videos, the overview narration and songs are never stored on the device. Offline, they show a friendly "Cần mạng để xem video" style state, never a spinner or a percentage that does not move.
4. The family-code gate keeps working online exactly as now. The service worker never stores a 401, a redirect, an `/unlock` page or anything under `/api/`.
5. A new deploy reaches an iPad that keeps the app suspended for days ("the PWA never updates" must not happen).

## 2. Out of scope

- The `/install` page (guided "Thêm vào Màn hình chính", progress of the download). Section 9 lists what it will need; only the readiness line on the parent page (section 7) is built here, because the owner needs it to check a device.
- Storing media: no Cache Storage, IndexedDB or service worker entry for anything under `/media/`, the media bucket (`NEXT_PUBLIC_MEDIA_BASE_URL`), `.vtt` captions of media, or songs.
- Any change to sync logic (`src/sync/**`), the Dexie schema, lesson content, `public/media/`, `public/sounds/` files, brand images, the deploy and upload commands' targets.
- Production deploy, R2 writes, `git push`: the owner approves and runs those per `docs/operations.md`.
- Content images: no lesson has an `image` block today. A future root-relative image under `public/` is precached by the generic rule in section 4; an image on the media bucket is not (offline shows its `alt`).
- Map files (TopoJSON): none exist yet. The same generic rule precaches them once they are added under `public/`.

## 3. What exists today (probed in code)

- `src/proxy.ts` runs `decideAccess` (`src/access/gate.ts`) on every path except `_next/static`, `_next/image`, `favicon.ico`. Without a valid `tutor_family` cookie a page is redirected to `/unlock?next=...` and a file or `/api/*` call gets 401. Besides `/unlock` and `/api/session`, which have their own rules, the public file list is exactly `BRAND_PUBLIC_PATHS` (`src/lib/brand.ts`: manifest, icons, favicon SVG, share image). The cookie lives 365 days (`ACCESS_SESSION_DAYS`).
- Every child route is statically generated (`generateStaticParams`, `dynamicParams = false`): `/`, `/profiles`, `/grades`, `/parent`, `/subjects/[subject]`, `/lessons/[lessonId]`, `/lessons/[lessonId]/review`, `/lessons/[lessonId]/tips`, `/lessons/[lessonId]/sections/[sectionId]`. Screens render on the client from `/content/index.json`, `/content/<lessonId>.json` and `<lessonId>.tips.json` (emitted by `pnpm content:emit`, published lessons only in production) plus Dexie.
- Client navigation fetches RSC payloads. Next 16.3.7 (`node_modules/next/dist/client/components/router-reducer/fetch-server-response.js`): when that fetch throws, the router falls back to a browser navigation, unless `experimental.useOffline` is on, which keeps it pending and retries. The app does not set that flag. Offline, the browser navigation is what the service worker answers from its cache.
- Visuals: `src/visuals/registry.ts` maps each `visualId` to `load: () => import(...)`, so each visual is its own chunk under `/_next/static/chunks/`. Fonts: `next/font/google` (Be Vietnam Pro, Baloo 2) self-hosts them under `/_next/static/media/`; KaTeX CSS is imported by `src/components/blocks/formula.tsx`, so its woff2/woff/ttf files land there too.
- Sounds: `public/sounds/*.m4a`, URLs `/sounds/<file>?v=<hash12>` (`src/lib/sound-manifest.ts`). `allSoundUrls()` is already the one list of every non-music clip; songs carry `music: true`.
- Media: `src/lib/media-download.ts` fetches a video or the narration whole into a blob; `video-preload.tsx` holds at most the next video in memory. The architecture doc states nothing stores them.
- Sync: Dexie first, a doc is dirty while its hash differs from `syncState`; `SyncRunner` syncs at start, every 5 minutes, on `online` and when the page hides. `/api/sync` is a plain `fetch`; offline it throws and the doc stays dirty.
- No service worker exists. `src/app/manifest.ts` and `docs/spec.md` 5.9 say so; `e2e/unlock.spec.ts` asserts the gated dev server registers none.
- `next.config.ts` caches `/sounds/*` a year (immutable) and `/content/*` 60 s plus background revalidation, both `private`.
- Next's PWA guide (`node_modules/next/dist/docs/01-app/02-guides/progressive-web-apps.md`) points to Serwist for offline caching and asks for `Cache-Control: no-cache` on the service worker script; the offline guide says offline behaviour must be tested on `next build && next start`, never in dev.

## 4. Precache manifest: one generated source

Nothing is hand-listed. The service worker's precache list is computed at build time from the same sources the app uses, by one pure module (`src/offline/precache.ts`, no Node imports, so the worker can share its filters), a Node adapter (`src/offline/precache-node.ts`) and one build step (`scripts/offline-manifest.ts`, run by `pnpm build` after the production content emit and by the offline test lab, so both builds produce the list the same way), plus the bundler's own list of build files:

| Group | Source | URL form | Revision |
|---|---|---|---|
| Build files | the build's `/_next/static/**` (JS chunks including every lazy visual chunk, CSS, `next/font` and KaTeX woff2) | as emitted | none (hashed names) |
| Pages | `appPagePaths()` in `src/offline/routes.ts`: the same functions the pages' `generateStaticParams` call (served lessons, their sections, subjects), plus the fixed routes | `/lessons/<id>` etc. | build id |
| Lesson data | `servedLessons()` and the emitted `public/content/` files: `index.json`, `<id>.json`, `<id>.tips.json` when the lesson has tips | `/content/<file>` | sha256 of the emitted file (first 12 hex) |
| Short sounds | `allSoundUrls()` | `/sounds/<file>?v=<hash12>` | none (hash in URL) |
| Other public files | every file under `public/` minus the deny-list below | `/<path>` | sha256 of the file |
| App routes that are files | `MANIFEST_PATH`, `/favicon.ico` (constants from `src/lib/brand.ts`) | as is | build id |

Every dotfile (`.DS_Store`) is skipped. Deny-list (one constant with a reason per line): `public/media/**` (videos and narration: never stored), `public/sounds/**` (handled by `allSoundUrls()`, which leaves songs out; the sound `manifest.json` is bundled, not fetched), `public/content/**` (handled from `servedLessons()`, so stale draft files a dev emit left behind are never shipped), `public/brand/share.png` (only chat crawlers read it). Build files with `.ttf` or `.woff` extensions are dropped: KaTeX lists woff2 first and every target browser reads woff2.

Rules the generator enforces (unit-tested, and the build fails on a breach):

- A served lesson without its emitted file fails the build with the lesson id.
- No entry starts with `/api/`, `/media/`, `/unlock`, `/dev/`, or points at the media base URL; no song.
- Each `page.tsx` under `src/app/` is either covered by `appPagePaths()` or listed in `NOT_PRECACHED_ROUTES` with its reason (`/unlock`: needs the network to set the cookie; `/dev/**`: a 404 in production). A new route that is in neither fails a test, so a future screen cannot silently miss offline.

## 5. Service worker strategy per request

Decided by one pure function `routeFor(request)` in `src/offline/strategy.ts`, which the service worker calls and Vitest tests:

| Request | Strategy | Why |
|---|---|---|
| Cross-origin (media bucket, anything not this origin) | not handled (browser default) | media is never stored; nothing else is cross-origin |
| `/api/*` (sync, session) | not handled | never cached; sync's own retry and dirty state already cover offline |
| `/media/**`, any `.vtt` | not handled | never stored |
| `/unlock` | not handled | needs the network; never cached |
| RSC fetch (`RSC: 1` header or `_rsc` query) and prefetches | not handled | offline the fetch fails, Next falls back to a browser navigation, which the next row answers |
| Navigation to an app page | network first (`cache: "no-cache"`), 3 s timeout; on a network error or timeout, the precached page of the same path (query ignored); nothing precached for that path: network error. Any response the network gives (200, 3xx, 401, 404, 5xx) is passed through untouched and never stored | online the gate decides as today; offline the page comes from the same build as the cached chunks |
| `/content/*.json` | network first (`cache: "no-cache"`, so the 60 s HTTP cache of `next.config.ts` cannot hide a new lesson), fallback to the precached copy only on a network error (no timeout, so a slow answer never mixes an old lesson file into a new page); network answers passed through, never stored | online the child sees what was just published; the copy changes only when a new service worker installs |
| `/_next/static/**`, short sounds, other precached files | precache first; a miss goes to the network and is not stored | hashed or revisioned URLs, so the cached copy is always right |
| Any request with a `Range` header | not handled | a full cached 200 can break media-element playback in Safari |
| Songs (`music: true` clips) | not handled (not in the precache, so the precache-first row passes them on) | music is fetched on request and never stored |
| Anything else | not handled | no runtime cache exists at all |

There is no runtime cache: the only cache is the precache, filled at install with `cache: "reload"` fetches (never a stale HTTP-cache copy under a new revision). Serwist's default precache route is not registered (it would answer pages and `/content` cache first, skipping the gate online); the worker looks URLs up by precache key (`matchPrecache` or equivalent), never with a bare `caches.match(request)`, because keys carry a revision parameter and Next pages answer with `Vary` on the RSC headers. A response is stored only during install and only when it is status 200, not `redirected`, not opaque, and its final URL equals the requested one; anything else fails the install, which the browser retries on the next update check. This is what keeps a 401 or the `/unlock` page out: when the cookie is missing the install fails instead of caching the redirect target. Serwist's Next.js `defaultCache` must not be used: it runtime-caches pages, RSC, images, audio and video.

The service worker is registered only by the child layout and the parent page (where `SyncRunner` is mounted), never on `/unlock`, so it installs only on a device that already has the cookie. It is registered only in production builds. In `next dev` the registration component unregisters any service worker it finds on that origin, so a production run on the same port can never leave a worker that serves stale pages to the dev server.

The service worker script path passes the gate without the cookie (exact path, added next to `BRAND_PUBLIC_PATHS` in one gate list): it carries no family data (its URL list is the same lesson ids the public `/_next/static` chunks already hold), and an update check must never fail because the browser did not send the cookie. It is served with `Cache-Control: no-cache` and, when it does not sit at the root, `Service-Worker-Allowed: /` so its scope is `/`. `scripts/bundle-check.ts` also scans the service worker script for server-only names and secret values.

## 6. Update flow

Goal: a deploy reaches the device within one launch, and an open page never loses a chunk it still needs.

1. Install: the new worker precaches only new or changed entries (Serwist compares revisions), in the background, while the old worker keeps serving. No `skipWaiting()` on install.
2. Update checks: the browser checks the script on every navigation; the client also calls `registration.update()` when the app starts, when the page becomes visible again (an iOS Home Screen app resumes without navigating, the root of "the PWA never updates") and every 60 minutes while visible.
3. Activation, whichever comes first:
   - boot apply: a page has just loaded, a worker is already waiting and the page is not a section or review player: the page sends `SKIP_WAITING` at once and reloads (no lazy chunk is in use yet). This covers the cases where the browser does not activate by itself (a reload, iOS killing a suspended app);
   - the child or parent taps "Có bài mới, tải lại" on the banner;
   - the page becomes visible after being hidden 15 minutes or more and is not inside a section or review player (a return after a break counts as a fresh open).
   Activation is a `SKIP_WAITING` message to the waiting worker; the activated worker calls `clients.claim()` and drops entries the new build no longer lists.
4. After activation (`controllerchange`) a page outside a player reloads at once; a page inside a section or review player keeps the banner and reloads when the child leaves the player or taps it. The first install also calls `clients.claim()`, so the very first visit becomes offline-capable without a reload.
5. The banner: one line under the top bar on non-player screens, "Có bài mới, tải lại", a button, no close cross (it stays until used or until a safe moment applies it). It never shows inside a player.

Why not `skipWaiting()` at install: the new worker would delete the old build's chunks while the open page may still lazy-load one (a visual, a player), and production without skew protection answers an old chunk URL with 404, breaking a lesson mid-way. Waiting plus safe moments avoids that and still updates within one launch.

The worker is registered with `updateViaCache: "none"`. Content freshness online does not depend on activation (pages and lesson JSON are network first). Activation only refreshes the offline copy and the running code.

## 7. Offline UX

- Media: one hook `useNetworkStatus()` (`src/lib/network-status.ts`) is the single source: offline when `navigator.onLine` is false or the last media download failed with a network error; back online on the `online` event or a successful retry. The video player shows "Cần mạng để xem video" (owl, no ring, no percentage) instead of the loading state; the narration card shows "Cần mạng để nghe đọc bài"; the sticker sheet's song button shows "Cần mạng để nghe nhạc". Each recovers on the `online` event, when the page becomes visible again, or on a tap of the state (wifi without internet never fires `online`); a new download starts, and the narration still waits for a tap on iOS. `video-preload.tsx` skips the preload while offline. Copy and look follow `docs/design-system.md`.
- No global offline banner: the child studies normally offline; only what cannot work says so.
- Parent page: one line in the existing sync area, "Dùng khi không có mạng: sẵn sàng" / "đang tải (120/340)" / "chưa sẵn sàng", read by message from the installing worker if one exists, else the active one. The parent page sits behind the PIN. This is how the owner checks the iPad before relying on offline.
- `navigator.storage.persist()` is requested once after the worker activates (Safari 17+ and Chromium decide without a prompt); it also protects Dexie progress from eviction.

## 8. Cache size (measured on the build of 1 Oct and the content of 2 Oct 2026)

| Group | On disk (uncompressed) | First download (compressed) |
|---|---|---|
| JS and CSS chunks (170 files) | 4.3 MB | 1.3 MB |
| Fonts woff2 (Be Vietnam Pro, Baloo 2, KaTeX) | 0.5 MB | 0.5 MB |
| Pages: about 345 (20 lessons, 276 sections, review and tips per lesson, subjects, home screens) at about 15 KB each | 5.2 MB | 1.0 MB |
| Lesson JSON and tips (all emitted today, drafts included; production has published lessons only, so slightly less) | 1.9 MB | 0.3 MB |
| Short sounds (songs excluded, 0.58 MB) | 0.66 MB | 0.66 MB |
| Icons, favicon, manifest | 0.09 MB | 0.09 MB |
| Total | about 12.7 MB | about 3.9 MB |

Per deploy: every page (build-id revision, about 1 MB compressed) plus changed chunks and changed lesson files. Per new lesson: about 15 pages (0.25 MB), its JSON (0.1 MB), its visual chunks (about 50 KB). Safari gives a Home Screen app far more than this; the build prints the total and fails above 50 MB (`PRECACHE_BUDGET_BYTES`), a limit that leaves room for about 100 more lessons.

## 9. iOS notes and what `/install` will need

- A Home Screen app has its own cookies, IndexedDB, Cache Storage and service worker, separate from Safari. Each must unlock once and then load online once until the parent line says "sẵn sàng". Safari tabs may lose script-written storage after 7 days without use; a Home Screen app is exempt, one more reason to study from it.
- iOS kills a suspended Home Screen app at will; the next launch is a cold start, which is exactly the path the E2E covers.
- `/install` later needs: the "Thêm vào Màn hình chính" steps with screenshots, a check that it runs standalone (`display-mode: standalone`), unlock, then the same readiness count the parent line reads, shown as progress. It must pass the gate without the cookie (it is shown before unlock), so it joins the gate's public list. Nothing here blocks it.

## 10. Questions answered (theo đề xuất)

- **Q1. Serwist or a hand-written worker?** Serwist with `@serwist/turbopack` (`docs/spec.md` names it; it gives revision-diffed installs, atomic precache and cleanup). The spike task checks it on Next 16.3.7 with Turbopack against fixed criteria; if one fails, the same pure modules (`precache`, `strategy`) go into a hand-written worker built by esbuild. Theo đề xuất. Outcome: the trial failed criterion 4 (an install that meets a 401 or a redirect hangs instead of failing), so the worker is hand-written (`src/offline/sw-core.ts`), written to `public/sw.js` by `scripts/offline-worker.ts`; see `task.md` "Findings of the Serwist trial".
- **Q2. Pages: cache first or network first?** Network first with a 3 s timeout, fallback to the precache. Online the gate still decides every navigation (a removed family code still locks the device on its next online load); offline the page matches the cached chunks. Theo đề xuất.
- **Q3. Lesson JSON?** Network first with `no-cache`, fallback to the precache only on a network error (no timeout), never stored at runtime. A page that loaded from the network then reads lesson files from the network too; only a page that fell back to the precache (offline) reads precached files, so a schema change cannot meet an old file while online. Theo đề xuất.
- **Q4. `skipWaiting` / `clients.claim`?** No `skipWaiting` at install; activation on close, banner tap, or a safe moment (section 6); `clients.claim()` on every activation. Theo đề xuất.
- **Q5. Does the worker script pass the gate?** Yes, exact path, no family data in it. Theo đề xuất.
- **Q6. Where is it registered?** Child layout and parent page, production builds only, never `/unlock`; dev unregisters. Theo đề xuất.
- **Q7. Songs?** Not precached, not stored; "Cần mạng để nghe nhạc" offline. They are music played on request, like media. Theo đề xuất.
- **Q8. Narration's offline copy?** "Cần mạng để nghe đọc bài" (the voice may be male or female, so no "cô"). Theo đề xuất.
- **Q9. Device whose family code was removed?** Online, its next navigation goes to the network and the gate sends it to `/unlock` as today. Offline it keeps working until it comes online; the cache is not purged (lesson content is the same for every family and holds no family data; progress lives in Dexie as before). Theo đề xuất.
- **Q10. `/install`?** Out of scope; the parent readiness line is built because it is small and the owner needs it to check a device. Theo đề xuất.
- **Q11. Which browser runs the offline E2E?** A separate Playwright config on Chromium with the iPad viewport (Playwright's service worker support is Chromium-first); WebKit was tried in the spike: it installs and controls, but Playwright cannot navigate offline there or route the worker's requests, so the E2E is Chromium only. Real iPad steps go to `docs/operations.md` for the owner. Theo đề xuất.
- **Q12. How does the E2E go offline?** `context.setOffline(true)`; if the spike task finds it does not cut the worker's own fetches, the spec stops its own `next start` process by the PID it recorded (never by pattern). Theo đề xuất.
- **Q13. `experimental.useOffline`?** Not enabled: it keeps a failed navigation pending instead of letting the browser navigation reach the worker's cache. Theo đề xuất.
- **Q14. A global "you are offline" banner?** No; only media says it needs the network. Theo đề xuất.
- **Q15. Chunks of the `/dev` galleries in the precache?** Kept: they are a few hundred KB and filtering chunks by route needs bundler internals. Theo đề xuất.
- **Q16. Offline E2E inside `pnpm test:e2e`?** No: it needs a production build (minutes). Its own command `pnpm test:e2e:offline`, run in the final checkpoint and before a release that touches offline code. Theo đề xuất.
- **Q17. Where do production builds for checks run?** In a temporary git worktree of the committed `HEAD` (`scripts/offline-lab.ts`), with explicit test env (`OFFLINE_SERVER_ENV`: empty media base URL, test family code and secret, fixture content) that overrides the owner's `.env.production.local`: `content:emit` deletes and rewrites `public/content` and `next build` edits the tracked `tsconfig.json`, so a build in the main tree would disturb the owner's dev server and the tree. Theo đề xuất.
- **Q18. Show offline answers reaching the store in the offline E2E?** No: a production server refuses the folder store (`src/sync/store/config.ts`) and `src/sync/**` is out of scope. The offline E2E checks Dexie keeps the answers and the worker passes `/api/sync` through untouched; the dev-server sync E2E keeps covering offline then online. Listed for the owner in `task.md`. Theo đề xuất.

## 11. Test plan

Unit and component (Vitest, run by `pnpm test`):

- `routes`: `appPagePaths()` equals the union of the pages' static params; every `page.tsx` is covered or listed with a reason.
- `precache`: includes every served lesson (and tips when present), every page path, every `allSoundUrls()` entry, icons and manifest; excludes media, songs, `/api`, `/unlock`, `/dev`, share image, ttf and woff; revisions equal file hashes; a missing emitted lesson throws; budget check.
- `strategy`: one case per row of section 5, including a navigation with a query, an RSC request, a cross-origin media URL, a same-origin `/media/...mp4` and `.vtt`, a song, a `Range` request, `/api/sync`; the fetch cache modes (`no-cache` for network first, `reload` at install).
- `storable(response)`: rejects 3xx, `redirected`, 401, 404, opaque, a final URL that differs.
- Update manager: a waiting worker shows the banner outside players and not inside; tap sends `SKIP_WAITING`; `controllerchange` reloads outside a player and defers inside; visible after 15 minutes hidden applies; `update()` on start, visible and hourly; dev unregisters.
- Media offline state: video player, narration, song button and preload with `navigator.onLine` false and with a network error; recovery on `online`.

E2E, `pnpm test:e2e:offline` (production build of `HEAD` in a temporary worktree, gate on with a test family code, media from local `/media`, no sync store):

1. Offline cold start: unlock, open home online, wait for the parent line "sẵn sàng"; go offline; reload (cold); from home, by tapping links in the app (the RSC fetch fails and the browser navigation is answered from the precache), a subject, a lesson never opened online, one of its sections with a lazy visual, a formula (KaTeX font loaded: `document.fonts.check`), its tips page and the review page all render; a short sound URL fetched offline answers 200. The parent PIN is set first so the readiness line can be read.
2. Offline study and sync pass-through: answer items offline, an offline reload keeps them (Dexie); back online, `/api/sync` requests get the server's own answer (`response.fromServiceWorker()` false, or what the spike proves equivalent), never a worker answer. Offline answers reaching the cloud within 10 s stays covered by the dev-server `e2e/sync.spec.ts`.
3. Media offline: a video and the narration show "Cần mạng..." and no percentage; online again, the video loads.
4. No media stored: after playing a video and the narration online, every Cache Storage entry is checked: no `/media/`, no media base URL, no `.vtt`, no song, no `/api/`, no `/unlock`, no `redirected` response; IndexedDB holds only the Dexie database.
5. Gate: in a context with the worker installed, clear cookies, navigate online: the page is `/unlock` (passed through, not the cached page); a context that never unlocked has no service worker after visiting `/unlock`.
6. Update flow: with a worker installed, a changed worker script is served (intercepted script or a second build, whichever the first task proves); a waiting worker shows "Có bài mới, tải lại" on home and not inside a section; tapping reloads under the new worker; the old build's entries are gone.

Existing tests: `e2e/unlock.spec.ts` "no service worker" keeps passing on the dev server (dev registers none) and is renamed to say so; `tests/access/gate.test.ts` checks the gate's public list (brand paths plus the worker script, nothing else).

Manual (owner, after a deploy the owner approves): steps added to `docs/operations.md` "Kiểm trên iPad Safari": open from the Home Screen online, parent line "sẵn sàng", airplane mode, close the app from the switcher, open again, study a lesson, video says it needs the network, airplane mode off, `/parent` shows a fresh sync time.

## 12. Risks

| Risk | Mitigation |
|---|---|
| `@serwist/turbopack` does not fit Next 16.3.7 Turbopack builds, or cannot take our extra entries | the spike task checks fixed criteria before anything depends on it; fallback to a hand-written esbuild worker over the same modules |
| An install caches the `/unlock` page or a 401 | install-time `storable()` check, registration never on `/unlock`, E2E 4 and 5 |
| "The PWA never updates" on iOS | update check on visible, hourly and at start; safe-moment activation; E2E 6 |
| Old page loses a lazy chunk after activation | no `skipWaiting` at install; reload right after activation outside players |
| A stale worker on a dev origin serves old pages | dev unregisters; offline E2E uses its own port and build folder |
| Media stored by accident (for example by Serwist's `defaultCache`) | no runtime cache at all; `strategy` unit tests; E2E 4 |
| Precache grows past what a device keeps | budget check at build (50 MB); size printed each build |
| Building for checks disturbs the owner's dev server or tree (`content:emit` deletes `public/content`, `next build` edits `tsconfig.json`) | every production check runs in a temporary worktree of `HEAD` (`scripts/offline-lab.ts`) |
| A test build reads the owner's real `.env.production.local` (media bucket URL, family codes) and calls the bucket | `OFFLINE_SERVER_ENV` overrides every such value; the lab fails on a bundled `https://` media origin; the localhost guard also sees worker requests |
| Playwright cannot drive a worker in WebKit, or `setOffline` misses worker fetches | Chromium project; fallback of stopping our own server PID; manual iPad steps |
| First visit goes offline before the install finished | the parent line says "đang tải"; `/install` later shows it as progress |
| Vercel serves the worker script with a long cache | `Cache-Control: no-cache` header set in `next.config.ts`, checked by the deploy smoke step |
