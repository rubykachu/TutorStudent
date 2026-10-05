# Spec: in-app feedback ("Góp ý")

Status: planned, no app code yet. The owner's decisions are in section 2; every other choice is marked **(theo đề xuất)** with its reason and can be changed before the build starts. The private issue repo `rubykachu/owlyeah-feedback` exists with its labels, issue form and README (section 7.4).

Builds on: `docs/spec.md` sections "Tiến độ và đồng bộ" (R2 store, key builder), "Truy cập và bảo mật" (family cookie, Origin check, parent PIN), "Offline và PWA" (network status, nothing stored by the worker under `/api`). The build updates `docs/spec.md`, `docs/architecture.md` and `docs/operations.md` to match this file (task list, docs task).

Naming: in the code, "feedback" already means the answer feedback of an exercise (`src/exercises/feedback.ts`, `useFeedbackSounds`, `e2e/feedback-layout.spec.ts`). This feature lives in `src/user-feedback/` and its tests in `tests/user-feedback/` and `e2e/user-feedback.spec.ts`, so the two never mix. The route keeps the owner's name `/api/feedback`; the later AI review of open-ended writing, listed in `notebooks/backlogs/index.md` as `/api/feedback`, takes `/api/writing-review` instead **(theo đề xuất)**.

## 1. Objective

The child and the parent can say, from the screen they are on, that something in a lesson is hard, wrong, broken, too long, or liked. Each report reaches the owner as a GitHub issue in a private repo, with the exact lesson, section and item, so an agent can group the reports, fix the content through the lesson pipeline and close them with the commit. Nothing is lost when GitHub or the network is down, the child never sees an error, and no report carries a child's name, a family code or a profile name.

Who benefits: the owner (real signal on which items confuse the learner described in `docs/learner.md`), the child (a voice in one tap), the parent (a way to point at a wrong answer with a note).

Out of scope: replying to the sender in the app; screenshots or recordings; feedback on screens outside a lesson (home, profiles, parent page); a server-side parent session; an admin page for feedback; a scheduled job (section 9.3 says when to add one).

## 2. Decisions made by the owner

- A "Góp ý" action on lesson and exercise screens, usable by the child and the parent.
- Child: quick reason chips only, very simple, big targets.
- Parent: the same reasons plus an optional note of at most 500 characters.
- Reasons and labels: Khó hiểu `ly-do:kho-hieu`; Sai nội dung hoặc đáp án `ly-do:sai-noi-dung`; Hình hoặc video bị lỗi `ly-do:loi-hinh-video`; Dài quá, chán `ly-do:dai-chan`; Hay, bé thích `ly-do:thich`.
- Flow: the app POSTs `/api/feedback` (family cookie, Origin check, rate limit per family and per IP, strict zod). The server stores the report in the private bucket `tutor-progress` first, through the key builder, then creates an issue in a private GitHub repo with a fine-grained token `GITHUB_FEEDBACK_TOKEN` (Issues read and write on that repo only), set in Vercel. Token missing or GitHub failing: the report stays queued in R2 and is forwarded later. The child always sees a friendly thank-you.
- Issue title `[Góp ý] <Lý do> · <Bài title> · <Phần n>`; labels `feedback`, `nguon:be` or `nguon:phu-huynh`, `ly-do:*`, `bai:<slug>`, `mon:<subject>`, `lop:<grade>`, `trang-thai:moi`; body: a readable part (Lý do, Người gửi, Bài/Phần/Câu, Ghi chú) and a hidden `<!-- feedback-data {json} -->` block with `v`, `lesson`, `section`, `item`, `screen`, `reason`, `source`, `app` (deploy SHA), `device` (coarse kind and OS), `family` (salted HMAC of the family id), `at` (Asia/Ho_Chi_Minh).
- No child names, family codes or profile names anywhere. The note is sanitized (no markdown or HTML injection, no `@` mentions) and capped at 500 characters.
- Repo: private, `rubykachu/owlyeah-feedback`.

## 3. UX

### 3.1 Where the button lives

One shared button, `FeedbackButton` (`src/user-feedback/feedback-button.tsx`): an icon button (lucide `MessageCircleHeart`, 48 × 48 px, `min-h-touch`), with the word "Góp ý" next to the icon from the `md` breakpoint up and as `aria-label="Góp ý về bài này"` everywhere. It sits at the right end of the top row, just left of the sound switch, on:

