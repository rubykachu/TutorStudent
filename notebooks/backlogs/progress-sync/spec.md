# Spec: progress sync across devices

Status: planning done, the owner's decisions are recorded (section 10). No code is written for it yet.

Product rules this builds on: `docs/spec.md` sections "Tiến độ và đồng bộ", "Truy cập và bảo mật", "Offline và PWA", "Chiến lược kiểm thử". Where this spec differs from them (family id, PIN, what is synced, one bucket with environment prefixes, restore through the import button), this spec is the newer decision and the build updates `docs/spec.md` to match.

## 1. Objective

The child studies on more than one browser: the iPad in Safari, the same iPad from the Home Screen (iOS keeps a separate IndexedDB for it), a phone, a parent's laptop. Today each one holds its own progress in Dexie and none sees the others. The owner chose "đồng bộ ngầm, học tới đâu lưu tới đó": progress is saved to the family's private cloud storage in the background as the child studies, with no button and nothing for the child to do; any device of the family shows the same profiles, section states, review cards and stickers after its next sync.

Also in scope: an "import backup JSON" button on the parent page, next to the existing export, that merges a backup file (or a restored daily snapshot) into the device; the synced result then reaches every device. Daily snapshots kept 180 days are in scope too.

Who benefits: the child (no lost progress when switching device or reinstalling the Home Screen app), the parent (one report whichever device they open it on, within the attempt-history limit of section 4.3).

Out of scope here (each gets its own backlog when started):

- Offline precache and the `/install` flow (service worker, `@serwist/turbopack`). The child studies at home on wifi, so it waits for its own later backlog. Sync does not depend on it: Dexie keeps everything while the network is down and sync catches up when it returns.
- Moving the parent PIN to the server (`/api/parent-session`), `families.json`, epochs and `pnpm admin`. The PIN stays per device (section 10).
- Syncing the sound switch or any other per-device setting (section 10).
- Deleting a profile (the app has no such action; adding one later needs a profile tombstone).
- AI feedback quota, quick content channel, the public media bucket (all untouched).

## 2. Decisions made by the owner

- Dexie stays the source of truth while offline; every write goes to Dexie first and the UI never waits for the network.
- Storage: Cloudflare R2 on the existing account, reached only through a Vercel API route. One JSON doc per child plus one family profile doc. Never publicly readable.
- One private bucket, `tutor-progress`, for every environment, separated by a key prefix: `prod/` for production, `dev/` for local dev and Vercel preview, `test/<run-id>/` for the optional real-R2 smoke test. One R2 token on that bucket. No separate dev bucket.
- Automated tests use the in-memory store only; the owner tries real R2 by hand with a test profile on a local dev server (`dev/` prefix).
- Auth: the existing family-code session cookie (`tutor_family`, `src/access/session.ts`).
- Protocol: `GET /api/sync` returns `{doc, etag}`; `PUT` sends `{doc, ifMatch}`; the server writes R2 with `If-Match` / `If-None-Match`; on 412 the client merges with the doc returned in the 412 body and retries, at most 3 times.
- Triggers: end of a section or review session, every 5 minutes while the app is open, when the network comes back, when the page becomes hidden (`visibilitychange`).
- Merge: attempts unioned by id; a finished section stays finished; FSRS card, latest review wins; a per-lesson reset tombstone drops records older than the reset.
- Import backup JSON button next to export on the parent page.
- Daily snapshots of each child doc, kept 180 days.
- Parent PIN stays per device. Only the "đã xem tổng quan" flag syncs among settings; the sound switch stays per device.
- Every cost stays inside free tiers.

## 3. Design choices made in this spec

1. **Stable family id from `FAMILY_CODES`.** Today the cookie carries a keyed fingerprint of the code (`codeFingerprint`), which changes when `SESSION_SECRET` or the code changes, so it cannot name a storage folder. Each `FAMILY_CODES` entry gains a name: `nha-minh:abcd-efgh-jkmn`. The parser splits at the first `:` before normalising the code, so the fingerprint of an existing code does not change and cookies already on devices keep working. The server finds the entry whose fingerprint matches the cookie and uses its name as `familyId`.
   - A family may have several entries (one code per device group, or old and new code during a rotation); the same code under two family ids closes the gate with a clear reason, because a cookie must resolve to exactly one family.
   - A family id never changes once data exists: renaming it orphans that family's docs under the old prefix. Rotating a code or the secret makes devices re-enter a code but keeps the data.
   - A bare code without a name still opens the gate but has no sync (the API answers `sync-unavailable`).
   - Every reader of `FAMILY_CODES` goes through the one parser in `src/access/env.ts`, including the deploy smoke check (`scripts/lib/deploy-prod.ts` today takes the first comma-separated entry as the code, which would send `nha-minh:…` and fail).
