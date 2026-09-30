# Bài phep-cong-phep-tru: narration and videos to review

Media made on 01/10/2026 with skill `lesson-video`. `lesson.json` was changed by the pipelines (`overview.narration`, `videos[]`) and by three video blocks placed first in their sections, so `pnpm content:check` reports `[review-hash]` until the review below resets `reviewedHash`. Ids of the three videos are not yet in `content/ids.lock.json` (`pnpm content:lock` refuses to run while the hash is stale).

## Voice

`video/projects/phep-cong-phep-tru/media.json`: `"voice": "my-duyen"` (female, VieNeu preset "Mỹ Duyên"). Why: the lesson is patient step-by-step arithmetic (shopping sums, column subtraction, finding a missing term) for a child who is wary of computation, which suits the warm voice; every published lesson so far uses "Hải Đăng", so a different voice also breaks the monotony the owner raised. The overview narration and all three videos use it.

## To review (fresh subagent, diff-only round of `lesson-review`)

- `video/projects/phep-cong-phep-tru/media.json`
- `video/projects/phep-cong-phep-tru/ghep-tron/{script.json,index.html}` (section `ghep-tron`, card `ghep-tron`, 34 + 268 + 66 and 27 + 45 + 55)
- `video/projects/phep-cong-phep-tru/dat-tinh-tru/{script.json,index.html}` (section `dat-tinh-tru`, card `dat-tinh-tru`, 532 − 247)
- `video/projects/phep-cong-phep-tru/tim-so-hang/{script.json,index.html}` (section `tim-so-hang`, card `tim-so-hang`, ? + 35 = 82 and ? + 18 = 60)
- Overview narration: `public/media/narration/phep-cong-phep-tru/overview.{m4a,vtt}`; videos: `public/media/video/phep-cong-phep-tru/{ghep-tron,dat-tinh-tru,tim-so-hang}.{mp4,vtt,jpg}`; Whisper transcripts and match rates: `video/projects/phep-cong-phep-tru/*/renders/report.json`.
- `content/math/kntt/phep-cong-phep-tru/lesson.json`: `overview.narration`, `videos[]`, the video block at the start of the three sections.

Known points for the reviewer: Whisper writes "nghìn đồng" as ".000 đồng" (and "ba" as "3"), so sentences with prices score 88–94 % although the audio says the words; the overview's first sentence scored 89 % for the same reason. Listen to those sentences. Durations: 78 s, 90 s, 84 s.

## After the review

`pnpm content:lock`, then `pnpm lesson:walk phep-cong-phep-tru`, then archive this folder.
