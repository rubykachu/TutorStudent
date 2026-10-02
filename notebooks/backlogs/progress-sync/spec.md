# Spec: progress sync across devices

Status: planning, waiting for the owner's review. No code is written for it yet.

Product rules this builds on: `docs/spec.md` sections "Tiến độ và đồng bộ", "Truy cập và bảo mật", "Offline và PWA", "Chiến lược kiểm thử". Where this spec differs from them (family id, PIN, what is synced), this spec is the newer decision and the build updates `docs/spec.md` to match.

## 1. Objective

The child studies on more than one browser: the iPad in Safari, the same iPad from the Home Screen (iOS keeps a separate IndexedDB for it), a phone, a parent's laptop. Today each one holds its own progress in Dexie and none sees the others. The owner chose "đồng bộ ngầm, học tới đâu lưu tới đó": progress is saved to the family's private cloud storage in the background as the child studies, with no button and nothing for the child to do; any device of the family shows the same profiles, section states, review cards and stickers after its next sync.

Also in scope: an "import backup JSON" button on the parent page, next to the existing export, that merges a backup file (or a restored daily snapshot) into the device; the synced result then reaches every device.

Who benefits: the child (no lost progress when switching device or reinstalling the Home Screen app), the parent (one report whichever device they open it on).

Out of scope here (each gets its own backlog when started):

- Offline precache and the `/install` flow (service worker, `@serwist/turbopack`). Sync already works across offline periods without it, because Dexie keeps everything and sync catches up when the network returns. Kept as the last, separate slice in `plan.md`.
- Moving the parent PIN to the server (`/api/parent-session`), `families.json`, epochs and `pnpm admin`. See open question Q2.
- AI feedback quota, quick content channel, the public media bucket (all untouched).

## 2. Decisions already made by the owner

- Dexie stays the source of truth while offline; every write goes to Dexie first and the UI never waits for the network.
- Storage: Cloudflare R2 on the existing account, reached only through a Vercel API route. One JSON doc per child plus one family profile doc. Never publicly readable.
- Auth: the existing family-code session cookie (`tutor_family`, `src/access/session.ts`).
- Protocol: `GET /api/sync` returns `{doc, etag}`; `PUT` sends `{doc, ifMatch}`; the server writes R2 with `If-Match` / `If-None-Match`; on 412 the client reloads, merges and retries, at most 3 times.
- Triggers: end of a section or review session, every 5 minutes while the app is open, when the network comes back, when the page becomes hidden (`visibilitychange`).
- Merge: attempts unioned by id; section status, higher wins; FSRS card, latest update wins; a per-lesson reset tombstone drops records older than the reset.
- Import backup JSON button next to export on the parent page.
- Every cost stays inside free tiers.

## 3. Design choices made in this spec (owner may overrule in review)

1. **Stable family id from `FAMILY_CODES`.** Today the cookie carries a keyed fingerprint of the code (`codeFingerprint`), which changes when `SESSION_SECRET` or the code changes, so it cannot name a storage folder. Each `FAMILY_CODES` entry gains a name: `nha-minh:abcd-efgh-jkmn`. The server finds the entry whose fingerprint matches the cookie and uses its name as `familyId`. Cookies already on devices keep working (their fingerprint still matches); rotating the code or the secret makes devices re-enter the code but keeps the family's data. A bare code without a name still opens the gate but has no sync (the API answers `sync-unavailable`). See Q1.
2. **One family per device; local records stay under `familyId: "local"`.** All hooks use `LOCAL_FAMILY_ID` today. Instead of re-keying every record and every query, the device records which family its local store belongs to (device setting `syncFamilyId`, set at the first successful sync). The conversion between Dexie records and the cloud doc swaps `"local"` for the real `familyId`. A family switch on the device is handled explicitly (section 6.3). Effect: no UI or query changes; cost: a device holds one family at a time, which `docs/spec.md` already requires ("Đổi gia đình trên cùng máy: chặn").
3. **Full-state sync with a dirty counter, not an operation log.** A per-child `localRev` counter is bumped by Dexie table hooks on every write to a synced table, so no write path can forget it. A sync builds the child's doc from Dexie, merges it with the cloud doc, writes the result to both sides, and records the `localRev` it covered. Docs are small (estimate below), so sending the whole doc is cheaper to get right than replaying operations.
4. **The merge is one pure function, `mergeChildDocs(a, b)`,** commutative, associative and idempotent, used by the client sync, the 412 retry and the backup import alike. The server never merges; it only checks and stores.
5. **The server stamps time.** Every response carries `serverTime`. The client keeps `clockOffset = serverTime - Date.now()` and uses the corrected clock for the timestamps the merge compares (reset tombstones, card updates, section updates). The server clamps any timestamp in a PUT that lies more than 10 minutes in its future to its own time.
6. **Sync is silent for the child.** No banner, spinner or error on child screens. The parent page shows "Đồng bộ lần cuối" and, when something is stuck, a plain message (e.g. "Máy này chưa gửi được tiến độ từ 3 ngày nay").