2. **One family per device; local records stay under `familyId: "local"`.** All hooks use `LOCAL_FAMILY_ID` today. Instead of re-keying every record and every query, the device records which family its local store belongs to (device setting `syncFamilyId`, set at the first successful sync). The conversion between Dexie records and the cloud doc swaps `"local"` for the real `familyId`. A family switch on the device is handled explicitly (section 6.3). Effect: no UI or query changes; cost: a device holds one family at a time, which `docs/spec.md` already requires ("Đổi gia đình trên cùng máy: chặn").
3. **Full-state sync with a content hash, not an operation log or a write counter.** A sync builds the child's doc from Dexie in canonical form (arrays sorted by key, object keys in a fixed order), merges it with the cloud doc, writes the result to both sides, and stores a hash of the doc it sent (`syncState.syncedHash`). The child is "dirty" when the hash of the doc built from Dexie now differs. Why not a counter bumped by Dexie table hooks: a hook runs inside the writer's transaction and can only touch tables in that transaction's scope, so a counter table would have to be added to every write transaction (`recordAttempt` opens `[attempts, cardStates, activityDays]`); a write path that forgets it throws or stays unsynced, and sync's own writes would need a marker the hooks can see. Reading one child's records (a few thousand) and hashing them takes milliseconds per trigger. The hash is a small non-cryptographic one (e.g. 53-bit `cyrb53`), because `crypto.subtle` is missing when the app is opened over plain http on the LAN (the reason `src/progress/parent-crypto.ts` exists); a collision only delays one sync until the next change.
4. **The merge is one pure function, `mergeChildDocs(a, b)`,** commutative, associative and idempotent, used by the client sync, the 412 retry, the apply-back to Dexie and the backup import alike. The server never merges; it only checks and stores. Trimming to the size cap (section 4.3) is a separate step before a PUT, never part of the merge, because a cap inside the merge breaks associativity.
5. **The app clock is corrected by the server clock.** Every response carries `serverTime`. The client keeps `clockOffset = serverTime - Date.now()` in a device setting, and `now()` in `src/lib/time.ts`, the one function every time read already goes through, adds it. So every stored time (attempt `at`, card `lastReviewAt` and `due`, section `updatedAt`, reset tombstones, writings, day keys) uses the corrected clock, not only the reset. The server clamps any timestamp in a PUT that lies more than 10 minutes in its future to its own time, and when it changed anything it returns the stored doc in the 200 body so the client applies exactly what was stored (otherwise the unclamped local copy would win every later merge and the client would re-send forever).
6. **Sync is silent for the child.** No banner, spinner or error on child screens. The parent page shows "Đồng bộ lần cuối" and, when something is stuck, a plain message (e.g. "Máy này chưa gửi được tiến độ từ 3 ngày nay").
7. **One key builder with an environment prefix.** `syncKey` is the only function that builds an object key. Its prefix comes from `syncEnvPrefix(env)`: `prod/` only when `VERCEL_ENV === "production"`, `dev/` in every other case (local dev, `next start` on the laptop, Vercel preview). The optional real-R2 smoke test builds its store with an explicit `test/<run-id>/` prefix through a separate constructor that refuses any prefix not starting with `test/`. No environment variable can choose the prefix directly.

## 4. Doc shapes (versioned)

Both docs are validated by zod schemas in one module (`src/sync/schema.ts`), shared by client and server. Every doc carries `schema` (a literal naming the kind) and `version` (an integer, starting at 1). Times are ISO strings. A doc carries no "last written" time of its own: the server would have to rewrite it on every PUT, which makes the stored doc differ from the one the client merged; R2 keeps `Last-Modified` for that.

### 4.1 Family profile doc, key `<env>/progress/<familyId>/profile.json`

