# Plan: progress sync across devices

Spec: `spec.md` in this folder. Tasks with acceptance criteria and commands: `task.md`.

## Overview

Build sync from the inside out: pure schema and merge first (no I/O, fully unit-tested), then the server route over a swappable storage adapter (memory, folder, R2), then the client engine that reads Dexie, calls the route and writes the merge back, then the parent page pieces (import button, last-sync line), then the R2 adapter, the security review and the rollout steps the owner approves. Every slice leaves the app working: with no R2 variables set, sync stays silently off and the app behaves as today, so code can be committed and even deployed before any bucket exists.

## Architecture decisions

- Per child one small main doc with state only, plus append-only history docs per month for answers and writings, with no cap on history (`spec.md` sections 4.2 to 4.4). A new device studies as soon as the main doc arrives and loads history in the background, newest first.
- Full-state docs; dirty means a doc built from Dexie hashes differently from the last one sent; only months with unsent records are pushed. No operation log and no counter bumped by Dexie hooks (`spec.md`, "Design choices", item 3).
- Local records keep `familyId: "local"`; the device remembers which family it belongs to (item 2). No hook or query changes in child screens.
- One pure merge used by sync, 412 retry, apply-back and import (item 4); tombstones applied to each side first, every choice ordered by time. History docs merge by plain union; reset tombstones hide history at read time and never rewrite an old month. Nothing is trimmed.
- The app clock `now()` carries the server clock offset, so every stored time is corrected (item 5).
- Storage behind `BlobStore` with `memory`, `fs` (E2E only) and `r2` adapters. One bucket `tutor-progress`; `syncKey` is the only key builder and adds the environment prefix (`prod/` only when `VERCEL_ENV` is `production`, `dev/` otherwise, `test/<run-id>/` for the smoke test) (item 7). One route `/api/sync` serves all three doc kinds (`month` query for history).
- Family id from named `FAMILY_CODES` entries, parsed in one place that the deploy smoke check also uses (item 1).
- New module `src/sync/` for everything sync-specific; `src/progress/` only gains the Dexie upgrade, the reset tombstone and section `doneAt`; `src/lib/time.ts` gains the clock offset.

## Dependency graph

```
 schema + migrate (src/sync/schema.ts)
        |
        +-----------------------------+
        v                             v
 merge + visibleHistory        Dexie upgrade: lessonResets, syncState,
        |                      profiles.updatedAt, section doneAt,
        |                      overviewSeen times
        |                             |
        |                             v
        |                      reset tombstone, corrected now(),
        |                      dirty by doc hash
        |                             |
        |                             v
        |                      Dexie <-> doc conversion (src/sync/local.ts)
        |                             |
 family id from FAMILY_CODES          |
 + origin helper (src/access)         |
        |                             |
        v                             |
 BlobStore memory + fs, syncKey       |
        |                             |
        v                             |
 /api/sync route (GET, PUT,           |
 412, snapshot, limits)               |
        |                             |
        +--------------+--------------+
                       v
              client sync engine (src/sync/engine.ts)
                       |
                       v
              triggers + mount (timers, online, hidden,
              section end, review end, Web Locks)
                       |
                       v
              history pull on a new device (newest month first)
                       |
          +------------+-------------+
          v                          v
  parent page: last sync,     import backup JSON
  family switch guard         (merge + summary)
          |                          |
          +------------+-------------+
                       v
            multi-device E2E (fs store)
                       |
                       v
            R2 adapter (mocked fetch); optional smoke under test/<run-id>/ (owner approves each run)
                       |
                       v
            security review (fresh agent, covers the adapter)
                       |
                       v
            docs: spec, architecture, operations
                       |
                       v
 [owner] bucket + token + lifecycle + env vars + FAMILY_CODES names
         -> local try with a test profile (dev/) -> deploy -> smoke on 2 devices
                       |
                       v
       later, own backlog: offline precache + /install
```

## Slices

Each slice is a vertical, demoable step. Tasks in `task.md` carry the same order.

### Slice 1: merge core (pure)

Schema with versions for profile, main and month docs, `migrateDoc`, `mergeChildDocs`, `mergeProfileDocs`, `mergeHistoryDocs`, `visibleHistory`. Property tests for commutative, associative, idempotent merge over docs with resets and equal timestamps; the fixed counterexample of `spec.md` section 6.1; filtering history before or after a merge gives the same result; clock tie-breaks. Demo: `pnpm test tests/sync`.

### Slice 2: local side

Dexie upgrade (with section `doneAt`), tombstone written by `resetLessonProgress`, corrected `now()`, dirty detection by doc hash, a `SYNC_POLICY` table classifying every Dexie table so a new table fails typecheck like `LESSON_RESET_POLICY` does, Dexie to main and month docs and back with the apply-back re-read. Demo: unit tests with `fake-indexeddb` show a reset produces a tombstone, a doc round-trip loses nothing and an answer given during a sync survives the apply-back.

### Slice 3: server