| Screen | Where | `screen` | `section` / `item` sent |
|---|---|---|---|
| Lesson page (list of parts) `app/(child)/lessons/[lessonId]/lesson-screen.tsx` | `PageTopBar`, new optional `feedback` prop | `lesson` | none / none |
| Overview `learn/lesson-overview.tsx` | right end of its `<header>` | `overview` | none / none |
| Tips page `lessons/[lessonId]/tips/tips-screen.tsx` | `PageTopBar` | `tips` | none / none |
| Section player, every step `learn/section-player.tsx` | `PlayerHeader`, new optional `feedback` prop | `block`, `exercise` or `recap` from the step kind; `done` on the section's end screen | section id and number / the step's scoped id (card, exercise, video or tip id) when it has one, else none; `step` = `<phase>-<index>` |
| Review player `learn/review-player.tsx` | `PlayerHeader` | `review` | the exercise's section / the exercise id |

While the child looks back at an earlier screen ("Quay lại"), the context is the screen shown, not the one reached. Grades, subject, home, profile and parent screens get no button (`PageTopBar` without the prop draws nothing new). The button never changes the exercise state: opening and closing the sheet keeps the input, the wrong count and the timers as they were.

### 3.2 Child flow

1. Tap "Góp ý": the existing `Sheet` opens (bottom sheet on a phone, centred panel on the iPad), label "Góp ý về bài này", title "Bạn thấy chỗ này thế nào?".
2. Five chips, one tap each, in this order, as big buttons (at least 64 px tall, full width on a phone, two columns from `md`, icon plus text, text at `text-block`):
   - `CircleHelp` "Khó hiểu"
   - `TriangleAlert` "Sai nội dung hoặc đáp án"
   - `ImageOff` "Hình hoặc video bị lỗi"
   - `Hourglass` "Dài quá, chán"
   - `Heart` "Hay, bé thích"
3. One tap sends (no second "Gửi" step for the child) and the sheet turns into the thank-you: the owl (`happy`), "Cảm ơn bạn! Cú đã ghi lại rồi." and one button "Học tiếp" that closes it; it also closes by itself after 3 seconds (not with reduced motion: then it waits for the tap). The thank-you is the same whether the report was sent, queued or refused (section 8).
4. Back on the screen, the same reason for the same item cannot be sent again while the screen stays open: its chip shows "Đã gửi" and is disabled; other reasons stay open.

Sounds: the chips use the normal button press; the thank-you plays nothing extra. The background music rules do not change (the sheet opens on learning screens, which play none).

### 3.3 Parent flow (theo đề xuất)

Recommended: **"Phụ huynh góp ý" behind the existing parent PIN, inside the same sheet.** Under the chips sits a small secondary link "Phụ huynh góp ý kèm ghi chú".

- The parent session is open (the PIN was entered less than `PARENT_SESSION_MINUTES` ago, `parentSessionRemainingMs > 0`): the sheet switches to the parent form at once.
- Otherwise the sheet asks the PIN with the same field and lock-out as `/parent` (`tryUnlock` from `src/progress/parent-pin.ts`; the PIN entry of `components/parent/pin-gate.tsx` is extracted into a reusable `PinPrompt`). A right PIN opens the parent session, exactly as `/parent` does, and shows the form.
- No PIN set on this device: the sheet says "Đặt PIN ở trang phụ huynh để góp ý kèm ghi chú." with a button to `/parent`. Free text is never offered without a PIN.
- Parent form: the five reasons as a radio group (same labels), "Ghi chú (không bắt buộc)" textarea with helper "Tối đa 500 ký tự. Đừng ghi tên bé hay thông tin cá nhân.", a live counter `n/500` (the field stops at 500), and "Gửi góp ý" (disabled until a reason is picked). Thank-you: "Đã gửi. Cảm ơn bạn đã góp ý!".

Why this one and not a note field with a "Tôi là phụ huynh" toggle: a toggle lets the child type free text (names, school, anything) that would land in a GitHub issue; the PIN keeps every free-text report adult-written, reuses a gate the family already knows, and costs the parent nothing when they came from `/parent` within 30 minutes. `source` stays a claim of the client (the PIN is per device and never reaches the server); it only picks a label and never grants anything.

