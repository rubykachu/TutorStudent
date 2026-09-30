# Opening line for videos built before the rule

Every video now opens with a flagged greeting (`"opening": true`, first sentence of the first scene) after a 1 s lead-in; see skill `lesson-video`. Nine videos predate the rule and are listed in `openingExempt` of their lesson's `video/projects/<lesson>/media.json`:

- `luy-thua`: `chia-cung-co-so`, `luy-thua-la-gi`, `nhan-cung-co-so`
- `neu-cau-muon-co-mot-nguoi-ban`: `ai-dang-noi`, `bi-mat-cua-cao`, `cam-hoa-la-gi`
- `tap-hop`: `tap-hop-la-gi`, `thuoc-khong-thuoc`
- `thu-tu-thuc-hien-phep-tinh`: `hoa-don`, `hon-hop`, `ngoac-long`

The lead-in already exists for all of them (`PAUSE.leadIn`, 1 s); only the greeting sentence is missing.

## Retrofit one video

1. Add the greeting as the first sentence of the first scene of `script.json` (`"opening": true`, says "bạn" and what the video is about, at most 15 words) and, in `index.html`, a title that holds the screen during it (see `video/projects/phep-cong-phep-tru/*/index.html`).
2. Remove the video's name from `openingExempt` in `media.json`.
3. `pnpm video:build <lesson> <name>`: only the new sentence is synthesized (every other sentence is a cache hit), the render takes about 40 s. Durations grow by about 3 s; clip times shift, so the build rewrites `videos[]` of the lesson.
4. `pnpm video:check`; look at frames around the opening.
5. The lesson needs a diff-only review round (fresh subagent) because `videos[]` changes the review hash.

Why deferred: each retrofit changes a published lesson's hash and needs its own review round; the owner asked for the videos already made to stay as they are until the owner decides.
