# Plan: in-app feedback ("Góp ý")

Spec: `spec.md` in this folder. Tasks with acceptance criteria, commands and files: `task.md`.

## Overview

Build from the inside out, like progress sync: pure pieces first (schema, sanitizer, issue formatter, label names), then the server route over the existing `BlobStore` with a fake GitHub, then the client (outbox, button, child sheet), then the parent form behind the PIN, then E2E, docs, the security review, and last the steps that write outside this machine. Every slice leaves the app working: with no `GITHUB_FEEDBACK_TOKEN` the route still stores reports in R2 (or the folder store in tests), and before the UI slice nothing calls the route at all, so any slice can be committed on its own.

## Architecture decisions

- New module `src/user-feedback/` (the word "feedback" alone already means answer feedback in `src/exercises/`). Route `src/app/api/feedback/route.ts` only wires the service to the environment, like `/api/sync`.
- Reuse, do not copy: `sameOrigin`, `resolveFamily`, `readAccessConfig`, `RequestLimiter`, `hmacSign` (`src/access/`); `openSyncStore`, `readSyncStoreConfig`, `syncKey`, `syncEnvPrefix` (`src/sync/store/`); the capped body reader of `src/sync/server.ts` and the `clientKey` of `api/session/route.ts` move to shared helpers in `src/access/` (one copy each).
- `syncKey` gains the `feedback` and `feedback-pending` kinds; no other code builds a key.
- Store first, forward after the answer (`after()`), pending list in one R2 object with conditional writes, retry on the next report (`spec.md` section 9).
- Client outbox in the existing `settings` table under `DEVICE_SCOPE`; no Dexie version bump.
- Parent free text only behind the existing per-device PIN; the PIN entry is extracted from `pin-gate.tsx` into a reusable `PinPrompt`.
- Constants (limits, repo name, timeouts) only in `src/lib/config.ts`.

## Dependency graph

```
 schema + config + keys (T1)
    |            \
    v             v
 sanitize +     family pseudonym, app SHA,
 issue format   device class (T3)
 + labels (T2)       |
    |                |
    +--------+-------+
             v
     GitHub client (T4)
             |
             v
  feedback service: admit, store, limits, log (T5)
             |
             v
  forwarding + pending + after() (T6) --> route + bundle-check + env (T7)
                                               |
                         +---------------------+
                         v
              client send + outbox + runner (T8)
                         |
                         v
           child button + sheet on every screen (T9)
                         |
                         v
               parent form behind PIN (T10)
                         |
          +--------------+---------------+
          v              v               v
       E2E (T11)   deploy SHA (T12)   docs (T13)
          \              |               /
           +-------------+--------------+
                         v
              security review (T14)
                         |
                         v
     owner token (T15, owner) --> rollout (T16, external writes)
```

## Slices and checkpoints

### Slice 1: pure core (T1, T2, T3)

Schema, constants, key kinds, sanitizer, title/label/body formatter, label shortening, pseudonym, device class. No I/O, no route. Unit tests carry the hostile-input cases and the body snapshot.

### Slice 2: server (T4, T5, T6, T7)

GitHub client over an injected `fetch`, the service over the memory and folder stores, forwarding and the pending list, the route file, `bundle-check` and `.env.example`. Tests in `tests/api/feedback-*.test.ts` use a fake GitHub; `pnpm test` never reaches the network.

**Checkpoint A (owner, short):** the owner reads one rendered example issue body (printed by the snapshot test into the task notes) and the label list, and confirms. Nothing has been sent anywhere.

### Slice 3: child UI (T8, T9)

Outbox and sender, `FeedbackOutboxRunner`, `FeedbackButton` and the sheet with chips and thank-you, wired into `PlayerHeader`, `PageTopBar`, the overview header. Component tests; `pnpm lesson:walk` on one lesson to check the header still fits on the phone target.

### Slice 4: parent form (T10)

`PinPrompt` extracted, parent form with radio reasons and the note, session reuse.

**Checkpoint B (owner):** screenshots of the sheet on iPad and phone (child chips, thank-you, PIN step, parent form), from the E2E run or `pnpm dev`. The owner approves the copy and layout.

### Slice 5: E2E, deploy SHA, docs (T11, T12, T13)

`e2e/user-feedback.spec.ts` on the gated server with the folder store and a fake GitHub on localhost; `deploy:prod` passes `APP_COMMIT_SHA`; `docs/spec.md`, `docs/architecture.md`, `docs/operations.md` (env table, "Góp ý từ app" with the triage loop and the token rotation), `README.md` if it lists env names.

### Slice 6: security review (T14)

Fresh Opus agent, read-only over the diff of slices 1 to 5. Critical and High findings are fixed before rollout, each with a test.

**Checkpoint C (owner):** the owner reads the review and approves the rollout.

### Slice 7: rollout (T15, T16): writes outside this machine

| Step | Who | External write |
|---|---|---|
| Create the fine-grained token, paste it into `.env.production.local` | owner, by hand | GitHub account setting |
| Add R2 lifecycle rules `prod/feedback/` 365 days, `dev/feedback/` 30 days | owner, Cloudflare dashboard | yes |
| `vercel env add GITHUB_FEEDBACK_TOKEN production --sensitive` from `.env.production.local` | agent, only after the owner says go for this step | **yes (Vercel env)** |
| `pnpm deploy:prod --ref <verified sha>` | agent, only after the owner says go for this release | **yes (deploy)** |
| One real report from production, check the issue, close it as a test | agent or owner, with go-ahead | yes (GitHub issue) |

The token is set in Vercel before the deploy, so the pending list starts empty. No step pushes the TutorStudent repo; pushing stays a separate owner decision.

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `after()` work cut short by the platform's time limit | a report stays pending longer | the report is already stored; pending list retries on the next report |
| GitHub silently drops labels the token cannot set | issues without labels | the label step creates labels first; the rollout check confirms labels on the real issue |
| Fine-grained token expires | forwarding stops, reports pile up in pending | expiry date in `docs/operations.md`, triage loop checks pending, rotation runbook |
| Child taps chips for fun | noisy issues | per-family limits, "Đã gửi" per item and reason, triage groups and counts |
| Header crowding on the phone | layout overlap | `lesson:walk` and the E2E layout check on the phone target; label text hidden below `md` |
| Pending list contention | a lost id in the list | conditional writes with 3 rounds; the record itself still says `pending`, so a lost id is visible in R2 |

## Open questions

None for the owner: every open choice has a recommendation marked **(theo đề xuất)** in `spec.md` (parent flow, offline outbox, retry path, titles from the client, pseudonym key, extra hidden fields, retention, no `feedback:list` wrapper). The owner can overturn any of them before slice 1 starts.
