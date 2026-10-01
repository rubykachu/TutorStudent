---
description: Conventions for lesson content, its schema and lint
paths:
  - "content/**"
  - "src/content/**"
  - "src/schema/**"
  - "src/visuals/**"
  - ".claude/skills/lesson-*/**"
---

# Content conventions

- Layout: `content/<subject>/<series>/<slug>/lesson.json` (plus `review.md`, and `source-passage.txt` for subjects with `rules.verbatimPassage`). Per-subject settings exist only in `content/subjects.json`; nothing in code names a subject.
- Published ids never change. Retire one in `content/ids.lock.json`; `pnpm content:lock <lesson>...` adds the new ids of the named lessons (without names: every lesson, skipping any whose review hash is stale); agents always name their lesson.
- Editing a published lesson changes its review hash, so `content:check` fails until a review approves it again (`pnpm content:hash <lesson> --approve`, run by `lesson-review`). Generated narration metadata (`overview.narration`: audio and caption paths, the voice that read it) is left out of the hash, so `pnpm narration:build` never needs a new review. Rounds from 3 review only what `pnpm content:diff <lesson>` shows.
- A `note` with `rule: true` is a rule sentence: the section recap repeats it word for word, and any recap sentence close to it must be identical. A `group` with `guide: "<interaction>"` teaches that interaction before the first exercise that uses it, in this lesson or an earlier one.
- `choice` exercises with computable options carry `check` (`relation`: `equal`, `notEqual`, `max`, `min`, `holds`, `fails`); subjects with `rules.checkExpr` need `check.expr` on every `numeric`. Lint recomputes all options, so a distractor that also satisfies the prompt fails.
- Every gradable exercise of a new lesson carries `explain` (why the answer is right; at most 3 sentences, optional `tex`, `visualId`, and for `choice` a one-sentence `wrong` reason per tempting option). `content/legacy-lessons.json` lists the lessons written before that rule: `"exempt"` is never asked, `"warn"` gets one warning counting the exercises still without `explain`; delete a lesson from the file once its explanations are done, and never add one to silence the lint. A published lesson without `overview` fails the lint unless it is listed there.
- Tips: a `tip` block is one screen of a section; `content/<subject>/<series>/<slug>/tips.json` holds more tips for a lesson, published or not, without touching `lesson.json` (its hash, videos and narration stay). The tips file has its own `status` and `reviewedHash`: review it with `lesson-review`, then `pnpm content:hash <lesson> --tips --approve`; editing it afterwards fails `content:check` until approved again. Tip ids (`<lesson>.tip.<name>`) are locked with the lesson's other ids. A trick must hold for every input of its problem type; the reviewer tests it.
- Wording, number format and sentence length rules apply to subjects with `language: "vi"`.
- Never copy textbook text or pictures, except verbatim reading passages with their source. `sources/` is never committed.
- Before authoring or reviewing, read `docs/lessons-learned/index.md`. A reviewer who finds a Nghiêm trọng error already listed there bumps its count and adds the example; a new kind gets a new entry.