### 3.4 Accessibility

- The sheet is the existing `Sheet` (dialog semantics, focus on its close button, Escape and backdrop close). The chips are `<button>`s with visible text; the parent reasons are a `radiogroup` with a `legend`.
- Every target at least 48 px (`min-h-touch`); the chips 64 px. Colours from the design tokens only, so contrast follows `docs/design-system.md`.
- The thank-you is a `role="status"` region, so a screen reader hears it; focus moves to "Học tiếp".
- The note has a `<label>`, the counter is announced politely only at 450 and 500 characters.
- Motion: the sheet's own animation already follows `usePrefersReducedMotion`; the thank-you's auto-close is off under reduced motion (step 3 above).

### 3.5 Offline (theo đề xuất)

Recommended: **queue on the device and send when online**, not a disabled button. The child studies offline sometimes (offline is on in production) and "the button does nothing offline" would be an error the child sees.

- Every report gets its `id` (`newId()`, 32 hex) on the device and goes into an outbox first: one Dexie row in the existing `settings` table under `DEVICE_SCOPE`, key `feedbackOutbox`, value a list of pending reports (at most `FEEDBACK_OUTBOX_MAX` = 20; a new one past the cap drops the oldest). No new table and no Dexie version bump; `settings` rows under `DEVICE_SCOPE` are already per device and never synced (`src/sync/policy.ts`), and `LESSON_RESET_POLICY` already keeps them.
- The outbox is sent right after each new report, on the `online` event and when the child layout mounts (`FeedbackOutboxRunner`, mounted next to `SyncRunner`, draws nothing). One send at a time; reports go oldest first.
- Answer handling: 2xx removes the report; 4xx other than 429 removes it too (it will never pass) and logs nothing on the device; 429, 5xx and network errors keep it. A report older than `FEEDBACK_OUTBOX_MAX_AGE_DAYS` = 7 is dropped.
- The same `id` sent twice is stored once (section 5.2), so a retry after a lost answer never makes two issues.
- The service worker already leaves `/api/*` to the network, so nothing changes there.

## 4. API contract

`POST /api/feedback`, `content-type: application/json`, body at most `FEEDBACK_BODY_MAX_BYTES` = 4096 bytes (read with a cap like `readCapped` in `src/sync/server.ts`; that helper moves to a shared place instead of being copied). Strict zod object (`.strict()`, unknown keys refused):

```json
{
  "id": "9f0c…32 hex",
  "lesson": "luy-thua",
  "lessonTitle": "Bài 6. Lũy thừa với số mũ tự nhiên",
  "subject": "math",
  "grade": 6,
  "section": "luy-thua.section.nhan-hai-luy-thua",
  "sectionNumber": 3,
  "sectionTitle": "Nhân hai lũy thừa cùng cơ số",
  "item": "luy-thua.ex.tinh-nhanh",
  "step": "check-2",
  "screen": "exercise",
  "reason": "sai-noi-dung",
  "source": "phu-huynh",
  "note": "Đáp án câu b in sai dấu",
  "device": { "kind": "ipad", "os": "ios" },
  "createdAt": "2026-10-05T13:15:00.000Z"
}
```

| Field | Rule |
|---|---|
| `id` | `/^[0-9a-f]{32}$/` (the format of `newId()`) |
| `lesson` | `LessonIdSchema` |
| `lessonTitle`, `sectionTitle` | 1 to 120 characters, display only (below) |
| `subject` | one of the subject ids of `content/subjects.json` (imported, so a new subject needs no code change) |
| `grade` | integer in `GRADES` |
| `section` | `SectionIdSchema` starting with `<lesson>.`, or null |
| `sectionNumber` | integer 1 to 99, null exactly when `section` is null |
| `item` | a card, exercise, video or tip id (the scoped-id schemas of `src/schema/content.ts`) starting with `<lesson>.`, or null |
| `step` | `<phase>-<index>` with `<phase>` from `SECTION_PHASES` (`src/progress/enums.ts`: `blocks`, `check`, `practice`, `recap`) and an index of 0 to 999, built from that list rather than a copied pattern; or null |
| `screen` | `lesson`, `overview`, `tips`, `block`, `exercise`, `recap`, `done`, `review` |
| `reason` | `kho-hieu`, `sai-noi-dung`, `loi-hinh-video`, `dai-chan`, `thich` |
| `source` | `be` or `phu-huynh` |
| `note` | allowed only with `source: "phu-huynh"`; at most 500 characters after NFC; absent or empty means none |
| `device` | `kind` in `ipad`, `phone`, `desktop`; `os` in `ios`, `android`, `macos`, `windows`, `other`. Computed on the device by a pure `deviceClass` next to `src/install/platform.ts` (it reuses its iPad-as-Mac rule `isIos` with `maxTouchPoints`), never a raw user agent |
| `createdAt` | ISO time; only kept for the record, the issue uses the server time |