## 4. Doc shapes (versioned)

Both docs are validated by zod schemas in one module (`src/sync/schema.ts`), shared by client and server. Every doc carries `schema` (a literal naming the kind) and `version` (an integer, starting at 1). Times are ISO strings.

### 4.1 Family profile doc, key `progress/<familyId>/profile.json`

```jsonc
{
  "schema": "tutor-family-profiles",
  "version": 1,
  "familyId": "nha-minh",
  "updatedAt": "2026-10-02T08:00:00.000Z",      // server time of the last write
  "profiles": [
    {
      "id": "3f9c…",                             // 32 hex chars, newId()
      "name": "Na",
      "avatar": "owl",
      "grade": 6,
      "series": { "math": "kntt" },
      "createdAt": "…",
      "updatedAt": "…"                           // new field; Dexie gets it in the schema upgrade
    }
  ]
}
```

Merge: union by `id`; for the same id the later `updatedAt` wins, ties broken by comparing the JSON text so both sides pick the same one. There is no profile deletion in the app today, so no profile tombstone; adding deletion later needs one (noted in the doc's schema comment).

### 4.2 Child progress doc, key `progress/<familyId>/<childId>.json`

```jsonc
{
  "schema": "tutor-child-progress",
  "version": 1,
  "familyId": "nha-minh",
  "childId": "3f9c…",
  "updatedAt": "…",                              // server time of the last write
  "attempts":  [ { "id", "exerciseId", "lessonId", "cardIds", "firstTryCorrect", "wrongCount", "at", "context" } ],
  "cards":     [ { "cardId", "lessonId", "due", "stability", "difficulty", "scheduledDays", "learningSteps", "reps", "lapses", "state", "lastReviewAt" } ],
  "sections":  [ { "sectionId", "lessonId", "state", "position": { "phase", "index" }, "updatedAt" } ],
  "stickers":  [ { "lessonId", "at" } ],
  "activityDays": [ "2026-10-01", "2026-10-02" ],
  "writings":  [ { "id", "exerciseId", "text", "checks", "at" } ],
  "overviewSeen": { "<lessonId>": "<first seen at>" },
  "resets":    { "<lessonId>": "<reset at>" }
}
```

Mapping to Dexie (`src/progress/db.ts`): the records lose `familyId`/`childId` (they are in the doc header). `overviewSeen` comes from the `overviewSeen:<lessonId>` settings; the Dexie upgrade turns the stored `true` into the upgrade time so it has a timestamp to compare with a reset. `resets` comes from a new Dexie table `lessonResets` written by `resetLessonProgress` in the same transaction as the erase. Settings other than `overviewSeen:*` are not synced (see Q4).

What is not in the doc: the parent PIN and its lock (device settings, see Q2), the active profile, the sound switch, sync bookkeeping.

### 4.3 Size

Estimate for a year of use: 500 attempts at ~250 bytes, ~1 500 card states at ~220 bytes, ~300 sections at ~150 bytes, writings at ~1 KB each: well under 1 MB. Cap: 1 MB of UTF-8 JSON per doc (`SYNC_DOC_MAX_BYTES` in `src/lib/config.ts`). Before a PUT the client trims, in this order, until the doc fits:

1. attempts beyond the newest 500 (always applied, also under the cap; Dexie keeps every attempt locally, the doc keeps the newest 500);
2. the oldest writings, one at a time.

If it still does not fit, the client does not send, keeps the dirty counter and shows the parent page message. The server rejects a body above the cap with 413 regardless.

### 4.4 Schema migration

- Pure `migrateDoc(raw)` lifts any older `version` to the current one, step by step (`v1 -> v2 -> …`), each step with a unit test on a stored sample file in `tests/sync/fixtures/`.
- A client meeting a doc whose `version` is newer than it knows does not merge or write (it would drop fields it does not know). It keeps its dirty counter, stops syncing that doc until reload, and the parent page shows "Có bản app mới, mở lại app để đồng bộ".
- The server refuses a PUT whose `version` is lower than the stored doc's (409 `upgrade-required`), so an old tab can never downgrade the doc.
- The Dexie upgrade that adds `lessonResets`, `syncState`, `profiles.updatedAt` and timestamped `overviewSeen` is a new `this.version(n)` with an `upgrade` that touches only those fields, like version 2 did for grades.
- The backup file format moves to `PROGRESS_EXPORT_VERSION = 2` (adds `resets` and `overviewSeen` times); the importer accepts versions 1 and 2.

## 5. API contract

One route file, `src/app/api/sync/route.ts`, Node runtime, `Cache-Control: no-store` on every response. Target doc by query: `?doc=profile` or `?child=<childId>`; exactly one of the two, `childId` must match `^[0-9a-f]{32}$`.

### `GET /api/sync?doc=profile` | `GET /api/sync?child=<id>`

Optional `&known=<etag>`: when the stored etag equals it, the answer is `{ unchanged: true, etag, serverTime }` without the body (R2 conditional GET, so the 5-minute poll stays cheap).

200: `{ familyId, doc: <doc> | null, etag: string | null, serverTime }`. `doc: null` means nothing stored yet.

### `PUT /api/sync?doc=profile` | `PUT /api/sync?child=<id>`

Body: `{ doc, ifMatch: "<etag>" }` to replace, or `{ doc, ifNoneMatch: "*" }` to create. Exactly one.

200: `{ etag, serverTime }`.

### Errors (all JSON `{ error: "<code>", … }`)

| Status | `error` | When | Client does |
|---|---|---|---|
| 400 | `invalid` | query or body fails the zod schema, or `doc.familyId`/`doc.childId` differs from the cookie family / query | logs, keeps dirty, no retry until next trigger |
| 401 | (from `src/proxy.ts`) | no or bad family cookie | stops syncing, parent page says to re-enter the family code |
| 403 | `origin` | PUT without a same-origin `Origin` header | logs |
| 403 | `child` | child PUT for an id absent from the stored profile doc | syncs the profile doc first, then retries once |
| 409 | `upgrade-required` | doc `version` lower than the stored one | stops, "mở lại app" message |
| 412 | `conflict` | `If-Match` / `If-None-Match` failed in R2; body carries the current `{ doc, etag }` | merges with that doc, retries; after 3 failed rounds keeps dirty for the next trigger |
| 413 | `too-large` | body above the cap | keeps dirty, parent message |
| 429 | `rate` | per-family limit hit; `retry-after` header | waits for the next trigger |
| 503 | `sync-unavailable` | R2 env vars missing, or the cookie's family entry has no name | disables sync for the session, silently |
| 404 | `no-gate` | dev and test servers without `FAMILY_CODES` | disables sync silently (same as the session route) |

### Server steps for a PUT

1. Origin check (shared helper extracted from `src/app/api/session/route.ts` into `src/access/origin.ts`).
2. Read the cookie, verify it, resolve `familyId` (section 3, item 1).
3. Rate limit by `familyId`.
4. Read at most `SYNC_DOC_MAX_BYTES` + 4 KB of body; parse; zod; header ids must match.
5. For a child doc: read the profile doc (cached 60 s per instance) and check the child id is listed.
6. Clamp future timestamps (section 3, item 5).
7. Daily snapshot (from `docs/spec.md`): if `snapshots/<familyId>/<childId>/<yyyy-mm-dd VN>.json` does not exist, copy the current stored doc there with `If-None-Match: *`. A failed snapshot is logged and never blocks the write. R2 lifecycle deletes `snapshots/` after 180 days.
8. `PUT` to R2 with the matching condition; on 412 read the current doc and return it in the 412 body.
9. Never log doc contents; log only route, family id, doc kind, status, byte size.

### Storage adapter

`BlobStore { get(key, { ifNoneMatch? }) -> { body, etag } | { unchanged, etag } | null; put(key, body, { ifMatch? | ifNoneMatch? }) -> { etag } | { conflict } }` (`src/sync/store/`), three adapters:

- `r2` (aws4fetch over the S3 API, new dependency `aws4fetch`, already named in `docs/spec.md` tech stack);
- `memory` for unit and API tests (simulates ETags and 412);
- `fs` (a folder, for local dev and the two-device E2E), allowed only when `NODE_ENV !== "production"`, chosen by `SYNC_STORE=fs:<dir>`; production refuses any value but R2.

Keys are built by one function (`syncKey`) from the validated `familyId` and `childId`; no key is ever built from raw request text.

## 6. Merge rules and edge cases

### 6.1 Rules (pure, in `src/sync/merge.ts`)

Applied after `migrateDoc` on both inputs:

| Field | Rule |
|---|---|
| `resets[lessonId]` | the later time wins |
| `attempts` | union by `id`; then drop those whose lesson has a reset later than `at`; then keep the newest 500 |
| `cards` | per `cardId`, the record with the later `lastReviewAt` wins; equal times: the higher `reps`, then the JSON text. Then drop cards whose lesson has a reset later than `lastReviewAt`. A card whose card id no longer exists in content stays as it is (orphans are already ignored by review selection) |
| `sections` | per `sectionId`, the higher state wins (`done > in_progress > not_started`, `SECTION_STATES` order); equal state: the later `updatedAt` wins (so the latest position is kept). Then drop sections whose lesson has a reset later than `updatedAt` |
| `stickers` | union by `lessonId`, the earliest `at` kept; never dropped by a reset (a reset keeps stickers, as `LESSON_RESET_POLICY` says) |
| `activityDays` | set union, sorted; not touched by a reset |
| `writings` | union by `id`; dropped when the lesson (from `lessonIdOfContentId(exerciseId)`) has a later reset |
| `overviewSeen[lessonId]` | the earliest time wins; dropped when the lesson has a later reset |

Properties held by tests (property-based over generated docs): `merge(a, b) == merge(b, a)`, `merge(a, merge(b, c)) == merge(merge(a, b), c)`, `merge(a, a) == a`.

Applying the merged doc back to Dexie runs in one transaction per child, marked as a sync write so the dirty hook does not count it, and also deletes local records the tombstones drop. Records already deleted locally by a reset never return, because the tombstone travels with them.

### 6.2 Two devices

- Both online, both study: each sync is GET, merge, PUT with `ifMatch`. The second writer gets 412 with the first writer's doc, merges, retries. Test: API test with the memory store and two interleaved clients; E2E with two browser contexts.
- Same section open on both: the furthest state wins; with the same state the later position wins. A child on device B does not jump mid-section: the section player keeps its in-memory position; the merged position applies on the next open.
- Same card reviewed on both: the later review wins; the other review's attempt is still kept in the attempt log, so the parent report counts both answers.

### 6.3 Offline, family switch, first sync

- **Offline queue:** there is no separate queue; the dirty counter (`syncState.localRev > syncedRev`) is the queue. Writes while offline only bump it. The `online` event, the next 5-minute tick or the next trigger syncs everything at once. A sync in flight compares `localRev` before and after; writes made meanwhile stay dirty.
- **First sync on a device that already has local data** (every device in use today): the profile doc and each child doc are merged with the local records, so nothing local is lost. Profiles with the same name but different ids (the child created "Na" in Safari and again in the Home Screen app) stay two profiles; see Q3.
- **Family switch on the same device:** if the cookie's family differs from `syncFamilyId` and the device has unsynced changes, sync stops and the parent page shows "Máy này còn tiến độ chưa gửi của gia đình khác. Tải bản sao lưu trước khi đổi." with the export buttons; nothing is deleted automatically. With no unsynced changes, the parent page offers "Dùng máy này cho gia đình mới" which clears the local store (after a second confirmation) and pulls the new family's docs. Sync never writes one family's records into another family's docs.
- **Cookie revoked** (code removed from `FAMILY_CODES`): 401, sync stops, local data stays, the child can keep studying offline-style until the code is re-entered.

### 6.4 Reset on one device

Device A resets lesson L at time T (corrected clock). The reset writes `lessonResets` in the same Dexie transaction as the erase (closing the gap noted in `src/progress/reset.ts`). On merge, B's records of L older than T are dropped everywhere; B's records of L newer than T (the child relearning on B after the reset) stay. Stickers and activity days are kept. Test: unit test on merge plus the two-device E2E (reset on A, B still shows L done before syncing, both show L reset after).

### 6.5 Clock skew

- Where it matters: reset tombstones (a device clock behind would let old records survive; ahead would drop new records), card `lastReviewAt`, section `updatedAt`.
- Mitigation: corrected clock from `serverTime` for those timestamps; server clamps future timestamps to server time + 10 minutes; ties in card merge broken by `reps`, which only grows between resets.
- Residual risk, accepted: a device that has never synced and has a wrong clock writes uncorrected times until its first sync. The worst case is one card keeping the older of two reviews or a section position going back; no attempt is ever lost (the log is a union).
- Snapshot day keys use Vietnam time from the server clock, never the client's.

### 6.6 Other edge cases

- Same backup imported twice: idempotent merge, no duplicates.
- Backup older than a reset: records before the reset are dropped; the import summary says how many were skipped.
- Doc in storage fails the schema (manual edit, bug): the server answers 500 `stored-invalid` on GET and refuses to overwrite it; the client keeps dirty; recovery from the daily snapshot.
- New profile created offline: the profile doc syncs before any of its child doc (the engine orders profile first; a 403 `child` triggers it).
- Two tabs on one device: Dexie is shared; a Web Locks API lock (`navigator.locks`, name `tutor-sync`) lets one tab sync at a time; without the API, the 412 path still keeps data safe.

## 7. Security

### 7.1 Who can read or write what

- A request is authorized for one family: the one whose `FAMILY_CODES` entry matches the cookie. The family id is never read from the query, the body or a header.
- Inside a family, any unlocked device can read and write every child of that family. The family code is the trust boundary, as it is for the gate today; there is no per-child secret. The parent PIN guards only the parent page (and with it the import and reset actions).
- Child docs are writable only for child ids listed in the family's profile doc.
- Nothing in the private bucket is reachable without the API: bucket public access stays off, no `r2.dev` URL, no custom domain. The public media bucket `tutor-media` is not used for sync.

### 7.2 Request checks

- Origin: PUT requires an `Origin` whose host equals `Host` (same helper as `/api/session`); GET requires `Sec-Fetch-Site` to be `same-origin` or absent. The cookie stays `SameSite=Lax`, `httpOnly`, `Secure` in production.
- Body: JSON only (`content-type: application/json`), size capped before parsing, strict zod schemas (unknown keys rejected), string lengths bounded (writing text ≤ 5 000 chars, ids by regex).
- Rate limit: per `familyId`, 30 requests per minute per instance, in memory like `src/access/rate-limit.ts`. Serverless instances do not share memory, so this only slows a runaway client; the real cost guard is the size cap plus a Cloudflare billing alert (Q6).
- Writing text is shown by React as text; nothing from a doc is ever rendered as HTML.

### 7.3 Credentials (Vercel environment, Production only, Sensitive)

| Variable | Value |
|---|---|
| `R2_ACCOUNT_ID` | Cloudflare account id (builds the S3 endpoint) |
| `R2_ACCESS_KEY_ID` | access key of the app's R2 token |
| `R2_SECRET_ACCESS_KEY` | secret of that token |
| `R2_PRIVATE_BUCKET` | name of the private bucket, recommended `tutor-progress` |
| `FAMILY_CODES` | existing variable, entries become `<familyId>:<code>` |

- The token is a new R2 API token with "Object Read & Write" limited to the private bucket only. It never touches `tutor-media` (uploads to it keep using the separate rclone token in `docs/operations.md`).
- Prefix scoping: R2 account tokens are scoped per bucket, not per key prefix (prefix-scoped credentials exist only as short-lived temporary credentials, which a static env var cannot hold). Least privilege is reached with a bucket used for nothing but progress and snapshots, plus `syncKey` as the only key builder, which can only produce `progress/<familyId>/…` and `snapshots/<familyId>/…`. To confirm in the Cloudflare dashboard when the token is created.
- None of these is `NEXT_PUBLIC_*`; a test fails if any `R2_*` name appears in client bundles (`.next/static` grep after build).
- Preview and development environments on Vercel get no R2 variables (preview already serves 503 without `FAMILY_CODES`).
- Rotation: create a new token, update the two Vercel variables, redeploy, delete the old token. Written into `docs/operations.md`.

### 7.4 Personal data

The docs hold exactly what Dexie already holds: the child's display name and avatar, grade, answers, review state, writings. No email, birth date, photo, location or device identifier is added. Logs carry family id, doc kind, status and size, never doc content. The new fact for the owner: the name and writings now also live in the family's private R2 bucket (Cloudflare, encrypted at rest).

### 7.5 Threat model

| Threat | Mitigation | Residual |
|---|---|---|
| Stranger without the code reads or writes progress | `src/proxy.ts` 401 on every API without a valid cookie; unlock rate limit; codes ≥ 10 random chars | none known |
| One family reads another family's docs | family id only from the cookie; keys built by `syncKey`; API test "cross-family → 403/404" | none known |
| CSRF from another site | `SameSite=Lax` cookie, Origin check on PUT, JSON body | none known |
| A family device is lost or shared | remove that family's code from `FAMILY_CODES` (all its devices re-enter the new code; data stays under the same family id) | the device keeps its local Dexie copy |
| Oversized or malformed doc (bug or abuse) | size cap, zod, refuse to overwrite an invalid stored doc, daily snapshot | a valid but wrong doc from a buggy client: restore from snapshot via import |
| Bad merge wipes progress | pure merge with property tests; attempts never deleted except by reset tombstone; daily snapshots for 180 days; local Dexie keeps all attempts | — |
| R2 credential leak | server-only env, bucket-scoped token, no logging of headers, rotation runbook | access to that bucket until rotated |
| Cost abuse by a looping client or a code holder | per-family rate limit, PUT only when dirty, conditional GET, size cap, billing alert | serverless memory limits are per instance |
| Stored doc made public by a dashboard mistake | private bucket with public access off; operations checklist verifies it | — |

## 8. Cost (free tiers)

Assumption: 2 children, 3 devices, app open 3 hours a day. Per device per open hour: 12 polls (conditional GET, usually `unchanged`) plus about 10 PUTs when the child studies. Month: about 20 000 R2 Class B and 10 000 Class A operations, a few MB stored including 180 days of snapshots. R2's free monthly allowance (1 million Class A, 10 million Class B, 10 GB-month) covers this many times over; Vercel Hobby function invocations stay in the tens of thousands per month. Limits to re-check on the providers' pricing pages at creation time.

## 9. Success criteria

1. On two devices of the same family (two browser contexts in E2E), progress made on one appears on the other within one sync trigger (section done, or reload), with no action by the child.
2. Offline study (network off in E2E) is kept and reaches the cloud after the network returns, with no data lost.
3. Concurrent writes from two devices never lose an attempt, a section completion or a sticker (API test with interleaved clients plus property tests on the merge).
4. A lesson reset on device A stays reset on device B after both sync, while B's study after the reset time is kept.
5. A device of another family, or without a cookie, cannot read or write any doc (API tests: 401, 403, cross-family).
6. Import of a backup file (format v1 or v2) merges into the device without deleting anything newer and is idempotent; its result syncs.
7. No child screen shows sync state; the parent page shows the last sync time and a plain message when stuck.
8. Without R2 env vars the app behaves exactly as today (sync silently off); `pnpm lint && pnpm typecheck && pnpm test && pnpm content:check` green; `src/sync/**` held to the 90% line coverage threshold with the other pure logic.
9. A fresh-agent security review finds no Critical or High issue left open.
10. R2 and Vercel usage after the first week stays in free tiers (owner reads the dashboards).

## 10. Open questions for the owner (with recommendation)

- **Q1. How to name each family in `FAMILY_CODES`?** Recommendation: `<familyId>:<code>` entries, `familyId` a short ASCII slug (`nha-minh`) that never changes. Changing the Vercel variable is an external write you approve. Alternative: a separate `FAMILY_IDS` variable; rejected because two lists can drift.
- **Q2. Parent PIN: keep per device, or move to the server now?** Recommendation: keep it per device in this backlog. Each device asks for its own PIN the first time the parent page opens there; the server PIN (`/api/parent-session`, lock in R2) is its own later backlog. Moving it now doubles the scope and adds a second auth path to review.
- **Q3. Two profiles with the same name after the first sync** (e.g. made separately in Safari and in the Home Screen app). Recommendation: keep both and show them; add a "gộp hai hồ sơ" action on the parent page only if it actually happens. Automatic merge by name could fuse two different children.
- **Q4. Which per-child settings sync?** Recommendation: only `overviewSeen`. The sound switch stays per device (a phone in class may need sound off while the iPad at home has it on).
- **Q5. Daily snapshots in this backlog?** Recommendation: yes (one extra R2 write per child per day, lifecycle rule 180 days), restore by downloading a snapshot with `wrangler` and using the new import button; `pnpm admin restore` waits for the admin CLI backlog.
- **Q6. Cloudflare billing alert.** R2 bills above the free allowance once a payment method is on the account. Recommendation: you add a usage notification in the Cloudflare dashboard at a low amount (e.g. 1 USD) when creating the bucket.
- **Q7. A separate dev bucket for the real-R2 integration test (`pnpm test:r2`)?** Recommendation: yes, `tutor-progress-dev` with its own token kept in `.env.local`, so tests never touch the family's data. Running the test is an external call you approve each time.
- **Q8. Offline precache and `/install`:** Recommendation: a separate backlog after sync ships and has run for a week; sync does not depend on it.