```jsonc
{
  "schema": "tutor-family-profiles",
  "version": 1,
  "familyId": "nha-minh",
  "profiles": [                                  // at most SYNC_MAX_PROFILES (12)
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

Merge: union by `id`; for the same id the later `updatedAt` wins, ties broken by comparing the canonical JSON text so both sides pick the same one. There is no profile deletion in the app today, so no profile tombstone; adding deletion later needs one (noted in the doc's schema comment). The profile cap bounds how many child docs one family code can create.

### 4.2 Child progress doc, key `<env>/progress/<familyId>/<childId>.json`

```jsonc
{
  "schema": "tutor-child-progress",
  "version": 1,
  "familyId": "nha-minh",
  "childId": "3f9c…",
  "attempts":  [ { "id", "exerciseId", "lessonId", "cardIds", "firstTryCorrect", "wrongCount", "at", "context" } ],
  "cards":     [ { "cardId", "lessonId", "due", "stability", "difficulty", "scheduledDays", "learningSteps", "reps", "lapses", "state", "lastReviewAt" } ],
  "sections":  [ { "sectionId", "lessonId", "doneAt": "<time or null>", "position": { "phase", "index" }, "updatedAt" } ],
  "stickers":  [ { "lessonId", "at" } ],
  "activityDays": [ "2026-10-01", "2026-10-02" ],
  "writings":  [ { "id", "exerciseId", "text", "checks", "at" } ],
  "overviewSeen": { "<lessonId>": "<last seen at>" },
  "resets":    { "<lessonId>": "<reset at>" }
}
```

Mapping to Dexie (`src/progress/db.ts`): the records lose `familyId`/`childId` (they are in the doc header).

- Sections: Dexie keeps `state` (every reader uses it) and gains `doneAt`, the time the section was last completed. `completeSection` sets it, `saveSectionPosition` keeps it, the upgrade sets it to `updatedAt` for records already `done`. In the doc a section is done when `doneAt` is set, otherwise in progress; apply-back writes `state` from it. Why two times instead of one state: "the higher state wins" is not ordered by time, so combined with reset tombstones it is not associative (section 6.1).
- `overviewSeen` comes from the `overviewSeen:<lessonId>` settings; the Dexie upgrade turns the stored `true` into `1970-01-01T00:00:00.000Z`, so a reset made anywhere drops an old flag (worst case: the overview shows once more), and new marks store the corrected time.
- `resets` comes from a new Dexie table `lessonResets` written by `resetLessonProgress` in the same transaction as the erase.
- Settings other than `overviewSeen:*` are not synced.

What is not in the doc: the parent PIN and its lock, the active profile, the sound switch, sync bookkeeping (`syncState`, `syncFamilyId`, `clockOffset`).

### 4.3 Size

Estimate for one school year (about 175 study days, one section and one review a day, about 25 answers a day), with today's id lengths (lesson ids around 30 characters, card and exercise ids around 40):

| Part | Count after a year | Bytes each (JSON) | Total |
|---|---|---|---|
| attempts, all | about 4 400 | about 260 | about 1.1 MB |
| attempts kept in the doc | 500 (cap) | about 260 | about 130 KB |
| card states | about 1 000 (80 lessons × 12 cards) | about 230 | about 230 KB |
| sections | about 320 | about 160 | about 50 KB |
| writings | 60 to 100 | 1 to 6 KB (≤ 5 000 characters) | 100 to 400 KB |
| days, stickers, flags, resets | | | under 20 KB |

So: about 0.5 to 0.8 MB at the end of the first year with the attempt cap, and the 1 MB cap is reached during the second school year, because card states, sections and writings are never trimmed. The full attempt log alone would pass 1 MB within one year, which is why the doc keeps only the newest 500 (also `docs/spec.md`). Consequence: a device that pulls a child from the cloud (a new device, a reinstalled Home Screen app) shows study time and answer history for about the last three weeks; the device the child studied on keeps every attempt locally.

Cap: 1 MB of UTF-8 JSON per doc (`SYNC_DOC_MAX_BYTES` in `src/lib/config.ts`). `trimToSize` runs on the merged doc right before a PUT, never inside the merge, in this order until the doc fits:

1. attempts beyond the newest 500, by `(at, id)` (always applied; Dexie keeps every attempt locally);
2. the oldest writings, one at a time.

If it still does not fit, the client does not send, stays dirty and shows the parent page message. The parent page also warns once the doc passes 70% of the cap, so the owner hears about the second-year limit before it bites. The server rejects a body above the cap with 413 regardless.

### 4.4 Schema migration

- Pure `migrateDoc(raw)` lifts any older `version` to the current one, step by step (`v1 -> v2 -> …`), each step with a unit test on a stored sample file in `tests/sync/fixtures/`.
- A client meeting a doc whose `version` is newer than it knows does not merge or write (it would drop fields it does not know). It stays dirty, stops syncing that doc until reload, and the parent page shows "Có bản app mới, mở lại app để đồng bộ".
- The server refuses a PUT whose `version` is lower than the stored doc's (409 `upgrade-required`), so an old tab can never downgrade the doc.
- The Dexie upgrade that adds `lessonResets`, `syncState`, `profiles.updatedAt`, `sectionProgress.doneAt` and timestamped `overviewSeen` is a new `this.version(3)` with an `upgrade` that touches only those fields, like version 2 did for grades.
- The backup file format moves to `PROGRESS_EXPORT_VERSION = 2` (adds `resets`, `overviewSeen` times and section `doneAt`); the importer accepts versions 1 and 2.

## 5. API contract

One route file, `src/app/api/sync/route.ts`, Node runtime, `Cache-Control: no-store` on every response. Target doc by query: `?doc=profile` or `?child=<childId>`; exactly one of the two, `childId` must match `^[0-9a-f]{32}$`.

### `GET /api/sync?doc=profile` | `GET /api/sync?child=<id>`

Optional `&known=<etag>`: when the stored etag equals it, the answer is `{ unchanged: true, etag, serverTime }` without the body (R2 conditional GET, so the 5-minute poll stays cheap). The client always sends `known` when it has an etag: if the cloud doc is unchanged since its last sync, the cloud doc is already contained in the local records, so the merge needs no body.

200: `{ familyId, doc: <doc> | null, etag: string | null, serverTime }`. `doc: null` means nothing stored yet.

### `PUT /api/sync?doc=profile` | `PUT /api/sync?child=<id>`

Body: `{ doc, ifMatch: "<etag>" }` to replace, or `{ doc, ifNoneMatch: "*" }` to create. Exactly one.

200: `{ etag, serverTime }`, plus `doc` (the stored doc) only when the server clamped a timestamp; the client then applies that doc instead of its own.

### Errors (all JSON `{ error: "<code>", … }`)

| Status | `error` | When | Client does |
|---|---|---|---|
| 400 | `invalid` | query or body fails the zod schema, or `doc.familyId`/`doc.childId` differs from the cookie family / query | logs, stays dirty, no retry until next trigger |
| 401 | (from `src/proxy.ts`) | no or bad family cookie, including a cookie whose code was removed from `FAMILY_CODES` | stops syncing, parent page says to re-enter the family code |
| 403 | `origin` | PUT without a same-origin `Origin` header, or GET with `Sec-Fetch-Site` other than `same-origin` | logs |
| 403 | `child` | child PUT for an id absent from the stored profile doc (after a fresh re-read, see step 5) | syncs the profile doc first, then retries once |
| 409 | `upgrade-required` | doc `version` lower than the stored one | stops, "mở lại app" message |
| 412 | `conflict` | `If-Match` / `If-None-Match` failed in R2; body carries the current `{ doc, etag }` | merges with that doc, retries after a short random wait (100 to 500 ms); after 3 failed rounds stays dirty for the next trigger |
| 413 | `too-large` | body above the cap | stays dirty, parent message |
| 429 | `rate` | per-family limit hit; `retry-after` header | waits for the next trigger |
| 500 | `stored-invalid` | the stored doc fails the schema | stays dirty; recovery from a snapshot |
| 503 | `sync-unavailable` | R2 env vars missing, or the cookie's family entry has no name | disables sync for the session, silently |
| 404 | `no-gate` | dev and test servers without `FAMILY_CODES` | disables sync silently (same as the session route) |

### Server steps for a PUT

1. Origin check (shared helper extracted from `src/app/api/session/route.ts` into `src/access/origin.ts`); `content-type: application/json` required.
2. Read the cookie, verify it, resolve `familyId` (section 3, item 1).
3. Rate limit by `familyId`.
4. Read at most `SYNC_DOC_MAX_BYTES` + 4 KB of body (stop reading past it); parse; zod; header ids must match.
5. For a child doc: read the profile doc (cached 60 s per instance) and check the child id is listed. If it is not listed in the cached copy, re-read the profile doc from R2 before refusing: a profile created a moment ago may have been written through another instance.
6. Clamp future timestamps (section 3, item 5).
7. Daily snapshot: if `<env>/snapshots/<familyId>/<childId>/<yyyy-mm-dd VN>.json` does not exist, copy the current stored doc there with `If-None-Match: *` (meaning: the file of day D is the state before the first write of day D). Each instance remembers the days it has already snapshotted, so later PUTs that day skip the check. A failed snapshot is logged and never blocks the write. Lifecycle rules delete `prod/snapshots/` and `dev/snapshots/` after 180 days.
8. `PUT` to R2 with the matching condition; on 412 read the current doc and return it in the 412 body.
9. Never log doc contents; log only route, family id, doc kind, status, byte size.

### Storage adapter

`BlobStore { get(key, { ifNoneMatch? }) -> { body, etag } | { unchanged, etag } | null; put(key, body, { ifMatch? | ifNoneMatch? }) -> { etag } | { conflict }; delete(key) }` (`src/sync/store/`), three adapters:

- `r2` (aws4fetch over the S3 API, new dependency `aws4fetch`, already named in `docs/spec.md` tech stack). ETags are sent back exactly as R2 returned them (quoted); the adapter normalises them in one place;
- `memory` for unit and API tests (simulates ETags and 412); every automated test uses it;
- `fs` (a folder, for the two-device E2E), allowed only when `NODE_ENV !== "production"`, chosen by `SYNC_STORE=fs:<dir>`; production refuses any value but R2.

`delete` exists for the smoke test only and refuses keys outside the store's own `test/` prefix. Keys are built by `syncKey` from the environment prefix and the validated `familyId` and `childId`; no key is ever built from raw request text.

## 6. Merge rules and edge cases

### 6.1 Rules (pure, in `src/sync/merge.ts`)

Applied after `migrateDoc` on both inputs, in two steps:

1. **Tombstones first.** `resets` of the result is the later time per lesson from both sides. Then each side's records of a reset lesson whose time is at or before that lesson's reset are dropped, on each side separately.
2. **Then per key**, over what is left:

| Field | Rule (time compared for the tombstone) |
|---|---|
| `attempts` | union by `id` (`at`). No cap here: the 500 cap is `trimToSize` before a PUT |
| `cards` | per `cardId`, the later `lastReviewAt` wins; equal times: the higher `reps`, then the canonical JSON text (`lastReviewAt`). A card whose card id no longer exists in content stays as it is (orphans are already ignored by review selection) |
| `sections` | per `sectionId`, `doneAt` is the later of the two non-null values (`doneAt`), and `position` comes from the record with the later `updatedAt`, ties by canonical JSON (`updatedAt`). Each field is filtered by its own time, so a completion before the reset is dropped while a position saved after it stays (the section is then in progress) |
| `stickers` | union by `lessonId`, the earliest `at` kept; never dropped by a reset (a reset keeps stickers, as `LESSON_RESET_POLICY` says) |
| `activityDays` | set union, sorted; not touched by a reset |
| `writings` | union by `id` (`at`); a writing is never edited (each submission gets a new id, `src/progress/writing.ts`); its lesson is `lessonIdOfContentId(exerciseId)` |
| `overviewSeen[lessonId]` | the later time wins (`overviewSeen`). Not the earliest: "earliest" combined with the tombstone loses a mark made after the reset |

Why tombstones first and only time-ordered choices: merging records first and dropping afterwards is not associative. Example: device B has a section done at 5, device C has it in progress at 8, device A reset the lesson at 6. Merging B and C first keeps "done at 5", then A's reset drops it and C's position at 8 is lost; merging A and B first keeps C's position. With every choice being "the later time wins" and the tombstone applied to each side first, the result does not depend on the order. Those three docs are a fixed regression case in the tests.

Properties held by tests (property-based over generated docs that include resets, equal timestamps and records on both sides of a reset): `merge(a, b) == merge(b, a)`, `merge(a, merge(b, c)) == merge(merge(a, b), c)`, `merge(a, a) == a`.

**Apply-back** to Dexie runs in one transaction per child. Inside it, it re-reads the child's current local records, merges them once more with the merged doc (safe because the merge is idempotent), writes the result, and deletes local records the tombstones drop. The re-read matters: the child may have answered a question while the request was in flight, and writing the pre-request merge would overwrite that answer's card state or section position. Local attempts beyond the 500 kept in the doc are never deleted by apply-back. Records already deleted locally by a reset never return, because the tombstone travels with them.

### 6.2 Two devices

- Both online, both study: each sync is GET (with `known`), merge, PUT with `ifMatch`. The second writer gets 412 with the first writer's doc, merges, retries. Test: API test with the memory store and two interleaved clients; E2E with two browser contexts.
- Same section open on both: a completion anywhere keeps the section done; the later position wins. A child on device B does not jump mid-section: the section player keeps its in-memory position; the merged position applies on the next open.
- Same card reviewed on both: the later review wins; the other review's attempt is still kept in the attempt log, so the parent report counts both answers.

### 6.3 Offline, family switch, first sync

- **Offline queue:** there is no separate queue; a child whose doc hash differs from `syncState.syncedHash` is the queue. The `online` event, the next 5-minute tick or the next trigger syncs everything at once. Writes made during a sync change the hash again, so they stay dirty.
- **First sync on a device that already has local data** (every device in use today): the profile doc and each child doc are merged with the local records, so nothing local is lost. Profiles with the same name but different ids (the child created "Na" in Safari and again in the Home Screen app) stay two profiles (section 10).
- **Family switch on the same device:** if the cookie's family differs from `syncFamilyId` and the device has unsynced changes, sync stops and the parent page shows "Máy này còn tiến độ chưa gửi của gia đình khác. Tải bản sao lưu trước khi đổi." with the export buttons; nothing is deleted automatically. With no unsynced changes, the parent page offers "Dùng máy này cho gia đình mới" which clears the local store (after a second confirmation) and pulls the new family's docs. Sync never writes one family's records into another family's docs. The same guard catches a code that was moved from one family's entry to another's.
- **Cookie revoked** (code removed from `FAMILY_CODES`): 401, sync stops, local data stays, the child keeps studying on the device until the code is re-entered.

### 6.4 Reset on one device

Device A resets lesson L at time T (corrected clock). The reset writes `lessonResets` in the same Dexie transaction as the erase (closing the gap noted in `src/progress/reset.ts`). On merge, records of L at or before T are dropped everywhere; records of L after T (the child relearning on B after the reset) stay. Stickers and activity days are kept. Test: unit test on merge plus the two-device E2E (reset on A, B still shows L done before syncing, both show L reset after).

Residual, accepted: a card that B reviews after T, before B has synced, starts from B's pre-reset memory state, so that card's schedule carries some of the old progress. The attempt and section rules are not affected.

### 6.5 Clock skew

- Where it matters: reset tombstones (a device clock behind would let old records survive; ahead would drop new records), card `lastReviewAt`, section `updatedAt` and `doneAt`, `overviewSeen`.
- Mitigation: `now()` adds the offset from `serverTime` (section 3, item 5); the server clamps future timestamps to server time + 10 minutes and returns what it stored; ties in card merge broken by `reps`, which only grows between resets.
- Residual risk, accepted: a device that has never synced and has a wrong clock writes uncorrected times until its first sync. The worst case is one card keeping the older of two reviews or a section position going back; no attempt is ever lost (the log is a union).
- Snapshot day keys use Vietnam time from the server clock, never the client's.

### 6.6 Other edge cases

- Same backup imported twice: idempotent merge, no duplicates.
- Backup older than a reset: records before the reset are dropped; the import summary says how many were skipped.
- Doc in storage fails the schema (manual edit, bug): the server answers 500 `stored-invalid` on GET and refuses to overwrite it; the client stays dirty; recovery from the daily snapshot.
- New profile created offline: the profile doc syncs before any of its child docs (the engine orders profile first; a 403 `child` triggers it).
- Two tabs on one device: Dexie is shared; a Web Locks API lock (`navigator.locks`, name `tutor-sync`) lets one tab sync at a time; without the API, the 412 path and the apply-back re-read still keep data safe.
- Page hidden: the hidden trigger starts a normal sync and does not use `keepalive`: a keepalive request body is limited to 64 KB in browsers and a sync needs a GET before the PUT. If iOS suspends the page mid-sync, nothing is lost: the child stays dirty and the next open, `online` or timer catches up.

## 7. Security

### 7.1 Who can read or write what

- A request is authorized for one family: the one whose `FAMILY_CODES` entry matches the cookie. The family id is never read from the query, the body or a header.
- Inside a family, any unlocked device can read and write every child of that family. The family code is the trust boundary, as it is for the gate today; there is no per-child secret. The parent PIN guards only the parent page (and with it the import and reset actions).
- Child docs are writable only for child ids listed in the family's profile doc; the profile doc holds at most 12 profiles.
- Nothing in the private bucket is reachable without the API: bucket public access stays off, no `r2.dev` URL, no custom domain. The public media bucket `tutor-media` is not used for sync.

### 7.2 Request checks

- Origin: PUT requires an `Origin` whose host equals `Host` (same helper as `/api/session`; browsers send `Origin` on every non-GET fetch, same-origin included); GET requires `Sec-Fetch-Site` to be `same-origin` or absent. The cookie stays `SameSite=Lax`, `httpOnly`, `Secure` in production. `vercel.app` is on the public suffix list, so other `*.vercel.app` sites are cross-site and get no cookie on a PUT.
- Body: JSON only (`content-type: application/json`, which also forces a CORS preflight for any cross-origin caller), size capped while reading, strict zod schemas (unknown keys rejected), string lengths bounded (writing text ≤ 5 000 chars, ids by regex), array lengths bounded (profiles ≤ 12).
- Rate limit: per `familyId`, 30 requests per minute per instance, in memory like `src/access/rate-limit.ts`. Serverless instances do not share memory, so this only slows a runaway client; the real cost guard is the size cap plus a Cloudflare usage notification.
- Writing text is shown by React as text; nothing from a doc is ever rendered as HTML.

### 7.3 Credentials (Vercel environment, Production only, Sensitive)

| Variable | Value |
|---|---|
| `R2_ACCOUNT_ID` | Cloudflare account id (builds the S3 endpoint) |
| `R2_ACCESS_KEY_ID` | access key of the app's R2 token |
| `R2_SECRET_ACCESS_KEY` | secret of that token |
| `R2_PRIVATE_BUCKET` | `tutor-progress` |
| `FAMILY_CODES` | existing variable, entries become `<familyId>:<code>` |

- One R2 API token with "Object Read & Write" applied to the bucket `tutor-progress` only. R2 API tokens can be limited to named buckets ("Apply to specific buckets only" when the token is created). It never touches `tutor-media` (uploads to it keep using the separate rclone token in `docs/operations.md`), and an object-level token cannot change bucket settings such as public access or lifecycle rules.
- Prefix scoping is not available for a static token: R2 limits tokens per bucket, not per key prefix (prefix-limited credentials exist only as short-lived temporary credentials, which a static env var cannot hold). So the same token, kept in Vercel Production and in the owner's `.env.local`, can technically write `prod/`. Code is the only guard: `syncKey` derives the prefix from `VERCEL_ENV` (section 3, item 7), and a unit test proves that no other environment produces a `prod/` key. Residual risk, accepted by the owner: a local file that sets `VERCEL_ENV=production` (for example a production `vercel env pull`) would point a local server at production data. The runbook in `docs/operations.md` forbids pulling the production environment into a local file. To confirm in the Cloudflare dashboard when the token is created.
- None of these is `NEXT_PUBLIC_*`; a test fails if any `R2_*` name appears in client bundles (`.next/static` grep after build).
- Preview deployments get no R2 variables (preview already serves 503 without `FAMILY_CODES`); if they ever do, they write under `dev/`.
- Rotation: create a new token, update the two Vercel variables and `.env.local`, redeploy, delete the old token. Written into `docs/operations.md`.

### 7.4 Personal data

The docs hold exactly what Dexie already holds: the child's display name and avatar, grade, answers, review state, writings. No email, birth date, photo, location or device identifier is added. Logs carry family id, doc kind, status and size, never doc content. The new fact for the owner: the name and writings now also live in the family's private R2 bucket (Cloudflare, encrypted at rest). Test profiles the owner creates under `dev/` are in the same bucket; deleting them is a manual step in the dashboard.

### 7.5 Threat model

| Threat | Mitigation | Residual |
|---|---|---|
| Stranger without the code reads or writes progress | `src/proxy.ts` 401 on every API without a valid cookie; unlock rate limit; codes ≥ 10 random chars | none known |
| One family reads another family's docs | family id only from the cookie; keys built by `syncKey`; one code maps to one family; API test "cross-family → 403/404" | none known |
| A code moved from one family's entry to another | family switch guard on the device (`syncFamilyId`); operations rule: never reuse a code | a device with no local data would open the other family |
| CSRF from another site | `SameSite=Lax` cookie, Origin check on PUT, JSON content type, `Sec-Fetch-Site` on GET | none known |
| A family device is lost or shared | remove that device group's code from `FAMILY_CODES` (data stays under the same family id) | the device keeps its local Dexie copy |
| Oversized or malformed doc (bug or abuse) | size cap, profile cap, zod, refuse to overwrite an invalid stored doc, daily snapshot | a valid but wrong doc from a buggy client: restore from snapshot via import |
| Bad merge wipes progress | pure merge with property tests; attempts never deleted except by reset tombstone; daily snapshots for 180 days; local Dexie keeps all attempts | — |
| Local or preview server writes production data | environment prefix from `VERCEL_ENV` in the one key builder; unit test; smoke test confined to `test/` | the token is bucket-wide, so a wrongly set `VERCEL_ENV` locally reaches `prod/` |
| R2 credential leak | server-only env, bucket-scoped token, no logging of headers, rotation runbook | access to the whole bucket (every environment) until rotated |
| Cost abuse by a looping client or a code holder | per-family rate limit, PUT only when dirty, conditional GET, size cap, profile cap, usage notification | serverless memory limits are per instance |
| Stored doc made public by a dashboard mistake | private bucket with public access off; operations checklist verifies it | — |

## 8. Cost (free tiers)

Assumption: 2 children, 3 devices, app open 3 hours a day. Per device per open hour: 12 polls (conditional GET, usually `unchanged`) plus about 10 PUTs when the child studies.

- R2: about 20 000 Class B and 10 000 Class A operations a month, a few MB stored including 180 days of snapshots. The free monthly allowance (1 million Class A, 10 million Class B, 10 GB-month) covers this many times over.
- Vercel Hobby: function invocations stay in the tens of thousands a month (the proxy runs before each sync request too) against 1 million. A request or response body may be at most 4.5 MB, well above the 1 MB doc cap. A sync request needs well under a second, far below the function time limit. Data through functions: a doc of 0.5 MB sent about 30 times a day per child and pulled by the other devices is on the order of 1 GB a month for two children, inside the Hobby transfer allowance but the largest item; the parent page's doc size line and the first-week dashboard check watch it. Hobby is for personal, non-commercial use, which this family app is.
- Limits to re-check on the providers' pricing pages when the bucket is created.

## 9. Success criteria

1. On two devices of the same family (two browser contexts in E2E), progress made on one appears on the other within one sync trigger (section done, or reload), with no action by the child.
2. Offline study (network off in E2E) is kept and reaches the cloud after the network returns, with no data lost.
3. Concurrent writes from two devices never lose an attempt, a section completion or a sticker (API test with interleaved clients plus property tests on the merge).
4. A lesson reset on device A stays reset on device B after both sync, while B's study after the reset time is kept.
5. A device of another family, or without a cookie, cannot read or write any doc (API tests: 401, 403, cross-family).
6. Import of a backup file (format v1 or v2) merges into the device without deleting anything newer and is idempotent; its result syncs.
7. No child screen shows sync state; the parent page shows the last sync time and a plain message when stuck.
8. Without R2 env vars the app behaves exactly as today (sync silently off); `pnpm lint && pnpm typecheck && pnpm test && pnpm content:check` green; `src/sync/**` held to the 90% line coverage threshold with the other pure logic.
9. No key outside `prod/` is written by production, and no key under `prod/` by any other environment (unit test on `syncKey`).
10. A fresh-agent security review finds no Critical or High issue left open.
11. R2 and Vercel usage after the first week stays in free tiers (owner reads the dashboards).

## 10. Owner decisions on the open questions

Each question as asked during planning, and the answer. "Theo đề xuất" marks an answer that adopts the planning recommendation.

- **Q1. How to name each family in `FAMILY_CODES`?** `<familyId>:<code>` entries, `familyId` a short ASCII slug (`nha-minh`, `^[a-z0-9-]{3,32}$`) that never changes (theo đề xuất). Changing the Vercel variable is an external write the owner makes. A separate `FAMILY_IDS` variable was rejected because two lists can drift.
- **Q2. Parent PIN: per device or on the server?** Stays per device. Each device asks for its own PIN the first time the parent page opens there. The server PIN (`/api/parent-session`, lock in R2) is a later backlog.
- **Q3. Two profiles with the same name after the first sync** (made separately in Safari and in the Home Screen app): keep both and show them (theo đề xuất). A "gộp hai hồ sơ" action on the parent page comes only if it actually happens; an automatic merge by name could fuse two different children.
- **Q4. Which per-child settings sync?** Only the "đã xem tổng quan" flag (`overviewSeen`). The sound switch stays per device.
- **Q5. Daily snapshots in this backlog?** Yes, kept 180 days. Restore: download the snapshot from the dashboard or with `wrangler`, then use the new import button; `pnpm admin restore` waits for the admin CLI backlog.
- **Q6. Cloudflare usage notification.** The owner adds a usage notification in the Cloudflare dashboard at a low amount (e.g. 1 USD) when creating the bucket (theo đề xuất).
- **Q7. Bucket for real-R2 tests.** No separate dev bucket: one bucket `tutor-progress` with `prod/`, `dev/` and `test/<run-id>/` prefixes and one token (section 2, section 3 item 7). Automated tests use the in-memory store; an optional real-R2 smoke test runs only with the owner's approval and only under its own `test/` prefix. Local dev uses the same bucket under `dev/`.
- **Q8. Offline precache and `/install`?** A later, separate backlog; out of scope here, since the child studies at home on wifi.

## 11. Questions still open for the owner

- **Attempt history on other devices.** With the 500-attempt cap, a device that pulls a child from the cloud shows about three weeks of study time and answer history (section 4.3). Keep the cap, or add a small per-lesson and per-day summary to the doc so the parent report stays complete on every device?
- **Second school year.** The 1 MB cap is reached during the second year (section 4.3). Accept for now (the parent page warns at 70%), or plan a compact encoding or a per-grade doc split before then?