The server adds `app`: the deployed commit, read from `APP_COMMIT_SHA` (first 7 characters), which `pnpm deploy:prod` passes to the deployment with `vercel deploy --prod --env APP_COMMIT_SHA=<sha>` because it already resolves the exact SHA it ships **(theo đề xuất)**; unset (local dev, tests) it is `dev`. Vercel's own `VERCEL_GIT_COMMIT_SHA` is not relied on, since the deploy goes through the CLI from a temporary worktree, not through a git integration.

Titles come from the client **(theo đề xuất)**: the server has no lesson catalog at run time (lessons are emitted for the browser, not bundled with the route), and adding one costs a generated file in every build. A title is display text only: ids, labels and the hidden block are built from validated ids, and the title passes the plain-text sanitizer (section 6.3), so the worst a hostile family can do is a wrong-looking title in a private repo. If that ever matters, the upgrade is a build-time catalog generated by `content:emit`.

Checks, in this order (same order and helpers as `/api/sync`):

1. `sameOrigin(request)` (`src/access/origin.ts`), else 403 `origin`.
2. Media type `application/json`, else 400 `invalid`.
3. Gate: `readAccessConfig()`; `closed` 503 `unavailable`, `open` 404 `no-gate` (local dev without the gate has no family, like sync).
4. Cookie: `resolveFamily(...)`, else 401 `unauthorized`. The family id comes only from the cookie.
5. Store configured (`openSyncStore(readSyncStoreConfig())`), else 503 `feedback-unavailable`.
6. Rate limits (section 10), else 429 `rate` with `retry-after`.
7. Body cap 413 `too-large`, JSON and schema 400 `invalid`.
8. Store (section 5), then 202 `{ ok: true }`; the same `id` again: 200 `{ ok: true, duplicate: true }`.
9. Forwarding to GitHub runs after the answer is sent (`after()` from `next/server`, documented in `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/after.md`), so the child never waits on GitHub.

Every answer is JSON with `cache-control: no-store`. An exception answers 500 `server` and logs as in section 6.4.

## 5. Storage in R2

### 5.1 Keys

`src/sync/store/keys.ts` stays the only key builder; `SyncKeyTarget` gains two kinds:

```
<prefix>feedback/<yyyy-mm>/<id>.json     one report (month of the server's Vietnam time)
<prefix>feedback/pending.json            ids of reports not yet on GitHub
```

`<prefix>` is `prod/` only when `VERCEL_ENV=production`, else `dev/` (unchanged rule, `syncEnvPrefix`). The family id is not in the key.

### 5.2 Report record

```json
{
  "schema": "feedback",
  "version": 1,
  "id": "9f0c…",
  "receivedAt": "2026-10-05T20:15:03+07:00",
  "family": "a1b2c3d4e5f6",
  "app": "5fc3656",
  "report": { "...": "the validated request, note already sanitized" },
  "forward": { "state": "pending", "attempts": 0, "lastError": null, "issue": null, "url": null }
}
```

- Written with `ifNoneMatch: "*"`: a second write of the same id is a conflict, answered as `duplicate` and never overwrites.
- `forward.state` is `pending` or `sent`; after a success it holds `issue` (number) and `url`, written with `ifMatch` on the record's etag.
- `lastError` is a short code (`no-token`, `github-401`, `github-5xx`, `timeout`, `labels`), never a message or a body.

### 5.3 Pending list

`pending.json` is `{ "schema": "feedback-pending", "version": 1, "items": [{ "id", "month" }] }`, oldest first, at most `FEEDBACK_PENDING_MAX` = 500 items. Changed only with conditional writes (`ifMatch`, or `ifNoneMatch: "*"` when missing) and up to 3 rounds on conflict, like the sync cycle. The `BlobStore` contract has no listing, and this keeps it that way.