Family id resolution (and the deploy smoke check reading named entries), origin helper extracted from the session route, `BlobStore` memory and fs adapters, `syncKey` with the environment prefix, `/api/sync` GET and PUT for profile, main and month docs with conditional writes, 412 body, size caps, append-only check on months, rate limit, snapshot of the main doc, `sync-unavailable` without env. Demo: API tests with the memory store (two interleaved clients, cross-family, origin, too large); `curl` against a local gate server with `SYNC_STORE=fs:…`.

### Slice 4: client engine and triggers

Engine, in two commits: first one doc's cycle (GET with `known`, merge, PUT, 412 retry up to 3 with a random wait, apply-back), then the orchestration (profile doc first, then each child's dirty months, then its main doc, `syncState`, clock offset, family guard). Then the background history pull for a new device and the parent page's loading line. Triggers: 5-minute timer, `online`, `visibilitychange` hidden (normal fetch, no `keepalive`), section end (`completeSection` call site), review end, one tab at a time via Web Locks. Demo: two browser windows on a local gate server with the fs store.

### Checkpoint A (after slices 1 to 4)

Owner can try sync locally on two browsers against the fs store, no cloud involved. Gate green, coverage held.

### Slice 5: parent page

Import backup JSON button next to the export (file picker, validation, preview, merge, summary), last sync time, stuck messages and the doc size warning, family switch guard. UI files: `src/components/parent/*`; coordinate with the agent working on media players, brand and bottom bar (no overlap expected, but check `git status` first).

### Slice 6: verification

Multi-device E2E on a second gate dev server with the fs store (like the unlock E2E server in `e2e/targets.ts`): progress, offline, reset, import, other family, no jump mid-section, a new device that studies before history loads and then shows the full history, reset hiding old answers on the new device.

### Slice 7: R2 adapter and security review

R2 adapter with aws4fetch, unit-tested against a mocked fetch. Optional `pnpm test:r2` smoke against the real bucket under `test/<run-id>/`, run only on the owner's approval. Then a fresh-agent security review of the whole diff, adapter included.

### Checkpoint B

Owner reviews the E2E evidence and the security review result before any production step.

### Slice 8: docs and rollout

Docs updates (`docs/spec.md`, `docs/architecture.md`, `docs/operations.md` env table, bucket and lifecycle setup, token runbook, restore procedure). Then the owner-approved external steps: bucket and token, a local try with a test profile under `dev/`, deploy, and a production smoke on two real devices.

### Later, separate backlog: offline precache and `/install`

Serwist service worker, precache of app shell, published lesson JSON, visual chunks, fonts; the `/install` flow for iOS Home Screen. Out of scope here: the child studies at home on wifi, and sync does not depend on it.

## External writes (owner approval each time, never run by an agent on its own)

| Step | What | Where in `task.md` |
|---|---|---|
| Private bucket | create `tutor-progress`, public access off, no custom domain, lifecycle rules `prod/snapshots/` and `dev/snapshots/` 180 days, `test/` 1 day, usage notification | Task 20 |
| R2 token (the only one) | Object Read & Write on `tutor-progress` only; into Vercel Production and the owner's `.env.local` | Task 20 |
| Local try with a test profile | local gate server with `.env.local`, writes under `dev/` | Task 20 |
| Run `pnpm test:r2` (optional) | real R2 calls under `test/<run-id>/`, deletes only there | Task 17 |
| Vercel env vars | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PRIVATE_BUCKET` (Production, Sensitive); `FAMILY_CODES` rewritten as named entries | Task 20 |
| Deploy | `pnpm deploy:prod` per `docs/operations.md` | Task 20 |

Committing code with sync off is not an external write and can happen at every task.

## Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| R2 conditional PUT behaves differently from the memory adapter | lost update | memory adapter written to the same contract test; the optional `pnpm test:r2` smoke and the owner's local try check `If-Match` and `If-None-Match` on real R2 before rollout |
| Local or preview server writes production data (one bucket, one token) | family data overwritten | prefix from `VERCEL_ENV` in `syncKey` only, unit test; runbook forbids pulling the production environment into a local file; snapshots |
| Apply-back overwrites an answer given during the request | lost card state or position | apply-back re-reads and merges inside its transaction; unit test |
| Merge bug wipes progress on every device | high | property tests; attempts only removed by tombstones; daily snapshots; local Dexie keeps all attempts; rollout watched on two devices first |
| Dexie upgrade fails on an existing iPad | app unusable on that device | upgrade only adds tables and fields; test opens a version-2 database built from a fixture and upgrades it |
| Applying the merge while the child is mid-section moves them | confusing jump | player keeps its in-memory position; merged position applies on next open (E2E checks) |
| Rate limit per instance is weak | cost | size cap, PUT only when dirty, conditional GET, billing alert |
| Another agent editing UI at the same time | merge conflicts | sync touches only `src/components/parent/*` and one call site each in `section-player.tsx` / `review-player.tsx`; check `git status` before those tasks; commit only own paths |
| Duplicate profiles from before sync | parent confusion | shown as two; merge tool only if it happens |
| Main doc grows with lessons opened | sync stops for that child near 1 MB, about three grades away | parent page warns at 70%; archive a finished grade's cards then |
| A new device pulls many months at once | rate limit hits, slow history | one month per request, paced, newest first; child never waits for it |

## Open questions

All planning questions are answered in `spec.md` section 10; none is open.
