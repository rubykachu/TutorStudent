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
- Wording, number format and sentence length rules apply to subjects with `language: "vi"`.
- Never copy textbook text or pictures, except verbatim reading passages with their source. `sources/` is never committed.
- Before authoring or reviewing, read `docs/lessons-learned/index.md`. A reviewer who finds a Nghiêm trọng error already listed there bumps its count and adds the example; a new kind gets a new entry.