### 5.4 Retention (theo đề xuất)

The owner adds two lifecycle rules to `tutor-progress` (Cloudflare dashboard, external step in the rollout task): delete `prod/feedback/` objects after 365 days and `dev/feedback/` after 30 days. `pending.json` is rewritten on every change, so it does not expire while in use. GitHub issues are kept (they hold no personal data, section 6), and the owner may delete closed issues older than a year.

## 6. GitHub issue

### 6.1 Repo, token, request

- Repo: `FEEDBACK_REPO = "rubykachu/owlyeah-feedback"` in `src/lib/config.ts` (one place).
- Token: `GITHUB_FEEDBACK_TOKEN`, server only, read by `src/user-feedback/github.ts`; added to the server-only names of `scripts/bundle-check.ts` and to `.env.example` (name only).
- `POST https://api.github.com/repos/<repo>/issues` with `authorization: Bearer <token>`, `accept: application/vnd.github+json`, `x-github-api-version: 2022-11-28`, `user-agent: owlyeah-feedback`, timeout `FEEDBACK_GITHUB_TIMEOUT_MS` = 8000. No retry inside a request; the pending list is the retry.
- Labels that may not exist yet (`bai:*`, `mon:*`, `lop:*`) are created first with `POST /repos/<repo>/labels`; 201 and 422 `already_exists` both count as done; each instance remembers the names it has ensured. The fixed labels were created with the repo; the server does not recreate them.

### 6.2 Title, labels, body

Title: `[Góp ý] <Lý do> · <lessonTitle> · Phần <sectionNumber>`, the last part left out when there is no section. Example: `[Góp ý] Sai nội dung hoặc đáp án · Bài 6. Lũy thừa với số mũ tự nhiên · Phần 3`. At most 256 characters (the lesson title is cut first).

Labels, in this order:

| Label | Colour | Created |
|---|---|---|
| `feedback` | `0E8A16` | with the repo |
| `nguon:be` / `nguon:phu-huynh` | `FBCA04` / `D93F0B` | with the repo |
| `ly-do:kho-hieu`, `ly-do:sai-noi-dung`, `ly-do:loi-hinh-video`, `ly-do:dai-chan`, `ly-do:thich` | `1D76DB`, `B60205`, `5319E7`, `C5DEF5`, `0E8A16` | with the repo |
| `bai:<slug>` | `F9D0C4` | by the server on first use |
| `mon:<subject id>` (`mon:math`) | `BFDADC` | by the server on first use |
| `lop:<grade>` (`lop:6`) | `D4C5F9` | by the server on first use |
| `trang-thai:moi` | `EDEDED` | with the repo |

Further status labels for triage, created with the repo: `trang-thai:dang-xu-ly` `FEF2C0`, `trang-thai:da-sua` `0E8A16`, `trang-thai:khong-sua` `BFD4F2`, `trang-thai:trung` `CFD3D7`.

GitHub limits a label name to 50 characters, and some slugs are longer (`hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can` is 53). `lessonLabel(slug)` (pure, tested) returns `bai:<slug>` when it fits, else `bai:<first 39 characters of the slug>-<6 hex of SHA-256 of the slug>` (exactly 50). The hidden block always has the full slug, and the triage loop groups by it, not by the label.

Body template (exact; `{…}` are filled in, lines in `[…]` appear only when the value exists):

````markdown
**Lý do:** {reason label}
**Người gửi:** {Bé | Phụ huynh}
**Bài:** {lessonTitle} (`{lesson}`)
[**Phần:** {sectionNumber}. {sectionTitle} (`{section}`)]
[**Câu / màn:** {screen label} · `{item}`]
[**Ghi chú:**
```text
{note}
```]

<sub>Gửi từ app bản `{app}` · {device label} · {at, dd/mm/yyyy HH:mm}</sub>

<!-- feedback-data {"v":1,"id":"…","lesson":"…","section":"…","item":"…","step":"…","screen":"…","reason":"…","source":"…","app":"…","device":{"kind":"…","os":"…"},"family":"…","at":"2026-10-05T20:15:03+07:00"} -->
````

- Screen labels: `lesson` "Trang bài", `overview` "Giới thiệu bài", `tips` "Mẹo hay", `block` "Thẻ / video", `exercise` "Câu hỏi", `recap` "Tóm tắt", `done` "Màn kết thúc phần", `review` "Ôn tập". Without an item the line shows only the screen label.
- The hidden block holds the owner's fields plus `id` (to find duplicates) and `step` (to place a screen without an id) **(theo đề xuất)**. Null fields are written as `null`, so every key is always present. The note is not in the hidden block: it is the only free text and stays in its fenced block.
- `v` is 1. A change of the block's shape raises it, and the triage loop reads every version it knows.

### 6.3 Sanitizing

All in `src/user-feedback/sanitize.ts`, pure, tested with hostile inputs:

- `plainText(text, max)` for `lessonTitle` and `sectionTitle`: NFC; control characters and line breaks become spaces; keeps letters and marks (Unicode), digits, spaces and `.,:;()/'–-`; drops everything else (so no `` ` `` `*` `_` `[` `]` `<` `>` `#` `@` `!` `|` `~`); collapses spaces; trims; cuts to `max`.
- `noteText(text)` for the note: NFC; removes control characters except line breaks; at most 5 lines in a row of text are kept with single blank lines between paragraphs (3 or more line breaks become 2); `@` becomes `＠` (full-width, never a mention); `<` and `>` become `‹` and `›`; backticks become `'`; links stay as text (inside a fenced block they are not clickable); cut to 500 characters. It is then placed only inside the ```` ```text ```` fence above, so no markdown or HTML in it renders.
- The hidden JSON is `JSON.stringify` of validated values with every `<`, `>` and `&` written as `<`, `>`, `&`, so `-->` can never close the comment early.

### 6.4 Logging

One JSON line per failed request or failed forward, like `SyncLogEntry`: `route`, `status`, `event` (`stored`, `forward-failed`, `pending-full`, `exception`), `id` (the report id, random, not personal), `detail` (`github 502`, `R2 500 InternalError`, error name). Never the family id or hash, the note, titles, the body or the token. A missing token is logged once per instance: `feedback forwarding is off: GITHUB_FEEDBACK_TOKEN not set`.

## 7. Security and privacy

### 7.1 Data minimization

Stored and sent: ids of content, the reason, who sent it (child or parent, as a claim), coarse device class, the deploy SHA, server time, a family pseudonym, and the parent's optional note. Not stored or sent: family id, family code, cookie, child or profile names, profile ids, IP address (only held in memory by the rate limiter), user agent, answers or progress.

Family pseudonym **(theo đề xuất)**: the first 12 hex characters of HMAC-SHA256(`SESSION_SECRET`, `"feedback-family:" + familyId`), through `hmacSign` in `src/access/hmac.ts`. The prefix keeps it apart from the cookie's own uses of that key, and no new secret has to be managed. Changing `SESSION_SECRET` changes every family's pseudonym from then on; that only splits old and new reports of one family, which grouping can live with. A dedicated `FEEDBACK_HASH_SECRET` is the upgrade if pseudonyms must survive a cookie key change.

### 7.2 Nghị định 13/2023/NĐ-CP notes

Not legal advice; the owner confirms the rules in force (the Personal Data Protection Law of 2025, in force from 01/01/2026, builds on the decree).

- Children's data gets the strictest treatment. The child's report holds no personal data of the child: no name, no profile, no answers; the family pseudonym and device class identify a household at most, and only together with the server key. Free text, the one place personal data could enter, is limited to the parent behind the PIN.
- Purpose limitation: reports are used only to fix lesson content and app bugs. The parent page's privacy line (component `progress-location.tsx` or a new line beside it) adds one sentence: "Góp ý gửi tới người làm app để sửa bài, không kèm tên bé hay mã gia đình."
- Cross-border transfer: GitHub stores data in the US, and the R2 bucket's location is set by Cloudflare. Keeping issues free of personal data is the main control; the note helper text and the sanitizer support it.
- Retention: section 5.4. Deletion on request: the owner finds a family's reports by computing its pseudonym on a trusted machine and deletes the R2 records and the issues; no tool for this until someone asks.

### 7.3 Threats and controls

| Threat | Control |
|---|---|
| Report sent from another site (CSRF) | Origin check, `SameSite=Lax` cookie, JSON media type |
| Strangers posting | Family cookie required; revoked families refused by `resolveFamily` |
| Flooding the repo or the bucket | Limits in section 10; GitHub forwards capped per hour per instance; body capped at 4 KB |
| Markdown, HTML, mention or link injection into the issue | Section 6.3; the note only inside a fence; hidden JSON escaped |
| Label injection | Labels built only from validated enums and slugs |
| Token leak | Server-only variable, fine-grained to one repo and Issues only, never logged, `bundle-check` fails a build whose browser files name it; rotation runbook in `docs/operations.md` |
| Token missing or GitHub down | Report stored first, pending list, later forward |
| Duplicate issues after a lost answer | Client id plus `ifNoneMatch: "*"`; issue `id` in the hidden block for the rare duplicate when the record update after a created issue fails |
| Path traversal in keys | Keys only from `syncKey` with patterned parts |

### 7.4 The repo (done)

`rubykachu/owlyeah-feedback`, private, owner `rubykachu`, created 2026-10-05. Has the 13 fixed labels above, `.github/ISSUE_TEMPLATE/feedback.yml` (form "Góp ý (nhập tay)" with the same fields) and a `README.md` on the auto-fill, labels and hidden block. Its README points to `docs/operations.md`, section "Góp ý từ app", which the docs task writes.

## 8. Failure modes

| Case | Child sees | Server does |
|---|---|---|
| Offline or network error | thank-you | nothing; the outbox keeps the report |
| 429 | thank-you | report kept in the outbox, retried later |
| 400, 401, 403, 404, 413 | thank-you | nothing stored; the outbox drops it |
| R2 down (500) | thank-you | 500 `server`, logged; the outbox retries |
| Token not set | thank-you | stored, added to pending, logged once per instance |
| GitHub 401 or 403 (bad or expired token) | thank-you | stored, pending, `forward-failed github-401` logged each time |
| GitHub 5xx or timeout | thank-you | stored, pending |
| Label creation fails | thank-you | the issue is created without the failing label; `labels` logged |
| Pending list full (500) | thank-you | report stored, not added, `pending-full` logged; the triage loop's check (section 11) catches it |
| Record update after issue creation fails | thank-you | the issue exists; the report stays pending and may become a second issue later, which triage marks `trang-thai:trung` |

## 9. Forwarding and retry (theo đề xuất)

### 9.1 Chosen: retry on the next report

After each stored report (in `after()`):

1. Forward this report.
2. On failure: add it to the pending list.
3. On success and when the pending list is not empty: forward up to `FEEDBACK_RETRY_PER_REQUEST` = 10 pending reports, oldest first; each success updates its record and leaves the list. Stop at the first failure (GitHub is likely still down).

All forwarding goes through one function `forwardReport(store, prefix, id, month)`, so the new report and the retries share one path.

### 9.2 Why not the other options

- A `pnpm feedback:flush` script on the owner's machine would have to write under `prod/` from a laptop, which the sync design forbids on purpose (only a Vercel production deployment writes `prod/`; `docs/operations.md`).
- A Vercel cron needs a public path past the family gate, a `CRON_SECRET` and one more moving part, for a queue that is empty almost all the time.

### 9.3 Ceiling and upgrade

Pending reports wait until someone sends the next one. With the token set before the first deploy (rollout task), the list fills only during a GitHub outage, and a family studying daily sends feedback often enough. The triage loop checks the pending count (section 11). Add a daily Vercel cron calling the same `forwardReport` if reports sit pending for more than a few days.

## 10. Abuse limits

All in `src/lib/config.ts`, counted in memory per instance with the existing `RequestLimiter` (`src/access/rate-limit.ts`), so they slow a runaway client and are not a shared quota:

| Limit | Value |
|---|---|
| Per family | 10 reports per 10 minutes and 40 per Vietnam day |
| Per IP (`x-forwarded-for` first entry, the `clientKey` of `api/session/route.ts`, moved to `src/access/` and shared) | 20 per 10 minutes |
| GitHub issues created per instance | 30 per hour; over it, reports wait in pending |
| Body | 4096 bytes |
| Note | 500 characters |
| Outbox on the device | 20 reports, 7 days |
| Pending list | 500 ids |

The per-family day limit uses its own `RequestLimiter` with a one-day window.

## 11. Agent triage loop

How a future agent turns open issues into fixes. The docs task copies this into `docs/operations.md`, section "Góp ý từ app", which is the durable home; this section is the design.

1. **Read open reports** with the rubykachu token (multi-account rule: never the active account):

   ```bash
   GH_TOKEN="$(gh auth token -u rubykachu)" gh issue list \
     --repo rubykachu/owlyeah-feedback --state open --label feedback --label trang-thai:moi \
     --limit 200 --json number,title,labels,body,createdAt \
     | jq '[.[] | {number, createdAt, labels: [.labels[].name],
         data: (.body | capture("<!-- feedback-data (?<j>.*) -->").j | fromjson)}]'
   ```

   Reading is not a write, but the token prefix stays so the account is never guessed.
2. **Group** by `data.lesson`, then by `data.item` (or `data.step` when the item is null), then by `data.reason`. Count reports per group, keep the parent notes, drop duplicates with the same `data.id`. `ly-do:thich` groups are a signal, not a fix.
3. **Propose** one fix per group, in a backlog `notebooks/backlogs/feedback-<yyyy-mm-dd>/task.md` (the existing pattern for owner feedback): `sai-noi-dung` checks the item against the source pages first and is a content fix; `kho-hieu` and `dai-chan` are wording, split or pacing changes; `loi-hinh-video` goes to the visual or the video. The owner approves the list before content changes, as for any lesson change.
4. **Run the lesson pipeline** for each approved fix: `lesson-author` (or `lesson-visual`, `lesson-video`), then a fresh `lesson-review` subagent, `content:check`, the usual gate, a commit per lesson. Mark the issues `trang-thai:dang-xu-ly` while working:

   ```bash
   GH_TOKEN="$(gh auth token -u rubykachu)" gh issue edit <n> --repo rubykachu/owlyeah-feedback \
     --remove-label trang-thai:moi --add-label trang-thai:dang-xu-ly
   ```

5. **Close with the commit** once the fix is committed (and deployed, if the issue says the child sees it in production):

   ```bash
   GH_TOKEN="$(gh auth token -u rubykachu)" gh issue close <n> --repo rubykachu/owlyeah-feedback \
     --reason completed --comment "Đã sửa trong <short sha>: <one line>"
   GH_TOKEN="$(gh auth token -u rubykachu)" gh issue edit <n> --repo rubykachu/owlyeah-feedback \
     --remove-label trang-thai:dang-xu-ly --add-label trang-thai:da-sua
   ```

   No fix: `trang-thai:khong-sua` with the reason, `--reason "not planned"`. Duplicate: `trang-thai:trung` and a link to the kept issue. The commit message names the issues (`Feedback: rubykachu/owlyeah-feedback#12, #15`).
6. **Check the queue**: the owner looks at `prod/feedback/pending.json` in the Cloudflare dashboard when triaging; a non-empty list older than a few days means the token expired or the cron upgrade of section 9.3 is due.

Commenting, labelling and closing issues are writes to GitHub: the agent runs them only in a session where the owner asked for triage. A `pnpm feedback:list` wrapper around step 1 is not built **(theo đề xuất)**: the one command above is enough; add the wrapper when grouping needs more than `jq`.

## 12. Success criteria

- On the iPad and phone E2E targets, the button shows on the lesson page, overview, tips page, every section step and the review player, and on no other child screen.
- A child report is one tap after opening the sheet; the thank-you shows on success, on 4xx, on 5xx and offline.
- With the folder store and a fake GitHub, a report is stored under `dev/feedback/<yyyy-mm>/<id>.json` and an issue request carries exactly the title, labels and body of section 6 (snapshot test of the body).
- Sending the same `id` twice stores one record and makes one issue.
- Without the token the report is stored and pending; with the token the next report forwards it.
- Hostile notes and titles (markdown links, images, HTML, `-->`, `@user`, backticks, 10 000 characters, control characters) produce a body where nothing renders outside the fence and the hidden JSON parses back to the same values.
- No log line holds a note, title, family id, pseudonym or token (test over the logger).
- `pnpm build` fails when a browser file names `GITHUB_FEEDBACK_TOKEN`.
- No request leaves localhost in tests and E2E (as for sync).
- After rollout, one real report from production appears in `rubykachu/owlyeah-feedback` with the right labels and the deployed SHA in `app`.
